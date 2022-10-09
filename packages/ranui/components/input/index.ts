
import { falseList } from '@/assets/utils'

function Component() {
  const template = document.createElement("template");
  const container = document.createElement("div");
  container.setAttribute("class", "input");
  template.appendChild(container);
  class CustomElement extends HTMLElement {
    static get observedAttributes() {
      return [
        "label",
        "disabled",
        "name",
        "pattern",
        "required",
        "placeholder",
      ];
    }
    shadowRoot: ShadowRoot;
    _container: HTMLDivElement;
    _label: HTMLLabelElement | undefined;
    _input: HTMLInputElement;
    constructor() {
      super();
      this.shadowRoot = this.attachShadow({ mode: "closed" });
      this._container = container.cloneNode(true) as HTMLDivElement;
      this._input = document.createElement("input");
      this._input.setAttribute("class", "input-main");
      this._container.appendChild(this._input);
      // 如果一开始就设置了input的值，则初始化input的值
      if (this.value) {
        this._input.value = this.value;
        this._container.setAttribute("value", this.value);
      }
      if(this.disabled){
        this._container.setAttribute("disabled", '');
      }
      this.shadowRoot.appendChild(this._container);
    }
    /**
     * @description: 获取input的值
     * @return {String}
     */
    get value() {
      return this.getAttribute("value");
    }
    /**
     * @description: 设置input的值
     * @param {String} value
     */
    set value(value) {
      if (value) {
        this.setAttribute("value", value);
        this._container.setAttribute("value", value);
      } else {
        this.removeAttribute("value");
        this._container.removeAttribute("value");
      }
    }
    /**
     * @description: 获取input的占位字符
     * @return {String}
     */
    get placeholder() {
      return this.getAttribute("placeholder");
    }
    /**
     * @description: 设置input的占位字符
     * @param {String} value
     */
    set placeholder(value) {
      if (value) {
        this.setAttribute("placeholder", value);
      } else {
        this.removeAttribute("placeholder");
      }
    }
    /**
     * @description: input是否为必选
     * @return {String}
     */
    get required() {
      return this.getAttribute("required");
    }
    /**
     * @description: 设置input是否为必选，除非设置成false，否则都是必填
     * @param {*} value
     */
    set required(value) {
      if (!value || value === "false") {
        this.removeAttribute("required");
      } else {
        this.setAttribute("required", "");
      }
    }
    /**
     * @description: 获取input校验失败的提示
     * @return {String}
     */
    get warning() {
      return this.getAttribute("warning");
    }
    /**
     * @description: 设置input校验失败的提示信息
     * @param {String} value
     */
    set warning(value) {
      if (!value) {
        this.removeAttribute("warning");
      } else {
        this.setAttribute("warning", value);
      }
    }
    /**
     * @description: 获取校验的正则
     * @return {String}
     */
    get pattern() {
      return this.getAttribute("pattern");
    }
    /**
     * @description: 设置input校验的正则
     * @param {*} value
     */
    set pattern(value) {
      if (!value || value === "false") {
        this.removeAttribute("pattern");
      } else {
        this.setAttribute("pattern", value);
      }
    }
    /**
     * @description: 获取input上disabled属性
     * @return {String | null}
     */
    get disabled() {
      return this.hasAttribute("disabled");
    }
    /**
     * @description: 设置input的disabled属性
     * @param {String} value
     */
    set disabled(value) {
      if (falseList.includes(value)) {
        this.removeAttribute("disabled");
      } else {
        this.setAttribute("disabled", "");
      }
    }
    /**
     * @description: 获取类似于Metiral Design的输入体验。
     */
    get label() {
      return this.getAttribute("label") || "";
    }
    /**
     * @description: 设置类似于Metiral Design的输入体验。
     */
    set label(value: string) {
      this.setAttribute("label", value);
    }
    /**
     * @description: 与form组件联动时，收集的属性名
     * @return {String}
     */
    get name() {
      return this.getAttribute("name") || "";
    }
    /**
     * @description: 设置name属性
     * @param {string} value
     */
    set name(value: string) {
      this.setAttribute("name", value);
    }
    /**
     * @description: 获取一个icon
     * @return {String}
     */
    get icon() {
      return this.getAttribute("icon") || "";
    }
    /**
     * @description: 设置icon来表示标识
     * @param {string} value
     */
    set icon(value: string) {
      this.setAttribute("icon", value);
    }

    /**
     * @description: 原生的input方法
     * @param {Event} event
     */
    inputValue = (event: Event) => {
      event.stopPropagation();
      const target = event.target as HTMLInputElement;
      this.value = target ? target.value : "";
      this.dispatchEvent(
        new CustomEvent("input", {
          detail: {
            value: this.value,
          },
        })
      );
    };
    /**
     * @description: 增加change方法
     */
    change = () => {
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: {
            value: this.value,
          },
        })
      );
    };
    /**
     * @description: 增加focus方法
     */
    focus = () => {
      this.dispatchEvent(
        new CustomEvent("focus", {
          detail: {
            value: this.value,
          },
        })
      );
    };
    /**
     * @description: 检查校验是否成功
     * @return {Boolean}
     */
    checkout = () => {};
    /**
     * @description: 监听placeholder属性函数
     * @param {string} name
     * @param {string} value
     */
    listenPlaceholder(name: string, value: string) {
      if (name === "placeholder" && this._input) {
        if (value !== null) {
          this._input.setAttribute("placeholder", value);
        } else {
          this._input.removeAttribute("placeholder");
        }
      }
    }
    /**
     * @description: 监听required属性函数
     * @param {string} name
     * @param {string} value
     * @return {*}
     */
    listenRequired(name: string, value: string) {
      if (name === "required" && this._input) {
        if (value && value !== "false") {
          this._input.setAttribute("required", "");
        } else {
          this._input.removeAttribute("required");
        }
      }
    }
    /**
     * @description: 监听pattern属性函数
     * @param {string} name
     * @param {string} value
     */
    listenPattern(name: string, value: string) {
      if (name === "pattern" && this._input) {
        if (value && value !== "false") {
          this._input.setAttribute("pattern", value);
        } else {
          this._input.removeAttribute("pattern");
        }
      }
    }
    /**
     * @description: 监听lable属性函数
     * @param {string} name
     * @param {string} value
     */
    listenLabel(name: string, value: string) {
      if (name === "label" && this._input) {
        if (value !== null) {
          if (this._label) {
            this._label.innerHTML = value;
          } else {
            this._label = document.createElement("label");
            this._label.innerHTML = value;
            this._label.setAttribute("class", "input-label");
            this._container.appendChild(this._label);
          }
        } else {
          this._container.removeAttribute("label");
          if (this._label) {
            this._container.removeChild(this._label);
            this._label = undefined;
          }
        }
      }
    }
    connectedCallback() {
      this._input.addEventListener("input", this.inputValue);
      this._input.addEventListener("change", this.change);
      this._input.addEventListener("focus", this.focus);
    }
    disconnectCallback() {
      this._input.removeEventListener("input", this.inputValue);
      this._input.removeEventListener("change", this.change);
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      this.listenPlaceholder(name, newValue);
      this.listenRequired(name, newValue);
      this.listenPattern(name, newValue);
      this.listenLabel(name, newValue);
    }
  }
  window.customElements.define("r-input", CustomElement);
}

export default Component();
