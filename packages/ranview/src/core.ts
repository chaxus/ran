import { isSSR } from './env';
import { ElementBuilder as BaseElementBuilder } from './builder';
import { computed, createEffect, createRoot, onCleanup, signal, untrack, type Getter } from './signal';

export interface Ref<T extends HTMLElement = HTMLElement> {
  current: T | null;
}

export const createRef = <T extends HTMLElement = HTMLElement>(): Ref<T> => ({ current: null });

/** A single directly-appendable child: element, text, nested builder, or nothing.
 *  Internal helper — the public, general type is {@link Child}. */
type StaticChild = HTMLElement | string | ElementBuilder<any> | undefined | null;

/**
 * The one type every `children()` / `replaceChildren()` argument accepts —
 * fully composable (recursive): a node, text, nested builder, `null`/`undefined`,
 * a (nested) array, a {@link For}/{@link Index} handle for a keyed list, or a
 * getter `() => Child` marking a reactive region. A getter (or `Show`/`Switch`
 * branch) may itself return any `Child`, including a `For`/`Index` or another
 * getter — control-flow nests freely. On SSR getters / `For` / `Index` render once.
 */
export type Child = StaticChild | ForHandle | IndexHandle | Child[] | (() => Child);

const flattenChildren = (arr: unknown[]): unknown[] =>
  arr.reduce<unknown[]>((acc, val) => (Array.isArray(val) ? acc.concat(flattenChildren(val)) : acc.concat(val)), []);

/** Resolve one static child to a node (client) / string (SSR); `null` when skippable. */
const toChildNode = (item: StaticChild): Node | string | null => {
  if (item == null) return null;
  if (item instanceof BaseElementBuilder) return item.build() as unknown as Node;
  if (typeof item === 'string') return isSSR ? item : document.createTextNode(item);
  return item as Node;
};

/**
 * Mount a reactive child region into `parent`. The getter may return **any**
 * `Child` — static nodes, arrays, a `For`/`Index` handle, or another getter —
 * so `Show`/`Switch` branches nest control flow freely.
 *
 * Client: a `start`/`end` comment pair brackets the region. Each run disposes the
 * previous run's scope (tearing down any nested `For`/`Index`/getter effects),
 * clears the bracketed nodes, then mounts the new output under a fresh
 * `createRoot` via `appendChildren` (uniform dispatch). SSR: evaluate once.
 */
const mountReactiveChildren = (parent: Node, getter: () => Child): void => {
  if (isSSR) {
    appendChildren(parent, [getter()]);
    return;
  }
  const start = document.createComment('');
  const end = document.createComment('');
  parent.appendChild(start);
  parent.appendChild(end);
  let disposeInner: (() => void) | null = null;
  const clear = (): void => {
    disposeInner?.();
    disposeInner = null;
    let n = start.nextSibling;
    while (n && n !== end) {
      const nextN = n.nextSibling;
      n.parentNode?.removeChild(n);
      n = nextN;
    }
  };
  createEffect(() => {
    const out = getter();
    clear();
    const frag = document.createDocumentFragment();
    disposeInner = createRoot((dispose) => {
      appendChildren(frag, [out]);
      return dispose;
    });
    end.parentNode?.insertBefore(frag, end);
  });
  onCleanup(() => disposeInner?.());
};

// ── For — keyed list reconciliation ──────────────────────────────────────────

const FOR_BRAND = '__ranFor';

/** Options for {@link For}. */
export interface ForOptions<T> {
  /** Reactive source array. Read inside an effect, so the list updates on change. */
  each: () => readonly T[] | null | undefined;
  /** Stable identity per item — **must be unique** within the list. Reused across
   *  updates to match old nodes to new items (that is what preserves DOM state). */
  key: (item: T, index: number) => string | number;
  /** Render one item to a single node. `index` is a **getter** (reactive): it
   *  reflects the item's current position even after the list reorders. Runs once
   *  per item (not on every list change) — drive per-item updates with signals. */
  render: (item: T, index: Getter<number>) => StaticChild;
}

interface ForSpec<T> extends ForOptions<T> {
  [FOR_BRAND]: true;
}

/** Opaque handle returned by {@link For}; pass it straight to `children()`. */
export type ForHandle = { readonly [FOR_BRAND]: true };

