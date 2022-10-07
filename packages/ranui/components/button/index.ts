

function Component() {
  const template = document.createElement("template");
  const slot = document.createElement('slot')
  const btn = document.createElement('div');
  slot.setAttribute('name', 'r-btn_content')
  btn.appendChild(slot)
  template.appendChild(btn)
  class CustomElement extends HTMLElement {
    static get observedAttributes() { return ['disabled'] }
    _btn: HTMLDivElement;
    constructor() {
      super();
      this._btn = btn.cloneNode(true) as HTMLDivElement
      const shadowRoot = this.attachShadow({ mode: "closed" });
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
    mouseMove = (event: MouseEvent) => {
      if (!this.disabled) {
        const { left, top } = this.getBoundingClientRect();
        this.style.setProperty('--ran-x', (event.clientX - left) + 'px');
        this.style.setProperty('--ran-y', (event.clientY - top) + 'px');
      }
    }
    mouseLeave = () => {
      this.style.removeProperty('--ran-x');
      this.style.removeProperty('--ran-y');
    }
    connectedCallback() {
      this._btn.addEventListener('mousemove', this.mouseMove)
      this._btn.addEventListener('mouseleave', this.mouseLeave)
    }
    disconnectCallback(){
      this._btn.removeEventListener('mousemove', this.mouseMove)
      this._btn.removeEventListener('mouseleave', this.mouseLeave)
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name == 'disabled' && this._btn) {
        if (newValue) {
          this._btn.setAttribute('disabled', newValue);
        } else {
          this._btn.removeAttribute('disabled');
        }
      }
    }
  }
  window.customElements.define('r-button', CustomElement);
}

export default Component()
