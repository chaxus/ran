type ThrottleFunc<T extends (...args: any[]) => void> = (...args: Parameters<T>) => any;

/**
 * @description: 节流
 * @param {any} fn
 * @param {*} wait
 * @return {*}
 */
export function throttle<T extends (...args: any[]) => any>(func: T, delay: number = 300): ThrottleFunc<T> {
  let lastCallTime: number = 0;
  let timeoutId: number | null = null;
  return function (this: unknown, ...args: Parameters<T>): void {
    const now = Date.now();
    if (now - lastCallTime >= delay) {
      if (timeoutId != null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      lastCallTime = now;
      func.apply(this, args);
    } else if (timeoutId == null) {
      timeoutId = window.setTimeout(
        () => {
          lastCallTime = Date.now();
          func.apply(this, args);
          timeoutId = null;
        },
        delay - (now - lastCallTime),
      );
    }
  };
}

/**
 * @description: 生成节流函数
 * @param {*} Function
 * @return {*}
 */
export const generateThrottle = (): Function => {
  let lastCallTime: number = 0;
  let timeoutId: number | null = null;
  return function (func: Function, delay = 300) {
    return function (this: unknown, ...args: unknown[]) {
      const now = Date.now();
      if (now - lastCallTime >= delay) {
        if (timeoutId != null) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        lastCallTime = now;
        func.apply(this, args);
      } else if (timeoutId == null) {
        timeoutId = window.setTimeout(
          () => {
            lastCallTime = Date.now();
            func.apply(this, args);
            timeoutId = null;
          },
          delay - (now - lastCallTime),
        );
      }
    };
  };
};
