import skeletonCss from './index.less?inline';
import { Div } from '@/utils/builder';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';

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
        this._shadowDom = ensureShadowRoot(this, skeletonCss);
        this._div = ensureShadowElement(this._shadowDom, '.ran-skeleton', () => Div().class('ran-skeleton').build());
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
      connectedCallback(): void {
        this.handlerExternalCss();
      }
      attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        if (name === 'sheet' && oldValue !== newValue) {
          this.handlerExternalCss();
        }
      }
    }

    window.customElements.define('r-skeleton', CustomElement);
  }
}
export default Skeleton();
