import { addClassToElement, removeClassToElement } from 'ranuts/utils';
import { RanElement } from '@/utils/index';
import { Div, Slot } from '@/utils/builder';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import dropdownCss from './index.less?inline';
import { defineSSR } from '@/utils/ssr-registry';

const animationTime = 300;

export enum ARROW_TYPE {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

export class Dropdown extends RanElement {
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
    this._shadowDom = ensureShadowRoot(this, dropdownCss);
    const container = ensureShadowElement(
      this._shadowDom,
      '.ranui-dropdown-container',
      () =>
        Div()
          .class('ranui-dropdown-container')
          .children(
            Div()
              .style('-webkit-tap-highlight-color', 'transparent')
              .style('outline', '0')
              .class('ranui-dropdown')
              .part('dropdown')
              .children(Slot().class('slot')),
          )
          .build() as HTMLElement,
    );

    this.container = container;
    this.dropdown = container.querySelector('.ranui-dropdown') as HTMLElement;
    this._slot = container.querySelector('.slot') as HTMLSlotElement;
  }
  get transit(): string {
    return getStringAttribute(this, 'transit');
  }
  set transit(value: string) {
    setStringAttribute(this, 'transit', value, { removeEmpty: true });
  }
  get arrow(): string {
    return getStringAttribute(this, 'arrow');
  }
  set arrow(value: string) {
    setStringAttribute(this, 'arrow', value, { removeEmpty: true });
  }
  get show(): string {
    return getStringAttribute(this, 'show');
  }
  set show(value: string) {
    setStringAttribute(this, 'show', value, { removeEmpty: true });
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
  handlerTransit = (): void => {
    if (this.transit && this.dropdown) {
      addClassToElement(this.dropdown, this.transit);
      setTimeout(() => {
        removeClassToElement(this.dropdown, this.transit);
      }, animationTime);
    }
  };
  handlerArrow = (): void => {
    const arrow = (this.arrow || '').trim();
    if (!arrow) {
      if (this.arrowIcon && this.container.contains(this.arrowIcon)) {
        this.container.removeChild(this.arrowIcon);
      }
      this.arrowIcon = undefined;
      return;
    }
    if (!this.arrowIcon && this.container) {
      this.arrowIcon = Div().class('ranui-dropdown-arrow').build() as HTMLElement;
      this.container.appendChild(this.arrowIcon);
    }
    if (this.arrowIcon) {
      this.arrowIcon.className = `ranui-dropdown-arrow ${arrow}`;
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
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === 'transit' && newValue) {
      addClassToElement(this.dropdown, this.transit);
      setTimeout(() => {
        removeClassToElement(this.dropdown, this.transit);
      }, animationTime);
    }
    if (name === 'arrow') {
      this.handlerArrow();
    }
    if (name === 'sheet' && oldValue !== newValue) {
      this.handlerExternalCss();
    }
  }
}

defineSSR('r-dropdown', Dropdown as unknown as new () => HTMLElement);
export default Dropdown;
