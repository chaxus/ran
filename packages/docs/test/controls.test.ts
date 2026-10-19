// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import MiniSearch from 'minisearch';
import { SEARCH_FIELDS, tokenize } from 'ranpress/search-shared';
import { mountCodeCopy, mountNavigation } from '../client/interactions';

const cleanups: Array<() => void> = [];
beforeEach(() => {
  document.body.innerHTML = '';
  vi.resetModules();
  Element.prototype.scrollIntoView = vi.fn();
  vi.spyOn(document, 'addEventListener').mockImplementation((type, listener, options) => {
    EventTarget.prototype.addEventListener.call(document, type, listener, options);
    cleanups.push(() => document.removeEventListener(type, listener, options));
  });
});
afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup());
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const drawer = () => {
  document.body.innerHTML = `<input id="drawer" type="checkbox"><label class="drawer__button" for="drawer">menu</label><a id="wordmark" href="/">home</a><nav class="sidebar"><a href="#one">one</a><a href="#two">two</a></nav><main id="main"></main>`;
  const media = { matches: true, addEventListener: vi.fn<(event: string, listener: () => void) => void>() };
  vi.stubGlobal('matchMedia', () => media);
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);
  mountNavigation();
  const trigger = document.querySelector<HTMLElement>('.drawer__button')!;
  const toggle = document.querySelector<HTMLInputElement>('#drawer')!;
  const links = [...document.querySelectorAll<HTMLAnchorElement>('.sidebar a')];
  trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  return { trigger, toggle, links, media };
};

it('cycles every drawer Tab step across the header gap in both directions', () => {
  const { trigger, links, toggle } = drawer();
  expect(toggle.tabIndex).toBe(-1);
  expect(toggle.getAttribute('aria-hidden')).toBe('true');
  const tab = (shiftKey = false) =>
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true }),
    );
  links[1].focus();
  tab();
  expect(document.activeElement).toBe(trigger);
  tab();
  expect(document.activeElement).toBe(links[0]);
  tab(true);
  expect(document.activeElement).toBe(trigger);
  tab(true);
  expect(document.activeElement).toBe(links[1]);
});

it('restores focus when the scrim closes a focused drawer', () => {
  const { trigger, toggle, links } = drawer();
  links[1].focus();
  toggle.checked = false;
  toggle.dispatchEvent(new Event('change'));
  expect(document.activeElement).toBe(trigger);
  expect(document.querySelector<HTMLElement>('.sidebar')!.inert).toBe(true);
});

it('restores focus when resizing hides a focused desktop sidebar', () => {
  const { trigger, toggle, links, media } = drawer();
  media.matches = false;
  toggle.checked = false;
  links[1].focus();
  media.matches = true;
  media.addEventListener.mock.calls[0][1]();
  expect(document.activeElement).toBe(trigger);
});

it('keeps copy focus and gives a rejected write feedback beside its code', async () => {
  document.body.innerHTML =
    '<article class="prose"><figure class="code"><pre><code>example</code></pre></figure></article>';
  let reject!: (reason: Error) => void;
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: () =>
        new Promise<void>((_, fail) => {
          reject = fail;
        }),
    },
  });
  mountCodeCopy();
  const button = document.querySelector<HTMLButtonElement>('.code-copy')!;
  button.focus();
  button.click();
  expect(button.disabled).toBe(false);
  expect(button.getAttribute('aria-disabled')).toBe('true');
  expect(document.activeElement).toBe(button);
  reject(new Error('denied'));
  await vi.waitFor(() => expect(document.querySelector('.code-copy__status')!.textContent).toMatch(/failed/i));
  expect(document.querySelector('.code-copy__status')!.closest('figure')).toBe(button.closest('figure'));
  expect(document.activeElement).toBe(button);
  expect(button.hasAttribute('aria-disabled')).toBe(false);
});

