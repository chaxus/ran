/**
 * Markdown → sanitized HTML → enhanced DOM, for <r-markdown>.
 *
 * This module is the component's lazy chunk: it pulls in marked, DOMPurify and remend
 * (and, transitively, `blocks.ts`). The component shell only `import()`s it from
 * `render()`, so `dist/markdown.js` stays a stub and apps that never render markdown
 * never download the parser.
 *
 * Pipeline:
 *   markdown ──lex once──▶ tokens ──group──▶ blocks
 *   block ──marked parser──▶ HTML ──DOMPurify──▶ safe HTML ──innerHTML──▶ DOM
 *   ──enhance()──▶ code-block chrome, <r-mermaid>, <r-math>, table wrappers, safe links,
 *   optional shiki highlighting.
 *
 * The document is lexed **once** and each block is rendered from its own tokens
 * (`parser.parser(tokens)`), never by re-parsing a slice of the source text. That keeps a
 * single source of truth: a block's kind (`table`, `code`, math) comes from its token type
 * rather than from matching the text again, and cross-block state the lexer resolved —
 * link reference definitions, for one — survives into the rendered block.
 */
import { Marked } from 'marked';
import type { Token, TokenizerAndRendererExtension, Tokens } from 'marked';
import DOMPurify from 'dompurify';
import type { Config as PurifyConfig } from 'dompurify';
import remend from 'remend';
import { escapeHtml } from 'ranuts/utils';
import { ButtonBuilder, Div, Span, View, createRef } from '@/utils/builder';
import { splitTokens, hasIncompleteCodeFence } from './blocks';
import { highlight, parseThemes } from './highlight';
import type { HighlightThemes } from './highlight';

export { remend };

// ── Math extensions ──────────────────────────────────────────────────────────
// Math is emitted as an inert placeholder element carrying the source in a data
// attribute (which DOMPurify preserves); `enhance()` swaps it for <r-math>. `$$…$$`
// and `\[…\]` are always block math, `\(…\)` is always inline; `$…$` is opt-in
// (ambiguous with currency) — see the `inline-math` attribute.

const mathPlaceholder = (latex: string, display: 'block' | 'inline'): string =>
  `<span class="ran-md-math" data-ran-math="${escapeHtml(latex)}" data-display="${display}"></span>`;

interface Delimited {
  raw: string;
  text: string;
}

/**
 * Read `open … close` anchored at the start of `src`, by scanning for the closing
 * delimiter rather than letting a lazy `[\s\S]+?` backtrack towards it. An unterminated
 * delimiter costs one `indexOf` instead of an expansion attempt per position, and the
 * span has no length ceiling.
 *
 * `blockLevel` additionally requires the construct to own its line — the closing
 * delimiter must be followed by a newline or the end of the input — and then swallows
 * the blank lines after it, matching how marked's own block tokenizers consume input.
 */
const readDelimited = (src: string, open: string, close: string, blockLevel: boolean): Delimited | null => {
  if (!src.startsWith(open)) return null;
  const from = open.length;
  const end = src.indexOf(close, from);
  if (end === -1 || end === from) return null;
  let stop = end + close.length;
  if (blockLevel) {
    if (stop !== src.length && src[stop] !== '\n') return null;
    while (src[stop] === '\n') stop += 1;
  }
  return { raw: src.slice(0, stop), text: src.slice(from, end).trim() };
};

const blockMath: TokenizerAndRendererExtension = {
  name: 'ranMathBlock',
  level: 'block',
  start(src: string): number | undefined {
    const a = src.indexOf('$$');
    const b = src.indexOf('\\[');
    if (a === -1) return b === -1 ? undefined : b;
    if (b === -1) return a;
    return Math.min(a, b);
  },
  tokenizer(src: string): Tokens.Generic | undefined {
    const m = readDelimited(src, '$$', '$$', true) || readDelimited(src, '\\[', '\\]', true);
    if (!m) return undefined;
    return { type: 'ranMathBlock', raw: m.raw, text: m.text };
  },
  renderer(token: Tokens.Generic): string {
    return `<p class="ran-md-math-block">${mathPlaceholder(token.text as string, 'block')}</p>\n`;
  },
};

/** Index of the first `$` that is not part of a `$$`, or -1. */
const findLoneDollar = (src: string): number => {
  for (let i = 0; i < src.length; i += 1) {
    if (src[i] !== '$') continue;
    if (src[i + 1] === '$') {
      i += 1; // skip both halves of a `$$`
      continue;
    }
    if (i > 0 && src[i - 1] === '$') continue;
    return i;
  }
  return -1;
};
/**
 * `$…$`: no whitespace right after the opening `$` or before the closing one, and the
 * closing `$` is not followed by a digit ("$5 and $10" stays currency). Unlike the block
 * delimiters this encodes real lexical rules rather than just "find the terminator", and
 * `[^$\\\n]` confines it to a single line, so it stays a pattern.
 */
