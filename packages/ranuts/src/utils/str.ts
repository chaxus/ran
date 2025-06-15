import { detect } from 'jschardet';

/**
 * @description: 将字符串转对象，比如
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
 * @description: 清除空格和换行
 * @param {*} str
 * @return {*}
 */
export const clearBr = (str = ''): string => {
  if (str.length === 0) return '';
  return str
    .replace(/\s+/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\r\n]/g, '');
};

/**
 * @description: 传入字符串和指定的格式，将字符串转成 xml
 * @param {string} xmlStr
 * @param {DOMParserSupportedType} format
 * @return {Document}
 */
export const str2Xml = (xmlStr: string, format: DOMParserSupportedType = 'text/xml'): HTMLElement | undefined => {
  if (window.DOMParser) return new window.DOMParser().parseFromString(xmlStr, format).documentElement;
  if (typeof window.ActiveXObject !== 'undefined') {
    const xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = 'false';
    xmlDoc.loadXML(xmlStr);
    return xmlDoc;
  }
  return undefined;
};

export const isString = (obj: unknown): boolean => {
  return window.toString.call(obj) === '[object String]';
};

export function randomString(len: number = 8): string {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return `${Date.now()}-${pwd}`;
}

export function changeHumpToLowerCase(str: string): string {
  const arr = str.split('');
  const lowerCase = arr.map((val) => {
    if (val.toUpperCase() === val) {
      return '_' + val.toLowerCase();
    } else {
      return val;
    }
  });
  str = lowerCase.join('');
  return str;
}

interface ClearStrOption {
  urlencoded?: boolean;
}

/**
 * @description: 去除字符串首尾的空格，encode 编码，首尾的引号
 * @param {string} str
 * @return {string}
 */
export const clearStr = (str: string, options: ClearStrOption = {}): string => {
  const { urlencoded = true } = options;
  const s = String.prototype.trim.call(str);
  return urlencoded ? decodeURIComponent(s).replace(/"|'/g, '') : s.replace(/"|'/g, '');
};

/**
 * 获取文本中包含搜索关键词的完整句子，对于重复的句子只保留最长的一个
 * @param text 原文本
 * @param searchValue 搜索关键词
 * @returns 包含关键词的完整句子数组（已去重）
 */
export function getMatchingSentences(text: string, searchValue: string): string[] {
  if (!text || !searchValue) {
    return [];
  }

  // 用于存储句子及其位置信息
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

    // 向左搜索句子开始（句号、换行符或文本开始）
    let sentenceStart = matchStart;
    while (sentenceStart > 0) {
      const char = text[sentenceStart - 1];
      if (char === '。' || char === '.' || char === '\n' || char === '！' || char === '?' || char === '？') {
        break;
      }
      sentenceStart--;
    }

    // 向右搜索句子结束（句号、换行符或文本结束）
    let sentenceEnd = matchStart + searchValue.length;
    while (sentenceEnd < text.length) {
      const char = text[sentenceEnd];
      if (char === '。' || char === '.' || char === '\n' || char === '！' || char === '?' || char === '？') {
        sentenceEnd++;
        break;
      }
      sentenceEnd++;
    }

    // 提取完整句子并去除首尾空白
    const sentence = text.slice(sentenceStart, sentenceEnd).trim();
    if (sentence) {
      sentencesInfo.push({
        sentence,
        start: sentenceStart,
        end: sentenceEnd,
      });
    }
  }

  // 对重叠的句子进行处理，只保留最长的一个
  const filteredSentences: string[] = [];
  const usedRanges: Array<{ start: number; end: number }> = [];

  // 按句子长度降序排序，这样我们会优先处理最长的句子
  sentencesInfo.sort((a, b) => b.sentence.length - a.sentence.length);

  for (const info of sentencesInfo) {
    // 检查当前句子是否与已使用的范围重叠
    const hasOverlap = usedRanges.some((range) => !(info.end <= range.start || info.start >= range.end));

    if (!hasOverlap) {
      filteredSentences.push(info.sentence);
      usedRanges.push({
        start: info.start,
        end: info.end,
      });
    }
  }

  // 去除完全重复的句子
  return [...new Set(filteredSentences)];
}

export const toString = (value: string | number): string => {
  return String(value);
};

