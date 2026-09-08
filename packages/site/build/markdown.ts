/**
 * The build-time markdown pipeline.
 *
 * Built on `marked`, which is already ranui's parser — one markdown implementation
 * across the ecosystem rather than two that disagree at the edges.
 *
 * Note what this is *not*: `ranui`'s `<r-markdown>` renders untrusted, streaming model
 * output in the browser and sanitises hard for that reason — `USE_PROFILES: { html: true }`
 * plus `FORBID_ATTR: ['style']`, which strips every custom element and every inline style.
 * Pointed at this site's own source it would delete the markup the pages are made of. The
 * source here is trusted and the rendering happens at build time, so the two jobs need
 * different tools, and this is the other one.
 */
import { Marked, Renderer } from 'marked';
import type { Token, Tokens, TokenizerAndRendererExtension } from 'marked';
import { createHighlighter } from 'shiki';
import type { Highlighter } from 'shiki';
import { ORIGIN } from './config.ts';

export interface TocEntry {
  level: 2 | 3;
  text: string;
  slug: string;
}

export interface RenderedMarkdown {
  html: string;
  toc: TocEntry[];
  /** First substantive prose paragraph, cleaned — the meta description fallback. */
  excerpt: string;
}

// ── Syntax highlighting ─────────────────────────────────────────────────────
// One highlighter for the whole build. Creating it loads the grammars, which is the
// expensive part; doing it per page turned a 2s build into a 40s one.

/**
 * Languages the site actually writes code in. Shiki loads grammars eagerly, and the
 * full set is ~600 of them — naming the handful in use keeps the build fast. An
 * unlisted language is not a silent failure: `highlight()` throws and names it.
 */
const LANGS = [
  'ts',
  'js',
  'tsx',
  'jsx',
  'html',
  'css',
  'json',
  'md',
  'sh',
  'bash',
  'rust',
  'wasm',
  'yaml',
  'toml',
  'diff',
  'sql',
  'python',
] as const;

/**
 * Two themes rendered into one `<pre>`: shiki emits `--shiki-light` / `--shiki-dark`
 * custom properties per token and `defaultColor: false` stops it also writing a
 * concrete `color`. `site.css` then picks a side per theme. One copy of the markup
 * serves both, and switching themes repaints without a re-render.
 */
const THEMES = { light: 'github-light', dark: 'github-dark' } as const;

let highlighter: Highlighter | null = null;

export const initHighlighter = async (): Promise<void> => {
  highlighter ??= await createHighlighter({ themes: [THEMES.light, THEMES.dark], langs: [...LANGS] });
};

const highlight = (code: string, lang: string): string => {
  if (!highlighter) throw new Error('initHighlighter() must be awaited before rendering markdown');
  const known = (LANGS as readonly string[]).includes(lang);
  if (lang && !known) {
    throw new Error(`unknown code fence language "${lang}" — add it to LANGS in build/markdown.ts`);
  }
  return highlighter.codeToHtml(code, {
    lang: known ? lang : 'text',
    themes: THEMES,
    defaultColor: false,
  });
};

// ── Slugs ───────────────────────────────────────────────────────────────────

/**
 * A heading's anchor. CJK is kept verbatim rather than transliterated: a Chinese
 * heading would otherwise slug to the empty string and every anchor on the page would
 * collide into `section-1`, `section-2`… Percent-encoding in the URL is fine, and it
 * is what every Chinese-language site with heading links already does.
 */
export const slugify = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[\s　]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}\-_]/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');

// ── Custom containers ───────────────────────────────────────────────────────

const CONTAINER_KINDS = new Set(['note', 'tip', 'warning', 'danger']);

/**
 * `::: warning [optional title]` … `:::` → an `<aside>`.
 *
 * A block-level marked extension rather than a regex pass over the output, so the body
 * is real markdown (links, code, lists) instead of escaped text.
 */
