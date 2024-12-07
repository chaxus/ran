// interface FT {
//   new (): Record<string, unknown>;
//   (): void;
//   prototype: Record<string, unknown>;
// }
/**
 * @description: 实现 object.create，将传入的对象作为原型
 * @param {*} obj
 * @return {*}
 */
// export const objectCreate = (obj: Record<string, unknown>): Record<string, any> => {
//   function F() {}
//   F.prototype = obj;
//   return new (F as FT)();
// };
/**
 * @description: 实现 instanceof: object instanceof constructor
 * @param {*} left
 * @param {*} right
 * @return {*}
 */
export const instanceOf = (obj: Record<string, unknown>, cst: Function): boolean => {
  let proto = Object.getPrototypeOf(obj); // 获取对象的 prototype
  const prototype = cst.prototype; // 获取构造函数的 prototype
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto); // 一直向上获取 prototype
  }
};
/**
 * @description: 实现 new 操作符
 * @param {*} 构造函数
 * @param {*} 参数
 * @return {*} Object
 */
export function customNew(...args: unknown[]): Record<string, unknown> {
  const constructor = Array.prototype.shift.call(args);
  if (typeof constructor !== 'function') {
    throw new Error('constructor must be function');
  }
  const newObject = Object.create(constructor.prototype);
  const result = constructor.apply(newObject, args);
  const flag = result && result instanceof Object;
  return flag ? result : newObject;
}
/**
 * @description: 防抖
 * @param {Function} fn
 * @param {number} wait
 * @return {*}
 */

export function debounce<T extends (...args: any[]) => any>(
  ms: number,
  callback: T,
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timer: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }
    return new Promise<ReturnType<T>>((resolve) => {
      timer = setTimeout(() => {
        const returnValue = callback(...args) as ReturnType<T>;
        resolve(returnValue);
      }, ms);
    });
  };
}
/**
 * @description: 首节流
 * @return {*}
 */
export function throttle(fn: Function, wait: number = 3000): Function {
  let curTime = Date.now();
  return function (this: unknown, ...args: unknown[]) {
    const nowTime = Date.now();
    if (nowTime - curTime >= wait) {
      curTime = nowTime;
      return fn.apply(this, args);
    }
  };
}

/**
 * @description: 实现 call 函数
 * @param {unknown} this
 * @return {*}
 */
// export function call(): void {
//   Function.prototype.call = function () {
//     if (typeof this !== 'function') {
//       throw new Error('type is error');
//     }
//     let [context, ...args] = [...arguments];
//     context = context || window;
//     context.fn = this;
//     const result = context.fn(...args);
//     delete context.fn;
//     return result;
//   };
// }
