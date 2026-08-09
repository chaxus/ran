import { toHalfWidth, toString } from './str';
interface ComputeNumberResult {
  result: number;
  next: (a: string, b: number) => ComputeNumberResult;
}
/**
 * @description: Convert a percentage string into a number
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
 * @description: Clamp a value between a minimum and a maximum
 * @return {*}
 */
export const range = (num: number, min: number = 0, max: number = 1): number => {
  return Math.min(max, Math.max(min, num));
};

/**
 * Arithmetic that works around floating-point precision.
 * @param {number} a left operand
 * @param {"+"|"-"|"*"|"/"} type operation
 * @param {number} b right operand
 * @example
 * ```js
 * // chainable
 * const res = computeNumber(1.3, "-", 1.2).next("+", 1.5).next("*", 2.3).next("/", 0.2).result;
 * console.log(res);
 * ```
 */
export class Mathjs {
  /**
   * Number of digits after the decimal point
   * @param {number} n the number
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
// Arithmetic
export function mathjs(a: number, type: string, b: number): ComputeNumberResult {
  /**
   * Number of digits after the decimal point
   * @param {number} n the number
   */
  function getDecimalLength(n: number) {
    const [_, decimal] = n.toString().split('.');
    return decimal ? decimal.length : 0;
  }
  /**
   * Correct the decimal point
   * @description Guards against results like `33.33333*100000 = 3333332.9999999995` and `33.33*10 = 333.29999999999995`
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
    /** the result so far */
    result,
    /**
     * Continue the calculation
     * @param {"+"|"-"|"*"|"/"} nextType next operation
     * @param {number} nextValue next operand
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

// Prefix a number with its sign
export const addNumSym = (value: string | number, flag?: string | number): string => {
  if (toString(value).startsWith('+') || toString(value).startsWith('-')) {
    return toString(value);
  }
  if (flag) {
    return Number(flag || 0) > 0 ? `+${toString(value)}` : toString(value);
  }
  return Number(value || 0) > 0 ? `+${toString(value)}` : toString(value);
};

/* ── Numbers written for humans ────────────────────────────────────────────
 * Parse ordinals as people write them: 「第二十三章」, "Chapter XIV", "Part Three".
 * All three parsers share one rule: **return null unless the whole input parsed**, never a
 * guess. These are mostly used to decide "is this line a heading", and one wrong number
 * poisons the entire sequence check.
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
 * @description: Chinese numerals to Arabic, covering 「十五」「二十三」「一百零三」「一千零一」「三万」.
 * Simplified and traditional alike (万/萬); full-width digits are normalised first. Returns
 * null when an unrecognised character is present.
 * @param {string} value
 * @return {number | null}
 * @example
 * ```ts
 * parseChineseNumber('二十三'); // 23
 * parseChineseNumber('一百零三'); // 103
 * parseChineseNumber('第三章'); // null — contains non-numeral characters, slice the number out first
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
      // In 「十五」 the 「十」 has no digit before it, so it counts as 1
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
 * @description: Roman numerals to Arabic (either case, handling subtractive forms such as IV / IX). Returns null for invalid input.
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
 * @description: English ordinals to numbers, tried in order: Arabic digits, number words
 * (one–twenty), then Roman numerals. Returns null when none match.
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

/**
 * @description: Clamp `value` into the inclusive range `[min, max]`.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

/**
 * @description: Linear interpolation from `a` to `b` by `t` (t=0 → a, t=1 → b). Not clamped.
 * @param {number} a start value
 * @param {number} b end value
 * @param {number} t interpolation factor
 * @return {number}
 */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * @description: Inverse of `lerp` — where `value` sits between `a` and `b`, as 0..1. Returns 0 when `a === b`. Not clamped.
 * @param {number} a start value
 * @param {number} b end value
 * @param {number} value probed value
 * @return {number}
 */
export const inverseLerp = (a: number, b: number, value: number): number => (a === b ? 0 : (value - a) / (b - a));

/**
 * @description: Linearly remap `value` from range `[a1, a2]` onto `[b1, b2]`. Not clamped (GLSL-style map).
 * @param {number} value
 * @param {number} a1 input range start
 * @param {number} a2 input range end
 * @param {number} b1 output range start
 * @param {number} b2 output range end
 * @return {number}
 */
export const remap = (value: number, a1: number, a2: number, b1: number, b2: number): number =>
  b1 + ((value - a1) * (b2 - b1)) / (a2 - a1);

/**
 * @description: Remap `value` from `[a1, a2]` onto `[b1, b2]` and clamp to the output range — the shader `fit`.
 * @param {number} value
 * @param {number} a1 input range start
 * @param {number} a2 input range end
 * @param {number} b1 output range start
 * @param {number} b2 output range end
 * @return {number}
 */
export const fit = (value: number, a1: number, a2: number, b1: number, b2: number): number =>
  clamp(remap(value, a1, a2, b1, b2), Math.min(b1, b2), Math.max(b1, b2));

/**
 * @description: Linear ramp — 0 below `edge0`, 1 above `edge1`, a straight line between (the shader `linearstep`, no smoothing).
 * @param {number} edge0
 * @param {number} edge1
 * @param {number} x
 * @return {number}
 */
export const linearstep = (edge0: number, edge1: number, x: number): number =>
  edge0 === edge1 ? (x < edge0 ? 0 : 1) : clamp((x - edge0) / (edge1 - edge0), 0, 1);

/**
 * @description: Smooth Hermite interpolation between 0 and 1 for `edge0 < x < edge1` (GLSL `smoothstep`).
 * @param {number} edge0
 * @param {number} edge1
 * @param {number} x
 * @return {number}
 */
export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = linearstep(edge0, edge1, x);
  return t * t * (3 - 2 * t);
};
