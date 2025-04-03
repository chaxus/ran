import { memoize } from '@/utils/memoize';
/**
 * @description: 对象转 url 字符串
 * @param {*} data
 * @return {*}
 */
export function querystring(data = {}): string {
  if (typeof data !== 'object') {
    throw new TypeError('param must be object');
  }
  return Object.entries(data)
    .reduce(
      (searchParams, [name, value]) =>
        value === undefined || value == null
          ? searchParams
          : (searchParams.append(decodeURIComponent(name), decodeURIComponent(value)), searchParams),
      new URLSearchParams(),
    )
    .toString();
}

const transitionJsonToString = (jsonObj: string | JSON, callback: (error: Error) => void = () => {}) => {
  // 转换后的 jsonObj 受体对象
  let _jsonObj: string = '';
  // 判断传入的 jsonObj 对象是不是字符串，如果是字符串需要先转换为对象，再转换为字符串，这样做是为了保证转换后的字符串为双引号
  if (Object.prototype.toString.call(jsonObj) !== '[object String]') {
    try {
      _jsonObj = JSON.stringify(jsonObj);
    } catch (error) {
      // 转换失败错误信息
      // console.error('您传递的 json 数据格式有误，请核对...');
      // console.error(error);
      callback(error);
    }
  } else {
    try {
      jsonObj = typeof jsonObj === 'string' ? jsonObj.replace(/'/g, '"') : JSON.stringify(jsonObj);
      _jsonObj = JSON.stringify(JSON.parse(jsonObj));
    } catch (error) {
      // 转换失败错误信息
      // console.error('您传递的 json 数据格式有误，请核对...');
      // console.error(error);
      callback(error);
    }
  }
  return _jsonObj;
};
// callback 为数据格式化错误的时候处理函数
export const formatJson = (jsonObj: string, callback = () => {}): string => {
  // 转换后的字符串变量
  let formatted = '';
  // 换行缩进位数
  let pad = 0;
  // 一个 tab 对应空格位数
  const PADDING = '    ';
  // json 对象转换为字符串变量
  let jsonString = transitionJsonToString(jsonObj, callback);
  if (!jsonString) {
    return jsonString;
  }
  // 存储需要特殊处理的字符串段
  const _index: { start: number; end: number }[] = [];
  // 存储需要特殊处理的"再数组中的开始位置变量索引
  let _indexStart: number | null = null;
  // 存储需要特殊处理的"再数组中的结束位置变量索引
  let _indexEnd: number | null = null;
  // 将 jsonString 字符串内容通过\r\n符分割成数组
  let jsonArray: string[] = [];
  // 正则匹配到{,}符号则在两边添加回车换行
  jsonString = jsonString.replace(/([{}])/g, '\r\n$1\r\n');
  // 正则匹配到 [,] 符号则在两边添加回车换行
  jsonString = jsonString.replace(/([[\]])/g, '\r\n$1\r\n');
  // 正则匹配到，符号则在两边添加回车换行
  jsonString = jsonString.replace(/,/g, ',\r\n');
  // 正则匹配到要超过一行的换行需要改为一行
  jsonString = jsonString.replace(/\r\n\r\n/g, '\r\n');
  // 正则匹配到单独处于一行的，符号时需要去掉换行，将，置于同行
  jsonString = jsonString.replace(/\r\n,/g, ',');
  // 特殊处理双引号中的内容
  jsonArray = jsonString.split('\r\n');
  jsonArray.forEach(function (node, index) {
    // 获取当前字符串段中"的数量
    const num = node.match(/"/g) ? node.match(/"/g)?.length || 0 : 0;
    // 判断 num 是否为奇数来确定是否需要特殊处理
    if (num % 2 && !_indexStart) {
      _indexStart = index;
    }
    if (num % 2 && _indexStart && _indexStart !== index) {
      _indexEnd = index;
    }
    // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
    if (_indexStart && _indexEnd) {
      _index.push({
        start: _indexStart,
        end: _indexEnd,
      });
      _indexStart = null;
      _indexEnd = null;
    }
  });
  // 开始处理双引号中的内容，将多余的"去除
  _index.reverse().forEach(function (item) {
    const newArray = jsonArray.slice(item.start, item.end + 1);
    jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(''));
  });
  // 奖处理后的数组通过\r\n连接符重组为字符串
  jsonString = jsonArray.join('\r\n');
  // 将匹配到：后为回车换行加大括号替换为冒号加大括号
  jsonString = jsonString.replace(/:\r\n\{/g, ':{');
  // 将匹配到：后为回车换行加中括号替换为冒号加中括号
  jsonString = jsonString.replace(/:\r\n\[/g, ':[');
  // 将上述转换后的字符串再次以\r\n分割成数组
  jsonArray = jsonString.split('\r\n');
  // 将转换完成的字符串根据 PADDING 值来组合成最终的形态
  jsonArray.forEach(function (item) {
    // console.log(item)
    let i = 0;
    // 表示缩进的位数，以 tab 作为计数单位
    let indent = 0;
    // 表示缩进的位数，以空格作为计数单位
    let padding = '';
    if (/\{$/.test(item) || /\[$/.test(item)) {
      // 匹配到以{和 [结尾的时候 indent 加 1
      indent += 1;
    } else if (/\}$/.test(item) || /\]$/.test(item) || /\},$/.test(item) || /\],$/.test(item)) {
      // 匹配到以}和] 结尾的时候 indent 减 1
      if (pad !== 0) {
        pad -= 1;
      }
    } else {
      indent = 0;
    }
    for (i = 0; i < pad; i++) {
      padding += PADDING;
    }
    formatted += padding + item + '\r\n';
    pad += indent;
  });
  // 返回的数据需要去除两边的空格
  return formatted.trim();
};

