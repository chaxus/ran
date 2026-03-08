import modalCss from './index.less?inline';
import { RanElement, createCustomError, falseList } from '@/utils/index';
import { Div, Slot, View } from '@/utils/builder';
import { adoptSheetText, adoptStyles } from '@/utils/style';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export type ModalCloseTrigger = 'mask' | 'button' | 'escape' | 'program';
export type ModalProgrammaticAction = 'confirm' | 'cancel' | 'dismiss';

export interface ModalProgrammaticOptions {
  title?: string;
  content?: string | Node;
  okText?: string;
  cancelText?: string;
  showCancel?: boolean;
  maskClosable?: boolean;
  closeOnEsc?: boolean;
  lockScroll?: boolean;
  autoFocus?: boolean;
  closable?: boolean;
  onConfirm?: () => boolean | void | Promise<boolean | void>;
  onCancel?: () => boolean | void | Promise<boolean | void>;
}

export interface ModalProgrammaticResult {
  action: ModalProgrammaticAction;
  trigger: ModalCloseTrigger;
}

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
  _footer: HTMLElement;
  _footerSlot: HTMLSlotElement;
  _labelId: string;
  _previousActiveElement: Element | null;
  _isDialogOpen: boolean;
  _scrollLocked: boolean;
  _afterOpenTimer: number | null;
  _afterCloseTimer: number | null;

  static get observedAttributes(): string[] {
    return ['open', 'title', 'maskClosable', 'closeOnEsc', 'lockScroll', 'autoFocus', 'closable', 'sheet'];
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
              View('footer').class('ran-modal-footer').part('footer').children(Slot().attr('name', 'footer')),
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
    this._footer = this._root.querySelector('.ran-modal-footer') as HTMLElement;
    this._footerSlot = this._root.querySelector('slot[name="footer"]') as HTMLSlotElement;
    this.syncTitle();
    this.syncClosable();
    this.syncFooter();
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

  get closable(): boolean {
    const value = this.getAttribute('closable');
    return !(value === 'false' || value === '0');
  }
  set closable(value: boolean | string | null | undefined) {
    if (!value || value === 'false' || value === '0') {
      this.setAttribute('closable', 'false');
    } else {
      this.setAttribute('closable', 'true');
    }
  }

  handlerExternalCss = (): void => {
    if (!this.sheet) return;
    adoptSheetText(this._shadowDom, this.sheet);
  };

  syncTitle = (): void => {
    this._title.textContent = this.title || 'Modal';
  };

  syncClosable = (): void => {
    const isClosable = this.closable;
    this._closeBtn.hidden = !isClosable;
    this._closeBtn.setAttribute('aria-hidden', isClosable ? 'false' : 'true');
    this._closeBtn.tabIndex = isClosable ? 0 : -1;
  };

  syncFooter = (): void => {
    const assignedNodes = this._footerSlot?.assignedNodes({ flatten: true }) || [];
    const hasFooter = assignedNodes.some((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE) return (node.textContent || '').trim().length > 0;
      return false;
    });
    this._root.classList.toggle('has-footer', hasFooter);
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
    const openModalHosts = Modal._openStack.map((item) => item as HTMLElement);
    const bodyChildren = Array.from(body.children) as HTMLElement[];

    bodyChildren.forEach((child) => {
      // Keep the full ancestor branch interactive for every open modal host.
      const containsOpenModal = openModalHosts.some((host) => child === host || child.contains(host));
      if (containsOpenModal) return;
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

  emitAfterClose = (trigger: ModalCloseTrigger): void => {
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

  close = (trigger: ModalCloseTrigger = 'program'): void => {
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
    const inDialog = (event.composedPath() as EventTarget[]).includes(this._dialog);
    if (!inDialog) {
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
    this._footerSlot.addEventListener('slotchange', this.syncFooter);
    this.syncTitle();
    this.syncClosable();
    this.syncFooter();
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
    this._footerSlot.removeEventListener('slotchange', this.syncFooter);
    this.clearAfterTimers();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    if (name === 'title') {
      this.syncTitle();
      return;
    }
    if (name === 'closable') {
      this.syncClosable();
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

  static normalizeProgrammaticOptions = (options?: ModalProgrammaticOptions | string): ModalProgrammaticOptions => {
    if (typeof options === 'string') {
      return { content: options };
    }
    return options || {};
  };

  static open = (options?: ModalProgrammaticOptions | string): Promise<ModalProgrammaticResult> => {
    if (typeof document === 'undefined') {
      return Promise.resolve({ action: 'dismiss', trigger: 'program' });
    }

    const resolved = Modal.normalizeProgrammaticOptions(options);
    const {
      title = 'Confirm',
      content = '',
      okText = 'OK',
      cancelText = 'Cancel',
      showCancel = false,
      maskClosable = false,
      closeOnEsc = true,
      lockScroll = true,
      autoFocus = true,
      closable = true,
      onConfirm,
      onCancel,
    } = resolved;

    return new Promise((resolve) => {
      const modal = document.createElement('r-modal') as Modal;
      modal.title = title;
      modal.maskClosable = maskClosable;
      modal.closeOnEsc = closeOnEsc;
      modal.lockScroll = lockScroll;
      modal.autoFocus = autoFocus;
      modal.closable = closable;

      const body = document.createElement('div');
      if (typeof content === 'string') {
        body.textContent = content;
      } else if (content instanceof Node) {
        body.appendChild(content);
      }
      modal.appendChild(body);

      const footer = document.createElement('div');
      footer.setAttribute('slot', 'footer');
      footer.className = 'ran-modal-actions';

      let action: ModalProgrammaticAction = 'dismiss';

      if (showCancel) {
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'ran-modal-action ran-modal-action-cancel';
        cancelButton.textContent = cancelText;
        cancelButton.addEventListener('click', async () => {
          const shouldContinue = (await onCancel?.()) !== false;
          if (!shouldContinue) return;
          action = 'cancel';
          modal.close('program');
        });
        footer.appendChild(cancelButton);
      }

      const okButton = document.createElement('button');
      okButton.type = 'button';
      okButton.className = 'ran-modal-action ran-modal-action-confirm';
      okButton.textContent = okText;
      okButton.addEventListener('click', async () => {
        okButton.disabled = true;
        try {
          const shouldContinue = (await onConfirm?.()) !== false;
          if (!shouldContinue) return;
          action = 'confirm';
          modal.close('program');
        } finally {
          okButton.disabled = false;
        }
      });
      footer.appendChild(okButton);

      modal.appendChild(footer);

      const onAfterClose = (event: Event) => {
        const trigger = ((event as CustomEvent).detail?.trigger || 'program') as ModalCloseTrigger;
        modal.removeEventListener('afterclose', onAfterClose);
        if (modal.parentElement) {
          modal.parentElement.removeChild(modal);
        }
        resolve({ action, trigger });
      };

      modal.addEventListener('afterclose', onAfterClose);
      document.body.appendChild(modal);
      modal.open = true;
    });
  };

  static confirm = (options?: ModalProgrammaticOptions | string): Promise<ModalProgrammaticResult> => {
    const resolved = Modal.normalizeProgrammaticOptions(options);
    return Modal.open({ ...resolved, showCancel: true });
  };

  static info = (options?: ModalProgrammaticOptions | string): Promise<ModalProgrammaticResult> => {
    const resolved = Modal.normalizeProgrammaticOptions(options);
    return Modal.open({ ...resolved, showCancel: false, title: resolved.title || 'Info' });
  };

  static success = (options?: ModalProgrammaticOptions | string): Promise<ModalProgrammaticResult> => {
    const resolved = Modal.normalizeProgrammaticOptions(options);
    return Modal.open({ ...resolved, showCancel: false, title: resolved.title || 'Success' });
  };

  static warning = (options?: ModalProgrammaticOptions | string): Promise<ModalProgrammaticResult> => {
    const resolved = Modal.normalizeProgrammaticOptions(options);
    return Modal.open({ ...resolved, showCancel: false, title: resolved.title || 'Warning' });
  };

  static error = (options?: ModalProgrammaticOptions | string): Promise<ModalProgrammaticResult> => {
    const resolved = Modal.normalizeProgrammaticOptions(options);
    return Modal.open({ ...resolved, showCancel: false, title: resolved.title || 'Error' });
  };
}

function Custom() {
  if (typeof window !== 'undefined' && !customElements.get('r-modal')) {
    customElements.define('r-modal', Modal);
    return Modal;
  }
  return createCustomError('document is undefined or r-modal is exist');
}

export default Custom();
