(function () {
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
        this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
      });
      this.dispatchEvent(new CustomEvent("change", { detail: 11111 }));
      // 创建样式
      const style = document.createElement('style');
      style.textContent = `
        .r-input {
          writing-mode: horizontal-tb;
          text-rendering: auto;
          letter-spacing: normal;
          word-spacing: normal;
          text-transform: none;
          text-indent: 0px;
          text-shadow: none;
          text-align: start;
          -webkit-rtl-ordering: logical;
          cursor: text;
          touch-action: manipulation;
          -webkit-appearance: none;
          text-overflow: ellipsis;
          box-sizing: border-box;
          margin: 0;
          font-variant: tabular-nums;
          list-style: none;
          font-feature-settings: "tnum";
          position: relative;
          display: inline-block;
          width: 100%;
          min-width: 0;
          padding: 4px 11px;
          color: #000000d9;
          font-size: 14px;
          line-height: 1.5715;
          background-color: #fff;
          background-image: none;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          transition: all .3s;
        }
        .r-input:focus {
          border-color: #40a9ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, .2);;
          border-right-width: 1px;
          outline: 0;
        }
        .r-input:hover {
          border-color: #40a9ff;
          border-right-width: 1px;
        }
      `
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
})()