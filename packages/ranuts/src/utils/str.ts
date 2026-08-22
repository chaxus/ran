import { detect } from 'jschardet';

/**
 * @description: Parse a delimited string into an object, e.g.
 * @param {string} url 'a=1&b=2&c=3'
 * @param {string} sep &
 * @param {string} eq =
 * @return {object} {a:1,b:2,c:3}
 */
export const strParse = (
  str: string = '',
  sep: string | RegExp = '',
  eq: string | RegExp = '',
): Record<string, string> => {
  const result: Record<string, string> = {};
  const list = str.split(sep);
  if (list.length > 0) {
    list.forEach((item) => {
      const [key = '', value = ''] = item.split(eq);
      if (clearStr(key)) {
        result[clearStr(key)] = clearStr(value);
      }
    });
  }
  return result;
};
/**
 * @description: Strip whitespace, line breaks and HTML tags out of a string
 * @param {string} str string to clean
 * @return {string} the resulting plain text
 */
export const clearBr = (str = ''): string => {
  if (str.length === 0) return '';
  // Single linear pass (O(n)): strip whitespace and drop everything between angle
  // brackets. Tracking `<` depth handles overlapping/nested brackets (e.g. `<<b>>`)
  // without the quadratic regex-in-a-loop that CodeQL flags as ReDoS. An unmatched
  // `>` at depth 0 is kept, matching the previous `/<[^>]*>/g` behaviour.
  let out = '';
  let depth = 0;
  for (const ch of str) {
    if (/\s/.test(ch)) continue;
    if (ch === '<') {
      depth++;
      continue;
    }
    if (ch === '>' && depth > 0) {
      depth--;
      continue;
    }
    if (depth === 0) out += ch;
  }
  return out;
};

export const isString = (obj: unknown): boolean => {
  return window.toString.call(obj) === '[object String]';
};

/**
 * @description: A short random-ish string prefixed with the current timestamp.
 *
 * **Not cryptographically secure** — it draws from `Math.random()`, whose output is
 * predictable from previous values. Good for a DOM id, a message correlation key or a cache
 * buster; never for a token, code or anything an attacker benefits from guessing. Use
 * `secureRandomString` / `secureToken` for those.
 *
 * @param {number} len characters of randomness after the timestamp
 * @return {string}
 */
export function randomString(len: number = 8): string {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return `${Date.now()}-${pwd}`;
}

interface ClearStrOption {
  urlencoded?: boolean;
}

/**
 * @description: Trim surrounding whitespace, percent-decode, and drop surrounding quotes
 * @param {string} str
 * @return {string}
 */
