import { HTMLElementSSR, createCustomError } from '@/utils/index';
import { Div, Span } from '@/utils/builder';
import { adoptSheetText, adoptStyles } from '@/utils/style';
import mathCss from './index.less?inline';
export class Math extends (HTMLElementSSR()!) {
  contain: HTMLElement;
  _shadowDom: ShadowRoot;
  static get observedAttributes(): string[] {
    return ['latex', 'sheet'];
  }
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowDom = shadowRoot;
    adoptStyles(this._shadowDom, mathCss);

    let contain = this._shadowDom.querySelector('.ran-math') as HTMLDivElement | null;
    if (!contain) {
      contain = Div().class('ran-math').build() as HTMLDivElement;
      this._shadowDom.appendChild(contain);
    }
    this.contain = contain;
  }
  get latex(): string {
    const latex = this.getAttribute('latex') || '';
    return decodeURIComponent(latex);
  }
  set latex(value: string) {
    this.setAttribute('latex', value || '');
  }
  get sheet(): string {
    return this.getAttribute('sheet') || '';
  }
  set sheet(value: string) {
    this.setAttribute('sheet', value || '');
  }
  handlerExternalCss = (): void => {
    if (!this.sheet) return;
    adoptSheetText(this._shadowDom, this.sheet);
  };
  render(): void {
    if (!this.latex) return;
    import('@/assets/js/katex/katex-es.js')
      .then((katex) => {
        this.contain.innerHTML = '';
        if (this.latex) {
          const span = Span().text(`$$${this.latex}$$`).build() as HTMLSpanElement;
          this.contain.appendChild(span);
          katex.renderMathInElement(this.contain);
        }
      })
      .catch(function (err: Error) {
        console.warn(`ranui math component warning: ${err.message}\n${err}`);
      });
  }
  connectedCallback(): void {
    this.handlerExternalCss();
    this.render();
  }
  attributeChangedCallback(k: string, o: string, n: string): void {
    if (o !== n) {
      if (k === 'latex') {
        this.render();
      }
      if (k === 'sheet') {
        this.handlerExternalCss();
      }
    }
  }
}

async function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-math')) {
    customElements.define('r-math', Math);
    return Math;
  } else {
    return createCustomError('document is undefined or r-math is exist');
  }
}

export default Custom();
