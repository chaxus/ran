/**
 * A minimal ZIP reader and rewriter with no dependencies.
 *
 * ZIP is the container behind OOXML (docx/xlsx/pptx), EPUB, ODF and browser extensions, so
 * "read one file out of this archive" and "patch one file inside this archive" come up
 * constantly. A full ZIP library is a large dependency for that; the whole of the format
 * these tasks need is the central directory plus DEFLATE, and DEFLATE now ships in the
 * platform as `DecompressionStream`.
 *
 * Scope, stated plainly:
 * - **Reads** STORED (method 0) and DEFLATE (method 8) entries. Other methods are reported
 *   but their data cannot be extracted.
 * - **Writes** rewritten and injected entries as STORED — no recompression. The output is
 *   larger than the input, which is the right trade for a patch-and-hand-off pipeline and
 *   the wrong one for archiving.
 * - **No ZIP64.** Archives over 4 GiB, or with more than 65535 entries, are out of scope.
 * - **No encryption**, no multi-disk archives.
 *
 * Everything is `Uint8Array` in, `Uint8Array` out; nothing here touches the DOM.
 */

const LOCAL_HEADER_SIGNATURE = 0x04034b50;
const CENTRAL_HEADER_SIGNATURE = 0x02014b50;
const EOCD_SIGNATURE = 0x06054b50;

const LOCAL_HEADER_SIZE = 30;
const CENTRAL_HEADER_SIZE = 46;
const EOCD_SIZE = 22;

/** The EOCD record is 22 bytes plus a comment of at most 65535 bytes. */
const MAX_EOCD_SEARCH = EOCD_SIZE + 0xffff + 1;

/** Compression methods this module understands. */
export const ZIP_STORED = 0;
export const ZIP_DEFLATE = 8;

const u16 = (buffer: Uint8Array, offset: number): number => buffer[offset]! | (buffer[offset + 1]! << 8);

const u32 = (buffer: Uint8Array, offset: number): number =>
  (buffer[offset]! | (buffer[offset + 1]! << 8) | (buffer[offset + 2]! << 16) | (buffer[offset + 3]! << 24)) >>> 0;

/** CRC32 lookup table (IEEE polynomial), built once at module load. */
const CRC32_TABLE = /* @__PURE__ */ (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  return table;
})();

/**
 * @description: CRC32 checksum (IEEE 802.3 polynomial), the one ZIP stores per entry.
 * Returned as an unsigned 32-bit number.
 * @param {Uint8Array} data
 * @return {number}
 */
export const crc32 = (data: Uint8Array): number => {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = (CRC32_TABLE[(c ^ data[i]!) & 0xff] ?? 0) ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

/**
 * @description: Decompress raw DEFLATE bytes (no zlib or gzip wrapper) — the form ZIP
 * stores entries in — using the platform's `DecompressionStream`.
 *
 * Note the format: `'deflate-raw'`, not `'deflate'`. The latter expects a zlib header that
 * ZIP entries do not carry, and feeding it entry bytes fails with an opaque
 * `TypeError`.
 *
 * @param {Uint8Array} data raw DEFLATE bytes
 * @return {Promise<Uint8Array>} the decompressed bytes
 * @throws when `DecompressionStream` is unavailable or the data is corrupt
 */
export const inflateRaw = async (data: Uint8Array): Promise<Uint8Array> => {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('DecompressionStream is not available in this runtime');
  }
  const stream = new DecompressionStream('deflate-raw');
  const writer = stream.writable.getWriter();
  const reader = stream.readable.getReader();
  // Not awaited: `write` only resolves once the chunk is consumed, and nothing consumes it
  // until the read loop below starts — awaiting here deadlocks. Errors surface on `read`.
  void writer.write(data as Uint8Array<ArrayBuffer>);
  void writer.close();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return concat(chunks);
};

