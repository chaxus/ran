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
    .replace(/<\/?.+?>/g, '')
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
  return toString.call(obj) === '[object String]';
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