/**
 * @description: 过滤对象的属性，去除对象中在list数组里面有的属性，返回一个新对象，一般是用于去除空字符和null
 * @param {Object} obj 传入对象
 * @param {Array} list 传入数组
 * @return {Object}
 */

export const filterObj = (obj: Record<string, unknown>, list: Array<string>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  Object.keys(obj).forEach((item) => {
    if (!list.includes(item)) {
      result[item] = obj[item];
    }
  });
  return result;
};

type Obj = Record<string, any>;
/**
 * @description: 合并对象
 * @param {Obj} a
 * @param {Obj} b
 * @return {*}
 */
export const merge = (a: Obj, b?: Obj): Obj => {
  if (a && b) {
    for (const key in b) {
      a[key] = b[key];
    }
  }
  return a;
};

/**
 * 重写对象上面的某个属性
 *
 * @export
 * @param {IAnyObject} source 需要被重写的对象
 * @param {string} name 需要被重写对象的 key
 * @param {(...args: any[]) => any} replacement 以原有的函数作为参数，执行并重写原有函数
 * @param {boolean} isForced 是否强制重写（可能原先没有该属性）
 */
export function replaceOld(
  source: any,
  name: string,
  replacement: (...args: unknown[]) => unknown,
  isForced?: boolean,
): void {
  if (typeof source === 'undefined') return;
  if (name in source || isForced) {
    const original = source[name];
    const wrapped = replacement(original);
    if (typeof wrapped === 'function') {
      source[name] = wrapped;
    }
  }
}

/**
 * @description: 将 exports 对象拼接到 obj 上，并冻结 obj
 * @param {Object} obj
 * @param {Object} exports
 * @return {Object}
 */
export const mergeExports = (obj: Record<string, string>, exports: Record<string, string>): Record<string, string> => {
  const descriptors = Object.getOwnPropertyDescriptors(exports);
  for (const name of Object.keys(descriptors)) {
    const descriptor = descriptors[name];
    if (descriptor.get) {
      const fn = descriptor.get;
      Object.defineProperty(obj, name, {
        configurable: false,
        enumerable: true,
        get: memoize(fn),
      });
    } else if (typeof descriptor.value === 'object') {
      Object.defineProperty(obj, name, {
        configurable: false,
        enumerable: true,
        writable: false,
        value: mergeExports({}, descriptor.value),
      });
    } else {
      throw new Error('Exposed values must be either a getter or an nested object');
    }
  }
  return Object.freeze(obj);
};

