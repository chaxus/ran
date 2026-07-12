/**
 * Reactive primitives — signal / computed / createEffect / batch, plus an
 * ownership layer (createRoot / onCleanup / getOwner / runWithOwner) and untrack.
 *
 * Design reference: SwiftUI @Observable + Solid.js fine-grained reactivity.
 *
 *   View = f(State)
 *   signal      — reactive source (@State)
 *   computed    — derived, LAZY + memoized (SwiftUI computed property / Solid memo)
 *   createEffect— side effect that re-runs when its reads change (≈ body)
 *   ownership   — effects/memos form an owner tree; disposing a scope disposes
 *                 everything created under it (critical for MPA: tear down a page
 *                 and every effect it spawned is cleaned up in one call).
 *
 * Model (push-pull scheduling + lazy memos):
 *   - Reading a source inside a computation links them both ways.
 *   - Writing a signal marks direct observers DIRTY and their transitive memo
 *     observers CHECK ("maybe dirty"), scheduling any dependent effects. Effects
 *     flush once (deduped — diamond dependencies run an effect a single time).
 *   - Memos recompute lazily on read, and only re-notify their observers when
 *     their derived value actually changes (via `equals`). A CHECK computation
 *     first pulls its sources up to date; if none changed value, it is skipped —
 *     so a memo whose output is stable never wakes the effects behind it.
 *   - Every computation is owned; re-running or disposing it first disposes its
 *     owned children and runs its cleanups (no leaked nested effects).
 */

// ── Types ───────────────────────────────────────────────────────────────────

export type Getter<T> = () => T;
export type Setter<T> = (value: T | ((prev: T) => T)) => void;

export interface SignalOptions<T> {
  /** Custom equality. Defaults to Object.is. Return true to skip the update. */
  equals?: (prev: T, next: T) => boolean;
}

/** Anything a computation can subscribe to (a signal, or a memo). */
interface SourceLike {
  observers: Set<Computation>;
}

/** Staleness of a computation. CLEAN → up to date; CHECK → a memo source may
 *  have changed (verify before recomputing); DIRTY → definitely recompute. */
const CLEAN = 0;
const CHECK = 1;
const DIRTY = 2;
type State = typeof CLEAN | typeof CHECK | typeof DIRTY;

/** An effect or a memo — a node that runs a function and tracks its reads. */
interface Computation extends Owner {
  fn: () => unknown;
  /** Sources (signals / memos) read during the last run. */
  sources: Set<SourceLike>;
  isEffect: boolean;
  running: boolean;
  disposed: boolean;
  state: State;
  // Memo-only fields:
  observers: Set<Computation>; // downstream that read this memo
  value: unknown;
  equals: (a: unknown, b: unknown) => boolean; // gates observer notification
}

/** A node that can own child computations + cleanups (effect, memo, or root). */
export interface Owner {
  owned: Computation[];
  cleanups: Array<() => void>;
  owner: Owner | null;
}

// ── Global tracking state ────────────────────────────────────────────────────

/** The computation currently running — reads link to it. Null = untracked. */
let currentObserver: Computation | null = null;
/** The owner scope currently active — new computations/cleanups attach here. */
let currentOwner: Owner | null = null;
/** >0 while inside batch(): effect flushing is deferred. */
let batchDepth = 0;
/** Effects queued for the next flush (a Set → each runs once per flush). */
const scheduled = new Set<Computation>();
/** Guard against re-entrant flushes (an effect writing a signal mid-flush). */
let flushing = false;

// ── signal ───────────────────────────────────────────────────────────────────

/**
 * Create a reactive value. Returns a `[getter, setter]` tuple.
 *
 *   const [count, setCount] = signal(0);
 *   count();               // read — auto-tracked inside computed / createEffect
 *   setCount(1);           // write — notifies dependents; skipped if unchanged
 *   setCount((n) => n + 1) // updater form
 */
export function signal<T>(initial: T, options?: SignalOptions<T>): [Getter<T>, Setter<T>] {
  const equals = options?.equals ?? Object.is;
  const node: SourceLike & { value: T } = { value: initial, observers: new Set() };

  const get: Getter<T> = () => {
    track(node);
    return node.value;
  };

  const set: Setter<T> = (next) => {
    const value = typeof next === 'function' ? (next as (prev: T) => T)(node.value) : next;
    if (equals(node.value, value)) return;
    node.value = value;
    // markStale only flags/schedules — it never mutates node.observers mid-loop.
    for (const observer of node.observers) markStale(observer, DIRTY);
    if (batchDepth === 0) flush();
  };

  return [get, set];
}

