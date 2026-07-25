export interface Throttled<T extends (...args: any[]) => any> {
  (this: unknown, ...args: Parameters<T>): void;
  /** Cancel the pending trailing invocation, if any. */
  cancel: () => void;
  /** Whether a trailing invocation is waiting to fire. */
  pending: () => boolean;
}

/**
 * @description: Throttle — under a burst of calls, run at a fixed interval: the first call
 * runs immediately (leading) and the last call inside a window is replayed when the window
 * closes (trailing), so the final state is never dropped. For scroll, mouse move and drag —
 * anything needing **continuous feedback** (the opposite of `debounce`, which only wants the
 * final value while throttle wants the intermediate ones).
 *
 * Preserves the caller's `this` and arguments. Uses the bare `setTimeout` rather than
 * `window.setTimeout` — the latter throws a ReferenceError in Node / Workers / SSR.
 *
 * @param {Function} fn function to throttle
 * @param {number} delay minimum interval in milliseconds, defaults to 300
 * @return {Throttled} wrapped function with cancel / pending
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
    // oxlint-disable-next-line typescript/no-this-alias -- capturing the caller's `this` is the point here
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
