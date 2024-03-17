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
 * @description: 传入字符串和指定的格式，将字符串转成xml
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
 * @description: 去除字符串首尾的空格，encode编码，首尾的引号
 * @param {string} str
 * @return {string}
 */
export const clearStr = (str: string, options: ClearStrOption = {}): string => {
  const { urlencoded = true } = options;
  const s = String.prototype.trim.call(str);
  return urlencoded ? decodeURIComponent(s).replace(/"|'/g, '') : s.replace(/"|'/g, '');
};
