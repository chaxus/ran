// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { renderHome } from '../build/components';
import { LOCALES } from '../build/langs/locales';
import { playgroundCopy } from '../client/playground-copy';
import { mountDemos } from '../client/home';
const setup = () => {
  document.body.innerHTML = renderHome(LOCALES[0]);
  mountDemos();
};
afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});
it('keeps preview, editable progress, code and reset in agreement', () => {
  setup();
  document.querySelector<HTMLButtonElement>('[data-demo-tab="progress"]')!.click();
  const input = document.querySelector<HTMLInputElement>('[data-demo-percent]')!;
  input.value = '82';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  expect(document.querySelector('r-progress')!.getAttribute('percent')).toBe('82');
  expect(document.querySelector('[data-demo-code]')!.textContent).toBe('<r-progress percent="82"></r-progress>');
  document.querySelector<HTMLButtonElement>('[data-demo-reset]')!.click();
  expect(input.value).toBe('66');
  expect(document.querySelector('[data-demo-code]')!.textContent).toContain('percent="66"');
});
it('provides linked, keyboard-operable tabs and visible state for the selection example', () => {
  setup();
  const tab = document.querySelector<HTMLButtonElement>('[data-demo-tab="buttons"]')!;
  tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  const selected = document.querySelector<HTMLButtonElement>('[data-demo-tab="selection"]')!;
  expect(selected.getAttribute('aria-selected')).toBe('true');
  expect(document.activeElement).toBe(selected);
  const checkbox = document.querySelector('r-checkbox')!;
  checkbox.setAttribute('checked', 'false');
  checkbox.dispatchEvent(new Event('change', { bubbles: true }));
  expect(document.querySelector('[data-demo-code]')!.textContent).not.toContain(' checked');
  expect(document.querySelector('[data-demo-selection]')!.textContent).toBe(playgroundCopy(LOCALES[0].lang).unselected);
});
it('copies the currently selected example rather than a fixed sample', async () => {
  const writeText = vi.fn(async () => {});
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  setup();
  document.querySelector<HTMLButtonElement>('[data-demo-tab="progress"]')!.click();
  document.querySelector<HTMLButtonElement>('[data-demo-copy]')!.click();
  await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('<r-progress percent="66"></r-progress>'));
});

it('generates minimal source without instantiating registered custom elements', () => {
  let constructed = 0;
  customElements.define(
    'r-progress',
    class extends HTMLElement {
      constructor() {
        super();
        constructed++;
      }
    },
  );
  setup();
  constructed = 0;
  document.querySelector<HTMLButtonElement>('[data-demo-tab="progress"]')!.click();
  expect(document.querySelector('[data-demo-code]')!.textContent).toBe('<r-progress percent="66"></r-progress>');
  expect(constructed).toBe(0);
});

it('restores the copy label after repeated successful clicks', async () => {
  vi.useFakeTimers();
  try {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn(async () => {}) } });
    setup();
    const button = document.querySelector<HTMLButtonElement>('[data-demo-copy]')!;
    const label = button.querySelector('.copy-label')!;
    const original = label.textContent;
    button.click();
    await vi.advanceTimersByTimeAsync(1000);
    button.click();
    await vi.advanceTimersByTimeAsync(1600);
    expect(label.textContent).toBe(original);
    expect(button.classList.contains('done')).toBe(false);
  } finally {
    vi.useRealTimers();
  }
});

it('clears earlier success feedback when a later clipboard write fails', async () => {
  const writeText = vi.fn().mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('denied'));
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  setup();
  const button = document.querySelector<HTMLButtonElement>('[data-demo-copy]')!;
  const original = button.querySelector('.copy-label')!.textContent;
  button.click();
  await vi.waitFor(() => expect(button.classList.contains('done')).toBe(true));
  button.click();
  await vi.waitFor(() => expect(button.classList.contains('done')).toBe(false));
  expect(button.querySelector('.copy-label')!.textContent).toBe(original);
});
