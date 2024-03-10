export type Func = () => unknown;
/**
 * @description: 返回缓存的函数，执行一次后，无须执行直接返回结果
 * @param {Func} fn
 * @return {Func}
 */
export const memoize = (fn: unknown): Func => {
  let cache = false;
  let result: unknown = undefined;
  return (...args: unknown[]) => {
    if (cache) {
      return result;
    } else {
      result = typeof fn === 'function' ? fn(...args) : fn;
      cache = true;
      // Allow to clean up memory for fn
      // and all dependent resources
      fn = undefined;
      return result;
    }
  };
};