export const clearStr = (str: string, options: ClearStrOption = {}): string => {
  const { urlencoded = true } = options;
  const s = String.prototype.trim.call(str);
  return urlencoded ? decodeURIComponent(s).replace(/"|'/g, '') : s.replace(/"|'/g, '');
};

/**
 * Collect the complete sentences of a text that contain the search term, keeping only the
 * longest one among overlapping matches
 * @param text source text
 * @param searchValue search term
 * @returns the complete sentences containing the term (de-duplicated)
 */
export function getMatchingSentences(text: string, searchValue: string): string[] {
  if (!text || !searchValue) {
    return [];
  }

  // Holds a sentence together with its position
  interface SentenceInfo {
    sentence: string;
    start: number;
    end: number;
  }

  const sentencesInfo: SentenceInfo[] = [];
  const searchRegex = new RegExp(searchValue, 'gi');
  let match;

  while ((match = searchRegex.exec(text)) !== null) {
    const matchStart = match.index;

    // Scan left for the sentence start (a full stop, a line break, or the start of the text)
    let sentenceStart = matchStart;
    while (sentenceStart > 0) {
      const char = text[sentenceStart - 1];
      if (char === '。' || char === '.' || char === '\n' || char === '！' || char === '?' || char === '？') {
        break;
      }
      sentenceStart--;
    }

    // Scan right for the sentence end (a full stop, a line break, or the end of the text)
    let sentenceEnd = matchStart + searchValue.length;
    while (sentenceEnd < text.length) {
      const char = text[sentenceEnd];
      if (char === '。' || char === '.' || char === '\n' || char === '！' || char === '?' || char === '？') {
        sentenceEnd++;
        break;
      }
      sentenceEnd++;
    }

    // Take the complete sentence and trim it
    const sentence = text.slice(sentenceStart, sentenceEnd).trim();
    if (sentence) {
      sentencesInfo.push({
        sentence,
        start: sentenceStart,
        end: sentenceEnd,
      });
    }
  }

  // Resolve overlapping sentences, keeping only the longest
  const filteredSentences: string[] = [];
  const usedRanges: Array<{ start: number; end: number }> = [];

  // Sort by length descending so the longest sentences are handled first
  sentencesInfo.sort((a, b) => b.sentence.length - a.sentence.length);

  for (const info of sentencesInfo) {
    // Does this sentence overlap a range that was already taken?
    const hasOverlap = usedRanges.some((range) => !(info.end <= range.start || info.start >= range.end));

    if (!hasOverlap) {
      filteredSentences.push(info.sentence);
      usedRanges.push({
        start: info.start,
        end: info.end,
      });
    }
  }

  // Drop exact duplicates
  return [...new Set(filteredSentences)];
}

export const toString = (value: string | number): string => {
  return String(value);
};

export const checkEncoding = (uint8Array: Uint8Array): string => {
  // Turn the Uint8Array into a string
  const asciiString = Array.from(uint8Array)
    .map((byte) => String.fromCharCode(byte))
    .join('');
  const detected = detect(asciiString);
  return detected.encoding || 'utf-8';
};

/**
 * @description: Decode bytes into a string using the sniffed encoding. Required when reading
 * text files of unknown provenance (a user-uploaded txt, content scraped off an old site) —
 * a plain `new TextDecoder().decode()` turns GBK/Big5 into mojibake, and such files are a
 * sizeable share of Chinese-language content.
 * @param {ArrayBuffer | Uint8Array} buffer
 * @return {string}
 */
export const arrayBufferToString = (buffer: ArrayBuffer | Uint8Array): string => {
  const uint8Array = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return new TextDecoder(checkEncoding(uint8Array)).decode(uint8Array);
};

/**
 * @description: Convert full-width characters to half-width (digits, letters, punctuation and
 * the ideographic space). Full-width digits produced by a Chinese IME are not equivalent to
 * half-width ones in regexes, `parseInt` or string comparison, so normalise before parsing.
 * @param {string} value
 * @return {string}
 */
export const toHalfWidth = (value: string): string => {
  return value.replace(/[！-～]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0)).replace(/\u3000/g, ' ');
};

/**
 * @description: Convert half-width characters to full-width (the inverse of `toHalfWidth`)
 * @param {string} value
 * @return {string}
 */
export const toFullWidth = (value: string): string => {
  return value.replace(/[!-~]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0xfee0)).replace(/ /g, '\u3000');
};

/** Which end of the string gets dropped when it is too long. */
export type TruncatePosition = 'end' | 'start' | 'middle';

export interface TruncateOptions {
  /** Ceiling for the returned string, ellipsis included. */
  length: number;
  /** Default `'end'`. */
  position?: TruncatePosition;
  /** Default `'…'`. */
  ellipsis?: string;
}