const INLINE_MATH_DOLLAR = /^\$(?!\s)((?:\\.|[^$\\\n])+?)(?<!\s)\$(?!\d)/;

const inlineMathExtension = (dollar: boolean): TokenizerAndRendererExtension => ({
  name: 'ranMathInline',
  level: 'inline',
  start(src: string): number | undefined {
    const a = src.indexOf('\\(');
    const b = dollar ? findLoneDollar(src) : -1;
    if (a === -1) return b === -1 ? undefined : b;
    if (b === -1) return a;
    return Math.min(a, b);
  },
  tokenizer(src: string): Tokens.Generic | undefined {
    const paren = readDelimited(src, '\\(', '\\)', false);
    if (paren) return { type: 'ranMathInline', raw: paren.raw, text: paren.text };
    const m = dollar ? INLINE_MATH_DOLLAR.exec(src) : null;
    if (!m) return undefined;
    return { type: 'ranMathInline', raw: m[0], text: m[1].trim() };
  },
  renderer(token: Tokens.Generic): string {
    return mathPlaceholder(token.text as string, 'inline');
  },
});

// ── Parser instances ─────────────────────────────────────────────────────────

const parsers = new Map<string, Marked>();

const getParser = (inlineDollarMath: boolean): Marked => {
  const key = inlineDollarMath ? 'dollar' : 'default';
  let p = parsers.get(key);
  if (!p) {
    p = new Marked({ gfm: true, breaks: false, async: false });
    p.use({ extensions: [blockMath, inlineMathExtension(inlineDollarMath)] });
    parsers.set(key, p);
  }
  return p;
};

// ── Sanitizer ────────────────────────────────────────────────────────────────

