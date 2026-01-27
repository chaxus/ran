import type { LoadingChangeEventDetail, LoadingColor, LoadingSize, LoadingType } from './types';
import { LOADING_CONFIGS, type LoadingElement } from './loading-configs';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

/**
 * Modern Loading Component
 *
 * @element r-loading
 *
 * @fires loading-change - Fired when loading type changes
 *
 * @csspart container - The loading container
 * @csspart loading - The loading animation element
 *
 * @cssprop --loading-size - Loading size
 * @cssprop --loading-color - Loading color
 */
export class Loading extends (HTMLElementSSR()!) {
  private _container!: HTMLDivElement;
  private _shadowRoot!: ShadowRoot;

  static get observedAttributes(): string[] {
    return ['type', 'size', 'color', 'aria-label'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get type(): LoadingType {
    return (this.getAttribute('type') as LoadingType) || 'circle';
  }
  set type(value: LoadingType) {
    this.setAttribute('type', value);
  }

  get size(): LoadingSize {
    return (this.getAttribute('size') as LoadingSize) || 'md';
  }
  set size(value: LoadingSize) {
    this.setAttribute('size', value);
  }

  get color(): LoadingColor {
    return this.getAttribute('color') || '';
  }
  set color(value: LoadingColor) {
    if (value) {
      this.setAttribute('color', value);
    } else {
      this.removeAttribute('color');
    }
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._shadowRoot.innerHTML = `
      <div part="container" class="loading-container" role="status" aria-live="polite">
        <div part="loading" class="loading"></div>
      </div>
    `;

    this._shadowRoot.prepend(style);
    this._container = this._shadowRoot.querySelector('.loading-container')!;
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.createLoading();
    this.updateClasses();
    this.updateColor();
    this.updateAriaAttributes();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'type':
        this.createLoading();
        this.handleTypeChange();
        break;

      case 'size':
        this.updateClasses();
        break;

      case 'color':
        this.updateColor();
        break;

      case 'aria-label':
        this.updateAriaAttributes();
        break;
    }
  }

  // ========== Methods ==========

  private updateClasses(): void {
    if (!this._container) return;

    const classes = [
      'loading-container',
      `loading-${this.size}`,
    ].filter(Boolean);

    this._container.className = classes.join(' ');
  }

  private updateColor(): void {
    if (!this._container) return;

    if (this.color) {
      this._container.style.setProperty('--loading-color', this.color);
    } else {
      this._container.style.removeProperty('--loading-color');
    }
  }

  private updateAriaAttributes(): void {
    if (!this._container) return;

    const ariaLabel = this.getAttribute('aria-label') || 'Loading';
    this._container.setAttribute('aria-label', ariaLabel);
  }

  private handleTypeChange(): void {
    this.dispatchEvent(
      new CustomEvent<LoadingChangeEventDetail>('loading-change', {
        detail: { type: this.type },
        bubbles: true,
        composed: true,
      })
    );
  }

  // ========== Loading Creation Methods ==========

  /**
   * @description: Creates DOM element from configuration
   * @param {LoadingElement} config - Element configuration
   * @return {HTMLElement} Created element
   */
  private createElementFromConfig(config: LoadingElement): HTMLElement {
    const element = document.createElement(config.tag);

    if (config.class) {
      element.setAttribute('class', config.class);
    }

    if (config.text) {
      element.textContent = config.text;
    }

    if (config.children) {
      config.children.forEach(child => {
        element.appendChild(this.createElementFromConfig(child));
      });
    }

    return element;
  }

  /**
   * @description: Creates loading animation based on current type
   */
  private createLoading = (): void => {
    if (!this._container) return;

    this._container.innerHTML = '';

    const config = LOADING_CONFIGS[this.type];
    if (!config) return;

    const loading = document.createElement('div');
    loading.setAttribute('class', config.class);
    loading.setAttribute('part', config.part);

    config.elements.forEach(elementConfig => {
      loading.appendChild(this.createElementFromConfig(elementConfig));
    });

    this._container.appendChild(loading);
  };
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-loading')) {
    customElements.define('r-loading', Loading);
    return Loading;
  } else {
    return createCustomError('document is undefined or r-loading already exists');
  }
}

export default Custom();
