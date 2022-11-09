const typeMapIcon = new Map([
  ["success", "check-circle-fill"],
  ["warning", "warning-circle-fill"],
  ["error", "close-circle-fill"],
  ["info", "info-circle-fill"],
  ["toast", null],
]);

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
      if (icon) {
        this._icon?.setAttribute("name", icon);
        this._icon?.style.setProperty("margin-right", "8px");
        this._icon?.setAttribute("size", "18");
        this._icon?.setAttribute("color", "#1890ff");
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
  const AnimationTime = 300
  const defaultDuration = 3000
  return {
    info: (options: Ran.Prompt | string) => {
      const message = new CustomElement();
      message.timeId && clearTimeout(message.timeId);
      message.setAttribute("type", "info");
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
    },
    success: ({ text, duration = 1500, close }: Ran.Prompt) => {},
    error: ({ text, duration = 1500, close }: Ran.Prompt) => {},
    warning: ({ text, duration = 1500, close }: Ran.Prompt) => {},
    toast: ({ text, duration = 1500, close }: Ran.Prompt) => {},
  };
}

const message = Custom();

window.message = message;

export default message;