/** Join byte chunks into one array. */
const concat = (chunks: readonly Uint8Array[]): Uint8Array => {
  let total = 0;
  for (const chunk of chunks) total += chunk.length;
  const out = new Uint8Array(total);
  let position = 0;
  for (const chunk of chunks) {
    out.set(chunk, position);
    position += chunk.length;
  }
  return out;
};

/** One entry as described by the archive's central directory. */
export interface ZipEntry {
  /** Path inside the archive, e.g. `word/document.xml`. Always `/`-separated. */
  name: string;
  /** `ZIP_STORED` (0) or `ZIP_DEFLATE` (8); other values are readable metadata only. */
  compression: number;
  crc: number;
  compressedSize: number;
  uncompressedSize: number;
  /** MS-DOS packed time / date, carried through a rewrite unchanged. */
  modTime: number;
  modDate: number;
  /** Whether the name ends in `/` — a directory marker with no content. */
  directory: boolean;
  /** Offset of the entry's compressed bytes in the source array. */
  dataStart: number;
  /** Name as stored, kept verbatim so a rewrite reproduces non-UTF-8 names byte for byte. */
  nameBytes: Uint8Array;
  localOffset: number;
  centralStart: number;
  centralEnd: number;
}

/** Locate the End Of Central Directory record; -1 when this is not a ZIP. */
const findEocd = (bytes: Uint8Array): number => {
  const floor = Math.max(0, bytes.length - MAX_EOCD_SEARCH);
  for (let i = bytes.length - EOCD_SIZE; i >= floor; i--) {
    if (u32(bytes, i) === EOCD_SIGNATURE) return i;
  }
  return -1;
};

/**
 * @description: Read an archive's central directory. Returns `[]` for anything that is not
 * a ZIP, rather than throwing — the common caller is inspecting a file the user supplied.
 *
 * The central directory is the authority on an entry's sizes and CRC. The local header at
 * the front of each entry may hold zeros instead: archives written by a streaming writer
 * set general-purpose bit 3 and append the real values in a data descriptor *after* the
 * compressed bytes. Reading sizes from local headers is the single most common way a
 * hand-rolled ZIP reader breaks on real files.
 *
 * @param {Uint8Array} bytes the whole archive
 * @return {ZipEntry[]} entries in central-directory order
 */
export const readZipEntries = (bytes: Uint8Array): ZipEntry[] => {
  const eocd = findEocd(bytes);
  if (eocd === -1) return [];

  const count = u16(bytes, eocd + 10);
  const entries: ZipEntry[] = [];
  let position = u32(bytes, eocd + 16);

  for (let i = 0; i < count; i++) {
    if (position + CENTRAL_HEADER_SIZE > bytes.length) break;
    if (u32(bytes, position) !== CENTRAL_HEADER_SIGNATURE) break;

    const compression = u16(bytes, position + 10);
    const modTime = u16(bytes, position + 12);
    const modDate = u16(bytes, position + 14);
    const crc = u32(bytes, position + 16);
    const compressedSize = u32(bytes, position + 20);
    const uncompressedSize = u32(bytes, position + 24);
    const nameLength = u16(bytes, position + 28);
    const extraLength = u16(bytes, position + 30);
    const commentLength = u16(bytes, position + 32);
    const localOffset = u32(bytes, position + 42);

    const nameBytes = bytes.slice(position + CENTRAL_HEADER_SIZE, position + CENTRAL_HEADER_SIZE + nameLength);
    const name = new TextDecoder('utf-8', { fatal: false }).decode(nameBytes);

    // The local header's own name/extra lengths can differ from the central directory's,
    // so the data offset must be computed from the local header, not from the CD.
    const hasLocal = localOffset + LOCAL_HEADER_SIZE <= bytes.length;
    const localNameLength = hasLocal ? u16(bytes, localOffset + 26) : 0;
    const localExtraLength = hasLocal ? u16(bytes, localOffset + 28) : 0;

    const centralStart = position;
    position += CENTRAL_HEADER_SIZE + nameLength + extraLength + commentLength;

    entries.push({
      name,
      compression,
      crc,
      compressedSize,
      uncompressedSize,
      modTime,
      modDate,
      directory: name.endsWith('/'),
      dataStart: localOffset + LOCAL_HEADER_SIZE + localNameLength + localExtraLength,
      nameBytes,
      localOffset,
      centralStart,
      centralEnd: position,
    });
  }

  return entries;
};