/**
 * Keyed list for `children()`. Unlike a plain getter child (which rebuilds the
 * whole region on every change), `For` matches items by `key` and **reuses their
 * DOM nodes** — only added/removed/moved items touch the DOM, so focus, scroll,
 * input values and in-flight transitions inside surviving rows are preserved.
 *
 *   Ul().children(
 *     For({
 *       each: () => rows(),
 *       key: (r) => r.id,
 *       render: (r, i) => Li().text(() => `${i()}. ${r.title}`),
 *     }),
 *   );
 *
 * On SSR the list is rendered once as a static snapshot. Must be built inside a
 * `createRoot` so per-item scopes are disposed with the page.
 */
export function For<T>(options: ForOptions<T>): ForHandle {
  return { ...options, [FOR_BRAND]: true } as ForSpec<T>;
}

const isForSpec = (v: unknown): v is ForSpec<unknown> =>
  typeof v === 'object' && v !== null && (v as Record<string, unknown>)[FOR_BRAND] === true;

// ── Show — fine-grained conditional ──────────────────────────────────────────

/** Options for {@link Show}. */
export interface ShowOptions<T> {
  /** Condition source. Truthy → `children`, falsy → `fallback`. */
  when: () => T;
  /** Built when `when` is truthy. May return any {@link Child} — a `For`/`Index`
   *  list, a nested `Show`, etc. Receives an accessor to the narrowed value —
   *  read it inside a binding (`.text(() => v())`) to update without rebuilding. */
  children: (value: () => NonNullable<T>) => Child;
  /** Built when `when` is falsy. Omitted → nothing is rendered. */
  fallback?: () => Child;
}

/**
 * Fine-grained conditional child. Unlike a raw getter child (which re-runs on
 * **every** change it reads), `Show` rebuilds the branch **only when the
 * truthiness of `when` flips** — the condition is memoized. Content inside a
 * branch updates through its own bindings, not by re-running `Show`. This is the
 * SwiftUI/Solid model: build once, toggle only when the branch actually changes.
 *
 *   Show({
 *     when: () => user(),                       // reads a signal
 *     children: (u) => Div().text(() => u().name),
 *     fallback: () => Div().text('Signed out'),
 *   })
 *
 * `Show` returns a getter, so it is accepted anywhere `children()` takes a child.
 * Must be created inside a `createRoot` (it owns a memo + the branch effect).
 */
export function Show<T>(options: ShowOptions<T>): () => Child {
  if (isSSR)
    return () =>
      untrack(() =>
        options.when() ? options.children(() => options.when() as NonNullable<T>) : (options.fallback?.() ?? null),
      );
  const on = computed(() => Boolean(options.when()));
  const value = (): NonNullable<T> => options.when() as NonNullable<T>;
  return () => (on() ? options.children(value) : (options.fallback?.() ?? null));
}

// ── Switch / Match — fine-grained multi-branch ───────────────────────────────

/** One branch of a {@link Switch}; build with {@link Match}. */
export interface MatchClause<T> {
  when: () => T;
  children: (value: () => NonNullable<T>) => Child;
}

/** Declare one `Switch` branch (identity helper — gives per-clause type inference). */
export function Match<T>(clause: MatchClause<T>): MatchClause<T> {
  return clause;
}

/** Options for {@link Switch}. */
export interface SwitchOptions {
  /** Branches, tried in order; the first with a truthy `when` renders. Clauses are
   *  heterogeneous (each `Match<T>` carries its own `T`), hence `any` here. */
  children: MatchClause<any>[];
  /** Rendered when no branch matches. Omitted → nothing. */
  fallback?: () => Child;
}

/**
 * Fine-grained multi-branch conditional (the n-way `Show`). Renders the first
 * `Match` whose `when` is truthy, else `fallback`. Only the **index of the
 * winning branch** is memoized, so it rebuilds only when the active branch
 * changes — not on every change a `when` reads. Evaluation short-circuits at the
 * first match (later branches aren't subscribed while an earlier one wins).
 *
 *   Switch({
 *     fallback: () => Span().text('idle'),
 *     children: [
 *       Match({ when: () => status() === 'loading', children: () => Spinner() }),
 *       Match({ when: () => error(), children: (e) => ErrorView(e) }),
 *     ],
 *   })
 */
