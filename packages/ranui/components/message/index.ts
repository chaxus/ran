import messageCss from './index.less?inline';
import checkCircleFill from '@/assets/icons/check-circle-fill.svg?raw';
import closeCircleFill from '@/assets/icons/close-circle-fill.svg?raw';
import infoCircleFill from '@/assets/icons/info-circle-fill.svg?raw';
import warningCircleFill from '@/assets/icons/warning-circle-fill.svg?raw';
import { registerIcons } from '@/components/icon';
import { Div, Span, View } from '@/utils/builder';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { RanElement } from '@/utils/index';
import { defineSSR } from '@/utils/ssr-registry';
import { getMessageContainer, type MessageRenderOptions } from './container';

const AnimationTime = 300;
const defaultDuration = 3000;

registerIcons({
  'check-circle-fill': checkCircleFill,
  'close-circle-fill': closeCircleFill,
  'info-circle-fill': infoCircleFill,
  'warning-circle-fill': warningCircleFill,
});

const typeMapIcon = new Map([
  ['success', 'check-circle-fill'],
  ['warning', 'warning-circle-fill'],
  ['error', 'close-circle-fill'],
  ['info', 'info-circle-fill'],
  ['toast', null],
]);

const typeMapColor = new Map([
  ['success', '#52c41a'],
  ['warning', '#faad14'],
  ['error', '#ff4d4f'],
  ['info', '#1890ff'],
  ['toast', 'rgba(0, 0, 0, 0.7)'],
]);

export class CustomMessage extends RanElement {
  _info: HTMLDivElement;
  _notice: HTMLDivElement;
  _content: HTMLDivElement;
  _icon?: HTMLElement;
  _span: HTMLSpanElement;
  _shadowDom: ShadowRoot;
  timeId?: NodeJS.Timeout;
  close?: () => void;
  static get observedAttributes() {
    return ['type', 'content', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, messageCss);
    const notice = ensureShadowElement(
      this._shadowDom,
      '.ran-message-notice',
      () =>
        Div()
          .class('ran-message-notice')
          .children(
            Div()
              .class('ran-message-notice-content')
              .children(Div().class('ran-message-notice-content-info').children(View('r-icon'), Span())),
          )
          .build() as HTMLDivElement,
    );

    this._notice = notice;
    this._content = notice.querySelector('.ran-message-notice-content') as HTMLDivElement;
    this._info = notice.querySelector('.ran-message-notice-content-info') as HTMLDivElement;
    this._icon = notice.querySelector('r-icon') as HTMLElement;
    this._span = notice.querySelector('span') as HTMLSpanElement;

    this.handlerExternalCss();
  }
  connectedCallback(): void {
    // Read the whole toast as one unit rather than fragmenting it as text streams
    // in; the type setter escalates error/warning to an assertive alert. Set here,
    // not in the constructor — a custom element may not gain attributes while
    // constructing (it throws and aborts the upgrade).
    (RanElement.prototype as { connectedCallback?: () => void }).connectedCallback?.call(this);
    if (!this.hasAttribute('aria-atomic')) this.setAttribute('aria-atomic', 'true');
  }
  get type(): string | null {
    return this.getAttribute('type');
  }
  set type(value: string | null) {
    if (value) this.setAttribute('type', value);
  }
  get content(): string | null {
    return this.getAttribute('content');
  }
  set content(value: string | null) {
    if (value) this.setAttribute('content', value);
  }
  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }
  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };
  // Map the toast type to a live-region role: error/warning interrupt (assertive
  // `alert`), success/info wait their turn (polite `status`). This escalates the
  // urgent cases above the polite stack container (see container.ts).
  setA11yRole = (value: string | null): void => {
    const assertive = value === 'error' || value === 'warning';
    this.setAttribute('role', assertive ? 'alert' : 'status');
  };
  setIcon = (value: string) => {
    const icon = typeMapIcon.get(value);
    const color = typeMapColor.get(value);
    if (icon) {
      this._icon?.setAttribute('name', icon);
      this._icon?.style.setProperty('margin-right', '8px');
      this._icon?.setAttribute('size', '18');
      if (color) {
        this._icon?.setAttribute('color', color);
      }
    }
  };
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (name === 'content') this._span.textContent = newValue;
    if (name === 'type') {
      this.setIcon(newValue);
      this.setA11yRole(newValue);
    }
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-message', CustomMessage as unknown as new () => HTMLElement);

function initMessageApi() {
  if (typeof window === 'undefined') return null;

  const commonPrompt = (type: string) => {
    return (options: Ran.Prompt | string | undefined | null) => {
      const renderOptions: MessageRenderOptions = {};
      const message = View('r-message').class('message').build() as HTMLElement & {
        timeId?: NodeJS.Timeout;
      };
      if (message.timeId) {
        clearTimeout(message.timeId);
      }
      message.setAttribute('type', type);
      let duration = defaultDuration;
      let close: Ran.Prompt['close'];
      if (!options) return;
      if (typeof options === 'string') {
        message.setAttribute('content', options);
      } else {
        message.setAttribute('content', options.content);
        close = options.close;
        duration = options.duration || defaultDuration;
        renderOptions.top = options.top;
        renderOptions.zIndex = options.zIndex;
        renderOptions.getContainer = options.getContainer;
      }

      const div = getMessageContainer(renderOptions);
      if (!div) return;

      const time = setTimeout(() => {
        message.classList.remove('message-in');
        message.classList.add('message-leave');
        clearTimeout(time);
      }, duration - AnimationTime);

      message.timeId = setTimeout(() => {
        message.classList.remove('message-leave');
        div.removeChild(message);
        if (close) close();
      }, duration);

      div.appendChild(message);
      message.classList.add('message-in');
      setTimeout(() => {
        message.classList.remove('message-in');
      }, AnimationTime);
    };
  };

  const api = {
    info: commonPrompt('info'),
    success: commonPrompt('success'),
    error: commonPrompt('error'),
    warning: commonPrompt('warning'),
    toast: commonPrompt('toast'),
  };

  (window as any).message = api;
  if (!(window as any).ranui) (window as any).ranui = {};
  (window as any).ranui.message = api;

  return api;
}

const message = initMessageApi();

export default message;