/**
 * @description: 给全局对象上增加属性
 * @param {string} name
 * @param {string} value
 * @return {*}
 */
export const setAttributeByGlobal = (name: string, value: unknown): void => {
  if (typeof window !== 'undefined') {
    window[name as any] = value as any;
  }
  if (typeof global !== 'undefined') {
    // @ts-expect-error global
    global[name as any as keyof typeof global] = value as any;
  }
};

/**
 * 深度比较两个值是否相等
 * 实现类似 Lodash 的 isEqual 函数
 */

/**
 * 检查两个值是否为基本相同的值
 * 处理特殊情况如 NaN, -0/+0
 */
export function sameValueZero(x: any, y: any): boolean {
  // 处理 NaN 情况
  if (x === x ? y !== y : y === y) {
    return false;
  }

  // 处理 -0 和 +0 情况
  if (x === 0 && y === 0) {
    return 1 / x === 1 / y;
  }

  // 常规基本类型比较
  return x === y;
}

/**
 * 判断是否为类对象
 */
export function isObjectLike(value: any): boolean {
  return typeof value === 'object' && value !== null;
}

/**
 * 获取对象的标签
 */
export function getTag(value: any): string {
  return Object.prototype.toString.call(value);
}

/**
 * 检查是否是类数组对象
 */
export function isArrayLike(value: any): boolean {
  if (value == null) {
    return false;
  }

  const length = value.length;
  return typeof length === 'number' && length >= 0 && length % 1 === 0 && length <= Number.MAX_SAFE_INTEGER;
}

/**
 * 深度比较两个值是否相等
 * @param value 第一个值
 * @param other 第二个值
 * @param seen 已经比较过的对象（用于处理循环引用）
 * @returns 两个值是否相等
 */
export function isEqual(value: any, other: any, seen = new Map()): boolean {
  // 处理引用相同的情况
  if (value === other) {
    return true;
  }

  // 一个为 null/undefined，另一个不是时
  if (value == null || other == null) {
    return value === other;
  }

  // 处理 NaN 情况
  if (value !== value && other !== other) {
    return true;
  }

  // 类型不同
  const valueType = typeof value;
  const otherType = typeof other;

  if (valueType !== otherType) {
    return false;
  }

  // 处理非对象类型
  if (valueType !== 'object') {
    return value === other;
  }

  // 处理特殊对象类型
  const valueTag = getTag(value);
  const otherTag = getTag(other);

  if (valueTag !== otherTag) {
    return false;
  }

  // 检查循环引用
  if (seen.has(value)) {
    return seen.get(value) === other;
  }

  // 记录当前比较的对象
  seen.set(value, other);

  // 处理数组
  if (valueTag === '[object Array]') {
    if (value.length !== other.length) {
      return false;
    }

    for (let i = 0; i < value.length; i++) {
      if (!isEqual(value[i], other[i], seen)) {
        return false;
      }
    }

    return true;
  }

  // 处理 Date 对象
  if (valueTag === '[object Date]') {
    return +value === +other;
  }

  // 处理 RegExp 对象
  if (valueTag === '[object RegExp]') {
    return value.toString() === other.toString();
  }

  // 处理 Map 对象
  if (valueTag === '[object Map]') {
    if (value.size !== other.size) {
      return false;
    }

    // 比较 Map 的键值对
    let matched = true;
    value.forEach((val: any, key: any) => {
      if (matched) {
        if (!other.has(key) || !isEqual(val, other.get(key), seen)) {
          matched = false;
        }
      }
    });

    return matched;
  }

  // 处理 Set 对象
  if (valueTag === '[object Set]') {
    if (value.size !== other.size) {
      return false;
    }

    // 由于 Set 不能保证迭代顺序一致，我们将元素转换为数组再比较
    const valueArray = Array.from(value);
    const otherArray = Array.from(other);

    // 为每个元素找到匹配项
    return valueArray.every((item) => {
      return otherArray.some((otherItem) => isEqual(item, otherItem, seen));
    });
  }

  // 处理对象
  const valueKeys = Object.keys(value);
  const otherKeys = Object.keys(other);

  if (valueKeys.length !== otherKeys.length) {
    return false;
  }

  // 检查所有键是否存在且值相等
  for (const key of valueKeys) {
    if (!Object.prototype.hasOwnProperty.call(other, key) || !isEqual(value[key], other[key], seen)) {
      return false;
    }
  }

  return true;
}

