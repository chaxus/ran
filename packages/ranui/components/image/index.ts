import { Div } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { ensureShadowRoot, getStringAttribute, setStringAttribute, syncSheetAttribute } from '@/utils/component';
import imageCss from './index.less?inline';
import { defineSSR } from '@/utils/ssr-registry';

export class ImageElement extends RanElement {
  static get observedAttributes() {
    return ['src', 'fallback', 'sheet', 'alt'];
  }
  _image: HTMLImageElement | undefined;
  _container: Element;
  _shadowDom: ShadowRoot;
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, imageCss);
    const container = Div().class('ran-image').attr('part', 'image').attr('data-state', 'loading').build();
    this._shadowDom.appendChild(container);
    this._container = container;
  }
  /** Image shown when `src` fails. Empty by default: a failed image then shows a theme-aware placeholder that fills the box. */
  get fallback() {
    return getStringAttribute(this, 'fallback');
  }
  set fallback(value) {
    setStringAttribute(this, 'fallback', value, { removeEmpty: true });
  }
  get sheet() {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value) {
    setStringAttribute(this, 'sheet', value);
  }
  /**
   * Alternative text forwarded to the inner `<img>`. Defaults to `''` (empty),
   * which marks the image decorative so screen readers skip it — better than a
   * missing alt, where they announce the file name/URL. Set a description for
   * meaningful images.
   */
  get alt() {
    return getStringAttribute(this, 'alt');
  }
  set alt(value) {
    setStringAttribute(this, 'alt', value);
  }
  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };
  listenFallback(name: string, value: string | null) {
    if (name === 'fallback' && this._image) {
      if (value) {
        this._image.setAttribute('fallback', value);
      } else {
        this._image.removeAttribute('fallback');
      }
    }
  }
  /**
   * Point the inner `<img>` at the current `src` attribute. The `error`/`load`
   * listeners wired in `connectedCallback` stay attached, so this reuses the
   * same fallback-on-error and append-on-load behavior for every src change.
   */
  /** Name the container as an image only while it stands in for a failed, meaningful one. */
  private _nameErrorSurface = (alt: string): void => {
    if (alt) {
      this._container.setAttribute('role', 'img');
      this._container.setAttribute('aria-label', alt);
    } else {
      this._container.removeAttribute('role');
      this._container.removeAttribute('aria-label');
    }
  };
  updateSrc = (): void => {
    if (this._image) {
      this._container.setAttribute('data-state', 'loading');
      this._nameErrorSurface('');
      const src = this.getAttribute('src');
      // No src is not a failed load: keep the quiet placeholder rather than the error icon.
      if (!src) {
        this._image.removeAttribute('src');
        this._image.remove();
        return;
      }
      this._image.src = src;
    }
  };
  connectedCallback() {
    this.handlerExternalCss();
    // Keep the actual image and its handlers when a keyed view is reattached.
    // Recreating it leaves the previous loaded image in the container.
    if (!this._image) {
      const image = new Image();
      image.addEventListener('error', () => {
        const fallback = this.fallback;
        // A failing custom fallback must stop here rather than request itself forever.
        if (fallback && image.getAttribute('src') !== fallback) {
          image.src = fallback;
          return;
        }
        image.remove();
        this._container.setAttribute('data-state', 'error');
        // The <img> and its alt are gone; a meaningful image keeps its name on the error surface.
        this._nameErrorSurface(this.alt);
      });
      image.addEventListener('load', () => {
        if (!this._container.contains(image)) this._container.appendChild(image);
        this._container.setAttribute('data-state', 'loaded');
        this._nameErrorSurface('');
      });
      this._image = image;
    }
    // Always give the inner <img> an alt (empty = decorative) so it is never
    // announced by its URL.
    this._image.alt = this.alt;
    this.updateSrc();
  }
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    this.listenFallback(name, newValue);
    if (name === 'src') this.updateSrc();
    if (name === 'alt' && this._image) this._image.alt = newValue ?? '';
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-img', ImageElement as unknown as new () => HTMLElement);
export default ImageElement;
