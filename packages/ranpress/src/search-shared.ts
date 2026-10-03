/** Shared browser/build search contract, without the indexing engine. */
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

export const SEARCH_FIELDS = ['title', 'text'] as const;
