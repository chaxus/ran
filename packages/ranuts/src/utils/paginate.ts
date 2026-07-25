/**
 * Paginate plain text into fixed-size boxes — the layout a reader, a teleprompter or a
 * printable preview needs, where the same text must be cut into pages of a known size.
 *
 * The whole thing is **pure arithmetic**: it takes the box dimensions and the type metrics as
 * numbers and never touches the DOM. That is what lets it run inside a Worker, on the server,
 * or in a test — measure the container once on the main thread, then paginate anywhere.
 *
 * It assumes a **monospaced grid**: every character advances either one cell (CJK, full-width)
 * or `narrowRatio` of one (ASCII). That is exactly true for a monospaced font and close enough
 * for the CJK-dominant body text this was built for; it is *not* a substitute for real shaping
 * on proportional Latin text.
 */

/** The box each page must fit into, in px. */
export interface TextBox {
  width: number;
  height: number;
}

export interface TextGridMetrics {
  /** Advance width of one full-width character, px (font size + letter spacing). */
  charWidth: number;
  /** Distance between baselines, px. */
  lineHeight: number;
  /**
   * Advance of a narrow (ASCII) character as a fraction of `charWidth`. Default `0.5625`
   * (9/16), the usual half-width-plus-spacing ratio.
   */
  narrowRatio?: number;
}

export interface PaginateOptions {
  /**
   * Below this, in either dimension, the box is treated as not yet laid out and pagination
   * returns nothing. Default `30`. Guards against paginating during first paint, when a
   * container still measures 0 and a naive `floor(0 / charWidth)` would loop forever.
   */
  minBox?: number;
}

export interface TextPage {
  text: string;
  /** Offset of this page's first character in the source text. */
  start: number;
  /** Offset one past this page's last character. */
  end: number;
  index: number;
}

export interface PaginateResult {
  pages: TextPage[];
  /** Length of the normalized source text. */
  total: number;
  charsPerLine: number;
  linesPerPage: number;
  /** `charsPerLine * linesPerPage` — the budget one page spends. */
  charsPerPage: number;
}

/**
 * Lookup table for "counts as part of a word": `\w` plus the ASCII punctuation that should
 * not be split off from it. Indexed by char code, ASCII only — anything above 127 (CJK,
 * full-width) is deliberately not a word character, so it may wrap anywhere.
 *
 * Built once as a table rather than testing a regex per character: this runs in the innermost
 * loop, once per character of the whole text, and the regex version dominated the profile.
 */
const WORD_PART = ((): Uint8Array => {
  const table = new Uint8Array(128);
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-.,!?;:\'"()[]{}';
  for (let i = 0; i < chars.length; i++) table[chars.charCodeAt(i)] = 1;
  return table;
})();

const isWordCode = (code: number): boolean => code < 128 && WORD_PART[code] === 1;

const EMPTY: Omit<PaginateResult, 'total'> = {
  pages: [],
  charsPerLine: 0,
  linesPerPage: 0,
  charsPerPage: 0,
};

/**
 * @description: Cut text into pages that fit `box`, given the type metrics.
 *
 * ASCII words are kept whole: a page never ends mid-word unless the word is longer than a
 * line. Newlines start a new line and are charged one character.
 *
 * @param {string} text source text; `\r\n` / `\r` are normalized to `\n` first
 * @param {TextBox} box page box in px — measure the container once, then call this anywhere
 * @param {TextGridMetrics} metrics character advance and line height, px
 * @param {PaginateOptions} options
 * @return {PaginateResult} pages plus the grid it derived
 * @example
 * ```ts
 * const { width, height } = container.getBoundingClientRect();
 * const result = paginateText(book, { width, height }, { charWidth: 18.4, lineHeight: 40 });
 * render(result.pages[0].text);
 * ```
 */
