
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
      this._btn = btn.cloneNode(true) as HTMLElement
      const shadowRoot = this.attachShadow({ mode: "closed" });
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
