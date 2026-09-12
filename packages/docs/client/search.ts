/**
 * Search: a dialog, a lazily-fetched index, and keyboard handling.
 *
 * The index is ~0.2–0.3 MB gzipped per locale and is fetched on the first open, never on
 * page load. A reader who never searches never pays for it, and a reader who does pays
 * once per session — the browser cache covers the rest.
 *
 * Only the current locale's index is ever fetched. A single index over all eight
 * languages would make every reader download seven they cannot read.
 */
import MiniSearch from 'minisearch';
import { tokenize, SEARCH_FIELDS } from 'ranpress/search';
import type { SearchDoc } from 'ranpress/search';

type Hit = SearchDoc & { score: number };

const LIMIT = 30;

let index: MiniSearch<SearchDoc> | null = null;
let loading: Promise<void> | null = null;

const lang = document.documentElement.lang || 'en';

/**
 * Search options must match the ones the index was built with. They are not stored in
 * the serialized index, so a mismatch here produces a search that silently returns
 * nothing for half its queries.
 */
const OPTIONS = {
  fields: [...SEARCH_FIELDS],
  storeFields: ['url', 'page', 'title', 'preview'],
  tokenize,
  processTerm: (term: string) => term,
  searchOptions: {
    boost: { title: 3 },
    prefix: true,
    fuzzy: (term: string) => (term.length > 4 ? 0.2 : false),
  },
};

const loadIndex = async (): Promise<void> => {
  if (index || loading) return loading ?? undefined;
  loading = fetch(`/search/${lang}.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`search index ${res.status}`);
      return res.text();
    })
    .then((json) => {
      index = MiniSearch.loadJSON<SearchDoc>(json, OPTIONS);
    })
    .catch((error: unknown) => {
      // A failed index is a search box that says so, not a page that breaks.
      console.error('search index failed to load', error);
    })
    .finally(() => {
      loading = null;
    });
  return loading;
};

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * A snippet centred on the first match, so a result shows why it matched rather than
 * the first 120 characters of every page.
 */
const snippet = (text: string, terms: readonly string[]): string => {
  if (!text) return '';
  const lower = text.toLowerCase();
  let at = -1;
  for (const term of terms) {
    const i = lower.indexOf(term.toLowerCase());
    if (i !== -1 && (at === -1 || i < at)) at = i;
  }
  const start = at <= 40 ? 0 : at - 40;
  const slice = text.slice(start, start + 150);
  const body = (start ? '…' : '') + slice + (start + 150 < text.length ? '…' : '');
  // Terms are highlighted after escaping, so a term containing markup cannot inject it.
  let html = escapeHtml(body);
  for (const term of [...terms].sort((a, b) => b.length - a.length)) {
    if (term.length < 2) continue;
    html = html.replace(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
  }
  return html;
};

export const mountSearch = (): void => {
  const dialog = document.querySelector<HTMLDialogElement>('#search-dialog');
  const input = document.querySelector<HTMLInputElement>('#search-input');
  const list = document.querySelector<HTMLElement>('#search-results');
  const status = document.querySelector<HTMLElement>('#search-status');
  const openers = document.querySelectorAll<HTMLButtonElement>('.search-open');
  if (!dialog || !input || !list || !status) return;

  let hits: Hit[] = [];
  let active = 0;

  const render = (): void => {
    list.innerHTML = hits
      .map((hit, i) => {
        const terms = input.value.split(/\s+/).filter(Boolean);
        return (
          `<li><a class="search-hit" href="${escapeHtml(hit.url)}"${i === active ? ' data-active' : ''}>` +
          `<span class="search-hit__title">${escapeHtml(hit.title)}</span>` +
          `<span class="search-hit__page">${escapeHtml(hit.page)}</span>` +
          `<span class="search-hit__text">${snippet(hit.preview ?? '', terms)}</span></a></li>`
        );
      })
      .join('');
  };

  const run = (): void => {
    const query = input.value.trim();
    if (!query || !index) {
      hits = [];
      list.innerHTML = '';
      status.textContent = index ? '' : (status.dataset.loading ?? '');
      return;
    }
    hits = index.search(query).slice(0, LIMIT) as unknown as Hit[];
    active = 0;
    status.textContent = hits.length ? '' : (status.dataset.empty ?? 'No results');
    render();
  };

  const open = async (): Promise<void> => {
    if (!dialog.open) dialog.showModal();
    input.focus();
    input.select();
    if (!index) {
      status.textContent = status.dataset.loading ?? 'Loading…';
      await loadIndex();
      run();
    }
  };

  for (const button of openers) button.addEventListener('click', () => void open());
  input.addEventListener('input', run);

  document.addEventListener('keydown', (event) => {
    // Cmd/Ctrl-K anywhere, or `/` when not already typing into something.
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((event.target as Element)?.tagName ?? '');
    if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
      event.preventDefault();
      void open();
    }
  });

  dialog.addEventListener('keydown', (event) => {
    if (!hits.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      active = (active + (event.key === 'ArrowDown' ? 1 : hits.length - 1)) % hits.length;
      render();
      list.querySelector('[data-active]')?.scrollIntoView({ block: 'nearest' });
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const url = hits[active]?.url;
      if (url) window.location.assign(url);
    }
  });

  // Clicking the backdrop closes it. `<dialog>` already handles Escape.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
};
