import {
  isDisabled,
  setElementClass,
  deleteElementChildClass,
} from "@/utils/index";


function CustomElement() {
  if (typeof window !== "undefined" && !customElements.get("r-tabs")) {
    class Tabs extends HTMLElement {
      static get observedAttributes() {
        return ["active", "forceRender", "type", "align"];
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
    
        this.tabHeaderKeyMapIndex = {};
    
        const shadowRoot = this.attachShadow({ mode: "closed" });
        shadowRoot.appendChild(this._container);
      }
    
      get align() {
        return this.getAttribute("align") || "start";
      }
    
      set align(value) {
        this.setAttribute("align", value);
      }
    
      set type(value) {
        this.setAttribute("type", value);
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
          this.setTabLine(value);
          this.setTabContent(value);
        } else {
          this.removeAttribute("active");
        }
      }
      /**
       * @description: 构建tabPane组件key值和index的映射，同时判断一个tabs下的tabPane key值不能重复
       * @param {string} key
       * @param {number} index
       */
      initTabHeaderKeyMapIndex = (key: string, index: number) => {
        const value = this.tabHeaderKeyMapIndex[key];
        if (value) {
          throw new Error(
            "tab 组件的 key 值存在重复, 或者某个 tab 组件缺少 key 属性"
          );
        } else {
          this.tabHeaderKeyMapIndex[key] = index;
        }
      };
      /**
       * @description: 根据传入的tabPane生成tabs的头部
       * @param {Element} tabPane
       * @param {number} index
       * @return {Element}
       */
      createTabHeader(tabPane: Element, index: number) {
        const label = tabPane.getAttribute("label") || "";
        const key = tabPane.getAttribute("ranKey") || `${index}`;
        const type = tabPane.getAttribute("type") || "text";
        this.initTabHeaderKeyMapIndex(key, index);
        const tabHeader = document.createElement("r-button");
        tabHeader.setAttribute("class", "tab-header_nav__item");
        tabHeader.setAttribute("type", type);
        isDisabled(tabPane) && tabHeader.setAttribute("disabled", "");
        tabHeader.setAttribute("ran-key", key);
        tabHeader.innerHTML = label;
        return tabHeader;
      }
      /**
       * @description: 初始化tabLine的位置，主要是当tabs的align属性为center时需要处理
       */
      initTabLineAlignCenter = () => {
        const { length } = this._nav.children;
        let left = 0;
        for (let i = 0; i < length; i++) {
          const { width = 0 } = this._nav.children[i].getBoundingClientRect();
          left += width;
        }
        this._line.style.setProperty("left", `calc(50% - ${left / 2}px)`);
      };
      /**
       * @description: 初始化tabLine的位置，主要是当tabs的align属性为end时需要处理
       */
      initTabLineAlignEnd = () => {
        const { length } = this._nav.children;
        let left = 0;
        for (let i = 0; i < length; i++) {
          const { width = 0 } = this._nav.children[i].getBoundingClientRect();
          left += width;
        }
        this._line.style.setProperty("left", `calc(100% - ${left}px)`);
      };
      /**
       * @description: 通过key值设置tabLine的位置
       * @param {string} key
       */
      setTabLine = (key: string) => {
        if (key) {
          const index = this.tabHeaderKeyMapIndex[key];
          // 计算tabHeader的宽度，给tabLine赋值
          const TabHeader = this._nav.children[index];
          const { width = 0 } = TabHeader.getBoundingClientRect();
          this._line.style.setProperty("width", `${width}px`);
          // 计算tabLine的移动距离
          let distance = 0;
          for (let i = 0; i < index; i++) {
            const item = this._nav.children[i];
            const { width = 0 } = item.getBoundingClientRect();
            distance += width;
          }
          // 设置移动的距离
          this._line.style.setProperty("transform", `translateX(${distance}px)`);
        }
      };
      /**
       * @description: 通过传入的key值设置tabContent
       */
      setTabContent = (key: string) => {
        if (key) {
          const index = this.tabHeaderKeyMapIndex[key];
          this._wrap.style.setProperty("transform", `translateX(${index * -100}%)`);
        }
      };
      /**
       * @description: 根据点击设置tabLine的位置
       * @param {Event} e
       * @param {number} index
       * @param {number} width
       */
      clickTabHead = (e: Event) => {
        const tabHeader = e.target as Element;
        // 移动元素到可视区域内
        // tabHeader.scrollIntoView({ block: "center", inline: "center" });
        // TODO: tab超出屏幕滚动问题
        const key = tabHeader.getAttribute("ran-key");
        const disabled = isDisabled(tabHeader);
        if (!disabled && key) {
          this.setAttribute("active", key);
          this.setTabLine(key);
          this.setTabContent(key);
          deleteElementChildClass(this._nav, "active");
          setElementClass(tabHeader, "active");
        }
      };
      /**
       * @description: 初始化tabs的active属性和tabLine,tabContent
       */
      initActive = () => {
        const tabHeaderList = [...this._nav.children];
        const initTabList = tabHeaderList.filter((item) => !isDisabled(item));
        let initTabHeader: Element | undefined;
        // 如果有active，找到active对应的标签，设置活跃标签
        if (this.active !== null) {
          initTabHeader = initTabList.find((item,index)=>((item.getAttribute("ran-key") || `${index}`) === this.active));
        }
        // 如果没有active，则默认第一个标签为活跃标签
        if(!initTabHeader){
          initTabHeader = initTabList.shift();
        }
        // 如果都没有，则返回
        if (!initTabHeader) return;
        const index = tabHeaderList.findIndex((item) => item === initTabHeader);
        const key = initTabHeader?.getAttribute("ran-key") || `${index}`;
        if (key !== null) {
            this.setAttribute("active", `${key}`);
            setElementClass(initTabHeader, "active");
            const { width = 0 } = initTabHeader.getBoundingClientRect();
            this._line.style.setProperty("width", `${width}px`);
            this.setTabLine(key);
            this.setTabContent(key);
        }
      };
      /**
       * @description: 监听slot组件的添加/删除/替换操作，进行tabs初始化
       * @return {*}
       */
      listenSlotChange = () => {
        const slots = this._slot.assignedElements();
        slots.forEach((item, index) => {
          const tabPane = this.createTabHeader(item, index);
          this._nav.appendChild(tabPane);
          tabPane.addEventListener("click", this.clickTabHead);
        });
        this.initActive();
        // 如果存在align属性，进行设置tabLine的初始位置
        if (this.align) {
          if (this.align === "center") this.initTabLineAlignCenter();
          if (this.align === "end") this.initTabLineAlignEnd();
        }
      };
      /**
       * @description: 初始化tab
       */  
      initTab = () => {
        this._slot.addEventListener("slotchange", this.listenSlotChange);
      }
      /**
       * @description: 卸载tab
       */  
      unloadTab = () => {
        this._slot.removeEventListener("slotchange", this.listenSlotChange);
      }
    
      connectedCallback() {
        this.initTab()
      }
    
      disconnectCallback() {
        this.unloadTab()
      }
    
      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
          this.dispatchEvent(
            new CustomEvent("change", {
              detail: {
                active: this.active,
              },
            })
          );
        }
        // 改变align属性，进行设置tabLine的初始位置
        if (name === "align") {
          if (newValue === "center") this.initTabLineAlignCenter();
          if (newValue === "end") this.initTabLineAlignEnd();
        }
      }
    }
    customElements.define("r-tabs", Tabs);
  }
}

export default CustomElement();
