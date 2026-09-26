// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from 'vitest';
import { mountNavigation, mountCodeCopy } from '../client/interactions';
import { mountSearch } from '../client/search';
import MiniSearch from 'minisearch';
import { tokenize, SEARCH_FIELDS } from 'ranpress/search';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  Element.prototype.scrollIntoView = vi.fn();
});

it('search close works, failed loading is actionable and retry recovers', async () => {
  document.body.innerHTML = `<button class="search-open">search</button><dialog id="search-dialog"><form onsubmit="return false"><input id="search-input"><button class="search__close" type="button">close</button></form><p id="search-status" data-error="failed" data-loading="loading"></p><button class="search__retry" hidden>retry</button><ul id="search-results"></ul></dialog>`;
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const fetcher = vi.fn().mockRejectedValueOnce(new Error('offline'));
  vi.stubGlobal('fetch', fetcher);
  mountSearch();
  document.querySelector<HTMLButtonElement>('.search-open')!.click();
  await vi.waitFor(() => expect(document.querySelector('#search-status')!.textContent).toBe('failed'));
  expect(document.querySelector<HTMLButtonElement>('.search__retry')!.hidden).toBe(false);
  const index = new MiniSearch({
    fields: [...SEARCH_FIELDS],
    storeFields: ['url', 'page', 'title', 'preview'],
    tokenize,
    processTerm: (term) => term,
  });
  index.addAll([
    { id: '1', title: 'Button', text: 'button', page: 'Buttons', preview: 'Use a button', url: '/src/ranui/button/' },
    { id: '2', title: 'Button API', text: 'button', page: 'API', preview: 'Reference', url: '/src/ranui/api#button' },
  ]);
  fetcher.mockResolvedValueOnce({ ok: true, text: async () => JSON.stringify(index) });
  const input = document.querySelector<HTMLInputElement>('#search-input')!;
  input.value = 'button';
  document.querySelector<HTMLButtonElement>('.search__retry')!.click();
  await vi.waitFor(() => expect(document.querySelectorAll('.search-hit')).toHaveLength(2));
  expect(document.querySelector<HTMLButtonElement>('.search__retry')!.hidden).toBe(true);
  expect(input.getAttribute('aria-expanded')).toBe('true');
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  expect(input.getAttribute('aria-activedescendant')).toBe('search-option-1');
  expect(document.querySelector('#search-option-1')!.getAttribute('aria-selected')).toBe('true');
  document.querySelector<HTMLButtonElement>('.search__close')!.click();
  expect(document.querySelector<HTMLDialogElement>('dialog')!.open).toBe(false);
});

it('drawer reflects state, Escape closes it and restores focus', () => {
  document.body.innerHTML = `<input id="drawer" type="checkbox" hidden><label class="drawer__button" tabindex="0" for="drawer">menu</label><nav class="sidebar"><a href="#test">test</a></nav><main id="main"></main>`;
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: vi.fn() }));
  mountNavigation();
  const button = document.querySelector<HTMLElement>('.drawer__button')!;
  button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  expect(button.getAttribute('aria-expanded')).toBe('true');
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(button.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(button);
});

it('code copy reports failure rather than a false success', async () => {
  document.body.innerHTML =
    '<article class="prose"><figure class="code"><pre><code>const a = 1;</code></pre></figure></article>';
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
  });
  mountCodeCopy();
  document.querySelector<HTMLButtonElement>('.code-copy')!.click();
  await vi.waitFor(() => expect(document.querySelector('.copy-status')!.textContent).toMatch(/failed/i));
  expect(document.querySelector('.code-copy')!.classList.contains('done')).toBe(false);
});

it('successful code copy uses the full source text', async () => {
  document.body.innerHTML =
    '<article class="prose"><figure class="code"><pre><code>line one\nline two</code></pre></figure></article>';
  const write = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: write } });
  mountCodeCopy();
  document.querySelector<HTMLButtonElement>('.code-copy')!.click();
  await vi.waitFor(() => expect(document.querySelector('.code-copy')!.classList.contains('done')).toBe(true));
  expect(write).toHaveBeenCalledWith('line one\nline two');
});
