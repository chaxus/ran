import { describe, expect, it, beforeEach } from 'vitest';
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
});
