class CustomElement extends HTMLElement {
  static get observedAttributes() {
    return ["disabled", "type"];
  }
  _btn: HTMLDivElement;
  constructor() {
    super();
    const slot = document.createElement("slot");
    this._btn = document.createElement("div");
    this._btn.appendChild(slot);
    slot.setAttribute("class", "slot");
    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.appendChild(this._btn);
  }
  get disabled() {
    const disable = this.getAttribute("disabled");
    return disable;
  }
  set disabled(value) {
    if (!value || value === "false") {
      this.removeAttribute("disabled");
    } else {
      this.setAttribute("disabled", value);
    }
  }
  mousedown = (event: MouseEvent) => {
    if (!this.disabled) {
      const { left, top } = this.getBoundingClientRect();
      this.style.setProperty("--ran-x", event.clientX - left + "px");
      this.style.setProperty("--ran-y", event.clientY - top + "px");
    }
  };
  mouseLeave = () => {
    this.style.removeProperty("--ran-x");
    this.style.removeProperty("--ran-y");
  };
  connectedCallback() {
    this._btn.addEventListener("mousedown", this.mousedown);
    this._btn.addEventListener("mouseleave", this.mouseLeave);
  }
  disconnectCallback() {
    this._btn.removeEventListener("mousedown", this.mousedown);
    this._btn.removeEventListener("mouseleave", this.mouseLeave);
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name == "disabled" && this._btn) {
      if (newValue) {
        this._btn.setAttribute("disabled", newValue);
      } else {
        this._btn.removeAttribute("disabled");
      }
    }
  }
}

export default window.customElements.define("r-button", CustomElement);
