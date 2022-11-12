const AnimationTime = 300; // message退出动画执行的时间
const defaultDuration = 3000; // 默认message存在的时间

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
  ["toast", "rgba(0, 0, 0, 0.7)"],
]);



function Custom() {
  if (typeof window !== "undefined" && !customElements.get("r-message")) {
    class CustomElement extends HTMLElement {
      _info: HTMLDivElement;
      _notice: HTMLDivElement;
      _content: HTMLDivElement;
      _icon?: HTMLElement;
      _span: HTMLSpanElement;
      timeId?: NodeJS.Timeout;
      close?: () => void;
      static get observedAttributes() {
        return ["type", "content"];
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
      get content() {
        return this.getAttribute("content");
      }
      set content(value) {
        if (value) this.setAttribute("content", value);
      }
      /**
       * @description: 设置图标
       * @param {string} value
       */
      setIcon = (value: string) => {
        const icon = typeMapIcon.get(value);
        const color = typeMapColor.get(value);
        if (icon) {
          this._icon?.setAttribute("name", icon);
          this._icon?.style.setProperty("margin-right", "8px");
          this._icon?.setAttribute("size", "18");
          color && this._icon?.setAttribute("color", color);
        }
      }
      connectedCallback() { }
      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "content" && oldValue !== newValue) {
          this._span.textContent = newValue;
        }
        if (name === "type" && oldValue !== newValue) {
          this.setIcon(newValue)
        }
      }
    }
    customElements.define("r-message", CustomElement);
    const container = document.createElement("div");
    const div = document.createElement("div");
    div.setAttribute("class", "ranui-message");
    document.body.appendChild(container);
    container.appendChild(div);
    const commonPrompt = (type: string) => {
      return (options: Ran.Prompt | string) => {
        const message = new CustomElement();
        message.setAttribute("class", 'message');
        message.timeId && clearTimeout(message.timeId);
        message.setAttribute("type", type);
        let duration = defaultDuration;
        let close: Ran.Prompt["close"];
        if (typeof options === "string") {
          message.setAttribute("content", options);
        } else {
          message.setAttribute("content", options.content);
          close = options.close;
          duration = options.duration || defaultDuration;
        }
        const time = setTimeout(() => {
          message.classList.remove("message-in");
          message.classList.add("message-leave");
          clearTimeout(time);
        }, duration - AnimationTime);
        message.timeId = setTimeout(() => {
          div.removeChild(message);
          if (close) close();
        }, duration);
        div.appendChild(message);
        message.classList.add("message-in");
      };
    };
    return {
      info: commonPrompt("info"),
      success: commonPrompt("success"),
      error: commonPrompt("error"),
      warning: commonPrompt("warning"),
      toast: commonPrompt('toast'),
    };
  }else{

  }
}

const message = Custom();

if (typeof window !== "undefined" && message) {
  window.message = message;
}

export default message;
