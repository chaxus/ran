import modalCss from './index.less?inline';
import { RanElement, createCustomError, falseList } from '@/utils/index';
import { Div, Slot, View } from '@/utils/builder';
import { adoptSheetText, adoptStyles } from '@/utils/style';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export class Modal extends RanElement {
  _shadowDom: ShadowRoot;
  _root: HTMLDivElement;
  _mask: HTMLDivElement;
  _dialog: HTMLDivElement;
  _title: HTMLHeadingElement;
  _closeBtn: HTMLButtonElement;
  _slot: HTMLSlotElement;
  _labelId: string;
  _previousActiveElement: Element | null;

  static get observedAttributes(): string[] {
    return ['open', 'title', 'maskClosable', 'sheet'];
  }

  constructor() {
    super();
    this._labelId = `ran-modal-title-${Math.random().toString(36).slice(2, 9)}`;
    this._previousActiveElement = null;
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
    return [...dialogFocusable, ...slottedFocusable].filter((item) => item.offsetParent !== null);
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
    const active = document.activeElement as HTMLElement | null;
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
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('close', { detail: { trigger } }));
  };

  openDialog = (): void => {
    if (this._root.hasAttribute('open')) return;
    this._previousActiveElement = document.activeElement;
    this._root.setAttribute('open', '');
    this._dialog.setAttribute('aria-hidden', 'false');
    this.dispatchEvent(new CustomEvent('open'));
    requestAnimationFrame(() => {
      const focusables = this.getFocusableElements();
      (focusables[0] || this._dialog).focus();
    });
  };

  closeDialog = (): void => {
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
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close('escape');
      return;
    }
    this.trapFocus(event);
  };

  connectedCallback(): void {
    this.handlerExternalCss();
    this._mask.addEventListener('click', this.onMaskClick);
    this._closeBtn.addEventListener('click', this.onCloseButtonClick);
    document.addEventListener('keydown', this.onKeydown);
    this.syncTitle();
    if (this.open) {
      this.openDialog();
    } else {
      this.closeDialog();
    }
  }

  disconnectedCallback(): void {
    this._mask.removeEventListener('click', this.onMaskClick);
    this._closeBtn.removeEventListener('click', this.onCloseButtonClick);
    document.removeEventListener('keydown', this.onKeydown);
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
