import { isSSR } from './env';
import { DocumentFragmentMock, HTMLElementMock, ShadowRootMock } from './mocks';
import type { EventManager } from './events';
import { computed, createEffect, createRoot, onCleanup, signal, type Getter } from './signal';

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
  if (item instanceof ElementBuilder) return item.build() as unknown as Node;
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
        if (import.meta.env.DEV) {
          console.error(`[ranui For] duplicate key "${String(k)}" — keys must be unique; ignoring the duplicate item.`);
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

export class ElementBuilder<T extends HTMLElement = HTMLElement> {
  private el: T;

  constructor(tag: string) {
    this.el = (isSSR ? new HTMLElementMock(tag) : document.createElement(tag)) as unknown as T;
  }

  id(value: string): this {
    this.el.setAttribute('id', value);
    return this;
  }

  /**
   * Apply a value now, or bind it reactively when a getter is passed.
   * A getter creates an effect owned by the current reactive scope (createRoot),
   * so the binding is disposed automatically when that scope is torn down.
   */
  private bind<V>(value: V | Getter<V>, apply: (v: V) => void): void {
    if (typeof value === 'function') createEffect(() => apply((value as Getter<V>)()));
    else apply(value);
  }

  class(name: string | Getter<string>): this {
    this.bind(name, (n) => {
      if (isSSR) (this.el as unknown as HTMLElementMock).attributes.set('class', n);
      else this.el.className = n;
    });
    return this;
  }

  addClass(...names: string[]): this {
    names.forEach((n) => this.el.classList.add(n));
    return this;
  }

  removeClass(...names: string[]): this {
    names.forEach((n) => this.el.classList.remove(n));
    return this;
  }

  attr(name: string, value: string | Getter<string>): this {
    this.bind(value, (v) => this.el.setAttribute(name, v));
    return this;
  }

  attrs(values: Record<string, string | number | boolean | null | undefined>): this {
    Object.entries(values).forEach(([name, value]) => {
      if (value == null) return;
      this.el.setAttribute(name, String(value));
    });
    return this;
  }

  boolAttr(name: string, value: boolean | Getter<boolean>, enabledValue = ''): this {
    this.bind(value, (v) => {
      if (v) this.el.setAttribute(name, enabledValue);
      else this.el.removeAttribute(name);
    });
    return this;
  }

  part(value: string | Getter<string>): this {
    return this.attr('part', value);
  }

  data(key: string, value: string | Getter<string>): this {
    return this.attr(`data-${key}`, value);
  }

  style(keyOrMap: string | Record<string, string>, value?: string | Getter<string>): this {
    if (typeof keyOrMap === 'string') {
      this.bind(value ?? '', (v) => this.el.style.setProperty(keyOrMap, v));
    } else {
      Object.entries(keyOrMap).forEach(([k, v]) => this.el.style.setProperty(k, v));
    }
    return this;
  }

  cssVar(name: string, value: string | Getter<string>): this {
    const property = name.startsWith('--') ? name : `--${name}`;
    return this.style(property, value);
  }

  aria(key: string, value: string | Getter<string>): this {
    return this.attr(`aria-${key}`, value);
  }

  role(value: string | Getter<string>): this {
    return this.attr('role', value);
  }

  tabIndex(value: number): this {
    return this.attr('tabindex', String(value));
  }

  label(value: string | Getter<string>): this {
    return this.aria('label', value);
  }

  labelledBy(id: string | Getter<string>): this {
    return this.aria('labelledby', id);
  }

  describedBy(id: string | Getter<string>): this {
    return this.aria('describedby', id);
  }

  ariaHidden(hidden = true): this {
    return this.aria('hidden', String(hidden));
  }

  /**
   * Permanent build-time listener — tied to the element's lifetime.
   * Use for internal shadow DOM elements created in the constructor.
   */
  on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: T, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): this {
    this.el.addEventListener(type, listener as EventListener, options);
    return this;
  }

  /**
   * Lifecycle-managed listener — registered into an EventManager.
   * Use in connectedCallback when building elements that need cleanup on disconnect.
   * Call manager.abort() in disconnectedCallback to remove all listeners at once.
   */
  listen<K extends keyof HTMLElementEventMap>(
    manager: EventManager,
    type: K,
    handler: (this: T, ev: HTMLElementEventMap[K]) => any,
    options?: Omit<AddEventListenerOptions, 'signal'>,
  ): this {
    manager.on(this.el, type, handler as EventListener, options);
    return this;
  }

  /**
   * Delegated listener — the built element acts as the parent container.
   * Fires handler only when the event originates from a descendant matching selector.
   * Registered into an EventManager so it is cleaned up with manager.abort().
   *
   *   Div().class('list')
   *     .children(...)
   *     .delegate(scope, '.item', 'click', (ev, item) => handleItem(item))
   *     .build();
   */
  delegate<K extends keyof HTMLElementEventMap>(
    manager: EventManager,
    selector: string,
    type: K,
    handler: (ev: HTMLElementEventMap[K], target: Element) => void,
    options?: Omit<AddEventListenerOptions, 'signal'>,
  ): this {
    manager.delegate(this.el, selector, type, handler, options);
    return this;
  }

  children(...items: Child[]): this {
    appendChildren(this.el, items);
    return this;
  }

  replaceChildren(...items: Child[]): this {
    if (isSSR) {
      const mock = this.el as unknown as HTMLElementMock | DocumentFragmentMock;
      mock.childrenList = [];
    } else {
      this.el.replaceChildren();
    }
    return this.children(...items);
  }

  text(value: string | Getter<string>): this {
    this.bind(value, (v) => {
      this.el.textContent = v;
    });
    return this;
  }

  ref(holder: Ref<T>): this {
    holder.current = this.el;
    return this;
  }

  shadow(options: ShadowRootInit = { mode: 'closed' }): ShadowBuilder<T> {
    const root = this.el.attachShadow(options);
    return new ShadowBuilder<T>(this.el, root, options);
  }

  build(): T {
    return this.el;
  }

  serialize(): string {
    if (isSSR) return (this.el as unknown as HTMLElementMock).serialize();
    const outer = document.createElement('div');
    outer.appendChild(this.el.cloneNode(true));
    return outer.innerHTML;
  }
}

