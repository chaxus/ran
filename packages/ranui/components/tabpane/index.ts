import tabPaneCss from './index.less?inline';
import { Slot, EventManager } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import { ensureShadowElement, ensureShadowRoot, setStringAttribute, syncSheetAttribute } from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

interface ExtendParentNode {
  updateAttribute: (key: string, attribute: string, value?: string | null) => void;
}

export class TabPane extends RanElement {
  static get observedAttributes() {
    return ['label', 'key', 'disabled', 'icon', 'effect', 'iconSize', 'sheet'];
  }
  _events = new EventManager();
  _div: HTMLElement;
  parent: (ParentNode & ExtendParentNode) | undefined | null;
  _shadowDom: ShadowRoot;
  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, tabPaneCss);
    const slot = ensureShadowElement(
      this._shadowDom,
      'slot',
      () => Slot().part('content').build() as HTMLSlotElement,
    );
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
    setStringAttribute(this, 'sheet', value);
  }
  handlerExternalCss = () => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };
  initAttribute = () => {
    this.parent = this.parentNode as ParentNode & ExtendParentNode;
    if (this.key) {
      this.parent?.updateAttribute(this.key, 'icon', this.icon);
      this.parent?.updateAttribute(this.key, 'iconSize', this.iconSize);
      this.parent?.updateAttribute(this.key, 'effect', this.effect);
    }
  };
  connectedCallback() {
    this.handlerExternalCss();
    this._events.on(document, 'DOMContentLoaded', this.initAttribute);
  }
  disconnectedCallback() {
    this._events.abort();
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    if (this.key && this.parent?.updateAttribute) {
      if (name === 'icon') this.parent?.updateAttribute(this.key, 'icon', newValue);
      if (name === 'iconSize') this.parent?.updateAttribute(this.key, 'iconSize', newValue);
      if (name === 'effect') this.parent?.updateAttribute(this.key, 'effect', newValue);
      if (name === 'disabled') this.parent?.updateAttribute(this.key, 'disabled', newValue);
    }
    if (name === 'sheet') this.handlerExternalCss();
  }
}

defineSSR('r-tab', TabPane as unknown as new () => HTMLElement);
export default TabPane;
