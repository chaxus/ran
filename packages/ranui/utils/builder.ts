// ─── SSR Guard & Mocks ────────────────────────────────────────────────────────
const isSSR = typeof document === 'undefined';

/**
 * A minimal mock of DocumentFragment for SSR environments.
 */
export class DocumentFragmentMock {
  public childrenList: (HTMLElementMock | string)[] = [];
  appendChild(node: any): any {
    this.childrenList.push(node);
    return node;
  }
  serialize(): string {
    return this.childrenList
      .map((child) => (typeof child === 'string' ? escapeHtml(child) : child.serialize()))
      .join('');
  }
  // For compatibility with polyfills or manual queries
  querySelector(): null {
    return null;
  }
  querySelectorAll(): any[] {
    return [] as any;
  }
}

/**
 * A robust mock of HTMLElement for SSR environments.
 */
export class HTMLElementMock {
  public tagName: string;
  public attributes: Map<string, string> = new Map<string, string>();
  public inlineStyles: Map<string, string> = new Map<string, string>();
  public childrenList: (HTMLElementMock | string | DocumentFragmentMock)[] = [];
  public shadowRoot: ShadowRootMock | null = null;
  public textContent: string | null = null;
  public content?: DocumentFragmentMock; // For <template>

  public style = {
    setProperty: (k: string, v: string): void => {
      const prop = k.startsWith('--') ? k : k.replace(/([A-Z])/g, '-$1').toLowerCase();
      this.inlineStyles.set(prop, v);
    },
    removeProperty: (k: string): boolean => this.inlineStyles.delete(k),
  };

  public classList = {
    add: (...names: string[]): void => {
      const existing = this.attributes.get('class') || '';
      const list = new Set([...existing.split(' ').filter(Boolean), ...names]);
      this.attributes.set('class', Array.from(list).join(' '));
    },
    remove: (...names: string[]): void => {
      const existing = this.attributes.get('class') || '';
      const list = existing.split(' ').filter((c) => !names.includes(c));
      this.attributes.set('class', list.join(' '));
    },
    toggle: (name: string): void => {
      if (this.classList.contains(name)) this.classList.remove(name);
      else this.classList.add(name);
    },
    contains: (name: string): boolean => (this.attributes.get('class') || '').split(' ').includes(name),
  };

  private _innerHTML: string = '';
  get innerHTML(): string {
    return this._innerHTML;
  }
  set innerHTML(value: string) {
    this._innerHTML = value;
    if (this.tagName === 'template' && this.content) {
      // In a real browser, setting template.innerHTML populates template.content.
      // For SSR, we just store it. A more robust mock would parse it.
      this.content.childrenList = [value];
    }
  }

  constructor(tag: string = 'div') {
    this.tagName = tag.toLowerCase();
    if (this.tagName === 'template') {
      this.content = new DocumentFragmentMock();
    }
  }

  setAttribute(k: string, v: string): void {
    this.attributes.set(k, v);
  }
  getAttribute(k: string): string | null {
    return this.attributes.get(k) || null;
  }
  removeAttribute(k: string): void {
    this.attributes.delete(k);
  }
  hasAttribute(k: string): boolean {
    return this.attributes.has(k);
  }

  appendChild(node: any): any {
    this.childrenList.push(node);
    return node;
  }

  attachShadow(options: ShadowRootInit): ShadowRoot {
    this.shadowRoot = new ShadowRootMock(this, options);
    return this.shadowRoot as unknown as ShadowRoot;
  }

  querySelector(selector: string): HTMLElementMock | null {
    // Basic support for querySelector in constructor for rehydration properties
    if (selector.startsWith('.') || selector.startsWith('#')) {
      // Deep search (simplified)
      const find = (nodes: any[]): any => {
        for (const node of nodes) {
          if (node instanceof HTMLElementMock) {
            if (selector.startsWith('.') && node.classList.contains(selector.slice(1))) return node;
            if (selector.startsWith('#') && node.getAttribute('id') === selector.slice(1)) return node;
            const found = find(node.childrenList);
            if (found) return found;
          }
        }
        return null;
      };
      return find(this.childrenList);
    }
    return null;
  }

  querySelectorAll(): any[] {
    return [] as any;
  }
  addEventListener(): void {
    return;
  }
  removeEventListener(): void {
    return;
  }

