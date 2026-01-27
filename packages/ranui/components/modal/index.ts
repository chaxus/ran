import type {
  ModalCloseEventDetail,
  ModalOpenEventDetail,
  ModalSize,
} from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import '@/components/icon';

/**
 * Modern Modal Component
 *
 * @element r-modal
 *
 * @slot - Default slot for modal content
 * @slot header - Custom header content
 * @slot footer - Custom footer content
 *
 * @fires modal-open - Fired when modal opens
 * @fires modal-close - Fired when modal closes
 * @fires modal-before-close - Fired before modal closes (can be prevented)
 *
 * @csspart mask - The modal mask (backdrop)
 * @csspart container - The modal container
 * @csspart dialog - The modal dialog
 * @csspart header - The modal header
 * @csspart title - The modal title
 * @csspart close - The close button
 * @csspart body - The modal body
 * @csspart footer - The modal footer
 */
export class Modal extends (HTMLElementSSR()!) {
  private _mask!: HTMLDivElement;
  private _container!: HTMLDivElement;
  private _dialog!: HTMLDivElement;
  private _header!: HTMLDivElement;
  private _title!: HTMLHeadingElement;
  private _closeBtn!: HTMLButtonElement;
  private _body!: HTMLDivElement;
  private _footer?: HTMLDivElement;
  private _shadowRoot!: ShadowRoot;

  static get observedAttributes(): string[] {
    return [
      'visible',
      'title',
      'size',
      'closable',
      'mask-closable',
      'mask',
      'keyboard-closable',
      'destroy-on-close',
      'centered',
      'footer',
    ];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get visible(): boolean {
    return this.hasAttribute('visible');
  }
  set visible(value: boolean) {
    if (value) {
      this.setAttribute('visible', '');
    } else {
      this.removeAttribute('visible');
    }
  }

  get title(): string {
    return this.getAttribute('title') || '';
  }
  set title(value: string) {
    this.setAttribute('title', value);
  }

  get size(): ModalSize {
    return (this.getAttribute('size') as ModalSize) || 'md';
  }
  set size(value: ModalSize) {
    this.setAttribute('size', value);
  }

  get closable(): boolean {
    return this.hasAttribute('closable') ? this.getAttribute('closable') !== 'false' : true;
  }
  set closable(value: boolean) {
    if (value) {
      this.setAttribute('closable', '');
    } else {
      this.setAttribute('closable', 'false');
    }
  }

  get maskClosable(): boolean {
    return this.hasAttribute('mask-closable') ? this.getAttribute('mask-closable') !== 'false' : true;
  }
  set maskClosable(value: boolean) {
    if (value) {
      this.setAttribute('mask-closable', '');
    } else {
      this.setAttribute('mask-closable', 'false');
    }
  }

  get mask(): boolean {
    return this.hasAttribute('mask') ? this.getAttribute('mask') !== 'false' : true;
  }
  set mask(value: boolean) {
    if (value) {
      this.setAttribute('mask', '');
    } else {
      this.setAttribute('mask', 'false');
    }
  }

  get keyboardClosable(): boolean {
    return this.hasAttribute('keyboard-closable') ? this.getAttribute('keyboard-closable') !== 'false' : true;
  }
  set keyboardClosable(value: boolean) {
    if (value) {
      this.setAttribute('keyboard-closable', '');
    } else {
      this.setAttribute('keyboard-closable', 'false');
    }
  }

  get destroyOnClose(): boolean {
    return this.hasAttribute('destroy-on-close');
  }
  set destroyOnClose(value: boolean) {
    if (value) {
      this.setAttribute('destroy-on-close', '');
    } else {
      this.removeAttribute('destroy-on-close');
    }
  }

  get centered(): boolean {
    return this.hasAttribute('centered');
  }
  set centered(value: boolean) {
    if (value) {
      this.setAttribute('centered', '');
    } else {
      this.removeAttribute('centered');
    }
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._shadowRoot.innerHTML = `
      <div part="mask" class="modal-mask"></div>
      <div part="container" class="modal-container" role="dialog" aria-modal="true">
        <div part="dialog" class="modal-dialog">
          <div part="header" class="modal-header">
            <h2 part="title" class="modal-title"></h2>
            <button part="close" class="modal-close" type="button" aria-label="Close">
              <r-icon name="close" size="18"></r-icon>
            </button>
          </div>
          <div part="body" class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    `;

    this._shadowRoot.prepend(style);
    this._mask = this._shadowRoot.querySelector('.modal-mask')!;
    this._container = this._shadowRoot.querySelector('.modal-container')!;
    this._dialog = this._shadowRoot.querySelector('.modal-dialog')!;
    this._header = this._shadowRoot.querySelector('.modal-header')!;
    this._title = this._shadowRoot.querySelector('.modal-title')!;
    this._closeBtn = this._shadowRoot.querySelector('.modal-close')!;
    this._body = this._shadowRoot.querySelector('.modal-body')!;
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.setupModal();
    this.setupEventListeners();
    this.updateClasses();
    this.updateAriaAttributes();

    if (this.visible) {
      this.handleOpen();
    }
  }

  disconnectedCallback(): void {
    this.removeEventListeners();
    this.removeBodyScrollLock();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'visible':
        if (this.visible) {
          this.handleOpen();
        } else {
          this.handleClose();
        }
        break;

      case 'title':
        this.updateTitle();
        break;

      case 'size':
      case 'centered':
        this.updateClasses();
        break;

      case 'closable':
        this.updateCloseButton();
        break;

      case 'mask':
        this.updateMask();
        break;

      case 'footer':
        this.updateFooter();
        break;
    }
  }

