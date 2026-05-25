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
    return ['fallback', 'sheet'];
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
  connectedCallback() {
    this.handlerExternalCss();
    const src = this.getAttribute('src') || '';
    this._image = new Image();
    this._image.src = src;
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
  }
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    this.listenFallback(name, newValue);
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-img', ImageElement as unknown as new () => HTMLElement);
export default ImageElement;
