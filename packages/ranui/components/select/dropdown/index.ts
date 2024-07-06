import type { Chain } from 'ranuts/utils';
import { addClassToElement, create, removeClassToElement } from 'ranuts/utils';
import less from './index.less?inline';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

const animationTime = 300;

export class SelectionDropdown extends (HTMLElementSSR()!) {
  _selectionDropdown: Chain;
  _slot: Chain;
  _shadowDom: ShadowRoot;
  static get observedAttributes(): string[] {
    return ['transit'];
  }
  constructor() {
    super();
    this._slot = create('slot').setAttribute('class', 'slot');
    this._selectionDropdown = create('div')
      .setStyle('-webkit-tap-highlight-color', 'transparent')
      .setStyle('outline', '0')
      .setAttribute('class', 'ranui-select-dropdown')
      .addChild([this._slot]);
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowDom = shadowRoot;
    const style = create('style').setTextContent(less);
    shadowRoot.appendChild(style.element);
    shadowRoot.appendChild(this._selectionDropdown.element);
  }
  get transit(): string {
    return this.getAttribute('transit') || '';
  }
  set transit(value: string) {
    if (value) {
      this.setAttribute('transit', value);
    } else {
      this.removeAttribute('transit');
    }
  }
  connectedCallback(): void {
    if (this.transit) {
      addClassToElement(this._selectionDropdown.element, this.transit);
      setTimeout(() => {
        removeClassToElement(this._selectionDropdown.element, this.transit);
      }, animationTime);
    }
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'transit' && newValue) {
      addClassToElement(this._selectionDropdown.element, this.transit);
      setTimeout(() => {
        removeClassToElement(this._selectionDropdown.element, this.transit);
      }, animationTime);
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-select-dropdown')) {
    customElements.define('r-select-dropdown', SelectionDropdown);
    return SelectionDropdown;
  } else {
    return createCustomError('document is undefined or r-select is exist');
  }
}

export default Custom();
