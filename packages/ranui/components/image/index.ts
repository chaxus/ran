import failImage from '../../assets/image/failImage';
import { Div } from '@/utils/builder';
import { adoptSheetText, adoptStyles } from '@/utils/style';
import imageCss from './index.less?inline';

function Custom() {
  if (typeof window !== 'undefined' && !customElements.get('r-img')) {
    class CustomElement extends HTMLElement {
      static get observedAttributes() {
        return ['fallback', 'sheet'];
      }
      _image: HTMLImageElement | undefined;
      _container: Element;
      _shadowDom: ShadowRoot;
      constructor() {
        super();
        this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
        adoptStyles(this._shadowDom, imageCss);

        let container = this._shadowDom.querySelector('.ran-image') as Element | null;
        if (!container) {
          container = Div().class('ran-image').build() as Element;
          this._shadowDom.appendChild(container);
        }
        this._container = container;
      }
      get fallback() {
        return this.getAttribute('fallback') || failImage;
      }
      set fallback(value) {
        if (value) {
          this.setAttribute('fallback', value);
        } else {
          this.removeAttribute('fallback');
        }
      }

      get sheet() {
        return this.getAttribute('sheet') || '';
      }

      set sheet(value) {
        this.setAttribute('sheet', value || '');
      }

      handlerExternalCss = (): void => {
        if (!this.sheet) return;
        adoptSheetText(this._shadowDom, this.sheet);
      };

      listenFallback(name: string, value: string) {
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
      attributeChangedCallback(name: string, _: string, newValue: string) {
        this.listenFallback(name, newValue);
        if (name === 'sheet') {
          this.handlerExternalCss();
        }
      }
    }
    customElements.define('r-img', CustomElement);
  }
}

export default Custom();
