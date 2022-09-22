(function () {
  const template = document.createElement("template");
  const slot = document.createElement('slot')
  const div = document.createElement('div');
    class Input extends HTMLElement {
      _input: HTMLInputElement | null
      constructor() {
        super()
        const shadow = this.attachShadow({
          mode: 'closed'
        })
        const Input = document.createElement('input')
        const content = template.content.cloneNode(true)  as HTMLElement // 克隆一份 防止重复使用 污染
        this._input = content.querySelector('#caiInput') 
        if(this._input){
            this._input.value = this.getAttribute('value') || ''
            this._input.addEventListener("input", ev => {
                const target = ev.target as HTMLInputElement;
                this.value = target ? target.value : ''
                this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
              });
        }
        this.dispatchEvent(new CustomEvent("change", { detail: 11111 }));
        
        
        shadow.appendChild(content)
  
      }
      get value() {
        return this.getAttribute("value");
      }
      set value(value) {
        if(value !== null){
            this.setAttribute("value", value);
        }
      }
    }
    window.customElements.define('cai-input', Input)
  })()