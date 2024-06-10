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
        value === undefined || value === null
          ? searchParams
          : (searchParams.append(decodeURIComponent(name), decodeURIComponent(value)), searchParams),
      new URLSearchParams(),
    )
    .toString();
}

const transitionJsonToString = (jsonObj: string | JSON, callback = (error: Error) => {}) => {
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
      jsonObj = typeof jsonObj === 'string' ? jsonObj.replace(/(')/g, '"') : JSON.stringify(jsonObj);
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
  // 存储需要特殊处理的“再数组中的开始位置变量索引
  let _indexStart: number | null = null;
  // 存储需要特殊处理的“再数组中的结束位置变量索引
  let _indexEnd: number | null = null;
  // 将 jsonString 字符串内容通过\r\n符分割成数组
  let jsonArray: string[] = [];
  // 正则匹配到{,}符号则在两边添加回车换行
  jsonString = jsonString.replace(/([{}])/g, '\r\n$1\r\n');
  // 正则匹配到 [,] 符号则在两边添加回车换行
  jsonString = jsonString.replace(/([[\]])/g, '\r\n$1\r\n');
  // 正则匹配到，符号则在两边添加回车换行
  jsonString = jsonString.replace(/(,)/g, '$1\r\n');
  // 正则匹配到要超过一行的换行需要改为一行
  jsonString = jsonString.replace(/(\r\n\r\n)/g, '\r\n');
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
    if (num % 2 && _indexStart && _indexStart != index) {
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
  _index.reverse().forEach(function (item, index) {
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
  jsonArray.forEach(function (item, index) {
    // console.log(item)
    let i = 0;
    // 表示缩进的位数，以 tab 作为计数单位
    let indent = 0;
    // 表示缩进的位数，以空格作为计数单位
    let padding = '';
    if (item.match(/\{$/) || item.match(/\[$/)) {
      // 匹配到以{和 [结尾的时候 indent 加 1
      indent += 1;
    } else if (item.match(/\}$/) || item.match(/\]$/) || item.match(/\},$/) || item.match(/\],$/)) {
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
export const mergeExports = (obj: Object, exports: Object): Object => {
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
    // @ts-ignore
    global[name as any as keyof typeof global] = value as any;
  }
};
