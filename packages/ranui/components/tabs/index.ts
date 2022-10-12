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
    /**
     * <div class="tab">
     *   <div class="tab-header">
     *      <div class="tab-header_nav">...</div>
     *      <div class="tab-header_line"></div>
     *   </div>
     *   <div class="tab-content">
     *      <div class="tab-content_wrap">
     *         <slot></slot>
     *      </div>
     *   </div>
     * </div>
     */
    this._container = document.createElement("div");
    this._container.setAttribute("class", "tab");
    this._header = document.createElement("div");
    this._header.setAttribute("class", "tab-header");
    this._nav = document.createElement("div");
    this._nav.setAttribute("class", "tab-header_nav");
    this._line = document.createElement("div");
    this._line.setAttribute("class", "tab-header_line");
    this._content = document.createElement("div");
    this._content.setAttribute("class", "tab-content");
    this._wrap = document.createElement("div");
    this._wrap.setAttribute("class", "tab-content_wrap");
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
      const label = item.getAttribute("label") || '';
      const itemElement = document.createElement('r-button')
      itemElement.setAttribute('class','tab-header_nav__item')
      itemElement.setAttribute('type','text')
      itemElement.innerHTML = label
      this._nav.appendChild(itemElement)
    });
  };

  connectedCallback() {
    this._slot.addEventListener("slotchange", this.listenSlotChange);
  }

  disconnectCallback() {}
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {}
}

function CustomElement() {
  if (!customElements.get("r-tabs")) {
    customElements.define("r-tabs", Tabs);
  }
}

export default CustomElement();
