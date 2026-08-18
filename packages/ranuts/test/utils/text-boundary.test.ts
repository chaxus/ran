/**
 * Helpers for text that has to survive crossing a boundary — a URL, a code fence, a CSV cell,
 * a size-capped field. Each one exists because the naive version fails silently: the reader
 * sees plausible output and never learns it was mangled.
 */
import { describe, it, expect } from 'vitest';
import { bytesToBase64Url, base64UrlToBytes, concatBytes } from '@/utils/binary';
import { truncateWithMarker, fenceCode, slugify, csvEscape } from '@/utils/str';

describe('base64url', () => {
  it('round-trips arbitrary bytes', () => {
    const bytes = new Uint8Array(Array.from({ length: 256 }, (_, i) => i));
    expect(base64UrlToBytes(bytesToBase64Url(bytes))).toEqual(bytes);
  });

  it('produces nothing that needs escaping in a URL or a path', () => {
    // The bytes 0xfb 0xff encode to '+/' in standard base64 — the two characters that break
    // a query string and a path segment respectively.
    const encoded = bytesToBase64Url(new Uint8Array([0xfb, 0xff, 0xbf]));
    expect(encoded).not.toMatch(/[+/=]/);
    expect(encodeURIComponent(encoded)).toBe(encoded);
  });

  it('decodes a payload whose padding was stripped', () => {
    // One and two byte inputs are the lengths that need one and two `=`; a decoder that does
    // not restore them throws on exactly the tokens JWT libraries emit.
    for (const bytes of [new Uint8Array([1]), new Uint8Array([1, 2]), new Uint8Array([1, 2, 3])]) {
      expect(base64UrlToBytes(bytesToBase64Url(bytes))).toEqual(bytes);
    }
  });

  it('returns null instead of throwing on a token that is not base64url', () => {
    // The caller is usually checking something a stranger supplied.
    expect(base64UrlToBytes('not valid!!')).toBeNull();
  });
});

describe('concatBytes', () => {
  it('joins in order', () => {
    expect(concatBytes([new Uint8Array([1, 2]), new Uint8Array([3])])).toEqual(new Uint8Array([1, 2, 3]));
  });

  it('handles an empty list and empty chunks', () => {
    expect(concatBytes([])).toEqual(new Uint8Array(0));
    expect(concatBytes([new Uint8Array(0), new Uint8Array([7])])).toEqual(new Uint8Array([7]));
  });

  it('keeps a multi-byte character that straddles two chunks readable', () => {
    // The reason this function exists. Decoding each chunk on its own turns the split
    // character into replacement characters, and nothing downstream can tell.
    const whole = new TextEncoder().encode('日本語');
    const first = whole.slice(0, 4);
    const second = whole.slice(4);
    const decoder = new TextDecoder();

    expect(decoder.decode(first) + decoder.decode(second)).not.toBe('日本語');
    expect(decoder.decode(concatBytes([first, second]))).toBe('日本語');
  });
});

describe('truncateWithMarker', () => {
  it('leaves text under the ceiling alone', () => {
    expect(truncateWithMarker('short', 10)).toBe('short');
  });

  it('marks what it cut', () => {
    expect(truncateWithMarker('abcdefghij', 4)).toBe('abcd…[truncated]');
  });

  it('takes a caller-supplied marker', () => {
    expect(truncateWithMarker('abcdefghij', 4, ' …more')).toBe('abcd …more');
  });

  it('does not mark text that exactly fills the ceiling', () => {
    // An off-by-one here would claim every full-length value was cut.
    expect(truncateWithMarker('abcd', 4)).toBe('abcd');
  });
});

describe('fenceCode', () => {
  it('uses a plain fence for ordinary text', () => {
    expect(fenceCode('hello', 'ts')).toBe('```ts\nhello\n```');
  });

  it('outgrows backticks in the body', () => {
    // A three-backtick fence around a body containing ``` ends the block early and spills the
    // rest of the document into prose.
    const body = 'before\n```\ninner\n```\nafter';
    const out = fenceCode(body);
    expect(out.startsWith('````\n')).toBe(true);
    expect(out.endsWith('\n````')).toBe(true);
  });

  it('outgrows the longest run, not just the first', () => {
    expect(fenceCode('` and ````').startsWith('`````\n')).toBe(true);
  });
});

describe('slugify', () => {
  it('lowercases and joins with single dashes', () => {
    expect(slugify('My Session Title')).toBe('my-session-title');
  });

  it('collapses punctuation and trims the ends', () => {
    expect(slugify('  --Hello,   World!!  ')).toBe('hello-world');
  });

  it('never leaves a trailing dash after cutting', () => {
    // Cutting mid-separator is how a slug ends up as `report-` in a filename.
    expect(slugify('abcd efgh', 5)).toBe('abcd');
  });

  it('returns an empty string when nothing survives, so callers can substitute', () => {
    expect(slugify('中文标题')).toBe('');
  });
});

describe('csvEscape', () => {
  it('leaves a plain value alone', () => {
    expect(csvEscape('plain')).toBe('plain');
  });

  it('quotes and doubles when the value contains a delimiter or a quote', () => {
    expect(csvEscape('a,b')).toBe('"a,b"');
    expect(csvEscape('say "hi"')).toBe('"say ""hi"""');
    expect(csvEscape('line\nbreak')).toBe('"line\nbreak"');
  });

  it('defuses a value a spreadsheet would run as a formula', () => {
    // An exported name like `=cmd|'/c calc'!A1` executes on open; the leading quote is what
    // every CSV-injection guidance asks for.
    expect(csvEscape('=1+1')).toBe("'=1+1");
    expect(csvEscape('@SUM(A1)')).toBe("'@SUM(A1)");
  });

  it('accepts numbers', () => {
    expect(csvEscape(42)).toBe('42');
  });
});