export class ShadowBuilder<T extends HTMLElement = HTMLElement> {
  private root: ShadowRoot;
  private hostEl: T;
  private options: ShadowRootInit;

  constructor(host: T, root: ShadowRoot, options: ShadowRootInit) {
    this.hostEl = host;
    this.root = root;
    this.options = options;
  }

  children(...items: Child[]): this {
    appendChildren(this.root, items);
    return this;
  }

  adoptSheet(...sheets: CSSStyleSheet[]): this {
    this.root.adoptedStyleSheets = [...this.root.adoptedStyleSheets, ...sheets];
    return this;
  }

  css(cssText: string): this {
    if (isSSR) {
      (this.root as unknown as ShadowRootMock).adoptedStyleSheets.push(cssText);
      return this;
    }
    if (typeof CSSStyleSheet !== 'undefined') {
      try {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(cssText);
        this.root.adoptedStyleSheets = [...this.root.adoptedStyleSheets, sheet];
        return this;
      } catch {
        // Fallback to style injection when adoptedStyleSheets is unavailable.
      }
    }
    const style = document.createElement('style');
    style.textContent = cssText;
    this.root.appendChild(style);
    return this;
  }

  done(): { host: T; shadow: ShadowRoot } {
    return { host: this.hostEl, shadow: this.root };
  }

  serialize(): string {
    if (isSSR) return (this.root as unknown as ShadowRootMock).serialize();
    return (this.root as ShadowRoot).innerHTML;
  }
}