export const paginateText = (
  text: string,
  box: TextBox,
  metrics: TextGridMetrics,
  options: PaginateOptions = {},
): PaginateResult => {
  const source = text.replace(/(?:\r\n|\r|\n)+/g, '\n') || '';
  const total = source.length;
  const minBox = options.minBox ?? 30;
  const { charWidth, lineHeight } = metrics;
  const narrowRatio = metrics.narrowRatio ?? 0.5625;

  if (box.width < minBox || box.height < minBox || charWidth <= 0 || lineHeight <= 0) {
    return { ...EMPTY, total };
  }

  const charsPerLine = Math.floor(box.width / charWidth);
  const linesPerPage = Math.floor(box.height / lineHeight);
  const charsPerPage = charsPerLine * linesPerPage;
  if (charsPerLine <= 0 || linesPerPage <= 0) return { ...EMPTY, total };

  /** End of the word starting at `start` (the space that terminates it). */
  const findNextWordEnd = (start: number): number => {
    let pos = start;
    let lastWordEnd = start;
    while (pos < total) {
      const code = source.charCodeAt(pos);
      if (isWordCode(code)) {
        pos++;
      } else if (code === 32) {
        lastWordEnd = pos;
        pos++;
        break;
      } else {
        pos++;
      }
    }
    return lastWordEnd;
  };

  /** Start of the word that `end` falls inside. */
  const findWordStart = (end: number): number => {
    let pos = end;
    let lastWordStart = end;
    while (pos > 0) {
      const code = source.charCodeAt(pos - 1);
      if (isWordCode(code)) {
        lastWordStart = pos - 1;
        pos--;
      } else if (code === 32) {
        break;
      } else {
        pos--;
      }
    }
    return lastWordStart;
  };

  const pages: TextPage[] = [];
  let useChar = 0;

  while (total > useChar) {
    let currentLine = 0;
    let currentChart = 0;
    const pageStart = useChar;
    let remainingChars = charsPerPage;

    // Two cursors advance together, so the page text is one `slice` at the end rather than
    // a character-by-character `+=` — on a million-character book that is the difference
    // between milliseconds and seconds.
    while (currentLine < linesPerPage && currentChart < charsPerPage && useChar < total) {
      const code = source.charCodeAt(useChar);

      if (code === 10 || code === 13) {
        currentLine++;
        currentChart = 0;
        useChar++;
        remainingChars--;
        continue;
      }

      const isWordPartChar = isWordCode(code);

      if (currentChart >= charsPerLine) {
        if (isWordPartChar) {
          const wordStart = findWordStart(useChar);
          const wordEnd = findNextWordEnd(useChar);
          // A word longer than a whole line has to be broken; anything else wraps intact.
          if (wordEnd - wordStart > charsPerLine) {
            currentLine++;
            currentChart = 0;
            continue;
          }
        }
        currentLine++;
        currentChart = 0;
        continue;
      }

      useChar++;
      currentChart += isWordPartChar ? narrowRatio : 1;
      remainingChars--;
    }

    // Ending mid-word: if the whole word cannot fit in what is left, push it to the next page.
    if (useChar < total && isWordCode(source.charCodeAt(useChar))) {
      const wordStart = findWordStart(useChar);
      const wordEnd = findNextWordEnd(useChar);
      // `wordStart > pageStart` is load-bearing. A word longer than a whole page — a URL, a
      // base64 blob, a long punctuation run, all of which count as word characters — would
      // otherwise rewind the cursor to exactly where this page began, so the page would come
      // out empty and the outer loop would never advance: a hang, not a bad layout. When the
      // word spans the whole page there is nothing to defer it to, so it gets hard-broken.
      if (wordEnd - wordStart > remainingChars && wordStart > pageStart) useChar = wordStart;
    }

    // Backstop: a box too small to hold even one character leaves the cursor unmoved.
    if (useChar === pageStart) break;

    pages.push({ text: source.slice(pageStart, useChar), start: pageStart, end: useChar, index: pages.length });
  }

  return { pages, total, charsPerLine, linesPerPage, charsPerPage };
};
