import { str2Xml } from 'ranuts/utils';
import type { IconLoadEventDetail } from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

const X_LINKS_NS = 'http://www.w3.org/1999/xlink';
const X_LINK_HREF = 'xlink:href';

/**
 * Modern Icon Component
 *
 * @element r-icon
 *
 * @fires icon-load - Fired when icon successfully loads
 * @fires icon-error - Fired when icon fails to load
 *
 * @csspart base - The icon container
 * @csspart svg - The SVG element
 *
 * @cssprop --icon-size - Icon size
 * @cssprop --icon-color - Icon color
 * @cssprop --icon-spin-duration - Spin animation duration
 */
export class Icon extends (HTMLElementSSR()!) {
  private _container!: HTMLDivElement;
  private _svg?: SVGElement;
  private _shadowRoot!: ShadowRoot;
  private _loadingPromise?: Promise<void>;

  static get observedAttributes(): string[] {
    return ['name', 'size', 'color', 'spin', 'aria-label', 'aria-hidden'];
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get name(): string | null {
    return this.getAttribute('name');
  }
  set name(value: string | null) {
    if (value) {
      this.setAttribute('name', value);
    } else {
      this.removeAttribute('name');
    }
  }

  get size(): string | number | null {
    return this.getAttribute('size');
  }
  set size(value: string | number | null) {
    if (value != null) {
      this.setAttribute('size', String(value));
    } else {
      this.removeAttribute('size');
    }
  }

  get color(): string | null {
    return this.getAttribute('color');
  }
  set color(value: string | null) {
    if (value) {
      this.setAttribute('color', value);
    } else {
      this.removeAttribute('color');
    }
  }

  get spin(): string | number | null {
    return this.getAttribute('spin');
  }
  set spin(value: string | number | null) {
    if (value != null) {
      this.setAttribute('spin', String(value));
    } else {
      this.removeAttribute('spin');
    }
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._shadowRoot.innerHTML = `
      <div part="base" class="icon-container"></div>
    `;

    this._shadowRoot.prepend(style);
    this._container = this._shadowRoot.querySelector('.icon-container')!;
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.updateAriaAttributes();
    this.loadIcon();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'name':
        this.loadIcon();
        break;

      case 'size':
        this.updateSize();
        break;

      case 'color':
        this.updateColor();
        break;

      case 'spin':
        this.updateSpin();
        break;

      case 'aria-label':
      case 'aria-hidden':
        this.updateAriaAttributes();
        break;
    }
  }

  // ========== Methods ==========

  private updateAriaAttributes(): void {
    const ariaHidden = this.getAttribute('aria-hidden');
    const ariaLabel = this.getAttribute('aria-label');

    // If no aria-label and not explicitly hidden, warn about accessibility
    if (!ariaLabel && ariaHidden !== 'true' && this.name) {
      console.warn(
        `[r-icon] Icon "${this.name}" should have aria-label for accessibility or aria-hidden="true" if decorative`
      );
    }
  }

  private async loadIcon(): Promise<void> {
    if (!this.name) return;

    // Prevent concurrent loads of the same icon
    if (this._loadingPromise) {
      return this._loadingPromise;
    }

    this._loadingPromise = this.loadLocal()
      .then(() => {
        this.dispatchEvent(
          new CustomEvent<IconLoadEventDetail>('icon-load', {
            detail: { name: this.name!, success: true },
            bubbles: true,
            composed: true,
          })
        );
      })
      .catch((error) => {
        console.warn(`[r-icon] Failed to load icon "${this.name}":`, error);
        this.loadFallback();

        this.dispatchEvent(
          new CustomEvent<IconLoadEventDetail>('icon-error', {
            detail: { name: this.name!, success: false, error },
            bubbles: true,
            composed: true,
          })
        );
      })
      .finally(() => {
        this._loadingPromise = undefined;
      });

    return this._loadingPromise;
  }

  private async loadLocal(): Promise<void> {
    if (!this.name) return;

    // Vite dynamic import limitations: https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
    const result = await import(`../../assets/icons/${this.name}.svg`);

    if (result?.default?._identification) {
      const { data } = result.default;
      const svg = str2Xml<SVGElement>(data, 'image/svg+xml');
      if (svg) {
        this.setSVG(svg);
      } else {
        throw new Error(`Failed to parse SVG for icon "${this.name}"`);
      }
    } else {
      throw new Error(`Icon "${this.name}" not found or invalid format`);
    }
  }

  private loadFallback(): void {
    // Fallback to iconfont sprite sheet
    // https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.dc64b3430&cid=9402
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('viewBox', '0 0 1024 1024');
    svg.setAttribute('part', 'svg');

    const use = document.createElementNS(X_LINKS_NS, 'use');
    use.setAttributeNS(X_LINKS_NS, X_LINK_HREF, `../../assets/iconfont/icon.svg#icon-${this.name}`);

    svg.appendChild(use);
    this.setSVG(svg);
  }

  private setSVG(svg: SVGElement | Element | null): void {
    if (!svg || !(svg instanceof SVGElement)) return;

    // Remove old SVG
    if (this._svg && this._container.contains(this._svg)) {
      this._container.removeChild(this._svg);
    }

    this._svg = svg as SVGElement;
    this._svg.setAttribute('part', 'svg');
    this._container.appendChild(this._svg);

    // Apply current attributes
    this.updateSize();
    this.updateColor();
    this.updateSpin();
  }

  private updateSize(): void {
    if (!this._svg) return;

    const size = this.size || '1em';
    this._svg.setAttribute('width', String(size));
    this._svg.setAttribute('height', String(size));
  }

  private updateColor(): void {
    if (!this._svg) return;

    const color = this.color || 'currentColor';
    this._svg.setAttribute('fill', color);
  }

  private updateSpin(): void {
    if (this.spin) {
      this.style.setProperty('--icon-spin-duration', `${this.spin}s`);
    } else {
      this.style.removeProperty('--icon-spin-duration');
    }
  }

  // ========== Public Methods ==========

  /**
   * Load icon programmatically
   * @param source - Icon name or external URL (future enhancement)
   */
  async load(source?: string): Promise<void> {
    if (source) {
      this.name = source;
    }
    return this.loadIcon();
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-icon')) {
    customElements.define('r-icon', Icon);
    return Icon;
  } else {
    return createCustomError('document is undefined or r-icon already exists');
  }
}

export default Custom();
