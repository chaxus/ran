import { create } from 'ranuts/utils';
import less from './index.less?inline';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

export class Content extends (HTMLElementSSR()!) {
  observer: MutationObserver;
  _shadowDom: ShadowRoot;
  _slot: HTMLSlotElement;
  constructor() {
    super();
    this._slot = create('slot').setAttribute('class', 'slot').element;
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowDom = shadowRoot;
    const style = create('style').setTextContent(less);
    shadowRoot.appendChild(style.element);
    shadowRoot.appendChild(this._slot);
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
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
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
  disconnectCallback(): void {
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
