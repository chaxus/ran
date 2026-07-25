export type Func = (...args: any[]) => unknown;

/**
 * @description: 只执行一次——首次调用求值并缓存，之后无论传什么参数都直接返回首次的结果。
 * 用于惰性初始化（配置解析、昂贵的一次性计算、懒 getter）。
 *
 * **不是按参数缓存的 memoize**：参数只在第一次生效，后续调用的参数被忽略。
 * 需要按参数缓存请自行用 Map；异步版本用 [`singleFlight`](#singleflight)。
 * 求值后会释放对 `fn` 的引用，让它闭包捕获的资源可被回收。
 *
 * @param {Function} fn 只该执行一次的函数；传非函数值则原样返回该值
 * @return {Function} 包装后的函数
 * @example
 * ```ts
 * const config = once(() => JSON.parse(readFileSync('config.json', 'utf8')));
 * config(); // 解析
 * config(); // 直接返回上次的结果
 * ```
 */
export const once = <T extends Func>(fn: T | unknown): ((...args: Parameters<T>) => ReturnType<T>) => {
  let cached = false;
  let result: unknown;
  let target: unknown = fn;
  return (...args: Parameters<T>): ReturnType<T> => {
    if (!cached) {
      result = typeof target === 'function' ? target(...args) : target;
      cached = true;
      // 释放 fn 及其闭包捕获的资源
      target = undefined;
    }
    return result as ReturnType<T>;
  };
};

/**
 * @description: `once` 的旧名。名字带有误导——它并不按参数缓存，只是「执行一次」。
 * @deprecated 改用 [`once`](#once)；异步场景用 [`singleFlight`](#singleflight)。
 */
export const memoize = once;

export interface SingleFlight<T> {
  (): Promise<T>;
  /** 丢弃已缓存的结果，下次调用重新执行（连接断开、登出、需要强制刷新时用） */
  reset: () => void;
  /** 是否已有结果或正在执行中 */
  readonly started: boolean;
}

/**
 * @description: 异步版的「只执行一次」：并发调用共享同一个在途 promise，成功后所有后续调用
 * 直接复用结果，**失败则清空**以便重试（这点与 `memoize` 不同——缓存一个 rejected promise
 * 会让一次偶发的网络抖动永久失败）。
 *
 * 典型用途是「初始化一次、大家都要等」的资源：打开数据库、加载配置、注册 Service Worker。
 * 常见的 bug 是初始化函数返回 void，调用方无从 await，于是并发的写操作在资源就绪前
 * 全部失败——把初始化包成 `singleFlight` 后，任何调用方 `await ready()` 即可。
 *
 * @param {Function} fn 只该执行一次的异步函数
 * @return {SingleFlight<T>}
 * @example
 * ```ts
 * const ready = singleFlight(() => db.openDataBase());
 * await ready(); // 并发调用只会真正打开一次
 * ```
 */
export const singleFlight = <T>(fn: () => Promise<T>): SingleFlight<T> => {
  let pending: Promise<T> | null = null;
  const run = (): Promise<T> => {
    pending ??= fn().catch((error) => {
      pending = null; // 失败不缓存，允许重试
      throw error;
    });
    return pending;
  };
  run.reset = (): void => {
    pending = null;
  };
  Object.defineProperty(run, 'started', { get: () => pending !== null });
  return run as SingleFlight<T>;
};