export const checkEncoding = (uint8Array: Uint8Array): string => {
  // 将 Uint8Array 转换为字符串
  const asciiString = Array.from(uint8Array)
    .map((byte) => String.fromCharCode(byte))
    .join('');
  const detected = detect(asciiString);
  return detected.encoding || 'utf-8';
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
// 生成随机数
export const getRandomString = (len: number = 8): string => {
  return Math.random()
    .toString(36)
    .substring(2, len + 2);
};

// 添加类型定义
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

// 添加错误类型
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
 * 消息编解码工具
 * 正确处理所有 Unicode 字符，包括中文、emoji 等
 * 编码后的字符串只包含 A-Z, a-z, 0-9, +, /, = 这些安全字符
 * 适合在 URL、Cookie 等场景使用
 * 编码解码过程是双向的，不会丢失数据，不会出现编码解码不一致的问题
 */
export const MessageCodec = {
  /**
   * 编码消息
   * @param data 要编码的数据
   * @returns 编码后的字符串
   */
  encode(data: any): string {
    try {
      const jsonStr = JSON.stringify(data);
      const encoder = new TextEncoder();
      const bytes = encoder.encode(jsonStr);
      return btoa(String.fromCharCode.apply(null, Array.from(bytes)));
    } catch (error) {
      console.log('Message encode error:', error);
      return '';
    }
  },

  /**
   * 解码消息
   * @param encodedStr 编码后的字符串
   * @returns 解码后的数据
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
    } catch (error) {
      console.log('Message decode error:', error);
      return null;
    }
  },

  /**
   * 编码文件对象
   * @param file File对象
   * @returns 编码后的字符串
   * @throws {MessageCodecError} 当文件编码失败时抛出
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
   * 解码文件对象
   * @param encoded 编码后的字符串
   * @returns 解码后的 File 对象
   * @throws {MessageCodecError} 当解码失败或类型不匹配时抛出
   */
  decodeFile(encoded: string): File {
    try {
      const decoded = this.decode(encoded);
      if (decoded.type !== 'File') {
        throw new MessageCodecError(`Expected File type but got ${decoded.type}`, 'INVALID_FILE_TYPE');
      }
      const metadata = decoded as FileMetadata;
      // 确保 content 是 ArrayBuffer 类型
      const content =
        metadata.content instanceof Uint8Array
          ? metadata.content.buffer.slice(0) // 创建一个新的 ArrayBuffer
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
   * 编码 Blob 对象
   * @param blob Blob 对象
   * @returns 编码后的字符串
   * @throws {MessageCodecError} 当编码失败时抛出
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
   * 解码 Blob 对象
   * @param encoded 编码后的字符串
   * @returns 解码后的 Blob 对象
   * @throws {MessageCodecError} 当解码失败或类型不匹配时抛出
   */
  decodeBlob(encoded: string): Blob {
    try {
      const decoded = this.decode(encoded);
      if (decoded.type !== 'Blob') {
        throw new MessageCodecError(`Expected Blob type but got ${decoded.type}`, 'INVALID_BLOB_TYPE');
      }
      const metadata = decoded as BlobMetadata;
      // 确保 content 是 ArrayBuffer 类型
      const content =
        metadata.content instanceof Uint8Array
          ? metadata.content.buffer.slice(0) // 创建一个新的 ArrayBuffer
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
   * 编码 Date 对象
   * @param date Date 对象
   * @returns 编码后的字符串
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
   * 解码 Date 对象
   * @param encodedStr 编码后的字符串
   * @returns 解码后的 Date 对象
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
   * 编码 RegExp 对象
   * @param regexp RegExp 对象
   * @returns 编码后的字符串
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
   * 解码 RegExp 对象
   * @param encodedStr 编码后的字符串
   * @returns 解码后的 RegExp 对象
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
   * 编码 Map 对象
   * @param map Map 对象
   * @returns 编码后的字符串
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
   * 解码 Map 对象
   * @param encodedStr 编码后的字符串
   * @returns 解码后的 Map 对象
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
   * 编码 Set 对象
   * @param set Set 对象
   * @returns 编码后的字符串
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
   * 解码 Set 对象
   * @param encodedStr 编码后的字符串
   * @returns 解码后的 Set 对象
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
   * 编码 Error 对象
   * @param error Error 对象
   * @returns 编码后的字符串
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
   * 解码 Error 对象
   * @param encodedStr 编码后的字符串
   * @returns 解码后的 Error 对象
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
   * 编码 ArrayBuffer 对象
   * @param buffer ArrayBuffer 对象
   * @returns 编码后的字符串
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
   * 解码 ArrayBuffer 对象
   * @param encodedStr 编码后的字符串
   * @returns 解码后的 ArrayBuffer 对象
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
   * 编码 TypedArray 对象
   * @param typedArray TypedArray 对象
   * @returns 编码后的字符串
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
   * 解码 TypedArray 对象
   * @param encodedStr 编码后的字符串
   * @returns 解码后的 TypedArray 对象
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
   * 分片编码文件对象
   * @param file File 对象
   * @param chunkSize 分片大小，默认 1MB
   * @returns 包含文件信息和分片数据的可传输对象数组
   * @throws {MessageCodecError} 当分片编码失败时抛出
   */
  async encodeFileChunked(
    file: File,
    chunkSize: number = 16 * 1024, // 默认 16KB
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
   * 解码分片文件对象
   * @param chunks 编码后的文件分片数组
   * @returns 重建的File对象
   * @throws {MessageCodecError} 当分片解码失败或分片不完整时抛出
   */
  async decodeFileChunked(chunks: FileChunk[]): Promise<File> {
    try {
      if (!chunks.length) {
        throw new MessageCodecError('No chunks provided', 'NO_CHUNKS');
      }

      const { type, lastModified, totalChunks } = chunks[0];

      // 验证分片完整性
      if (chunks.length !== totalChunks) {
        throw new MessageCodecError(
          `Missing chunks. Expected ${totalChunks}, got ${chunks.length}`,
          'INCOMPLETE_CHUNKS',
        );
      }

      // 按分片索引排序
      chunks.sort((a, b) => a.chunkIndex - b.chunkIndex);

      // 验证分片索引的连续性
      for (let i = 0; i < chunks.length; i++) {
        if (chunks[i].chunkIndex !== i) {
          throw new MessageCodecError(`Invalid chunk index at position ${i}`, 'INVALID_CHUNK_ORDER');
        }
      }

      // 合并所有分片
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

      // 创建完整的 ArrayBuffer
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