  // ========== Methods ==========

  private setupModal(): void {
    this.updateTitle();
    this.updateCloseButton();
    this.updateMask();
    this.updateFooter();
  }

  private updateTitle(): void {
    if (this._title) {
      this._title.textContent = this.title;
    }
  }

  private updateCloseButton(): void {
    if (this._closeBtn) {
      this._closeBtn.style.display = this.closable ? 'flex' : 'none';
    }
  }

  private updateMask(): void {
    if (this._mask) {
      this._mask.style.display = this.mask ? 'block' : 'none';
    }
  }

  private updateFooter(): void {
    const showFooter = this.hasAttribute('footer') ? this.getAttribute('footer') !== 'false' : false;

    if (showFooter && !this._footer) {
      this._footer = document.createElement('div');
      this._footer.setAttribute('part', 'footer');
      this._footer.className = 'modal-footer';
      this._footer.innerHTML = '<slot name="footer"></slot>';
      this._dialog.appendChild(this._footer);
    } else if (!showFooter && this._footer) {
      this._dialog.removeChild(this._footer);
      this._footer = undefined;
    }
  }

  private updateClasses(): void {
    if (!this._container) return;

    const classes = [
      'modal-container',
      `modal-${this.size}`,
      this.centered && 'modal-centered',
      this.visible && 'modal-visible',
    ].filter(Boolean);

    this._container.className = classes.join(' ');

    // Update mask classes
    if (this._mask) {
      this._mask.className = this.visible ? 'modal-mask modal-mask-visible' : 'modal-mask';
    }
  }

  private updateAriaAttributes(): void {
    if (!this._container) return;

    if (this.title) {
      this._container.setAttribute('aria-labelledby', 'modal-title');
      this._title.id = 'modal-title';
    }
  }

  private addBodyScrollLock(): void {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${this.getScrollbarWidth()}px`;
  }

  private removeBodyScrollLock(): void {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  private getScrollbarWidth(): number {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    document.body.removeChild(outer);

    return scrollbarWidth;
  }

  private handleOpen(): void {
    this.updateClasses();
    this.addBodyScrollLock();

    this.dispatchEvent(
      new CustomEvent<ModalOpenEventDetail>('modal-open', {
        detail: { visible: true },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleClose(): void {
    this.updateClasses();
    this.removeBodyScrollLock();

    this.dispatchEvent(
      new CustomEvent<ModalCloseEventDetail>('modal-close', {
        detail: { visible: false },
        bubbles: true,
        composed: true,
      })
    );

    if (this.destroyOnClose) {
      const slot = this._body.querySelector('slot');
      if (slot) {
        const nodes = slot.assignedNodes();
        nodes.forEach((node) => node.parentNode?.removeChild(node));
      }
    }
  }

  // ========== Event Handlers ==========

  private setupEventListeners(): void {
    this._closeBtn.addEventListener('click', this.handleCloseBtnClick);
    this._mask.addEventListener('click', this.handleMaskClick);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  private removeEventListeners(): void {
    this._closeBtn?.removeEventListener('click', this.handleCloseBtnClick);
    this._mask?.removeEventListener('click', this.handleMaskClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleCloseBtnClick = (): void => {
    this.close();
  };

  private handleMaskClick = (): void => {
    if (this.maskClosable) {
      this.close();
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.keyboardClosable && this.visible) {
      this.close();
    }
  };

  // ========== Public Methods ==========

  open(): void {
    if (this.visible) return;

    this.visible = true;
  }

  close(): void {
    if (!this.visible) return;

    // Dispatch before-close event (can be prevented)
    const beforeCloseEvent = new CustomEvent<ModalCloseEventDetail>('modal-before-close', {
      detail: { visible: false },
      bubbles: true,
      composed: true,
      cancelable: true,
    });

    const shouldClose = this.dispatchEvent(beforeCloseEvent);
    if (!shouldClose) return;

    this.visible = false;
  }

  toggle(): void {
    if (this.visible) {
      this.close();
    } else {
      this.open();
    }
  }
}

function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-modal')) {
    customElements.define('r-modal', Modal);
    return Modal;
  } else {
    return createCustomError('document is undefined or r-modal already exists');
  }
}

export default Custom();
