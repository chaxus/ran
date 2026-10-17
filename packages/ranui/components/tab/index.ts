// NAMING NOTE: this directory/class is "tab"/Tabs, registering the *container*
// element `<r-tabs>`. The individual pane element `<r-tab>` (singular) lives in
// `../tabpane/` as class TabPane — the directory names are effectively swapped
// from what the registered tags would suggest. Left as-is because `ranui/tab`
// and `ranui/tabpane` are both public npm subpath exports; renaming either would
// break real consumers' import paths.
import { isDisabled, RanElement } from '@/utils/index';
import tabCss from './index.less?inline';
import { createRef, Div, EventManager, Slot, View } from '@/utils/builder';
import {
  ensureShadowRoot,
  getStringAttribute,
  setStringAttribute,
  shadowPart,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

// Per-instance id source so tab/tabpanel id links are unique across multiple
// <r-tabs> on a page (a counter keeps them stable and SSR-safe).
let tabsSeq = 0;

export class Tabs extends RanElement {
  static get observedAttributes(): string[] {
    return ['active', 'type', 'align', 'effect', 'sheet'];
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
  _navResizeObserver?: ResizeObserver;
  _paneObserver?: MutationObserver;

  constructor() {
    super();
    this._tabsId = ++tabsSeq;
    this._shadowDom = ensureShadowRoot(this, tabCss);
    this.tabHeaderKeyMapIndex = Object.create(null);
    const headerRef = createRef<HTMLDivElement>();
    const navRef = createRef<HTMLDivElement>();
    const lineRef = createRef<HTMLDivElement>();
    const contentRef = createRef<HTMLDivElement>();
    const wrapRef = createRef<HTMLDivElement>();
    const slotRef = createRef<HTMLSlotElement>();

    const wrap = Div()
      .class('ran-tab')
      .part('tabs')
      .children(
        Div()
          .class('ran-tab-header')
          .ref(headerRef)
          .part('header')
          .children(
            Div().class('ran-tab-header-nav').ref(navRef).part('nav'),
            Div().class('ran-tab-header-line').ref(lineRef).part('indicator'),
          ),
        Div()
          .class('ran-tab-content')
          .ref(contentRef)
          .part('content')
          .children(
            Div().class('ran-tab-content-wrap').ref(wrapRef).part('content-wrap').children(Slot().ref(slotRef)),
          ),
      )
      .build() as HTMLDivElement;
    this._shadowDom.appendChild(wrap);

    this._container = wrap;
    this._header = shadowPart(headerRef, 'header');
    this._nav = shadowPart(navRef, 'header nav');
    this._line = shadowPart(lineRef, 'header line');
    this._content = shadowPart(contentRef, 'content');
    this._wrap = shadowPart(wrapRef, 'content wrap');
    this._slot = shadowPart(slotRef, 'slot');
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
      this.activateKey(value);
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
    if (Object.hasOwn(this.tabHeaderKeyMapIndex, key)) {
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
      if (!TabHeader) return;
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

  /**
   * The sliding indicator's `left`/`width`/`transform` are literal `px` values
   * computed once in `setTabLine` from `getBoundingClientRect()` — they don't
   * recompute on their own when the nav reflows (window resize, a sidebar
   * collapsing, label text wrapping differently, fonts loading). A
   * `ResizeObserver` on `_nav` catches all of those, not just a window
   * `resize` event, mirroring `r-select`/`r-popover`'s reposition-on-resize
   * for their portaled panels (see CLAUDE.md's floating-overlay-drift pitfall
   * — this is the same class of bug for an in-flow indicator).
   */
  _onNavResize = (): void => {
    if (this.active) this.setTabLine(this.active);
  };

  _attachNavResizeObserver = (): void => {
    if (typeof ResizeObserver === 'undefined') return;
    this._navResizeObserver ??= new ResizeObserver(this._onNavResize);
    this._navResizeObserver.disconnect();
    this._navResizeObserver.observe(this._nav);
    // A selected line header can resize without changing the full-width nav.
    // Observe the reconciled headers too, and release removed ones.
    [...this._nav.children].forEach((header) => this._navResizeObserver!.observe(header, { box: 'border-box' }));
  };

  setTabContent = (key: string): void => {
    if (key) {
      const index = this.tabHeaderKeyMapIndex[key];
      this._wrap.style.setProperty('transform', `translateX(${index * -100}%)`);
    }
  };

  clickTabHead = (e: Event): void => {
    // Events crossing the header r-button's shadow boundary retarget to the host.
    const tabHeader = (e.target as Element)?.closest?.('.tab-header-nav-item') ?? (e.currentTarget as Element);
    if (!tabHeader || tabHeader === this._nav) return;
    const key = tabHeader.getAttribute('r-key');
    const disabled = isDisabled(tabHeader);
    if (!disabled && key) this.activateKey(key);
  };

  /** Select a tab by key: move the indicator, slide content, update classes + ARIA. */
  activateKey = (key: string): void => {
    this.setAttribute('active', key);
    this._syncActiveTab();
  };

  private _syncActiveTab = (): void => {
    const key = this.active;
    const valid = key !== null && Object.hasOwn(this.tabHeaderKeyMapIndex, key);
    const index = valid ? this.tabHeaderKeyMapIndex[key] : -1;
    [...this._nav.children].forEach((item, position) => item.classList.toggle('active', position === index));
    if (valid) {
      // Line tabs change border geometry with selection; measure after styling.
      this.setTabLine(key);
      this.setTabContent(key);
    }
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

  private _restoreFocus = (target?: Element): void => {
    // A change listener may already have handed focus to another control.
    let root = this.getRootNode() as Document | ShadowRoot;
    let owner: Element | undefined;
    let focusAvailable = true;
    while (focusAvailable) {
      const activeElement = root.activeElement;
      focusAvailable = !activeElement || activeElement === (owner ?? this) || activeElement === this.ownerDocument.body;
      if (!focusAvailable || !('host' in root)) break;
      owner = root.host;
      root = owner.getRootNode() as Document | ShadowRoot;
    }
    if (focusAvailable) {
      if (target) {
        if (this._shadowDom.activeElement !== target) this.tabFocusable(target).focus();
      } else {
        if (!this.hasAttribute('tabindex')) this.tabIndex = -1;
        this.focus();
      }
    }
  };

  updateAttribute = (key: string, attribute: string, value: string | null = ''): void => {
    const index = this.tabHeaderKeyMapIndex[key];
    const focused = this._shadowDom.activeElement === this._nav.children[index];
    if (key && value && this._nav.children[index]) {
      this._nav.children[index]?.setAttribute(attribute, value);
    } else {
      this._nav.children[index]?.removeAttribute(attribute);
    }
    if (attribute === 'disabled') {
      this.initActive(index);
      this.syncTabsAria();
      const active = this.active ? this._nav.children[this.tabHeaderKeyMapIndex[this.active]] : undefined;
      if (focused && isDisabled(this._nav.children[index])) this._restoreFocus(active);
    }
  };

  initActive = (fallbackIndex = 0): void => {
    const headers = [...this._nav.children];
    const enabled = headers.filter((item) => !isDisabled(item));
    const current = enabled.find((item) => item.getAttribute('r-key') === this.active);
    // Keep the active key; otherwise prefer the next position, then work backwards.
    const next =
      current ??
      headers.slice(fallbackIndex).find((item) => !isDisabled(item)) ??
      headers
        .slice(0, fallbackIndex)
        .reverse()
        .find((item) => !isDisabled(item));
    if (next) {
      this.activateKey(next.getAttribute('r-key')!);
    } else {
      this.removeAttribute('active');
      headers.forEach((item) => item.classList.remove('active'));
      this._line.style.setProperty('width', '0px');
      this._wrap.style.removeProperty('transform');
      this.syncTabsAria();
    }
  };

  listenSlotChange = (): void => {
    const slots = this._slot.assignedElements();
    const previous = [...this._nav.children];
    const focused = previous.find((header) => header === this._shadowDom.activeElement);
    const focusedIndex = focused ? previous.indexOf(focused) : -1;
    const activeIndex = this.active ? (this.tabHeaderKeyMapIndex[this.active] ?? 0) : 0;
    const keys = slots.map((pane, index) => pane.getAttribute('r-key') || `${index}`);
    const seen = new Set<string>();
    // Validate before touching the existing DOM: an invalid duplicate must stay loud.
    keys.forEach((key) => {
      if (seen.has(key)) throw new Error('tab 组件的 key 值存在重复，或者某个 tab 组件缺少 key 属性');
      seen.add(key);
    });
    const existing = new Map(previous.map((header) => [header.getAttribute('r-key'), header]));
    this.tabHeaderKeyMapIndex = Object.create(null);
    const headers = slots.map((pane, index) => {
      const key = keys[index];
      let header = existing.get(key);
      if (!header) header = this.createTabHeader(pane, index);
      else this.initTabHeaderKeyMapIndex(key, index);
      const label = pane.getAttribute('label') || '';
      if (header.textContent !== label) header.textContent = label;
      for (const name of ['icon', 'iconsize', 'type']) {
        const value = pane.getAttribute(name) || (name === 'type' ? 'text' : null);
        if (value === null) header.removeAttribute(name);
        else if (header.getAttribute(name) !== value) header.setAttribute(name, value);
      }
      if (isDisabled(pane)) header.setAttribute('disabled', '');
      else header.removeAttribute('disabled');
      return header;
    });
    previous.forEach((header) => {
      if (!headers.includes(header)) header.remove();
    });
    headers.forEach((header, index) => {
      // Leave an unaffected focused header connected in its original place.
      if (this._nav.children[index] !== header) this._nav.insertBefore(header, this._nav.children[index] ?? null);
    });
    if (headers.length || previous.length) this.initActive(activeIndex);
    this.syncTabsAria();
    if (focused) {
      const target =
        headers.includes(focused) && !isDisabled(focused)
          ? focused
          : (headers.slice(focusedIndex).find((header) => !isDisabled(header)) ??
            headers
              .slice(0, focusedIndex)
              .reverse()
              .find((header) => !isDisabled(header)));
      this._restoreFocus(target);
    }
    if (this.align === 'center') this.initTabLineAlignCenter();
    if (this.align === 'end') this.initTabLineAlignEnd();
    this._attachNavResizeObserver();
  };

  connectedCallback(): void {
    this.handlerExternalCss();
    this._events.on(this._slot, 'slotchange', this.listenSlotChange);
    this._events.on(this._nav, 'keydown', this.onNavKeydown as EventListener).on(this._nav, 'click', this.clickTabHead);
    this._paneObserver = new MutationObserver((records) => {
      if (records.some((record) => record.target.parentNode === this)) this.listenSlotChange();
    });
    this._paneObserver.observe(this, {
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'label', 'r-key', 'icon', 'iconsize', 'type'],
    });
    this.listenSlotChange();
  }

  disconnectedCallback(): void {
    this._events.abort();
    this._paneObserver?.disconnect();
    this._paneObserver = undefined;
    this._navResizeObserver?.disconnect();
    this._navResizeObserver = undefined;
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
      this._syncActiveTab();
    }
    if (name === 'sheet') {
      this.handlerExternalCss();
    }
  }
}

defineSSR('r-tabs', Tabs as unknown as new () => HTMLElement);
export default Tabs;
