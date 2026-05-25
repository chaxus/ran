import { Div, Slot } from '@/utils/builder';
import { RanElement, isDisabled } from '@/utils/index';
import { ensureShadowElement, ensureShadowRoot, setStringAttribute, syncSheetAttribute } from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

export class Option extends RanElement {
  _option: HTMLDivElement;
  _optionContent: HTMLDivElement;
  _shadowDom: ShadowRoot;
  _slot: HTMLSlotElement;
  static get observedAttributes() {
    return ['disabled', 'sheet', 'value'];
  }
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this);
    this.setAttribute('class', 'ran-option');

    const option = ensureShadowElement(this._shadowDom, '.ran-select-dropdown-option', () => {
      const slot = Slot().build() as HTMLSlotElement;
      const optionContent = Div()
        .class('ran-select-dropdown-option-content')
        .children(slot)
        .build() as HTMLDivElement;
      return Div().class('ran-select-dropdown-option').children(optionContent).build() as HTMLDivElement;
    });
    const optionContent = option.querySelector('.ran-select-dropdown-option-content') as HTMLDivElement;
    const slot = option.querySelector('slot') as HTMLSlotElement;

    this._slot = slot;
    this._optionContent = optionContent;
    this._option = option;
  }
  get value() {
    return this.getAttribute('value');
  }
  set value(value) {
    setStringAttribute(this, 'value', value);
  }
  get sheet() {
    return this.getAttribute('sheet');
  }
  set sheet(value) {
    setStringAttribute(this, 'sheet', value);
  }
  get disabled() {
    return isDisabled(this);
  }
  set disabled(value: boolean | string | undefined | null) {
    if (!value || value === 'false') {
      this.removeAttribute('disabled');
    } else {
      this.setAttribute('disabled', '');
    }
  }
  handlerExternalCss() {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === 'disabled' && this._option) {
      if (!newValue || newValue === 'false') {
        this._option.setAttribute('disabled', '');
      } else {
        this._option.removeAttribute('disabled');
      }
    }
    if (name === 'sheet' && this._shadowDom) this.handlerExternalCss();
  }
}

defineSSR('r-option', Option as unknown as new () => HTMLElement);
export default Option;
