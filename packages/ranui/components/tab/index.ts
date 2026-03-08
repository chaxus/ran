import { isDisabled } from '../../utils/index';
import tabCss from './index.less?inline';
import { Div, Slot, View } from '@/utils/builder';
import { adoptSheetText, adoptStyles } from '@/utils/style';

function CustomElement() {
  if (typeof window !== 'undefined' && !customElements.get('r-tabs')) {
    class Tabs extends HTMLElement {
      static get observedAttributes() {
        return ['active', 'forceRender', 'type', 'align', 'effect', 'sheet'];
      }
      _container: HTMLDivElement;
      _header: HTMLDivElement;
      _nav: HTMLDivElement;
      _line: HTMLDivElement;
      _content: HTMLDivElement;
      _wrap: HTMLDivElement;
      _slot: HTMLSlotElement;
      _shadowDom: ShadowRoot;
      tabHeaderKeyMapIndex: Record<string, number>;
      constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        this._shadowDom = shadowRoot;
        adoptStyles(shadowRoot, tabCss);
        this.tabHeaderKeyMapIndex = {};

        let wrap = shadowRoot.querySelector('.ran-tab') as HTMLDivElement;
        if (!wrap) {
          wrap = Div()
            .class('ran-tab')
            .part('tabs')
            .children(
              Div()
                .class('ran-tab-header')
                .part('header')
                .children(
                  Div().class('ran-tab-header-nav').part('nav'),
                  Div().class('ran-tab-header-line').part('indicator'),
                ),
              Div()
                .class('ran-tab-content')
                .part('content')
                .children(Div().class('ran-tab-content-wrap').part('content-wrap').children(Slot())),
            )
            .build() as HTMLDivElement;
          shadowRoot.appendChild(wrap);
        }

        this._container = wrap;
        this._header = wrap.querySelector('.ran-tab-header') as HTMLDivElement;
        this._nav = wrap.querySelector('.ran-tab-header-nav') as HTMLDivElement;
        this._line = wrap.querySelector('.ran-tab-header-line') as HTMLDivElement;
        this._content = wrap.querySelector('.ran-tab-content') as HTMLDivElement;
        this._wrap = wrap.querySelector('.ran-tab-content-wrap') as HTMLDivElement;
        this._slot = wrap.querySelector('slot') as HTMLSlotElement;
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

      get sheet() {
        return this.getAttribute('sheet') || '';
      }

      set sheet(value) {
        this.setAttribute('sheet', value || '');
      }

      handlerExternalCss = () => {
        if (!this.sheet) return;
        adoptSheetText(this._shadowDom, this.sheet);
      };
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
      createTabHeader(tabPane: Element, index: number) {
        const label = tabPane.getAttribute('label') || '';
        const icon = tabPane.getAttribute('icon') || '';
        const iconSize = tabPane.getAttribute('iconSize') || '';
        const key = tabPane.getAttribute('r-key') || `${index}`;
        const type = tabPane.getAttribute('type') || 'text';
        this.initTabHeaderKeyMapIndex(key, index);

        const builder = View('r-button').class('tab-header-nav-item').attr('type', type).attr('r-key', key).text(label);

        if (icon) builder.attr('icon', icon);
        if (iconSize) builder.attr('iconSize', iconSize);
        if (isDisabled(tabPane)) builder.attr('disabled', '');

        if (this.effect) {
          tabPane.setAttribute('effect', this.effect);
          this._line.style.setProperty('display', 'none');
        }
        tabPane.setAttribute('r-key', key);
        return builder.build();
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
          const navItems = this._nav.querySelectorAll('.active');
          navItems.forEach((item) => item.classList.remove('active'));
          tabHeader.classList.add('active');
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
          initTabHeader.classList.add('active');
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
        this.handlerExternalCss();
        this.initTab();
      }

      disconnectedCallback() {
        this.unloadTab();
      }

      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue) {
          this.dispatchEvent(
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
          if (name === 'sheet') {
            this.handlerExternalCss();
          }
        }
      }
    }
    customElements.define('r-tabs', Tabs);
    return Tabs;
  }
}

export default CustomElement();
