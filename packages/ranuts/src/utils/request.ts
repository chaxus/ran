import { replaceOld } from '@/utils/obj';
import { noop } from '@/utils/noop';

export type Hooks = (...args: unknown[]) => void;

export interface Options {
  requestHook: Hooks;
  responseHook: Hooks;
  errorHook: Hooks;
}

/**
 * @description: Instrument `window.fetch` so every request, response and failure reaches your
 * hooks. The original behaviour is untouched: the response is passed through and errors are
 * re-thrown.
 *
 * Returns a **restore function**. Without one, instrumenting a global is a one-way door — a
 * hot reload stacks a new wrapper on the previous one, and a test can never give the page a
 * clean `fetch` back.
 *
 * @param {Partial<Options>} options requestHook / responseHook / errorHook
 * @return {Function} restore — puts the original `fetch` back
 * @example
 * ```ts
 * const restore = handleFetchHook({ errorHook: (url, error) => report({ payload: { url } }) });
 * // on teardown
 * restore();
 * ```
 */
export const handleFetchHook = (options: Partial<Options> = {}): (() => void) => {
  if (typeof window === 'undefined') return noop;
  const { requestHook = noop, responseHook = noop, errorHook = noop } = options;
  return replaceOld(window, 'fetch', (originalFetch: unknown) => {
    if (typeof originalFetch !== 'function') return undefined;
    const original = originalFetch as typeof fetch;
    return (url: string, config?: RequestInit) => {
      requestHook(url, config);
      return original
        .apply(window, [url, config])
        .then((response: Response) => {
          responseHook(url, config, response);
          return response;
        })
        .catch((error: Error) => {
          errorHook(url, error);
          throw error;
        });
    };
  });
};

/**
 * @description: Instrument `XMLHttpRequest` (`open` / `send`) so requests, responses and
 * failures reach your hooks. Patches the prototype, so it applies to every instance.
 *
 * Returns a **restore function** that undoes both patches. See `handleFetchHook` for why that
 * matters.
 *
 * @param {Partial<Options>} options requestHook / responseHook / errorHook
 * @return {Function} restore — puts the original `open` and `send` back
 */
export const handleXhrHook = (options: Partial<Options> = {}): (() => void) => {
  if (typeof window === 'undefined' || typeof XMLHttpRequest === 'undefined') return noop;
  const proto = XMLHttpRequest.prototype;
  const { requestHook = noop, responseHook = noop, errorHook = noop } = options;

  const restoreOpen = replaceOld(proto, 'open', (originalOpen: unknown) => {
    if (typeof originalOpen !== 'function') return undefined;
    const original = originalOpen as (...args: unknown[]) => void;
    return function (this: XMLHttpRequest, ...args: unknown[]): void {
      requestHook(args);
      original.apply(this, args);
    };
  });

  const restoreSend = replaceOld(proto, 'send', (originalSend: unknown) => {
    if (typeof originalSend !== 'function') return undefined;
    const original = originalSend as (...args: unknown[]) => void;
    return function (this: XMLHttpRequest, ...args: unknown[]): void {
      // Scoped to this request via `once`, so a reused XHR object does not accumulate
      // listeners on every send.
      this.addEventListener('loadend', () => responseHook(this), { once: true });
      this.addEventListener('error', () => errorHook(this), { once: true });
      original.apply(this, args);
    };
  });

  return () => {
    restoreSend();
    restoreOpen();
  };
};
