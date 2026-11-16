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
 * Convert numerals as people write them: Chinese「二十三」「二零二四」, Roman "XIV",
 * English "Three". All three share one rule: **return null unless the whole input
 * parsed**, never a partial guess.
 */

const CN_DIGITS: Record<string, number> = {
  零: 0,
  〇: 0,
  一: 1,
  二: 2,
  两: 2,
  兩: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  // Financial (大写) forms, simplified and traditional.
  壹: 1,
  贰: 2,
  貳: 2,
  叁: 3,
  參: 3,
  叄: 3,
  肆: 4,
  伍: 5,
  陆: 6,
  陸: 6,
  柒: 7,
  捌: 8,
  玖: 9,
};

const CN_UNITS: Record<string, number> = {
  十: 10,
  百: 100,
  千: 1000,
  拾: 10,
  佰: 100,
  仟: 1000,
};

/** Section marks, largest first: a section's head is everything before its mark (「一万亿」→ 一万 × 亿). */
const CN_SECTIONS: readonly (readonly [string, number])[] = [
  ['亿', 100_000_000],
  ['万', 10_000],
];

const CN_VARIANTS: Record<string, string> = { 萬: '万', 億: '亿', 〇: '零' };

/** Shorthand tens: 廿 = 二十，卅 = 三十，卌 = 四十。*/
const CN_TENS: Record<string, string> = {
  廿: '二十',
  卅: '三十',
  卌: '四十',
};

/** Below 万: digits paired with 千 / 百 / 十, each unit once and in descending order. */
const parseChineseGroup = (group: string): number | null => {
  let total = 0;
  let digit: number | null = null;
  let lastUnit = 10_000;
  let zero = false;
  for (const char of group) {
    const value = CN_DIGITS[char];
    if (value !== undefined) {
      // Unit form never has two digits in a row (「一百二零」); 零 only follows a unit.
      if (digit !== null) return null;
      if (value === 0) zero = true;
      else digit = value;
      continue;
    }
    const unit = CN_UNITS[char];
    if (unit === undefined || unit >= lastUnit) return null;
    // Only 十 may drop its 一 here (「一百十」); a leading bare 百 / 千 was given its 一 by the caller.
    if (digit === null && unit !== 10) return null;
    total += (digit ?? 1) * unit;
    lastUnit = unit;
    digit = null;
    zero = false;
  }
  if (digit === null) return total;
  // 「一百一」omits the next-smaller unit → 110; 「一百零一」keeps ones via 零 → 101.
  return total + (!zero && lastUnit >= 100 && lastUnit < 10_000 ? (digit * lastUnit) / 10 : digit);
};

const parseChineseSections = (text: string, sections: typeof CN_SECTIONS): number | null => {
  if (sections.length === 0) return parseChineseGroup(text);
  const [[mark, size], ...smaller] = sections;
  const at = text.indexOf(mark);
  if (at < 0) return parseChineseSections(text, smaller);
  const head = parseChineseSections(text.slice(0, at), smaller);
  if (!head) return null;
  let tail = text.slice(at + 1);
  // 「一万五」: a lone digit after the mark is the next-smaller unit → 15000.
  const lone = tail.length === 1 ? CN_DIGITS[tail] : undefined;
  if (lone) return head * size + (lone * size) / 10;
  if (tail.startsWith('零')) tail = tail.slice(1);
  const rest = parseChineseSections(tail, smaller);
  return rest === null ? null : head * size + rest;
};

/**
 * @description: Chinese numerals to Arabic — unit forms (「十五」「一百零三」「三万」「一亿」),
 * consecutive digits (「二零二四」), shorthand tens (「廿三」), and common abbreviations
 * (「一百一」→ 110). A bare leading unit means one of that unit (「百」→ 100, 「千万」→ 1e7,
 * 「亿」→ 1e8). Sections stack (「一万亿」→ 1e12). Simplified and traditional alike
 * (两/兩，万/萬，亿/億), financial forms too (「壹佰贰拾」「貳萬」); full-width digits are normalised first. Returns null when the input is not
 * a well-formed numeral: an unrecognised character, a repeated or out-of-order unit
 * (「一百百」「十十」「万万」), or a bare unit after the first character.
 * @param {string} value
 * @return {number | null}
 * @example
 * ```ts
 * parseChineseNumber('二十三'); // 23
 * parseChineseNumber('廿三'); // 23
 * parseChineseNumber('二零二四'); // 2024
 * parseChineseNumber('一百一'); // 110
 * parseChineseNumber('一亿两千万'); // 120000000
 * parseChineseNumber('一万亿'); // 1000000000000
 * parseChineseNumber('壹仟贰佰叁拾肆'); // 1234
 * parseChineseNumber('一百百'); // null — repeated unit
 * parseChineseNumber('第三章'); // null — contains non-numeral characters, slice the number out first
 * ```
 */
export const parseChineseNumber = (value: string): number | null => {
  let text = toHalfWidth(value.trim());
  if (/^\d+$/.test(text)) return Number.parseInt(text, 10);
  text = Array.from(text, (char) => CN_TENS[char] ?? CN_VARIANTS[char] ?? char).join('');
  if (text.length === 0) return null;
  // 「二零二四」「一二三」: digits alone read positionally.
  if (Array.from(text).every((char) => CN_DIGITS[char] !== undefined)) {
    return Array.from(text).reduce((total, char) => total * 10 + CN_DIGITS[char], 0);
  }
  // A leading bare unit stands for one of it: 「百」「千万」「亿」.
  if (CN_UNITS[text[0]] !== undefined || CN_SECTIONS.some(([mark]) => mark === text[0])) text = `一${text}`;
  return parseChineseSections(text, CN_SECTIONS);
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

/** Binary units, which is what a file manager reports and therefore what a reader expects. */
const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

/**
 * @description: Format a byte count for a person to read.
 *
 * Steps in units of 1024 and keeps one decimal from KB up, because "1.4 MB" is the number a
 * file manager shows for the same file and a reader comparing the two should not have to
 * wonder. Bytes get no decimal — a fraction of a byte is not a thing.
 *
 * @param {number} bytes Byte count. Negative or non-finite input yields `'0 B'`, since there
 * is no honest reading of a file with a negative size.
 * @return {string}
 * @example
 * ```ts
 * formatBytes(0);        // '0 B'
 * formatBytes(999);      // '999 B'
 * formatBytes(1024);     // '1.0 KB'
 * formatBytes(1536);     // '1.5 KB'
 * formatBytes(1048576);  // '1.0 MB'
 * ```
 */
export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return unit === 0 ? `${Math.round(value)} B` : `${value.toFixed(1)} ${BYTE_UNITS[unit]}`;
};
