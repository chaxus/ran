// @vitest-environment jsdom
import { expect, it, vi } from 'vitest';
import { mountCodeGroups } from '../client/code-groups';

it('links tabs to panels, maintains one tab stop and supports wrapped keyboard selection', () => {
  document.body.innerHTML =
    '<div class="code-group"><div class="code-group__tabs"><button class="code-group__tab" hidden>HTML</button><button class="code-group__tab" hidden>React</button></div><div class="code-group__pane">html</div><div class="code-group__pane">react</div></div>';
  Element.prototype.scrollIntoView = vi.fn();
  mountCodeGroups();
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('button')];
  const panels = [...document.querySelectorAll<HTMLElement>('.code-group__pane')];
  expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1]);
  expect(document.getElementById(tabs[0].getAttribute('aria-controls')!)).toBe(panels[0]);
  expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id);
  const key = (i: number, key: string) => tabs[i].dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  key(0, 'ArrowLeft');
  expect(document.activeElement).toBe(tabs[1]);
  expect(panels.map((panel) => panel.hidden)).toEqual([true, false]);
  key(1, 'ArrowRight');
  expect(document.activeElement).toBe(tabs[0]);
  key(0, 'End');
  expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  key(1, 'Home');
  expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1]);
  tabs[1].click();
  expect(panels[1].hidden).toBe(false);
  mountCodeGroups();
  expect(panels[1].hidden).toBe(false);
});
