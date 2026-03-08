import { Div, Slot } from '@/utils/builder';
import { createCustomError, isDisabled } from '@/utils/index';

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-option')) {
    class Option extends HTMLElement {
      _option: HTMLDivElement;
      _optionContent: HTMLDivElement;
      _shadowDom: ShadowRoot;
      _slot: HTMLSlotElement;
      static get observedAttributes() {
        return ['disabled', 'sheet', 'value'];
      }
      constructor() {
        super();
        this._shadowDom = this.attachShadow({ mode: 'closed' });
        // Assuming optionCss is defined elsewhere or will be added. For now, commenting out to avoid error.
        // adoptStyles(this._shadowDom, optionCss);
        this.setAttribute('class', 'ran-option');

        let option = this._shadowDom.querySelector('.ran-select-dropdown-option') as HTMLDivElement | null;
        let optionContent = this._shadowDom.querySelector(
          '.ran-select-dropdown-option-content',
        ) as HTMLDivElement | null;
        let slot = this._shadowDom.querySelector('slot') as HTMLSlotElement | null;

        if (!option || !optionContent || !slot) {
          slot = Slot().build() as HTMLSlotElement;
          optionContent = Div().class('ran-select-dropdown-option-content').children(slot).build() as HTMLDivElement;
          option = Div().class('ran-select-dropdown-option').children(optionContent).build() as HTMLDivElement;
          this._shadowDom.appendChild(option);
        }

        this._slot = slot;
        this._optionContent = optionContent;
        this._option = option;
      }
      get value() {
        return this.getAttribute('value');
      }
      set value(value) {
        this.setAttribute('value', value || '');
      }
      get sheet() {
        return this.getAttribute('sheet');
      }
      set sheet(value) {
        this.setAttribute('sheet', value || '');
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
        if (this.sheet) {
          try {
            const sheet = new CSSStyleSheet();
            sheet.insertRule(this.sheet);
            this._shadowDom.adoptedStyleSheets = [sheet];
          } catch (error) {
            console.error(`Failed to parse the rule in CSSStyleSheet: ${this.sheet}, error: ${error}`);
          }
        }
      }
      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'disabled' && this._option) {
          if (!newValue || newValue === 'false') {
            this._option.setAttribute('disabled', '');
          } else {
            this._option.removeAttribute('disabled');
          }
        }
        if (name === 'sheet' && this._shadowDom && oldValue !== newValue) this.handlerExternalCss();
      }
    }
    return Option;
  } else {
    return createCustomError('document is undefined or r-option is exist');
  }
}

export default Custom();
