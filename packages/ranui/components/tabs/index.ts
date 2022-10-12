class TabPane extends HTMLElement {
  static get observedAttributes() {
    return ["active"];
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

  connectedCallback() {}
  disconnectCallback() {}
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue && newValue) {
      // const { emitLabel } = this.parentNode;
      // if (name === "label") {
      //   emitLabel;
      //   this.parentNode?.update &&
      //     this.parentNode.updatalabel(this.key, newValue);
      // }
      // if (name === "disabled") {
      //   this.parentNode?.updatadisabled &&
      //     this.parentNode.updatadisabled(this.key, newValue);
      // }
    }
  }
}

class Tabs extends HTMLElement {
  static get observedAttributes() {
    return ["label", "key", "disabled", "icon"];
  }
  _container: HTMLDivElement;
  _header: HTMLDivElement;
  _nav: HTMLDivElement;
  _line: HTMLDivElement;
  _content: HTMLDivElement;
  _wrap: HTMLDivElement;
  _slot: HTMLSlotElement;
  constructor() {
    super();
    this._container = document.createElement("div");
    this._container.setAttribute("class", "tab");
    this._header = document.createElement("div");
    this._header.setAttribute("class", "tab-header");
    this._nav = document.createElement("div");
    this._nav.setAttribute("class", "tab-header_title");
    this._line = document.createElement("div");
    this._line.setAttribute("class", "tab-header_line");
    this._content = document.createElement("div");
    this._content.setAttribute("class", "tab-content");
    this._wrap = document.createElement("div");
    this._slot = document.createElement("slot");
    this._wrap.appendChild(this._slot);
    this._content.appendChild(this._wrap);
    this._header.appendChild(this._nav);
    this._header.appendChild(this._line);
    this._container.appendChild(this._header);
    this._container.appendChild(this._content);
    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.appendChild(this._container);
  }
  get align() {
    return this.getAttribute("align") || "start";
  }

  get type() {
    return this.getAttribute("type") || "flat";
  }

  get active() {
    return this.getAttribute("active");
  }

  set align(value) {
    this.setAttribute("align", value);
  }

  set active(value) {
    if (value) {
      this.setAttribute("active", value);
    } else {
      this.removeAttribute("active");
    }
  }

  set type(value) {
    this.setAttribute("type", value);
  }
  listenSlotChange = () => {
    const slots = this._slot.assignedElements();
    slots.forEach((item, index) => {
      console.log("item", item, index);
    });
  }
  connectedCallback() {
    this._slot.addEventListener("slotchange", this.listenSlotChange);
  }
  disconnectCallback() {}
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {}
}

function CustomElement() {
  if (!customElements.get("r-tab")) {
    customElements.define("r-tab", TabPane);
  }
  if (!customElements.get("r-tabs")) {
    customElements.define("r-tabs", Tabs);
  }
}

export default CustomElement();
