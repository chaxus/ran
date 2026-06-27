import linkCss from './index.less?inline';
import { EventManager } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowRoot,
  ensureShadowElement,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';
import { useRouter } from '@/utils/router';

export class Link extends RanElement {
  static get observedAttributes(): string[] {
    return ['href', 'replace', 'sheet'];
  }

  _events = new EventManager();
  _shadowDom: ShadowRoot;
  _anchor: HTMLAnchorElement;

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, linkCss);
    const anchor = ensureShadowElement(this._shadowDom, 'a', () => {
      const a = document.createElement('a');
      a.appendChild(document.createElement('slot'));
      return a;
    });
    this._anchor = anchor as HTMLAnchorElement;
  }

  get href(): string {
    return getStringAttribute(this, 'href');
  }
  set href(v: string) {
    setStringAttribute(this, 'href', v);
  }

  get replace(): boolean {
    return this.hasAttribute('replace');
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(v: string) {
    setStringAttribute(this, 'sheet', v);
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  _handleClick = (e: MouseEvent): void => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = this.href;
    if (!href || /^(https?:\/\/|\/\/|mailto:|tel:)/.test(href)) return;
    e.preventDefault();
    const core = useRouter();
    if (core) {
      if (this.replace) {
        core.replace(href);
      } else {
        core.push(href);
      }
      return;
    }
    this.dispatchEvent(
      new CustomEvent('ran-navigate', {
        detail: { path: href, replace: this.replace },
        bubbles: true,
        composed: true,
      }),
    );
  };

  _syncHref(): void {
    if (this._anchor) this._anchor.href = this.href;
  }

  connectedCallback(): void {
    this.handlerExternalCss();
    this._syncHref();
    this._events.on(this._anchor, 'click', this._handleClick as EventListener);
  }

  disconnectedCallback(): void {
    this._events.abort();
  }

  attributeChangedCallback(name: string, old: string, next: string): void {
    if (old === next) return;
    if (name === 'href') this._syncHref();
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-link', Link as unknown as new () => HTMLElement);
export default Link;
