import { escapeHtml, escapeHtmlAttribute } from './escape';
import type { MockNode } from './selectors';
import { collectMatches } from './selectors';

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

  querySelector(selector: string): HTMLElementMock | null {
    const list = this.querySelectorAll(selector);
    return list.length > 0 ? list[0] : null;
  }

  querySelectorAll(selector: string): HTMLElementMock[] {
    const result: HTMLElementMock[] = [];
    collectMatches(this.childrenList as MockNode[], selector, result);
    return result;
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
  public content?: DocumentFragmentMock;
  private eventListeners: Map<string, Set<EventListenerOrEventListenerObject>> = new Map();

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
    const result = this.querySelectorAll(selector);
    return result.length > 0 ? result[0] : null;
  }

  querySelectorAll(selector: string): HTMLElementMock[] {
    const result: HTMLElementMock[] = [];
    collectMatches(this.childrenList as MockNode[], selector, result);
    return result;
  }

  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    const bucket = this.eventListeners.get(type) || new Set<EventListenerOrEventListenerObject>();
    bucket.add(listener);
    this.eventListeners.set(type, bucket);
  }

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    const bucket = this.eventListeners.get(type);
    if (!bucket) return;
    bucket.delete(listener);
    if (bucket.size === 0) {
      this.eventListeners.delete(type);
    }
  }

  dispatchEvent(event: Event): boolean {
    const listeners = this.eventListeners.get(event.type);
    if (!listeners || listeners.size === 0) return true;
    for (const listener of listeners) {
      if (typeof listener === 'function') {
        listener.call(this, event);
      } else {
        listener.handleEvent(event);
      }
    }
    return !event.defaultPrevented;
  }

  serialize(tagNameOverride?: string): string {
    const tagName = tagNameOverride || this.tagName;
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
      innerHTML += this._innerHTML;
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
    if (selfClosing.includes(tagName) && !innerHTML) {
      return `<${tagName}${attrs}${styleAttr} />`;
    }

    return `<${tagName}${attrs}${styleAttr}>${innerHTML}</${tagName}>`;
  }
}

export class ShadowRootMock {
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

  querySelectorAll(selector: string): HTMLElementMock[] {
    return this.host.querySelectorAll(selector);
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
