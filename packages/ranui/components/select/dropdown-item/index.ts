import { Div, Slot } from '@/utils/builder';
import { adoptStyles } from '@/utils/style';
import { HTMLElementSSR, createCustomError, isDisabled } from '@/utils/index';
import { addClassToElement, removeClassToElement } from 'ranuts/utils';
import less from './index.less?inline';

export class DropdownItem extends (HTMLElementSSR()!) {
  ionDropdownItem: HTMLElement;
  _slot: HTMLSlotElement;
  _shadowDom: ShadowRoot;
  ionDropdownItemContent: HTMLElement;
  static get observedAttributes(): string[] {
    return ['active', 'value', 'title'];
  }
  constructor() {
    super();
    this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(this._shadowDom, less);

    let ionDropdownItem = this._shadowDom.querySelector('.ranui-dropdown-option-item') as HTMLDivElement | null;
    let ionDropdownItemContent = this._shadowDom.querySelector(
      '.ranui-dropdown-option-item-content',
    ) as HTMLDivElement | null;
    let slot = this._shadowDom.querySelector('slot') as HTMLSlotElement | null;

    if (!ionDropdownItem || !ionDropdownItemContent || !slot) {
      slot = Slot().class('slot').build() as HTMLSlotElement;
      ionDropdownItemContent = Div()
        .class('ranui-dropdown-option-item-content')
        .part('ranui-dropdown-option-item-content')
        .children(slot)
        .build() as HTMLDivElement;
      ionDropdownItem = Div()
        .class('ranui-dropdown-option-item')
        .part('ranui-dropdown-option-item')
        .children(ionDropdownItemContent)
        .build() as HTMLDivElement;
      this._shadowDom.appendChild(ionDropdownItem);
    }

    this._slot = slot as any;
    this.ionDropdownItemContent = ionDropdownItemContent as any;
    this.ionDropdownItem = ionDropdownItem as any;
  }
  get value(): string {
    return this.getAttribute('value') || '';
  }
  set value(value: string) {
    if (!isDisabled(this) && value) {
      this.setAttribute('value', value);
    } else {
      this.removeAttribute('value');
    }
  }
  get active(): string {
    return this.getAttribute('active') || '';
  }
  set active(value: string) {
    if (value) {
      this.setAttribute('active', value);
    } else {
      this.removeAttribute('active');
    }
  }
  get title(): string {
    return this.getAttribute('title') || '';
  }
  set title(value: string) {
    if (value) {
      this.setAttribute('title', value);
    } else {
      this.removeAttribute('title');
    }
  }
  connectedCallback(): void {
    if (this.active) {
      addClassToElement(this.ionDropdownItem, 'ranui-dropdown-option-active');
    }
  }
  attributeChangedCallback(name: string, _: string, newValue: string): void {
    if (name === 'active' && newValue) {
      addClassToElement(this.ionDropdownItem, 'ranui-dropdown-option-active');
    } else {
      removeClassToElement(this.ionDropdownItem, 'ranui-dropdown-option-active');
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-dropdown-item')) {
    customElements.define('r-dropdown-item', DropdownItem);
    return DropdownItem;
  } else {
    return createCustomError('document is undefined or r-dropdown-item  is exist');
  }
}

export default Custom();
