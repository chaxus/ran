import type { Chain } from 'ranuts/utils';
import { addClassToElement, create, removeClassToElement } from 'ranuts/utils';
import less from './index.less?inline';
import { HTMLElementSSR, createCustomError, isDisabled } from '@/utils/index';

export class DropdownItem extends (HTMLElementSSR()!) {
  ionDropdownItem: Chain;
  _slot: Chain;
  _shadowDom: ShadowRoot;
  ionDropdownItemContent: Chain;
  static get observedAttributes(): string[] {
    return ['active', 'value', 'title'];
  }
  constructor() {
    super();
    this._slot = create('slot').setAttribute('class', 'slot');
    this.ionDropdownItemContent = create('div')
      .setAttribute('class', 'ranui-dropdown-option-item-content')
      .setAttribute('part', 'ranui-dropdown-option-item-content')
      .addChild(this._slot);
    this.ionDropdownItem = create('div')
      .setAttribute('class', 'ranui-dropdown-option-item')
      .setAttribute('part', 'ranui-dropdown-option-item')
      .addChild([this.ionDropdownItemContent]);
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowDom = shadowRoot;
    const style = create('style').setTextContent(less);
    shadowRoot.appendChild(style.element);
    shadowRoot.appendChild(this.ionDropdownItem.element);
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
      addClassToElement(this.ionDropdownItem.element, 'ranui-dropdown-option-active');
    }
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'active' && newValue) {
      addClassToElement(this.ionDropdownItem.element, 'ranui-dropdown-option-active');
    } else {
      removeClassToElement(this.ionDropdownItem.element, 'ranui-dropdown-option-active');
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
