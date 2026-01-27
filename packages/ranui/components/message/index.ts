import type {
  MessageAPI,
  MessageGlobalConfig,
  MessageInstance,
  MessageOptions,
  MessageType,
} from './types';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import '@/components/icon';

const ANIMATION_DURATION = 300;
const DEFAULT_DURATION = 3000;
const DEFAULT_OFFSET = 16;

// Type to icon mapping
const TYPE_ICON_MAP: Record<MessageType, string> = {
  info: 'info-circle-fill',
  success: 'check-circle-fill',
  warning: 'warning-circle-fill',
  error: 'close-circle-fill',
  loading: 'loading',
};

// Type to color mapping
const TYPE_COLOR_MAP: Record<MessageType, string> = {
  info: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  loading: '#1890ff',
};

/**
 * Message Element Component
 */
class MessageElement extends (HTMLElementSSR()!) {
  private _container!: HTMLDivElement;
  private _content!: HTMLDivElement;
  private _icon?: HTMLElement;
  private _text!: HTMLSpanElement;
  private _closeBtn?: HTMLButtonElement;
  private _shadowRoot!: ShadowRoot;
  private _closeTimer?: number;

  static get observedAttributes(): string[] {
    return ['type', 'content', 'closable', 'icon'];
  }

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this.render();
  }

  // ========== Properties ==========

  get type(): MessageType {
    return (this.getAttribute('type') as MessageType) || 'info';
  }
  set type(value: MessageType) {
    this.setAttribute('type', value);
  }

  get content(): string {
    return this.getAttribute('content') || '';
  }
  set content(value: string) {
    this.setAttribute('content', value);
  }

  get closable(): boolean {
    return this.hasAttribute('closable');
  }
  set closable(value: boolean) {
    if (value) {
      this.setAttribute('closable', '');
    } else {
      this.removeAttribute('closable');
    }
  }

  get icon(): string | undefined {
    return this.getAttribute('icon') || undefined;
  }
  set icon(value: string | undefined) {
    if (value) {
      this.setAttribute('icon', value);
    } else {
      this.removeAttribute('icon');
    }
  }

  // ========== Render ==========

  private render(): void {
    const style = document.createElement('style');
    style.textContent = `@import url("${new URL('./index.css', import.meta.url).href}");`;

    this._shadowRoot.innerHTML = `
      <div part="container" class="message-container" role="alert">
        <div part="content" class="message-content">
          <span part="text" class="message-text"></span>
        </div>
      </div>
    `;

    this._shadowRoot.prepend(style);
    this._container = this._shadowRoot.querySelector('.message-container')!;
    this._content = this._shadowRoot.querySelector('.message-content')!;
    this._text = this._shadowRoot.querySelector('.message-text')!;
  }

  // ========== Lifecycle ==========

  connectedCallback(): void {
    this.updateIcon();
    this.updateContent();
    this.updateCloseButton();
    this.updateClasses();
  }

  disconnectedCallback(): void {
    this.clearTimer();
    this.removeCloseButton();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;

    switch (name) {
      case 'type':
        this.updateIcon();
        this.updateClasses();
        break;

      case 'content':
        this.updateContent();
        break;

      case 'closable':
        this.updateCloseButton();
        break;

      case 'icon':
        this.updateIcon();
        break;
    }
  }

  // ========== Methods ==========

  private updateIcon(): void {
    const customIcon = this.icon;
    const defaultIcon = TYPE_ICON_MAP[this.type];
    const iconName = customIcon || defaultIcon;

    if (iconName) {
      if (!this._icon) {
        this._icon = document.createElement('r-icon');
        this._icon.setAttribute('part', 'icon');
        this._icon.className = 'message-icon';
        this._content.insertBefore(this._icon, this._text);
      }

      this._icon.setAttribute('name', iconName);
      this._icon.setAttribute('size', '18');

      const color = TYPE_COLOR_MAP[this.type];
      if (color && !customIcon) {
        this._icon.setAttribute('color', color);
      }

      if (this.type === 'loading') {
        this._icon.setAttribute('spin', '');
      } else {
        this._icon.removeAttribute('spin');
      }
    } else if (this._icon) {
      this._content.removeChild(this._icon);
      this._icon = undefined;
    }
  }

  private updateContent(): void {
    if (!this._text) return;
    this._text.textContent = this.content;
  }

  private updateCloseButton(): void {
    if (this.closable) {
      if (!this._closeBtn) {
        this._closeBtn = document.createElement('button');
        this._closeBtn.setAttribute('part', 'close');
        this._closeBtn.className = 'message-close';
        this._closeBtn.setAttribute('aria-label', 'Close message');
        this._closeBtn.innerHTML = `<r-icon name="close" size="14"></r-icon>`;
        this._closeBtn.addEventListener('click', this.handleClose);
        this._content.appendChild(this._closeBtn);
      }
    } else {
      this.removeCloseButton();
    }
  }

  private removeCloseButton(): void {
    if (this._closeBtn) {
      this._closeBtn.removeEventListener('click', this.handleClose);
      this._content.removeChild(this._closeBtn);
      this._closeBtn = undefined;
    }
  }

  private updateClasses(): void {
    if (!this._container) return;

    const classes = [
      'message-container',
      `message-${this.type}`,
      this.closable && 'message-closable',
    ].filter(Boolean);

    this._container.className = classes.join(' ');
  }

  private clearTimer(): void {
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = undefined;
    }
  }

  // ========== Event Handlers ==========

  private handleClose = (): void => {
    this.close();
  };

  // ========== Public Methods ==========

  close(): void {
    this.classList.add('message-leave');

    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('message-close', { bubbles: true, composed: true }));
      this.remove();
    }, ANIMATION_DURATION);
  }

  startTimer(duration: number): void {
    if (duration === 0) return;

    this._closeTimer = window.setTimeout(() => {
      this.close();
    }, duration);
  }
}

