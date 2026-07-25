export interface Throttled<T extends (...args: any[]) => any> {
  (this: unknown, ...args: Parameters<T>): void;
  /** 取消尾部挂起的那次调用 */
  cancel: () => void;
  /** 是否有尾部调用正在等待触发 */
  pending: () => boolean;
}

/**
 * @description: 节流——高频触发时按固定间隔执行，首次立即执行（leading），
 * 间隔内的最后一次触发在窗口结束时补上（trailing），保证「最后的状态不丢」。
 * 用于滚动、鼠标移动、拖拽这类需要**持续反馈**的场景（与 `debounce` 相反：
 * 防抖只要最终值，节流要过程值）。
 *
 * 保留调用时的 `this` 与参数。用裸 `setTimeout` 而非 `window.setTimeout`——
 * 后者在 Node / Worker / SSR 里直接抛 ReferenceError。
 *
 * @param {Function} fn 要节流的函数
 * @param {number} delay 最小间隔（毫秒），默认 300
 * @return {Throttled} 带 cancel / pending 的包装函数
 * @example
 * ```ts
 * const onScroll = throttle(() => update(window.scrollY), 100);
 * window.addEventListener('scroll', onScroll);
 * onUnmount(() => { window.removeEventListener('scroll', onScroll); onScroll.cancel(); });
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number = 300): Throttled<T> {
  let lastCallTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastThis: unknown;
  let lastArgs: Parameters<T> | null = null;

  const invoke = (): void => {
    timer = null;
    if (!lastArgs) return;
    const args = lastArgs;
    const context = lastThis;
    lastArgs = null;
    lastThis = undefined;
    lastCallTime = Date.now();
    fn.apply(context, args);
  };

  const throttled = function (this: unknown, ...args: Parameters<T>): void {
    const now = Date.now();
    const remaining = delay - (now - lastCallTime);
    lastThis = this;
    lastArgs = args;
    if (remaining <= 0) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      invoke();
    } else if (timer === null) {
      timer = setTimeout(invoke, remaining);
    }
  } as Throttled<T>;

  throttled.cancel = (): void => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    lastArgs = null;
    lastThis = undefined;
  };
  throttled.pending = (): boolean => timer !== null;

  return throttled;
}
