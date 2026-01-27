import type { SkeletonAnimation, SkeletonLoadEventDetail, SkeletonVariant } from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

/**
 * Modern Skeleton Component
 *
 * @element r-skeleton
 *
 * @slot - Default content shown when not loading
 *
 * @fires skeleton-load - Fired when loading state changes
 *
 * @csspart container - The skeleton container
 * @csspart skeleton - The skeleton element
 *
 * @cssprop --skeleton-bg - Skeleton background color
 * @cssprop --skeleton-shimmer - Skeleton shimmer color
 * @cssprop --skeleton-radius - Skeleton border radius
 * @cssprop --skeleton-height - Skeleton height
 * @cssprop --skeleton-width - Skeleton width
 */
export class Skeleton extends (HTMLElementSSR()!) {
  private _container!: HTMLDivElement;
  private _skeleton!: HTMLDivElement;
  private _slot!: HTMLSlotElement;
  private _shadowRoot!: ShadowRoot;

  static get observedAttributes(): string[] {
    return [
      'loading',
      'variant',
      'animation',
      'width',
      'height',
      'count',
      'aria-label',
      'aria-busy',
    ];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get loading(): boolean {
    return this.hasAttribute('loading');
  }
  set loading(value: boolean) {
    if (value) {
      this.setAttribute('loading', '');
    } else {
      this.removeAttribute('loading');
    }
  }

  get variant(): SkeletonVariant {
    return (this.getAttribute('variant') as SkeletonVariant) || 'text';
  }
  set variant(value: SkeletonVariant) {
    this.setAttribute('variant', value);
  }

  get animation(): SkeletonAnimation {
    return (this.getAttribute('animation') as SkeletonAnimation) || 'pulse';
  }
  set animation(value: SkeletonAnimation) {
    this.setAttribute('animation', value);
  }

  get width(): string {
    return this.getAttribute('width') || '100%';
  }
  set width(value: string) {
    this.setAttribute('width', value);
  }

  get height(): string {
    return this.getAttribute('height') || '';
  }
  set height(value: string) {
    if (value) {
      this.setAttribute('height', value);
    } else {
      this.removeAttribute('height');
    }
  }

  get count(): number {
    const count = parseInt(this.getAttribute('count') || '1', 10);
    return count > 0 ? count : 1;
  }
  set count(value: number) {
    this.setAttribute('count', String(value));
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._shadowRoot.innerHTML = `
      <div part="container" class="skeleton-container">
        <div part="skeleton" class="skeleton"></div>
        <slot></slot>
      </div>
    `;

    this._shadowRoot.prepend(style);
    this._container = this._shadowRoot.querySelector('.skeleton-container')!;
    this._skeleton = this._shadowRoot.querySelector('.skeleton')!;
    this._slot = this._shadowRoot.querySelector('slot')!;
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.updateSkeleton();
    this.updateAriaAttributes();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'loading':
        this.updateSkeleton();
        this.updateAriaAttributes();
        this.handleLoadingChange();
        break;

      case 'variant':
      case 'animation':
        this.updateClasses();
        break;

      case 'width':
      case 'height':
        this.updateDimensions();
        break;

      case 'count':
        this.updateSkeleton();
        break;

      case 'aria-label':
      case 'aria-busy':
        this.updateAriaAttributes();
        break;
    }
  }

  // ========== Methods ==========

  private updateSkeleton(): void {
    if (!this._skeleton) return;

    this._skeleton.innerHTML = '';

    if (this.loading) {
      for (let i = 0; i < this.count; i++) {
        const skeletonItem = document.createElement('div');
        skeletonItem.className = 'skeleton-item';
        this._skeleton.appendChild(skeletonItem);
      }
    }

    this.updateClasses();
    this.updateDimensions();
  }

  private updateClasses(): void {
    if (!this._container) return;

    const classes = [
      'skeleton-container',
      this.loading && 'skeleton-loading',
      this.loading && `skeleton-${this.variant}`,
      this.loading && `skeleton-animation-${this.animation}`,
    ].filter(Boolean);

    this._container.className = classes.join(' ');
  }

  private updateDimensions(): void {
    if (!this._skeleton) return;

    this._skeleton.style.width = this.width;
    if (this.height) {
      this._skeleton.style.height = this.height;
    } else {
      this._skeleton.style.removeProperty('height');
    }
  }

  private updateAriaAttributes(): void {
    if (!this._container) return;

    const ariaLabel = this.getAttribute('aria-label') || 'Loading content';
    this._container.setAttribute('aria-label', ariaLabel);
    this._container.setAttribute('aria-busy', String(this.loading));

    if (this.loading) {
      this._container.setAttribute('role', 'status');
    } else {
      this._container.removeAttribute('role');
    }
  }

  private handleLoadingChange(): void {
    this.dispatchEvent(
      new CustomEvent<SkeletonLoadEventDetail>('skeleton-load', {
        detail: { loading: this.loading },
        bubbles: true,
        composed: true,
      })
    );
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-skeleton')) {
    customElements.define('r-skeleton', Skeleton);
    return Skeleton;
  } else {
    return createCustomError('document is undefined or r-skeleton already exists');
  }
}

export default Custom();
