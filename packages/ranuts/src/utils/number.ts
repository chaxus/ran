import { toHalfWidth, toString } from './str';
interface ComputeNumberResult {
  result: number;
  next: (a: string, b: number) => ComputeNumberResult;
}
/**
 * @description: 百分比转换成数字
 * @param {string} str
 * @return {*}
 */
export const perToNum = (str: string = ''): number => {
  if (str.length === 0) return 0;
  if (str.endsWith('%')) {
    const value = Number(str.replace('%', ''));
    return value > 1 ? value / 100 : value;
  } else {
    return Number(str);
  }
};

/**
 * @description: 限制最大和最小值
 * @return {*}
 */
export const range = (num: number, min: number = 0, max: number = 1): number => {
  return Math.min(max, Math.max(min, num));
};

/**
 * 数字运算（主要用于小数点精度问题）
 * @param {number} a 前面的值
 * @param {"+"|"-"|"*"|"/"} type 计算方式
 * @param {number} b 后面的值
 * @example
 * ```js
 * // 可链式调用
 * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
 * console.log(res);
 * ```
 */
export class Mathjs {
  /**
   * 获取数字小数点的长度
   * @param {number} n 数字
   */
  getDecimalLength = (n: number): number => {
    const [_, decimal] = n.toString().split('.');
    return decimal ? decimal.length : 0;
  };
  amend = (n: number, precision = 15): number => parseFloat(Number(n).toPrecision(precision));
  power = (a: number, b: number): number => Math.pow(10, Math.max(this.getDecimalLength(a), this.getDecimalLength(b)));
  static handleMethod = (l: number, r: number): ((type: string) => number | undefined) => {
    const mathjs = new Mathjs();
    const { power, amend } = mathjs;
    const pow = power(l, r);
    const a = amend(l * pow);
    const b = amend(r * pow);
    return (type: string) => {
      switch (type) {
        case '+':
          return (a + b) / pow;
        case '-':
          return (a - b) / pow;
        case '*':
          return (a * b) / (pow * pow);
        case '/':
          return a / b;
      }
    };
  };
  static add = (a: number, b: number): number | undefined => {
    return this.handleMethod(a, b)('+');
  };
  static divide = (a: number, b: number): number | undefined => {
    return this.handleMethod(a, b)('/');
  };
  static multiply = (a: number, b: number): number | undefined => {
    return this.handleMethod(a, b)('*');
  };
  static subtract = (a: number, b: number): number | undefined => {
    return this.handleMethod(a, b)('-');
  };
}
// 数字运算
export function mathjs(a: number, type: string, b: number): ComputeNumberResult {
  /**
   * 获取数字小数点的长度
   * @param {number} n 数字
   */
  function getDecimalLength(n: number) {
    const [_, decimal] = n.toString().split('.');
    return decimal ? decimal.length : 0;
  }
  /**
   * 修正小数点
   * @description 防止出现 `33.33333*100000 = 3333332.9999999995` && `33.33*10 = 333.29999999999995` 这类情况做的处理
   * @param {number} n
   */
  const amend = (n: number, precision = 15) => parseFloat(Number(n).toPrecision(precision));
  const power = Math.pow(10, Math.max(getDecimalLength(a), getDecimalLength(b)));
  let result = 0;

  a = amend(a * power);
  b = amend(b * power);

  switch (type) {
    case '+':
      result = (a + b) / power;
      break;
    case '-':
      result = (a - b) / power;
      break;
    case '*':
      result = (a * b) / (power * power);
      break;
    case '/':
      result = a / b;
      break;
  }

  result = amend(result);

  return {
    /** 计算结果 */
    result,
    /**
     * 继续计算
     * @param {"+"|"-"|"*"|"/"} nextType 继续计算方式
     * @param {number} nextValue 继续计算的值
     */
    next: (nextType: string, nextValue: number) => {
      return mathjs(result, nextType, nextValue);
    },
  };
}

