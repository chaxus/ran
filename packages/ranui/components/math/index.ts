import { create } from 'ranuts/utils';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
export class Math extends (HTMLElementSSR()!) {
  contain: HTMLDivElement;
  static get observedAttributes(): string[] {
    return ['latex'];
  }
  constructor() {
    super();
    this.contain = create('div').setAttribute('class', 'ran-math').element;
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    shadowRoot.appendChild(this.contain);
  }
  get latex(): string {
    const latex = this.getAttribute('latex') || '';
    return decodeURIComponent(latex);
  }
  set latex(value: string) {
    this.setAttribute('latex', value || '');
  }
  render(): void {
    if (!this.latex) return;
    import('@/assets/js/katex/katex-es.js')
      .then((katex) => {
        this.contain.innerHTML = '';
        const span = create('span').setTextContent(`$$${this.latex}$$`).element
        this.contain.appendChild(span)
        if (!katex) return;
        katex.renderMathInElement(this.contain);
      })
      .catch(function (err: Error) {
        console.warn(`ranui math component warning: ${err.message}\n${err}`);
      });
  }
  connectedCallback(): void {
    this.render();
  }
  disconnectCallback(): void { }
  attributeChangedCallback(k: string, o: string, n: string): void {
    if (o !== n) {
      if (k === 'latex') {
        this.render();
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
