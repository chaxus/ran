import { isClient } from '@/utils/device';

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
 * @description: 生成节流函数
 * @param {*} Function
 * @return {*}
 */
export const generateThrottle = (): Function => {
  let timer: NodeJS.Timeout | undefined;
  return function (fn: Function, wait = 300) {
    return function (this: unknown, ...args: unknown[]) {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      const context = this;
      if (!timer) {
        timer = setTimeout(() => {
          fn.apply(context, args);
          clearTimeout(timer);
          timer = undefined;
        }, wait);
      }
    };
  };
};

/**
 * @description: requestAnimationFrame节流
 * @param {any} fn
 * @return {*}
 */
export const requestAnimation = (fn: any): any => {
  if (!isClient) return;
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