/**
 * @description: Shorten a string to a maximum length, marking the cut with an ellipsis.
 *
 * `position` decides which end survives, and that choice carries real information:
 *
 * - `'end'` (default) keeps the beginning — right for prose and titles.
 * - `'start'` keeps the **tail**, which is what a file path wants. `/Users/someone/work/…`
 *   are the bytes a reader already knows; `…/src/utils/str.ts` is the part they need.
 * - `'middle'` keeps both ends, for identifiers whose head *and* tail are meaningful, such as
 *   a hash or an account number.
 *
 * The result never exceeds `length`, so a `length` shorter than the ellipsis returns a
 * truncated ellipsis rather than overflowing.
 *
 * @param {string} value
 * @param {TruncateOptions | number} options a bare number is shorthand for `{ length }`
 * @return {string}
 * @example
 * ```ts
 * truncate('the quick brown fox', 12);                                 // 'the quick b…'
 * truncate('/Users/me/code/app/src/index.ts', { length: 20, position: 'start' }); // '…de/app/src/index.ts'
 * truncate('0xabcdef0123456789', { length: 11, position: 'middle' });   // '0xabc…56789'
 * ```
 */
export const truncate = (value: string, options: TruncateOptions | number): string => {
  const { length, position = 'end', ellipsis = '…' } = typeof options === 'number' ? { length: options } : options;
  if (!value) return value;

  // Slice by Unicode code point, not UTF-16 code unit: a naive `value.slice(i)` can land inside
  // a surrogate pair (any character outside the Basic Multilingual Plane — emoji, some CJK
  // extension characters — is 2 UTF-16 units), producing an unpaired surrogate next to the
  // ellipsis that renders as mojibake. `Array.from` iterates by code point, keeping every
  // surrogate pair intact.
  const chars = Array.from(value);
  const ellipsisChars = Array.from(ellipsis);
  if (chars.length <= length) return value;
  if (length <= ellipsisChars.length) return ellipsisChars.slice(0, Math.max(0, length)).join('');

  const budget = length - ellipsisChars.length;
  if (position === 'start') return ellipsis + chars.slice(chars.length - budget).join('');
  if (position === 'middle') {
    const head = Math.ceil(budget / 2);
    return chars.slice(0, head).join('') + ellipsis + chars.slice(chars.length - (budget - head)).join('');
  }
  return chars.slice(0, budget).join('') + ellipsis;
};

export interface TransformText {
  encoding: string;
  content: string;
}

export const transformText = (content: string | ArrayBuffer): TransformText | undefined => {
  if (content instanceof ArrayBuffer) {
    const uint8Array = new Uint8Array(content);
    const asciiString = String.fromCharCode.apply(null, uint8Array as unknown as number[]);
    const detected = detect(asciiString);
    const encoding = detected.encoding || 'utf-8';
    const text = new TextDecoder(encoding).decode(content);
    if (detected.encoding && text) {
      return {
        encoding: detected.encoding,
        content: text,
      };
    }
  } else {
    console.log('Unexpected result type:', typeof content);
  }
};

/**
 * MD5 hash function implementation
 * @param str The string to hash
 * @returns The MD5 hash as a hexadecimal string
 */
