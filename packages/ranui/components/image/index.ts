import failImage from '../../assets/image/failImage';
import { Div } from '@/utils/builder';
import { adoptStyles } from '@/utils/style';
import imageCss from './index.less?inline';

function Custom() {
  if (typeof window !== 'undefined' && !customElements.get('r-img')) {
    class CustomElement extends HTMLElement {
      static get observedAttributes() {
        return ['fallback'];
      }
      _image: HTMLImageElement | undefined;
      _container: Element;
      constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        adoptStyles(shadowRoot, imageCss);

        let container = shadowRoot.querySelector('.ran-image') as Element | null;
        if (!container) {
          container = Div().class('ran-image').build() as Element;
          shadowRoot.appendChild(container);
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
      }
    }
    customElements.define('r-img', CustomElement);
  }
}

export default Custom();
