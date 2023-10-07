import {
  createCustomError,
  falseList,
  isDisabled,
  presentDevice,
} from '@/utils/index';

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-button')) {
    class Button extends HTMLElement {
      _container: HTMLDivElement;
      _btn: HTMLDivElement;
      _iconElement?: HTMLElement;
      _slot: HTMLSlotElement;
      _shadowDom: ShadowRoot;
      debounceTimeId?: NodeJS.Timeout;
      static get observedAttributes() {
        return ['disabled', 'icon', 'effect', 'iconSize', 'sheet'];
      }
      constructor() {
        super();
        this._slot = document.createElement('slot');
        this._btn = document.createElement('div');
        this._container = document.createElement('div');
        this._container.setAttribute('class', 'container');
        this._btn.setAttribute('class', 'btn');
        this._btn.appendChild(this._slot);
        this._slot.setAttribute('class', 'slot');
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        this._shadowDom = shadowRoot;
        this._container.appendChild(this._btn);
        shadowRoot.appendChild(this._container);
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
      get iconSize() {
        return this.getAttribute('iconSize');
      }
      set iconSize(value: string | undefined | null) {
        if (!value || value === 'false') {
          this.removeAttribute('iconSize');
        } else {
          this.setAttribute('iconSize', value);
          this.setIcon();
        }
      }
      get icon() {
        return this.getAttribute('icon');
      }
      set icon(value: string | null) {
        if (!value || value === 'false') {
          this.removeAttribute('icon');
        } else {
          this.setAttribute('icon', value);
          this.setIcon();
        }
      }
      get effect() {
        return this.getAttribute('effect');
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
      setIcon = () => {
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
      mousedown = (event: MouseEvent) => {
        if (presentDevice !== 'pc') return;
        if (!this.disabled || this.disabled === 'false') {
          this.debounceMouseEvent();
          const { left, top } = this.getBoundingClientRect();
          this._container.style.setProperty(
            '--ran-x',
            event.clientX - left + 'px',
          );
          this._container.style.setProperty(
            '--ran-y',
            event.clientY - top + 'px',
          );
        }
      };
      mouseup = (event: MouseEvent) => {
        if (presentDevice !== 'pc') return;
        if (this.debounceTimeId) return;
        this.debounceTimeId = setTimeout(() => {
          this._container.style.removeProperty('--ran-x');
          this._container.style.removeProperty('--ran-y');
          this.debounceMouseEvent();
        }, 600);
      };
      debounceMouseEvent = () => {
        clearTimeout(this.debounceTimeId);
        this.debounceTimeId = undefined;
      };
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
      connectedCallback() {
        this._container.addEventListener('mousedown', this.mousedown);
        this._container.addEventListener('mouseup', this.mouseup);
        this.handlerExternalCss();
        this.setIcon();
      }
      disconnectCallback() {
        this._container.removeEventListener('mousedown', this.mousedown);
        this._container.removeEventListener('mouseup', this.mouseup);
      }
      attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
      ) {
        if (name === 'disabled' && this._btn) {
          if (!newValue || newValue === 'false') {
            this._btn.setAttribute('disabled', '');
          } else {
            this._btn.removeAttribute('disabled');
          }
        }
        if (name === 'icon' && this._btn && oldValue !== newValue)
          this.setIcon();
        if (name === 'iconSize' && this._btn && oldValue !== newValue)
          this._btn.setAttribute('iconSize', newValue);
        if (name === 'sheet' && this._shadowDom && oldValue !== newValue)
          this.handlerExternalCss();
      }
    }
    customElements.define('r-button', Button);
    return Button;
  } else {
    return createCustomError('document is undefined or r-button is exist');
  }
}

export default Custom();
