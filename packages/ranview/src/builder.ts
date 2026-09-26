import { isSSR } from './env';
import { DocumentFragmentMock, HTMLElementMock, ShadowRootMock } from './mocks';
import type { EventManager } from './events';
import type { Child, Ref } from './core';
type Getter<T> = () => T;

export interface BuilderRuntime {
  bind<V>(value: V | Getter<V>, apply: (value: V) => void): void;
  append(parent: Node, items: Child[]): void;
}

/** One-shot node operations shared by SSR and the signal-free static entry. */
export const staticRuntime: BuilderRuntime = {
  bind(value, apply) {
    apply(typeof value === 'function' ? (value as Getter<any>)() : value);
  },
  append(parent, items) {
    for (const item of items) {
      if (item == null) continue;
      if (Array.isArray(item)) {
        staticRuntime.append(parent, item);
        continue;
      }
      if (typeof item === 'function') {
        staticRuntime.append(parent, [item()]);
        continue;
      }
      if (typeof item === 'object' && ('__ranFor' in item || '__ranIndex' in item)) {
        throw new TypeError('Import For and Index from the static entry when using static builders');
      }
      const node =
        item instanceof ElementBuilder
          ? item.build()
          : typeof item === 'string' && !isSSR
            ? document.createTextNode(item)
            : item;
      (parent as unknown as { appendChild(node: unknown): unknown }).appendChild(node);
    }
  },
};

export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/**
 * Tags that exist only in SVG, so a builder can create them correctly without
 * being told which namespace they belong to.
 *
 * Deliberately excludes the tags SVG shares with HTML -- `a`, `script`,
 * `style`, `title` -- since guessing wrong there would silently produce the
 * wrong kind of element for the far more common HTML case. Reach for `Svg()`
 * when one of those is meant as SVG.
 */
const SVG_ONLY_TAGS = new Set([
  'svg',
  'circle',
  'clipPath',
  'defs',
  'desc',
  'ellipse',
  'feBlend',
  'feColorMatrix',
  'feComposite',
  'feDropShadow',
  'feFlood',
  'feGaussianBlur',
  'feMerge',
  'feMergeNode',
  'feOffset',
  'filter',
  'foreignObject',
  'g',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'switch',
  'symbol',
  'text',
  'textPath',
  'tspan',
  'use',
]);

export class ElementBuilder<T extends HTMLElement = HTMLElement> {
  private el: T;

  /**
   * @param tag element name
   * @param namespace element namespace; inferred for SVG-only tags, and forced
   * by `Svg()` for the tags SVG shares with HTML.
   *
   * The namespace matters more than it looks. `document.createElement('svg')`
   * yields an `HTMLUnknownElement`: the browser does not render it as SVG, and
   * -- because HTML lowercases attribute names -- `viewBox` lands as `viewbox`,
   * which SVG reads case-sensitively and therefore ignores. An icon built that
   * way is invisible, with markup that looks right in a serialized page.
   */
  constructor(
    tag: string,
    namespace?: string,
    private runtime: BuilderRuntime = staticRuntime,
  ) {
    const ns = namespace ?? (SVG_ONLY_TAGS.has(tag) ? SVG_NAMESPACE : undefined);
    this.el = (isSSR
      ? new HTMLElementMock(tag)
      : ns
        ? document.createElementNS(ns, tag)
        : document.createElement(tag)) as unknown as T;
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
    this.runtime.bind(value, apply);
  }

  /**
   * Sets the element's class.
   *
   * Written through `setAttribute` rather than `className`. On an SVG element `className`
   * is a read-only `SVGAnimatedString`, so assigning to it throws
   * `Cannot set property className of [object SVGElement] which has only a getter` — which,
   * happening inside a custom element's constructor, leaves the element un-upgraded with
   * no shadow root rather than reporting a styling problem. `setAttribute` is equivalent
   * for HTML elements and correct for both.
   */
  class(name: string | Getter<string>): this {
    this.bind(name, (n) => {
      if (isSSR) (this.el as unknown as HTMLElementMock).attributes.set('class', n);
      else this.el.setAttribute('class', n);
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
    this.runtime.append(this.el, items);
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

  /**
   * Set the element's content from a string of markup, without escaping it.
   *
   * The counterpart to `text()`, and named for the difference: `text()` escapes,
   * this does not. Everything handed here is parsed as HTML, so anything that
   * came from outside the program must be sanitized before it arrives.
   *
   * It exists because some content simply *is* HTML, and a builder without this
   * cannot express it at all: markdown rendered for a page, a fragment assembled
   * somewhere else, a translated string that carries its own emphasis
   * (`Local-first · <b>open source</b>`). That gap is why a static-site
   * generator with markdown in it could not be written against this API and had
   * to concatenate strings instead.
   *
   * Like `textContent`, this replaces whatever content the element had --
   * including anything set by `text()` or `children()` before it.
   */
  unsafeHtml(value: string | Getter<string>): this {
    this.bind(value, (v) => {
      this.el.innerHTML = v;
    });
    return this;
  }

  ref(holder: Ref<T>): this {
    holder.current = this.el;
    return this;
  }

  shadow(options: ShadowRootInit = { mode: 'closed' }): ShadowBuilder<T> {
    const root = this.el.attachShadow(options);
    return new ShadowBuilder<T>(this.el, root, options, this.runtime);
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

  /**
   * `options` is taken and discarded: `attachShadow` has already consumed it by the time
   * a builder exists, and nothing ever read the copy this class used to keep. The
   * parameter stays so the call signature is unchanged.
   */
  constructor(
    host: T,
    root: ShadowRoot,
    _options: ShadowRootInit,
    private runtime: BuilderRuntime = staticRuntime,
  ) {
    this.hostEl = host;
    this.root = root;
  }

  children(...items: Child[]): this {
    this.runtime.append(this.root, items);
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
