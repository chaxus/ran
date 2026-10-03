/**
 * Build-time search index.
 *
 * MiniSearch does the ranking — BM25-ish scoring with prefix and fuzzy matching is not
 * something worth reimplementing, and getting it subtly wrong produces a search that
 * works in demos and fails on real queries.
 *
 * What *is* worth doing here is the tokenizer, because the default one is wrong for most
 * of this site's languages. MiniSearch splits on spaces and punctuation, which is
 * correct for English and useless for Chinese, Japanese and Korean: a sentence with no
 * spaces becomes a single token, so searching for a word inside it matches nothing.
 */
import MiniSearch from 'minisearch';
import type { Section } from './markdown.ts';

import { tokenize, SEARCH_FIELDS } from './search-shared.ts';
import type { SearchDoc } from './search-shared.ts';
export { tokenize, SEARCH_FIELDS } from './search-shared.ts';
export type { SearchDoc } from './search-shared.ts';

/** Only the fields a result needs to render are stored; the rest is index-only. */
const STORE_FIELDS = ['url', 'page', 'title', 'preview'] as const;

/** Long enough to centre a match and show context either side of it. */
const PREVIEW_CHARS = 220;

export const createIndex = (): MiniSearch<SearchDoc> =>
  new MiniSearch<SearchDoc>({
    fields: [...SEARCH_FIELDS],
    storeFields: [...STORE_FIELDS],
    tokenize,
    // Queries are lower-cased by `tokenize` already; MiniSearch would otherwise apply
    // its own processing on top and the two would disagree about case folding.
    processTerm: (term) => term,
    searchOptions: {
      // A heading match is a much stronger signal than a mention halfway down a page.
      boost: { title: 3 },
      prefix: true,
      // Typo tolerance, but only for terms long enough that a fuzzy match means
      // something — on a two-character CJK bigram it would match almost anything.
      fuzzy: (term) => (term.length > 4 ? 0.2 : false),
    },
  });

export interface IndexablePage {
  url: string;
  title: string;
  sections: readonly Section[];
}

/** One serialized index, ready to be written next to the pages it covers. */
export const buildIndex = (pages: readonly IndexablePage[]): string => {
  const index = createIndex();
  const docs: SearchDoc[] = [];
  for (const page of pages) {
    for (const section of page.sections) {
      const text = section.text.trim();
      // A heading with nothing under it is still worth finding; a section with neither
      // heading nor prose is not.
      if (!text && !section.title) continue;
      docs.push({
        id: section.slug ? `${page.url}#${section.slug}` : page.url,
        url: section.slug ? `${page.url}#${encodeURIComponent(section.slug)}` : page.url,
        page: page.title,
        title: section.title || page.title,
        text,
        preview: text.slice(0, PREVIEW_CHARS),
      });
    }
  }
  index.addAll(docs);
  return JSON.stringify(index);
};
