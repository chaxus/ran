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
