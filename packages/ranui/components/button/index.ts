import { currentDevice } from 'ranuts/utils';
import type { ButtonColor, ButtonRadius, ButtonSize, ButtonVariant, IconPosition } from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

/**
 * Modern Button Component with Variants System
 *
 * @element r-button
 *
 * @slot - Default slot for button content
 * @slot icon-start - Slot for start icon
 * @slot icon-end - Slot for end icon
 * @slot loading - Slot for custom loading indicator
 *
 * @fires button-click - Fired when button is clicked
 * @fires loading-change - Fired when loading state changes
 * @fires disabled-change - Fired when disabled state changes
 *
 * @csspart base - The button element
 * @csspart loading-container - The loading indicator container
 * @csspart icon-start - The start icon container
 * @csspart content - The content container
 * @csspart icon-end - The end icon container
 *
 * @cssprop --btn-bg - Button background color
 * @cssprop --btn-color - Button text color
 * @cssprop --btn-border - Button border color
 * @cssprop --btn-hover-bg - Button hover background color
 * @cssprop --btn-radius - Button border radius
 * @cssprop --btn-padding-x - Button horizontal padding
 * @cssprop --btn-padding-y - Button vertical padding
 */
export class Button extends (HTMLElementSSR()!) {
  private _button!: HTMLButtonElement;
  private _loadingContainer!: HTMLElement;
  private _iconStartContainer!: HTMLElement;
  private _contentContainer!: HTMLElement;
  private _iconEndContainer!: HTMLElement;
  private _shadowRoot!: ShadowRoot;
  private _resizeObserver?: ResizeObserver;
  private _internals?: ElementInternals;

  static formAssociated = true;

  static get observedAttributes(): string[] {
    return [
      'variant',
      'color',
      'size',
      'radius',
      'disabled',
      'loading',
      'icon',
      'icon-position',
      'icon-size',
      'full-width',
      'effect',
      'aria-label',
    ];
  }

