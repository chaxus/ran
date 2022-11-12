

function CustomElement() {
  if (typeof window !== "undefined" && !customElements.get("r-tab")) {
    class TabPane extends HTMLElement {
      static get observedAttributes() {
        return ["label", "key", "disabled", "icon"];
      }
      _div: HTMLElement;
      constructor() {
        super();
        this._div = document.createElement("slot");
        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.appendChild(this._div);
      }
      get label() {
        return this.getAttribute("label") || "";
      }
      set label(value) {
        this.setAttribute("label", value);
      }
      get icon() {
        return this.getAttribute("icon");
      }
    
      get key() {
        return this.getAttribute("key");
      }
      set key(value) {
        if (value) {
          this.setAttribute("key", value);
        } else {
          this.removeAttribute("key");
        }
      }
      get disabled() {
        return this.getAttribute("disabled");
      }
      set disabled(value) {
        if (!value || value === "false") {
          this.removeAttribute("disabled");
        } else {
          this.setAttribute("disabled", value);
        }
      }
      onClick(e: Event) {
        console.log('e',e);
      }
      connectedCallback() {
        this._div.addEventListener('click', this.onClick)
      }
      disconnectCallback() { }
      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        // if (oldValue !== newValue && newValue) {
          // const { emitLabel } = this.parentNode;
          // if (name === "label") {
          //   emitLabel;
          //   this.parentNode?.update &&
          //     this.parentNode.updatalabel(this.key, newValue);
          // }
          if (name === "disabled") {
            // TODO 设置disabled或者key之后，会影响父组件
            // console.log('this.parentNode-->', this.parentElement,this.parentNode);
          }
      }
    }
    customElements.define("r-tab", TabPane);
  }
}

export default CustomElement()
