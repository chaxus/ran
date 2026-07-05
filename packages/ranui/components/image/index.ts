import failImage from '../../assets/image/failImage';
import { Div } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
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
    const container = ensureShadowElement(this._shadowDom, '.ran-image', () => Div().class('ran-image').build());
    this._container = container;
  }
  get fallback() {
    return getStringAttribute(this, 'fallback', failImage);
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
  updateSrc = (): void => {
    if (this._image) {
      this._image.src = this.getAttribute('src') || '';
    }
  };
  connectedCallback() {
    this.handlerExternalCss();
    this._image = new Image();
    // Always give the inner <img> an alt (empty = decorative) so it is never
    // announced by its URL.
    this._image.alt = this.alt;
    this._image.addEventListener('error', () => {
      if (this._image && this.fallback) {
        this._image.src = this.fallback;
      }
    });
    this._image.addEventListener('load', () => {
      if (this._image) {
        this._container.appendChild(this._image);
      }
    });
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
