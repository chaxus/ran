/**
 * @description: 将url上的字符串转换成对象
 * @param {string} url
 * @param {*} string
 * @return {*}
 */
export const getAllQueryString = (url: string): Record<string, string> => {
  if (typeof window !== 'undefined') {
    const r: Record<string, string> = {};
    const href = url || window.location.href;
    if (href.split('?')[1]) {
      const str = href.split('?')[1];
      const strList = str.split('&');
      strList.forEach((item) => {
        const key = item.split('=')[0];
        const val = item.split('=')[1];
        if (key && val) {
          r[key] = decodeURIComponent(val);
        }
      });
    }
    return r;
  }
  return {};
};
/**
 * @description: 将一个对象转换成querystring，拼接到url后面
 * @return {*}
 */
export function getFreshUrl(
  url: string,
  params: Record<string, string> = {},
): string {
  let _url = url;
  if (_url.indexOf('//') === 0) {
    _url = _url.replace('//', 'https://');
  }
  const urlObj = new URL(_url);
  if (params) {
    Object.keys(params).forEach((key) => {
      params[key] && urlObj.searchParams.set(key, params[key]);
    });
  }
  return urlObj.href;
}
/**
 * @description: 防抖
 * @param {any} fn
 * @param {*} ms
 * @return {*}
 */
export const debounce = (fn: any, ms = 500): any => {
  let timeout: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
};
/**
 * @description: 节流
 * @param {any} fn
 * @param {*} wait
 * @return {*}
 */
export const throttle = (fn: any, wait = 300): any => {
  let timer: NodeJS.Timeout | null;
  return function (this: any) {
    const context = this;
    const args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        fn.apply(context, args);
      }, wait);
    }
  };
};
/**
 * @description: requestAnimationFrame节流
 * @param {any} fn
 * @return {*}
 */
export const requestAnimation = (fn: any): any => {
  let ticking = false;
  return function (this: any) {
    const context = this;
    const args = arguments;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        fn.apply(context, args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

type Func = () => unknown
/**
 * @description: 返回缓存的函数，执行一次后，无须执行直接返回结果
 * @param {Func} fn
 * @return {Func}
 */
export const memoize = (fn: unknown): Func => {
  let cache = false;
  let result: unknown = undefined;
  return (...args:unknown[]) => {
    if (cache) {
      return result
    } else {
      result = typeof fn === 'function' ? fn(...args) : fn;
      cache = true;
      // Allow to clean up memory for fn
      // and all dependent resources
      fn = undefined;
      return result
    }
  };
};

/**
 * @description: 将exports对象拼接到obj上，并冻结obj
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
        get: memoize(fn)
      });
    } else if (typeof descriptor.value === "object") {
      Object.defineProperty(obj, name, {
        configurable: false,
        enumerable: true,
        writable: false,
        value: mergeExports({}, descriptor.value)
      });
    } else {
      throw new Error(
        "Exposed values must be either a getter or an nested object"
      );
    }
  }
  return Object.freeze(obj)
};