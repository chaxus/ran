import { addClassToElement, removeClassToElement } from 'ranuts/utils';
import less from './index.less?inline';
import { Div, Slot } from '@/utils/builder';
import { RanElement, isDisabled } from '@/utils/index';
import { defineSSR } from '@/utils/ssr-registry';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';

export class DropdownItem extends RanElement {
  ionDropdownItem: HTMLElement;
  _slot: HTMLSlotElement;
  _shadowDom: ShadowRoot;
  ionDropdownItemContent: HTMLElement;
  static get observedAttributes(): string[] {
    return ['active', 'value', 'title', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, less);
    const ionDropdownItem = ensureShadowElement(this._shadowDom, '.ranui-dropdown-option-item', () => {
      const slot = Slot().class('slot').build() as HTMLSlotElement;
      const ionDropdownItemContent = Div()
        .class('ranui-dropdown-option-item-content')
        .part('content')
        .children(slot)
        .build() as HTMLDivElement;
      return Div()
        .class('ranui-dropdown-option-item')
        .part('item')
        .children(ionDropdownItemContent)
        .build() as HTMLDivElement;
    });
    const ionDropdownItemContent = ionDropdownItem.querySelector(
      '.ranui-dropdown-option-item-content',
    ) as HTMLDivElement;
    const slot = ionDropdownItem.querySelector('slot') as HTMLSlotElement;

    this._slot = slot as any;
    this.ionDropdownItemContent = ionDropdownItemContent as any;
    this.ionDropdownItem = ionDropdownItem as any;
  }
  get value(): string {
    return getStringAttribute(this, 'value');
  }
  set value(value: string) {
    if (!isDisabled(this) && value) {
      this.setAttribute('value', value);
    } else {
      this.removeAttribute('value');
    }
  }
  get active(): string {
    return getStringAttribute(this, 'active');
  }
  set active(value: string) {
    if (value) {
      this.setAttribute('active', value);
    } else {
      this.removeAttribute('active');
    }
  }
  get title(): string {
    return getStringAttribute(this, 'title');
  }
  set title(value: string) {
    if (value) {
      this.setAttribute('title', value);
    } else {
      this.removeAttribute('title');
    }
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
    if (this.active) {
      addClassToElement(this.ionDropdownItem, 'ranui-dropdown-option-active');
    }
  }
  attributeChangedCallback(name: string, _: string, newValue: string): void {
    if (name === 'sheet') {
      this.handlerExternalCss();
      return;
    }
    if (name === 'active' && newValue) {
      addClassToElement(this.ionDropdownItem, 'ranui-dropdown-option-active');
    } else {
      removeClassToElement(this.ionDropdownItem, 'ranui-dropdown-option-active');
    }
  }
}

defineSSR('r-dropdown-item', DropdownItem as unknown as new () => HTMLElement);
export default DropdownItem;
