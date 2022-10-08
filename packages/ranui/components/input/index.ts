function Component() {
  const template = document.createElement("template");
  const input = document.createElement('input');
  input.setAttribute('class', 'r-input');
  template.appendChild(input)
  class CustomElement extends HTMLElement {
    static get observedAttributes() { return ['label', 'disabled', 'pattern', 'required', 'placeholder'] }
    _input: HTMLInputElement
    constructor() {
      super()
      const shadowRoot = this.attachShadow({ mode: 'closed' });
      this._input = input.cloneNode(true) as HTMLInputElement
      if (this.value) {
        this._input.value = this.value
      }
      shadowRoot.appendChild(this._input);
    }

    get value() {
      return this.getAttribute("value");
    }
    set value(value) {
      if (value) {
        this.setAttribute("value", value);
      }
    }
    get placeholder() {
      return this.getAttribute('placeholder') || '';
    }
    set placeholder(value) {
      this.setAttribute('placeholder', value);
    }
    get required() {
      return this.getAttribute('required');
    }
    set required(value) {
      if (!value || value === "false") {
        this.removeAttribute('required');
      } else {
        this.setAttribute('required', '');
      }
    }
    get warning() {
      return this.getAttribute('warning');
    }
    get pattern() {
      return this.getAttribute('pattern');
    }
    set pattern(value) {
      if (!value || value === "false") {
        this.removeAttribute('pattern');
      } else {
        this.setAttribute('pattern', value);
      }
    }
    inputValue = (event: Event) => {
      event.stopPropagation();
      const target = event.target as HTMLInputElement;
      this.value = target ? target.value : ''
      this.dispatchEvent(new CustomEvent('input', {
        detail: {
          value: this.value
        }
      }));
    }
    change = () => {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: this.value
        }
      }));
    }
    focus = () => {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: this.value
        }
      }));
    }
    checkout = () => {

    }
    connectedCallback() {
      this._input.addEventListener("input", this.inputValue);
      this._input.addEventListener('change', this.change)
      this._input.addEventListener('focus', this.focus)
    }
    disconnectCallback() {
      this._input.removeEventListener("input", this.inputValue);
      this._input.removeEventListener('change', this.change)
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name == 'placeholder' && this._input) {
        if (newValue !== null) {
          this._input.setAttribute('placeholder', newValue);
        } else {
          this._input.removeAttribute('placeholder');
        }
      }
      if (name == 'required' && this._input) {
        if (newValue && newValue !== 'false') {
          this._input.setAttribute('required', '');
        } else {
          this._input.removeAttribute('required');
        }
      }
      if(name == 'pattern' && this._input){
        if(newValue && newValue !== 'false'){
            this._input.setAttribute('pattern', newValue);
        }else{
            this._input.removeAttribute('pattern');
        }
    }
    }
  }
  window.customElements.define('r-input', CustomElement)
}

export default Component()
