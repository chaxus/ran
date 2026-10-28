// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import MiniSearch from 'minisearch';
import { SEARCH_FIELDS, tokenize, type SearchDoc } from 'ranpress/search-shared';

beforeEach(() => {
  vi.resetModules();
  document.body.innerHTML = `<button class="search-open">Search</button><dialog id="search-dialog"><input id="search-input"><p id="search-status"></p><ul id="search-results"></ul></dialog>`;
  document.querySelector<HTMLDialogElement>('dialog')!.showModal = function () {
    this.open = true;
  };
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const openSearch = async (documents: Pick<SearchDoc, 'title' | 'preview'>[]): Promise<HTMLInputElement> => {
  const index = new MiniSearch<SearchDoc>({
    fields: [...SEARCH_FIELDS],
    storeFields: ['url', 'page', 'title', 'preview'],
    tokenize,
    processTerm: (term) => term,
  });
  index.addAll(
    documents.map((doc, i) => ({ ...doc, id: String(i), page: 'Guide', text: doc.preview, url: `/guide#${i}` })),
  );
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => JSON.stringify(index) }));
  const { mountSearch } = await import('../client/search');
  mountSearch();
  document.querySelector<HTMLButtonElement>('.search-open')!.click();
  await vi.waitFor(() => expect(document.querySelector('#search-results')!.hasAttribute('aria-busy')).toBe(false));
  return document.querySelector<HTMLInputElement>('#search-input')!;
};

it.each([
  { query: 'remark mark remark', text: 'remark mark', marks: ['remark', 'mark'] },
  { query: 'MARK mark', text: 'Mark markdown MARK', marks: ['Mark', 'mark', 'MARK'] },
  { query: 'A&B', text: 'A&B connects A&B', marks: ['A&B', 'A&B'] },
  { query: 'literal [].+', text: 'literal [].+ safely', marks: ['literal', '[].+'] },
  { query: '<script>', text: 'Use <script> & more', marks: ['<script>'] },
  { query: '中', text: '中 guide 中文中', marks: ['中', '中', '中'] },
])('highlights literal original text once for $query', async ({ query, text, marks }) => {
  const input = await openSearch([{ title: text, preview: text }]);
  input.value = query;
  input.dispatchEvent(new Event('input'));
  const hit = document.querySelector('.search-hit')!;
  expect(hit).not.toBeNull();
  for (const selector of ['.search-hit__text', '.search-hit__title']) {
    const content = hit.querySelector(selector)!;
    expect(content.textContent).toBe(text);
    expect([...content.querySelectorAll('mark')].map((mark) => mark.textContent)).toEqual(marks);
    expect(content.querySelector('mark mark')).toBeNull();
    expect([...content.children].every((child) => child.tagName === 'MARK')).toBe(true);
  }
});

it('does not match escaped entities or create markup from preview text', async () => {
  const preview = 'Use <script> & more <img src=x onerror="bad()">';
  const input = await openSearch([{ title: 'amp reference', preview }]);
  input.value = 'amp';
  input.dispatchEvent(new Event('input'));
  const content = document.querySelector('.search-hit__text')!;
  expect(content.textContent).toBe(preview);
  expect(content.children).toHaveLength(0);
  expect(document.querySelector('.search-hit__title mark')!.textContent).toBe('amp');
});

it('keeps the input, selection, focus and keyboard navigation while results rerender', async () => {
  const input = await openSearch([
    { title: 'remark first', preview: 'remark mark' },
    { title: 'remark second', preview: 'remark mark' },
  ]);
  input.value = 'remark mark';
  input.focus();
  input.setSelectionRange(2, 5);
  input.dispatchEvent(new Event('input'));
  expect(document.querySelectorAll('.search-hit')).toHaveLength(2);
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  expect(input.getAttribute('aria-activedescendant')).toBe('search-option-1');
  expect(document.querySelector('#search-option-1')!.getAttribute('aria-selected')).toBe('true');
  const composingEnter = new KeyboardEvent('keydown', {
    key: 'Enter',
    bubbles: true,
    cancelable: true,
    isComposing: true,
  });
  input.dispatchEvent(composingEnter);
  expect(composingEnter.defaultPrevented).toBe(false);
  expect(input.getAttribute('aria-activedescendant')).toBe('search-option-1');
  expect(document.querySelector('#search-input')).toBe(input);
  expect(document.activeElement).toBe(input);
  expect(input.value).toBe('remark mark');
  expect([input.selectionStart, input.selectionEnd]).toEqual([2, 5]);
});

it('labels each result with its section, in the words of the page navigation', async () => {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<header class="site-header"><a class="nav__link" href="/cn/design/">设计</a><a class="nav__link" href="/cn/ranui/">ranui</a></header>` +
      `<footer class="site-footer"><a class="site-footer__link" href="/cn/agents/">智能体</a></footer>`,
  );
  const index = new MiniSearch<SearchDoc>({
    fields: [...SEARCH_FIELDS],
    storeFields: ['url', 'page', 'title', 'preview'],
    tokenize,
    processTerm: (term) => term,
  });
  index.addAll(
    [
      { url: '/cn/ranui/button/#a', page: 'Button' },
      { url: '/cn/ranui/api#b', page: 'element API' },
      { url: '/cn/design/composition#c', page: 'Visual composition' },
      { url: '/cn/agents/skills#d', page: 'Skills' },
    ].map((doc, i) => ({ ...doc, id: String(i), title: 'needle', preview: 'needle', text: 'needle' })),
  );
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, text: async () => JSON.stringify(index) }));
  const { mountSearch } = await import('../client/search');
  mountSearch();
  document.querySelector<HTMLButtonElement>('.search-open')!.click();
  await vi.waitFor(() => expect(document.querySelector('#search-results')!.hasAttribute('aria-busy')).toBe(false));
  const input = document.querySelector<HTMLInputElement>('#search-input')!;
  input.value = 'needle';
  input.dispatchEvent(new Event('input'));
  const labels = Object.fromEntries(
    [...document.querySelectorAll('.search-hit')].map((hit) => [
      hit.getAttribute('href'),
      hit.querySelector('.search-hit__kind')?.textContent,
    ]),
  );
  expect(labels).toEqual({
    '/cn/ranui/button/#a': 'ranui',
    '/cn/ranui/api#b': 'API',
    '/cn/design/composition#c': '设计',
    '/cn/agents/skills#d': '智能体',
  });
});
