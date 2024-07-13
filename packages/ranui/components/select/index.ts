import { addClassToElement, generateThrottle, isMobile, removeClassToElement } from 'ranuts/utils';
import { HTMLElementSSR, createCustomError, isDisabled } from '@/utils/index';
import '@/components/select/option';
import '@/components/dropdown';
import '@/components/select/dropdown-item';
import '@/components/icon';
import '@/components/input';
import type { Input } from '@/components/input';

interface Option {
  label: string | number;
  value: string | number;
}

interface PlacementDirection {
  [x: string]: Record<string, string>;
}

const placementDirection: PlacementDirection = {
  bottom: {
    add: 'ran-dropdown-down-in',
    remove: 'ran-dropdown-down-out',
  },
  top: {
    add: 'ran-dropdown-up-in',
    remove: 'ran-dropdown-up-out',
  },
};

const searchThrottle = generateThrottle();

const animationTime = 300;

export class Select extends (HTMLElementSSR()!) {
  removeTimeId?: NodeJS.Timeout;
  _slot: HTMLSlotElement;
  _shadowDom: ShadowRoot;
  _select: HTMLDivElement;
  _selection: HTMLDivElement;
  _search: Input;
  _icon: HTMLElement;
  _selectDropdown?: HTMLDivElement;
  _selectionDropdown?: HTMLElement;
  _selectDropDownInTimeId?: NodeJS.Timeout;
  _selectDropDownOutTimeId?: NodeJS.Timeout;
  _optionList: Option[];
  _optionLabelMapValue: Map<string, string>;
  _optionValueMapLabel: Map<string, string>;
  _activeOption?: HTMLElement;
  _text: HTMLSpanElement;
  _selector: HTMLDivElement;
  onSearch?: (this: HTMLElement, ev: Event) => unknown;
  static get observedAttributes(): string[] {
    return [
      'disabled',
      'sheet',
      'clear',
      'type',
      'defaultValue',
      'showSearch',
      'placement', // 弹窗的方向
      'getPopupContainerId', // 挂载的节点
      'dropdownclass', // 弹窗的类名
      'trigger', // 触发下拉框的行为，click 还是 hover，hover 在 isMobile 移动端无效
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
    this._search = document.createElement('r-input') as Input;
    this._search.setAttribute('class', 'selection-search');
    this._search.setAttribute('part', 'search');
    this._search.setAttribute('type', 'search');
    this._search.setAttribute('autocomplete', 'off');
    this._text = document.createElement('span');
    this._text.setAttribute('class', 'selection-item');
    this._text.setAttribute('part', 'selection-item');
    this._icon = document.createElement('ra-icon');
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
    this._shadowDom.appendChild(this._select);
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
  get getPopupContainerId(): string {
    return this.getAttribute('getPopupContainerId') || '';
  }
  set getPopupContainerId(value: string) {
    this.setAttribute('getPopupContainerId', value || '');
  }
  get dropdownclass(): string {
    return this.getAttribute('dropdownclass') || '';
  }
  set dropdownclass(value: string) {
    this.setAttribute('dropdownclass', value || '');
  }
  get trigger(): string {
    return this.getAttribute('trigger') || 'click';
  }
  set trigger(value: string) {
    this.setAttribute('trigger', value || '');
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
        console.error(`Failed to parse the rule in CSSStyleSheet: ${this.sheet}`);
      }
    }
  }
  /**
   * @description: 移除 select dropdown
   * @return {*}
   */
  setSelectDropdownDisplayNone = (): void => {
    if (this._selectDropDownOutTimeId) return;
    if (this._selectionDropdown && this._selectionDropdown.style.display !== 'none') {
      this._selectionDropdown.setAttribute('transit', placementDirection[this.placement].remove);
      this._selectDropDownOutTimeId = setTimeout(() => {
        this._selectionDropdown?.style.setProperty('display', 'none');
        this._selectionDropdown && this._selectionDropdown.removeAttribute('transit');
        clearTimeout(this._selectDropDownOutTimeId);
        this._selectDropDownOutTimeId = undefined;
      }, animationTime);
    }
  };
  /**
   * @description: 添加 select dropdown
   * @return {*}
   */
  setSelectDropdownDisplayBlock = (): void => {
    if (this._selectDropDownInTimeId) return;
    if (this._selectionDropdown && this._selectionDropdown.style.display !== 'block') {
      this._selectionDropdown.setAttribute('transit', placementDirection[this.placement].add);
      this._selectionDropdown?.style.setProperty('display', 'block');
      this._selectDropDownInTimeId = setTimeout(() => {
        this._selectionDropdown && this._selectionDropdown.removeAttribute('transit');
        clearTimeout(this._selectDropDownInTimeId);
        this._selectDropDownInTimeId = undefined;
      }, animationTime);
    }
  };
  placementPosition = (): void => {
    if (!this._selectionDropdown || !this._selectDropdown) return;
    const rect = this.getBoundingClientRect();
    const { top, left, bottom, width, height, x, y, right } = rect;
    const root = document.getElementById(this.getPopupContainerId);
    this._selectionDropdown.style.setProperty('position', `absolute`);
    this._selectionDropdown.style.setProperty('--ran-x', `${top + window.scrollX}`);
    this._selectionDropdown.style.setProperty('--ran-y', `${left + window.scrollY}`);
    let selectTop = bottom + window.scrollY;
    let selectLeft = left + window.scrollX;
    this._selectionDropdown.style.setProperty('width', `${width}px`);
    if (this.placement === 'top') {
      selectTop = top + window.scrollY - this._selectionDropdown.clientHeight;
    }
    if (this.getPopupContainerId && root) {
      const rootRect = root.getBoundingClientRect();
      selectLeft = left - rootRect.left;
      if (this.placement === 'top') {
        selectTop = top - root.getBoundingClientRect().top - this._selectionDropdown.clientHeight;
      } else {
        selectTop = root.getBoundingClientRect().height;
      }
    }
    this._selectionDropdown.style.setProperty('inset', `${selectTop}px auto auto ${selectLeft}px`);
  };
  /**
   * @description: 设置下拉框
   * @return {*}
   */
  selectMouseDown = (e: Event): void => {
    e.stopPropagation();
    if (isDisabled(this)) return;
    this.removeDropDownTimeId();
    this.setSelectDropdownDisplayNone();
    this.setSelectDropdownDisplayBlock();
    this.placementPosition();
  };
  removeDropDownTimeId = (): void => {
    this._search.setAttribute('value', '');
    if (this.trigger.includes('hover') && !isMobile()) {
      clearTimeout(this.removeTimeId);
      this.removeTimeId = undefined;
    }
  };
  /**
   * @description: 焦点移除的情况，需要移除 select 下拉框
   * @return {*}
   */
  selectBlur = (): void => {
    if (this.removeTimeId) {
      this.removeDropDownTimeId();
    }
    this.removeTimeId = setTimeout(() => {
      this.removeDropDownTimeId();
      this.setSelectDropdownDisplayNone();
    }, 100);
  };
  /**
   * @description: 选中一个选项的情况
   * @param {MouseEvent} e
   * @return {*}
   */
  clickOption = (e: MouseEvent): void => {
    e.stopPropagation();
    const element = e.target as Element;
    const label = element.innerHTML;
    const value = this._optionLabelMapValue.get(label);
    if (value) {
      this.setAttribute('value', value);
      this._text.innerHTML = label;
      this._text.setAttribute('title', label);
      this._search.setAttribute('placeholder', label);
    }
    const rect = this.getBoundingClientRect();
    const { height } = rect;
    this._text.style.setProperty('line-height', `${height}px`);
    if (this._activeOption) {
      this._activeOption.removeAttribute('active');
    }
    this._activeOption = element as HTMLElement;
    if (this._activeOption) {
      this._activeOption.setAttribute('active', value || '');
    }
    this.setSelectDropdownDisplayNone();
    // 点击后触发 onchange 事件
    this.dispatchEvent(new CustomEvent('change', { detail: { value, label } }));
    this.removeDropDownTimeId();
  };
  /**
   * @description: 初始化创建选项下拉框
   * @return {*}
   */
  createOption = (): void => {
    if (!this._selectDropdown) {
      const container = document.getElementById(this.getPopupContainerId) || document.body;
      this._selectDropdown = document.createElement('div');
      this._selectDropdown.style.setProperty('-webkit-tap-highlight-color', 'transparent');
      this._selectDropdown.style.setProperty('outline', '0');
      this._selectDropdown.addEventListener('click', this.clickOption);
      this._selectionDropdown = document.createElement('r-dropdown');
      if (this.dropdownclass) {
        this._selectionDropdown.setAttribute('class', this.dropdownclass);
      }
      if (this.trigger.includes('hover') && !isMobile()) {
        this._selectDropdown.addEventListener('mouseleave', this.selectBlur);
        this._selectDropdown.addEventListener('mouseenter', this.removeDropDownTimeId);
      }
      this._selectDropdown.appendChild(this._selectionDropdown);
      this._selectionDropdown.style.setProperty('display', 'none');
      container.appendChild(this._selectDropdown);
    }
  };
  /**
   * @description: 移除选项下拉框
   * @return {*}
   */
  removeSelectDropdown = (): void => {
    try {
      if (this._selectDropdown) {
        const container = document.getElementById(this.getPopupContainerId) || document.body;
        container.removeChild(this._selectDropdown);
      }
    } catch (error) {}
  };
  /**
   * @description: 当 select 中有 option 元素的时候，给 dropdown 添加元素
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
    this.createSelectDropdownContent(this._optionList);
  };
  createSelectDropdownContent = (options: Option[] = []): void => {
    if (options.length === 0) {
      this._selectDropdown?.style.setProperty('display', 'none');
    } else {
      this._selectDropdown?.style.setProperty('display', 'block');
    }
    options.forEach((item) => {
      if (this._selectionDropdown) {
        const { label, value } = item;
        const selectOptionItem = document.createElement('r-dropdown-item');
        const defaultValue = this.getAttribute('defaultValue') || this.getAttribute('value');
        if (defaultValue === value) {
          selectOptionItem.setAttribute('active', value);
          this._activeOption = selectOptionItem;
        } else {
          selectOptionItem.removeAttribute('active');
        }
        selectOptionItem.innerHTML = `${label}`;
        selectOptionItem.setAttribute('value', `${value}`);
        selectOptionItem.setAttribute('title', `${label}`);
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
  changeSearch = (e: Event): void => {
    const value = (e as CustomEvent).detail.value || '';
    this.dispatchEvent(
      new CustomEvent('search', {
        detail: { value },
      }),
    );
    if (this._selectionDropdown) {
      this._selectionDropdown.innerHTML = '';
    }
    if (value.length > 0) {
      const options = this._optionList
        .map((item) => {
          const { label } = item;
          if (`${label}`.toLowerCase().includes(value)) {
            return { label, value: item.value };
          }
          return undefined;
        })
        .filter((item) => item);
      this.createSelectDropdownContent(options as Option[]);
    } else {
      this.createSelectDropdownContent(this._optionList);
    }
  };
  setShowSearch = (): void => {
    this.onSearch = searchThrottle(this.changeSearch);
    this.onSearch && this._search.addEventListener('change', this.onSearch);
    this.onSearch && this._search.addEventListener('click', this.onSearch);
  };
  removeShowSearch = (): void => {
    this.onSearch && this._search.removeEventListener('change', this.onSearch);
    this.onSearch && this._search.removeEventListener('click', this.onSearch);
  };
  listenSlotChange = (): void => {
    this._slot.addEventListener('slotchange', this.addOptionToSlot);
  };
  removeListenSlotChange = (): void => {
    this._slot.removeEventListener('slotchange', this.addOptionToSlot);
  };
  listenActionEvent = (): void => {
    this.removeEventListener('mouseenter', this.selectMouseDown);
    this.removeEventListener('mouseleave', this.selectBlur);
    this.removeEventListener('click', this.selectMouseDown);
    this.removeEventListener('blur', this.selectBlur);
    if (this.trigger.includes('hover') && !isMobile()) {
      this.addEventListener('mouseenter', this.selectMouseDown);
      this.addEventListener('mouseleave', this.selectBlur);
    }
    if (this.trigger.includes('click')) {
      this.addEventListener('click', this.selectMouseDown);
      this.addEventListener('blur', this.selectBlur);
    }
  };
  clickRemoveSelect = (e: Event): void => {
    e.stopPropagation();
    this.setSelectDropdownDisplayNone();
  };
  connectedCallback(): void {
    this.handlerExternalCss();
    this.createOption();
    this.listenActionEvent();
    this.listenSlotChange();
    this.setShowSearch();
    document.addEventListener('click', this.clickRemoveSelect);
  }
  disconnectCallback(): void {
    this.removeEventListener('mouseenter', this.selectMouseDown);
    this.removeEventListener('mouseleave', this.selectBlur);
    this.removeEventListener('click', this.selectMouseDown);
    this.removeEventListener('blur', this.selectBlur);
    this.removeSelectDropdown();
    this._selectDropdown?.removeEventListener('click', this.clickOption);
    this.removeListenSlotChange();
    document.removeEventListener('click', this.clickRemoveSelect);
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
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
