import type { Chain } from 'ranuts/utils';
import { addClassToElement, create, noop, removeClassToElement } from 'ranuts/utils';
import { HTMLElementSSR, createCustomError } from '@/utils/index';

const animationTime = 300;

enum ARROW_TYPE {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

export class Dropdown extends (HTMLElementSSR()!) {
  dropdown: Chain;
  _slot: Chain;
  _shadowDom: ShadowRoot;
  arrowIcon?: Chain;
  container: Chain;
  static get observedAttributes(): string[] {
    return ['transit', 'arrow'];
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
    this.container = create('div').setAttribute('class', 'ranui-dropdown-container').addChild([this.dropdown]);
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowDom = shadowRoot;
    shadowRoot.appendChild(this.container.element);
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
  get arrow(): string {
    return this.getAttribute('arrow') || '';
  }
  set arrow(value: string) {
    if (value) {
      this.setAttribute('arrow', value);
    } else {
      this.removeAttribute('arrow');
    }
  }
  get show(): string {
    return this.getAttribute('show') || '';
  }
  set show(value: string) {
    if (value) {
      this.setAttribute('show', value);
    } else {
      this.removeAttribute('show');
    }
  }
  handlerTransit = (): void => {
    if (this.transit) {
      addClassToElement(this.dropdown.element, this.transit);
      setTimeout(() => {
        removeClassToElement(this.dropdown.element, this.transit);
      }, animationTime);
    }
  };
  handlerArrow = (): void => {
    if (!this.arrow) return;
    if (!this.arrowIcon) {
      this.arrowIcon = create('div').setAttribute('class', `ranui-dropdown-arrow ${this.arrow}`);
      this.container.addChild([this.arrowIcon]);
    }
  };
  stopPropagation = (e: Event): void => {
    e.stopPropagation();
  };
  connectedCallback(): void {
    this.handlerTransit();
    this.handlerArrow();
    this.addEventListener('click', this.stopPropagation);
  }
  disconnectedCallback(): void {
    this.removeEventListener('click', this.stopPropagation);
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'transit' && newValue) {
      addClassToElement(this.dropdown.element, this.transit);
      setTimeout(() => {
        removeClassToElement(this.dropdown.element, this.transit);
      }, animationTime);
    }
    if (name === 'arrow') {
      this.handlerArrow();
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