/**
 * @description: Whether the archive contains an entry with exactly this name. Cheaper than
 * `readZipEntries(bytes).some(...)` only in intent — use it to make the check read clearly.
 * @param {Uint8Array} bytes
 * @param {string} name exact path, e.g. `[Content_Types].xml`
 * @return {boolean}
 */
export const zipHasEntry = (bytes: Uint8Array, name: string): boolean =>
  readZipEntries(bytes).some((entry) => entry.name === name);

/**
 * @description: Extract one entry's decompressed bytes. Resolves `null` when the entry is
 * missing, is a directory, is truncated, or uses a compression method other than STORED
 * and DEFLATE.
 *
 * @param {Uint8Array} bytes the whole archive
 * @param {string | ZipEntry} entry entry name, or an entry from `readZipEntries`
 * @return {Promise<Uint8Array | null>}
 * @example
 * ```ts
 * const xml = await readZipEntry(docx, 'word/document.xml');
 * if (xml) parse(new TextDecoder().decode(xml));
 * ```
 */
export const readZipEntry = async (bytes: Uint8Array, entry: string | ZipEntry): Promise<Uint8Array | null> => {
  const target = typeof entry === 'string' ? readZipEntries(bytes).find((e) => e.name === entry) : entry;
  if (!target || target.directory) return null;
  if (target.dataStart + target.compressedSize > bytes.length) return null;

  const raw = bytes.slice(target.dataStart, target.dataStart + target.compressedSize);
  if (target.compression === ZIP_STORED) return raw;
  if (target.compression !== ZIP_DEFLATE) return null;
  try {
    return await inflateRaw(raw);
  } catch {
    return null;
  }
};

export interface RewriteZipOptions {
  /**
   * Which entries to decompress and hand to `transform`. Omit to consider every file entry
   * — costly on a large archive, since each candidate is decompressed.
   */
  filter?: (entry: ZipEntry) => boolean;
  /**
   * Produce replacement content for an entry. Return `null` (or the bytes unchanged) to
   * leave it alone. A returned string is encoded as UTF-8, which is what XML entries want.
   */
  transform?: (data: Uint8Array, entry: ZipEntry) => Uint8Array | string | null | Promise<Uint8Array | string | null>;
  /** Brand-new entries to append. An existing entry with the same name is not replaced. */
  inject?: ReadonlyArray<{ name: string; data: Uint8Array | string }>;
}

/** Build a local file header for an entry written as STORED. */
const storedLocalHeader = (nameBytes: Uint8Array, size: number, crc: number, modTime = 0, modDate = 0): Uint8Array => {
  const header = new Uint8Array(LOCAL_HEADER_SIZE + nameBytes.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, LOCAL_HEADER_SIGNATURE, true);
  view.setUint16(4, 20, true); // version needed
  view.setUint16(6, 0, true); // flags — bit 3 cleared, no data descriptor follows
  view.setUint16(8, ZIP_STORED, true);
  view.setUint16(10, modTime, true);
  view.setUint16(12, modDate, true);
  view.setUint32(14, crc, true);
  view.setUint32(18, size, true);
  view.setUint32(22, size, true);
  view.setUint16(26, nameBytes.length, true);
  header.set(nameBytes, LOCAL_HEADER_SIZE);
  return header;
};

