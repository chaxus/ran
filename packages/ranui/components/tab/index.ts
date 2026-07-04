import { isDisabled, RanElement } from '@/utils/index';
import tabCss from './index.less?inline';
import { Div, EventManager, Slot, View } from '@/utils/builder';
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

// Per-instance id source so tab/tabpanel id links are unique across multiple
// <r-tabs> on a page (a counter keeps them stable and SSR-safe).
let tabsSeq = 0;

export class Tabs extends RanElement {
  static get observedAttributes(): string[] {
    return ['active', 'forceRender', 'type', 'align', 'effect', 'sheet'];
  }

  _events = new EventManager();
  _container: HTMLDivElement;
  _header: HTMLDivElement;
  _nav: HTMLDivElement;
  _line: HTMLDivElement;
  _content: HTMLDivElement;
  _wrap: HTMLDivElement;
  _slot: HTMLSlotElement;
  _shadowDom: ShadowRoot;
  _tabsId: number;
  tabHeaderKeyMapIndex: Record<string, number>;

  constructor() {
    super();
    this._tabsId = ++tabsSeq;
    this._shadowDom = ensureShadowRoot(this, tabCss);
    this.tabHeaderKeyMapIndex = {};

    const wrap = ensureShadowElement(
      this._shadowDom,
      '.ran-tab',
      () =>
        Div()
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
          .build() as HTMLDivElement,
    );

    this._container = wrap;
    this._header = wrap.querySelector('.ran-tab-header') as HTMLDivElement;
    this._nav = wrap.querySelector('.ran-tab-header-nav') as HTMLDivElement;
    this._line = wrap.querySelector('.ran-tab-header-line') as HTMLDivElement;
    this._content = wrap.querySelector('.ran-tab-content') as HTMLDivElement;
    this._wrap = wrap.querySelector('.ran-tab-content-wrap') as HTMLDivElement;
    this._slot = wrap.querySelector('slot') as HTMLSlotElement;
    // The header row is the WAI-ARIA tablist; each header's role/selection and the
    // panels' roles are wired up in syncTabsAria once the panes are slotted in.
    this._nav.setAttribute('role', 'tablist');
  }

  get align(): string {
    return getStringAttribute(this, 'align', 'start');
  }
  set align(value: string) {
    this.setAttribute('align', value);
  }

  get type(): string {
    return getStringAttribute(this, 'type', 'flat');
  }
  set type(value: string) {
    this.setAttribute('type', value);
  }

  get active(): string | null {
    return this.getAttribute('active');
  }
  set active(value: string | null) {
    if (value) {
      this.setAttribute('active', value);
      this.setTabLine(value);
      this.setTabContent(value);
      this.syncTabsAria();
    } else {
      this.removeAttribute('active');
    }
  }

