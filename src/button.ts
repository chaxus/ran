function RButton() {
  const template = document.createElement("template");
  const slot = document.createElement('slot')
  const btn = document.createElement('div');
  btn.setAttribute('class', 'r-btn');
  slot.setAttribute('name', 'r-btn_content')
  btn.appendChild(slot)
  template.appendChild(btn)
  class Button extends HTMLElement {
    _type: Record<string,string>;
    _btn: Element;
    constructor() {
      super();
      this._type = {
        'primary': 'r-btn_primary',
        'warning': 'r-btn_warning',
        'default': '#f0f0f0'
      }
      this._btn = btn.cloneNode(true) as Element
      const shadowRoot = this.attachShadow({ mode: 'closed' });
      // 创建样式
      const style = document.createElement('style');
      // 为shadow Dom添加样式
      style.textContent = `
        .r-btn {
          position: relative;
          margin-right: 3px;
          display: inline-block;
          padding: 6px 20px;
          border-radius: 30px;
          background-color: #f0f0f0;
          color: #888;
          outline: none;
          border: none;
          box-shadow: inset 0 5px 10px rgba(0,0,0, .3);
          cursor: pointer;
        }
        .r-btn_primary {
          background-color: #06c;
          color: #fff;
        }
        .r-btn_warning {
          background-color: red;
          color: #fff;
        }
      `
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(this._btn);
    }
    connectedCallback(){
      const type = this.getAttribute('type');
      if (type) {
        this._btn.className = `r-btn ${this._type[type]}`
      }
    }
  }
  window.customElements.define('xu-button', Button);
}

export default RButton()