/**
 * Message Container Manager
 */
class MessageManager {
  private container!: HTMLDivElement;
  private _config: Required<MessageGlobalConfig> = {
    duration: DEFAULT_DURATION,
    position: 'top',
    maxCount: 0,
    offset: DEFAULT_OFFSET,
  };

  constructor() {
    this.createContainer();
  }

  private createContainer(): void {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'ranui-message-container';
      this.container.style.cssText = `
        position: fixed;
        top: ${this._config.offset}px;
        left: 0;
        width: 100%;
        pointer-events: none;
        z-index: 1010;
      `;
      document.body.appendChild(this.container);
    }
  }

  private createMessage(options: MessageOptions): MessageInstance {
    const message = new MessageElement();
    message.className = 'message message-enter';

    // Set attributes
    message.type = options.type || 'info';
    message.content = options.content;

    if (options.closable) {
      message.closable = true;
    }

    if (options.icon) {
      message.icon = options.icon;
    }

    if (options.className) {
      message.className += ` ${options.className}`;
    }

    // Check max count
    if (this._config.maxCount > 0) {
      const messages = this.container.querySelectorAll('.message');
      if (messages.length >= this._config.maxCount) {
        (messages[0] as MessageElement).close();
      }
    }

    // Add to container
    this.container.appendChild(message);

    // Trigger enter animation
    requestAnimationFrame(() => {
      message.classList.remove('message-enter');
    });

    // Start auto-close timer
    const duration = options.duration ?? this._config.duration;
    message.startTimer(duration);

    // Handle close event
    const onClose = options.onClose;
    if (onClose) {
      message.addEventListener('message-close', onClose, { once: true });
    }

    return {
      close: () => message.close(),
      update: (updateOptions: Partial<MessageOptions>) => {
        if (updateOptions.content !== undefined) {
          message.content = updateOptions.content;
        }
        if (updateOptions.type !== undefined) {
          message.type = updateOptions.type;
        }
        if (updateOptions.icon !== undefined) {
          message.icon = updateOptions.icon;
        }
        if (updateOptions.closable !== undefined) {
          message.closable = updateOptions.closable;
        }
      },
    };
  }

  public open(options: MessageOptions): MessageInstance {
    return this.createMessage(options);
  }

  public info(content: string | MessageOptions): MessageInstance {
    const options = typeof content === 'string' ? { content, type: 'info' as const } : { ...content, type: 'info' as const };
    return this.createMessage(options);
  }

  public success(content: string | MessageOptions): MessageInstance {
    const options = typeof content === 'string' ? { content, type: 'success' as const } : { ...content, type: 'success' as const };
    return this.createMessage(options);
  }

  public warning(content: string | MessageOptions): MessageInstance {
    const options = typeof content === 'string' ? { content, type: 'warning' as const } : { ...content, type: 'warning' as const };
    return this.createMessage(options);
  }

  public error(content: string | MessageOptions): MessageInstance {
    const options = typeof content === 'string' ? { content, type: 'error' as const } : { ...content, type: 'error' as const };
    return this.createMessage(options);
  }

  public loading(content: string | MessageOptions): MessageInstance {
    const options = typeof content === 'string' ? { content, type: 'loading' as const, duration: 0 } : { ...content, type: 'loading' as const, duration: content.duration ?? 0 };
    return this.createMessage(options);
  }

  public destroyAll(): void {
    const messages = this.container.querySelectorAll('.message');
    messages.forEach((msg) => (msg as MessageElement).close());
  }

  public config(options: MessageGlobalConfig): void {
    this._config = { ...this._config, ...options };

    if (options.offset !== undefined) {
      this.container.style.top = `${options.offset}px`;
    }
  }
}

// Register custom element
function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-message')) {
    customElements.define('r-message', MessageElement);

    const manager = new MessageManager();

    const messageAPI: MessageAPI = {
      info: (content) => manager.info(content),
      success: (content) => manager.success(content),
      warning: (content) => manager.warning(content),
      error: (content) => manager.error(content),
      loading: (content) => manager.loading(content),
      open: (options) => manager.open(options),
      destroyAll: () => manager.destroyAll(),
      config: (options) => manager.config(options),
    };

    return messageAPI;
  } else {
    return createCustomError('document is undefined or r-message already exists') as unknown as MessageAPI;
  }
}

const message = Custom();

// Expose to window
if (typeof window !== 'undefined' && message) {
  window.message = message;
  if (!window.ranui) {
    window.ranui = {} as any;
  }
  window.ranui.message = message;
}

export default message;
