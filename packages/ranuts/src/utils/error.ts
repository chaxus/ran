import { noop } from '@/utils/noop';

export type ErrorPayload = Error | PromiseRejectionEvent | ErrorEvent;

/**
 * @description: Listen for uncaught errors and unhandled promise rejections, in the capture
 * phase so a handler further down cannot swallow them first.
 *
 * Returns an **unsubscribe function**. Without one these listeners live for the lifetime of
 * the page: a hot reload adds a second pair, then a third, and every error is reported N times.
 *
 * @param {Function} hooks receives the error / rejection event
 * @return {Function} unsubscribe
 * @example
 * ```ts
 * const off = handleError((error) => report({ payload: { error: String(error) } }));
 * // on teardown
 * off();
 * ```
 */
export const handleError = (hooks: (error: ErrorPayload) => void = noop): (() => void) => {
  if (typeof window === 'undefined') return noop;
  const onRejection = (event: PromiseRejectionEvent): void => hooks(event);
  const onError = (event: ErrorEvent): void => hooks(event);
  window.addEventListener('unhandledrejection', onRejection, true);
  window.addEventListener('error', onError, true);
  return () => {
    window.removeEventListener('unhandledrejection', onRejection, true);
    window.removeEventListener('error', onError, true);
  };
};