const search = async () => {
  document.body.innerHTML = `<input id="drawer" type="checkbox"><label tabindex="0" class="drawer__button">menu</label><nav class="sidebar"><a href="#origin">origin</a></nav><button class="search-open">search</button><dialog id="search-dialog"><input id="search-input"><button class="search__close">close</button><p id="search-status"></p><ul id="search-results"></ul></dialog>`;
  const index = new MiniSearch({
    fields: [...SEARCH_FIELDS],
    storeFields: ['url', 'page', 'title', 'preview'],
    tokenize,
    processTerm: (term) => term,
  });
  index.addAll(
    [0, 1].map((i) => ({
      id: String(i),
      title: 'button',
      text: 'button',
      page: 'guide',
      preview: '',
      url: `/guide#${i}`,
    })),
  );
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => JSON.stringify(index) }));
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
  const { mountSearch } = await import('../client/search');
  mountSearch();
  const opener = document.querySelector<HTMLButtonElement>('.search-open')!;
  const input = document.querySelector<HTMLInputElement>('#search-input')!;
  const dialog = document.querySelector<HTMLDialogElement>('dialog')!;
  opener.click();
  await vi.waitFor(() => expect(document.querySelector('#search-results')!.hasAttribute('aria-busy')).toBe(false));
  input.value = 'button';
  input.dispatchEvent(new Event('input'));
  return { opener, input, dialog };
};

it('reopens cached search with coherent expanded state and retained result selection', async () => {
  const { opener, input, dialog } = await search();
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  dialog.close();
  opener.click();
  expect(input.value).toBe('button');
  expect(input.getAttribute('aria-expanded')).toBe('true');
  expect(input.getAttribute('aria-activedescendant')).toBe('search-option-1');
});

it('returns search focus to the drawer trigger if its original link became inert', async () => {
  const { input, dialog } = await search();
  dialog.close();
  const origin = document.querySelector<HTMLElement>('.sidebar a')!;
  origin.focus();
  document.querySelector<HTMLInputElement>('#drawer')!.checked = true;
  document
    .querySelector('#drawer')!
    .addEventListener('change', () => document.querySelector('.sidebar')!.setAttribute('inert', ''));
  origin.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }));
  expect(document.activeElement).toBe(input);
  dialog.close();
  expect(document.activeElement).toBe(document.querySelector('.drawer__button'));
});

it('does not navigate or select results during tracked IME composition', async () => {
  const { input } = await search();
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
  const arrow = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
  input.dispatchEvent(arrow);
  expect(arrow.defaultPrevented).toBe(false);
  expect(input.getAttribute('aria-activedescendant')).toBe('search-option-0');
  input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  expect(input.getAttribute('aria-activedescendant')).toBe('search-option-1');
});

it('closes nonempty search on its first Escape without clearing the retained query', async () => {
  const { input, dialog } = await search();
  const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  input.dispatchEvent(escape);
  expect(escape.defaultPrevented).toBe(true);
  expect(dialog.open).toBe(false);
  expect(input.value).toBe('button');
});

it('leaves Escape to the input method during composition', async () => {
  const { input, dialog } = await search();
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
  const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
  input.dispatchEvent(escape);
  expect(escape.defaultPrevented).toBe(false);
  expect(dialog.open).toBe(true);
});

it('restores focus after native label activation puts focus on the closing checkbox', () => {
  const { trigger, toggle } = drawer();
  toggle.focus();
  toggle.checked = false;
  toggle.dispatchEvent(new Event('change'));
  expect(document.activeElement).toBe(trigger);
});

it('skips collapsed group descendants even when they retain layout rectangles', () => {
  const { links } = drawer();
  const hidden = document.createElement('a');
  hidden.href = '#hidden';
  hidden.textContent = 'collapsed child';
  Object.defineProperty(hidden, 'checkVisibility', { value: () => false });
  links[0].after(hidden);
  links[0].focus();
  links[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
  expect(document.activeElement).toBe(links[1]);
});

it('handles enhanced drawer label clicks without forwarding focus to its hidden checkbox', () => {
  const { trigger, toggle } = drawer();
  const click = new MouseEvent('click', { bubbles: true, cancelable: true });
  trigger.dispatchEvent(click);
  expect(click.defaultPrevented).toBe(true);
  expect(toggle.checked).toBe(false);
  expect(document.activeElement).toBe(trigger);
});

it('restores responsive drawer focus when CSS hides the focused link before the media callback', () => {
  const { trigger, toggle, links, media } = drawer();
  media.matches = false;
  toggle.checked = false;
  links[1].focus();
  links[1].blur();
  media.matches = true;
  media.addEventListener.mock.calls[0][1]();
  expect(document.activeElement).toBe(trigger);
});

it('does not restore an old sidebar focus after an outside pointer action', () => {
  const { trigger, toggle, links, media } = drawer();
  media.matches = false;
  toggle.checked = false;
  links[1].focus();
  document.querySelector('#main')!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  links[1].blur();
  media.matches = true;
  media.addEventListener.mock.calls[0][1]();
  expect(document.activeElement).not.toBe(trigger);
});
