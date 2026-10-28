import messageCss from './index.less?inline';
import checkCircleFill from '@/assets/icons/check-circle-fill.svg?raw';
import closeCircleFill from '@/assets/icons/close-circle-fill.svg?raw';
import infoCircleFill from '@/assets/icons/info-circle-fill.svg?raw';
import warningCircleFill from '@/assets/icons/warning-circle-fill.svg?raw';
import { registerIcons } from '@/components/icon';
import { createRef, Div, Span, View } from '@/utils/builder';
import {
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
import { RanElement } from '@/utils/index';
import { defineSSR } from '@/utils/ssr-registry';
import { getMessageContainer, restack, type MessageRenderOptions } from './container';

/** Options accepted by the message API, shared with the optional browser globals. */
export interface MessagePrompt extends MessageRenderOptions {
  content: string;
  duration?: number;
  close?: () => void;
}

const defaultDuration = 3000;
/** When the leave starts, before `duration` ends; matches the stylesheet's default exit. */
const EXIT_ESTIMATE = 200;

/** The longest transition on an element, in ms: how long its current state takes to land. */
const settleTime = (el: HTMLElement): number => {
  const style = getComputedStyle(el);
  const seconds = (list: string) => list.split(',').map((value) => Number.parseFloat(value) || 0);
  const durations = seconds(style.transitionDuration);
  const delays = seconds(style.transitionDelay);
  return Math.max(0, ...durations.map((duration, i) => (duration + (delays[i % delays.length] ?? 0)) * 1000));
};

/**
 * Takes a toast out of the stack; the ones after it move up by however far they shifted,
 * through their own transition, instead of jumping (a FLIP: measure, remove, invert, play).
 */
const removeFromStack = (stack: HTMLElement, toast: HTMLElement): void => {
  const after: HTMLElement[] = [];
  for (let el = toast.nextElementSibling; el; el = el.nextElementSibling) after.push(el as HTMLElement);
  const before = after.map((el) => el.getBoundingClientRect().top);
  stack.removeChild(toast);
  after.forEach((el, i) => {
    const shift = before[i]! - el.getBoundingClientRect().top;
    if (!shift) return;
    el.style.setProperty('transition', 'none');
    el.style.setProperty('translate', `0 ${shift}px`);
    el.getBoundingClientRect();
    el.style.removeProperty('transition');
    el.style.removeProperty('translate');
  });
};

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

export class CustomMessage extends RanElement {
  _info: HTMLDivElement;
  _notice: HTMLDivElement;
  _content: HTMLDivElement;
  _icon?: HTMLElement;
  _span: HTMLSpanElement;
  _shadowDom: ShadowRoot;
  timeId?: ReturnType<typeof setTimeout>;
  close?: () => void;
  static get observedAttributes() {
    return ['type', 'content', 'sheet'];
  }
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, messageCss);
    const contentRef = createRef<HTMLDivElement>();
    const infoRef = createRef<HTMLDivElement>();
    const iconRef = createRef<HTMLElement>();
    const spanRef = createRef<HTMLSpanElement>();
    const notice = Div()
      .class('ran-message-notice')
      .children(
        Div()
          .class('ran-message-notice-content')
          .ref(contentRef)
          .children(
            Div()
              .class('ran-message-notice-content-info')
              .ref(infoRef)
              .children(View('r-icon').class('ran-message-icon').ref(iconRef), Span().ref(spanRef)),
          ),
      )
      .build() as HTMLDivElement;
    this._shadowDom.appendChild(notice);

    this._notice = notice;
    this._content = shadowPart(contentRef, 'notice content');
    this._info = shadowPart(infoRef, 'notice content info');
    this._icon = shadowPart(iconRef, 'r icon');
    this._span = shadowPart(spanRef, 'span');

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
  // Colour, size and spacing come from index.less keyed on :host([type]), so they flip with the theme.
  setIcon = (value: string) => {
    const icon = typeMapIcon.get(value);
    if (icon) this._icon?.setAttribute('name', icon);
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
    return (options: MessagePrompt | string | undefined | null) => {
      const renderOptions: MessageRenderOptions = {};
      const message = View('r-message').class('message').build() as HTMLElement & {
        timeId?: ReturnType<typeof setTimeout>;
      };
      if (message.timeId) {
        clearTimeout(message.timeId);
      }
      message.setAttribute('type', type);
      let duration = defaultDuration;
      let close: MessagePrompt['close'];
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
        renderOptions.stacked = options.stacked;
      }

      const div = getMessageContainer(renderOptions);
      if (!div) return;

      // Entering: placed in its start state, then released to rest in the same task, so the
      // transition runs from there (the forced style read is what makes the start state stick).
      message.setAttribute('data-state', 'enter');
      div.appendChild(message);
      restack(div);
      message.getBoundingClientRect();
      message.removeAttribute('data-state');

      message.timeId = setTimeout(
        () => {
          message.setAttribute('data-state', 'exit');
          setTimeout(() => {
            if (message.parentNode === div && div.hasAttribute('data-stacked')) {
              // A pile has no flow to close up; the rest move to their new depths by transition.
              div.removeChild(message);
              restack(div);
            } else if (message.parentNode === div) removeFromStack(div, message);
            if (close) close();
          }, settleTime(message));
        },
        Math.max(0, duration - EXIT_ESTIMATE),
      );
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
