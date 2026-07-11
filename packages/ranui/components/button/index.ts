import { currentDevice } from 'ranuts/utils';
import buttonCss from './index.less?inline';
import { Div, RanElement, Slot, falseList, isDisabled } from '@/utils/index';
import { EventManager, View } from '@/utils/builder';
import { defineSSR } from '@/utils/ssr-registry';
import { ensureShadowElement, ensureShadowRoot, syncSheetAttribute } from '@/utils/component';

export class Button extends RanElement {
  _btn!: HTMLDivElement;
  _btnContent!: HTMLDivElement;
  _iconElement?: HTMLElement;
  _slot!: HTMLSlotElement;
  _shadowDom!: ShadowRoot;
  _events = new EventManager();
  debounceTimeId?: NodeJS.Timeout;

  static get observedAttributes(): string[] {
    return ['disabled', 'icon', 'effect', 'iconSize', 'type', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, buttonCss);

    const btn = ensureShadowElement(this._shadowDom, '.ran-btn', () =>
      Div()
        .class('ran-btn')
        .attr('part', 'button')
        .role('button')
        .tabIndex(0)
        .children(Div().class('ran-btn-content').attr('part', 'content').children(Slot().class('slot')))
        .build(),
    );
    this._btn = btn;
    this._btnContent = btn.querySelector<HTMLDivElement>('.ran-btn-content')!;
    this._slot = btn.querySelector<HTMLSlotElement>('slot')!;
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

  /** Visual variant: `''` (default) | `'primary'` | `'contrast'` | `'warning'` | `'text'`. Drives the `:host([type=...])` styles. */
  get type(): string {
    return this.getAttribute('type') || '';
  }
  set type(value: string | null) {
    if (!value) {
      this.removeAttribute('type');
    } else {
      this.setAttribute('type', value);
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
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
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
    this._events
      .on(this._btn, 'mousedown', this.mousedown)
      .on(this._btn, 'mouseup', this.mouseup)
      .on(this._btn, 'keydown', this.keydown);
  }

  /**
   * @description: FIX: 修正拼写错误 disconnectCallback -> disconnectedCallback
   * 确保组件销毁时正确移除事件监听，彻底杜绝内存泄漏。
   */
  disconnectedCallback(): void {
    this.debounceMouseEvent();
    this._events.abort();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    if (name === 'disabled' && this._btnContent) this.syncA11yState();
    if (name === 'icon' || name === 'iconSize') this.setIcon();
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-button', Button as unknown as new () => HTMLElement);
export default Button;
