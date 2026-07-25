export type Func = (...args: any[]) => unknown;

/**
 * @description: Run once — evaluate on the first call, cache the result, and return that
 * same result forever after, whatever arguments come later. For lazy initialisation:
 * config parsing, an expensive one-off computation, a lazy getter.
 *
 * **This is not a per-argument memoize**: only the first call's arguments matter, later
 * ones are ignored. Use a `Map` if you need keyed caching, or
 * [`singleFlight`](#singleflight) for the async case. Once evaluated, the reference to
 * `fn` is released so whatever its closure captured can be collected.
 *
 * @param {Function} fn function that should run only once; a non-function value is returned as is
 * @return {Function} wrapped function
 * @example
 * ```ts
 * const config = once(() => JSON.parse(readFileSync('config.json', 'utf8')));
 * config(); // parses
 * config(); // returns the previous result directly
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
      // Release `fn` and whatever its closure captured
      target = undefined;
    }
    return result as ReturnType<T>;
  };
};

/**
 * @description: Former name of `once`. The name is misleading — it does not cache per
 * argument, it simply runs once.
 * @deprecated Use [`once`](#once) instead; for the async case use [`singleFlight`](#singleflight).
 */
export const memoize = once;

export interface SingleFlight<T> {
  (): Promise<T>;
  /** Drop the cached result so the next call runs again (connection lost, logout, forced refresh) */
  reset: () => void;
  /** Whether a result already exists or a run is in flight */
  readonly started: boolean;
}

/**
 * @description: The async flavour of "run once": concurrent callers share one in-flight
 * promise, later callers reuse the resolved result, and **a rejection clears the cache**
 * so it can be retried (this is where it differs from `memoize` — caching a rejected
 * promise turns one flaky network blip into a permanent failure).
 *
 * The typical use is a resource that is initialised once but awaited by everyone: opening
 * a database, loading config, registering a service worker. The classic bug is an
 * initialiser returning void, leaving callers nothing to await, so concurrent writes all
 * fail before the resource is ready — wrap it in `singleFlight` and any caller can just
 * `await ready()`.
 *
 * @param {Function} fn async function that should run only once
 * @return {SingleFlight<T>}
 * @example
 * ```ts
 * const ready = singleFlight(() => db.openDataBase());
 * await ready(); // concurrent callers only open it for real once
 * ```
 */
export const singleFlight = <T>(fn: () => Promise<T>): SingleFlight<T> => {
  let pending: Promise<T> | null = null;
  const run = (): Promise<T> => {
    pending ??= fn().catch((error) => {
      pending = null; // do not cache failures, allow a retry
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