export const md5 = (str: string): string => {
  if (typeof str !== 'string')
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  function rotateLeft(lValue: number, iShiftBits: number): number {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function addUnsigned(lX: number, lY: number): number {
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    } else return lResult ^ lX8 ^ lY8;
  }

  function F(x: number, y: number, z: number): number {
    return (x & y) | (~x & z);
  }

  function G(x: number, y: number, z: number): number {
    return (x & z) | (y & ~z);
  }

  function H(x: number, y: number, z: number): number {
    return x ^ y ^ z;
  }

  function I(x: number, y: number, z: number): number {
    return y ^ (x | ~z);
  }

  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(str: string): number[] {
    let lWordCount: number;
    const lMessageLength = str.length;
    const lNumberOfWordsTemp1 = lMessageLength + 8;
    const lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] || 0) | (str.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function wordToHex(lValue: number): string {
    let WordToHexValue = '',
      WordToHexValueTemp = '',
      lByte: number,
      lCount: number;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValueTemp = '0' + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
    }
    return WordToHexValue;
  }

  function utf8Encode(str: string): string {
    str = str.replace(/\r\n/g, '\n');
    let utftext = '';

    for (let n = 0; n < str.length; n++) {
      const c = str.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  const x = convertToWordArray(utf8Encode(str));
  let k: number;
  let AA: number;
  let BB: number;
  let CC: number;
  let DD: number;
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (k = 0; k < x.length; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = FF(a, b, c, d, x[k + 0], 7, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], 12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], 17, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], 7, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], 12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], 17, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], 22, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], 7, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], 12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], 17, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], 22, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], 7, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], 12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], 17, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], 22, 0x49b40821);
    a = GG(a, b, c, d, x[k + 1], 5, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], 9, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], 14, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], 5, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], 9, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], 14, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], 5, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], 9, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], 14, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], 20, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], 5, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], 14, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);
    a = HH(a, b, c, d, x[k + 5], 4, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], 11, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], 16, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], 23, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], 4, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], 4, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], 11, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], 16, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], 23, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9], 4, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], 11, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], 16, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], 23, 0xc4ac5665);
    a = II(a, b, c, d, x[k + 0], 6, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], 10, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], 15, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], 21, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], 6, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], 10, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], 15, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], 21, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], 6, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], 15, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], 21, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], 6, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], 10, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], 21, 0xeb86d391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
};
// Generate a random string
/**
 * @description: A short random-ish base-36 string.
 *
 * **Not cryptographically secure** — `Math.random()` based, like `randomString`. Use
 * `secureRandomString` / `secureToken` when the value must be unguessable.
 *
 * @param {number} len
 * @return {string}
 */
export const getRandomString = (len: number = 8): string => {
  return Math.random()
    .toString(36)
    .substring(2, len + 2);
};

// Type definitions
type FileMetadata = {
  type: 'File';
  name: string;
  mimeType: string;
  size: number;
  lastModified: number;
  content: Uint8Array;
};

type BlobMetadata = {
  type: 'Blob';
  mimeType: string;
  size: number;
  content: Uint8Array;
};

type FileChunk = {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  totalChunks: number;
  chunkIndex: number;
  data: string;
};

// Error type
class MessageCodecError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'MessageCodecError';
  }
}

/**
 * Message codec.
 * Handles every Unicode character correctly, CJK and emoji included.
 * The encoded string only contains the safe characters A-Z, a-z, 0-9, +, / and =,
 * so it is usable in URLs, cookies and similar places.
 * Encoding and decoding are exact inverses: no data is lost and the two never disagree.
 */
