import { isDisabled } from '@/utils/index'

function Custom() {
  if (typeof window !== "undefined" && !customElements.get("r-button")) {
    class CustomElement extends HTMLElement {
      static get observedAttributes() {
        return ["disabled", "icon"];
      }
      _btn: HTMLDivElement;
      _iconElement?: HTMLElement;
      _slot: HTMLSlotElement;
      constructor() {
        super();
        this._slot = document.createElement("slot");
        this._btn = document.createElement("div");
        this._btn.setAttribute('class', 'btn')
        this._btn.appendChild(this._slot);
        this._slot.setAttribute("class", "slot");
        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.appendChild(this._btn);
      }
      get disabled() {
        return isDisabled(this)
      }
      set disabled(value: boolean | string | undefined | null) {
        if (!value || value === "false") {
          this.removeAttribute("disabled");
        } else {
          this.setAttribute("disabled", '');
        }
      }
      get icon() {
        return this.getAttribute('icon')
      }
      set icon(value) {
        if (value) {
          this.setAttribute('icon', value)
        }
      }
      /**
        * @description: 设置button的icon
        * @return {*}
        */
      setIcon = () => {
        if (this.icon) {
          // 获取button的尺寸
          const { width, height } = this._slot.getBoundingClientRect()
          const size = Math.min(width, height)
          if (this._iconElement) {
            // 如果有_iconElement，只用设置name和size
            this._iconElement.setAttribute('name', this.icon)
            this._iconElement.setAttribute('size', `${size - 5}`)
          } else {
            // 创建icon，设置name,size,color
            this._iconElement = document.createElement('r-icon')
            this._iconElement.setAttribute('name', this.icon)
            this._iconElement.setAttribute('size', `${size - 5}`)
            this._iconElement.setAttribute('color', 'currentColor')
            this._iconElement.setAttribute('class', 'icon')
            // 添加到btn元素的首位
            this._slot.insertAdjacentElement('beforebegin', this._iconElement)
          }

        }
      }
      mousedown = (event: MouseEvent) => {
        if (!this.disabled || this.disabled === 'false') {
          const { left, top } = this.getBoundingClientRect();
          this.style.setProperty("--ran-x", event.clientX - left + "px");
          this.style.setProperty("--ran-y", event.clientY - top + "px");
        }
      };
      mouseLeave = () => {
        this.style.removeProperty("--ran-x");
        this.style.removeProperty("--ran-y");
      };
      connectedCallback() {
        this._btn.addEventListener("mousedown", this.mousedown);
        this._btn.addEventListener("mouseleave", this.mouseLeave);
        this.setIcon()
      }
      disconnectCallback() {
        this._btn.removeEventListener("mousedown", this.mousedown);
        this._btn.removeEventListener("mouseleave", this.mouseLeave);
      }
      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name == "disabled" && this._btn) {
          if (!newValue || newValue === "false") {
            this._btn.setAttribute("disabled", '');
          } else {
            this._btn.removeAttribute("disabled");
          }
        }
        if (name === 'icon') {
          if (oldValue !== newValue) {
            this.setIcon()
          }
        }
      }
    }
    customElements.define("r-button", CustomElement);
  }
}

export default Custom()