// 示例用法
// const obj1 = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
// const obj2 = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
// console.log(isEqual(obj1, obj2)); // true

/**
 * 深克隆函数，支持各种复杂数据类型和循环引用
 * @param value 需要深度克隆的值
 * @param cloneMap 用于跟踪已克隆的对象，避免循环引用问题
 * @returns 克隆后的值
 */
export const cloneDeep = <T>(value: T, cloneMap = new WeakMap<object, any>()): T => {
  // 处理非对象类型或 null
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // 检查是否存在循环引用
  if (cloneMap.has(value as object)) {
    return cloneMap.get(value as object);
  }

  // 处理日期对象
  if (value instanceof Date) {
    return new Date(value.getTime()) as unknown as T;
  }

  // 处理正则表达式
  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as unknown as T;
  }

  // 处理数组
  if (Array.isArray(value)) {
    const result: any[] = [];
    // 先将结果存入 cloneMap，以便处理循环引用
    cloneMap.set(value as object, result);

    // 递归克隆数组中的每个元素
    for (let i = 0; i < value.length; i++) {
      result[i] = cloneDeep(value[i], cloneMap);
    }

    return result as unknown as T;
  }

  // 处理 Map 对象
  if (value instanceof Map) {
    const result = new Map();
    cloneMap.set(value as object, result);

    value.forEach((val, key) => {
      // 对 Map 的键和值都进行深度克隆
      result.set(typeof key === 'object' && key !== null ? cloneDeep(key, cloneMap) : key, cloneDeep(val, cloneMap));
    });

    return result as unknown as T;
  }

  // 处理 Set 对象
  if (value instanceof Set) {
    const result = new Set();
    cloneMap.set(value as object, result);

    value.forEach((val) => {
      // 对 Set 中的每个值进行深度克隆
      result.add(cloneDeep(val, cloneMap));
    });

    return result as unknown as T;
  }

  // 处理 Symbol 属性的对象
  if (typeof value === 'object' && (value as object).constructor === Object) {
    const result: Record<string | symbol, any> = {};
    cloneMap.set(value as object, result);

    // 处理普通属性和 Symbol 属性
    [...Object.getOwnPropertyNames(value), ...Object.getOwnPropertySymbols(value)].forEach((key) => {
      const objValue = value as Record<string | symbol, unknown>;
      result[key] = cloneDeep(objValue[key], cloneMap);
    });

    return result as unknown as T;
  }

  // 处理其他类型的对象 (如 Error, Blob, File 等)
  try {
    // 尝试使用对象的构造函数创建新实例
    const prototype = Object.getPrototypeOf(value);
    const Constructor = prototype.constructor;
    const result = new Constructor();

    cloneMap.set(value as object, result);

    // 复制所有可枚举属性
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const objValue = value as Record<string, unknown>;
        result[key] = cloneDeep(objValue[key], cloneMap);
      }
    }

    return result;
  } catch (_error) {
    // 无法通过构造函数创建的对象，返回原对象的浅拷贝
    console.warn(
      `Unable to deeply clone object of type ${Object.prototype.toString.call(value)}. Fallback to shallow copy.`,
    );
    return { ...(value as object) } as unknown as T;
  }
};
