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
      // 如果一开始就设置了input的值，则初始化input的值
      if (this.value) {
        this._input.value = this.value
      }
      shadowRoot.appendChild(this._input);
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
      }
    }
    /**
     * @description: 获取input的占位字符
     * @return {String}
     */    
    get placeholder() {
      return this.getAttribute('placeholder') || '';
    }
    /**
     * @description: 设置input的占位字符
     * @param {String} value
     */    
    set placeholder(value) {
      this.setAttribute('placeholder', value);
    }
    /**
     * @description: input是否为必选
     * @return {String}
     */    
    get required() {
      return this.getAttribute('required');
    }
    /**
     * @description: 设置input是否为必选，除非设置成false，否则都是必填
     * @param {*} value
     */    
    set required(value) {
      if (!value || value === "false") {
        this.removeAttribute('required');
      } else {
        this.setAttribute('required', '');
      }
    }
    /**
     * @description: 获取input校验失败的提示
     * @return {String}
     */    
    get warning() {
      return this.getAttribute('warning');
    }
    /**
     * @description: 获取校验的正则
     * @return {String}
     */    
    get pattern() {
      return this.getAttribute('pattern');
    }
    /**
     * @description: 设置input校验的正则
     * @param {*} value
     */    
    set pattern(value) {
      if (!value || value === "false") {
        this.removeAttribute('pattern');
      } else {
        this.setAttribute('pattern', value);
      }
    }
    /**
     * @description: 原生的input方法
     * @param {Event} event
     */    
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
    /**
     * @description: 增加input上change方法
     */    
    change = () => {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          value: this.value
        }
      }));
    }
    /**
     * @description: 增加focus方法
     */    
    focus = () => {
      this.dispatchEvent(new CustomEvent('focus', {
        detail: {
          value: this.value
        }
      }));
    }
    /**
     * @description: 检查校验是否成功
     * @return {Boolean}
     */    
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
