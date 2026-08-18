// @vitest-environment jsdom
import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  base64ToBytes,
  bytesToBase64,
  decodeTextBytes,
  fetchMaybeGzip,
  gunzipMaybe,
  isGzip,
  isHtmlDocument,
  isZipContainer,
  saveFileToDisk,
} from '@/utils/binary';

const enc = (text: string): Uint8Array => new TextEncoder().encode(text);

const gzip = async (bytes: Uint8Array): Promise<Uint8Array> => {
  const stream = new Response(bytes as Uint8Array<ArrayBuffer>).body!.pipeThrough(new CompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
};

describe('bytesToBase64 / base64ToBytes', () => {
  it('round-trips arbitrary bytes', () => {
    const bytes = new Uint8Array([0, 1, 2, 250, 251, 255, 65, 66]);
    expect(base64ToBytes(bytesToBase64(bytes))).toEqual(bytes);
  });

  it('accepts an ArrayBuffer as well as a view', () => {
    const bytes = enc('hello 世界');
    expect(bytesToBase64(bytes.buffer as ArrayBuffer)).toBe(bytesToBase64(bytes));
  });

  it('survives a payload far past the call-stack limit of the naive one-liner', () => {
    const big = new Uint8Array(600_000);
    for (let i = 0; i < big.length; i++) big[i] = i % 256;
    expect(() => String.fromCharCode.apply(null, Array.from(big))).toThrow();
    expect(base64ToBytes(bytesToBase64(big))).toEqual(big);
  });

  it('strips a data: URL prefix when decoding', () => {
    const base64 = bytesToBase64(enc('inline'));
    expect(new TextDecoder().decode(base64ToBytes(`data:text/plain;base64,${base64}`))).toBe('inline');
  });
});

describe('signature sniffing', () => {
  const ZIP = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00]);

  it('recognizes zip containers and gzip streams', () => {
    expect(isZipContainer(ZIP)).toBe(true);
    expect(isZipContainer(enc('not a zip'))).toBe(false);
    expect(isGzip(new Uint8Array([0x1f, 0x8b, 0x08]))).toBe(true);
    expect(isGzip(ZIP)).toBe(false);
  });

  it('recognizes HTML masquerading as a spreadsheet, BOM and leading space included', () => {
    expect(isHtmlDocument(enc('<html><body><table><tr><td>1</td></tr></table></body></html>'))).toBe(true);
    expect(isHtmlDocument(enc('  \n<!DOCTYPE html><html>'))).toBe(true);
    expect(isHtmlDocument(new Uint8Array([0xef, 0xbb, 0xbf, ...enc('<table><tr><td>x</td></tr></table>')]))).toBe(true);
  });

  it('does not flag real archives, CSV text or short buffers', () => {
    expect(isHtmlDocument(ZIP)).toBe(false);
    expect(isHtmlDocument(enc('name,age\n<b>,20\n'))).toBe(false);
    expect(isHtmlDocument(enc('<td>'))).toBe(false);
    expect(isHtmlDocument(new Uint8Array(0))).toBe(false);
  });
});

describe('gunzipMaybe / fetchMaybeGzip', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('decompresses gzipped bytes and passes plain bytes through untouched', async () => {
    const plain = enc('the quick brown fox');
    expect(new TextDecoder().decode(await gunzipMaybe(await gzip(plain)))).toBe('the quick brown fox');
    const passthrough = await gunzipMaybe(plain);
    expect(passthrough).toBe(plain);
  });

  it('fetches and decompresses only when the body is still gzipped', async () => {
    const payload = enc('wasm bytes');
    const compressed = await gzip(payload);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(compressed as Uint8Array<ArrayBuffer>, { status: 200 })),
    );
    expect(new TextDecoder().decode(await fetchMaybeGzip('/x2t.wasm.gz'))).toBe('wasm bytes');

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(payload as Uint8Array<ArrayBuffer>, { status: 200 })),
    );
    expect(new TextDecoder().decode(await fetchMaybeGzip('/x2t.wasm.gz'))).toBe('wasm bytes');
  });

  it('rejects a non-ok response with the status in the message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('nope', { status: 404, statusText: 'Not Found' })),
    );
    await expect(fetchMaybeGzip('/missing.gz')).rejects.toThrow(/404/);
  });
});

