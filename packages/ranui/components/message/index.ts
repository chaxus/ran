interface Prompt {
  text: string;
  duration?: number;
  onclose?: () => void;
}

const typeMapIcon = {
  success: "check-circle",
  warning: "warning-circle",
  error: "close-circle",
  info: "info-circle",
  toast: null,
};

class CustomElement extends HTMLElement {
  _info: HTMLDivElement;
  _notice: HTMLDivElement;
  _content: HTMLDivElement;
  _icon?: HTMLElement;
  _span: HTMLSpanElement;
  static get observedAttributes() {
    return ["type", "icon"];
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
  get timeId() {
    return this.getAttribute("timeId");
  }
  set timeId(value) {
    if (value) this.setAttribute("timeId", value);
  }
  get type() {
    return this.getAttribute("type");
  }
  set type(value) {
    if (value) this.setAttribute("type", value);
  }

  connectedCallback() {
    
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {}
}

function Custom() {
  if (!customElements.get("r-message")) {
    customElements.define("r-message", CustomElement);
  }
  const container = document.createElement('div')
  const div = document.createElement('div')
  div.setAttribute('class','ranui-message')
  document.body.appendChild(container)
  container.appendChild(div)
  return {
    info: ({ text, duration = 1500, onclose }: Prompt) => {
      const message = new CustomElement()
      message.timeId && clearTimeout(message.timeId);
      message.type = 'info';
    },
    success:  ({ text, duration = 1500, onclose }: Prompt) => {},
    error:  ({ text, duration = 1500, onclose }: Prompt) => {},
    warning:  ({ text, duration = 1500, onclose }: Prompt) => {},
    toast:  ({ text, duration = 1500, onclose }: Prompt) => {},
  }
}

const Toast = (msg: string, duration = 2000) => {
  duration = Number.isNaN(duration) ? 3000 : duration;
  const dom = document.createElement("div");
  dom.innerHTML = msg;
  dom.style.cssText = styles;
  document.body.appendChild(dom);
  setTimeout(function () {
    dom.style.opacity = "0";
    setTimeout(() => document.body.removeChild(dom), 2000);
  }, duration);
};



export default Custom();
