import { createCustomError, isDisabled } from '@/utils/index';
import '@/components/icon';

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-select')) {
    class Select extends HTMLElement {
      _slot: HTMLSlotElement;
      _shadowDom: ShadowRoot;
      _select: HTMLDivElement;
      _selection: HTMLDivElement;
      _search: HTMLElement;
      _icon: HTMLElement;
      _selectDropdown?: HTMLDivElement;
      static get observedAttributes() {
        return ['disabled', 'sheet'];
      }
      constructor() {
        super();
        this._slot = document.createElement('slot');
        this._select = document.createElement('div');
        this._select.setAttribute('class', 'select');
        this._selection = document.createElement('div');
        this._selection.setAttribute('class', 'selection');
        this._search = document.createElement('input');
        this._search.setAttribute('class', 'search');
        this._search.setAttribute('type', 'search');
        this._search.setAttribute('autocomplete', 'off');
        this._icon = document.createElement('r-icon');
        this._icon.setAttribute('class', 'icon');
        this._icon.setAttribute('name', 'arrow-down');
        this._icon.setAttribute('color', '#d9d9d9');
        this._icon.setAttribute('size', '16');
        this._selection.appendChild(this._search);
        this._selection.appendChild(this._icon);
        this._slot.setAttribute('class', 'slot');
        this._select.appendChild(this._selection);
        this._select.appendChild(this._slot);
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        this._shadowDom = shadowRoot;
        shadowRoot.appendChild(this._select);
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
      createOption = () => {
        if (!this._selectDropdown) {
          this._selectDropdown = document.createElement('div');
        }
        const selectDropdown = document.createElement('div')
        selectDropdown.setAttribute('class','ranui-select-dropdown')
        const selectOptionItem = document.createElement('div')
        selectOptionItem.setAttribute('class','ranui-select-dropdown-option-item')
        const selectOptionItemContent = document.createElement('div')
        selectOptionItemContent.setAttribute('class','ranui-select-dropdown-option-item-content')
        selectOptionItemContent.innerText = 'Mike'
        selectOptionItem.appendChild(selectOptionItemContent)
        selectDropdown.appendChild(selectOptionItem)
        this._selectDropdown.appendChild(selectDropdown)
        document.body.appendChild(this._selectDropdown);
      };
      connectedCallback() {
        this.handlerExternalCss();
        this.createOption()
      }
      disconnectCallback() {}
      attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
      ) {
        if (name === 'disabled' && this._select) {
          if (!newValue || newValue === 'false') {
            this._select.setAttribute('disabled', '');
          } else {
            this._select.removeAttribute('disabled');
          }
        }
        if (name === 'sheet' && this._shadowDom && oldValue !== newValue)
          this.handlerExternalCss();
      }
    }
    customElements.define('r-select', Select);
    return Select;
  } else {
    return createCustomError('document is undefined or r-select is exist');
  }
}

export default Custom();
