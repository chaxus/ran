export interface Debounced<T extends (...args: any[]) => any> {
  (this: unknown, ...args: Parameters<T>): void;
  /** Cancel the pending invocation, if any. */
  cancel: () => void;
  /** Invoke the pending call immediately (e.g. force a flush before form submit). */
  flush: () => void;
  /** Whether an invocation is currently waiting to fire. */
  pending: () => boolean;
}

/**
 * @description: Debounce — on a burst of calls, run only the last one, **`ms` milliseconds
 * after the calls stop**. For input suggestions, window resize, autosave — anything that
 * only cares about the final state.
 *
 * Preserves the caller's `this` and the arguments of the last call. The returned function
 * carries `cancel` / `flush`: call `cancel()` on unmount, otherwise the pending timer fires
 * into an already destroyed context.
 *
 * @param {Function} fn function to debounce
 * @param {number} ms quiet period in milliseconds, defaults to 500
 * @return {Debounced} wrapped function with cancel / flush / pending
 * @example
 * ```ts
 * const save = debounce((draft: string) => api.save(draft), 800);
 * input.addEventListener('input', (e) => save(e.target.value));
 * onUnmount(() => save.cancel());
 * ```
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, ms = 500): Debounced<T> => {
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
    fn.apply(context, args);
  };

  // Must be a `function`, not an arrow: an arrow binds `this` to the module scope at
  // definition time, so `obj.handler()` would never see `obj`.
  const debounced = function (this: unknown, ...args: Parameters<T>): void {
    // oxlint-disable-next-line typescript/no-this-alias -- capturing the caller's `this` is the point here
    lastThis = this;
    lastArgs = args;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(invoke, ms);
  } as Debounced<T>;

  debounced.cancel = (): void => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    lastArgs = null;
    lastThis = undefined;
  };
  debounced.flush = (): void => {
    if (timer === null) return;
    clearTimeout(timer);
    invoke();
  };
  debounced.pending = (): boolean => timer !== null;

  return debounced;
};
