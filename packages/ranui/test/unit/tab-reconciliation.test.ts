import { afterEach, describe, expect, it } from 'vitest';
import type { Tabs } from '@/components/tab';
import '@/components/tab';
import '@/components/button';
import '@/components/tabpane';

const pane = (key: string) => {
  const item = document.createElement('r-tab');
  item.setAttribute('r-key', key);
  item.setAttribute('label', key);
  return item;
};
const settle = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};
async function mount() {
  const tabs = document.createElement('r-tabs') as Tabs;
  tabs.append(pane('a'), pane('b'), pane('c'));
  document.body.append(tabs);
  await settle();
  return tabs;
}
afterEach(() => document.body.replaceChildren());

describe('r-tabs keyed reconciliation', () => {
  it('keeps headers, active pane, focus and maps through append, reorder and removal', async () => {
    const tabs = await mount();
    tabs.activateKey('b');
    const header = tabs._nav.children[1];
    tabs.tabFocusable(header).focus();
    tabs.append(pane('d'));
    await settle();
    expect(tabs._nav.children).toHaveLength(4);
    expect(tabs.active).toBe('b');
    expect(tabs._nav.children[1]).toBe(header);
    expect(tabs._shadowDom.activeElement).toBe(header);
    tabs.prepend(tabs.children[1]);
    await settle();
    expect(tabs._nav.children[0]).toBe(header);
    expect(tabs._shadowDom.activeElement).toBe(header);
    expect(tabs.tabHeaderKeyMapIndex).toEqual({ b: 0, a: 1, c: 2, d: 3 });
    tabs.children[1].remove();
    await settle();
    expect(tabs._nav.children).toHaveLength(3);
    expect(tabs.active).toBe('b');
    expect(tabs.tabHeaderKeyMapIndex).toEqual({ b: 0, c: 1, d: 2 });
  });

  it('falls forward then back when the active pane is removed or disabled', async () => {
    const tabs = await mount();
    tabs.activateKey('b');
    tabs.tabFocusable(tabs._nav.children[1]).focus();
    tabs.children[1].remove();
    await settle();
    expect(tabs.active).toBe('c');
    expect(tabs._shadowDom.activeElement).toBe(tabs._nav.children[1]);
    tabs.children[1].setAttribute('disabled', '');
    await settle();
    expect(tabs.active).toBe('a');
    expect(tabs._shadowDom.activeElement).toBe(tabs._nav.children[0]);
    tabs.children[0].setAttribute('disabled', '');
    await settle();
    expect(tabs.active).toBeNull();
    expect([...tabs._nav.children].every((item) => tabs.tabFocusable(item).tabIndex === -1)).toBe(true);
  });

  it('rejects a duplicate at index zero, including prototype-named keys', () => {
    const tabs = document.createElement('r-tabs') as Tabs;
    tabs.initTabHeaderKeyMapIndex('a', 0);
    expect(() => tabs.initTabHeaderKeyMapIndex('a', 1)).toThrow();
    expect(() => tabs.initTabHeaderKeyMapIndex('toString', 2)).not.toThrow();
    expect(() => tabs.initTabHeaderKeyMapIndex('toString', 3)).toThrow();
  });

  it('reconnects once and releases removed header listeners', async () => {
    const tabs = await mount();
    const removed = tabs._nav.children[1] as HTMLElement;
    tabs.children[1].remove();
    await settle();
    removed.click();
    expect(tabs.active).toBe('a');
    tabs.remove();
    document.body.append(tabs);
    await settle();
    expect(tabs._nav.children).toHaveLength(2);
    (tabs._nav.children[1] as HTMLElement).click();
    expect(tabs.active).toBe('c');
  });
});