export const MessageCodec = {
  /**
   * Encode a message
   * @param data data to encode
   * @returns the encoded string
   */
  encode(data: any): string {
    try {
      const jsonStr = JSON.stringify(data);
      const encoder = new TextEncoder();
      const bytes = encoder.encode(jsonStr);
      // Concatenate in chunks: String.fromCharCode.apply on a large payload (a file, say)
      // throws "Maximum call stack size exceeded" and the message is silently dropped.
      let binaryStr = '';
      const CHUNK_SIZE = 0x8000;
      for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
        binaryStr += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK_SIZE)));
      }
      return btoa(binaryStr);
    } catch {
      // On failure return an empty string and let the caller (PostMessageBridge.send, for
      // instance) detect and handle it. No logging here — it would pollute the console.
      return '';
    }
  },

  /**
   * Decode a message
   * @param encodedStr the encoded string
   * @returns the decoded data
   */
  decode<T = any>(encodedStr: string): T | null {
    try {
      const binaryStr = atob(encodedStr);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const decoder = new TextDecoder();
      const jsonStr = decoder.decode(bytes);
      return JSON.parse(jsonStr);
    } catch {
      // Return null on failure (postMessage traffic from other libraries on the page does
      // not follow this protocol). No logging — foreign messages would flood the console.
      return null;
    }
  },

  /**
   * Encode a File
   * @param file the File
   * @returns the encoded string
   * @throws {MessageCodecError} when encoding the file fails
   */
  async encodeFile(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      return this.encode({
        type: 'File',
        name: file.name,
        mimeType: file.type,
        size: file.size,
        lastModified: file.lastModified,
        content: new Uint8Array(arrayBuffer),
      });
    } catch (error) {
      throw new MessageCodecError(
        `Failed to encode file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'FILE_ENCODE_ERROR',
      );
    }
  },

  /**
   * Decode a File
   * @param encoded the encoded string
   * @returns the decoded File
   * @throws {MessageCodecError} when decoding fails or the type does not match
   */
  decodeFile(encoded: string): File {
    try {
      const decoded = this.decode(encoded);
      if (decoded.type !== 'File') {
        throw new MessageCodecError(`Expected File type but got ${decoded.type}`, 'INVALID_FILE_TYPE');
      }
      const metadata = decoded as FileMetadata;
      // Make sure `content` really is an ArrayBuffer
      const content =
        metadata.content instanceof Uint8Array
          ? metadata.content.buffer.slice(0) // create a fresh ArrayBuffer
          : metadata.content;
      return new File([content as ArrayBuffer], metadata.name, {
        type: metadata.mimeType,
        lastModified: metadata.lastModified,
      });
    } catch (error) {
      if (error instanceof MessageCodecError) {
        throw error;
      }
      throw new MessageCodecError(
        `Failed to decode file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'FILE_DECODE_ERROR',
      );
    }
  },

  /**
   * Encode a Blob
   * @param blob the Blob
   * @returns the encoded string
   * @throws {MessageCodecError} when encoding fails
   */
  async encodeBlob(blob: Blob): Promise<string> {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      return this.encode({
        type: 'Blob',
        mimeType: blob.type,
        size: blob.size,
        content: new Uint8Array(arrayBuffer),
      });
    } catch (error) {
      throw new MessageCodecError(
        `Failed to encode blob: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'BLOB_ENCODE_ERROR',
      );
    }
  },

  /**
   * Decode a Blob
   * @param encoded the encoded string
   * @returns the decoded Blob
   * @throws {MessageCodecError} when decoding fails or the type does not match
   */
  decodeBlob(encoded: string): Blob {
    try {
      const decoded = this.decode(encoded);
      if (decoded.type !== 'Blob') {
        throw new MessageCodecError(`Expected Blob type but got ${decoded.type}`, 'INVALID_BLOB_TYPE');
      }
      const metadata = decoded as BlobMetadata;
      // Make sure `content` really is an ArrayBuffer
      const content =
        metadata.content instanceof Uint8Array
          ? metadata.content.buffer.slice(0) // create a fresh ArrayBuffer
          : metadata.content;
      return new Blob([content as ArrayBuffer], { type: metadata.mimeType });
    } catch (error) {
      if (error instanceof MessageCodecError) {
        throw error;
      }
      throw new MessageCodecError(
        `Failed to decode blob: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'BLOB_DECODE_ERROR',
      );
    }
  },

  /**
   * Encode a Date
   * @param date the Date
   * @returns the encoded string
   */
  encodeDate(date: Date): string {
    try {
      return this.encode({
        type: 'Date',
        value: date.toISOString(),
      });
    } catch (error) {
      console.log('Date encode error:', error);
      throw error;
    }
  },

  /**
   * Decode a Date
   * @param encodedStr the encoded string
   * @returns the decoded Date
   */
  decodeDate(encodedStr: string): Date {
    try {
      const decoded = this.decode(encodedStr);
      if (decoded.type !== 'Date') {
        throw new Error('Invalid encoded Date data');
      }
      return new Date(decoded.value);
    } catch (error) {
      console.log('Date decode error:', error);
      throw error;
    }
  },

  /**
   * Encode a RegExp
   * @param regexp the RegExp
   * @returns the encoded string
   */
  encodeRegExp(regexp: RegExp): string {
    try {
      return this.encode({
        type: 'RegExp',
        source: regexp.source,
        flags: regexp.flags,
      });
    } catch (error) {
      console.log('RegExp encode error:', error);
      throw error;
    }
  },

  /**
   * Decode a RegExp
   * @param encodedStr the encoded string
   * @returns the decoded RegExp
   */
  decodeRegExp(encodedStr: string): RegExp {
    try {
      const decoded = this.decode(encodedStr);
      if (decoded.type !== 'RegExp') {
        throw new Error('Invalid encoded RegExp data');
      }
      return new RegExp(decoded.source, decoded.flags);
    } catch (error) {
      console.log('RegExp decode error:', error);
      throw error;
    }
  },

  /**
   * Encode a Map
   * @param map the Map
   * @returns the encoded string
   */
  encodeMap<K, V>(map: Map<K, V>): string {
    try {
      return this.encode({
        type: 'Map',
        value: Array.from(map.entries()),
      });
    } catch (error) {
      console.log('Map encode error:', error);
      throw error;
    }
  },

  /**
   * Decode a Map
   * @param encodedStr the encoded string
   * @returns the decoded Map
   */
  decodeMap<K, V>(encodedStr: string): Map<K, V> {
    try {
      const decoded = this.decode(encodedStr);
      if (decoded.type !== 'Map') {
        throw new Error('Invalid encoded Map data');
      }
      return new Map(decoded.value);
    } catch (error) {
      console.log('Map decode error:', error);
      throw error;
    }
  },

  /**
   * Encode a Set
   * @param set the Set
   * @returns the encoded string
   */
  encodeSet<T>(set: Set<T>): string {
    try {
      return this.encode({
        type: 'Set',
        value: Array.from(set),
      });
    } catch (error) {
      console.log('Set encode error:', error);
      throw error;
    }
  },

  /**
   * Decode a Set
   * @param encodedStr the encoded string
   * @returns the decoded Set
   */
  decodeSet<T>(encodedStr: string): Set<T> {
    try {
      const decoded = this.decode(encodedStr);
      if (decoded.type !== 'Set') {
        throw new Error('Invalid encoded Set data');
      }
      return new Set(decoded.value);
    } catch (error) {
      console.log('Set decode error:', error);
      throw error;
    }
  },

  /**
   * Encode an Error
   * @param error the Error
   * @returns the encoded string
   */
  encodeError(error: Error): string {
    try {
      return this.encode({
        type: 'Error',
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } catch (error) {
      console.log('Error encode error:', error);
      throw error;
    }
  },

  /**
   * Decode an Error
   * @param encodedStr the encoded string
   * @returns the decoded Error
   */
  decodeError(encodedStr: string): Error {
    try {
      const decoded = this.decode(encodedStr);
      if (decoded.type !== 'Error') {
        throw new Error('Invalid encoded Error data');
      }
      const error = new Error(decoded.message);
      error.name = decoded.name;
      error.stack = decoded.stack;
      return error;
    } catch (error) {
      console.log('Error decode error:', error);
      throw error;
    }
  },

  /**
   * Encode an ArrayBuffer
   * @param buffer the ArrayBuffer
   * @returns the encoded string
   */
  encodeArrayBuffer(buffer: ArrayBuffer): string {
    try {
      return this.encode({
        type: 'ArrayBuffer',
        value: Array.from(new Uint8Array(buffer)),
      });
    } catch (error) {
      console.log('ArrayBuffer encode error:', error);
      throw error;
    }
  },

  /**
   * Decode an ArrayBuffer
   * @param encodedStr the encoded string
   * @returns the decoded ArrayBuffer
   */
  decodeArrayBuffer(encodedStr: string): ArrayBuffer {
    try {
      const decoded = this.decode(encodedStr);
      if (decoded.type !== 'ArrayBuffer') {
        throw new Error('Invalid encoded ArrayBuffer data');
      }
      return new Uint8Array(decoded.value).buffer;
    } catch (error) {
      console.log('ArrayBuffer decode error:', error);
      throw error;
    }
  },

  /**
   * Encode a TypedArray
   * @param typedArray the TypedArray
   * @returns the encoded string
   */
  encodeTypedArray(typedArray: ArrayBufferView): string {
    try {
      return this.encode({
        type: 'TypedArray',
        constructor: typedArray.constructor.name,
        value: Array.from(new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength)),
      });
    } catch (error) {
      console.log('TypedArray encode error:', error);
      return '';
    }
  },

  /**
   * Decode a TypedArray
   * @param encodedStr the encoded string
   * @returns the decoded TypedArray
   */
  decodeTypedArray(encodedStr: string): ArrayBufferView {
    try {
      const decoded = this.decode(encodedStr);
      if (decoded.type !== 'TypedArray') {
        throw new Error('Invalid encoded TypedArray data');
      }
      const TypedArrayConstructor = (window as any)[decoded.constructor];
      return new TypedArrayConstructor(decoded.value);
    } catch (error) {
      console.log('TypedArray decode error:', error);
      throw error;
    }
  },

  /**
   * Encode a File as chunks
   * @param file the File
   * @param chunkSize chunk size, defaults to 1MB
   * @returns transferable objects carrying the file metadata and the chunk data
   * @throws {MessageCodecError} when chunked encoding fails
   */
  async encodeFileChunked(
    file: File,
    chunkSize: number = 16 * 1024, // defaults to 16KB
  ): Promise<FileChunk[]> {
    try {
      if (chunkSize <= 0) {
        throw new MessageCodecError('Chunk size must be greater than 0', 'INVALID_CHUNK_SIZE');
      }

      const totalChunks = Math.ceil(file.size / chunkSize);
      const chunks: FileChunk[] = [];

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const arrayBuffer = await chunk.arrayBuffer();
        const base64 = String.fromCharCode.apply(null, Array.from(new Uint8Array(arrayBuffer)));

        chunks.push({
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          totalChunks,
          chunkIndex: i,
          data: base64,
        });
      }

      return chunks;
    } catch (error) {
      if (error instanceof MessageCodecError) {
        throw error;
      }
      throw new MessageCodecError(
        `Failed to encode file chunks: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'FILE_CHUNK_ENCODE_ERROR',
      );
    }
  },

  /**
   * Decode a chunked File
   * @param chunks the encoded file chunks
   * @returns the reconstructed File
   * @throws {MessageCodecError} when decoding fails or the chunks are incomplete
   */
  async decodeFileChunked(chunks: FileChunk[]): Promise<File> {
    try {
      if (!chunks.length) {
        throw new MessageCodecError('No chunks provided', 'NO_CHUNKS');
      }

      const { type, lastModified, totalChunks } = chunks[0];

      // Validate chunk integrity
      if (chunks.length !== totalChunks) {
        throw new MessageCodecError(
          `Missing chunks. Expected ${totalChunks}, got ${chunks.length}`,
          'INCOMPLETE_CHUNKS',
        );
      }

      // Sort by chunk index
      chunks.sort((a, b) => a.chunkIndex - b.chunkIndex);

      // Validate that the chunk indexes are contiguous
      for (let i = 0; i < chunks.length; i++) {
        if (chunks[i].chunkIndex !== i) {
          throw new MessageCodecError(`Invalid chunk index at position ${i}`, 'INVALID_CHUNK_ORDER');
        }
      }

      // Merge every chunk
      const chunksData = await Promise.all(
        chunks.map(async (chunk) => {
          const binaryStr = chunk.data;
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          return bytes;
        }),
      );

      // Build the complete ArrayBuffer
      const totalSize = chunks.reduce((sum, chunk) => sum + chunk.data.length, 0);
      const result = new Uint8Array(totalSize);
      let offset = 0;
      for (const chunkData of chunksData) {
        result.set(chunkData, offset);
        offset += chunkData.length;
      }

      return new File([result.buffer.slice(0)], chunks[0].name, {
        type,
        lastModified,
      });
    } catch (error) {
      if (error instanceof MessageCodecError) {
        throw error;
      }
      throw new MessageCodecError(
        `Failed to decode file chunks: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'FILE_CHUNK_DECODE_ERROR',
      );
    }
  },
};