const container: TokenizerAndRendererExtension = {
  name: 'container',
  level: 'block',
  start: (src: string) => src.match(/^:{3}/m)?.index,
  tokenizer(src: string) {
    const match = /^:{3}[ \t]*([a-z]+)[ \t]*([^\n]*)\n([\s\S]*?)\n:{3}[ \t]*(?:\n|$)/.exec(src);
    if (!match) return undefined;
    const [raw, kind, title, body] = match;
    if (!CONTAINER_KINDS.has(kind)) {
      throw new Error(`unknown container ":::${kind}" — expected one of ${[...CONTAINER_KINDS].join(', ')}`);
    }
    return {
      type: 'container',
      raw,
      kind,
      title: title.trim(),
      tokens: this.lexer.blockTokens(body, []),
    };
  },
  renderer(token: Tokens.Generic): string {
    const body = this.parser.parse(token.tokens ?? []);
    const label = (token.title as string) || (token.kind as string);
    return `<aside class="callout callout--${token.kind}"><p class="callout__label">${escapeHtml(label)}</p>${body}</aside>\n`;
  },
};

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── Parser ──────────────────────────────────────────────────────────────────

const isExternal = (href: string): boolean => /^https?:\/\//.test(href) && !href.startsWith(ORIGIN);

const createParser = (slugs: Map<string, number>, toc: TocEntry[]): Marked => {
  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    extensions: [container],
    renderer: {
      code({ text, lang }: Tokens.Code): string {
        const language = (lang ?? '').trim().split(/\s+/)[0] ?? '';
        return `<figure class="code" data-lang="${escapeHtml(language || 'text')}">${highlight(text, language)}</figure>\n`;
      },
      heading({ tokens, depth }: Tokens.Heading): string {
        const text = this.parser.parseInline(tokens);
        const plain = text.replace(/<[^>]+>/g, '');
        let slug = slugify(plain) || 'section';
        // Two headings with the same words are a real thing ("Why", "Why" in different
        // sections). Suffix rather than collide, so in-page links stay unambiguous.
        const seen = slugs.get(slug) ?? 0;
        slugs.set(slug, seen + 1);
        if (seen) slug = `${slug}-${seen + 1}`;
        if (depth === 2 || depth === 3) toc.push({ level: depth, text: plain, slug });
        // The anchor is a real link, and it is the heading itself — not a hover-only
        // pilcrow, which is invisible on touch devices where sharing a section link is
        // most common.
        return `<h${depth} id="${slug}"><a class="anchor" href="#${slug}">${text}</a></h${depth}>\n`;
      },
      link({ href, title, tokens }: Tokens.Link): string {
        const text = this.parser.parseInline(tokens);
        const attrs = [`href="${escapeHtml(href)}"`];
        if (title) attrs.push(`title="${escapeHtml(title)}"`);
        // noopener is a security requirement, not a preference: without it the opened
        // page gets a handle on window.opener and can navigate this tab away.
        if (isExternal(href)) attrs.push('target="_blank"', 'rel="noopener noreferrer"');
        return `<a ${attrs.join(' ')}>${text}</a>`;
      },
      image({ href, title, text }: Tokens.Image): string {
        const attrs = [`src="${escapeHtml(href)}"`, `alt="${escapeHtml(text)}"`, 'loading="lazy"', 'decoding="async"'];
        if (title) attrs.push(`title="${escapeHtml(title)}"`);
        return `<img ${attrs.join(' ')}>`;
      },
      table(token: Tokens.Table): string {
        // Wrapped so a wide table scrolls inside its own box. Without the wrapper the
        // table's min-content width pushes the page itself sideways — the exact bug
        // packages/docs hit and fixed the same way.
        const html = Renderer.prototype.table.call(this, token);
        return `<div class="table-wrap">${html}</div>\n`;
      },
    },
  });
  return marked;
};

/**
 * First substantive prose paragraph, flattened — used as the meta description when a
 * page declares none. Without it every page shares the site-level description, which
 * is what packages/docs discovered across 316 pages.
 */
const firstParagraph = (tokens: Token[]): string => {
  for (const token of tokens) {
    if (token.type !== 'paragraph') continue;
    const text = (token.raw ?? '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/`([^`]*)`/g, '$1')
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) return text;
  }
  return '';
};

/** Trim to `max` characters on a word/CJK boundary, with an ellipsis when cut. */
export const truncate = (s: string, max = 155): string => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trim()}…`;
};

export const renderMarkdown = (source: string): RenderedMarkdown => {
  const toc: TocEntry[] = [];
  const marked = createParser(new Map(), toc);
  const tokens = marked.lexer(source);
  const html = marked.parser(tokens) as string;
  return { html, toc, excerpt: truncate(firstParagraph(tokens)) };
};
