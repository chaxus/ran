import tabPaneCss from './index.less?inline';
import { adoptSheetText, adoptStyles } from '@/utils/style';
import { Slot } from '@/utils/builder';

interface ExtendParentNode {
  updateAttribute: (key: string, attribute: string, value?: string | null) => void;
}

function CustomElement() {
  if (typeof window !== 'undefined' && !customElements.get('r-tab')) {
    class TabPane extends HTMLElement {
      static get observedAttributes() {
        return ['label', 'key', 'disabled', 'icon', 'effect', 'iconSize', 'sheet'];
      }
      _div: HTMLElement;
      parent: (ParentNode & ExtendParentNode) | undefined | null;
      _shadowDom: ShadowRoot;
      constructor() {
        super();
        this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
        adoptStyles(this._shadowDom, tabPaneCss);

        let slot = this._shadowDom.querySelector('slot') as HTMLSlotElement;
        if (!slot) {
          slot = Slot().part('content').build() as HTMLSlotElement;
          this._shadowDom.appendChild(slot);
        }
        this._div = slot;
      }
      get label() {
        return this.getAttribute('label') || '';
      }
      set label(value) {
        this.setAttribute('label', value);
      }
      get icon() {
        return this.getAttribute('icon');
      }
      set icon(value) {
        if (!value || value === 'false') {
          this.removeAttribute('icon');
        } else {
          this.setAttribute('icon', value);
        }
      }
      get iconSize() {
        return this.getAttribute('iconSize');
      }
      set iconSize(value) {
        if (!value || value === 'false') {
          this.removeAttribute('iconSize');
        } else {
          this.setAttribute('iconSize', value);
        }
      }
      get key() {
        return this.getAttribute('r-key');
      }
      set key(value) {
        if (value) {
          this.setAttribute('r-key', value);
        } else {
          this.removeAttribute('r-key');
        }
      }
      get disabled() {
        return this.getAttribute('disabled');
      }
      set disabled(value) {
        if (!value || value === 'false') {
          this.removeAttribute('disabled');
        } else {
          this.setAttribute('disabled', value);
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
        return this.getAttribute('sheet');
      }
      set sheet(value) {
        this.setAttribute('sheet', value || '');
      }
      handlerExternalCss = () => {
        if (!this.sheet) return;
        adoptSheetText(this._shadowDom, this.sheet);
      };
      onClick(e: Event) {
        console.log('e', e);
      }
      /**
       * @description: 在页面元素都加载完毕后，设置 tab 上的图标
       */
      initAttribute = () => {
        this.parent = this.parentNode as ParentNode & ExtendParentNode;
        this.key && this.parent?.updateAttribute(this.key, 'icon', this.icon);
        this.key && this.parent?.updateAttribute(this.key, 'iconSize', this.iconSize);
        this.key && this.parent?.updateAttribute(this.key, 'effect', this.effect);
      };
      connectedCallback() {
        this.handlerExternalCss();
        this._div.addEventListener('click', this.onClick);
        document.addEventListener('DOMContentLoaded', this.initAttribute);
      }
      disconnectedCallback() {
        document.removeEventListener('DOMContentLoaded', this.initAttribute);
      }
      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (oldValue !== newValue && this.key && this.parent?.updateAttribute) {
          if (name === 'icon') this.parent?.updateAttribute(this.key, 'icon', newValue);
          if (name === 'iconSize') this.parent?.updateAttribute(this.key, 'iconSize', newValue);
          if (name === 'effect') this.parent?.updateAttribute(this.key, 'effect', newValue);
          if (name === 'disabled') this.parent?.updateAttribute(this.key, 'disabled', newValue);
        }
        if (name === 'sheet' && oldValue !== newValue) {
          this.handlerExternalCss();
        }
      }
    }
    customElements.define('r-tab', TabPane);
    return TabPane;
  }
}

export default CustomElement();