/**
 * @description: Cut text to `max` characters and mark that it was cut.
 *
 * Different from `truncate`, which is for display: that one keeps a head and a tail around an
 * ellipsis so a path or a name stays recognisable. This one is for text about to cross a
 * boundary — a log line into a database row, tool output into a message, a field into a
 * fixed-size frame — where the job is to respect a hard ceiling and leave evidence that
 * something was dropped. Silent truncation is the failure this prevents: a reader who cannot
 * tell a short answer from a cut-off one will trust the cut-off one.
 *
 * @param {string} text
 * @param {number} max maximum characters to keep, before the marker
 * @param {string} marker appended when anything was dropped
 * @return {string}
 */
export const truncateWithMarker = (text: string, max: number, marker: string = '…[truncated]'): string =>
  text.length > max ? text.slice(0, max) + marker : text;

/**
 * @description: Wrap text in a Markdown code fence long enough to survive backticks inside it.
 *
 * A fixed ``` fence breaks the moment the body contains one — the block ends early and the
 * rest of the document renders as prose, which is exactly what happens when you paste a
 * Markdown snippet or a transcript into a report. CommonMark closes a fence only on a run at
 * least as long as the opening one, so the fix is to measure the longest run in the body and
 * open with one backtick more.
 *
 * @param {string} body
 * @param {string} lang info string for the opening fence
 * @return {string}
 */