export function Switch(options: SwitchOptions): () => Child {
  if (isSSR)
    return () =>
      untrack(() => {
        const clause = options.children.find((c) => Boolean(c.when()));
        return clause ? clause.children(() => clause.when() as NonNullable<unknown>) : (options.fallback?.() ?? null);
      });
  const clauses = options.children;
  const winner = computed(() => clauses.findIndex((c) => Boolean(c.when())));
  return () => {
    const i = winner();
    if (i < 0) return options.fallback?.() ?? null;
    const clause = clauses[i];
    return clause.children(() => clause.when() as NonNullable<unknown>);
  };
}

interface ItemScope {
  node: Node | null;
  index: (value: number) => void;
  dispose: () => void;
}

/** Create one item's node inside its own reactive scope (independently disposable). */
const createItemScope = <T>(item: T, i: number, render: ForSpec<T>['render']): ItemScope => {
  const [index, setIndex] = signal(i);
  let node: Node | null = null;
  const dispose = createRoot((d) => {
    const built = toChildNode(render(item, index) as StaticChild);
    node = typeof built === 'string' ? document.createTextNode(built) : built;
    return d;
  });
  return { node, index: setIndex, dispose };
};

/** Reorder `nodes` to sit, in order, immediately after `anchor` — moving only
 *  those out of place (reused nodes keep their identity, hence their state). */
const placeAfterAnchor = (anchor: ChildNode, nodes: Node[]): void => {
  const parent = anchor.parentNode;
  if (!parent) return;
  let ref: ChildNode = anchor;
  for (const node of nodes) {
    if (ref.nextSibling !== node) parent.insertBefore(node, ref.nextSibling);
    ref = node as ChildNode;
  }
};

/** Mount a keyed list: SSR renders once; client reconciles by key on each change. */
const mountKeyedList = <T>(parent: Node, spec: ForSpec<T>): void => {
  if (isSSR) {
    (spec.each() ?? []).forEach((item, i) => {
      const node = toChildNode(spec.render(item, () => i) as StaticChild);
      if (node != null) (parent as unknown as { appendChild(n: unknown): unknown }).appendChild(node);
    });
    return;
  }

  const anchor = document.createComment('');
  parent.appendChild(anchor);
  let scopes = new Map<string | number, ItemScope>();
  onCleanup(() => {
    for (const scope of scopes.values()) scope.dispose();
    scopes.clear();
  });

  createEffect(() => {
    const items = spec.each() ?? [];
    const next = new Map<string | number, ItemScope>();
    const ordered: Node[] = [];

    items.forEach((item, i) => {
      const k = spec.key(item, i);
      // Duplicate key: a Map can hold one node per key, so honouring the second
      // would orphan the first (untracked → never removed/disposed). Ignore the
      // duplicate — deterministic and leak-free — and warn in dev.
      if (next.has(k)) {
        if (isDev()) {
          console.error(
            `[ranview For] duplicate key "${String(k)}" — keys must be unique; ignoring the duplicate item.`,
          );
        }
        return;
      }
      let scope = scopes.get(k);
      if (scope) {
        scopes.delete(k); // claimed → leftovers below are removals
        scope.index(i); // keep the reactive index in sync after moves
      } else {
        scope = createItemScope(item, i, spec.render);
      }
      next.set(k, scope);
      if (scope.node) ordered.push(scope.node);
    });

    // Remove + dispose items no longer present.
    for (const scope of scopes.values()) {
      scope.node?.parentNode?.removeChild(scope.node);
      scope.dispose();
    }
    placeAfterAnchor(anchor, ordered);
    scopes = next;
  });
};

// ── Index — position-keyed list ──────────────────────────────────────────────

const INDEX_BRAND = '__ranIndex';

/** Options for {@link Index}. */
export interface IndexOptions<T> {
  /** Reactive source array. */
  each: () => readonly T[] | null | undefined;
  /** Render the slot at a position. `item` is a **getter** (a signal): when the
   *  value at this index changes, it updates in place — the node is not rebuilt.
   *  `index` is a fixed number (the position never moves). */
  render: (item: () => T, index: number) => StaticChild;
}

interface IndexSpec<T> extends IndexOptions<T> {
  [INDEX_BRAND]: true;
}

/** Opaque handle returned by {@link Index}; pass it straight to `children()`. */
export type IndexHandle = { readonly [INDEX_BRAND]: true };

/**
 * Position-keyed list. The node at index `i` is **reused** across updates and its
 * `item` signal is updated in place — nodes never move. Use it when position is
 * the identity (primitive arrays, fixed-length rows). Use {@link For} instead
 * when items have a stable id and can reorder. SSR renders once.
 *
 *   Ul().children(
 *     Index({ each: () => nums(), render: (n, i) => Li().text(() => `${i}: ${n()}`) }),
 *   );
 */
