import { addClassToElement, removeClassToElement } from 'ranuts/utils';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import { Div, Slot } from '@/utils/builder';
import { adoptSheetText, adoptStyles } from '@/utils/style';
import dropdownCss from './index.less?inline';

const animationTime = 300;

export enum ARROW_TYPE {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

export class Dropdown extends (HTMLElementSSR()!) {
  dropdown: HTMLElement;
  _slot: HTMLSlotElement;
  _shadowDom: ShadowRoot;
  arrowIcon?: HTMLElement;
  container: HTMLElement;
  static get observedAttributes(): string[] {
    return ['transit', 'arrow', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(this._shadowDom, dropdownCss);

    let container = this._shadowDom.querySelector('.ranui-dropdown-container') as HTMLElement | null;
    if (!container) {
      container = Div()
        .class('ranui-dropdown-container')
        .children(
          Div()
            .style('-webkit-tap-highlight-color', 'transparent')
            .style('outline', '0')
            .class('ranui-dropdown')
            .part('dropdown')
            .children(Slot().class('slot')),
        )
        .build() as HTMLElement;
      this._shadowDom.appendChild(container);
    }

    this.container = container;
    this.dropdown = container.querySelector('.ranui-dropdown') as HTMLElement;
    this._slot = container.querySelector('.slot') as HTMLSlotElement;
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
  get sheet(): string {
    return this.getAttribute('sheet') || '';
  }
  set sheet(value: string) {
    this.setAttribute('sheet', value || '');
  }
  handlerExternalCss = (): void => {
    if (!this.sheet) return;
    adoptSheetText(this._shadowDom, this.sheet);
  };
  handlerTransit = (): void => {
    if (this.transit && this.dropdown) {
      addClassToElement(this.dropdown, this.transit);
      setTimeout(() => {
        removeClassToElement(this.dropdown, this.transit);
      }, animationTime);
    }
  };
  handlerArrow = (): void => {
    if (!this.arrow) return;
    if (!this.arrowIcon && this.container) {
      this.arrowIcon = Div().class(`ranui-dropdown-arrow ${this.arrow}`).build() as HTMLElement;
      this.container.appendChild(this.arrowIcon);
    }
  };
  stopPropagation = (e: Event): void => {
    e.stopPropagation();
  };
  connectedCallback(): void {
    this.handlerExternalCss();
    this.handlerTransit();
    this.handlerArrow();
  }
  disconnectedCallback(): void {
    // this.removeEventListener('click', this.stopPropagation);
  }
  attributeChangedCallback(name: string, _: string, newValue: string): void {
    if (name === 'transit' && newValue) {
      addClassToElement(this.dropdown, this.transit);
      setTimeout(() => {
        removeClassToElement(this.dropdown, this.transit);
      }, animationTime);
    }
    if (name === 'arrow') {
      this.handlerArrow();
    }
    if (name === 'sheet') {
      this.handlerExternalCss();
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
