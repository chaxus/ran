function RButton() {
  const template = document.createElement("template");
  const slot = document.createElement('slot')
  const btn = document.createElement('div');
  btn.setAttribute('class', 'r-btn r-btn_default');
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
        'default': 'r-btn_default'
      }
      this._btn = btn.cloneNode(true) as Element
      const shadowRoot = this.attachShadow({ mode: 'closed' });
      // 创建样式
      const style = document.createElement('style');
      // 为shadow Dom添加样式
      style.textContent = `
        .r-btn {
          position: relative;
          display: inline-block;
          font-weight: 400;
          white-space: nowrap;
          text-align: center;
          background-image: none;
          border: 1px solid transparent;
          box-shadow: 0 2px #00000004;
          cursor: pointer;
          transition: all .3s cubic-bezier(.645,.045,.355,1);
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          touch-action: manipulation;
          height: 22px;
          line-height: 22px;
          padding: 4px 15px;
          font-size: 14px;
          border-radius: 2px;
          color: #000000d9;
          border-color: #d9d9d9;
          background: #fff
        }
        .r-btn,.r-btn:active,.r-btn:focus {
          outline: 0
        }
        .r-btn_primary {
          border-color: #1890ff;
          background-color: #1890ff;
          color: #fff;
        }
        .r-btn_warning {
          border-color: #ff4d4f;
          background-color: #ff4d4f;
          color: #fff;
        }
        .r-btn_default:hover {
          border-color: #1890ff;
          color: #1890ff;
        }
        .r-btn_primary:hover{
          background-color: #40a9ff;
          color: #fff;
        }
        .r-btn_warning:hover {
          background-color: #ff7875;
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
  window.customElements.define('r-button', Button);
}

export default RButton()
