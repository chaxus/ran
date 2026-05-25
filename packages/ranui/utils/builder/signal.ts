/**
 * Reactive primitives — signal / createEffect / computed
 *
 * Design reference: SwiftUI @Observable + Solid.js fine-grained reactivity
 *
 * SwiftUI's core model:  View = f(State)
 *   - @State / @Observable properties are the reactive source
 *   - When a property is READ inside `body`, SwiftUI records the dependency
 *   - When the property is WRITTEN, only views that read it re-render
 *   - The framework handles diffing; you describe "what", not "how"
 *
 * This module mirrors that model for DOM:
 *   - signal()       ≈ @State / @Observable property
 *   - createEffect() ≈ SwiftUI's body (auto-tracks reads, re-runs on writes)
 *   - computed()     ≈ SwiftUI's computed property (derived, cached)
 *
 * Usage with builder:
 *
 *   const [count, setCount] = signal(0);
 *
 *   // Build DOM once
 *   const countEl = Span().class('count').build();
 *   const btn = ButtonBuilder().text('+')
 *     .on('click', () => setCount(n => n + 1))
 *     .build();
 *
 *   // Effect drives updates — re-runs automatically when count changes
 *   const dispose = createEffect(() => {
 *     countEl.textContent = `${count()}`;
 *   });
 *
 *   // Tear down when section is removed
 *   return () => dispose();
 */

/** Currently executing effect — set during effect runs for auto-tracking. */
let currentSubscriber: (() => void) | null = null;

// ── createSignal (legacy API) ─────────────────────────────────────────────────

/**
 * @deprecated Use `signal()` + `createEffect()` instead.
 * Kept for backward compatibility with components that register manual subscribers.
 */
export const createSignal = <T = unknown>(
  value: T,
  options?: {
    subscriber?: Function[];
    equals?: boolean | ((prev: T | undefined, next: T) => boolean);
  },
): [() => T, (newValue: T) => void] => {
  const state = {
    value,
    subscribers: new Set<Function>(),
    comparator: options?.equals,
  };

  if (Array.isArray(options?.subscriber)) {
    options!.subscriber!.forEach((fn) => {
      if (typeof fn === 'function') state.subscribers.add(fn);
    });
  }

  const getter = (): T => state.value;

  const notify = (next: T) => {
    state.value = next;
    state.subscribers.forEach((sub) => sub(next));
  };

  const setter = (newValue: T): void => {
    const { comparator } = state;
    if (comparator instanceof Function) {
      if (!comparator(state.value, newValue)) notify(newValue);
    } else if (comparator === true) {
      // always skip
    } else if (comparator === false) {
      if (state.value !== newValue) notify(newValue);
    } else {
      if (state.value !== newValue) notify(newValue);
    }
  };

  return [getter, setter];
};

// ── signal ────────────────────────────────────────────────────────────────────

export type Getter<T> = () => T;
export type Setter<T> = (value: T | ((prev: T) => T)) => void;

export interface SignalOptions<T> {
  /** Custom equality check. Defaults to Object.is. Return true to skip update. */
  equals?: (prev: T, next: T) => boolean;
}

/**
 * Create a reactive value. Returns a [getter, setter] tuple.
 *
 *   const [count, setCount] = signal(0);
 *   count()           // read — auto-tracks inside createEffect / computed
 *   setCount(1)       // write — notifies all dependent effects
 *   setCount(n => n + 1)  // updater function form
 */
export function signal<T>(initial: T, options?: SignalOptions<T>): [Getter<T>, Setter<T>] {
  const equals = options?.equals ?? Object.is;
  let value = initial;
  const subscribers = new Set<() => void>();

  const get: Getter<T> = () => {
    if (currentSubscriber) subscribers.add(currentSubscriber);
    return value;
  };

  const set: Setter<T> = (next) => {
    const nextValue = typeof next === 'function' ? (next as (prev: T) => T)(value) : next;
    if (equals(value, nextValue)) return;
    value = nextValue;
    for (const sub of [...subscribers]) sub();
  };

  return [get, set];
}

// ── createEffect ──────────────────────────────────────────────────────────────

/**
 * Run fn immediately and re-run it whenever any signal read inside it changes.
 * Returns a dispose function that stops the effect.
 *
 * fn may return a cleanup function — it is called before each re-run and on dispose.
 *
 *   const dispose = createEffect(() => {
 *     document.title = `Count: ${count()}`;
 *     return () => { document.title = ''; }; // optional cleanup
 *   });
 *
 *   dispose(); // stop tracking
 */
export function createEffect(fn: () => void | (() => void)): () => void {
  let cleanup: (() => void) | void;
  let disposed = false;

  const run = () => {
    if (disposed) return;
    cleanup?.();
    currentSubscriber = run;
    try {
      cleanup = fn() ?? undefined;
    } finally {
      currentSubscriber = null;
    }
  };

  run();

  return () => {
    disposed = true;
    cleanup?.();
  };
}

// ── computed ──────────────────────────────────────────────────────────────────

/**
 * Derived read-only signal. Recomputes lazily when its dependencies change.
 *
 *   const [firstName, setFirstName] = signal('Jane');
 *   const [lastName, setLastName] = signal('Doe');
 *   const fullName = computed(() => `${firstName()} ${lastName()}`);
 *
 *   fullName(); // 'Jane Doe'
 *   setFirstName('John');
 *   fullName(); // 'John Doe'
 */
export function computed<T>(fn: () => T): Getter<T> {
  const [get, set] = signal<T>(undefined as T);
  createEffect(() => set(fn()));
  return get;
}
