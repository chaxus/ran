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

/** Han, Hiragana, Katakana, Hangul — the scripts that do not delimit words with spaces. */
const CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯]/;
const CJK_RUN = /[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯]+/gu;
const NON_CJK_SPLIT = /[\s\p{P}\p{S}]+/u;

/**
 * Bigrams for CJK runs, ordinary word splitting for everything else.
 *
 * Bigrams rather than a dictionary segmenter: a segmenter needs a per-language wordlist
 * and still fails on technical terms, while bigrams need nothing, match substrings the
 * way a reader expects, and cost one extra token per character. The same function runs
 * over the query, so index and search agree by construction — which is the part that
 * silently breaks when the two are written separately.
 */
export const tokenize = (text: string): string[] => {
  const out: string[] = [];
  for (const chunk of text.split(NON_CJK_SPLIT)) {
    if (!chunk) continue;
    if (!CJK.test(chunk)) {
      out.push(chunk.toLowerCase());
      continue;
    }
    // A mixed chunk ("ranui组件") yields both the Latin remainder and the CJK bigrams.
    const runs = chunk.match(CJK_RUN) ?? [];
    for (const run of runs) {
      if (run.length === 1) out.push(run);
      for (let i = 0; i < run.length - 1; i++) out.push(run.slice(i, i + 2));
    }
    const latin = chunk.replace(CJK_RUN, ' ').trim();
    if (latin) out.push(...latin.split(/\s+/).map((s) => s.toLowerCase()));
  }
  return out;
};

export interface SearchDoc {
  /** Stable id: the page URL plus the section anchor. */
  id: string;
  /** Page URL, with the anchor already appended when the section has one. */
  url: string;
  /** The page's own title — shown as the result's context line. */
  page: string;
  /** The section heading, or the page title for the lead section. */
  title: string;
  text: string;
  /**
   * A short prefix of `text`, stored so a result can show *why* it matched.
   *
   * Capped rather than storing `text` itself: the body is the bulk of the index, and
   * keeping all of it would roughly double a file every reader downloads to search once.
   * A snippet longer than this does not fit a result row anyway.
   */
  preview: string;
}

/** Only the fields a result needs to render are stored; the rest is index-only. */
const STORE_FIELDS = ['url', 'page', 'title', 'preview'] as const;

/** Long enough to centre a match and show context either side of it. */
const PREVIEW_CHARS = 220;

export const SEARCH_FIELDS = ['title', 'text'] as const;

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