// `RETURN_DOM_FRAGMENT` hands back the DOM DOMPurify already built while sanitizing.
// Returning a string instead would serialize that tree just so the component could parse
// it a second time — on every token, for the block being streamed.
const PURIFY_CONFIG = {
  USE_PROFILES: { html: true },
  // Task-list checkboxes are the only form control markdown legitimately produces.
  FORBID_TAGS: ['style', 'form', 'textarea', 'select', 'button', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['style'],
  ADD_ATTR: ['target'],
  RETURN_DOM_FRAGMENT: true,
} satisfies PurifyConfig & { RETURN_DOM_FRAGMENT: true };

// ── Document / blocks ────────────────────────────────────────────────────────

export interface RenderOptions {
  /** Treat `$…$` as inline math (default false — ambiguous with currency). */
  inlineMath?: boolean;
  /** Split into blocks for incremental re-render (streaming). Off → one block. */
  split?: boolean;
}

export interface MarkdownBlock {
  /** The top-level tokens this block renders. */
  tokens: Token[];
  /** Concatenated token source. */
  raw: string;
  /**
   * Change key for block diffing. The block's own source, plus the document's link
   * reference definitions: the lexer resolves `[text][id]` against definitions anywhere
   * in the document, so editing one can change a block whose own source did not move.
   */
  key: string;
  /** Contains a GFM table, by token type. */
  hasTable: boolean;
  /** Ends in a fenced code block whose fence has not closed yet. */
  incompleteCode: boolean;
}

export interface MarkdownDocument {
  blocks: MarkdownBlock[];
  /** Render one of this document's blocks to a sanitized DOM fragment. */
  render(block: MarkdownBlock): DocumentFragment;
}

/** Joins the parts of a composite diff key. U+0000 cannot occur in markdown source. */
const KEY_SEPARATOR = '\u0000';

const toBlock = (tokens: Token[], defs: string): MarkdownBlock => {
  let raw = '';
  let hasTable = false;
  for (const t of tokens) {
    raw += t.raw;
    if (t.type === 'table') hasTable = true;
  }
  const last = tokens[tokens.length - 1];
  return {
    tokens,
    raw,
    key: defs ? `${raw}${KEY_SEPARATOR}${defs}` : raw,
    hasTable,
    incompleteCode: last?.type === 'code' && hasIncompleteCodeFence(last.raw),
  };
};

/** Lex `markdown` once and group its tokens into independently renderable blocks. */
export const parseDocument = (markdown: string, options: RenderOptions = {}): MarkdownDocument => {
  const parser = getParser(!!options.inlineMath);
  const render = (block: MarkdownBlock): DocumentFragment =>
    DOMPurify.sanitize(parser.parser(block.tokens), PURIFY_CONFIG);
  if (!markdown.trim()) return { blocks: [], render };
  const tokens = parser.lexer(markdown);
  let defs = '';
  for (const t of tokens) if (t.type === 'def') defs += t.raw;
  const groups = options.split === false ? [Array.from(tokens)] : splitTokens(tokens);
  return { blocks: groups.map((g) => toBlock(g, defs)), render };
};

// ── DOM enhancement ──────────────────────────────────────────────────────────

export interface EnhanceContext {
  /** Whether the code fence in this block is still open (streaming). */
  incomplete: boolean;
  copy: boolean;
  download: boolean;
  lineNumbers: boolean;
  /** `null` → no highlighting; otherwise the theme pair to use. */
  highlight: HighlightThemes | null;
  linkTarget: string;
  theme: string;
  labels: { copy: string; download: string };
  /** Copy pressed on a code block. `icon` is the button's <r-icon>, for the tick state. */
  onCopy(icon: HTMLElement | null, code: string, lang: string): void;
  /** Download pressed on a code block. */
  onDownload(code: string, lang: string): void;
}

export interface EnhanceResult {
  /**
   * Embedded renderers that bake the theme into their output, handed back so the
   * component can retheme them from a reference instead of searching the rendered DOM.
   */
  themed: HTMLElement[];
}

const LANG_CLASS_PREFIX = 'language-';

/**
 * Language and source of a rendered code block. marked emits exactly one
 * `language-<first word of the info string>` class and escapes the body, so `classList`
 * and `textContent` read both back losslessly — no need to match the class attribute or
 * the code text against a pattern. The single trailing newline is marked's own.
 */
const readCodeBlock = (codeEl: Element): { lang: string; code: string } => {
  const langClass = Array.from(codeEl.classList).find((c) => c.startsWith(LANG_CLASS_PREFIX));
  const text = codeEl.textContent || '';
  return {
    lang: langClass ? langClass.slice(LANG_CLASS_PREFIX.length).toLowerCase() : '',
    code: text.endsWith('\n') ? text.slice(0, -1) : text,
  };
};

/**
 * A code-block toolbar button. The handler is bound at build time and closes over the
 * code it acts on, so pressing it needs neither event delegation nor a lookup back into
 * the rendered DOM. The listener dies with the button when the block is re-rendered.
 */
const iconButton = (
  action: string,
  icon: string,
  label: string,
  onClick: (icon: HTMLElement | null) => void,
): HTMLButtonElement => {
  const iconRef = createRef<HTMLElement>();
  return ButtonBuilder()
    .class('ran-md-btn')
    .part('button')
    .attr('type', 'button')
    .data('md-action', action)
    .aria('label', label)
    .attr('title', label)
    .children(View('r-icon').attr('name', icon).attr('size', '16').attr('color', 'currentColor').ref(iconRef))
    .on('click', () => onClick(iconRef.current))
    .build();
};

/** One `<span class="line">` per source line so line numbers can use CSS counters. */
const codeLines = (code: string): HTMLElement[] => {
  const lines = code.split('\n');
  if (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  return lines.flatMap((l, i) => {
    const line = Span().class('line').text(l).build();
    return i === 0 ? [line] : [document.createTextNode('\n') as unknown as HTMLElement, line];
  });
};

/** A `<pre class="ran-md-pre"><code>` holding the plain (un-highlighted) code. */
const plainPre = (code: string): HTMLPreElement =>
  View<HTMLPreElement>('pre')
    .class('ran-md-pre')
    .children(View('code').children(...codeLines(code)))
    .build();

const applyHighlight = (
  container: HTMLElement,
  slot: { pre: HTMLElement },
  code: string,
  lang: string,
  themes: HighlightThemes,
  token: number,
): void => {
  const result = highlight(code, lang, themes);
  const apply = (html: string | null): void => {
    // The block may have been re-rendered (streaming) or removed while shiki loaded.
    if (!html || !container.isConnected || Number(container.dataset.renderToken) !== token) return;
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    const shikiPre = tpl.content.firstElementChild as HTMLElement | null;
    if (!shikiPre || shikiPre.tagName !== 'PRE') return;
    shikiPre.classList.add('ran-md-pre');
    shikiPre.removeAttribute('style');
    shikiPre.removeAttribute('tabindex');
    slot.pre.replaceWith(shikiPre);
    slot.pre = shikiPre;
  };
  if (typeof result === 'string') apply(result);
  else result.then(apply);
};

let renderSeq = 0;

const mermaidElement = (code: string, ctx: EnhanceContext): HTMLElement =>
  View('r-mermaid')
    .class('ran-md-mermaid')
    .attr('code', encodeURIComponent(code.trim()))
    .attr('theme', ctx.theme)
    .boolAttr('copy', ctx.copy)
    .boolAttr('download', ctx.download)
    .boolAttr('fullscreen', true)
    .build();

const mathElement = (latex: string, display: 'block' | 'inline'): HTMLElement =>
  View('r-math').attr('latex', encodeURIComponent(latex)).attr('display', display).build();

/** Rewrites one `<pre>`; returns an embedded renderer to retheme, if it made one. */
const enhanceCodeBlock = (pre: HTMLPreElement, ctx: EnhanceContext): HTMLElement | null => {
  const codeEl = pre.firstElementChild;
  if (!codeEl || codeEl.tagName !== 'CODE') return null;
  const { lang, code } = readCodeBlock(codeEl);

  // ```mermaid → <r-mermaid> once the fence is closed (a half-streamed diagram is
  // never valid; keep it as a plain code block until then).
  if (lang === 'mermaid' && !ctx.incomplete) {
    void import('@/components/mermaid');
    const diagram = mermaidElement(code, ctx);
    pre.replaceWith(diagram);
    return diagram;
  }
  // ```math / ```latex → block <r-math> (GitHub convention).
  if ((lang === 'math' || lang === 'latex') && !ctx.incomplete) {
    void import('@/components/math');
    pre.replaceWith(mathElement(code.trim(), 'block'));
    return null;
  }

  const token = ++renderSeq;
  const actions: HTMLElement[] = [];
  if (ctx.copy) {
    actions.push(iconButton('copy', 'copy', ctx.labels.copy, (icon) => ctx.onCopy(icon, code, lang)));
  }
  if (ctx.download) {
    actions.push(iconButton('download', 'download', ctx.labels.download, () => ctx.onDownload(code, lang)));
  }
  const header =
    lang || actions.length
      ? Div()
          .class('ran-md-code-header')
          .part('code-header')
          .children(
            Span().class('ran-md-code-lang').part('code-lang').text(lang),
            Span()
              .class('ran-md-code-actions')
              .part('code-actions')
              .children(...actions),
          )
      : null;

  const slot = { pre: plainPre(code) as HTMLElement };
  const container = Div()
    .class('ran-md-code')
    .part('code')
    .data('render-token', String(token))
    .children(header, slot.pre)
    .build();
  if (lang) container.dataset.language = lang;
  if (ctx.incomplete) container.dataset.incomplete = '';
  if (ctx.lineNumbers) container.dataset.lineNumbers = '';
  pre.replaceWith(container);

  if (ctx.highlight) applyHighlight(container, slot, code, lang, ctx.highlight, token);
  return null;
};

/**
 * Post-process one rendered block in place.
 *
 * The block's DOM is parser output, so there is no builder reference to hold onto for
 * the nodes markdown produced — but finding them needs no CSS selectors either: a single
 * `TreeWalker` pass collects them by tag, replacing five `querySelectorAll` sweeps with
 * one traversal. Everything ranui *adds* is built with the builder.
 *
 * Nodes are collected first and mutated after: replacing an element mid-traversal would
 * move the walker out from under itself.
 */
export const enhance = (root: HTMLElement, ctx: EnhanceContext): EnhanceResult => {
  const pres: HTMLPreElement[] = [];
  const links: HTMLAnchorElement[] = [];
  const tables: HTMLTableElement[] = [];
  const images: HTMLImageElement[] = [];
  const maths: HTMLElement[] = [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const el = node as HTMLElement;
    switch (el.tagName) {
      case 'PRE':
        pres.push(el as HTMLPreElement);
        break;
      case 'A':
        links.push(el as HTMLAnchorElement);
        break;
      case 'TABLE':
        tables.push(el as HTMLTableElement);
        break;
      case 'IMG':
        images.push(el as HTMLImageElement);
        break;
      case 'SPAN':
        if (el.dataset.ranMath !== undefined) maths.push(el);
        break;
      default:
        break;
    }
  }

  const themed: HTMLElement[] = [];
  for (const pre of pres) {
    const el = enhanceCodeBlock(pre, ctx);
    if (el) themed.push(el);
  }

  if (maths.length > 0) {
    void import('@/components/math');
    for (const node of maths) {
      node.replaceWith(mathElement(node.dataset.ranMath || '', node.dataset.display === 'inline' ? 'inline' : 'block'));
    }
  }

  for (const a of links) {
    const href = a.getAttribute('href');
    if (!href) {
      // remend rewrites half-streamed links to a `streamdown:` URL that DOMPurify then
      // drops → an <a> without href. Mark it so CSS can render it as plain text.
      a.dataset.incomplete = '';
      continue;
    }
    if (href.startsWith('#')) continue;
    if (ctx.linkTarget && ctx.linkTarget !== '_self') {
      a.setAttribute('target', ctx.linkTarget);
      a.setAttribute('rel', 'noopener noreferrer');
    }
  }

  for (const table of tables) {
    const wrap = Div().class('ran-md-table-wrap').part('table').build();
    table.replaceWith(wrap);
    wrap.appendChild(table);
  }

  for (const img of images) {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
  }

  return { themed };
};

export { parseThemes };
export type { HighlightThemes };
