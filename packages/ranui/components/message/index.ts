const AnimationTime = 300 // message退出动画执行的时间
const defaultDuration = 3000 // 默认message存在的时间
// message类型映射icon的类型
const typeMapIcon = new Map([
  ["success", "check-circle-fill"],
  ["warning", "warning-circle-fill"],
  ["error", "close-circle-fill"],
  ["info", "info-circle-fill"],
  ["toast", null],
]);

// message类型映射icon的颜色
const typeMapColor = new Map([
  ["success", "#52c41a"],
  ["warning", "#faad14"],
  ["error", "#ff4d4f"],
  ["info", "#1890ff"],
  ["toast", 'rgba(0, 0, 0, 0.7)'],
])

class CustomElement extends HTMLElement {
  _info: HTMLDivElement;
  _notice: HTMLDivElement;
  _content: HTMLDivElement;
  _icon?: HTMLElement;
  _span: HTMLSpanElement;
  timeId?: NodeJS.Timeout;
  close?: () => void;
  static get observedAttributes() {
    return ["type", "text"];
  }
  constructor() {
    super();
    this._notice = document.createElement("div");
    this._notice.setAttribute("class", "message-notice");
    this._content = document.createElement("div");
    this._content.setAttribute("class", "message-notice-content");
    this._info = document.createElement("div");
    this._info.setAttribute("class", "message-notice-content-info");
    this._icon = document.createElement("r-icon");
    this._span = document.createElement("span");
    this._info.appendChild(this._icon);
    this._info.appendChild(this._span);
    this._content.appendChild(this._info);
    this._notice.appendChild(this._content);
    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.appendChild(this._notice);
  }
  get type() {
    return this.getAttribute("type");
  }
  set type(value) {
    if (value) this.setAttribute("type", value);
  }
  get text() {
    return this.getAttribute("text");
  }
  set text(value) {
    if (value) this.setAttribute("text", value);
  }

  connectedCallback() {}
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "text" && oldValue !== newValue) {
      this._span.textContent = newValue;
    }
    if (name === "type" && oldValue !== newValue) {
      const icon = typeMapIcon.get(newValue);
      const color = typeMapColor.get(newValue)
      if (icon) {
        this._icon?.setAttribute("name", icon);
        this._icon?.style.setProperty("margin-right", "8px");
        this._icon?.setAttribute("size", "18");
        color && this._icon?.setAttribute("color", color);
      }
    }
  }
}

function Custom() {
  if (!customElements.get("r-message")) {
    customElements.define("r-message", CustomElement);
  }
  const container = document.createElement("div");
  const div = document.createElement("div");
  div.setAttribute("class", "ranui-message");
  document.body.appendChild(container);
  container.appendChild(div);
  const commonPrompt = (type:string) => {
    return (options: Ran.Prompt | string) => {
      const message = new CustomElement();
        message.timeId && clearTimeout(message.timeId);
        message.setAttribute("type", type);
        let duration = defaultDuration;
        let close: Ran.Prompt["close"];
        if (typeof options === "string") {
          message.setAttribute("text", options);
        } else {
          message.setAttribute("text", options.text);
          close = options.close;
          duration = options.duration || defaultDuration;
        }
        const time = setTimeout(() => {
          message.setAttribute("class", "message-leave");
          clearTimeout(time);
        }, duration - AnimationTime);
        message.timeId = setTimeout(() => {
          div.removeChild(message);
          if (close) close();
        }, duration);
        div.appendChild(message);
        message.setAttribute('class','message-in')
    }
  }
  return {
    info: commonPrompt('info'),
    success: commonPrompt('success'),
    error: commonPrompt('error'),
    warning:commonPrompt('warning'),
    toast: commonPrompt('toast'),
  };
}

const message = Custom();

window.message = message;

export default message;
