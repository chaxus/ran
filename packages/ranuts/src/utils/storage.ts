/**
 * localStorage access that cannot throw.
 *
 * `localStorage` is not merely absent under SSR — it also throws on *access* in a
 * third-party iframe with cookies blocked, and on *write* in Safari private mode or at
 * quota. Every read and write here is guarded, because a storage failure should degrade a
 * preference, never break the page.
 */

/** Resolved at call time, not module load, so it is correct after SSR-then-hydrate and stubbable in tests. */
const store = (): Storage | null => {
  try {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
};

/**
 * @description: Write a string to localStorage. Silently does nothing when storage is
 * unavailable or the write fails (quota, private mode).
 * @param {string} name
 * @param {string} value
 * @return {void}
 */
export const localStorageSetItem = (name: string, value: string): void => {
  try {
    store()?.setItem(name, value);
  } catch {
    // best-effort: quota exceeded / private mode
  }
};

/**
 * @description: Read a string from localStorage, or `''` when missing or unavailable.
 * @param {string} name
 * @return {string}
 */
export const localStorageGetItem = (name: string): string => {
  try {
    return store()?.getItem(name) ?? '';
  } catch {
    return '';
  }
};

/**
 * @description: Remove a key from localStorage. Silently does nothing when storage is unavailable.
 * @param {string} name
 * @return {void}
 */
export const localStorageRemoveItem = (name: string): void => {
  try {
    store()?.removeItem(name);
  } catch {
    // best-effort
  }
};

export interface JsonStore<T> {
  /** Stored value, or `fallback` when missing, unavailable, or not valid JSON. */
  get: (key: string, fallback: T) => T;
  /** Serialise and store. Returns false when nothing was written. */
  set: (key: string, value: T) => boolean;
  remove: (key: string) => void;
  /** Full storage key for `key`, i.e. `prefix + key` — useful when listening for `storage` events. */
  keyOf: (key: string) => string;
}

/**
 * @description: A prefixed, JSON-serialising view over localStorage.
 *
 * The prefix is what lets several features share one origin's storage without collisions
 * (`agent_history_`, `agent_api_key_`, …), and reading through `get` means a value written
 * by an older version of the code — or by anything else on the origin — cannot throw a
 * `SyntaxError` into the caller: invalid JSON yields the fallback.
 *
 * `get` **validates nothing**. Whatever was stored comes back typed as `T`; check it
 * yourself if it crosses a version boundary. The fallback only covers absence and parse
 * failure.
 *
 * @param {string} prefix namespace prepended to every key
 * @return {JsonStore<T>}
 * @example
 * ```ts
 * const history = createStore<Message[]>('agent_history_');
 * history.set('default', messages);
 * const restored = history.get('default', []); // [] when absent or corrupt
 * ```
 */
export const createStore = <T>(prefix = ''): JsonStore<T> => {
  const keyOf = (key: string): string => `${prefix}${key}`;
  return {
    keyOf,
    get: (key: string, fallback: T): T => {
      const raw = localStorageGetItem(keyOf(key));
      if (!raw) return fallback;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    },
    set: (key: string, value: T): boolean => {
      let raw: string;
      try {
        raw = JSON.stringify(value);
      } catch {
        // Circular structure or a BigInt — nothing was written.
        return false;
      }
      localStorageSetItem(keyOf(key), raw);
      return localStorageGetItem(keyOf(key)) === raw;
    },
    remove: (key: string): void => localStorageRemoveItem(keyOf(key)),
  };
};
