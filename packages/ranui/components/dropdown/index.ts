import type { Chain } from 'ranuts/utils';
import { addClassToElement, create, removeClassToElement } from 'ranuts/utils';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

const animationTime = 300;

export class Dropdown extends (HTMLElementSSR()!) {
  dropdown: Chain;
  _slot: Chain;
  _shadowDom: ShadowRoot;
  static get observedAttributes(): string[] {
    return ['transit'];
  }
  constructor() {
    super();
    this._slot = create('slot').setAttribute('class', 'slot');
    this.dropdown = create('div')
      .setStyle('-webkit-tap-highlight-color', 'transparent')
      .setStyle('outline', '0')
      .setAttribute('class', 'ranui-dropdown')
      .setAttribute('part', 'ranui-dropdown')
      .addChild([this._slot]);
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowDom = shadowRoot;
    shadowRoot.appendChild(this.dropdown.element);
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
      addClassToElement(this.dropdown.element, this.transit);
      setTimeout(() => {
        removeClassToElement(this.dropdown.element, this.transit);
      }, animationTime);
    }
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'transit' && newValue) {
      addClassToElement(this.dropdown.element, this.transit);
      setTimeout(() => {
        removeClassToElement(this.dropdown.element, this.transit);
      }, animationTime);
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-dropdown')) {
    customElements.define('r-dropdown', Dropdown);
    return Dropdown;
  } else {
    return createCustomError('document is undefined or r-dropdown is exist');
  }
}

export default Custom();
