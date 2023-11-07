import { addClassToElement, removeClassToElement } from 'ranuts';
import { createCustomError, isDisabled } from '@/utils/index';
import '@/components/option';
import '@/components/icon';
import '@/components/input';

interface Option {
  label: string | number;
  value: string | number;
}

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
      _selectionDropdown?: HTMLDivElement;
      _selectDropDownInTimeId?: NodeJS.Timeout;
      _selectDropDownOutTimeId?: NodeJS.Timeout;
      _optionList: Option[];
      _optionLabelMapValue: Map<string, string>;
      _optionValueMapLabel: Map<string, string>;
      _activeOption?: HTMLElement;
      _text: HTMLSpanElement;
      _selector: HTMLDivElement;
      static get observedAttributes() {
        return [
          'disabled',
          'sheet',
          'clear',
          'type',
          'defaultValue',
          'showSearch',
        ];
      }
      constructor() {
        super();
        this._slot = document.createElement('slot');
        this._select = document.createElement('div');
        this._select.setAttribute('class', 'select');
        this._selection = document.createElement('div');
        this._selection.setAttribute('class', 'selection');
        this._selector = document.createElement('div');
        this._search = document.createElement('r-input');
        this._search.setAttribute('class', 'selection-search');
        this._search.setAttribute('type', 'search');
        this._search.setAttribute('autocomplete', 'off');
        this._text = document.createElement('span');
        this._text.setAttribute('class', 'selection-item');
        this._icon = document.createElement('r-icon');
        this._icon.setAttribute('class', 'icon');
        this._icon.setAttribute('name', 'arrow-down');
        this._icon.setAttribute('color', '#d9d9d9');
        this._icon.setAttribute('size', '16');
        this._selector.appendChild(this._text);
        this._selector.appendChild(this._search);
        this._selection.appendChild(this._icon);
        this._selection.appendChild(this._selector);
        this._slot.setAttribute('class', 'slot');
        this._select.appendChild(this._selection);
        this._select.appendChild(this._slot);
        this._optionList = [];
        this._optionLabelMapValue = new Map();
        this._optionValueMapLabel = new Map();
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        this._shadowDom = shadowRoot;
        shadowRoot.appendChild(this._select);
      }
      get value() {
        return this.getAttribute('value');
      }
      set value(value) {
        if (!isDisabled(this) && value) {
          this.setAttribute('value', value);
        } else {
          this.removeAttribute('value');
        }
      }
      get defaultValue() {
        return this.getAttribute('defaultValue');
      }
      set defaultValue(value) {
        this.setAttribute('defaultValue', value || '');
      }
      get showSearch() {
        return this.getAttribute('showSearch');
      }
      set showSearch(value) {
        this.setAttribute('showSearch', value || '');
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
          this._selection.removeAttribute('disabled');
        } else {
          this.setAttribute('disabled', '');
          this._selection.setAttribute('disabled', '');
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
      /**
       * @description: 移除 select dropdown
       * @return {*}
       */
      setSelectDropdownDisplayNone = () => {
        if (
          this._selectionDropdown &&
          this._selectionDropdown.style.display !== 'none'
        ) {
          addClassToElement(
            this._selectionDropdown,
            'ran-select-dropdown-down-out',
          );
          if (this._selectDropDownOutTimeId) return;
          this._selectDropDownOutTimeId = setTimeout(() => {
            this._selectionDropdown &&
              this._selectionDropdown.style.setProperty('display', 'none');
            this._selectionDropdown &&
              removeClassToElement(
                this._selectionDropdown,
                'ran-select-dropdown-down-out',
              );
            clearTimeout(this._selectDropDownOutTimeId);
            this._selectDropDownOutTimeId = undefined;
          }, 200);
        }
      };
      /**
       * @description: 添加 select dropdown
       * @return {*}
       */
      setSelectDropdownDisplayBlock = () => {
        if (
          this._selectionDropdown &&
          this._selectionDropdown.style.display !== 'block'
        ) {
          if (this._selectDropDownInTimeId) return;
          addClassToElement(
            this._selectionDropdown,
            'ran-select-dropdown-down-in',
          );
          this._selectionDropdown.style.setProperty('display', 'block');
          this._selectDropDownInTimeId = setTimeout(() => {
            this._selectionDropdown &&
              removeClassToElement(
                this._selectionDropdown,
                'ran-select-dropdown-down-in',
              );
            clearTimeout(this._selectDropDownInTimeId);
            this._selectDropDownInTimeId = undefined;
          }, 200);
        }
      };
      /**
       * @description: 设置下拉框
       * @return {*}
       */
      selectMouseDown = () => {
        if (isDisabled(this)) return;
        if (!this._selectionDropdown || !this._selectDropdown) return;
        const rect = this.getBoundingClientRect();
        const { top, left, bottom, width, height, x, y } = rect;
        this._text.style.setProperty('line-height', `${height}px`);
        this._selectionDropdown.style.setProperty('-ran-x', `${x}`);
        this._selectionDropdown.style.setProperty('-ran-y', `${y}`);
        this._selectionDropdown.style.setProperty('width', `${width}px`);
        this._selectionDropdown.style.setProperty(
          'inset',
          `${bottom}px auto auto ${left}px`,
        );
        this.setSelectDropdownDisplayNone();
        this.setSelectDropdownDisplayBlock();
      };
      /**
       * @description: 焦点移除的情况，需要移除select 下拉框
       * @return {*}
       */
      selectBlur = () => {
        this.setSelectDropdownDisplayNone();
      };
      /**
       * @description: 选中一个选项的情况
       * @param {MouseEvent} e
       * @return {*}
       */
      clickOption = (e: MouseEvent) => {
        let element = e.target as Element;
        if (element.classList?.contains('ranui-select-dropdown-option-item')) {
          element = element.children[0];
        }
        if (
          !element.classList?.contains(
            'ranui-select-dropdown-option-item-content',
          )
        )
          return;
        const label = element.innerHTML;
        const value = this._optionLabelMapValue.get(label);
        if (value) {
          this.setAttribute('value', value);
          this._text.innerHTML = label;
          this._text.setAttribute('title', label);
          this._search.setAttribute('placeholder', label);
        }
        if (this._activeOption) {
          removeClassToElement(
            this._activeOption,
            'ranui-select-dropdown-option-active',
          );
        }
        setTimeout(() => {
          this._activeOption = element?.parentElement || undefined;
          if (this._activeOption) {
            addClassToElement(
              this._activeOption,
              'ranui-select-dropdown-option-active',
            );
          }
        }, 200);
        this.setSelectDropdownDisplayNone();
        // 点击后触发 onchange 事件
        this.dispatchEvent(
          new CustomEvent('change', { detail: { value, label } }),
        );
      };
      /**
       * @description: 初始化创建选项下拉框
       * @return {*}
       */
      createOption = () => {
        if (!this._selectDropdown) {
          this._selectDropdown = document.createElement('div');
          this._selectDropdown.addEventListener('click', this.clickOption);
          this._selectionDropdown = document.createElement('div');
          this._selectionDropdown.setAttribute(
            'class',
            'ranui-select-dropdown',
          );
          this._selectDropdown.appendChild(this._selectionDropdown);
          this._selectionDropdown.style.setProperty('display', 'none');
          document.body.appendChild(this._selectDropdown);
        }
      };
      /**
       * @description: 移除选项下拉框
       * @return {*}
       */
      removeSelectDropdown = () => {
        try {
          if (this._selectDropdown) {
            document.body.removeChild(this._selectDropdown);
          }
        } catch (error) {}
      };
      /**
       * @description: 当select中有option元素的时候，给dropdown添加元素
       * @return {*}
       */
      addOptionToSlot = () => {
        const slots = this._slot.assignedElements();
        slots.forEach((item) => {
          if (item.tagName !== 'R-OPTION') return;
          const label = item.innerHTML;
          const value = item.getAttribute('value') || '';
          this._optionList?.push({ label, value });
          if (this._optionLabelMapValue.get(label)) {
            console.warn(`${label} is repeat option`);
          }
          if (this._optionValueMapLabel.get(value)) {
            console.warn(`${value} is repeat option`);
          }
          this._optionLabelMapValue.set(label, value);
          this._optionValueMapLabel.set(value, label);
        });
        this._optionList.forEach((item) => {
          if (this._selectionDropdown) {
            const { label, value } = item;
            const selectOptionItem = document.createElement('div');
            selectOptionItem.setAttribute(
              'class',
              'ranui-select-dropdown-option-item',
            );
            const selectOptionItemContent = document.createElement('div');
            selectOptionItemContent.setAttribute(
              'class',
              'ranui-select-dropdown-option-item-content',
            );
            selectOptionItemContent.innerHTML = `${label}`;
            selectOptionItemContent.setAttribute('value', `${value}`);
            selectOptionItemContent.setAttribute('title', `${label}`);
            selectOptionItem.appendChild(selectOptionItemContent);
            this._selectionDropdown.appendChild(selectOptionItem);
          }
        });
        this.setDefaultValue();
      };
      setDefaultValue = () => {
        const defaultValue = this.getAttribute('defaultValue');
        if (!defaultValue) return;
        const label = this._optionValueMapLabel.get(defaultValue);
        if (!label) return;
        this.setAttribute('value', defaultValue);
        const rect = this.getBoundingClientRect();
        const { height } = rect;
        this._text.style.setProperty('line-height', `${height}px`);
        this._text.innerHTML = label;
        this._text.setAttribute('title', label);
      };
      changeSearch = (e: Event) => {
        console.log('e', e);
      };
      setShowSearch = () => {
        this._search.addEventListener('change', this.changeSearch);
      };
      listenSlotChange = () => {
        this._slot.addEventListener('slotchange', this.addOptionToSlot);
      };
      removeListenSlotChange = () => {
        this._slot.removeEventListener('slotchange', this.addOptionToSlot);
      };
      connectedCallback() {
        this.handlerExternalCss();
        this.addEventListener('mousedown', this.selectMouseDown);
        this.addEventListener('blur', this.selectBlur);
        this.createOption();
        this.listenSlotChange();
        this.setShowSearch();
      }
      disconnectCallback() {
        this.removeEventListener('mousedown', this.selectMouseDown);
        this.removeEventListener('blur', this.selectBlur);
        this.removeSelectDropdown();
        this._selectDropdown?.removeEventListener('click', this.clickOption);
        this.removeListenSlotChange();
      }
      attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
      ) {
        if (name === 'disabled' && this._select) {
          if (!newValue || newValue === 'false') {
            this._select.setAttribute('disabled', '');
            this._selection.setAttribute('disabled', '');
          } else {
            this._select.removeAttribute('disabled');
            this._selection.removeAttribute('disabled');
          }
        }
        if (name === 'sheet' && this._shadowDom && oldValue !== newValue) {
          this.handlerExternalCss();
        }
      }
    }
    customElements.define('r-select', Select);
    return Select;
  } else {
    return createCustomError('document is undefined or r-select is exist');
  }
}

export default Custom();
