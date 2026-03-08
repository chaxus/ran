import { adoptStyles } from '@/utils/style';
import { Div } from '@/utils/builder';
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
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        adoptStyles(shadowRoot, skeletonCss);

        let div = shadowRoot.querySelector('.ran-skeleton') as HTMLElement | null;
        if (!div) {
          div = Div().class('ran-skeleton').build() as HTMLElement;
          shadowRoot.appendChild(div);
        }
        this._div = div;
      }
    }

    window.customElements.define('r-skeleton', CustomElement);
  }
}
export default Skeleton();