describe('decodeTextBytes', () => {
  it('strips a UTF-8 BOM', () => {
    expect(decodeTextBytes(new Uint8Array([0xef, 0xbb, 0xbf, ...enc('a,b')]))).toBe('a,b');
  });

  it('decodes UTF-8 without touching the fallbacks', () => {
    expect(decodeTextBytes(enc('中文测试'))).toBe('中文测试');
  });

  it('falls back to GB18030 for legacy "ANSI" exports instead of producing mojibake', () => {
    // 中文 in GBK: 中 = D6D0, 文 = CEC4 (invalid as UTF-8, so the strict pass rejects it)
    const gbk = new Uint8Array([0xd6, 0xd0, 0xce, 0xc4]);
    expect(decodeTextBytes(gbk)).toBe('中文');
  });

  it('never throws on bytes that are valid in no candidate encoding', () => {
    const junk = new Uint8Array([0xff, 0xfe, 0x00, 0x80, 0x81]);
    expect(typeof decodeTextBytes(junk)).toBe('string');
  });
});

describe('saveFileToDisk', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('writes through the File System Access API when available', async () => {
    const write = vi.fn(async () => {});
    const close = vi.fn(async () => {});
    const picker = vi.fn(async () => ({ createWritable: async () => ({ write, close }) }));
    vi.stubGlobal('showSaveFilePicker', picker);

    await expect(saveFileToDisk(enc('bytes'), 'report.docx', { mimeType: 'application/msword' })).resolves.toBe(true);
    expect(picker).toHaveBeenCalledWith(
      expect.objectContaining({
        suggestedName: 'report.docx',
        types: [expect.objectContaining({ accept: { 'application/msword': ['.docx'] } })],
      }),
    );
    expect(write).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });

  it('reports a dismissed dialog as "not written" rather than an error', async () => {
    const abort = Object.assign(new Error('aborted'), { name: 'AbortError' });
    vi.stubGlobal(
      'showSaveFilePicker',
      vi.fn(async () => {
        throw abort;
      }),
    );
    await expect(saveFileToDisk(enc('bytes'), 'x.txt')).resolves.toBe(false);
  });

  it('falls back to an anchor download when the picker refuses, rather than losing the file', async () => {
    // The case this exists for: `showSaveFilePicker` needs a live user gesture, and the usual
    // caller awaits the data it is about to save first — by then the activation is gone and
    // the picker throws SecurityError. Throwing here would drop a file the anchor path,
    // which needs no gesture, could still have written.
    const denied = Object.assign(new Error('must be handling a user gesture'), { name: 'SecurityError' });
    vi.stubGlobal(
      'showSaveFilePicker',
      vi.fn(async () => {
        throw denied;
      }),
    );
    vi.stubGlobal('URL', { ...URL, createObjectURL: vi.fn(() => 'blob:fallback'), revokeObjectURL: vi.fn() });
    const clicked: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      clicked.push(this.download);
    });

    await expect(saveFileToDisk(enc('bytes'), 'saved-anyway.txt')).resolves.toBe(true);
    expect(clicked).toEqual(['saved-anyway.txt']);
    vi.restoreAllMocks();
  });

  it('falls back to an anchor download when the picker is unavailable', async () => {
    vi.stubGlobal('showSaveFilePicker', undefined);
    vi.stubGlobal('URL', { ...URL, createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL: vi.fn() });
    const clicked: string[] = [];
    const create = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = create(tag);
      if (tag === 'a') el.click = () => clicked.push((el as HTMLAnchorElement).download);
      return el;
    });

    await expect(saveFileToDisk(enc('bytes'), 'fallback.csv', { mimeType: 'text/csv' })).resolves.toBe(true);
    expect(clicked).toEqual(['fallback.csv']);
  });
});
