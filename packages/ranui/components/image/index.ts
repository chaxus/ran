import type { ImageErrorEventDetail, ImageFit, ImageLoadEventDetail, ImageLoadingStrategy } from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import failImage from '../../assets/image/failImage';

/**
 * Modern Image Component
 *
 * @element r-img
 *
 * @fires image-load - Fired when image successfully loads
 * @fires image-error - Fired when image fails to load
 *
 * @csspart container - The image container
 * @csspart image - The image element
 * @csspart placeholder - The loading placeholder
 * @csspart error - The error placeholder
 *
 * @cssprop --image-width - Image width
 * @cssprop --image-height - Image height
 * @cssprop --image-radius - Image border radius
 * @cssprop --image-object-fit - Image object-fit property
 */
export class ImageComponent extends (HTMLElementSSR()!) {
  private _container!: HTMLDivElement;
  private _image?: HTMLImageElement;
  private _placeholder?: HTMLDivElement;
  private _errorContainer?: HTMLDivElement;
  private _shadowRoot!: ShadowRoot;
  private _loadState: 'idle' | 'loading' | 'loaded' | 'error' = 'idle';

  static get observedAttributes(): string[] {
    return [
      'src',
      'alt',
      'width',
      'height',
      'fit',
      'fallback',
      'loading',
      'lazy',
      'aria-label',
    ];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get src(): string {
    return this.getAttribute('src') || '';
  }
  set src(value: string) {
    if (value) {
      this.setAttribute('src', value);
    } else {
      this.removeAttribute('src');
    }
  }

  get alt(): string {
    return this.getAttribute('alt') || '';
  }
  set alt(value: string) {
    if (value) {
      this.setAttribute('alt', value);
    } else {
      this.removeAttribute('alt');
    }
  }

  get width(): string | null {
    return this.getAttribute('width');
  }
  set width(value: string | null) {
    if (value) {
      this.setAttribute('width', value);
    } else {
      this.removeAttribute('width');
    }
  }

  get height(): string | null {
    return this.getAttribute('height');
  }
  set height(value: string | null) {
    if (value) {
      this.setAttribute('height', value);
    } else {
      this.removeAttribute('height');
    }
  }

  get fit(): ImageFit {
    return (this.getAttribute('fit') as ImageFit) || 'fill';
  }
  set fit(value: ImageFit) {
    this.setAttribute('fit', value);
  }

  get fallback(): string {
    return this.getAttribute('fallback') || failImage;
  }
  set fallback(value: string) {
    if (value) {
      this.setAttribute('fallback', value);
    } else {
      this.removeAttribute('fallback');
    }
  }

  get loadingStrategy(): ImageLoadingStrategy {
    return (this.getAttribute('loading') as ImageLoadingStrategy) || 'eager';
  }
  set loadingStrategy(value: ImageLoadingStrategy) {
    this.setAttribute('loading', value);
  }

  get lazy(): boolean {
    return this.hasAttribute('lazy');
  }
  set lazy(value: boolean) {
    if (value) {
      this.setAttribute('lazy', '');
    } else {
      this.removeAttribute('lazy');
    }
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._shadowRoot.innerHTML = `
      <div part="container" class="image-container">
        <div part="placeholder" class="image-placeholder"></div>
      </div>
    `;

    this._shadowRoot.prepend(style);
    this._container = this._shadowRoot.querySelector('.image-container')!;
    this._placeholder = this._shadowRoot.querySelector('.image-placeholder')!;
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.loadImage();
    this.updateAriaAttributes();
  }

  disconnectedCallback(): void {
    this.removeImageListeners();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'src':
        this.loadImage();
        break;

      case 'alt':
      case 'aria-label':
        this.updateAriaAttributes();
        break;

      case 'width':
      case 'height':
        this.updateDimensions();
        break;

      case 'fit':
        this.updateFit();
        break;

      case 'fallback':
        if (this._loadState === 'error') {
          this.showError();
        }
        break;

      case 'loading':
      case 'lazy':
        if (this._loadState === 'idle') {
          this.loadImage();
        }
        break;
    }
  }

  // ========== Methods ==========

  private loadImage(): void {
    if (!this.src) return;

    this._loadState = 'loading';
    this.showPlaceholder();

    this.removeImageListeners();

    this._image = new Image();
    this._image.setAttribute('part', 'image');
    this._image.className = 'image-element';

    if (this.alt) {
      this._image.alt = this.alt;
    }

    // Set loading strategy
    const loadingAttr = this.lazy ? 'lazy' : this.loadingStrategy;
    this._image.loading = loadingAttr as 'eager' | 'lazy';

    this._image.addEventListener('load', this.handleLoad);
    this._image.addEventListener('error', this.handleError);

    this._image.src = this.src;
  }

  private handleLoad = (): void => {
    if (!this._image) return;

    this._loadState = 'loaded';
    this.hidePlaceholder();
    this.hideError();

    this._container.appendChild(this._image);
    this.updateDimensions();
    this.updateFit();

    this.dispatchEvent(
      new CustomEvent<ImageLoadEventDetail>('image-load', {
        detail: {
          src: this.src,
          width: this._image.naturalWidth,
          height: this._image.naturalHeight,
        },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleError = (event: Event): void => {
    this._loadState = 'error';
    this.hidePlaceholder();

    // Try fallback image
    if (this.fallback && this._image && this._image.src !== this.fallback) {
      this._image.src = this.fallback;
      return;
    }

    this.showError();

    this.dispatchEvent(
      new CustomEvent<ImageErrorEventDetail>('image-error', {
        detail: {
          src: this.src,
          error: event,
        },
        bubbles: true,
        composed: true,
      })
    );
  };

  private showPlaceholder(): void {
    if (this._placeholder) {
      this._placeholder.style.display = 'block';
    }
  }

  private hidePlaceholder(): void {
    if (this._placeholder) {
      this._placeholder.style.display = 'none';
    }
  }

  private showError(): void {
    if (!this._errorContainer) {
      this._errorContainer = document.createElement('div');
      this._errorContainer.setAttribute('part', 'error');
      this._errorContainer.className = 'image-error';
      this._errorContainer.textContent = 'Failed to load image';
      this._container.appendChild(this._errorContainer);
    }
    this._errorContainer.style.display = 'flex';
  }

  private hideError(): void {
    if (this._errorContainer) {
      this._errorContainer.style.display = 'none';
    }
  }

  private updateDimensions(): void {
    if (!this._image) return;

    if (this.width) {
      this._image.style.width = this.width;
      this._container.style.width = this.width;
    }

    if (this.height) {
      this._image.style.height = this.height;
      this._container.style.height = this.height;
    }
  }

  private updateFit(): void {
    if (!this._image) return;

    this._image.style.objectFit = this.fit;
  }

  private updateAriaAttributes(): void {
    if (!this._image) return;

    const ariaLabel = this.getAttribute('aria-label') || this.alt;
    if (ariaLabel) {
      this._image.setAttribute('aria-label', ariaLabel);
    }
  }

  private removeImageListeners(): void {
    if (this._image) {
      this._image.removeEventListener('load', this.handleLoad);
      this._image.removeEventListener('error', this.handleError);
    }
  }

  // ========== Public Methods ==========

  reload(): void {
    this.loadImage();
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-img')) {
    customElements.define('r-img', ImageComponent);
    return ImageComponent;
  } else {
    return createCustomError('document is undefined or r-img already exists');
  }
}

export default Custom();
