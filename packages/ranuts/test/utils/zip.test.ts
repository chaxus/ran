import { describe, expect, it } from 'vitest';
import { ZIP_STORED, crc32, createZip, readZipEntries, readZipEntry, rewriteZip, zipHasEntry } from '@/utils/zip';

const text = (value: string): Uint8Array => new TextEncoder().encode(value);
const decode = (value: Uint8Array): string => new TextDecoder().decode(value);

describe('crc32', () => {
  it('matches the reference vector for "123456789"', () => {
    expect(crc32(text('123456789'))).toBe(0xcbf43926);
  });

  it('is 0 for empty input', () => {
    expect(crc32(new Uint8Array(0))).toBe(0);
  });

  it('always returns an unsigned 32-bit value', () => {
    // 'a' hashes to 0xe8b7be43, whose top bit is set — a signed implementation returns a
    // negative number here and silently corrupts the header it is written into.
    expect(crc32(text('a'))).toBe(0xe8b7be43);
    expect(crc32(text('a'))).toBeGreaterThan(0);
  });
});

describe('createZip / readZipEntries', () => {
  it('round-trips entries', async () => {
    const zip = createZip([
      { name: 'a.txt', data: 'hello' },
      { name: 'nested/b.json', data: text('{"n":1}') },
    ]);

    const entries = readZipEntries(zip);
    expect(entries.map((e) => e.name)).toEqual(['a.txt', 'nested/b.json']);
    expect(entries[0].compression).toBe(ZIP_STORED);
    expect(entries[0].uncompressedSize).toBe(5);
    expect(entries[0].crc).toBe(crc32(text('hello')));

    expect(decode((await readZipEntry(zip, 'a.txt'))!)).toBe('hello');
    expect(decode((await readZipEntry(zip, 'nested/b.json'))!)).toBe('{"n":1}');
  });

  it('reports missing entries as null rather than throwing', async () => {
    const zip = createZip([{ name: 'a.txt', data: 'hello' }]);
    expect(await readZipEntry(zip, 'nope.txt')).toBeNull();
    expect(zipHasEntry(zip, 'a.txt')).toBe(true);
    expect(zipHasEntry(zip, 'nope.txt')).toBe(false);
  });

  it('returns [] for input that is not a ZIP', () => {
    expect(readZipEntries(text('not a zip at all'))).toEqual([]);
    expect(readZipEntries(new Uint8Array(0))).toEqual([]);
  });

  it('handles an empty archive', () => {
    expect(readZipEntries(createZip([]))).toEqual([]);
  });
});

/**
 * Build a single-entry archive whose payload is DEFLATE-compressed. `createZip` only emits
 * STORED entries, so without this the inflate path — the part most likely to be wrong —
 * would never run.
 */
const deflatedZip = async (name: string, content: string): Promise<Uint8Array> => {
  const raw = text(content);
  const stream = new CompressionStream('deflate-raw');
  const writer = stream.writable.getWriter();
  void writer.write(raw as Uint8Array<ArrayBuffer>);
  void writer.close();
  const reader = stream.readable.getReader();
  const parts: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) parts.push(value);
  }
  const compressed = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const part of parts) {
    compressed.set(part, at);
    at += part.length;
  }

  const nameBytes = text(name);
  const checksum = crc32(raw);
  const local = new Uint8Array(30 + nameBytes.length);
  const localView = new DataView(local.buffer);
  localView.setUint32(0, 0x04034b50, true);
  localView.setUint16(4, 20, true);
  localView.setUint16(8, 8, true); // DEFLATE
  localView.setUint32(14, checksum, true);
  localView.setUint32(18, compressed.length, true);
  localView.setUint32(22, raw.length, true);
  localView.setUint16(26, nameBytes.length, true);
  local.set(nameBytes, 30);

  const central = new Uint8Array(46 + nameBytes.length);
  const centralView = new DataView(central.buffer);
  centralView.setUint32(0, 0x02014b50, true);
  centralView.setUint16(4, 20, true);
  centralView.setUint16(6, 20, true);
  centralView.setUint16(10, 8, true);
  centralView.setUint32(16, checksum, true);
  centralView.setUint32(20, compressed.length, true);
  centralView.setUint32(24, raw.length, true);
  centralView.setUint16(28, nameBytes.length, true);
  centralView.setUint32(42, 0, true);
  central.set(nameBytes, 46);

  const cdStart = local.length + compressed.length;
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(8, 1, true);
  eocdView.setUint16(10, 1, true);
  eocdView.setUint32(12, central.length, true);
  eocdView.setUint32(16, cdStart, true);

  const out = new Uint8Array(cdStart + central.length + eocd.length);
  out.set(local, 0);
  out.set(compressed, local.length);
  out.set(central, cdStart);
  out.set(eocd, cdStart + central.length);
  return out;
};

