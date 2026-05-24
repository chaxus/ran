import { HTMLElementSSR, createCustomError } from '@/utils/index';
import { Div, Span } from '@/utils/builder';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import mathCss from './index.less?inline';
import { defineSSR } from '@/utils/ssr-registry';
export class Math extends (HTMLElementSSR()!) {
  contain: HTMLElement;
  _shadowDom: ShadowRoot;
  static get observedAttributes(): string[] {
    return ['latex', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, mathCss);
    const contain = ensureShadowElement(
      this._shadowDom,
      '.ran-math',
      () => Div().class('ran-math').build() as HTMLDivElement,
    );
    this.contain = contain;
  }
  get latex(): string {
    const latex = getStringAttribute(this, 'latex');
    return decodeURIComponent(latex);
  }
  set latex(value: string) {
    setStringAttribute(this, 'latex', value);
  }
  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }
  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
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
  attributeChangedCallback(k: string, o: string | null, n: string | null): void {
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
  defineSSR('r-math', Math as unknown as new () => HTMLElement);
  return Math;
}

export default Custom();