export const fenceCode = (body: string, lang: string = ''): string => {
  const longestRun = Math.max(0, ...Array.from(body.matchAll(/`+/g), (match) => match[0].length));
  const fence = '`'.repeat(Math.max(3, longestRun + 1));
  return `${fence}${lang}\n${body}\n${fence}`;
};

/**
 * Drop the runs of `-` at both ends of `value`.
 *
 * A loop rather than `/^-+|-+$/g`, whose `-+` re-scans to the end from every position it can
 * start at. The collapse step before it leaves no two adjacent dashes, so the scan stays short
 * here, but that is a property of one caller rather than of the expression.
 *
 * @param {string} value
 * @return {string}
 */
const trimDashes = (value: string): string => {
  let start = 0;
  let end = value.length;
  while (start < end && value[start] === '-') start++;
  while (end > start && value[end - 1] === '-') end--;
  return value.slice(start, end);
};

/**
 * @description: Reduce text to a lowercase `a-z0-9-` slug, safe as a filename on every
 * filesystem and as a URL segment.
 *
 * Non-ASCII is dropped rather than transliterated: a guess at romanisation is wrong often
 * enough that an empty slug — which the caller can detect and replace — beats a confidently
 * mangled one. Callers that need CJK titles preserved should keep the original alongside.
 *
 * @param {string} text
 * @param {number} maxLength longest slug to return; trailing dashes are trimmed after cutting
 * @return {string} the slug, or `''` when nothing survived
 */
export const slugify = (text: string, maxLength: number = 60): string =>
  trimDashes(trimDashes(text.toLowerCase().replace(/[^a-z0-9]+/g, '-')).slice(0, maxLength));

/**
 * @description: Escape one CSV field: doubles any quote and wraps the value when it contains
 * a comma, a quote or a newline (RFC 4180).
 *
 * A leading `=`, `+`, `-` or `@` is also prefixed with a quote, because spreadsheet software
 * treats those as formulas — the "CSV injection" that turns an exported username into a
 * command when someone opens the file.
 *
 * @param {string | number} value
 * @return {string}
 */
export const csvEscape = (value: string | number): string => {
  const text = String(value);
  const guarded = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return /[",\n\r]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded;
};
