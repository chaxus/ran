import modalCss from './index.less?inline';
import { RanElement, createCustomError, falseList } from '@/utils/index';
import { Div, Slot, View } from '@/utils/builder';
import { adoptSheetText, adoptStyles } from '@/utils/style';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export class Modal extends RanElement {
  static _openStack: Modal[] = [];
  static _bodyScrollLockCount = 0;
  static _bodyOverflow = '';
  static _bodyPaddingRight = '';
  static _inertSnapshot = new Map<HTMLElement, { inert: boolean; ariaHidden: string | null }>();

  _shadowDom: ShadowRoot;
  _root: HTMLDivElement;
  _mask: HTMLDivElement;
  _dialog: HTMLDivElement;
  _title: HTMLHeadingElement;
  _closeBtn: HTMLButtonElement;
  _slot: HTMLSlotElement;
  _labelId: string;
  _previousActiveElement: Element | null;
  _isDialogOpen: boolean;
  _scrollLocked: boolean;
  _afterOpenTimer: number | null;
  _afterCloseTimer: number | null;

  static get observedAttributes(): string[] {
    return ['open', 'title', 'maskClosable', 'closeOnEsc', 'lockScroll', 'autoFocus', 'sheet'];
  }

  constructor() {
    super();
    this._labelId = `ran-modal-title-${Math.random().toString(36).slice(2, 9)}`;
    this._previousActiveElement = null;
    this._isDialogOpen = false;
    this._scrollLocked = false;
    this._afterOpenTimer = null;
    this._afterCloseTimer = null;
    this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(this._shadowDom, modalCss);

    let root = this._shadowDom.querySelector('.ran-modal-root') as HTMLDivElement | null;
    if (!root) {
      root = Div()
        .class('ran-modal-root')
        .part('root')
        .children(
          Div().class('ran-modal-mask').part('mask'),
          Div()
            .class('ran-modal-dialog')
            .part('dialog')
            .role('dialog')
            .attr('aria-modal', 'true')
            .tabIndex(-1)
            .labelledBy(this._labelId)
            .children(
              View('header')
                .class('ran-modal-header')
                .part('header')
                .children(
                  View('h3').class('ran-modal-title').part('title').id(this._labelId),
                  View('button')
                    .class('ran-modal-close')
                    .part('close')
                    .attr('type', 'button')
                    .label('Close dialog')
                    .text('x'),
                ),
              Div().class('ran-modal-body').part('body').children(Slot()),
            ),
        )
        .build() as HTMLDivElement;

      this._shadowDom.appendChild(root);
    }

    this._root = root;
    this._mask = this._root.querySelector('.ran-modal-mask') as HTMLDivElement;
    this._dialog = this._root.querySelector('.ran-modal-dialog') as HTMLDivElement;
    this._title = this._root.querySelector('.ran-modal-title') as HTMLHeadingElement;
    this._closeBtn = this._root.querySelector('.ran-modal-close') as HTMLButtonElement;
    this._slot = this._root.querySelector('slot') as HTMLSlotElement;
    this.syncTitle();
  }

  get open(): boolean {
    return this.hasAttribute('open') && !falseList.includes(this.getAttribute('open'));
  }
  set open(value: boolean | string | null | undefined) {
    if (!value || value === 'false') {
      this.removeAttribute('open');
    } else {
      this.setAttribute('open', '');
    }
  }

  get title(): string {
    return this.getAttribute('title') || '';
  }
  set title(value: string) {
    this.setAttribute('title', value || '');
  }

  get maskClosable(): boolean {
    const value = this.getAttribute('maskClosable');
    return !(value === 'false' || value === '0');
  }
  set maskClosable(value: boolean | string | null | undefined) {
    if (!value || value === 'false' || value === '0') {
      this.setAttribute('maskClosable', 'false');
    } else {
      this.setAttribute('maskClosable', 'true');
    }
  }

  get sheet(): string {
    return this.getAttribute('sheet') || '';
  }

  set sheet(value: string) {
    this.setAttribute('sheet', value || '');
  }

  get closeOnEsc(): boolean {
    const value = this.getAttribute('closeOnEsc');
    return !(value === 'false' || value === '0');
  }
  set closeOnEsc(value: boolean | string | null | undefined) {
    if (!value || value === 'false' || value === '0') {
      this.setAttribute('closeOnEsc', 'false');
    } else {
      this.setAttribute('closeOnEsc', 'true');
    }
  }

  get lockScroll(): boolean {
    const value = this.getAttribute('lockScroll');
    return !(value === 'false' || value === '0');
  }
  set lockScroll(value: boolean | string | null | undefined) {
    if (!value || value === 'false' || value === '0') {
      this.setAttribute('lockScroll', 'false');
    } else {
      this.setAttribute('lockScroll', 'true');
    }
  }

  get autoFocus(): boolean {
    const value = this.getAttribute('autoFocus');
    return !(value === 'false' || value === '0');
  }
  set autoFocus(value: boolean | string | null | undefined) {
    if (!value || value === 'false' || value === '0') {
      this.setAttribute('autoFocus', 'false');
    } else {
      this.setAttribute('autoFocus', 'true');
    }
  }

  handlerExternalCss = (): void => {
    if (!this.sheet) return;
    adoptSheetText(this._shadowDom, this.sheet);
  };

  syncTitle = (): void => {
    this._title.textContent = this.title || 'Modal';
  };

  getFocusableElements = (): HTMLElement[] => {
    const dialogFocusable = Array.from(this._dialog.querySelectorAll(FOCUSABLE_SELECTOR)) as HTMLElement[];
    const slottedFocusable = Array.from(this.querySelectorAll(FOCUSABLE_SELECTOR)) as HTMLElement[];
    return [...dialogFocusable, ...slottedFocusable].filter((item) => {
      if (item.hasAttribute('disabled')) return false;
      const element = item as HTMLElement;
      return element.offsetParent !== null || element.getClientRects().length > 0;
    });
  };

  static getTopModal = (): Modal | null => {
    if (Modal._openStack.length === 0) return null;
    return Modal._openStack[Modal._openStack.length - 1] || null;
  };

  static pushOpenModal = (modal: Modal): void => {
    const exists = Modal._openStack.includes(modal);
    if (!exists) {
      Modal._openStack.push(modal);
    }
  };

  static removeOpenModal = (modal: Modal): void => {
    Modal._openStack = Modal._openStack.filter((item) => item !== modal);
  };

  static syncBackgroundInert = (): void => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (!body) return;

    for (const [element, snapshot] of Modal._inertSnapshot.entries()) {
      element.inert = snapshot.inert;
      if (snapshot.ariaHidden === null) {
        element.removeAttribute('aria-hidden');
      } else {
        element.setAttribute('aria-hidden', snapshot.ariaHidden);
      }
    }
    Modal._inertSnapshot.clear();

    if (Modal._openStack.length === 0) return;
    const openModalHosts = new Set(Modal._openStack);
    const bodyChildren = Array.from(body.children) as HTMLElement[];

    bodyChildren.forEach((child) => {
      if (openModalHosts.has(child)) return;
      Modal._inertSnapshot.set(child, {
        inert: child.inert,
        ariaHidden: child.getAttribute('aria-hidden'),
      });
      child.inert = true;
      child.setAttribute('aria-hidden', 'true');
    });
  };

  static lockBodyScroll = (): void => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (!body) return;
    if (Modal._bodyScrollLockCount === 0) {
      Modal._bodyOverflow = body.style.overflow;
      Modal._bodyPaddingRight = body.style.paddingRight;
      const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      if (scrollbarWidth > 0) {
        const computedPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
        body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
      }
      body.style.overflow = 'hidden';
    }
    Modal._bodyScrollLockCount += 1;
  };

  static unlockBodyScroll = (): void => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (!body || Modal._bodyScrollLockCount === 0) return;
    Modal._bodyScrollLockCount -= 1;
    if (Modal._bodyScrollLockCount === 0) {
      body.style.overflow = Modal._bodyOverflow;
      body.style.paddingRight = Modal._bodyPaddingRight;
    }
  };

  clearAfterTimers = (): void => {
    if (this._afterOpenTimer !== null) {
      window.clearTimeout(this._afterOpenTimer);
      this._afterOpenTimer = null;
    }
    if (this._afterCloseTimer !== null) {
      window.clearTimeout(this._afterCloseTimer);
      this._afterCloseTimer = null;
    }
  };

  getTransitionTimeout = (): number => {
    const style = window.getComputedStyle(this._dialog);
    const parseTime = (value: string): number => {
      const item = value.split(',')[0]?.trim() || '0s';
      if (item.endsWith('ms')) return Number.parseFloat(item);
      if (item.endsWith('s')) return Number.parseFloat(item) * 1000;
      return Number.parseFloat(item) || 0;
    };
    const delay = parseTime(style.transitionDelay);
    const duration = parseTime(style.transitionDuration);
    return Math.max(0, delay + duration);
  };

  emitAfterOpen = (): void => {
    const timeout = this.getTransitionTimeout();
    this._afterOpenTimer = window.setTimeout(() => {
      this._afterOpenTimer = null;
      this.dispatchEvent(new CustomEvent('afteropen'));
    }, timeout);
  };

  emitAfterClose = (trigger: 'mask' | 'button' | 'escape' | 'program'): void => {
    const timeout = this.getTransitionTimeout();
    this._afterCloseTimer = window.setTimeout(() => {
      this._afterCloseTimer = null;
      this.dispatchEvent(new CustomEvent('afterclose', { detail: { trigger } }));
    }, timeout);
  };

  trapFocus = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;
    const focusables = this.getFocusableElements();
    if (focusables.length === 0) {
      event.preventDefault();
      this._dialog.focus();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = (this._shadowDom.activeElement || document.activeElement) as HTMLElement | null;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  close = (trigger: 'mask' | 'button' | 'escape' | 'program' = 'program'): void => {
    if (!this.open) return;
    const beforeClose = new CustomEvent('beforeclose', {
      cancelable: true,
      detail: { trigger },
    });
    if (!this.dispatchEvent(beforeClose)) return;
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('close', { detail: { trigger } }));
    this.emitAfterClose(trigger);
  };

  openDialog = (): void => {
    if (this._isDialogOpen || this._root.hasAttribute('open')) return;
    const beforeOpen = new CustomEvent('beforeopen', { cancelable: true });
    if (!this.dispatchEvent(beforeOpen)) {
      this.removeAttribute('open');
      return;
    }
    this._previousActiveElement = document.activeElement;
    Modal.pushOpenModal(this);
    Modal.syncBackgroundInert();
    if (this.lockScroll) {
      Modal.lockBodyScroll();
      this._scrollLocked = true;
    }
    this._isDialogOpen = true;
    this._root.setAttribute('open', '');
    this._dialog.setAttribute('aria-hidden', 'false');
    this.dispatchEvent(new CustomEvent('open'));
    this.clearAfterTimers();
    this.emitAfterOpen();
    requestAnimationFrame(() => {
      if (!this.autoFocus) return;
      const focusables = this.getFocusableElements();
      (focusables[0] || this._dialog).focus();
    });
  };

  closeDialog = (): void => {
    if (!this._isDialogOpen) {
      this._root.removeAttribute('open');
      this._dialog.setAttribute('aria-hidden', 'true');
      return;
    }
    this._isDialogOpen = false;
    Modal.removeOpenModal(this);
    Modal.syncBackgroundInert();
    if (this._scrollLocked) {
      Modal.unlockBodyScroll();
      this._scrollLocked = false;
    }
    this._root.removeAttribute('open');
    this._dialog.setAttribute('aria-hidden', 'true');
    if (this._previousActiveElement instanceof HTMLElement) {
      this._previousActiveElement.focus();
    }
  };

  onMaskClick = (event: MouseEvent): void => {
    if (!this.maskClosable) return;
    if (event.target === this._mask) {
      this.close('mask');
    }
  };

  onCloseButtonClick = (): void => {
    this.close('button');
  };

  onKeydown = (event: KeyboardEvent): void => {
    if (!this.open) return;
    if (Modal.getTopModal() !== this) return;
    if (event.key === 'Escape' && this.closeOnEsc) {
      event.preventDefault();
      this.close('escape');
      return;
    }
    this.trapFocus(event);
  };

  onDocumentFocusIn = (event: FocusEvent): void => {
    if (!this.open) return;
    if (Modal.getTopModal() !== this) return;
    const path = event.composedPath();
    if (path.includes(this) || path.includes(this._dialog)) return;
    const focusables = this.getFocusableElements();
    (focusables[0] || this._dialog).focus();
  };

  connectedCallback(): void {
    this.handlerExternalCss();
    this._mask.addEventListener('click', this.onMaskClick);
    this._closeBtn.addEventListener('click', this.onCloseButtonClick);
    document.addEventListener('keydown', this.onKeydown);
    document.addEventListener('focusin', this.onDocumentFocusIn);
    this.syncTitle();
    if (this.open) {
      this.openDialog();
    } else {
      this.closeDialog();
    }
  }

  disconnectedCallback(): void {
    if (this._root.hasAttribute('open')) {
      this.closeDialog();
    }
    this._mask.removeEventListener('click', this.onMaskClick);
    this._closeBtn.removeEventListener('click', this.onCloseButtonClick);
    document.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('focusin', this.onDocumentFocusIn);
    this.clearAfterTimers();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === 'title') {
      this.syncTitle();
      return;
    }
    if (name === 'open') {
      if (this.open) {
        this.openDialog();
      } else {
        this.closeDialog();
      }
      return;
    }
    if (name === 'sheet') {
      this.handlerExternalCss();
    }
  }
}

function Custom() {
  if (typeof window !== 'undefined' && !customElements.get('r-modal')) {
    customElements.define('r-modal', Modal);
    return Modal;
  }
  return createCustomError('document is undefined or r-modal is exist');
}

export default Custom();
