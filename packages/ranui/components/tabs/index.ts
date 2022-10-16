import { isDisabled } from '@/utils/index'
class Tabs extends HTMLElement {
  static get observedAttributes() {
    return ["active", 'forceRender'];
  }
  _container: HTMLDivElement;
  _header: HTMLDivElement;
  _nav: HTMLDivElement;
  _line: HTMLDivElement;
  _content: HTMLDivElement;
  _wrap: HTMLDivElement;
  _slot: HTMLSlotElement;
  tabHeaderKeyMapIndex: Record<string, number>;
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

    this.tabHeaderKeyMapIndex = {}

    const shadowRoot = this.attachShadow({ mode: "closed" });
    shadowRoot.appendChild(this._container);
  }

  get align() {
    return this.getAttribute("align") || "start";
  }

  set align(value) {
    this.setAttribute("align", value);
  }

  get type() {
    return this.getAttribute("type") || "flat";
  }

  get active() {
    return this.getAttribute("active");
  }

  set active(value) {
    if (value) {
      this.setAttribute("active", value);
      this.setTabLine(value)
      this.setTabContent(value)
    } else {
      this.removeAttribute("active");
    }
  }

  set type(value) {
    this.setAttribute("type", value);
  }
  /**
   * @description: 构建tabPane组件key值和index的映射，同时判断一个tabs下的tabPane key值不能重复
   * @param {string} key
   * @param {number} index
   */
  initTabHeaderKeyMapIndex = (key: string, index: number) => {
    const value = this.tabHeaderKeyMapIndex[key]
    if (value) {
      throw new Error('tab 组件的 key 值存在重复, 或者某个 tab 组件缺少 key 属性')
    } else {
      this.tabHeaderKeyMapIndex[key] = index
    }
  }
  /**
   * @description: 根据传入的tabPane生成tabs的头部
   * @param {Element} tabPane
   * @param {number} index
   * @return {Element}
   */
  createTabHeader(tabPane: Element, index: number) {
    const label = tabPane.getAttribute("label") || '';
    const key = tabPane.getAttribute('key') || `${index}`
    const type = tabPane.getAttribute('type') || 'text'
    this.initTabHeaderKeyMapIndex(key, index)
    const tabHeader = document.createElement('r-button')
    tabHeader.setAttribute('class', 'tab-header_nav__item')
    tabHeader.setAttribute('type', type)
    isDisabled(tabPane) && tabHeader.setAttribute('disabled', '')
    tabHeader.setAttribute('ran-key', key)
    tabHeader.innerHTML = label
    return tabHeader
  }
  /**
   * @description: 通过key值设置tabLine的位置
   * @param {string} key
   */
  setTabLine = (key: string) => {
    if (key) {
      const index = this.tabHeaderKeyMapIndex[key]
      this._line.style.setProperty('transform', `translateX(${100 * index}%)`)
    }
  }
  /**
   * @description: 通过传入的key值设置tabContent
   */
  setTabContent = (key: string) => {
    if (key) {
      const index = this.tabHeaderKeyMapIndex[key]
      this._wrap.style.setProperty('transform', `translateX(${index * -100}%)`)
    }
  }
  /**
   * @description: 根据点击设置tabLine的位置
   * @param {Event} e
   * @param {number} index
   * @param {number} width
   */
  clickTabHead = (e: Event) => {
    const tabHeader = e.target as Element
    const key = tabHeader.getAttribute('ran-key')
    const disabled = isDisabled(tabHeader)
    if (!disabled && key) {
      this.setAttribute('active', key)
      this.setTabLine(key)
      this.setTabContent(key)
    }
  }
  initTabLineWidth = () => {

  }
  /**
   * @description: 初始化tabs的active属性和tabLine,tabContent
   */
  initActive = () => {
    const tabHeaderList = [...this._nav.children]
    const firstTabHeader = tabHeaderList.filter(item => !isDisabled(item)).shift()
    if (!firstTabHeader) return
    const index = tabHeaderList.findIndex(item => item === firstTabHeader)
    const key = firstTabHeader?.getAttribute('ran-key') || `${index}`
    if (this.active === null && key !== null) {
      this.setAttribute('active', `${key}`)
      const { width = 0 } = firstTabHeader.getBoundingClientRect()
      this._line.style.setProperty("width", `${width}px`);
      this.setTabLine(key)
      this.setTabContent(key)
    }
  }
  /**
   * @description: 监听slot组件的添加/删除/替换操作，进行tabs初始化
   * @return {*}
   */
  listenSlotChange = () => {
    const slots = this._slot.assignedElements();
    slots.forEach((item, index) => {
      const tabPane = this.createTabHeader(item, index)
      this._nav.appendChild(tabPane)
      tabPane.addEventListener('click', this.clickTabHead)
    });
    this.initActive()
  };

  connectedCallback() {
    this._slot.addEventListener("slotchange", this.listenSlotChange);
  }

  disconnectCallback() {
    this._slot.removeEventListener("slotchange", this.listenSlotChange);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          active: this.active,
        }
      }));
    }
  }
}

function CustomElement() {
  if (!customElements.get("r-tabs")) {
    customElements.define("r-tabs", Tabs);
  }
}

export default CustomElement();
