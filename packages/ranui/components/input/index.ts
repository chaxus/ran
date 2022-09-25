import styles from './index.less'

function RInput() {
  const template = document.createElement("template");
  const input = document.createElement('input');
  input.setAttribute('class', 'r-input');
  template.appendChild(input)
  class Input extends HTMLElement {
    _input: HTMLInputElement | null
    constructor() {
      super()
      const shadowRoot = this.attachShadow({ mode: 'closed' });
      this._input = input.cloneNode(true) as HTMLInputElement
      const attValue = this.getAttribute('value') || ''
      if (attValue) {
        this._input.value = attValue
      }
      this._input.addEventListener("input", ev => {
        const target = ev.target as HTMLInputElement;
        this.value = target ? target.value : ''
        // 自定义事件change
        this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
      });
      // 创建样式
      const style = document.createElement('style');
      style.textContent = styles
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(this._input);
    }
    get value() {
      return this.getAttribute("value");
    }
    set value(value) {
      if (value !== null) {
        this.setAttribute("value", value);
      }
    }
  }
  window.customElements.define('r-input', Input)
}

export default RInput()