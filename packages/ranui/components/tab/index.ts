import { addClassToElement, createDocumentFragment } from 'ranuts/utils';
import { isDisabled, removeClassToElementChild } from '../../utils/index';

function CustomElement() {
  if (typeof window !== 'undefined' && !customElements.get('r-tabs')) {
    class Tabs extends HTMLElement {
      static get observedAttributes() {
        return ['active', 'forceRender', 'type', 'align', 'effect'];
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
        this._container = document.createElement('div');
        this._container.setAttribute('class', 'ran-tab');
        this._header = document.createElement('div');
        this._header.setAttribute('class', 'ran-tab-header');
        this._nav = document.createElement('div');
        this._nav.setAttribute('class', 'ran-tab-header-nav');
        this._line = document.createElement('div');
        this._line.setAttribute('class', 'ran-tab-header-line');
        this._content = document.createElement('div');
        this._content.setAttribute('class', 'ran-tab-content');
        this._wrap = document.createElement('div');
        this._wrap.setAttribute('class', 'ran-tab-content-wrap');
        this._slot = document.createElement('slot');
        this._wrap.appendChild(this._slot);
        this._content.appendChild(this._wrap);
        this._header.appendChild(createDocumentFragment([this._nav, this._line])!);
        this._container.appendChild(createDocumentFragment([this._header, this._content])!);
        this.tabHeaderKeyMapIndex = {};

        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(this._container);
      }

      get align() {
        return this.getAttribute('align') || 'start';
      }

      set align(value) {
        this.setAttribute('align', value);
      }

      set type(value) {
        this.setAttribute('type', value);
      }

      get type() {
        return this.getAttribute('type') || 'flat';
      }

      get active() {
        return this.getAttribute('active');
      }

      set active(value) {
        if (value) {
          this.setAttribute('active', value);
          this.setTabLine(value);
          this.setTabContent(value);
        } else {
          this.removeAttribute('active');
        }
      }

      get effect() {
        return this.getAttribute('effect');
      }

      set effect(value) {
        if (!value || value === 'false') {
          this.removeAttribute('effect');
        } else {
          this.setAttribute('effect', value);
        }
      }
      /**
       * @description: 构建 tabPane 组件 key 值和 index 的映射，同时判断一个 tabs 下的 tabPane key 值不能重复
       * @param {string} key
       * @param {number} index
       */
      initTabHeaderKeyMapIndex = (key: string, index: number) => {
        const value = this.tabHeaderKeyMapIndex[key];
        if (value) {
          throw new Error('tab 组件的 key 值存在重复，或者某个 tab 组件缺少 key 属性');
        } else {
          this.tabHeaderKeyMapIndex[key] = index;
        }
      };
      /**
       * @description: 根据传入的 tabPane 生成 tabs 的头部
       * @param {Element} tabPane
       * @param {number} index
       * @return {Element}
       */
      createTabHeader(tabPane: Element, index: number) {
        const label = tabPane.getAttribute('label') || '';
        const icon = tabPane.getAttribute('icon') || '';
        const iconSize = tabPane.getAttribute('iconSize') || '';
        const key = tabPane.getAttribute('r-key') || `${index}`;
        const type = tabPane.getAttribute('type') || 'text';
        this.initTabHeaderKeyMapIndex(key, index);
        const tabHeader = document.createElement('r-button');
        tabHeader.setAttribute('class', 'tab-header-nav-item');
        tabHeader.setAttribute('type', type);
        icon && tabHeader.setAttribute('icon', icon);
        iconSize && tabHeader.setAttribute('iconSize', iconSize);
        isDisabled(tabPane) && tabHeader.setAttribute('disabled', '');
        tabHeader.setAttribute('r-key', key);
        if (this.effect) {
          tabPane.setAttribute('effect', this.effect);
          this._line.style.setProperty('display', 'none');
        }
        tabPane.setAttribute('r-key', key);
        tabHeader.innerHTML = label;
        return tabHeader;
      }
      /**
       * @description: 初始化 tabLine 的位置，主要是当 tabs 的 align 属性为 center 时需要处理
       */
      initTabLineAlignCenter = () => {
        const { length } = this._nav.children;
        let left = 0;
        for (let i = 0; i < length; i++) {
          const { width = 0 } = this._nav.children[i].getBoundingClientRect();
          left += width;
        }
        this._line.style.setProperty('left', `calc(50% - ${left / 2}px)`);
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
        this._line.style.setProperty('left', `calc(100% - ${left}px)`);
      };
      /**
       * @description: 通过key值设置tabLine的位置
       * @param {string} key
       */
      setTabLine = (key: string) => {
        if (key) {
          const index = this.tabHeaderKeyMapIndex[key];
          // 计算 tabHeader 的宽度，给 tabLine 赋值
          const TabHeader = this._nav.children[index];
          const { width = 0 } = TabHeader.getBoundingClientRect();
          this._line.style.setProperty('width', `${width}px`);
          // 计算 tabLine 的移动距离
          let distance = 0;
          for (let i = 0; i < index; i++) {
            const item = this._nav.children[i];
            const { width = 0 } = item.getBoundingClientRect();
            distance += width;
          }
          // 设置移动的距离
          this._line.style.setProperty('transform', `translateX(${distance}px)`);
        }
      };
      /**
       * @description: 通过传入的key值设置tabContent
       */
      setTabContent = (key: string) => {
        if (key) {
          const index = this.tabHeaderKeyMapIndex[key];
          this._wrap.style.setProperty('transform', `translateX(${index * -100}%)`);
        }
      };
      /**
       * @description: 根据点击设置 tabLine 的位置
       * @param {Event} e
       * @param {number} index
       * @param {number} width
       */
      clickTabHead = (e: Event) => {
        const tabHeader = e.target as Element;
        // 移动元素到可视区域内
        // tabHeader.scrollIntoView({ block: "center", inline: "center" });
        // TODO: tab 超出屏幕滚动问题
        const key = tabHeader.getAttribute('r-key');
        const disabled = isDisabled(tabHeader);
        if (!disabled && key) {
          this.setAttribute('active', key);
          this.setTabLine(key);
          this.setTabContent(key);
          removeClassToElementChild(this._nav, 'active');
          addClassToElement(tabHeader, 'active');
        }
      };
      /**
       * @description: tabPane 设置属性，需要在 tabs 上展示时触发
       * @param {string} key
       * @param {string} value
       */
      updateAttribute = (key: string, attribute: string, value: string | null = '') => {
        const index = this.tabHeaderKeyMapIndex[key];
        if (key && value && this._nav.children[index]) {
          this._nav.children[index]?.setAttribute(attribute, value);
        } else {
          this._nav.children[index]?.removeAttribute(attribute);
        }
      };
      /**
       * @description: 初始化 tabs 的 active 属性和 tabLine,tabContent
       */
      initActive = () => {
        const tabHeaderList = [...this._nav.children];
        const initTabList = tabHeaderList.filter((item) => !isDisabled(item));
        let initTabHeader: Element | undefined;
        // 如果有 active，找到 active 对应的标签，设置活跃标签
        if (this.active != null) {
          initTabHeader = initTabList.find((item) => item.getAttribute('r-key') === this.active);
          initTabHeader?.setAttribute('r-key', this.active);
        }
        // 如果没有 active，则默认第一个标签为活跃标签
        if (!initTabHeader) {
          initTabHeader = initTabList.shift();
        }
        // 如果都没有，则返回
        if (!initTabHeader) return;
        const index = tabHeaderList.findIndex((item) => item === initTabHeader);
        const key = initTabHeader?.getAttribute('r-key') || `${index}`;
        if (key != null) {
          this.setAttribute('active', `${key}`);
          addClassToElement(initTabHeader, 'active');
          this.setTabContent(key);
          setTimeout(() => {
            // icon 渲染过慢的问题
            this.setTabLine(key);
          }, 200);
        }
      };
      /**
       * @description: 监听 slot 组件的添加/删除/替换操作，进行 tabs 初始化
       * @return {*}
       */
      listenSlotChange = () => {
        const slots = this._slot.assignedElements();
        slots.forEach((item, index) => {
          const tabPane = this.createTabHeader(item, index);
          this._nav.appendChild(tabPane);
          tabPane.addEventListener('click', this.clickTabHead);
        });
        this.initActive();
        // 如果存在 align 属性，进行设置 tabLine 的初始位置
        if (this.align) {
          if (this.align === 'center') this.initTabLineAlignCenter();
          if (this.align === 'end') this.initTabLineAlignEnd();
        }
      };
      /**
       * @description: 初始化 tab
       */
      initTab = () => {
        this._slot.addEventListener('slotchange', this.listenSlotChange);
      };
      /**
       * @description: 卸载 tab
       */
      unloadTab = () => {
        this._slot.removeEventListener('slotchange', this.listenSlotChange);
      };

      connectedCallback() {
        this.initTab();
      }

      disconnectCallback() {
        this.unloadTab();
      }

      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
          this.dispatchEvent(
            // eslint-disable-next-line  n/no-unsupported-features/node-builtins
            new CustomEvent('change', {
              detail: {
                active: this.active,
              },
            }),
          );
          // 改变 align 属性，进行设置 tabLine 的初始位置
          if (name === 'align') {
            if (newValue === 'center') this.initTabLineAlignCenter();
            if (newValue === 'end') this.initTabLineAlignEnd();
          }
          if (name === 'effect') {
            const tabHeaderList = [...this._nav.children];
            tabHeaderList.forEach((item) => {
              if (!this.effect || this.effect === 'false') {
                item.removeAttribute('effect');
              } else {
                item.setAttribute('effect', newValue);
              }
            });
          }
          if (name === 'active') {
            this.setAttribute(name, newValue);
          }
        }
      }
    }
    customElements.define('r-tabs', Tabs);
    return Tabs;
  }
}

export default CustomElement();