export function Index<T>(options: IndexOptions<T>): IndexHandle {
  return { ...options, [INDEX_BRAND]: true } as IndexSpec<T>;
}

const isIndexSpec = (v: unknown): v is IndexSpec<unknown> =>
  typeof v === 'object' && v !== null && (v as Record<string, unknown>)[INDEX_BRAND] === true;

interface IndexSlot<T> {
  node: Node | null;
  setItem: (value: T) => void;
  dispose: () => void;
}

const createIndexSlot = <T>(item: T, i: number, render: IndexSpec<T>['render']): IndexSlot<T> => {
  const [get, setItem] = signal(item);
  let node: Node | null = null;
  const dispose = createRoot((d) => {
    const built = toChildNode(render(get, i) as StaticChild);
    node = typeof built === 'string' ? document.createTextNode(built) : built;
    return d;
  });
  return { node, setItem, dispose };
};

/** Mount a position-keyed list: SSR renders once; client reuses nodes per index. */
const mountIndexList = <T>(parent: Node, spec: IndexSpec<T>): void => {
  if (isSSR) {
    (spec.each() ?? []).forEach((item, i) => {
      const node = toChildNode(spec.render(() => item, i) as StaticChild);
      if (node != null) (parent as unknown as { appendChild(n: unknown): unknown }).appendChild(node);
    });
    return;
  }

  const anchor = document.createComment('');
  parent.appendChild(anchor);
  let slots: IndexSlot<T>[] = [];
  onCleanup(() => {
    for (const s of slots) s.dispose();
    slots = [];
  });

  createEffect(() => {
    const items = spec.each() ?? [];
    // Reuse slot 0..n: update its signal (no-op if unchanged) — node stays put.
    for (let i = 0; i < items.length; i++) {
      if (i < slots.length) slots[i].setItem(items[i]);
      else slots.push(createIndexSlot(items[i], i, spec.render));
    }
    // Trailing slots (list shrank) → remove + dispose.
    for (let i = slots.length - 1; i >= items.length; i--) {
      const { node } = slots[i];
      node?.parentNode?.removeChild(node);
      slots[i].dispose();
      slots.pop();
    }
    placeAfterAnchor(
      anchor,
      slots.map((s) => s.node).filter((n): n is Node => n != null),
    );
  });
};

/** Append mixed static / array / reactive-getter / keyed-list children to a parent node. */
const appendChildren = (parent: Node, items: Child[]): void => {
  if (isSSR) untrack(() => appendTrackedChildren(parent, items));
  else appendTrackedChildren(parent, items);
};
const appendTrackedChildren = (parent: Node, items: Child[]): void => {
  flattenChildren(items).forEach((item) => {
    if (isForSpec(item)) {
      mountKeyedList(parent, item);
      return;
    }
    if (isIndexSpec(item)) {
      mountIndexList(parent, item);
      return;
    }
    if (typeof item === 'function') {
      mountReactiveChildren(parent, item as () => Child);
      return;
    }
    const node = toChildNode(item as StaticChild);
    if (node != null) (parent as unknown as { appendChild(n: unknown): unknown }).appendChild(node);
  });
};

/**
 * True in a dev build, without needing `vite/client` in the consumer's tsconfig.
 *
 * This package exports TypeScript source to workspace consumers, so its types are checked
 * in *their* project. A bare `import.meta.env.DEV` therefore fails to compile anywhere
 * that has not declared Vite's ambient types — which is every consumer that does not
 * happen to use Vite.
 */
const isDev = (): boolean => (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true;

export { ShadowBuilder, SVG_NAMESPACE } from './builder';

/** Shared per-entry strategy, never mutated by a request or a builder. */
const reactiveRuntime = {
  bind<V>(value: V | Getter<V>, apply: (value: V) => void): void {
    if (typeof value !== 'function') {
      apply(value);
      return;
    }
    if (isSSR) untrack(() => apply((value as Getter<V>)()));
    else createEffect(() => apply((value as Getter<V>)()));
  },
  append: appendChildren,
};

/** Reactive browser builder; SSR bindings are untracked snapshots. */
export class ElementBuilder<T extends HTMLElement = HTMLElement> extends BaseElementBuilder<T> {
  constructor(tag: string, namespace?: string) {
    super(tag, namespace, reactiveRuntime);
  }
}
