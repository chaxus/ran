import contentCss from './index.less?inline';
import { Slot } from '@/utils/builder';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import { adoptStyles } from '@/utils/style';

export class Content extends (HTMLElementSSR()!) {
  observer: MutationObserver;
  _shadowDom: ShadowRoot;
  _slot: HTMLElement;
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowDom = shadowRoot;
    adoptStyles(this._shadowDom, contentCss);

    let slot = this._shadowDom.querySelector('.slot') as HTMLElement | null;
    if (!slot) {
      slot = Slot().class('slot').build() as HTMLElement;
      this._shadowDom.appendChild(slot);
    }
    this._slot = slot;
    this.observer = new MutationObserver(this.callback);
  }
  callback = (mutations: MutationRecord[]): void => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        // A child node has been added or removed.
        this.onChange(mutation);
      } else if (mutation.type === 'attributes') {
        // "The " + mutation.attributeName + " attribute was modified."
        this.onChange(mutation);
      }
    }
  };
  onChange = (mutation: MutationRecord): void => {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          type: mutation.type,
          value: { content: this.children, mutation },
        },
      }),
    );
  };
  connectedCallback(): void {
    this.observer.observe(this, { attributes: true, childList: true, subtree: true });
  }
  disconnectedCallback(): void {
    this.observer.disconnect();
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-content')) {
    customElements.define('r-content', Content);
    return Content;
  } else {
    return createCustomError('document is undefined or r-content is exist');
  }
}

export default Custom();
