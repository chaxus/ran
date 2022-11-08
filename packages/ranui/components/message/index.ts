interface Prompt {
  text: string;
  duration?: number;
  close?: () => void;
}
const typeMapIcon = new Map([
  ["success", "check-circle"],
  ["warning", "warning-circle"],
  ["error", "close-circle"],
  ["info", "info-circle"],
  ["toast", null],
])

class CustomElement extends HTMLElement {
  _info: HTMLDivElement;
  _notice: HTMLDivElement;
  _content: HTMLDivElement;
  _icon?: HTMLElement;
  _span: HTMLSpanElement;
  show?: boolean;
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
      const icon = typeMapIcon.get(newValue)
      if (icon) {
        this._icon?.setAttribute("name", icon);
        this._icon?.style.setProperty('margin-right','8px')
        this._icon?.setAttribute('size','18')
        this._icon?.setAttribute('color','#1890ff')
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
  return {
    info: ({ text, duration = 1500, close }: Prompt) => {
      const message = new CustomElement();
      message.timeId && clearTimeout(message.timeId);
      message.setAttribute("type", "info");
      message.setAttribute("text", text);
      message.setAttribute("show", "true");
      message.timeId = setTimeout(() => {
        message.setAttribute("show", "false");
        if (close) close();
      }, duration);
      div.appendChild(message);
    },
    success: ({ text, duration = 1500, close }: Prompt) => {},
    error: ({ text, duration = 1500, close }: Prompt) => {},
    warning: ({ text, duration = 1500, close }: Prompt) => {},
    toast: ({ text, duration = 1500, close }: Prompt) => {},
  };
}

const message = Custom();

window.message = message

export default message;
