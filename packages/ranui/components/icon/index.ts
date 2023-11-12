import { str2Xml } from 'ranuts';

const X_LINKS_NS = 'http://www.w3.org/1999/xlink';
const X_LINK_HREF = "xlink:href"

function Custom() {
  if (typeof window !== 'undefined' && !customElements.get('r-icon')) {
    class CustomElement extends HTMLElement {
      static get observedAttributes() {
        return ['name', 'size', 'color', 'spin'];
      }
      _icon?: HTMLElement;
      _div: HTMLElement;
      constructor() {
        super();
        this._div = document.createElement('div');
        this._div.setAttribute('class', 'ran-icon');
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(this._div);
      }
      get name() {
        return this.getAttribute('name');
      }
      set name(value) {
        if (value) this.setAttribute('name', value);
      }
      get size() {
        return this.getAttribute('size');
      }
      set size(value) {
        if (value) this.setAttribute('size', value);
      }
      get color() {
        return this.getAttribute('color');
      }
      set color(value) {
        if (value) this.setAttribute('color', value);
      }
      get spin() {
        return this.getAttribute('spin');
      }
      set spin(value) {
        if (value != null) this.setAttribute('spin', value);
      }
      /**
       * @description: 本地加载icon
       */
      loadLocal = () => {
        return new Promise<void>((resolve, reject) => {
          // vite 对动态导入的一些限制 https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
          import(`../../assets/icons/${this.name}.svg`)
            .then((result) => {
              if (result && result.default && result.default._identification) {
                const { data } = result.default;
                this._icon && this._div.removeChild(this._icon);
                this._icon = str2Xml(data, 'image/svg+xml');
                if (this._icon) {
                  this._div.appendChild(this._icon);
                  this.setSize();
                  this.setColor();
                  resolve();
                }
              } else {
                this.loadNs();
                reject(
                  `\n couldn't be loaded by r-icon, message: ${this.name} icon is undefined`,
                );
              }
            })
            .catch((error) => {
              this.loadNs();
              // reject(`\n couldn't be loaded by r-icon, message: ${error}`)
            });
        });
      };
      /**
       * @description: NS加载icon
       */
      loadNs = () => {
        // https://www.iconfont.cn/collections/detail?spm=a313x.7781069.1998910419.dc64b3430&cid=9402
        if (this._icon && this._div) {
          this._div.removeChild(this._icon);
        }
        this._icon = document.createElement('svg');
        this._icon.setAttribute('class', 'icon');
        this._icon.setAttribute('viewBox', '0 0 1024 1024');
        this._icon.setAttribute('width', '100');
        this._icon.setAttribute('height', '100');
        const use = document.createElementNS(X_LINKS_NS, 'use');
        use.setAttributeNS(
          X_LINKS_NS,
          X_LINK_HREF,
          `../../assets/iconfont/icon.svg#icon-${this.name}`,
        );
        this._icon.appendChild(use);
        this._div.appendChild(this._icon);
      };
      /**
       * @description: 根据name属性加载对应的svg
       */
      setIcon = async () => {
        if (this.name) {
          // 本地加载
          this.loadLocal();
          // 网络加载
        }
      };
      /**
       * @description: 设置icon的大小
       */
      setSize = () => {
        if (this._icon && this.size) {
          this._icon.setAttribute('width', this.size);
          this._icon.setAttribute('height', this.size);
        }
      };
      /**
       * @description: 设置icon的颜色
       */
      setColor = () => {
        if (this._icon) {
          this.color
            ? this._icon.setAttribute('fill', this.color)
            : this._icon.setAttribute('fill', 'currentColor');
        }
      };
      /**
       * @description: 设置是否旋转和旋转的速度
       */
      setSpin = () => {
        if (this.spin) {
          this.style.setProperty('animation-duration', `${this.spin}s`);
        }
      };
      connectedCallback() {
        this.setIcon();
      }
      attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
      ) {
        if (newValue !== oldValue) {
          if (name === 'name') this.setIcon();
          if (name === 'size') this.setSize();
          if (name === 'color') this.setColor();
          if (name === 'spin') this.setSpin();
        }
      }
    }
    customElements.define('r-icon', CustomElement);
  }
}
export default Custom();