// ── computed (lazy memo) ─────────────────────────────────────────────────────

/**
 * Derived, read-only, LAZY + memoized value. Recomputes only when read after a
 * dependency changed; unread memos never recompute. When a recompute produces an
 * equal value (default `Object.is`, override via `options.equals`) the memo does
 * NOT notify its observers — so effects behind a value-stable memo stay asleep.
 * Owned by the current scope, so it is disposed when that scope is.
 *
 *   const fullName = computed(() => `${first()} ${last()}`);
 *   fullName(); // computes on first read, caches until a dep's value changes
 */
export function computed<T>(fn: () => T, options?: SignalOptions<T>): Getter<T> {
  const node = makeComputation(fn, false, options?.equals as ((a: unknown, b: unknown) => boolean) | undefined);
  adopt(node);

  return () => {
    if (node.disposed) return node.value as T;
    updateIfNecessary(node); // recompute only if actually stale
    track(node); // link the reader to this memo
    return node.value as T;
  };
}

// ── createEffect ──────────────────────────────────────────────────────────────

/**
 * Run `fn` immediately, then re-run it whenever a signal/memo it read changes.
 * Owned by the current scope. `fn` may return a cleanup, called before each
 * re-run and on dispose. Returns a dispose function.
 *
 *   const dispose = createEffect(() => {
 *     el.textContent = `Count: ${count()}`;
 *     return () => {}; // optional cleanup
 *   });
 */
export function createEffect(fn: () => void | (() => void)): () => void {
  const node = makeComputation(fn, true);
  adopt(node);
  runComputation(node);
  return () => disposeComputation(node);
}

// ── batch ─────────────────────────────────────────────────────────────────────

/**
 * Coalesce multiple writes into one flush. Effects run once after `fn` returns,
 * deduplicated. Nested batches are absorbed by the outermost one.
 */
export function batch(fn: () => void): void {
  batchDepth++;
  try {
    fn();
  } finally {
    batchDepth--;
    if (batchDepth === 0) flush();
  }
}

// ── untrack ────────────────────────────────────────────────────────────────────

/** Read signals without subscribing the current computation to them. */
export function untrack<T>(fn: () => T): T {
  const prev = currentObserver;
  currentObserver = null;
  try {
    return fn();
  } finally {
    currentObserver = prev;
  }
}

// ── Ownership ───────────────────────────────────────────────────────────────

/**
 * Create a disposable reactive scope. Effects/memos created inside are owned by
 * it; calling the passed `dispose` tears them all down. Use one per page/route
 * in an MPA/SPA so navigating away cleans up every effect that page spawned.
 *
 *   const dispose = createRoot((dispose) => { renderPage(); return dispose; });
 *   // ...later, on navigation:
 *   dispose();
 */
export function createRoot<T>(fn: (dispose: () => void) => T): T {
  const root: Owner = { owned: [], cleanups: [], owner: currentOwner };
  const prevOwner = currentOwner;
  const prevObserver = currentObserver;
  currentOwner = root;
  currentObserver = null; // roots do not track
  try {
    return fn(() => disposeOwner(root));
  } finally {
    currentOwner = prevOwner;
    currentObserver = prevObserver;
  }
}

/** Register a cleanup on the current scope, run when it re-runs or is disposed. */
export function onCleanup(fn: () => void): void {
  if (currentOwner) currentOwner.cleanups.push(fn);
}

/** The current owner scope (for advanced integrations, e.g. a router). */
export function getOwner(): Owner | null {
  return currentOwner;
}

/** Run `fn` under a specific owner scope (pairs with getOwner). */
export function runWithOwner<T>(owner: Owner | null, fn: () => T): T {
  const prevOwner = currentOwner;
  const prevObserver = currentObserver;
  currentOwner = owner;
  currentObserver = null;
  try {
    return fn();
  } finally {
    currentOwner = prevOwner;
    currentObserver = prevObserver;
  }
}

// ── Internals ────────────────────────────────────────────────────────────────

function makeComputation(
  fn: () => unknown,
  isEffect: boolean,
  equals?: (a: unknown, b: unknown) => boolean,
): Computation {
  return {
    fn,
    sources: new Set(),
    isEffect,
    running: false,
    disposed: false,
    state: DIRTY, // never run yet
    observers: new Set(),
    value: undefined,
    equals: equals ?? Object.is,
    owned: [],
    cleanups: [],
    owner: currentOwner,
  };
}

/** Attach a computation to the current owner so it is disposed with the scope. */
function adopt(node: Computation): void {
  if (currentOwner) currentOwner.owned.push(node);
}