  serialize(): string {
    const attrs = Array.from(this.attributes.entries())
      .map(([k, v]) => ` ${k}="${escapeHtmlAttribute(v)}"`)
      .join('');

    const styleString = Array.from(this.inlineStyles.entries())
      .map(([k, v]) => `${k}:${v}`)
      .join(';');

    const styleAttr = styleString ? ` style="${escapeHtmlAttribute(styleString)}"` : '';

    let innerHTML = '';
    if (this.shadowRoot) innerHTML += this.shadowRoot.serialize();

    if (this.textContent !== null) {
      innerHTML += escapeHtml(this.textContent);
    } else if (this._innerHTML) {
      innerHTML += this._innerHTML; // Warning: this assumes raw HTML is safe if manually set
    } else {
      innerHTML += this.childrenList
        .map((child) => {
          if (typeof child === 'string') return escapeHtml(child);
          if (child instanceof DocumentFragmentMock) return child.serialize();
          return child.serialize();
        })
        .join('');
    }

    const selfClosing = [
      'area',
      'base',
      'br',
      'col',
      'embed',
      'hr',
      'img',
      'input',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
    ];
    if (selfClosing.includes(this.tagName) && !innerHTML) {
      return `<${this.tagName}${attrs}${styleAttr} />`;
    }

    return `<${this.tagName}${attrs}${styleAttr}>${innerHTML}</${this.tagName}>`;
  }
}

class ShadowRootMock {
  public host: HTMLElementMock;
  public options: ShadowRootInit;
  public childrenList: (HTMLElementMock | string | DocumentFragmentMock)[] = [];
  public adoptedStyleSheets: string[] = [];

  constructor(host: HTMLElementMock, options: ShadowRootInit) {
    this.host = host;
    this.options = options;
  }

  appendChild(node: any): any {
    this.childrenList.push(node);
    return node;
  }

  querySelector(selector: string): HTMLElementMock | null {
    return this.host.querySelector(selector);
  }

  serialize(): string {
    const mode = this.options.mode;
    const delegatesFocus = this.options.delegatesFocus ? ' shadowrootdelegatesfocus' : '';
    const styles = this.adoptedStyleSheets.map((s) => `<style>${escapeHtml(s)}</style>`).join('');
    const content = this.childrenList
      .map((child) => {
        if (typeof child === 'string') return escapeHtml(child);
        if (child instanceof DocumentFragmentMock) return child.serialize();
        return child.serialize();
      })
      .join('');

    return `<template shadowrootmode="${mode}"${delegatesFocus}>${styles}${content}</template>`;
  }
}

// ─── Ref ──────────────────────────────────────────────────────────────────────
export interface Ref<T extends HTMLElement = HTMLElement> {
  current: T | null;
}
export const createRef = <T extends HTMLElement = HTMLElement>(): Ref<T> => ({ current: null });

// ─── Core Builder ─────────────────────────────────────────────────────────────
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

// ─── Shadow Builder ───────────────────────────────────────────────────────────
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
      } catch {}
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
    return '';
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') return String(unsafe);
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeHtmlAttribute(unsafe: string): string {
  return escapeHtml(unsafe);
}

// ─── Factory Shortcuts ────────────────────────────────────────────────────────
export const View = <T extends HTMLElement = HTMLElement>(tag: string): ElementBuilder<T> => new ElementBuilder<T>(tag);
export const Div = (): ElementBuilder<HTMLDivElement> => View<HTMLDivElement>('div');
export const Span = (): ElementBuilder<HTMLSpanElement> => View<HTMLSpanElement>('span');
export const Slot = (): ElementBuilder<HTMLSlotElement> => View<HTMLSlotElement>('slot');
export const ButtonBuilder = (): ElementBuilder<HTMLButtonElement> => View<HTMLButtonElement>('button');
export const InputBuilder = (): ElementBuilder<HTMLInputElement> => View<HTMLInputElement>('input');
export const Style = (): ElementBuilder<HTMLStyleElement> => View<HTMLStyleElement>('style');
export const Label = (): ElementBuilder<HTMLLabelElement> => View<HTMLLabelElement>('label');
export const Ul = (): ElementBuilder<HTMLUListElement> => View<HTMLUListElement>('ul');
export const Li = (): ElementBuilder<HTMLLIElement> => View<HTMLLIElement>('li');
export const Section = (): ElementBuilder<HTMLElement> => View<HTMLElement>('section');
export const Article = (): ElementBuilder<HTMLElement> => View<HTMLElement>('article');
export const Nav = (): ElementBuilder<HTMLElement> => View<HTMLElement>('nav');
export const Header = (): ElementBuilder<HTMLElement> => View<HTMLElement>('header');
export const Footer = (): ElementBuilder<HTMLElement> => View<HTMLElement>('footer');
export const Main = (): ElementBuilder<HTMLElement> => View<HTMLElement>('main');

export const DeclarativeShadow = (
  mode: 'open' | 'closed' = 'open',
  delegatesFocus = false,
): ElementBuilder<HTMLTemplateElement> => {
  const tpl = View<HTMLTemplateElement>('template');
  tpl.attr('shadowrootmode', mode);
  if (delegatesFocus) tpl.attr('shadowrootdelegatesfocus', '');
  return tpl;
};
