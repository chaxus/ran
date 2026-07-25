import { SyncHook } from './subscribe';

/** Global event bus: a signal carrying a `subscriber` broadcasts through it on change */
export const subscribers = new SyncHook();

export interface SignalOptions<T> {
  /** Event name; only when given does a change broadcast through `subscribers` for cross-module listeners */
  subscriber?: string;
  /**
   * Equality check, deciding whether a write counts as a change:
   * - omitted / `true` — use `Object.is` (reference/value equality), the standard signal semantics
   * - `false` — always a change, notify on every write
   * - function — returning true means equal, so the notification is skipped. Pass `isEqual` for a deep comparison
   */
  equals?: boolean | ((prev: T, next: T) => boolean);
}

/**
 * @description: Create a minimal signal with optional event broadcasting, returned as
 * `[read, write]`.
 *
 * Equality defaults to `Object.is` — **no deep comparison**. The old implementation
 * `cloneDeep`-ed a snapshot on every write and compared it with `isEqual`: that put an
 * O(data size) copy on the hot write path, and the deep comparison overrode the `equals`
 * option, breaking `equals: false` ("always notify"). Pass `{ equals: isEqual }` explicitly
 * when a deep comparison is wanted, so its cost is visible at the call site.
 *
 * @param {T} value initial value
 * @param {SignalOptions} options
 * @return {[() => T, (next: T) => void]}
 * @example
 * ```ts
 * const [count, setCount] = createSignal(0, { subscriber: 'count-changed' });
 * subscribers.tap('count-changed', () => render(count()));
 * setCount(1); // notifies
 * setCount(1); // same value, no notification
 *
 * const [tree, setTree] = createSignal(initial, { equals: isEqual }); // opt in to deep comparison
 * ```
 */
export const createSignal = <T = unknown>(
  value: T,
  options: SignalOptions<T> = {},
): [() => T, (newValue: T) => void] => {
  const { subscriber, equals } = options;
  let current = value;

  const changed = (prev: T, next: T): boolean => {
    if (equals === false) return true;
    // `true` is synonymous with omitting it: both take the default Object.is. The old
    // implementation read `true` as "always equal", so an `{ equals: true }` signal never
    // updated at all.
    if (typeof equals === 'function') return !equals(prev, next);
    return !Object.is(prev, next);
  };

  const getter = (): T => current;

  const setter = (newValue: T): void => {
    if (!changed(current, newValue)) return;
    current = newValue;
    if (subscriber) subscribers.call(subscriber);
  };

  return [getter, setter];
};