/** Build a central directory record for an entry written as STORED. */
const storedCentralHeader = (
  nameBytes: Uint8Array,
  size: number,
  crc: number,
  localOffset: number,
  modTime = 0,
  modDate = 0,
): Uint8Array => {
  const record = new Uint8Array(CENTRAL_HEADER_SIZE + nameBytes.length);
  const view = new DataView(record.buffer);
  view.setUint32(0, CENTRAL_HEADER_SIGNATURE, true);
  view.setUint16(4, 20, true); // version made by
  view.setUint16(6, 20, true); // version needed
  view.setUint16(8, 0, true); // flags — bit 3 cleared
  view.setUint16(10, ZIP_STORED, true);
  view.setUint16(12, modTime, true);
  view.setUint16(14, modDate, true);
  view.setUint32(16, crc, true);
  view.setUint32(20, size, true);
  view.setUint32(24, size, true);
  view.setUint16(28, nameBytes.length, true);
  view.setUint32(42, localOffset, true);
  record.set(nameBytes, CENTRAL_HEADER_SIZE);
  return record;
};

const toBytes = (value: Uint8Array | string): Uint8Array =>
  typeof value === 'string' ? new TextEncoder().encode(value) : value;

/**
 * @description: Rebuild an archive with some entries replaced and/or new entries appended.
 * Returns the **original array unchanged** when nothing matched, so the no-op path costs
 * nothing and the result can be compared by identity.
 *
 * Rewritten and injected entries are written STORED (uncompressed); untouched entries keep
 * their original compressed bytes, copied verbatim. The output is therefore bigger than the
 * input but is produced without a compressor.
 *
 * Every local header is written fresh from the central directory's sizes and CRC, and
 * general-purpose bit 3 is cleared throughout. That is what makes the result readable by
 * strict parsers even when the input came from a streaming writer whose local headers hold
 * zero placeholders backed by trailing data descriptors — copying those headers through is
 * the standard way a rewritten ZIP ends up subtly corrupt.
 *
 * An entry whose transform throws, or whose compression method is unsupported, is left
 * untouched rather than dropped: a rewrite must never lose data it failed to understand.
 *
 * @param {Uint8Array} bytes the whole archive
 * @param {RewriteZipOptions} options
 * @return {Promise<Uint8Array>}
 * @example
 * ```ts
 * // Rewrite every XML part, and add one new file.
 * const patched = await rewriteZip(docx, {
 *   filter: (e) => e.name.endsWith('.xml'),
 *   transform: (data) => new TextDecoder().decode(data).replace(/&amp;#10;/g, '&#10;'),
 *   inject: [{ name: 'meta.json', data: JSON.stringify({ patched: true }) }],
 * });
 * ```
 */
