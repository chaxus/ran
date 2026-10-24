import contentCss from './index.less?inline';
import { Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { defineSSR } from '@/utils/ssr-registry';
import { ensureShadowRoot } from '@/utils/component';

export class Content extends RanElement {
  observer: MutationObserver;
  _shadowDom: ShadowRoot;
  _slot: HTMLElement;
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, contentCss);
    const slot = Slot().class('slot').build() as HTMLElement;
    this._shadowDom.appendChild(slot);
    this._slot = slot;
    this.observer = new MutationObserver(this.callback);
  }
  /**
   * One `change` per observer batch, not per record: the popover rebuilds its panel on each
   * event, so inserting K nodes in one task used to rebuild it K times. `type` is
   * `childList` when any record in the batch was one; `mutations` carries them all.
   */
  callback = (mutations: MutationRecord[]): void => {
    const relevant = mutations.filter((m) => m.type === 'childList' || m.type === 'attributes');
    if (!relevant.length) return;
    const mutation = relevant[relevant.length - 1];
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          type: relevant.some((m) => m.type === 'childList') ? 'childList' : 'attributes',
          value: { content: this.children, mutation, mutations: relevant },
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
