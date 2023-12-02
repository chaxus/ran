import { addClassToElement, removeClassToElement } from 'ranuts';
import { createCustomError, isDisabled } from '@/utils/index';
import '@/components/option';
import '@/components/icon';
import '@/components/input';

interface Option {
  label: string | number;
  value: string | number;
}

interface PlacementDirection {
  [x: string]: Record<string, string>;
}

const placementDirection: PlacementDirection = {
  bottom: {
    add: 'ran-select-dropdown-down-in',
    remove: 'ran-select-dropdown-down-out',
  },
  top: {
    add: 'ran-select-dropdown-up-in',
    remove: 'ran-select-dropdown-up-out',
  },
};

export class Select extends HTMLElement {
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
  static get observedAttributes(): string[] {
    return [
      'disabled',
      'sheet',
      'clear',
      'type',
      'defaultValue',
      'showSearch',
      'placement', // 弹窗的方向
      // 'getPopupContainer' // 挂载的节点
      'dropdownclass' // 弹窗的类名
    ];
  }
  constructor() {
    super();
    this._slot = document.createElement('slot');
    this._select = document.createElement('div');
    this._select.setAttribute('class', 'ran-select');
    this._select.setAttribute('part', 'select');
    this._selection = document.createElement('div');
    this._selection.setAttribute('class', 'selection');
    this._selection.setAttribute('part', 'selection');
    this._selector = document.createElement('div');
    this._search = document.createElement('r-input');
    this._search.setAttribute('class', 'selection-search');
    this._search.setAttribute('part', 'search');
    this._search.setAttribute('type', 'search');
    this._search.setAttribute('autocomplete', 'off');
    this._text = document.createElement('span');
    this._text.setAttribute('class', 'selection-item');
    this._text.setAttribute('part', 'selection-item');
    this._icon = document.createElement('r-icon');
    this._icon.setAttribute('class', 'icon');
    this._icon.setAttribute('part', 'icon');
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
  get defaultValue(): string {
    return this.getAttribute('defaultValue') || '';
  }
  set defaultValue(value: string) {
    this.setAttribute('defaultValue', value || '');
  }
  get showSearch(): string {
    return this.getAttribute('showSearch') || '';
  }
  set showSearch(value: string) {
    this.setAttribute('showSearch', value || '');
  }
  get type(): string {
    return this.getAttribute('type') || '';
  }
  set type(value: string) {
    this.setAttribute('type', value || '');
  }
  get placement(): string {
    return this.getAttribute('placement') || 'bottom';
  }
  set placement(value: string) {
    this.setAttribute('placement', value || '');
  }
  get sheet(): string {
    return this.getAttribute('sheet') || '';
  }
  set sheet(value: string) {
    this.setAttribute('sheet', value || '');
  }
  get dropdownclass(): string {
    return this.getAttribute('dropdownclass') || ""
  }
  set dropdownclass(value: string) {
    this.setAttribute('dropdownclass', value || '');
  }
  get disabled(): boolean {
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
  handlerExternalCss(): void {
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
  setSelectDropdownDisplayNone = (): void => {
    if (this._selectDropDownOutTimeId) return;
    if (
      this._selectionDropdown &&
      this._selectionDropdown.style.display !== 'none'
    ) {
      addClassToElement(
        this._selectionDropdown,
        placementDirection[this.placement].remove,
      );
      this._selectDropDownOutTimeId = setTimeout(() => {
        this._selectionDropdown?.style.setProperty('display', 'none');
        this._selectionDropdown &&
          removeClassToElement(
            this._selectionDropdown,
            placementDirection[this.placement].remove,
          );
        clearTimeout(this._selectDropDownOutTimeId);
        this._selectDropDownOutTimeId = undefined;
      }, 300);
    }
  };
  /**
   * @description: 添加 select dropdown
   * @return {*}
   */
  setSelectDropdownDisplayBlock = (): void => {
    if (this._selectDropDownInTimeId) return;
    if (this._selectionDropdown && this._selectionDropdown.style.display !== 'block') {
      addClassToElement(this._selectionDropdown, placementDirection[this.placement].add,);
      this._selectionDropdown?.style.setProperty('display', 'block');
      this._selectDropDownInTimeId = setTimeout(() => {
        this._selectionDropdown && removeClassToElement(this._selectionDropdown, placementDirection[this.placement].add);
        clearTimeout(this._selectDropDownInTimeId);
        this._selectDropDownInTimeId = undefined;
      }, 200);
    }
  };
  placementPosition = (): void => {
    if (!this._selectionDropdown || !this._selectDropdown) return;
    const rect = this.getBoundingClientRect();
    const { top, left, bottom, width, height, x, y } = rect;
    // this._text.style.setProperty(
    //   'line-height',
    //   `${Math.max(height - 2, 0)}px`,
    // );
    this._selectionDropdown.style.setProperty(
      '-ran-x',
      `${x + window.scrollX}`,
    );
    this._selectionDropdown.style.setProperty(
      '-ran-y',
      `${y + window.scrollY}`,
    );
    this._selectionDropdown.style.setProperty('width', `${width}px`);
    if (this.placement === 'top') {
      this._selectionDropdown.style.setProperty(
        'inset',
        `${top + window.scrollY - this._selectionDropdown.clientHeight
        }px auto auto ${left + window.scrollX}px`,
      );
    } else {
      this._selectionDropdown.style.setProperty(
        'inset',
        `${bottom + window.scrollY}px auto auto ${left + window.scrollX}px`,
      );
    }
  };
  /**
   * @description: 设置下拉框
   * @return {*}
   */
  selectMouseDown = (): void => {
    if (isDisabled(this)) return;
    this.setSelectDropdownDisplayNone();
    this.setSelectDropdownDisplayBlock();
    this.placementPosition();
  };
  /**
   * @description: 焦点移除的情况，需要移除select 下拉框
   * @return {*}
   */
  selectBlur = (): void => {
    this.setSelectDropdownDisplayNone();
  };
  /**
   * @description: 选中一个选项的情况
   * @param {MouseEvent} e
   * @return {*}
   */
  clickOption = (e: MouseEvent): void => {
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
  createOption = (): void => {
    if (!this._selectDropdown) {
      this._selectDropdown = document.createElement('div');
      this._selectDropdown.addEventListener('click', this.clickOption);
      this._selectionDropdown = document.createElement('div');
      if (this.dropdownclass) {
        this._selectionDropdown.setAttribute('class', `${this.dropdownclass} ranui-select-dropdown`);
      } else {
        this._selectionDropdown.setAttribute('class', 'ranui-select-dropdown');
      }
      this._selectDropdown.appendChild(this._selectionDropdown);
      this._selectionDropdown.style.setProperty('display', 'none');
      document.body.appendChild(this._selectDropdown);
    }
  };
  /**
   * @description: 移除选项下拉框
   * @return {*}
   */
  removeSelectDropdown = (): void => {
    try {
      if (this._selectDropdown) {
        document.body.removeChild(this._selectDropdown);
      }
    } catch (error) { }
  };
  /**
   * @description: 当select中有option元素的时候，给dropdown添加元素
   * @return {*}
   */
  addOptionToSlot = (): void => {
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
        const defaultValue = this.getAttribute('defaultValue') || this.getAttribute('value');
        if (defaultValue === value) {
          selectOptionItem.setAttribute(
            'class',
            'ranui-select-dropdown-option-active ranui-select-dropdown-option-item',
          );
          this._activeOption = selectOptionItem
        } else {
          selectOptionItem.setAttribute(
            'class',
            'ranui-select-dropdown-option-item',
          );
        }
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
  setDefaultValue = (): void => {
    const defaultValue = this.getAttribute('defaultValue') || this.getAttribute('value');
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
  changeSearch = (e: Event):void => {
    console.log('e', e);
  };
  setShowSearch = ():void => {
    this._search.addEventListener('change', this.changeSearch);
  };
  listenSlotChange = ():void => {
    this._slot.addEventListener('slotchange', this.addOptionToSlot);
  };
  removeListenSlotChange = ():void => {
    this._slot.removeEventListener('slotchange', this.addOptionToSlot);
  };
  connectedCallback():void {
    this.handlerExternalCss();
    this.createOption();
    this.addEventListener('mousedown', this.selectMouseDown);
    this.addEventListener('blur', this.selectBlur);
    this.listenSlotChange();
    this.setShowSearch();
  }
  disconnectCallback():void {
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
  ):void {
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

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-select')) {

    customElements.define('r-select', Select);
    return Select;
  } else {
    return createCustomError('document is undefined or r-select is exist');
  }
}

export default Custom();
