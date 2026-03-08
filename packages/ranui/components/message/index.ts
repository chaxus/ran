import messageCss from './index.less?inline';
import checkCircleFill from '@/assets/icons/check-circle-fill.svg?raw';
import closeCircleFill from '@/assets/icons/close-circle-fill.svg?raw';
import infoCircleFill from '@/assets/icons/info-circle-fill.svg?raw';
import warningCircleFill from '@/assets/icons/warning-circle-fill.svg?raw';
import { registerIcons } from '@/components/icon';
import { Div, Span, View } from '@/utils/builder';
import { adoptStyles } from '@/utils/style';
import { getMessageContainer, type MessageRenderOptions } from './container';

const AnimationTime = 300; // message 退出动画执行的时间
const defaultDuration = 3000; // 默认 message 存在的时间

registerIcons({
  'check-circle-fill': checkCircleFill,
  'close-circle-fill': closeCircleFill,
  'info-circle-fill': infoCircleFill,
  'warning-circle-fill': warningCircleFill,
});

// message 类型映射 icon 的类型
const typeMapIcon = new Map([
  ['success', 'check-circle-fill'],
  ['warning', 'warning-circle-fill'],
  ['error', 'close-circle-fill'],
  ['info', 'info-circle-fill'],
  ['toast', null],
]);

// message 类型映射 icon 的颜色
const typeMapColor = new Map([
  ['success', '#52c41a'],
  ['warning', '#faad14'],
  ['error', '#ff4d4f'],
  ['info', '#1890ff'],
  ['toast', 'rgba(0, 0, 0, 0.7)'],
]);

function Custom() {
  if (typeof window === 'undefined') return null;

  if (!customElements.get('r-message')) {
    class CustomMessage extends HTMLElement {
      _info: HTMLDivElement;
      _notice: HTMLDivElement;
      _content: HTMLDivElement;
      _icon?: HTMLElement;
      _span: HTMLSpanElement;
      timeId?: NodeJS.Timeout;
      close?: () => void;
      static get observedAttributes() {
        return ['type', 'content'];
      }
      constructor() {
        super();
        const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'closed' });
        adoptStyles(shadowRoot, messageCss);

        let notice = shadowRoot.querySelector('.ran-message-notice') as HTMLDivElement;
        if (!notice) {
          notice = Div()
            .class('ran-message-notice')
            .children(
              Div()
                .class('ran-message-notice-content')
                .children(Div().class('ran-message-notice-content-info').children(View('r-icon'), Span())),
            )
            .build() as HTMLDivElement;
          shadowRoot.appendChild(notice);
        }

        this._notice = notice;
        this._content = notice.querySelector('.ran-message-notice-content') as HTMLDivElement;
        this._info = notice.querySelector('.ran-message-notice-content-info') as HTMLDivElement;
        this._icon = notice.querySelector('r-icon') as HTMLElement;
        this._span = notice.querySelector('span') as HTMLSpanElement;
      }
      get type() {
        return this.getAttribute('type');
      }
      set type(value) {
        if (value) this.setAttribute('type', value);
      }
      get content() {
        return this.getAttribute('content');
      }
      set content(value) {
        if (value) this.setAttribute('content', value);
      }
      setIcon = (value: string) => {
        const icon = typeMapIcon.get(value);
        const color = typeMapColor.get(value);
        if (icon) {
          this._icon?.setAttribute('name', icon);
          this._icon?.style.setProperty('margin-right', '8px');
          this._icon?.setAttribute('size', '18');
          color && this._icon?.setAttribute('color', color);
        }
      };
      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'content' && oldValue !== newValue) {
          this._span.textContent = newValue;
        }
        if (name === 'type' && oldValue !== newValue) {
          this.setIcon(newValue);
        }
      }
    }
    customElements.define('r-message', CustomMessage);
  }

  const commonPrompt = (type: string) => {
    return (options: Ran.Prompt | string | undefined | null) => {
      const renderOptions: MessageRenderOptions = {};
      const message = document.createElement('r-message') as HTMLElement & {
        timeId?: NodeJS.Timeout;
      };
      message.setAttribute('class', 'message');
      message.timeId && clearTimeout(message.timeId);
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

  if (typeof window !== 'undefined') {
    (window as any).message = api;
    if (!(window as any).ranui) (window as any).ranui = {};
    (window as any).ranui.message = api;
  }

  return api;
}

const message = Custom();

export default message;
