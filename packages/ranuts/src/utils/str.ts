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
