import type { ArrowPosition, DropdownTransitEventDetail, DropdownVisibilityEventDetail, TransitType } from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

const ANIMATION_DURATION = 300;

/**
 * Modern Dropdown Component
 *
 * @element r-dropdown
 *
 * @fires dropdown-show - Fired when dropdown becomes visible
 * @fires dropdown-hide - Fired when dropdown becomes hidden
 * @fires dropdown-transit - Fired when transition animation starts
 *
 * @csspart container - The dropdown container
 * @csspart dropdown - The dropdown content wrapper
 * @csspart arrow - The dropdown arrow indicator
 *
 * @cssprop --dropdown-bg - Dropdown background color
 * @cssprop --dropdown-border-radius - Dropdown border radius
 * @cssprop --dropdown-box-shadow - Dropdown box shadow
 * @cssprop --dropdown-padding - Dropdown padding
 * @cssprop --dropdown-arrow-size - Arrow size
 */
export class Dropdown extends (HTMLElementSSR()!) {
  private _container!: HTMLDivElement;
  private _dropdown!: HTMLDivElement;
  private _slot!: HTMLSlotElement;
  private _arrow?: HTMLDivElement;
  private _shadowRoot!: ShadowRoot;
  private _transitTimer?: NodeJS.Timeout;

  static get observedAttributes(): string[] {
    return ['transit', 'arrow', 'visible'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get transit(): TransitType | '' {
    return (this.getAttribute('transit') as TransitType) || '';
  }
  set transit(value: TransitType | '') {
    if (value) {
      this.setAttribute('transit', value);
    } else {
      this.removeAttribute('transit');
    }
  }

  get arrow(): ArrowPosition | '' {
    return (this.getAttribute('arrow') as ArrowPosition) || '';
  }
  set arrow(value: ArrowPosition | '') {
    if (value) {
      this.setAttribute('arrow', value);
    } else {
      this.removeAttribute('arrow');
    }
  }

  get visible(): boolean {
    return this.hasAttribute('visible');
  }
  set visible(value: boolean) {
    if (value) {
      this.setAttribute('visible', '');
    } else {
      this.removeAttribute('visible');
    }
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._slot = document.createElement('slot');

    this._dropdown = document.createElement('div');
    this._dropdown.setAttribute('part', 'dropdown');
    this._dropdown.setAttribute('class', 'dropdown');
    this._dropdown.setAttribute('role', 'menu');
    this._dropdown.setAttribute('tabindex', '-1');
    this._dropdown.appendChild(this._slot);

    this._container = document.createElement('div');
    this._container.setAttribute('part', 'container');
    this._container.setAttribute('class', 'dropdown-container');
    this._container.appendChild(this._dropdown);

    this._shadowRoot.appendChild(style);
    this._shadowRoot.appendChild(this._container);
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.updateArrow();
    this.updateTransit();
    this.updateVisibility();
    this.setupKeyboardNavigation();
  }

  disconnectedCallback(): void {
    this.clearTransitTimer();
    this.removeKeyboardNavigation();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'transit':
        this.updateTransit();
        break;

      case 'arrow':
        this.updateArrow();
        break;

      case 'visible':
        this.updateVisibility();
        break;
    }
  }

  // ========== Methods ==========

  private updateArrow(): void {
    if (!this._container) return;

    // Remove existing arrow
    if (this._arrow) {
      this._arrow.remove();
      this._arrow = undefined;
    }

    // Add new arrow if needed
    if (this.arrow) {
      this._arrow = document.createElement('div');
      this._arrow.setAttribute('part', 'arrow');
      this._arrow.setAttribute('class', `dropdown-arrow dropdown-arrow-${this.arrow}`);
      this._container.appendChild(this._arrow);
    }
  }

  private updateTransit(): void {
    if (!this._dropdown || !this.transit) return;

    this.clearTransitTimer();

    // Add transit class
    this._dropdown.classList.add(this.transit);

    // Dispatch transit event
    this.dispatchEvent(
      new CustomEvent<DropdownTransitEventDetail>('dropdown-transit', {
        detail: { transit: this.transit },
        bubbles: true,
        composed: true,
      })
    );

    // Remove transit class after animation
    this._transitTimer = setTimeout(() => {
      this._dropdown?.classList.remove(this.transit);
      this.clearTransitTimer();
    }, ANIMATION_DURATION);
  }

  private updateVisibility(): void {
    if (!this._dropdown) return;

    if (this.visible) {
      this._dropdown.setAttribute('aria-hidden', 'false');
      this.dispatchEvent(
        new CustomEvent<DropdownVisibilityEventDetail>('dropdown-show', {
          detail: { visible: true },
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this._dropdown.setAttribute('aria-hidden', 'true');
      this.dispatchEvent(
        new CustomEvent<DropdownVisibilityEventDetail>('dropdown-hide', {
          detail: { visible: false },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private clearTransitTimer(): void {
    if (this._transitTimer) {
      clearTimeout(this._transitTimer);
      this._transitTimer = undefined;
    }
  }

  private setupKeyboardNavigation(): void {
    this._dropdown?.addEventListener('keydown', this.handleKeyDown);
  }

  private removeKeyboardNavigation(): void {
    this._dropdown?.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (event: Event): void => {
    const keyboardEvent = event as KeyboardEvent;
    const key = keyboardEvent.key;

    if (!this.visible) return;

    // Get all focusable elements
    const focusableElements = this._dropdown.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    const activeElement = this._shadowRoot.activeElement as HTMLElement;

    switch (key) {
      case 'Escape':
        keyboardEvent.preventDefault();
        this.visible = false;
        break;

      case 'Tab':
        if (keyboardEvent.shiftKey) {
          // Shift + Tab
          if (activeElement === firstElement) {
            keyboardEvent.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (activeElement === lastElement) {
            keyboardEvent.preventDefault();
            firstElement.focus();
          }
        }
        break;

      case 'ArrowDown':
        keyboardEvent.preventDefault();
        if (!activeElement || activeElement === lastElement) {
          firstElement.focus();
        } else {
          const currentIndex = Array.from(focusableElements).indexOf(activeElement);
          if (currentIndex >= 0 && currentIndex < focusableElements.length - 1) {
            (focusableElements[currentIndex + 1] as HTMLElement).focus();
          }
        }
        break;

      case 'ArrowUp':
        keyboardEvent.preventDefault();
        if (!activeElement || activeElement === firstElement) {
          lastElement.focus();
        } else {
          const currentIndex = Array.from(focusableElements).indexOf(activeElement);
          if (currentIndex > 0) {
            (focusableElements[currentIndex - 1] as HTMLElement).focus();
          }
        }
        break;
    }
  };

  // ========== Public Methods ==========

  /**
   * Shows the dropdown with optional transition
   */
  public show(transit?: TransitType): void {
    if (transit) {
      this.transit = transit;
    }
    this.visible = true;
  }

  /**
   * Hides the dropdown with optional transition
   */
  public hide(transit?: TransitType): void {
    if (transit) {
      this.transit = transit;
    }
    this.visible = false;
  }

  /**
   * Toggles the dropdown visibility
   */
  public toggle(transit?: TransitType): void {
    if (this.visible) {
      this.hide(transit);
    } else {
      this.show(transit);
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-dropdown')) {
    customElements.define('r-dropdown', Dropdown);
    return Dropdown;
  } else {
    return createCustomError('document is undefined or r-dropdown already exists');
  }
}

export default Custom();
