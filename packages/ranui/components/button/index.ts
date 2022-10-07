

function Component() {
  const template = document.createElement("template");
  const slot = document.createElement('slot')
  const btn = document.createElement('div');
  slot.setAttribute('name', 'r-btn_content')
  btn.appendChild(slot)
  template.appendChild(btn)
  class CustomElement extends HTMLElement {
    static get observedAttributes() { return ['disabled'] }
    _btn: Element;
    constructor() {
      super();
      this._btn = btn.cloneNode(true) as HTMLElement
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(this._btn);
    }
    get disabled() {
      const disable = this.getAttribute('disabled')
      return disable
    }
    set disabled(value) {
      if (!value || value === "false") {
        this.removeAttribute('disabled');
      } else {
        this.setAttribute('disabled', value);
      }
    }
    connectedCallback() {
      this._btn.addEventListener('mousedown',  (event:any) => {
        if (!this.disabled) {
          const { left, top } = this.getBoundingClientRect();
          this.style.setProperty('--x', (event.clientX - left) + 'px');
          this.style.setProperty('--y', (event.clientY - top) + 'px');
        }
      })
    }
    attributeChangedCallback (name:string, oldValue:string, newValue:string) {
      if(name == 'disabled' && this._btn){
        if(newValue){
            this._btn.setAttribute('disabled', newValue);
        }else{
            this._btn.removeAttribute('disabled');
        }
    }
    }
  }
  window.customElements.define('r-button', CustomElement);
}

export default Component()