function track(source: SourceLike): void {
  if (currentObserver) {
    currentObserver.sources.add(source);
    source.observers.add(currentObserver);
  }
}

/**
 * Propagate a change. `state` is DIRTY when `node` directly read the changed
 * source, or CHECK when a memo upstream of it may have changed. Effects are
 * scheduled; a memo, the first time it leaves CLEAN, marks its own observers
 * CHECK so the staleness reaches the effects behind it. The `state >= incoming`
 * guard makes this idempotent (a DIRTY effect is not re-scheduled by a later
 * CHECK) and terminates diamonds.
 */
function markStale(node: Computation, state: State): void {
  if (node.disposed || node.state >= state) return;
  const wasClean = node.state === CLEAN;
  node.state = state;
  if (node.isEffect) {
    scheduled.add(node);
  } else if (wasClean) {
    // A clean memo becoming stale: its observers are now "maybe dirty".
    // Recursion touches each observer's own observers, never this node's.
    for (const observer of node.observers) markStale(observer, CHECK);
  }
}

function flush(): void {
  if (batchDepth > 0 || flushing) return; // re-entrant writes drain via the loop below
  flushing = true;
  try {
    // Loop: an effect may schedule more effects as it runs.
    while (scheduled.size > 0) {
      const batchOfEffects = [...scheduled];
      scheduled.clear();
      for (const effect of batchOfEffects) {
        if (!effect.disposed) updateIfNecessary(effect);
      }
    }
  } finally {
    flushing = false;
  }
}

/**
 * Bring `node` up to date, recomputing only if it is genuinely dirty. A CHECK
 * node first pulls every memo source current: a source whose value changed marks
 * `node` DIRTY (via runComputation → markStale). If none did, `node` stays CHECK
 * and is skipped — this is what keeps a value-stable memo from waking effects.
 * All sources are refreshed (no early break) so none recompute mid-run and
 * spuriously re-schedule the node.
 */
function updateIfNecessary(node: Computation): void {
  if (node.disposed || node.state === CLEAN) return;
  if (node.state === CHECK) {
    // Refreshing a source recomputes only that memo; it never mutates node.sources.
    for (const source of node.sources) {
      if ('fn' in source) updateIfNecessary(source as Computation); // only memos have `fn`
    }
  }
  if (node.state === DIRTY) runComputation(node);
  node.state = CLEAN;
}

function runComputation(node: Computation): void {
  if (node.running) {
    throw new Error('ranui reactivity: cyclic dependency detected (a computation triggered itself).');
  }
  cleanNode(node);

  const prevObserver = currentObserver;
  const prevOwner = currentOwner;
  currentObserver = node;
  currentOwner = node;
  node.running = true;
  // Mark clean up front: a genuine re-entrant write inside fn (a cycle) re-marks
  // and re-enters, tripping the `running` guard above. Memo sources are already
  // current here (updateIfNecessary refreshed them), so no benign re-mark occurs.
  node.state = CLEAN;
  try {
    const result = node.fn();
    if (node.isEffect) {
      if (typeof result === 'function') node.cleanups.push(result as () => void);
    } else {
      // memo: store value; notify observers only when the value actually changed.
      const prev = node.value;
      node.value = result;
      // Notify only when there are observers AND the value changed. Skipping the
      // empty-observer case also means `equals` never sees the initial `undefined`
      // sentinel (the first run always precedes any observer). markStale only
      // flags/schedules — it never mutates node.observers here.
      if (node.observers.size > 0 && !node.equals(prev, result)) {
        for (const observer of node.observers) markStale(observer, DIRTY);
      }
    }
  } finally {
    node.running = false;
    currentObserver = prevObserver;
    currentOwner = prevOwner;
  }
}

/** Dispose owned children, run cleanups, and unlink from all sources. */
function cleanNode(node: Computation): void {
  for (const child of node.owned) disposeComputation(child);
  node.owned.length = 0;

  for (const cleanup of node.cleanups) cleanup();
  node.cleanups.length = 0;

  for (const source of node.sources) source.observers.delete(node);
  node.sources.clear();
}

function disposeComputation(node: Computation): void {
  if (node.disposed) return;
  node.disposed = true;
  cleanNode(node);
  node.observers.clear();
}

function disposeOwner(owner: Owner): void {
  for (const child of owner.owned) disposeComputation(child);
  owner.owned.length = 0;
  for (const cleanup of owner.cleanups) cleanup();
  owner.cleanups.length = 0;
}
