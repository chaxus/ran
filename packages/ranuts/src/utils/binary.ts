/**
 * Binary payload helpers: base64 without the call-stack trap, gzip that may or
 * may not already be decoded, byte-signature sniffing, text decoding with an
 * encoding fallback chain, and "save these bytes to disk".
 *
 * All of these were written (several times each) inside apps that move file
 * bytes around — an Office editor, a converter, a downloader — before landing
 * here.
 */

/**
 * @description: Encode bytes as base64 without blowing the call stack.
 *
 * `String.fromCharCode.apply(null, bytes)` is the usual one-liner and it throws
 * `RangeError: Maximum call stack size exceeded` somewhere around a hundred
 * thousand bytes — a limit real files pass routinely, so the naive version
 * works in every test and fails on the first user document. Chunked here.
 *
 * @param {Uint8Array | ArrayBuffer} data
 * @return {string} base64 (no data: prefix, no line breaks)
 */
export const bytesToBase64 = (data: Uint8Array | ArrayBuffer): string => {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const CHUNK = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)));
  }
  return btoa(binary);
};

/**
 * @description: Decode base64 into bytes. Accepts a bare payload or a full
 * `data:` URL (the prefix is stripped), which is what `readFileAsDataURL` and
 * canvas `toDataURL` hand you.
 *
 * @param {string} base64
 * @return {Uint8Array}
 */
export const base64ToBytes = (base64: string): Uint8Array<ArrayBuffer> => {
  const payload = base64.startsWith('data:') ? base64.slice(base64.indexOf(',') + 1) : base64;
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

/** @description: Whether the bytes start with the gzip magic number (1f 8b). */
export const isGzip = (bytes: Uint8Array): boolean => bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;

/**
 * @description: Whether the bytes are a ZIP container (PK\x03\x04) — which is
 * also every OOXML file (docx / xlsx / pptx), ODF file, epub and jar.
 */
export const isZipContainer = (bytes: Uint8Array): boolean =>
  bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;

/**
 * @description: Whether the bytes are an HTML document rather than the binary
 * format their extension claims.
 *
 * Web systems love exporting an HTML `<table>` under a `.xls` name; spreadsheet
 * apps accept it, parsers that trust the extension do not. A leading BOM and
 * whitespace are skipped, and a ZIP container short-circuits to `false` so a
 * real .xlsx is never sniffed as HTML.
 */
export const isHtmlDocument = (bytes: Uint8Array): boolean => {
  if (bytes.length < 8 || isZipContainer(bytes)) return false;
  const start = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf ? 3 : 0;
  const head = new TextDecoder('latin1').decode(bytes.subarray(start, start + 2048)).replace(/^\s+/, '');
  return /^<(!doctype\s+html|html|head|body|table|meta|\?xml[^>]*>\s*<html)/i.test(head);
};

/**
 * @description: Decompress bytes if — and only if — they are still gzipped.
 *
 * A server that sends `Content-Encoding: gzip` has the browser decode the body
 * before you ever see it, while a `.gz` file served as `application/gzip`
 * arrives compressed. The same fetch therefore yields either shape depending on
 * the host, so the magic number decides instead of the URL.
 *
 * @param {Uint8Array} bytes
 * @return {Promise<Uint8Array>} the original bytes when they are not gzipped
 */
export const gunzipMaybe = async (bytes: Uint8Array): Promise<Uint8Array> => {
  if (!isGzip(bytes)) return bytes;
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('DecompressionStream is not available in this runtime');
  }
  const stream = new Response(bytes as Uint8Array<ArrayBuffer>).body!.pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
};

/**
 * @description: Fetch a resource that may be delivered gzipped or already
 * decoded (see `gunzipMaybe`), e.g. a large `.wasm.gz` asset on a static host.
 *
 * @param {RequestInfo | URL} input
 * @param {RequestInit} init
 * @return {Promise<Uint8Array>}
 */
export const fetchMaybeGzip = async (input: RequestInfo | URL, init?: RequestInit): Promise<Uint8Array> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Failed to fetch '${String(input)}' (${response.status} ${response.statusText})`);
  }
  return gunzipMaybe(new Uint8Array(await response.arrayBuffer()));
};

/**
 * @description: Decode text bytes, trying encodings in order until one holds.
 *
 * A non-fatal `TextDecoder` never throws — invalid sequences silently become
 * U+FFFD — so a legacy-encoded file decodes "successfully" into mojibake. Strict
 * decoding is the only way to tell, so each candidate is tried with
 * `fatal: true` and the last one is the fallback that cannot fail. The default
 * chain covers a UTF-8 BOM, real UTF-8, Chinese "ANSI" exports (GB18030 is a
 * superset of GBK) and finally latin1.
 *
 * Pair with `checkEncoding` when you would rather detect statistically than
 * fall through a fixed list.
 *
 * @param {Uint8Array} bytes
 * @param {string[]} encodings candidates, most specific first
 * @return {string}
 */
export const decodeTextBytes = (bytes: Uint8Array, encodings: string[] = ['utf-8', 'gb18030', 'latin1']): string => {
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return new TextDecoder('utf-8').decode(bytes.subarray(3));
  }
  for (let i = 0; i < encodings.length; i++) {
    const last = i === encodings.length - 1;
    try {
      return new TextDecoder(encodings[i], { fatal: !last }).decode(bytes);
    } catch {
      // not this encoding (or the decoder is unavailable): try the next one
    }
  }
  return new TextDecoder('latin1').decode(bytes);
};

interface SaveFileOptions {
  /** MIME type for the picker's file-type entry and the Blob. */
  mimeType?: string;
  /** Human-readable type description shown by the save dialog. */
  description?: string;
}

type SaveFilePicker = (options: {
  suggestedName: string;
  types: Array<{ description: string; accept: Record<string, string[]> }>;
}) => Promise<{ createWritable: () => Promise<{ write: (data: Blob | Uint8Array) => Promise<void>; close: () => Promise<void> }> }>;

/**
 * @description: Save bytes to disk: a real "Save as" dialog through the File
 * System Access API where it exists, an anchor download everywhere else.
 *
 * Resolves `true` when the file was written, `false` when the user dismissed
 * the picker — a cancel is not an error, and callers that treat it as one end
 * up showing a failure toast for a deliberate action. Anything else rejects.
 *
 * @param {Blob | Uint8Array} data
 * @param {string} fileName
 * @param {SaveFileOptions} options
 * @return {Promise<boolean>} whether the file was written
 */
export const saveFileToDisk = async (
  data: Blob | Uint8Array,
  fileName: string,
  options: SaveFileOptions = {},
): Promise<boolean> => {
  const blob = data instanceof Blob ? data : new Blob([data as Uint8Array<ArrayBuffer>], { type: options.mimeType });
  const picker = (globalThis as unknown as { showSaveFilePicker?: SaveFilePicker }).showSaveFilePicker;

  if (typeof picker === 'function') {
    const extension = fileName.includes('.') ? `.${fileName.split('.').pop()}` : '';
    try {
      const handle = await picker({
        suggestedName: fileName,
        types: [
          {
            description: options.description || 'File',
            accept: { [options.mimeType || blob.type || 'application/octet-stream']: extension ? [extension] : [] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (error) {
      // The user dismissing the dialog is a normal outcome, not a failure.
      if ((error as Error)?.name === 'AbortError') return false;
      throw error;
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  // Revoking synchronously can cancel the download in some browsers.
  setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(url);
  }, 100);
  return true;
};
