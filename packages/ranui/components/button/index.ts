import { currentDevice } from 'ranuts/utils';
import buttonCss from './index.less?inline';
import { Div, RanElement, Slot, falseList, isDisabled } from '@/utils/index';
import { createRef, EventManager, View } from '@/utils/builder';
import { defineSSR } from '@/utils/ssr-registry';
import { mountShadowTree, ensureShadowRoot, shadowPart, syncSheetAttribute } from '@/utils/component';
import { isActivationKey } from '@/utils/a11y';

export class Button extends RanElement {
  _btn!: HTMLDivElement;
  _btnContent!: HTMLDivElement;
  _iconElement?: HTMLElement;
  _slot!: HTMLSlotElement;
  _shadowDom!: ShadowRoot;
  _events = new EventManager();
  debounceTimeId?: NodeJS.Timeout;

  static get observedAttributes(): string[] {
    return ['disabled', 'icon', 'effect', 'iconSize', 'type', 'aria-label', 'sheet'];
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, buttonCss);
    const btnContentRef = createRef<HTMLDivElement>();
    const slotRef = createRef<HTMLSlotElement>();

    const btn = mountShadowTree(this._shadowDom, () =>
      Div()
        .class('ran-btn')
        .attr('part', 'button')
        .role('button')
        .tabIndex(0)
        .children(
          Div()
            .class('ran-btn-content')
            .ref(btnContentRef)
            .attr('part', 'content')
            .children(Slot().ref(slotRef).class('slot')),
        )
        .build(),
    );
    this._btn = btn;
    this._btnContent = shadowPart(btnContentRef, 'content');
    this._slot = shadowPart(slotRef, 'slot');
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

  /** Visual variant: `''` (default) | `'primary'` (monochrome) | `'warning'` | `'text'`. Drives the `:host([type=...])` styles. */
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

    // Size relative to the button's own font-size, not the slotted content's
    // rendered box: a text line's own bounding height already sits close to
    // font-size, so subtracting further (the old `size - 5`) shrank the icon
    // well below the text it sits beside — and gave an inconsistent result
    // depending on what happened to be slotted. ~1.15x reads as visually
    // balanced next to the label (Vercel's Geist button icons use the same
    // ratio: 16px icon / 14px text) and works the same for icon-only buttons.
    const fontSize = Number.parseFloat(getComputedStyle(this._btnContent).fontSize) || 14;
    const finalSize = this.iconSize || `${Math.round(fontSize * 1.15)}`;
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
    if (isActivationKey(event)) {
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
    this.syncAriaLabel();
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

  /**
   * Copies the host's `aria-label` onto the element that actually carries the button role.
   *
   * The role lives on a div inside the shadow root, and an accessible name is normally
   * taken from the slotted content — which for an icon-only button is an `<r-icon>` with no
   * text. Without this there is no way to name such a button from outside, and DESIGN.md
   * requires every icon-only control to have one.
   */
  syncAriaLabel = (): void => {
    const label = this.getAttribute('aria-label');
    if (label === null) this._btn.removeAttribute('aria-label');
    else this._btn.setAttribute('aria-label', label);
  };

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    if (name === 'disabled' && this._btnContent) this.syncA11yState();
    if (name === 'aria-label') this.syncAriaLabel();
    if (name === 'icon' || name === 'iconSize') this.setIcon();
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-button', Button as unknown as new () => HTMLElement);
export default Button;
