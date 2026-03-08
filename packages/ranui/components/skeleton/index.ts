import skeletonCss from './index.less?inline';
import { adoptSheetText, adoptStyles } from '@/utils/style';
import { Div } from '@/utils/builder';

function Skeleton() {
  if (typeof window !== 'undefined' && !customElements.get('r-skeleton')) {
    class CustomElement extends HTMLElement {
      static get observedAttributes() {
        return ['disabled', 'sheet'];
      }
      _div: HTMLElement;
      _shadowDom: ShadowRoot;
      constructor() {
        super();
        this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
        adoptStyles(this._shadowDom, skeletonCss);

        let div = this._shadowDom.querySelector('.ran-skeleton') as HTMLElement | null;
        if (!div) {
          div = Div().class('ran-skeleton').build() as HTMLElement;
          this._shadowDom.appendChild(div);
        }
        this._div = div;
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
      connectedCallback(): void {
        this.handlerExternalCss();
      }
      attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name === 'sheet' && oldValue !== newValue) {
          this.handlerExternalCss();
        }
      }
    }

    window.customElements.define('r-skeleton', CustomElement);
  }
}
export default Skeleton();
