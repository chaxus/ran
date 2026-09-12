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
  // `text` doubles as the fallback for a fence with no language, so it must be listed.
  'text',
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
    // No tag stripping here: the character filter below drops every `<`, `>` and quote
    // anyway, so a regex that only *mostly* removes tags would add nothing but the
    // false impression that this function sanitizes. It takes plain text — see
    // `plainText()` for how callers get it.
    .replace(/[\s　]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}\-_]/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');

/**
 * Plain text from an inline token tree.
 *
 * The obvious alternative — render to HTML and strip tags with `/<[^>]+>/g` — is both
 * wrong and a liability. Wrong because it leaves entities behind (`&amp;` stays
 * literal) and because nested constructs like `<scr<b>ipt>` survive a single pass.
 * A liability because a regex that removes *most* tags reads like a sanitizer to every
 * later reader and to every scanner, and is treated as one.
 *
 * The tokens are already the structure, so this reads it directly. `html` tokens —
 * raw markup someone typed into the prose — are dropped, which is the tag removal,
 * done by the parser rather than by a pattern. `codespan` is kept: a heading or an
 * excerpt about `<r-markdown>` has to still contain that word.
 */
/**
 * The entities marked leaves sitting in a `text` token.
 *
 * Token text is the markdown source, so `&amp;` arrives as those five characters. Plain
 * text is what this module hands to `escapeHtml` downstream, which would turn it into
 * `&amp;amp;` and render the entity literally in a meta description or a post card.
 * Decoding here is what makes the value actually plain.
 */
const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00a0',
};

const decodeEntities = (text: string): string =>
  text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole, body: string) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      // Lone surrogates and out-of-range values would throw; leave those as written.
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff && (code < 0xd800 || code > 0xdfff)
        ? String.fromCodePoint(code)
        : whole;
    }
    return ENTITIES[body.toLowerCase()] ?? whole;
  });

const plainText = (tokens: Token[] | undefined): string => {
  if (!tokens) return '';
  let out = '';
  for (const token of tokens) {
    switch (token.type) {
      case 'html':
      case 'image':
        break; // markup and images are not prose
      case 'br':
        out += ' ';
        break;
      case 'codespan':
      case 'escape':
      case 'text':
      default:
        // A `text` token can itself carry children (inside a link, say); prefer them.
        out +=
          'tokens' in token && token.tokens?.length
            ? plainText(token.tokens)
            : decodeEntities((token as Tokens.Text).text ?? '');
    }
  }
  return out;
};

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
        const plain = plainText(tokens);
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
    // Built from the paragraph's own inline tokens rather than from its markdown source.
    // The source version had to lift inline code out behind placeholders before stripping
    // tags, or a code span documenting an element — `<r-markdown>` — looked exactly like
    // a tag and the excerpt silently lost the word the sentence was about. Reading the
    // tokens makes that distinction structural instead of a regex ordering problem.
    const text = plainText(token.tokens).replace(/\s+/g, ' ').trim();
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
