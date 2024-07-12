import type { Chain } from 'ranuts/utils';
import { addClassToElement, create, removeClassToElement } from 'ranuts/utils';
import less from './index.less?inline';
import { HTMLElementSSR, createCustomError, isDisabled } from '@/utils/index';

export class SelectionDropdownItem extends (HTMLElementSSR()!) {
  _selectionDropdownItem: Chain;
  _slot: Chain;
  _shadowDom: ShadowRoot;
  _selectionDropdownItemContent: Chain;
  static get observedAttributes(): string[] {
    return ['active', 'value', 'title'];
  }
  constructor() {
    super();
    this._slot = create('slot').setAttribute('class', 'slot');
    this._selectionDropdownItemContent = create('div')
      .setAttribute('class', 'ranui-select-dropdown-option-item-content')
      .setAttribute('part', 'ranui-select-dropdown-option-item-content')
      .addChild(this._slot);
    this._selectionDropdownItem = create('div')
      .setAttribute('class', 'ranui-select-dropdown-option-item')
      .setAttribute('part', 'ranui-select-dropdown-option-item')
      .addChild([this._selectionDropdownItemContent]);
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowDom = shadowRoot;
    const style = create('style').setTextContent(less);
    shadowRoot.appendChild(style.element);
    shadowRoot.appendChild(this._selectionDropdownItem.element);
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
      addClassToElement(this._selectionDropdownItem.element, 'ranui-select-dropdown-option-active');
    }
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'active' && newValue) {
      addClassToElement(this._selectionDropdownItem.element, 'ranui-select-dropdown-option-active');
    } else {
      removeClassToElement(this._selectionDropdownItem.element, 'ranui-select-dropdown-option-active');
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-select-dropdown-item')) {
    customElements.define('r-select-dropdown-item', SelectionDropdownItem);
    return SelectionDropdownItem;
  } else {
    return createCustomError('document is undefined or r-select is exist');
  }
}

export default Custom();
