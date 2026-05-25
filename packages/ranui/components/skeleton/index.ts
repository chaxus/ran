import skeletonCss from './index.less?inline';
import { Div } from '@/utils/builder';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { RanElement } from '@/utils/index';
import { defineSSR } from '@/utils/ssr-registry';

export class Skeleton extends RanElement {
  _div: HTMLElement;
  _shadowDom: ShadowRoot;

  static get observedAttributes(): string[] {
    return ['disabled', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, skeletonCss);
    this._div = ensureShadowElement(this._shadowDom, '.ran-skeleton', () => Div().class('ran-skeleton').build());
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

  connectedCallback(): void {
    this.handlerExternalCss();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-skeleton', Skeleton as unknown as new () => HTMLElement);
export default Skeleton;
