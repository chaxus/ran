import { adoptStyles } from '@/utils/style';
import skeletonCss from './index.less?inline';

function Skeleton() {
  if (typeof window !== 'undefined' && !customElements.get('r-skeleton')) {
    class CustomElement extends HTMLElement {
      static get observedAttributes() {
        return ['disabled'];
      }
      _div: HTMLElement;
      constructor() {
        super();
        this._div = document.createElement('div');
        this._div.setAttribute('class', 'ran-skeleton');
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        adoptStyles(shadowRoot, skeletonCss);
        shadowRoot.appendChild(this._div);
      }
    }

    window.customElements.define('r-skeleton', CustomElement);
  }
}
export default Skeleton();