export const rewriteZip = async (bytes: Uint8Array, options: RewriteZipOptions = {}): Promise<Uint8Array> => {
  const { filter, transform, inject } = options;
  const entries = readZipEntries(bytes);
  if (entries.length === 0) return bytes;

  const replacements = new Map<ZipEntry, Uint8Array>();

  if (transform) {
    for (const entry of entries) {
      if (entry.directory) continue;
      if (filter && !filter(entry)) continue;
      try {
        const original = await readZipEntry(bytes, entry);
        if (!original) continue;
        const next = await transform(original, entry);
        if (next === null || next === undefined) continue;
        const nextBytes = toBytes(next);
        // Skip a no-op rewrite: it would otherwise force the entry to STORED and grow the
        // archive for nothing.
        if (nextBytes.length === original.length && nextBytes.every((b, i) => b === original[i])) continue;
        replacements.set(entry, nextBytes);
      } catch {
        // Leave the entry as it was — a failed transform must not drop content.
      }
    }
  }

  const injected = (inject ?? []).map(({ name, data }) => ({
    nameBytes: new TextEncoder().encode(name),
    data: toBytes(data),
  }));

  if (replacements.size === 0 && injected.length === 0) return bytes;

  const chunks: Uint8Array[] = [];
  const newOffsets: number[] = [];
  let offset = 0;

  // ---- File section ----
  for (const entry of entries) {
    newOffsets.push(offset);
    const replacement = replacements.get(entry);
    if (replacement) {
      const header = storedLocalHeader(
        entry.nameBytes,
        replacement.length,
        crc32(replacement),
        entry.modTime,
        entry.modDate,
      );
      chunks.push(header, replacement);
      offset += header.length + replacement.length;
      continue;
    }
    // Unchanged: keep the compressed bytes, but write a fresh header carrying the central
    // directory's authoritative sizes and CRC.
    const header = new Uint8Array(LOCAL_HEADER_SIZE + entry.nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, LOCAL_HEADER_SIGNATURE, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, entry.compression, true);
    view.setUint16(10, entry.modTime, true);
    view.setUint16(12, entry.modDate, true);
    view.setUint32(14, entry.crc, true);
    view.setUint32(18, entry.compressedSize, true);
    view.setUint32(22, entry.uncompressedSize, true);
    view.setUint16(26, entry.nameBytes.length, true);
    header.set(entry.nameBytes, LOCAL_HEADER_SIZE);
    const data = bytes.slice(entry.dataStart, entry.dataStart + entry.compressedSize);
    chunks.push(header, data);
    offset += header.length + data.length;
  }

  const injectedOffsets: number[] = [];
  for (const item of injected) {
    injectedOffsets.push(offset);
    const header = storedLocalHeader(item.nameBytes, item.data.length, crc32(item.data));
    chunks.push(header, item.data);
    offset += header.length + item.data.length;
  }

  // ---- Central directory ----
  const centralStart = offset;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    const replacement = replacements.get(entry);
    if (replacement) {
      const record = storedCentralHeader(
        entry.nameBytes,
        replacement.length,
        crc32(replacement),
        newOffsets[i]!,
        entry.modTime,
        entry.modDate,
      );
      chunks.push(record);
      offset += record.length;
      continue;
    }
    // Copy the original record so extra fields and comments survive, then patch the local
    // offset and clear bit 3 — the rebuilt local header has no data descriptor behind it.
    const record = new Uint8Array(bytes.slice(entry.centralStart, entry.centralEnd));
    const view = new DataView(record.buffer);
    view.setUint16(8, u16(record, 8) & ~0x0008, true);
    view.setUint32(42, newOffsets[i]!, true);
    chunks.push(record);
    offset += record.length;
  }

  for (let i = 0; i < injected.length; i++) {
    const item = injected[i]!;
    const record = storedCentralHeader(item.nameBytes, item.data.length, crc32(item.data), injectedOffsets[i]!);
    chunks.push(record);
    offset += record.length;
  }

  // ---- End of central directory ----
  const total = entries.length + injected.length;
  const eocd = new Uint8Array(EOCD_SIZE);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, EOCD_SIGNATURE, true);
  eocdView.setUint16(8, total, true);
  eocdView.setUint16(10, total, true);
  eocdView.setUint32(12, offset - centralStart, true);
  eocdView.setUint32(16, centralStart, true);
  chunks.push(eocd);

  return concat(chunks);
};

/**
 * @description: Build a ZIP from scratch, every entry STORED. No compression, so this is
 * for containers whose payload is already compressed (media, an OOXML bundle being
 * assembled) rather than for shrinking anything.
 * @param {ReadonlyArray<{ name: string; data: Uint8Array | string }>} files
 * @return {Uint8Array}
 */
export const createZip = (files: ReadonlyArray<{ name: string; data: Uint8Array | string }>): Uint8Array => {
  const chunks: Uint8Array[] = [];
  const records: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const data = toBytes(file.data);
    const checksum = crc32(data);
    const header = storedLocalHeader(nameBytes, data.length, checksum);
    records.push(storedCentralHeader(nameBytes, data.length, checksum, offset));
    chunks.push(header, data);
    offset += header.length + data.length;
  }

  const centralStart = offset;
  for (const record of records) {
    chunks.push(record);
    offset += record.length;
  }

  const eocd = new Uint8Array(EOCD_SIZE);
  const view = new DataView(eocd.buffer);
  view.setUint32(0, EOCD_SIGNATURE, true);
  view.setUint16(8, files.length, true);
  view.setUint16(10, files.length, true);
  view.setUint32(12, offset - centralStart, true);
  view.setUint32(16, centralStart, true);
  chunks.push(eocd);

  return concat(chunks);
};
