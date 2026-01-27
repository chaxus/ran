import { HTMLElementSSR, createCustomError } from '@/utils/index';

/**
 * Popover Content Component
 *
 * @element r-content
 *
 * @fires change - Fired when content changes
 */
export class Content extends (HTMLElementSSR()!) {
  private _observer!: MutationObserver;
  private _shadowRoot!: ShadowRoot;
  private _slot!: HTMLSlotElement;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
    this._observer = new MutationObserver(this.handleMutation);
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._slot = document.createElement('slot');
    this._slot.setAttribute('class', 'slot');

    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(this._slot);
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this._observer.observe(this, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  }

  disconnectedCallback(): void {
    this._observer.disconnect();
  }

  // ========== Methods ==========

  private handleMutation = (mutations: MutationRecord[]): void => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        this.dispatchChangeEvent(mutation);
      }
    }
  };

  private dispatchChangeEvent(mutation: MutationRecord): void {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          type: mutation.type,
          value: {
            content: this.children,
            mutation,
          },
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-content')) {
    customElements.define('r-content', Content);
    return Content;
  } else {
    return createCustomError('document is undefined or r-content already exists');
  }
}

export default Custom();