  get effect(): string | null {
    return this.getAttribute('effect');
  }
  set effect(value: string | null) {
    if (!value || value === 'false') {
      this.removeAttribute('effect');
    } else {
      this.setAttribute('effect', value);
    }
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(value: string) {
    setStringAttribute(this, 'sheet', value);
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  initTabHeaderKeyMapIndex = (key: string, index: number): void => {
    const value = this.tabHeaderKeyMapIndex[key];
    if (value) {
      throw new Error('tab 组件的 key 值存在重复，或者某个 tab 组件缺少 key 属性');
    } else {
      this.tabHeaderKeyMapIndex[key] = index;
    }
  };

  createTabHeader(tabPane: Element, index: number): HTMLElement {
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

  initTabLineAlignCenter = (): void => {
    const { length } = this._nav.children;
    let left = 0;
    for (let i = 0; i < length; i++) {
      const { width = 0 } = this._nav.children[i].getBoundingClientRect();
      left += width;
    }
    this._line.style.setProperty('left', `calc(50% - ${left / 2}px)`);
  };

  initTabLineAlignEnd = (): void => {
    const { length } = this._nav.children;
    let left = 0;
    for (let i = 0; i < length; i++) {
      const { width = 0 } = this._nav.children[i].getBoundingClientRect();
      left += width;
    }
    this._line.style.setProperty('left', `calc(100% - ${left}px)`);
  };

  setTabLine = (key: string): void => {
    if (key) {
      const index = this.tabHeaderKeyMapIndex[key];
      const TabHeader = this._nav.children[index];
      const { width = 0 } = TabHeader.getBoundingClientRect();
      this._line.style.setProperty('width', `${width}px`);
      let distance = 0;
      for (let i = 0; i < index; i++) {
        const item = this._nav.children[i];
        const { width = 0 } = item.getBoundingClientRect();
        distance += width;
      }
      this._line.style.setProperty('transform', `translateX(${distance}px)`);
    }
  };

  setTabContent = (key: string): void => {
    if (key) {
      const index = this.tabHeaderKeyMapIndex[key];
      this._wrap.style.setProperty('transform', `translateX(${index * -100}%)`);
    }
  };

  clickTabHead = (e: Event): void => {
    // Events crossing the header r-button's shadow boundary retarget to the host.
    const tabHeader = (e.currentTarget as Element) ?? (e.target as Element);
    const key = tabHeader.getAttribute('r-key');
    const disabled = isDisabled(tabHeader);
    if (!disabled && key) this.activateKey(key);
  };

  /** Select a tab by key: move the indicator, slide content, update classes + ARIA. */
  activateKey = (key: string): void => {
    this.setAttribute('active', key);
    this.setTabLine(key);
    this.setTabContent(key);
    const navItems = this._nav.querySelectorAll('.active');
    navItems.forEach((item) => item.classList.remove('active'));
    const index = this.tabHeaderKeyMapIndex[key];
    this._nav.children[index]?.classList.add('active');
    this.syncTabsAria();
  };

  /** The header's focusable/semantic element — the r-button's inner `_btn`. */
  tabFocusable = (header: Element): HTMLElement =>
    (header as unknown as { _btn?: HTMLElement })._btn ?? (header as HTMLElement);
  tabIdFor = (key: string): string => `ran-tab-${this._tabsId}-${key}`;
  panelIdFor = (key: string): string => `ran-tabpanel-${this._tabsId}-${key}`;

  /**
   * Wire the WAI-ARIA tabs relationships: each header becomes role="tab" (on the
   * button's inner focusable element, so it isn't a nested role="button"), with
   * aria-selected + a roving tabindex (only the active tab is tabbable); each pane
   * becomes role="tabpanel" labelled by its tab. Called on slot changes and every
   * selection change.
   */
  syncTabsAria = (): void => {
    const active = this.active;
    const panes = this._slot?.assignedElements?.() ?? [];
    [...this._nav.children].forEach((header, index) => {
      const key = header.getAttribute('r-key') ?? `${index}`;
      const selected = key === active;
      const disabled = isDisabled(header);
      const tab = this.tabFocusable(header);
      tab.setAttribute('role', 'tab');
      tab.id = this.tabIdFor(key);
      tab.setAttribute('aria-controls', this.panelIdFor(key));
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      // Roving tabindex: Tab reaches only the active tab; arrows move within.
      tab.tabIndex = selected && !disabled ? 0 : -1;
      const pane = panes[index];
      if (pane) {
        pane.setAttribute('role', 'tabpanel');
        pane.id = this.panelIdFor(key);
        pane.setAttribute('aria-labelledby', this.tabIdFor(key));
        pane.setAttribute('tabindex', selected ? '0' : '-1');
        if (selected) pane.removeAttribute('aria-hidden');
        else pane.setAttribute('aria-hidden', 'true');
      }
    });
  };

  /** Roving arrow-key navigation over the tablist, with automatic activation. */
  onNavKeydown = (e: KeyboardEvent): void => {
    const navKeys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!navKeys.includes(e.key)) return;
    const headers = [...this._nav.children].filter((item) => !isDisabled(item));
    if (!headers.length) return;
    const currentHost = (e.target as Element)?.closest?.('.tab-header-nav-item') ?? (e.target as Element);
    let idx = headers.findIndex((item) => item === currentHost);
    if (idx < 0) idx = headers.findIndex((item) => item.getAttribute('r-key') === this.active);
    if (idx < 0) idx = 0;
    let next = idx;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % headers.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + headers.length) % headers.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = headers.length - 1;
    e.preventDefault();
    const key = headers[next].getAttribute('r-key');
    if (key) {
      this.activateKey(key);
      this.tabFocusable(headers[next]).focus();
    }
  };

  updateAttribute = (key: string, attribute: string, value: string | null = ''): void => {
    const index = this.tabHeaderKeyMapIndex[key];
    if (key && value && this._nav.children[index]) {
      this._nav.children[index]?.setAttribute(attribute, value);
    } else {
      this._nav.children[index]?.removeAttribute(attribute);
    }
  };

  initActive = (): void => {
    const tabHeaderList = [...this._nav.children];
    const initTabList = tabHeaderList.filter((item) => !isDisabled(item));
    let initTabHeader: Element | undefined;
    if (this.active != null) {
      initTabHeader = initTabList.find((item) => item.getAttribute('r-key') === this.active);
      initTabHeader?.setAttribute('r-key', this.active);
    }
    if (!initTabHeader) {
      initTabHeader = initTabList.shift();
    }
    if (!initTabHeader) return;
    const index = tabHeaderList.findIndex((item) => item === initTabHeader);
    const key = initTabHeader?.getAttribute('r-key') || `${index}`;
    if (key != null) {
      this.setAttribute('active', `${key}`);
      initTabHeader.classList.add('active');
      this.setTabContent(key);
      setTimeout(() => {
        this.setTabLine(key);
      }, 200);
    }
  };

  listenSlotChange = (): void => {
    const slots = this._slot.assignedElements();
    slots.forEach((item, index) => {
      const tabPane = this.createTabHeader(item, index);
      this._nav.appendChild(tabPane);
      tabPane.addEventListener('click', this.clickTabHead);
    });
    this.initActive();
    this.syncTabsAria();
    if (this.align) {
      if (this.align === 'center') this.initTabLineAlignCenter();
      if (this.align === 'end') this.initTabLineAlignEnd();
    }
  };

  connectedCallback(): void {
    this.handlerExternalCss();
    this._events.on(this._slot, 'slotchange', this.listenSlotChange);
    this._events.on(this._nav, 'keydown', this.onNavKeydown as EventListener);
  }

  disconnectedCallback(): void {
    this._events.abort();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) return;
    this.dispatchEvent(new CustomEvent('change', { detail: { active: this.active } }));
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

defineSSR('r-tabs', Tabs as unknown as new () => HTMLElement);
export default Tabs;
