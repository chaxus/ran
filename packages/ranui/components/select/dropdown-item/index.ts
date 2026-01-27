import { HTMLElementSSR, createCustomError } from '@/utils/index';

/**
 * Modern Dropdown Item Component
 *
 * @element r-dropdown-item
 *
 * @slot - Item content
 *
 * @csspart item - The item container
 * @csspart content - The item content
 *
 * @cssprop --dropdown-item-padding - Item padding
 * @cssprop --dropdown-item-font-size - Item font size
 * @cssprop --dropdown-item-color - Item text color
 * @cssprop --dropdown-item-hover-bg - Hover background color
 * @cssprop --dropdown-item-active-bg - Active background color
 * @cssprop --dropdown-item-active-color - Active text color
 */
export class DropdownItem extends (HTMLElementSSR()!) {
  private _container!: HTMLDivElement;
  private _content!: HTMLDivElement;
  private _slot!: HTMLSlotElement;
  private _shadowRoot!: ShadowRoot;

  static get observedAttributes(): string[] {
    return ['active', 'value', 'title', 'disabled'];
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
    if (value) {
      this.setAttribute('value', value);
    } else {
      this.removeAttribute('value');
    }
  }

  get active(): boolean {
    return this.hasAttribute('active');
  }
  set active(value: boolean) {
    if (value) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
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
    this._content.className = 'ranui-dropdown-option-item-content';
    this._content.setAttribute('part', 'content');
    this._content.appendChild(this._slot);

    this._container = document.createElement('div');
    this._container.className = 'ranui-dropdown-option-item';
    this._container.setAttribute('part', 'item');
    this._container.setAttribute('role', 'option');
    this._container.setAttribute('tabindex', '-1');
    this._container.appendChild(this._content);

    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(this._container);
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.updateActiveState();
    this.updateDisabledState();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'active':
        this.updateActiveState();
        break;

      case 'disabled':
        this.updateDisabledState();
        break;

      case 'title':
        if (newValue) {
          this._container.setAttribute('title', newValue);
        } else {
          this._container.removeAttribute('title');
        }
        break;
    }
  }

  // ========== Methods ==========

  private updateActiveState(): void {
    if (this.active) {
      this._container.classList.add('ranui-dropdown-option-active');
      this._container.setAttribute('aria-selected', 'true');
    } else {
      this._container.classList.remove('ranui-dropdown-option-active');
      this._container.setAttribute('aria-selected', 'false');
    }
  }

  private updateDisabledState(): void {
    if (this.disabled) {
      this._container.setAttribute('aria-disabled', 'true');
      this._container.setAttribute('tabindex', '-1');
    } else {
      this._container.removeAttribute('aria-disabled');
      this._container.setAttribute('tabindex', '0');
    }
  }

  // ========== Public Methods ==========

  /**
   * Focus this item
   */
  public focus(): void {
    this._container.focus();
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-dropdown-item')) {
    customElements.define('r-dropdown-item', DropdownItem);
    return DropdownItem;
  } else {
    return createCustomError('document is undefined or r-dropdown-item already exists');
  }
}

export default Custom();
