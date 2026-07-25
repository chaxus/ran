/**
 * Promise primitives that JavaScript does not ship: an externally settled promise and a
 * bounded wait. Both are things hand-rolled at nearly every call site that needs them, and
 * both are usually hand-rolled with the same leak.
 */

export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
}

/**
 * @description: A promise plus its `resolve` / `reject`, for the case where the thing that
 * settles the promise is not the thing that creates it — a response arriving on a message
 * listener, a callback fired by a third-party SDK, a queue slot freeing up.
 *
 * The alternative is assigning the executor's arguments to outer `let`s, which TypeScript
 * cannot prove are assigned and which is easy to get subtly wrong.
 *
 * @return {Deferred<T>}
 * @example
 * ```ts
 * const ready = deferred<Editor>();
 * sdk.onReady((editor) => ready.resolve(editor));
 * const editor = await ready.promise;
 * ```
 */
export const deferred = <T = void>(): Deferred<T> => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * @description: Reject if a promise has not settled within `ms`. The returned promise
 * settles with whatever the input does, or rejects with a [`TimeoutError`](#timeouterror).
 *
 * **The timer is always cleared**, including on the fast path. The usual hand-rolled
 * version — `Promise.race([task, new Promise((_, r) => setTimeout(r, ms))])` — leaks the
 * timer whenever the task wins, which in Node keeps the event loop alive for the full
 * duration and in tests leaves a stray timer firing into the next test.
 *
 * This does **not** cancel the underlying work; a promise cannot be cancelled. Pass
 * `onTimeout` to tear the operation down (abort a fetch, terminate a worker) when the
 * deadline passes.
 *
 * @param {Promise<T>} promise the operation to bound
 * @param {number} ms deadline in milliseconds
 * @param {object} options `message` for the error text, `onTimeout` for cleanup
 * @return {Promise<T>}
 * @example
 * ```ts
 * const controller = new AbortController();
 * const res = await withTimeout(fetch(url, { signal: controller.signal }), 5000, {
 *   message: 'fetch timed out',
 *   onTimeout: () => controller.abort(),
 * });
 * ```
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  options: { message?: string; onTimeout?: () => void } = {},
): Promise<T> => {
  const { message = `operation timed out after ${ms}ms`, onTimeout } = options;
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      onTimeout?.();
      reject(new TimeoutError(message));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
};

/**
 * @description: Resolve to a fallback value instead of rejecting when `ms` elapses. For
 * work that has a usable degraded answer — a cached copy, the original file, an empty list
 * — where failing the whole flow on a slow dependency is worse than being approximate.
 *
 * A rejection from `promise` itself still propagates; only the deadline is absorbed.
 *
 * @param {Promise<T>} promise the operation to bound
 * @param {number} ms deadline in milliseconds
 * @param {T} fallback value to resolve with when the deadline passes
 * @param {Function} onTimeout optional cleanup, called when the deadline passes
 * @return {Promise<T>}
 */
export const withTimeoutFallback = <T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
  onTimeout?: () => void,
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      onTimeout?.();
      resolve(fallback);
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
};

/**
 * @description: Resolve after `ms` milliseconds. Uses the bare `setTimeout`, so it works in
 * Node, Web Workers and the browser alike.
 * @param {number} ms
 * @return {Promise<void>}
 */
export const delay = (ms: number): Promise<void> => new Promise<void>((resolve) => setTimeout(resolve, ms));