describe('DEFLATE entries', () => {
  // Long enough that DEFLATE actually shrinks it, so the stored bytes really are compressed.
  const content = 'compressible '.repeat(40);

  it('inflates a deflated entry', async () => {
    const zip = await deflatedZip('doc.xml', content);
    const entry = readZipEntries(zip)[0];
    expect(entry.compression).toBe(8);
    expect(entry.compressedSize).toBeLessThan(entry.uncompressedSize);
    expect(decode((await readZipEntry(zip, 'doc.xml'))!)).toBe(content);
  });

  it('copies a deflated entry through a rewrite untouched', async () => {
    const zip = await deflatedZip('doc.xml', content);
    const out = await rewriteZip(zip, { inject: [{ name: 'added.txt', data: 'new' }] });
    const entry = readZipEntries(out).find((e) => e.name === 'doc.xml')!;
    expect(entry.compression).toBe(8); // still compressed, not re-stored
    expect(decode((await readZipEntry(out, 'doc.xml'))!)).toBe(content);
    expect(decode((await readZipEntry(out, 'added.txt'))!)).toBe('new');
  });

  it('rewrites a deflated entry as STORED', async () => {
    const zip = await deflatedZip('doc.xml', content);
    const out = await rewriteZip(zip, { transform: () => 'short' });
    const entry = readZipEntries(out)[0];
    expect(entry.compression).toBe(ZIP_STORED);
    expect(decode((await readZipEntry(out, 'doc.xml'))!)).toBe('short');
  });
});

describe('rewriteZip', () => {
  const source = createZip([
    { name: 'keep.txt', data: 'untouched' },
    { name: 'patch.xml', data: '<a>&amp;#10;</a>' },
  ]);

  it('returns the original array when nothing matched', async () => {
    const out = await rewriteZip(source, { filter: () => false, transform: () => 'x' });
    expect(out).toBe(source);
  });

  it('returns the original array when the transform is a no-op', async () => {
    const out = await rewriteZip(source, { transform: (data) => data });
    expect(out).toBe(source);
  });

  it('replaces matching entries and leaves the rest byte-identical', async () => {
    const out = await rewriteZip(source, {
      filter: (entry) => entry.name.endsWith('.xml'),
      transform: (data) => decode(data).replace(/&amp;#10;/g, '&#10;'),
    });

    expect(out).not.toBe(source);
    expect(readZipEntries(out).map((e) => e.name)).toEqual(['keep.txt', 'patch.xml']);
    expect(decode((await readZipEntry(out, 'patch.xml'))!)).toBe('<a>&#10;</a>');
    expect(decode((await readZipEntry(out, 'keep.txt'))!)).toBe('untouched');
  });

  it('records a correct CRC and size for a rewritten entry', async () => {
    const out = await rewriteZip(source, { transform: () => 'replaced' });
    const entry = readZipEntries(out).find((e) => e.name === 'patch.xml')!;
    expect(entry.uncompressedSize).toBe(8);
    expect(entry.crc).toBe(crc32(text('replaced')));
  });

  it('appends injected entries', async () => {
    const out = await rewriteZip(source, {
      inject: [{ name: 'meta.json', data: '{"added":true}' }],
    });
    expect(readZipEntries(out).map((e) => e.name)).toEqual(['keep.txt', 'patch.xml', 'meta.json']);
    expect(decode((await readZipEntry(out, 'meta.json'))!)).toBe('{"added":true}');
  });

  it('keeps an entry whose transform throws', async () => {
    const out = await rewriteZip(source, {
      transform: (_data, entry) => {
        if (entry.name === 'patch.xml') throw new Error('boom');
        return 'rewritten';
      },
    });
    expect(decode((await readZipEntry(out, 'patch.xml'))!)).toBe('<a>&amp;#10;</a>');
    expect(decode((await readZipEntry(out, 'keep.txt'))!)).toBe('rewritten');
  });

  it('survives being rewritten repeatedly', async () => {
    let current = source;
    for (let i = 0; i < 3; i++) {
      current = await rewriteZip(current, {
        filter: (entry) => entry.name === 'patch.xml',
        transform: () => `pass-${i}`,
      });
    }
    expect(decode((await readZipEntry(current, 'patch.xml'))!)).toBe('pass-2');
    expect(decode((await readZipEntry(current, 'keep.txt'))!)).toBe('untouched');
    expect(readZipEntries(current)).toHaveLength(2);
  });

  it('clears the data-descriptor flag on entries it copies through', async () => {
    // Set general-purpose bit 3 on the first central directory record, as a streaming
    // writer would. The rebuilt archive writes no data descriptors, so the flag must not
    // survive — a strict reader would then look for sizes that are not there.
    const streamed = new Uint8Array(source);
    const eocd = streamed.length - 22;
    const cdOffset = new DataView(streamed.buffer).getUint32(eocd + 16, true);
    const view = new DataView(streamed.buffer);
    view.setUint16(cdOffset + 8, view.getUint16(cdOffset + 8, true) | 0x0008, true);

    const out = await rewriteZip(streamed, { inject: [{ name: 'x', data: 'x' }] });
    const outCd = new DataView(out.buffer).getUint32(out.length - 22 + 16, true);
    expect(new DataView(out.buffer).getUint16(outCd + 8, true) & 0x0008).toBe(0);
  });
});