export const transformNumber = (value: string, locale = 'zh-CN', precision = 2, fixed = 2): string => {
  let units = ['', 'K', 'M', 'B', 'T'];
  let setpSize = 3;
  if (locale === 'zh-CN') {
    units = ['', ' 万', ' 亿', ' 万亿'];
    setpSize = 4;
  }
  if (locale === 'zh-HK') {
    units = ['', ' 萬', ' 億', ' 萬億'];
    setpSize = 4;
  }

  if (!/^[+-]?\d+(?:\.\d+)?$/.test(value)) {
    return '--';
  }
  const length = parseInt(value).toString().length;
  const unitIndex = Math.min(Math.floor((length - 1) / setpSize), units.length - 1);
  const formattedValue = Mathjs.divide(Number(value), 10 ** (unitIndex * setpSize))?.toFixed(precision);
  return Number(formattedValue).toFixed(fixed) + units[unitIndex];
};

// 给数字添加符号
export const addNumSym = (value: string | number, flag?: string | number): string => {
  if (toString(value).startsWith('+') || toString(value).startsWith('-')) {
    return toString(value);
  }
  if (flag) {
    return Number(flag || 0) > 0 ? `+${toString(value)}` : toString(value);
  }
  return Number(value || 0) > 0 ? `+${toString(value)}` : toString(value);
};

/* ── 自然语言里的数字 ──────────────────────────────────────────────────────
 * 解析人写给人看的序号：「第二十三章」「Chapter XIV」「Part Three」。
 * 三个解析器统一约定：**无法完整解析就返回 null**，绝不返回猜测值——
 * 这类解析多用于「这行是不是标题」的判断，一个错误的数字会污染整条序列校验。
 */

const CN_DIGITS: Record<string, number> = {
  零: 0,
  〇: 0,
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
};

const CN_UNITS: Record<string, number> = {
  十: 10,
  百: 100,
  千: 1000,
};

/**
 * @description: 中文数字转阿拉伯数字，支持「十五」「二十三」「一百零三」「一千零一」「三万」，
 * 简繁通用（万/萬），全角数字先归一化。混入无法识别的字符时返回 null。
 * @param {string} value
 * @return {number | null}
 * @example
 * ```ts
 * parseChineseNumber('二十三'); // 23
 * parseChineseNumber('一百零三'); // 103
 * parseChineseNumber('第三章'); // null（含非数字字符，请先截出编号段）
 * ```
 */
export const parseChineseNumber = (value: string): number | null => {
  const text = toHalfWidth(value.trim());
  if (/^\d+$/.test(text)) return Number.parseInt(text, 10);
  if (text.length === 0) return null;
  let result = 0;
  let section = 0;
  let current = 0;
  for (const char of text) {
    if (CN_DIGITS[char] !== undefined) {
      current = CN_DIGITS[char];
    } else if (CN_UNITS[char] !== undefined) {
      // 「十五」的「十」前面没有数字，按 1 处理
      section += (current || (char === '十' ? 1 : 0)) * CN_UNITS[char];
      current = 0;
    } else if (char === '万' || char === '萬') {
      result = (result + section + current) * 10000;
      section = 0;
      current = 0;
    } else {
      return null;
    }
  }
  return result + section + current;
};

const ROMAN_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

/**
 * @description: 罗马数字转阿拉伯数字（大小写皆可，按减法记法处理 IV / IX）。非法输入返回 null。
 * @param {string} value
 * @return {number | null}
 * @example
 * ```ts
 * parseRomanNumber('XIV'); // 14
 * parseRomanNumber('mcmxciv'); // 1994
 * ```
 */
export const parseRomanNumber = (value: string): number | null => {
  const text = value.trim().toUpperCase();
  if (!/^[IVXLCDM]+$/.test(text)) return null;
  let result = 0;
  for (let i = 0; i < text.length; i++) {
    const current = ROMAN_VALUES[text[i]];
    const next = ROMAN_VALUES[text[i + 1]];
    if (next && current < next) {
      result -= current;
    } else {
      result += current;
    }
  }
  return result;
};

const EN_NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
};

/**
 * @description: 英文序号转数字：阿拉伯数字 / 英文数词（one–twenty）/ 罗马数字，依次尝试。
 * 都不匹配返回 null。
 * @param {string} value
 * @return {number | null}
 * @example
 * ```ts
 * parseEnglishNumber('Three'); // 3
 * parseEnglishNumber('XII'); // 12
 * ```
 */
export const parseEnglishNumber = (value: string): number | null => {
  const text = value.trim().toLowerCase();
  if (/^\d+$/.test(text)) return Number.parseInt(text, 10);
  if (EN_NUMBER_WORDS[text] !== undefined) return EN_NUMBER_WORDS[text];
  return parseRomanNumber(text);
};
