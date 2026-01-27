import { HTMLElementSSR, createCustomError } from '@/utils/index';

/**
 * Modern Option Component
 *
 * @element r-option
 *
 * @slot - Option content (label)
 *
 * @csspart option - The option container
 * @csspart content - The option content
 */
export class Option extends (HTMLElementSSR()!) {
  private _container!: HTMLDivElement;
  private _content!: HTMLDivElement;
  private _slot!: HTMLSlotElement;
  private _shadowRoot!: ShadowRoot;

  static get observedAttributes(): string[] {
    return ['disabled', 'value', 'label'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get value(): string {
    return this.getAttribute('value') || '';
  }
  set value(value: string) {
    this.setAttribute('value', value || '');
  }

  get label(): string {
    return this.getAttribute('label') || '';
  }
  set label(value: string) {
    this.setAttribute('label', value || '');
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }
  set disabled(value: boolean) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._slot = document.createElement('slot');

    this._content = document.createElement('div');
    this._content.className = 'ran-option-content';
    this._content.setAttribute('part', 'content');
    this._content.appendChild(this._slot);

    this._container = document.createElement('div');
    this._container.className = 'ran-option';
    this._container.setAttribute('part', 'option');
    this._container.appendChild(this._content);

    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(this._container);
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.updateDisabledState();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    if (name === 'disabled') {
      this.updateDisabledState();
    }
  }

  // ========== Methods ==========

  private updateDisabledState(): void {
    if (this.disabled) {
      this._container.setAttribute('disabled', '');
    } else {
      this._container.removeAttribute('disabled');
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-option')) {
    customElements.define('r-option', Option);
    return Option;
  } else {
    return createCustomError('document is undefined or r-option already exists');
  }
}

export default Custom();
