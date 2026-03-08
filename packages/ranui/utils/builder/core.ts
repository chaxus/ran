import { isSSR } from './env';
import { HTMLElementMock, ShadowRootMock } from './mocks';

export interface Ref<T extends HTMLElement = HTMLElement> {
  current: T | null;
}

export const createRef = <T extends HTMLElement = HTMLElement>(): Ref<T> => ({ current: null });

export class ElementBuilder<T extends HTMLElement = HTMLElement> {
  private el: T;

  constructor(tag: string) {
    this.el = (isSSR ? new HTMLElementMock(tag) : document.createElement(tag)) as unknown as T;
  }

  id(value: string): this {
    this.el.setAttribute('id', value);
    return this;
  }

  class(name: string): this {
    if (isSSR) (this.el as unknown as HTMLElementMock).attributes.set('class', name);
    else this.el.className = name;
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

  attr(name: string, value: string): this {
    this.el.setAttribute(name, value);
    return this;
  }

  part(value: string): this {
    this.el.setAttribute('part', value);
    return this;
  }

  data(key: string, value: string): this {
    return this.attr(`data-${key}`, value);
  }

  style(keyOrMap: string | Record<string, string>, value?: string): this {
    if (typeof keyOrMap === 'string') {
      this.el.style.setProperty(keyOrMap, value ?? '');
    } else {
      Object.entries(keyOrMap).forEach(([k, v]) => this.el.style.setProperty(k, v));
    }
    return this;
  }

  aria(key: string, value: string): this {
    return this.attr(`aria-${key}`, value);
  }

  role(value: string): this {
    return this.attr('role', value);
  }

  tabIndex(value: number): this {
    return this.attr('tabindex', String(value));
  }

  label(value: string): this {
    return this.aria('label', value);
  }

  labelledBy(id: string): this {
    return this.aria('labelledby', id);
  }

  describedBy(id: string): this {
    return this.aria('describedby', id);
  }

  ariaHidden(hidden = true): this {
    return this.aria('hidden', String(hidden));
  }

  on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: T, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): this {
    this.el.addEventListener(type, listener as EventListener, options);
    return this;
  }

  children(
    ...items: (
      | HTMLElement
      | string
      | ElementBuilder<any>
      | undefined
      | null
      | (HTMLElement | string | ElementBuilder<any> | undefined | null)[]
    )[]
  ): this {
    const flatten = (arr: any[]): any[] =>
      arr.reduce((acc, val) => (Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val)), []);

    flatten(items).forEach((item) => {
      if (item == null) return;
      if (item instanceof ElementBuilder) {
        this.el.appendChild(item.build() as unknown as Node);
      } else if (typeof item === 'string') {
        if (isSSR) this.el.appendChild(item as any);
        else this.el.appendChild(document.createTextNode(item));
      } else {
        this.el.appendChild(item as Node);
      }
    });
    return this;
  }

  text(value: string): this {
    this.el.textContent = value;
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

  children(
    ...items: (
      | HTMLElement
      | string
      | ElementBuilder<any>
      | undefined
      | null
      | (HTMLElement | string | ElementBuilder<any> | undefined | null)[]
    )[]
  ): this {
    const flatten = (arr: any[]): any[] =>
      arr.reduce((acc, val) => (Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val)), []);

    flatten(items).forEach((item) => {
      if (item == null) return;
      if (item instanceof ElementBuilder) {
        this.root.appendChild(item.build() as unknown as Node);
      } else if (typeof item === 'string') {
        if (isSSR) this.root.appendChild(item as any);
        else this.root.appendChild(document.createTextNode(item));
      } else {
        this.root.appendChild(item as Node);
      }
    });
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
