import { isSSR } from './env';
import { DocumentFragmentMock, HTMLElementMock, ShadowRootMock } from './mocks';
import type { EventManager } from './events';
import { createEffect, type Getter } from './signal';

export interface Ref<T extends HTMLElement = HTMLElement> {
  current: T | null;
}

export const createRef = <T extends HTMLElement = HTMLElement>(): Ref<T> => ({ current: null });

/** A single directly-appendable child: element, text, nested builder, or nothing.
 *  Internal helper — the public, general type is {@link Child}. */
type StaticChild = HTMLElement | string | ElementBuilder<any> | undefined | null;

/**
 * The one type every `children()` / `replaceChildren()` argument accepts:
 * a node, text, nested builder, `null`/`undefined`, a (nested) array of those,
 * **or** a getter `() => …` marking a reactive region. A getter is re-evaluated
 * whenever a signal it reads changes and its DOM is reconciled in place — no
 * manual `createRef` + `createEffect` + `replaceChildren`. On SSR a getter is
 * evaluated once (static snapshot).
 */
export type Child = StaticChild | StaticChild[] | (() => StaticChild | StaticChild[]);

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
 * Mount a reactive child region into `parent`. Client: a stable anchor comment
 * marks the insertion point; a `createEffect` (owned by the current reactive
 * scope, so auto-disposed with the page) rebuilds and reconciles the region on
 * change. SSR: evaluate once and append the snapshot.
 */
const mountReactiveChildren = (parent: Node, getter: () => StaticChild | StaticChild[]): void => {
  if (isSSR) {
    flattenChildren([getter()]).forEach((item) => {
      const node = toChildNode(item as StaticChild);
      if (node != null) (parent as unknown as { appendChild(n: unknown): unknown }).appendChild(node);
    });
    return;
  }
  const anchor = document.createComment('');
  parent.appendChild(anchor);
  let current: Node[] = [];
  createEffect(() => {
    const resolved = flattenChildren([getter()]);
    for (const n of current) n.parentNode?.removeChild(n);
    const fresh: Node[] = [];
    let ref: ChildNode = anchor;
    for (const item of resolved) {
      const node = toChildNode(item as StaticChild);
      if (node == null) continue;
      ref.after(node as Node);
      ref = node as ChildNode;
      fresh.push(node as Node);
    }
    current = fresh;
  });
};

/** Append mixed static / array / reactive-getter children to a parent node. */
const appendChildren = (parent: Node, items: Child[]): void => {
  flattenChildren(items).forEach((item) => {
    if (typeof item === 'function') {
      mountReactiveChildren(parent, item as () => StaticChild | StaticChild[]);
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
