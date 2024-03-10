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
