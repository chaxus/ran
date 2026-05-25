import contentCss from './index.less?inline';
import { Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { defineSSR } from '@/utils/ssr-registry';
import { ensureShadowElement, ensureShadowRoot } from '@/utils/component';

export class Content extends RanElement {
  observer: MutationObserver;
  _shadowDom: ShadowRoot;
  _slot: HTMLElement;
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, contentCss);
    const slot = ensureShadowElement(this._shadowDom, '.slot', () => Slot().class('slot').build() as HTMLElement);
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

defineSSR('r-content', Content as unknown as new () => HTMLElement);
export default Content;
