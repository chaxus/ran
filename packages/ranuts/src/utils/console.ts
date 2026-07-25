import { replaceOld } from '@/utils/obj';
import { noop } from '@/utils/noop';

export type ConsoleMethod = 'log' | 'info' | 'warn' | 'error' | 'assert';

const CONSOLE_METHODS: ConsoleMethod[] = ['log', 'info', 'warn', 'error', 'assert'];

/**
 * @description: Tap into `console` so every call also reaches your hook, while still printing
 * as usual. Used to ship console output to a monitoring backend.
 *
 * Returns a **restore function** — patching a global without one is a one-way door: tests
 * cannot clean up after themselves, and a hot reload re-patches an already-patched console
 * until every log is nested through a dozen wrappers.
 *
 * @param {Function} hooks receives `(type, ...args)` for every console call
 * @return {Function} restore — puts the original console methods back
 * @example
 * ```ts
 * const restore = handleConsole((type, ...args) => send({ type, args }));
 * // on teardown
 * restore();
 * ```
 */
export const handleConsole = (hooks: (...args: unknown[]) => void = noop): (() => void) => {
  if (typeof console === 'undefined') return noop;
  const restores = CONSOLE_METHODS.map((type) =>
    replaceOld(console, type, (originalConsole: unknown) => {
      if (typeof originalConsole !== 'function') return undefined;
      const original = originalConsole as (...a: unknown[]) => void;
      return function (...args: unknown[]): void {
        hooks(type, ...args);
        original.apply(console, args);
      };
    }),
  );
  return () => restores.forEach((restore) => restore());
};
