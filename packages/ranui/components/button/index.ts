import { currentDevice } from 'ranuts/utils';
import buttonCss from './index.less?inline';
import { Div, RanElement, Slot, falseList, isDisabled } from '@/utils/index';
import { Style, View } from '@/utils/builder';
import { adoptStyles } from '@/utils/style';

export class Button extends RanElement {
  _btn!: HTMLDivElement;
  _btnContent!: HTMLDivElement;
  _iconElement?: HTMLElement;
  _slot!: HTMLSlotElement;
  _shadowDom!: ShadowRoot;
  debounceTimeId?: NodeJS.Timeout;

  static get observedAttributes(): string[] {
    return ['disabled', 'icon', 'effect', 'iconSize', 'sheet'];
  }

  constructor() {
    super();
    // 🛡️ Rehydration safe: check if shadowRoot already exists (e.g. from DSD)
    this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(this._shadowDom, buttonCss);

    // 🏗️ Surgical rehydration: check if content already exists to avoid nuking styles
    let btn = this._shadowDom.querySelector<HTMLDivElement>('.ran-btn');
    if (!btn) {
      btn = Div()
        .class('ran-btn')
        .attr('part', 'button')
        .role('button')
        .tabIndex(0)
        .children(Div().class('ran-btn-content').attr('part', 'content').children(Slot().class('slot')))
        .build();
      this._shadowDom.appendChild(btn);
    }
    this._btn = btn;
    this._btnContent = btn.querySelector<HTMLDivElement>('.ran-btn-content')!;
    this._slot = btn.querySelector<HTMLSlotElement>('slot')!;

    // 🖱️ Bind events manually to support Rehydration (SSR/DSD)
    this._btn.addEventListener('mousedown', this.mousedown);
    this._btn.addEventListener('mouseup', this.mouseup);
    this._btn.addEventListener('keydown', this.keydown);
  }

  // ── Properties ─────────────────────────────────────────────────────────────

  get sheet(): string {
    return this.getAttribute('sheet') || '';
  }
  set sheet(value: string) {
    this.setAttribute('sheet', value || '');
    this.handlerExternalCss();
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

  // ── Methods ────────────────────────────────────────────────────────────────

  /**
   * @description: 设置 button 的 icon
   */
  setIcon = (): void => {
    // Only proceed in browser and if icon exists
    if (typeof document === 'undefined' || !this._slot) return;
    const iconName = this.icon;
    if (!iconName) {
      if (this._iconElement) {
        this._iconElement.remove();
        this._iconElement = undefined;
      }
      return;
    }

    if (this._iconElement) {
      this._iconElement.setAttribute('name', iconName);
    } else {
      // 🏗️ Check if icon already exists (Hydration)
      let icon = this._shadowDom.querySelector<HTMLElement>('r-icon');
      if (!icon) {
        icon = View('r-icon').attr('color', 'currentColor').class('icon').build() as HTMLElement;
        this._slot.insertAdjacentElement('beforebegin', icon);
      }
      this._iconElement = icon;
      this._iconElement.setAttribute('name', iconName);
    }

    const { width, height } = this._slot.getBoundingClientRect();
    const size = Math.min(width, height) || 16;
    const finalSize = this.iconSize || `${size > 5 ? size - 5 : size}`;
    this._iconElement.setAttribute('size', String(finalSize));
  };

  mousedown = (event: MouseEvent): void => {
    if (currentDevice() !== 'pc') return;
    if (!this.disabled) {
      this.debounceMouseEvent();
      const { left, top } = this.getBoundingClientRect();
      this._btn.style.setProperty('--ran-x', `${event.clientX - left}px`);
      this._btn.style.setProperty('--ran-y', `${event.clientY - top}px`);
    }
  };

  mouseup = (): void => {
    if (currentDevice() !== 'pc') return;
    if (this.debounceTimeId) return;
    this.debounceTimeId = setTimeout(() => {
      this._btn.style.removeProperty('--ran-x');
      this._btn.style.removeProperty('--ran-y');
      this.debounceMouseEvent();
    }, 600);
  };

  keydown = (event: KeyboardEvent): void => {
    if (isDisabled(this)) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  };

  debounceMouseEvent = (): void => {
    if (this.debounceTimeId) {
      clearTimeout(this.debounceTimeId);
      this.debounceTimeId = undefined;
    }
  };

  handlerExternalCss = (): void => {
    if (this.sheet && this._shadowDom) {
      // 🛡️ Fix: DON'T overwrite, append to existing sheets to keep base styles
      // In JS DOM environments, adoptedStyleSheets is frozen readonly array
      const canAdopt = this._shadowDom.adoptedStyleSheets && !Object.isFrozen(this._shadowDom.adoptedStyleSheets);

      if (canAdopt) {
        try {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(this.sheet);
          const currentSheets = this._shadowDom.adoptedStyleSheets || [];
          this._shadowDom.adoptedStyleSheets = [...currentSheets, sheet];
        } catch {
          // Fallback if replaceSync is unsupported
          const style = Style().text(this.sheet).build();
          this._shadowDom.appendChild(style);
        }
      } else {
        // Fallback for jsdom and browsers that don't support adoptedStyleSheets properly
        const style = Style().text(this.sheet).build();
        this._shadowDom.appendChild(style);
      }
    }
  };

  syncA11yState = (): void => {
    const disabled = isDisabled(this);
    this._btn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this._btn.tabIndex = disabled ? -1 : 0;
    if (disabled) {
      this.setAttribute('aria-disabled', 'true');
      this._btnContent.setAttribute('disabled', 'true');
    } else {
      this.removeAttribute('aria-disabled');
      this._btnContent.removeAttribute('disabled');
    }
  };

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  connectedCallback(): void {
    this.handlerExternalCss();
    this.setIcon();
    this.syncA11yState();
  }

  /**
   * @description: FIX: 修正拼写错误 disconnectCallback -> disconnectedCallback
   * 确保组件销毁时正确移除事件监听，彻底杜绝内存泄漏。
   */
  disconnectedCallback(): void {
    this.debounceMouseEvent();
    if (this._btn) {
      this._btn.removeEventListener('mousedown', this.mousedown);
      this._btn.removeEventListener('mouseup', this.mouseup);
      this._btn.removeEventListener('keydown', this.keydown);
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    if (name === 'disabled' && this._btnContent) this.syncA11yState();
    if (name === 'icon' || name === 'iconSize') this.setIcon();
    if (name === 'sheet') this.handlerExternalCss();
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-button')) {
    customElements.define('r-button', Button);
    return Button;
  }
  return Button;
}

export default Custom();
