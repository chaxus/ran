import { judgeDevice } from 'ranuts';
import { createCustomError, falseList, isDisabled } from '@/utils/index';

export class Button extends HTMLElement {
  _btn: HTMLDivElement;
  _btnContent: HTMLDivElement;
  _iconElement?: HTMLElement;
  _slot: HTMLSlotElement;
  _shadowDom: ShadowRoot;
  debounceTimeId?: NodeJS.Timeout;
  static get observedAttributes(): string[] {
    return ['disabled', 'icon', 'effect', 'iconSize', 'sheet'];
  }
  constructor() {
    super();
    this._slot = document.createElement('slot');
    this._btnContent = document.createElement('div');
    this._btn = document.createElement('div');
    this._btn.setAttribute('class', 'ran-btn');
    this._btn.setAttribute('part', 'ran-btn');
    this._btnContent.setAttribute('class', 'ran-btn-content');
    this._btnContent.setAttribute('part', 'ran-btn-content');
    this._btnContent.appendChild(this._slot);
    this._slot.setAttribute('class', 'slot');
    const shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowDom = shadowRoot;
    this._btn.appendChild(this._btnContent);
    shadowRoot.appendChild(this._btn);
  }
  get sheet(): string {
    return this.getAttribute('sheet') || '';
  }
  set sheet(value: string) {
    this.setAttribute('sheet', value || '');
  }
  get disabled(): boolean | string {
    return isDisabled(this);
  }
  set disabled(value: boolean | string | undefined | null) {
    if (!value || value === 'false') {
      this.removeAttribute('disabled');
      this.removeAttribute('aria-disabled');
    } else {
      this.setAttribute('disabled', '');
      this.setAttribute('aria-disabled', 'true');
    }
  }
  get iconSize(): string {
    return this.getAttribute('iconSize') || '';
  }
  set iconSize(value: string | undefined | null) {
    if (!value || value === 'false') {
      this.removeAttribute('iconSize');
    } else {
      this.setAttribute('iconSize', value);
      this.setIcon();
    }
  }
  get icon(): string {
    return this.getAttribute('icon') || '';
  }
  set icon(value: string | null) {
    if (!value || value === 'false') {
      this.removeAttribute('icon');
    } else {
      this.setAttribute('icon', value);
      this.setIcon();
    }
  }
  get effect(): string {
    return this.getAttribute('effect') || '';
  }
  set effect(value: string | null) {
    if (falseList.includes(value) || !value) {
      this.removeAttribute('effect');
    } else {
      this.setAttribute('effect', value);
    }
  }
  /**
   * @description: 设置button的icon
   * @return {*}
   */
  setIcon = (): void => {
    if (this.icon) {
      // 获取button的尺寸
      const { width, height } = this._slot.getBoundingClientRect();
      const size = Math.min(width, height);
      if (this._iconElement) {
        // 如果有_iconElement，只用设置name和size
        this._iconElement.setAttribute('name', this.icon);
      } else {
        // 创建icon，设置name,size,color
        this._iconElement = document.createElement('r-icon');
        this._iconElement.setAttribute('name', this.icon);
        this._iconElement.setAttribute('color', 'currentColor');
        this._iconElement.setAttribute('class', 'icon');
        // 添加到btn元素的首位
        this._slot.insertAdjacentElement('beforebegin', this._iconElement);
      }
      if (this.iconSize) {
        this._iconElement.setAttribute('size', this.iconSize);
      } else {
        this._iconElement.setAttribute('size', `${size - 5}`);
      }
    }
  };
  mousedown = (event: MouseEvent): void => {
    if (judgeDevice() !== 'pc') return;
    if (!this.disabled || this.disabled === 'false') {
      this.debounceMouseEvent();
      const { left, top } = this.getBoundingClientRect();
      this._btn.style.setProperty('--ran-x', event.clientX - left + 'px');
      this._btn.style.setProperty('--ran-y', event.clientY - top + 'px');
    }
  };
  mouseup = (event: MouseEvent): void => {
    if (judgeDevice() !== 'pc') return;
    if (this.debounceTimeId) return;
    this.debounceTimeId = setTimeout(() => {
      this._btn.style.removeProperty('--ran-x');
      this._btn.style.removeProperty('--ran-y');
      this.debounceMouseEvent();
    }, 600);
  };
  debounceMouseEvent = (): void => {
    clearTimeout(this.debounceTimeId);
    this.debounceTimeId = undefined;
  };
  handlerExternalCss = (): void => {
    if (this.sheet) {
      try {
        const sheet = new CSSStyleSheet();
        sheet.insertRule(this.sheet);
        this._shadowDom.adoptedStyleSheets = [sheet];
      } catch (error) {
        console.error(`Failed to parse the rule in CSSStyleSheet: ${this.sheet}`);
      }
    }
  };
  connectedCallback(): void {
    this._btn.addEventListener('mousedown', this.mousedown);
    this._btn.addEventListener('mouseup', this.mouseup);
    this.handlerExternalCss();
    this.setIcon();
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');
  }
  disconnectCallback(): void {
    this._btn.removeEventListener('mousedown', this.mousedown);
    this._btn.removeEventListener('mouseup', this.mouseup);
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'disabled' && this._btnContent) {
      if (!newValue || newValue === 'false') {
        this._btnContent.setAttribute('disabled', '');
      } else {
        this._btnContent.removeAttribute('disabled');
      }
    }
    if (name === 'icon' && this._btnContent && oldValue !== newValue) this.setIcon();
    if (name === 'iconSize' && this._btnContent && oldValue !== newValue)
      this._btnContent.setAttribute('iconSize', newValue);
    if (name === 'sheet' && this._shadowDom && oldValue !== newValue) this.handlerExternalCss();
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-button')) {
    customElements.define('r-button', Button);
    return Button;
  } else {
    return createCustomError('document is undefined or r-button is exist');
  }
}

export default Custom();
