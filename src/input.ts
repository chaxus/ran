(function () {
    const template = document.createElement('template')
    template.innerHTML = `
    <style>
      .cai-input {
        
      }
    </style>
    <input type="text" id="caiInput">
    `
    class Input extends HTMLElement {
      constructor() {
        super()
        const shadow = this.attachShadow({
          mode: 'closed'
        })
  
        const content = template.content.cloneNode(true)  // 克隆一份 防止重复使用 污染
        this._input = content.querySelector('#caiInput')
        this._input.value = this.getAttribute('value')
        this.dispatchEvent(new CustomEvent("change", { detail: 11111 }));
        
        this._input.addEventListener("input", ev => {
          const target = ev.target;
          const value = target.value;
          this.value = value;
          this.dispatchEvent(new CustomEvent("change", { detail: value }));
        });
        shadow.appendChild(content)
  
      }
      get value() {
        return this.getAttribute("value");
      }
      set value(value) {
        this.setAttribute("value", value);
      }
    }
    window.customElements.define('cai-input', Input)
  })()