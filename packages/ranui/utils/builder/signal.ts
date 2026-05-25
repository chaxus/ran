/**
 * Reactive primitives — signal / createEffect / computed / batch
 *
 * Design reference: SwiftUI @Observable + Solid.js fine-grained reactivity
 *
 * SwiftUI's core model:  View = f(State)
 *   @State / @Observable — reactive source (≈ signal)
 *   body                 — pure function of state, auto-tracks reads (≈ createEffect)
 *   computed property    — derived, cached (≈ computed)
 *
 * Two improvements over a naive signal implementation, both borrowed from Solid.js:
 *
 *   1. Stale subscription cleanup
 *      Before each re-run, an effect removes itself from every signal it previously
 *      subscribed to, then re-subscribes only to signals read in this run.
 *      Without this, conditional reads leave permanent ghost subscriptions that
 *      trigger effects for signals they no longer care about.
 *
 *   2. Batching
 *      batch(fn) defers all effect executions until fn returns, then flushes once.
 *      Mirrors SwiftUI's automatic coalescing of mutations in the same event handler.
 *      Without this, setting two signals triggers each dependent effect twice.
 */

// ── Tracking state ─────────────────────────────────────────────────────────────

/** The currently executing effect function, or null when outside an effect. */
let currentSubscriber: (() => void) | null = null;

/**
 * The set of subscriber-sets the current effect has joined.
 * Used for stale-subscription cleanup before each re-run.
 */
let currentSources: Set<Set<() => void>> | null = null;

/**
 * When inside batch(), effects are collected here instead of run immediately.
 * Flushed as a set (deduplication) after the batch function returns.
 */
let pendingBatch: Set<() => void> | null = null;

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
 *   count()              // read — auto-tracks inside createEffect / computed
 *   setCount(1)          // write — notifies dependents; skips if value unchanged
 *   setCount(n => n + 1) // updater function form
 */
export function signal<T>(initial: T, options?: SignalOptions<T>): [Getter<T>, Setter<T>] {
  const equals = options?.equals ?? Object.is;
  let value = initial;
  const subscribers = new Set<() => void>();

  const get: Getter<T> = () => {
    if (currentSubscriber && currentSources) {
      subscribers.add(currentSubscriber);
      // Let the effect track which subscriber-sets it has joined, for cleanup later.
      currentSources.add(subscribers);
    }
    return value;
  };

  const set: Setter<T> = (next) => {
    const nextValue = typeof next === 'function' ? (next as (prev: T) => T)(value) : next;
    if (equals(value, nextValue)) return;
    value = nextValue;
    if (pendingBatch) {
      // Inside batch() — collect effects, deduplicate, flush after batch exits.
      for (const sub of subscribers) pendingBatch.add(sub);
    } else {
      for (const sub of [...subscribers]) sub();
    }
  };

  return [get, set];
}

// ── createEffect ──────────────────────────────────────────────────────────────

/**
 * Run fn immediately and re-run it whenever any signal read inside it changes.
 * Returns a dispose function that stops the effect and cleans up subscriptions.
 *
 * Before each re-run, the effect removes itself from every signal it previously
 * subscribed to (stale-subscription cleanup), then re-subscribes only to signals
 * read in the new run.
 *
 * fn may return a cleanup function — called before each re-run and on dispose.
 *
 *   const dispose = createEffect(() => {
 *     document.title = `Count: ${count()}`;
 *     return () => { document.title = ''; }; // optional cleanup
 *   });
 *
 *   dispose(); // stop tracking, remove from all signals
 */
export function createEffect(fn: () => void | (() => void)): () => void {
  let cleanup: (() => void) | void;
  let disposed = false;
  // Tracks every subscriber-set this effect has joined across all signal reads.
  const sources = new Set<Set<() => void>>();

  const run = () => {
    if (disposed) return;
    cleanup?.();

    // ── Stale-subscription cleanup ──────────────────────────────────────────
    // Remove self from every signal we subscribed to in the previous run.
    // Signals read in this run will re-add us during get().
    for (const source of sources) source.delete(run);
    sources.clear();

    const prevSubscriber = currentSubscriber;
    const prevSources = currentSources;
    currentSubscriber = run;
    currentSources = sources;
    try {
      cleanup = fn() ?? undefined;
    } finally {
      currentSubscriber = prevSubscriber;
      currentSources = prevSources;
    }
  };

  run();

  return () => {
    disposed = true;
    cleanup?.();
    // Full cleanup: remove from every signal so GC can collect this effect.
    for (const source of sources) source.delete(run);
    sources.clear();
  };
}

// ── computed ──────────────────────────────────────────────────────────────────

/**
 * Derived read-only signal. Recomputes when its dependencies change.
 *
 *   const [firstName, setFirstName] = signal('Jane');
 *   const [lastName,  setLastName]  = signal('Doe');
 *   const fullName = computed(() => `${firstName()} ${lastName()}`);
 *
 *   fullName() // 'Jane Doe'
 *   setFirstName('John');
 *   fullName() // 'John Doe'
 */
export function computed<T>(fn: () => T): Getter<T> {
  const [get, set] = signal<T>(undefined as T);
  createEffect(() => set(fn()));
  return get;
}

// ── batch ─────────────────────────────────────────────────────────────────────

/**
 * Run multiple signal writes as a single atomic update.
 * All effects are deferred until fn returns, then flushed once (deduplicated).
 *
 * Mirrors SwiftUI's automatic coalescing of mutations within the same event handler.
 *
 *   // Without batch: each setter triggers effects independently (2 runs)
 *   setFirstName('John');
 *   setLastName('Smith');
 *
 *   // With batch: one flush after both writes (1 run)
 *   batch(() => {
 *     setFirstName('John');
 *     setLastName('Smith');
 *   });
 *
 * Nested batch() calls are safe — inner calls are absorbed by the outer batch.
 */
export function batch(fn: () => void): void {
  if (pendingBatch) {
    fn(); // already inside a batch — let the outer one handle flushing
    return;
  }
  const pending = new Set<() => void>();
  pendingBatch = pending;
  try {
    fn();
  } finally {
    pendingBatch = null;
    for (const effect of pending) effect();
  }
}