  constructor() {
    super();

    // Attach internals for form participation
    if ('attachInternals' in this) {
      this._internals = this.attachInternals();
    }

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get variant(): ButtonVariant {
    return (this.getAttribute('variant') as ButtonVariant) || 'solid';
  }
  set variant(value: ButtonVariant) {
    this.setAttribute('variant', value);
  }

  get color(): ButtonColor {
    return (this.getAttribute('color') as ButtonColor) || 'primary';
  }
  set color(value: ButtonColor) {
    this.setAttribute('color', value);
  }

  get size(): ButtonSize {
    return (this.getAttribute('size') as ButtonSize) || 'md';
  }
  set size(value: ButtonSize) {
    this.setAttribute('size', value);
  }

  get radius(): ButtonRadius {
    return (this.getAttribute('radius') as ButtonRadius) || 'base';
  }
  set radius(value: ButtonRadius) {
    this.setAttribute('radius', value);
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

  get loading(): boolean {
    return this.hasAttribute('loading');
  }
  set loading(value: boolean) {
    const oldValue = this.loading;
    if (value) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }

    if (oldValue !== value) {
      this.dispatchEvent(
        new CustomEvent('loading-change', {
          detail: { loading: value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  get icon(): string {
    return this.getAttribute('icon') || '';
  }
  set icon(value: string) {
    if (value) {
      this.setAttribute('icon', value);
    } else {
      this.removeAttribute('icon');
    }
  }

  get iconPosition(): IconPosition {
    return (this.getAttribute('icon-position') as IconPosition) || 'start';
  }
  set iconPosition(value: IconPosition) {
    this.setAttribute('icon-position', value);
  }

  get iconSize(): string {
    return this.getAttribute('icon-size') || '';
  }
  set iconSize(value: string) {
    if (value) {
      this.setAttribute('icon-size', value);
    } else {
      this.removeAttribute('icon-size');
    }
  }

  get fullWidth(): boolean {
    return this.hasAttribute('full-width');
  }
  set fullWidth(value: boolean) {
    if (value) {
      this.setAttribute('full-width', '');
    } else {
      this.removeAttribute('full-width');
    }
  }

  get effect(): boolean {
    return this.getAttribute('effect') !== 'false';
  }
  set effect(value: boolean) {
    this.setAttribute('effect', String(value));
  }

  get form(): HTMLFormElement | null {
    return this._internals?.form || null;
  }

  get elementInternals(): ElementInternals | undefined {
    return this._internals;
  }

  // ========== Render ==========

  private render(): void {
    // Import styles
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._shadowRoot.innerHTML = `
      <button
        part="base"
        class="btn"
        type="button"
      >
        <span part="loading-container" class="loading-container" hidden>
          <slot name="loading">
            <svg class="spinner" viewBox="0 0 50 50">
              <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
          </slot>
        </span>
        <span part="icon-start" class="icon-container icon-start">
          <slot name="icon-start"></slot>
        </span>
        <span part="content" class="content">
          <slot></slot>
        </span>
        <span part="icon-end" class="icon-container icon-end">
          <slot name="icon-end"></slot>
        </span>
      </button>
    `;

    this._shadowRoot.prepend(style);
    this._button = this._shadowRoot.querySelector('button')!;
    this._loadingContainer = this._shadowRoot.querySelector('.loading-container')!;
    this._iconStartContainer = this._shadowRoot.querySelector('.icon-start')!;
    this._contentContainer = this._shadowRoot.querySelector('.content')!;
    this._iconEndContainer = this._shadowRoot.querySelector('.icon-end')!;
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.updateClasses();
    this.setupEventListeners();
    this.setupIcon();
    this.updateAriaLabel();
    this.updateLoadingState();

    // Set ARIA attributes
    this.setAttribute('role', 'button');
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  disconnectedCallback(): void {
    this.removeEventListeners();
    this._resizeObserver?.disconnect();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'variant':
      case 'color':
      case 'size':
      case 'radius':
      case 'full-width':
        this.updateClasses();
        break;

      case 'disabled':
        this.updateDisabledState();
        break;

      case 'loading':
        this.updateLoadingState();
        break;

      case 'icon':
      case 'icon-position':
      case 'icon-size':
        this.setupIcon();
        break;

      case 'aria-label':
        this.updateAriaLabel();
        break;
    }
  }

  // ========== Methods ==========

  private updateClasses(): void {
    if (!this._button) return;

    const classes = [
      'btn',
      `btn-${this.variant}`,
      `btn-${this.color}`,
      `btn-${this.size}`,
      `btn-radius-${this.radius}`,
      this.fullWidth && 'btn-full',
      this.disabled && 'btn-disabled',
      this.loading && 'btn-loading',
    ].filter(Boolean);

    this._button.className = classes.join(' ');
  }

  private updateDisabledState(): void {
    if (!this._button) return;

    const isDisabled = this.disabled || this.loading;
    this._button.disabled = isDisabled;
    this._button.setAttribute('aria-disabled', String(isDisabled));

    // Update internals
    if (this._internals) {
      this._internals.setFormValue(isDisabled ? null : 'submitted');
    }

    this.updateClasses();

    this.dispatchEvent(
      new CustomEvent('disabled-change', {
        detail: { disabled: this.disabled },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private updateLoadingState(): void {
    if (!this._loadingContainer || !this._contentContainer) return;

    const isLoading = this.loading;
    this._loadingContainer.hidden = !isLoading;
    this._contentContainer.style.visibility = isLoading ? 'hidden' : 'visible';

    // Disable button when loading
    this.updateDisabledState();
  }

  private setupIcon(): void {
    if (!this.icon) return;

    const position = this.iconPosition;
    const container = position === 'start' ? this._iconStartContainer : this._iconEndContainer;
    const otherContainer = position === 'start' ? this._iconEndContainer : this._iconStartContainer;

    // Clear other container
    while (otherContainer.firstChild) {
      otherContainer.removeChild(otherContainer.firstChild);
    }

    // Create or update icon
    let iconElement = container.querySelector('r-icon') as HTMLElement | null;
    if (!iconElement) {
      iconElement = document.createElement('r-icon');
      iconElement.setAttribute('color', 'currentColor');
      container.appendChild(iconElement);
    }

    iconElement.setAttribute('name', this.icon);

    if (this.iconSize) {
      iconElement.setAttribute('size', this.iconSize);
    } else {
      this.autoSizeIcon(iconElement);
    }
  }

  private autoSizeIcon(iconElement: HTMLElement): void {
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { height } = entry.contentRect;
          if (height > 0) {
            const size = Math.max(height - 8, 12);
            iconElement.setAttribute('size', String(size));
          }
        }
      });
    }

    this._resizeObserver.observe(this._button);
  }

  private updateAriaLabel(): void {
    const defaultSlot = this._contentContainer?.querySelector('slot');
    if (!defaultSlot) return;

    const hasText = defaultSlot.assignedNodes().some((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.trim();
      }
      return node.nodeType === Node.ELEMENT_NODE;
    });

    // Warn if icon-only button without aria-label
    if (this.icon && !hasText && !this.getAttribute('aria-label')) {
      console.warn('[r-button] Icon-only button should have aria-label attribute for accessibility');
    }
  }

  // ========== Event Handlers ==========

  private setupEventListeners(): void {
    this.addEventListener('keydown', this.handleKeyDown);
    this.addEventListener('click', this.handleClick);

    if (this.effect && currentDevice() === 'pc') {
      this._button.addEventListener('mousedown', this.handleMouseDown);
      this._button.addEventListener('mouseup', this.handleMouseUp);
    }

    // Listen to slot changes
    const slots = this._shadowRoot.querySelectorAll('slot');
    slots.forEach((slot) => {
      slot.addEventListener('slotchange', () => this.updateAriaLabel());
    });
  }

  private removeEventListeners(): void {
    this.removeEventListener('keydown', this.handleKeyDown);
    this.removeEventListener('click', this.handleClick);
    this._button?.removeEventListener('mousedown', this.handleMouseDown);
    this._button?.removeEventListener('mouseup', this.handleMouseUp);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled || this.loading) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  };

  private handleClick = (event: MouseEvent): void => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('button-click', {
        detail: {
          disabled: this.disabled,
          loading: this.loading,
        },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleMouseDown = (event: MouseEvent): void => {
    const { left, top } = this._button.getBoundingClientRect();
    this._button.style.setProperty('--ripple-x', `${event.clientX - left}px`);
    this._button.style.setProperty('--ripple-y', `${event.clientY - top}px`);
  };

  private handleMouseUp = (): void => {
    setTimeout(() => {
      this._button.style.removeProperty('--ripple-x');
      this._button.style.removeProperty('--ripple-y');
    }, 600);
  };

  // ========== Public Methods ==========

  /**
   * Focus the button
   */
  focus(options?: FocusOptions): void {
    this._button?.focus(options);
  }

  /**
   * Blur the button
   */
  blur(): void {
    this._button?.blur();
  }

  /**
   * Click the button programmatically
   */
  click(): void {
    if (!this.disabled && !this.loading) {
      this._button?.click();
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-button')) {
    customElements.define('r-button', Button);
    return Button;
  } else {
    return createCustomError('document is undefined or r-button is exist');
  }
}

export default Custom();
