import { describe, expect, it, beforeEach, vi } from 'vitest';
import '@/components/tab';
import '@/components/tabpane';

describe('r-tabs and r-tab contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders r-tabs correctly via ElementBuilder', () => {
    const tabs = document.createElement('r-tabs');
    document.body.appendChild(tabs);

    const shadow = (tabs as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();

    const wrapper = shadow.querySelector('.ran-tab') as HTMLElement;
    expect(wrapper).toBeTruthy();

    const header = wrapper.querySelector('.ran-tab-header');
    const content = wrapper.querySelector('.ran-tab-content');
    expect(header).toBeTruthy();
    expect(content).toBeTruthy();
  });

  it('renders r-tab correctly via ElementBuilder', () => {
    const tabPane = document.createElement('r-tab');
    document.body.appendChild(tabPane);

    const shadow = (tabPane as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();

    const slot = shadow.querySelector('slot');
    expect(slot).toBeTruthy();
  });

  it('generates dynamic r-button headers from r-tab children', async () => {
    const tabs = document.createElement('r-tabs') as any;
    tabs.setAttribute('active', '2');
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'Tab 1');
    tab1.setAttribute('r-key', '1');
    const tab2 = document.createElement('r-tab');
    tab2.setAttribute('label', 'Tab 2');
    tab2.setAttribute('r-key', '2');
    tab2.setAttribute('disabled', 'true');

    const nav = tabs._shadowDom.querySelector('.ran-tab-header-nav');

    // JSdom does not easily support precise simulation of slot mutations for Web Components
    // So we manually invoke the internal method to test the builder translation logic
    const header1 = tabs.createTabHeader(tab1, 0);
    const header2 = tabs.createTabHeader(tab2, 1);
    nav.appendChild(header1);
    nav.appendChild(header2);

    const buttons = nav.querySelectorAll('.tab-header-nav-item');
    expect(buttons.length).toBe(2);

    expect(buttons[0].getAttribute('r-key')).toBe('1');
    expect((buttons[0] as any).innerHTML).toBe('Tab 1');

    expect(buttons[1].getAttribute('r-key')).toBe('2');
    expect((buttons[1] as any).innerHTML).toBe('Tab 2');
    expect(buttons[1].hasAttribute('disabled')).toBe(true);
  });

  it('type property reflects to attribute', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    tabs.type = 'card';
    expect(tabs.getAttribute('type')).toBe('card');
  });

  it('active attribute can be set directly', () => {
    const tabs = document.createElement('r-tabs') as any;
    // Set active before appending so connectedCallback processes it
    tabs.setAttribute('active', '2');
    document.body.appendChild(tabs);
    expect(tabs.getAttribute('active')).toBe('2');
  });

  it('align property reflects to attribute', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    tabs.align = 'center';
    expect(tabs.getAttribute('align')).toBe('center');
  });

  it('effect property reflects to attribute', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    tabs.effect = 'slide';
    expect(tabs.getAttribute('effect')).toBe('slide');
  });

  it('sheet property reflects to attribute on r-tabs', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    tabs.sheet = '.ran-tab { background: red; }';
    expect(tabs.getAttribute('sheet')).toBe('.ran-tab { background: red; }');
  });

  it('setTabContent translates wrap by key index', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    tabs.tabHeaderKeyMapIndex = { a: 0, b: 1, c: 2 };
    tabs.setTabContent('b');
    expect(tabs._wrap.style.transform).toBe('translateX(-100%)');

    tabs.setTabContent('c');
    expect(tabs._wrap.style.transform).toBe('translateX(-200%)');
  });

  it('setTabLine sets width and translateX on the line element', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    // Build a nav with fake items
    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header1 = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header1);

    tabs.setTabLine('k1');
    expect(tabs._line.style.transform).toBe('translateX(0px)');
  });

  it('updateAttribute sets attribute on nav child', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'Tab');
    tab1.setAttribute('r-key', 'k1');
    const header1 = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header1);

    tabs.updateAttribute('k1', 'disabled', 'true');
    expect(tabs._nav.children[0].hasAttribute('disabled')).toBe(true);

    tabs.updateAttribute('k1', 'disabled', null);
    expect(tabs._nav.children[0].hasAttribute('disabled')).toBe(false);
  });

  it('r-tab label property reflects to attribute', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);

    tabPane.label = 'My Tab';
    expect(tabPane.getAttribute('label')).toBe('My Tab');
  });

  it('r-tab key property reflects to attribute', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);

    tabPane.key = 'tab-1';
    expect(tabPane.getAttribute('r-key')).toBe('tab-1');

    tabPane.key = null;
    expect(tabPane.hasAttribute('r-key')).toBe(false);
  });

  it('r-tab disabled property reflects to attribute', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);

    tabPane.disabled = 'true';
    expect(tabPane.getAttribute('disabled')).toBe('true');

    tabPane.disabled = 'false';
    expect(tabPane.hasAttribute('disabled')).toBe(false);
  });

  it('r-tab effect property reflects to attribute', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);

    tabPane.effect = 'slide';
    expect(tabPane.getAttribute('effect')).toBe('slide');

    tabPane.effect = 'false';
    expect(tabPane.hasAttribute('effect')).toBe(false);
  });

  it('r-tab sheet property reflects to attribute', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);

    tabPane.sheet = '.slot-content { color: blue; }';
    expect(tabPane.getAttribute('sheet')).toBe('.slot-content { color: blue; }');
  });

  it('initTabHeaderKeyMapIndex throws on duplicate key', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    tabs.initTabHeaderKeyMapIndex('k1', 1);
    expect(() => tabs.initTabHeaderKeyMapIndex('k1', 2)).toThrow();
  });

  it('clickTabHead sets active and updates classes', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'First');
    tab1.setAttribute('r-key', 'k1');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);

    tabs.clickTabHead({ target: header });
    expect(tabs.getAttribute('active')).toBe('k1');
    expect(header.classList.contains('active')).toBe(true);
  });

  it('clickTabHead does nothing when target is disabled', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'First');
    tab1.setAttribute('r-key', 'k1');
    tab1.setAttribute('disabled', '');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);

    const prevActive = tabs.getAttribute('active');
    tabs.clickTabHead({ target: header });
    expect(tabs.getAttribute('active')).toBe(prevActive);
  });

  it('disconnectedCallback aborts EventManager to remove slot listener', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);
    const abortSpy = vi.spyOn(tabs._events, 'abort');
    document.body.removeChild(tabs);
    expect(abortSpy).toHaveBeenCalledOnce();
  });

  it('setTabContent does nothing when key is empty', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);
    const prev = tabs._wrap.style.transform;
    tabs.setTabContent('');
    expect(tabs._wrap.style.transform).toBe(prev);
  });

  it('setTabLine does nothing when key is empty', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);
    tabs.setTabLine('');
    // No error thrown, no transform set
    expect(tabs._line.style.transform).toBe('');
  });

  it('setAttribute active dispatches change event', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);
    const events: Event[] = [];
    tabs.addEventListener('change', (e: Event) => events.push(e));
    tabs.setAttribute('active', 'tab-key');
    expect(events.length).toBe(1);
  });

  it('attributeChangedCallback skips when oldValue === newValue', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);
    const events: Event[] = [];
    tabs.addEventListener('change', (e: Event) => events.push(e));
    tabs.attributeChangedCallback('active', 'same', 'same');
    expect(events.length).toBe(0);
  });

  it('attributeChangedCallback effect propagates to nav children', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);

    tabs.setAttribute('effect', 'slide');
    expect(tabs._nav.children[0].getAttribute('effect')).toBe('slide');
  });

  it('attributeChangedCallback effect false removes effect from nav children', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);
    tabs._nav.children[0].setAttribute('effect', 'slide');

    tabs.attributeChangedCallback('effect', 'slide', 'false');
    expect(tabs._nav.children[0].hasAttribute('effect')).toBe(false);
  });

  it('handlerExternalCss called during connectedCallback when sheet is set', () => {
    const tabs = document.createElement('r-tabs') as any;
    tabs.setAttribute('sheet', '.ran-tab { color: red; }');
    const spy = vi.spyOn(tabs, 'handlerExternalCss');
    document.body.appendChild(tabs);
    expect(spy).toHaveBeenCalled();
  });

  it('updateAttribute with null value removes the attribute', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'Tab');
    tab1.setAttribute('r-key', 'k1');
    const header1 = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header1);

    tabs.updateAttribute('k1', 'icon', 'star');
    expect(tabs._nav.children[0].getAttribute('icon')).toBe('star');

    tabs.updateAttribute('k1', 'icon', null);
    expect(tabs._nav.children[0].hasAttribute('icon')).toBe(false);
  });

  it('wires WAI-ARIA tablist/tab/tabpanel roles and a roving tabindex', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);
    expect(tabs._nav.getAttribute('role')).toBe('tablist');

    const a = document.createElement('r-tab');
    a.setAttribute('label', 'One');
    a.setAttribute('r-key', 'a');
    const b = document.createElement('r-tab');
    b.setAttribute('label', 'Two');
    b.setAttribute('r-key', 'b');
    tabs._nav.appendChild(tabs.createTabHeader(a, 0));
    tabs._nav.appendChild(tabs.createTabHeader(b, 1));
    // jsdom can't slot, so feed the panes directly.
    tabs._slot.assignedElements = () => [a, b];
    tabs.setAttribute('active', 'a');
    tabs.syncTabsAria();

    const tab1 = tabs.tabFocusable(tabs._nav.children[0]);
    const tab2 = tabs.tabFocusable(tabs._nav.children[1]);
    expect(tab1.getAttribute('role')).toBe('tab');
    expect(tab1.getAttribute('aria-selected')).toBe('true');
    expect(tab2.getAttribute('aria-selected')).toBe('false');
    // roving: only the active tab is tabbable
    expect(tab1.tabIndex).toBe(0);
    expect(tab2.tabIndex).toBe(-1);
    // panel <-> tab linkage
    expect(a.getAttribute('role')).toBe('tabpanel');
    expect(a.getAttribute('aria-labelledby')).toBe(tab1.id);
    expect(tab1.getAttribute('aria-controls')).toBe(a.id);
    expect(b.getAttribute('aria-hidden')).toBe('true');
  });

  it('arrow keys move selection and roving focus across tabs', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);
    const a = document.createElement('r-tab');
    a.setAttribute('label', 'One');
    a.setAttribute('r-key', 'a');
    const b = document.createElement('r-tab');
    b.setAttribute('label', 'Two');
    b.setAttribute('r-key', 'b');
    tabs._nav.appendChild(tabs.createTabHeader(a, 0));
    tabs._nav.appendChild(tabs.createTabHeader(b, 1));
    tabs._slot.assignedElements = () => [a, b];
    tabs.setAttribute('active', 'a');
    tabs.syncTabsAria();

    tabs.onNavKeydown({ key: 'ArrowRight', target: tabs._nav.children[0], preventDefault() {} });
    expect(tabs.getAttribute('active')).toBe('b');
    expect(tabs.tabFocusable(tabs._nav.children[1]).getAttribute('aria-selected')).toBe('true');
    expect(tabs.tabFocusable(tabs._nav.children[1]).tabIndex).toBe(0);

    tabs.onNavKeydown({ key: 'Home', target: tabs._nav.children[1], preventDefault() {} });
    expect(tabs.getAttribute('active')).toBe('a');
  });

  // r-tab (TabPane) specific tests
  it('r-tab icon property reflects to attribute', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);

    tabPane.icon = 'star';
    expect(tabPane.getAttribute('icon')).toBe('star');

    tabPane.icon = 'false';
    expect(tabPane.hasAttribute('icon')).toBe(false);
  });

  it('r-tab iconSize property reflects to attribute', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);

    tabPane.iconSize = '24';
    expect(tabPane.getAttribute('iconSize')).toBe('24');

    tabPane.iconSize = '';
    expect(tabPane.hasAttribute('iconSize')).toBe(false);
  });

  it('r-tab label getter returns empty string when not set', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);
    expect(tabPane.label).toBe('');
  });

  it('r-tab label setter sets attribute', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);
    tabPane.label = 'Tab Label';
    expect(tabPane.getAttribute('label')).toBe('Tab Label');
  });

  it('r-tab disconnectedCallback aborts EventManager to remove DOMContentLoaded listener', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);
    const abortSpy = vi.spyOn(tabPane._events, 'abort');
    document.body.removeChild(tabPane);
    expect(abortSpy).toHaveBeenCalledOnce();
  });

  it('r-tab attributeChangedCallback forwards icon change to parent', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tabPane = document.createElement('r-tab') as any;
    tabPane.setAttribute('r-key', 'k1');
    tabPane.setAttribute('label', 'A');
    tabs.appendChild(tabPane);

    // Manually set parent so updateAttribute is reachable
    tabPane.parent = tabs;
    tabs.tabHeaderKeyMapIndex = { k1: 0 };
    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);

    const spy = vi.spyOn(tabs, 'updateAttribute');
    tabPane.attributeChangedCallback('icon', null, 'home');
    expect(spy).toHaveBeenCalledWith('k1', 'icon', 'home');
  });

  it('r-tab attributeChangedCallback handles sheet change', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);
    const spy = vi.spyOn(tabPane, 'handlerExternalCss');
    tabPane.attributeChangedCallback('sheet', 'old', 'new');
    expect(spy).toHaveBeenCalled();
  });

  it('r-tab attributeChangedCallback skips sheet when old === new', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);
    const spy = vi.spyOn(tabPane, 'handlerExternalCss');
    tabPane.attributeChangedCallback('sheet', 'same', 'same');
    expect(spy).not.toHaveBeenCalled();
  });

  it('r-tab icon getter returns attribute', () => {
    const tabPane = document.createElement('r-tab') as any;
    tabPane.setAttribute('icon', 'home');
    document.body.appendChild(tabPane);
    expect(tabPane.icon).toBe('home');
  });

  it('r-tab iconSize getter returns attribute', () => {
    const tabPane = document.createElement('r-tab') as any;
    tabPane.setAttribute('iconSize', '24');
    document.body.appendChild(tabPane);
    expect(tabPane.iconSize).toBe('24');
  });

  it('r-tab handlerExternalCss is called when sheet is set before connect', () => {
    const tabPane = document.createElement('r-tab') as any;
    tabPane.sheet = '.slot-content { color: red; }';
    const spy = vi.spyOn(tabPane, 'handlerExternalCss');
    document.body.appendChild(tabPane);
    expect(spy).toHaveBeenCalled();
  });

  it('r-tab initAttribute does not throw when called directly', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);
    expect(() => tabPane.initAttribute()).not.toThrow();
  });

  it('r-tab effect getter returns null when not set', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);
    expect(tabPane.effect).toBeNull();
  });

  it('r-tab disabled getter returns null when not set', () => {
    const tabPane = document.createElement('r-tab') as any;
    document.body.appendChild(tabPane);
    expect(tabPane.disabled).toBeNull();
  });

  it('r-tab initAttribute calls parent updateAttribute', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tabPane = document.createElement('r-tab') as any;
    tabPane.setAttribute('r-key', 'k1');
    tabPane.setAttribute('label', 'A');
    tabPane.setAttribute('icon', 'home');
    tabPane.setAttribute('iconSize', '24');
    tabs.appendChild(tabPane);

    tabPane.parent = tabs;
    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);
    tabs.tabHeaderKeyMapIndex = { k1: 0 };

    const spy = vi.spyOn(tabs, 'updateAttribute');
    tabPane.initAttribute();
    expect(spy).toHaveBeenCalledWith('k1', 'icon', 'home');
    expect(spy).toHaveBeenCalledWith('k1', 'iconSize', '24');
  });

  it('r-tab attributeChangedCallback handles iconSize, effect, disabled changes', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tabPane = document.createElement('r-tab') as any;
    tabPane.setAttribute('r-key', 'k1');
    tabPane.setAttribute('label', 'A');
    tabs.appendChild(tabPane);
    tabPane.parent = tabs;

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);
    tabs.tabHeaderKeyMapIndex = { k1: 0 };

    const spy = vi.spyOn(tabs, 'updateAttribute');

    tabPane.attributeChangedCallback('iconSize', '', '24');
    expect(spy).toHaveBeenCalledWith('k1', 'iconSize', '24');

    tabPane.attributeChangedCallback('effect', '', 'slide');
    expect(spy).toHaveBeenCalledWith('k1', 'effect', 'slide');

    tabPane.attributeChangedCallback('disabled', '', 'true');
    expect(spy).toHaveBeenCalledWith('k1', 'disabled', 'true');
  });

  it('type getter returns flat by default', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);
    expect(tabs.type).toBe('flat');
  });

  it('active setter sets attribute and calls setTabLine/setTabContent', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);

    const lineSpy = vi.spyOn(tabs, 'setTabLine');
    const contentSpy = vi.spyOn(tabs, 'setTabContent');
    tabs.active = 'k1';
    expect(tabs.getAttribute('active')).toBe('k1');
    expect(lineSpy).toHaveBeenCalledWith('k1');
    expect(contentSpy).toHaveBeenCalledWith('k1');
  });

  it('active setter with falsy value calls removeAttribute', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);
    tabs.setAttribute('active', 'k1');
    const spy = vi.spyOn(tabs, 'removeAttribute');
    tabs.active = '';
    expect(spy).toHaveBeenCalledWith('active');
  });

  it('effect setter with empty string removes effect attribute', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);
    tabs.setAttribute('effect', 'slide');
    tabs.effect = '';
    expect(tabs.hasAttribute('effect')).toBe(false);
  });

  it('effect setter with false removes effect attribute', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);
    tabs.setAttribute('effect', 'slide');
    tabs.effect = 'false';
    expect(tabs.hasAttribute('effect')).toBe(false);
  });

  it('createTabHeader with icon and iconSize sets attributes', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    tab1.setAttribute('icon', 'home');
    tab1.setAttribute('iconSize', '24');
    const header = tabs.createTabHeader(tab1, 0);

    expect(header.getAttribute('icon')).toBe('home');
    expect(header.getAttribute('iconSize')).toBe('24');
  });

  it('createTabHeader with effect sets display:none on line', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);
    tabs.setAttribute('effect', 'slide');

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);

    expect(tabs._line.style.display).toBe('none');
  });

  it('initTabLineAlignCenter sets left on line', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);

    expect(() => tabs.initTabLineAlignCenter()).not.toThrow();
    expect(tabs._line.style.left).toBeTruthy();
  });

  it('initTabLineAlignEnd sets left on line', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);

    expect(() => tabs.initTabLineAlignEnd()).not.toThrow();
    expect(tabs._line.style.left).toBeTruthy();
  });

  it('attributeChangedCallback align=end calls initTabLineAlignEnd', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);

    const spy = vi.spyOn(tabs, 'initTabLineAlignEnd');
    tabs.attributeChangedCallback('align', 'start', 'end');
    expect(spy).toHaveBeenCalled();
  });

  it('attributeChangedCallback align=center calls initTabLineAlignCenter', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const spy = vi.spyOn(tabs, 'initTabLineAlignCenter');
    tabs.attributeChangedCallback('align', 'start', 'center');
    expect(spy).toHaveBeenCalled();
  });

  it('initActive sets active to first non-disabled tab when no active attr', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);

    tabs.initActive();
    expect(tabs.getAttribute('active')).toBe('k1');
    expect(header.classList.contains('active')).toBe(true);
  });

  it('initActive sets active to matching tab when active attr is set', () => {
    const tabs = document.createElement('r-tabs') as any;
    tabs.setAttribute('active', 'k2');
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header1 = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header1);

    const tab2 = document.createElement('r-tab');
    tab2.setAttribute('label', 'B');
    tab2.setAttribute('r-key', 'k2');
    const header2 = tabs.createTabHeader(tab2, 1);
    tabs._nav.appendChild(header2);

    tabs.tabHeaderKeyMapIndex = { k1: 0, k2: 1 };
    tabs.initActive();
    expect(tabs.getAttribute('active')).toBe('k2');
  });

  it('initActive returns early when no non-disabled tabs exist', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    tab1.setAttribute('disabled', '');
    const header = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header);

    expect(() => tabs.initActive()).not.toThrow();
  });

  it('listenSlotChange with align=center calls initTabLineAlignCenter', () => {
    const tabs = document.createElement('r-tabs') as any;
    tabs.setAttribute('align', 'center');
    document.body.appendChild(tabs);

    const spy = vi.spyOn(tabs, 'initTabLineAlignCenter');
    tabs.listenSlotChange();
    expect(spy).toHaveBeenCalled();
  });

  it('listenSlotChange with align=end calls initTabLineAlignEnd', () => {
    const tabs = document.createElement('r-tabs') as any;
    tabs.setAttribute('align', 'end');
    document.body.appendChild(tabs);

    const spy = vi.spyOn(tabs, 'initTabLineAlignEnd');
    tabs.listenSlotChange();
    expect(spy).toHaveBeenCalled();
  });

  it('setTabLine calculates offset for non-first tab (index > 0)', () => {
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    const header1 = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header1);

    const tab2 = document.createElement('r-tab');
    tab2.setAttribute('label', 'B');
    tab2.setAttribute('r-key', 'k2');
    const header2 = tabs.createTabHeader(tab2, 1);
    tabs._nav.appendChild(header2);

    // Mock getBoundingClientRect for nav children
    for (const child of Array.from(tabs._nav.children)) {
      (child as HTMLElement).getBoundingClientRect = () =>
        ({ width: 80, height: 30, left: 0, top: 0, right: 80, bottom: 30, toJSON: () => ({}) }) as DOMRect;
    }
    header2.getBoundingClientRect = () =>
      ({ width: 80, height: 30, left: 0, top: 0, right: 80, bottom: 30, toJSON: () => ({}) }) as DOMRect;

    tabs.tabHeaderKeyMapIndex = { k1: 0, k2: 1 };
    tabs.setTabLine('k2');
    // distance should be 80 (width of tab1)
    expect(tabs._line.style.transform).toBe('translateX(80px)');
  });

  it('initActive calls setTabLine inside setTimeout for second tab', async () => {
    const sleep = (ms = 10) => new Promise((r) => setTimeout(r, ms));
    const tabs = document.createElement('r-tabs') as any;
    document.body.appendChild(tabs);

    const tab1 = document.createElement('r-tab');
    tab1.setAttribute('label', 'A');
    tab1.setAttribute('r-key', 'k1');
    tab1.setAttribute('disabled', '');
    const header1 = tabs.createTabHeader(tab1, 0);
    tabs._nav.appendChild(header1);

    const tab2 = document.createElement('r-tab');
    tab2.setAttribute('label', 'B');
    tab2.setAttribute('r-key', 'k2');
    const header2 = tabs.createTabHeader(tab2, 1);
    tabs._nav.appendChild(header2);

    tabs.tabHeaderKeyMapIndex = { k1: 0, k2: 1 };
    const spy = vi.spyOn(tabs, 'setTabLine');
    tabs.initActive();
    await sleep(250);
    expect(spy).toHaveBeenCalled();
  });
});
