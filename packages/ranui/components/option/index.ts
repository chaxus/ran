import { createCustomError, isDisabled } from '@/utils/index';
import './index.less'

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
        this._slot = document.createElement('slot');
        this._option = document.createElement('div');
        this._option.setAttribute('class', 'ran-option');
        this._optionContent = document.createElement('div');
        this._optionContent.setAttribute('class', 'ran-option-content');
        this._optionContent.appendChild(this._slot);
        this._option.appendChild(this._optionContent);
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        this._shadowDom = shadowRoot;
        shadowRoot.appendChild(this._option);
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
            console.error(
              `Failed to parse the rule in CSSStyleSheet: ${this.sheet}`,
            );
          }
        }
      }
      connectedCallback() {}
      disconnectCallback() {}
      attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
      ) {
        if (name === 'disabled' && this._option) {
          if (!newValue || newValue === 'false') {
            this._option.setAttribute('disabled', '');
          } else {
            this._option.removeAttribute('disabled');
          }
        }
        if (name === 'sheet' && this._shadowDom && oldValue !== newValue)
          this.handlerExternalCss();
      }
    }
    return Option;
  } else {
    return createCustomError('document is undefined or r-option is exist');
  }
}

export default Custom();
