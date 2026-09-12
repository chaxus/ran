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

export interface TocEntry {
  level: 2 | 3;
  text: string;
  slug: string;
}

/**
 * One searchable chunk of a page: a heading and the prose under it.
 *
 * Sections rather than whole pages, so a search result can link to the part of the page
 * that matched. On a reference page running to a few thousand words, "this page contains
 * your term somewhere" is barely an answer.
 */
export interface Section {
  /** Anchor of the heading that opens this section; empty for the lead. */
  slug: string;
  /** The heading's text; empty for the lead section. */
  title: string;
  /** Prose under it, flattened. Fenced code is left out — see `collectSections`. */
  text: string;
}

export interface RenderedMarkdown {
  html: string;
  toc: TocEntry[];
  /** First substantive prose paragraph, cleaned — the meta description fallback. */
  excerpt: string;
  /** The page split at its headings, for indexing. */
  sections: Section[];
}

// ── Syntax highlighting ─────────────────────────────────────────────────────
// One highlighter for the whole build. Creating it loads the grammars, which is the
// expensive part; doing it per page turned a 2s build into a 40s one.

/**
 * A sensible default whitelist. Shiki loads grammars eagerly and ships ~600 of them, so
 * naming the ones a site actually uses is what keeps the build at two seconds instead of
 * forty. A site passes its own list to `createMarkdown`; an unlisted language is not a
 * silent failure, it throws and names itself.
 */
export const DEFAULT_LANGS = [
  // `text` doubles as the fallback for a fence with no language, so it must be listed.
  'text',
  'ts',
  'js',
  // shiki treats these as distinct ids rather than aliases of ts/js/bash, and a fence
  // that spells one of them out is a fence that would otherwise fail the build.
  'typescript',
  'javascript',
  'shell',
  'xml',
  'java',
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

/**
 * Renders one fenced block itself instead of letting shiki highlight it. Returning
 * `null` falls through to normal highlighting.
 *
 * This is how a site claims a fence language that is not source code at all — a
 * ```mermaid block is a diagram, and highlighting it as text would be the wrong answer
 * even if shiki had a grammar for it.
 */
export type FenceRenderer = (code: string, info: string) => string | null;

/** Renders a `::: kind` block. `body` is the already-rendered inner markdown. */
export type ContainerRenderer = (ctx: {
  kind: string;
  title: string;
  /** The inner markdown, rendered. */
  body: string;
  /** The inner tokens, for a container whose layout depends on its structure. */
  tokens: Token[];
  /** Render a token list — for building bespoke layouts out of the children. */
  render: (tokens: Token[]) => string;
}) => string;

/**
 * Renders a component placeholder that a page writes as an HTML tag.
 *
 * `attrs` is the raw attribute text, so a renderer can read whatever the page passed.
 * Returning `null` leaves the tag alone, which is what keeps ordinary inline HTML —
 * and every `<r-*>` element — untouched.
 */
export type ComponentRenderer = (attrs: string) => string | null;

export interface MarkdownOptions {
  /** Site origin, used to decide whether a link leaves the site. */
  origin: string;
  /**
   * Resolves a link written in the markdown into the URL it should point at.
   *
   * Markdown sources link to each other the way files do — `./debounce`,
   * `../utils/index.md`, `foo.md#anchor`. Those are paths on disk, not URLs, and a
   * generator that emits them unchanged produces a page full of dead links that look
   * completely ordinary. There are 1,018 of them in this repository's docs.
   *
   * The renderer cannot resolve them alone because it does not know which page it is
   * rendering, so a site supplies this and tracks the current page itself.
   */
  resolveLink?: (href: string) => string;
  /** Code fence languages to load. Defaults to `DEFAULT_LANGS`. */
  langs?: readonly string[];
  /** Fence languages this site renders itself, keyed by the fence's info string. */
  fences?: Readonly<Record<string, FenceRenderer>>;
  /**
   * Container kinds beyond the built-in note/tip/warning/danger. A site adds the ones
   * its own prose uses; an unknown kind still fails the build by name.
   */
  containers?: Readonly<Record<string, ContainerRenderer>>;
  /**
   * Tags a site renders itself, keyed by tag name (case-sensitive, as written).
   *
   * This is how a page keeps a placeholder like `<HomeCinematic />` in its markdown
   * while the generator decides what that becomes. Matching on the parser's own `html`
   * token rather than with a pass over the finished output means the substitution can
   * never fire on a tag inside a code fence, which is the whole reason it is here and
   * not a regex.
   */
  components?: Readonly<Record<string, ComponentRenderer>>;
}

export interface MarkdownRenderer {
  /** Loads the grammars. Must be awaited before `render`. */
  init(): Promise<void>;
  render(source: string): RenderedMarkdown;
}

// ── Slugs ───────────────────────────────────────────────────────────────────

/**
 * A heading's anchor.
 *
 * This is deliberately the same algorithm VitePress uses, character for character,
 * because the documentation site already has thousands of anchors in the wild — in its
 * own cross-links, in the outline, and in every deep link anyone has ever shared. A
 * slugifier that is merely *reasonable* would silently change all of them.
 *
 * The three rules worth naming:
 *
 * - **NFKD then strip combining marks.** `parâmetros` → `parametros`, `wählen` →
 *   `wahlen`. Accented headings are common in the Spanish, Portuguese and German
 *   translations.
 * - **Only this punctuation set becomes a hyphen.** Not "everything that is not a
 *   letter" — that would eat the zero-width non-joiner that Persian headings need, and
 *   `شیوه‌ها` would stop matching its own anchor.
 * - **CJK survives untouched**, because it is neither punctuation nor a combining mark.
 *   Percent-encoding in the URL is fine and is what every Chinese documentation site
 *   already does.
 */
// Matching control characters is the entire purpose of this one: VitePress strips them
// from headings before slugifying, and a slug that kept them would be a broken id.
// eslint-disable-next-line no-control-regex
const R_CONTROL = /[\u0000-\u001f]/g;
const R_SPECIAL = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g;
const R_COMBINING = /[\u0300-\u036f]/g;

export const slugify = (text: string): string =>
  text
    .normalize('NFKD')
    .replace(R_COMBINING, '')
    .replace(R_CONTROL, '')
    .replace(R_SPECIAL, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    // An id may not begin with a digit in a CSS selector, so it gets a prefix.
    .replace(/^(\d)/, '_$1')
    .toLowerCase();

// ── Plain text from tokens ──────────────────────────────────────────────────

/**
 * The entities marked leaves sitting in a `text` token.
 *
 * Token text is the markdown source, so `&amp;` arrives as those five characters. Plain
 * text is what this module hands to `escapeHtml` downstream, which would turn it into
 * `&amp;amp;` and render the entity literally in a meta description or a search result.
 * Decoding here is what makes the value actually plain.
 */
const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
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

/**
 * Plain text from an inline token tree.
 *
 * The obvious alternative — render to HTML and strip tags with `/<[^>]+>/g` — is both
 * wrong and a liability. Wrong because it leaves entities behind and because nested
 * constructs like `<scr<b>ipt>` survive a single pass. A liability because a regex that
 * removes *most* tags reads like a sanitizer to every later reader and to every scanner,
 * and gets treated as one.
 *
 * `html` tokens — raw markup someone typed into the prose — are dropped, which is the
 * tag removal, done by the parser rather than by a pattern. `codespan` is kept: a
 * heading about `<r-markdown>` has to still contain that word.
 */
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
      default:
        out +=
          'tokens' in token && token.tokens?.length
            ? plainText(token.tokens as Token[])
            : decodeEntities((token as Tokens.Text).text ?? '');
    }
  }
  return out;
};

/**
 * `## Heading {#custom-id}` — an explicit anchor, the markdown-it convention VitePress
 * follows.
 *
 * It matters more than it looks. The documentation site uses it in 160 headings across
 * 84 pages, and the reason is translation: `## 服务端渲染 {#server-rendering}` gives the
 * Chinese page the same anchor as its English counterpart, so one link works for both.
 * Slugifying the whole heading instead would give every translation a different anchor
 * and break every deep link that already exists.
 */
/*
 * Deliberately does NOT open with `\s*`.
 *
 * That leading run is what made this quadratic: on a string of many tabs it would match
 * the whole run, fail at `{`, restart one character later, and match almost the whole
 * run again. The separating whitespace is removed with `trimEnd` afterwards instead,
 * which is linear and produces exactly the same result.
 */
const CUSTOM_ANCHOR = /\{#([A-Za-z0-9_-]+)\}[ \t]*$/;

export const stripCustomAnchor = (text: string): string => text.replace(CUSTOM_ANCHOR, '').trimEnd();

// ── Custom containers ───────────────────────────────────────────────────────

/** Always available; a site adds to these through `containers`. */
const BUILTIN_CONTAINERS = ['note', 'tip', 'warning', 'danger'] as const;

const defaultContainer: ContainerRenderer = ({ kind, title, body }) =>
  `<aside class="callout callout--${kind}"><p class="callout__label">${escapeHtml(title || kind)}</p>${body}</aside>\n`;

/**
 * `::: kind [optional title]` … `:::` → whatever the renderer for that kind returns.
 *
 * A block-level marked extension rather than a regex pass over the output, so the body
 * is real markdown (links, code, lists) instead of escaped text — and so a renderer that
 * needs the structure, like a tabbed code group, can read the tokens directly.
 */
const createContainer = (renderers: Readonly<Record<string, ContainerRenderer>>): TokenizerAndRendererExtension => ({
  name: 'container',
  level: 'block',
  start: (src: string) => src.match(/^:{3}/m)?.index,
  tokenizer(src: string) {
    const match = /^:{3}[ \t]*([a-z][a-z-]*)[ \t]*([^\n]*)\n([\s\S]*?)\n:{3}[ \t]*(?:\n|$)/.exec(src);
    if (!match) return undefined;
    const [raw, kind, title, body] = match;
    if (!(kind in renderers)) {
      throw new Error(`unknown container ":::${kind}" — expected one of ${Object.keys(renderers).join(', ')}`);
    }
    return { type: 'container', raw, kind, title: title.trim(), tokens: this.lexer.blockTokens(body, []) };
  },
  renderer(token: Tokens.Generic): string {
    const kind = token.kind as string;
    const tokens = (token.tokens ?? []) as Token[];
    const render = (list: Token[]): string => this.parser.parse(list);
    return renderers[kind]({ kind, title: (token.title as string) ?? '', body: render(tokens), tokens, render });
  },
});

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── Parser ──────────────────────────────────────────────────────────────────

/** `<HomeCinematic />` or `<IconGallery class="x">` → the tag name and its attributes. */
const COMPONENT_TAG = /^<([A-Za-z][\w-]*)((?:\s[^>]*?)?)\s*\/?>\s*(?:<\/\1>)?\s*$/;

const createParser = (
  slugs: Map<string, number>,
  toc: TocEntry[],
  headings: string[],
  highlight: (code: string, lang: string) => string,
  isExternal: (href: string) => boolean,
  resolveLink: (href: string) => string,
  container: TokenizerAndRendererExtension,
  fences: Readonly<Record<string, FenceRenderer>>,
  components: Readonly<Record<string, ComponentRenderer>>,
): Marked => {
  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    extensions: [container],
    renderer: {
      html({ text }: Tokens.HTML | Tokens.Tag): string {
        const match = COMPONENT_TAG.exec(text.trim());
        const render = match ? components[match[1]] : undefined;
        const out = render?.(match?.[2] ?? '');
        return out ?? text;
      },
      code({ text, lang }: Tokens.Code): string {
        const info = (lang ?? '').trim();
        const language = info.split(/\s+/)[0] ?? '';
        // A site can claim a fence language outright — a ```mermaid block is a diagram,
        // not source, and highlighting it would be the wrong answer even with a grammar.
        const claimed = fences[language]?.(text, info);
        if (claimed !== undefined && claimed !== null) return claimed;
        return `<figure class="code" data-lang="${escapeHtml(language || 'text')}">${highlight(text, language)}</figure>\n`;
      },
      heading({ tokens, depth }: Tokens.Heading): string {
        const rawText = this.parser.parseInline(tokens);
        const rawPlain = plainText(tokens);
        const explicit = CUSTOM_ANCHOR.exec(rawPlain)?.[1];
        // The marker is an instruction, not prose — it must not render.
        const text = explicit ? stripCustomAnchor(rawText) : rawText;
        const plain = explicit ? stripCustomAnchor(rawPlain) : rawPlain;

        let slug: string;
        if (explicit) {
          // Used verbatim. An explicit id that repeats is a content bug worth seeing as
          // one, not something to paper over with a suffix.
          slug = explicit;
          slugs.set(slug, (slugs.get(slug) ?? 0) + 1);
        } else {
          slug = slugify(plain) || 'section';
          // Two headings with the same words are a real thing ("Why", "Why" in different
          // sections). Suffix rather than collide, so in-page links stay unambiguous.
          const seen = slugs.get(slug) ?? 0;
          slugs.set(slug, seen + 1);
          // markdown-it-anchor numbers repeats from 1, so a heading's *second*
          // appearance is `slug-1`. Starting at 2 instead would shift every duplicate
          // anchor on the site by one.
          if (seen) slug = `${slug}-${seen}`;
        }
        if (depth === 2 || depth === 3) toc.push({ level: depth, text: plain, slug });
        // Every heading, at every depth, in document order. `collectSections` walks the
        // same headings, so consuming this list keeps a section's anchor identical to
        // the id the page actually carries — including the numeric suffix a repeated
        // heading got. Re-deriving the slug there instead produced colliding ids.
        headings.push(slug);
        // The anchor is a real link, and it is the heading itself — not a hover-only
        // pilcrow, which is invisible on touch devices where sharing a section link is
        // most common.
        return `<h${depth} id="${slug}"><a class="anchor" href="#${slug}">${text}</a></h${depth}>\n`;
      },
      link({ href: raw, title, tokens }: Tokens.Link): string {
        const text = this.parser.parseInline(tokens);
        const href = resolveLink(raw);
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

/**
 * Split the token stream at its headings.
 *
 * Built from tokens, not by stripping tags off the rendered HTML. The parser already
 * knows the structure; re-deriving it from the output would mean a regex that is wrong
 * about entities and nested markup, which is exactly the pattern `plainText` exists to
 * avoid.
 *
 * Fenced code is excluded. Indexing it roughly doubles the index for a reference site
 * while mostly adding tokens that already appear in the surrounding prose, headings and
 * API tables.
 */
const collectSections = (tokens: Token[], nextSlug: () => string): Section[] => {
  const sections: Section[] = [{ slug: '', title: '', text: '' }];
  const push = (text: string): void => {
    if (!text) return;
    const current = sections[sections.length - 1];
    current.text = current.text ? `${current.text} ${text}` : text;
  };

  for (const token of tokens) {
    if (token.type === 'heading') {
      const heading = token as Tokens.Heading;
      const title = stripCustomAnchor(plainText(heading.tokens)).replace(/\s+/g, ' ').trim();
      sections.push({ slug: nextSlug(), title, text: '' });
      continue;
    }
    if (token.type === 'code' || token.type === 'space' || token.type === 'hr') continue;
    if (token.type === 'table') {
      const table = token as Tokens.Table;
      const cells = [
        ...table.header.map((cell) => plainText(cell.tokens)),
        ...table.rows.flat().map((cell) => plainText(cell.tokens)),
      ];
      push(cells.join(' ').replace(/\s+/g, ' ').trim());
      continue;
    }
    const inner = 'tokens' in token && token.tokens?.length ? plainText(token.tokens as Token[]) : '';
    push(inner.replace(/\s+/g, ' ').trim());
  }

  return sections.filter((section) => section.title || section.text);
};

/** Trim to `max` characters on a word/CJK boundary, with an ellipsis when cut. */
export const truncate = (s: string, max = 155): string => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trim()}…`;
};

/**
 * One renderer per site. The highlighter it owns is created once — building it loads the
 * grammars, which is the expensive part, and doing it per page turned a 2s build into a
 * 40s one.
 */
export const createMarkdown = ({
  origin,
  langs = DEFAULT_LANGS,
  fences = {},
  containers = {},
  components = {},
  resolveLink = (href) => href,
}: MarkdownOptions): MarkdownRenderer => {
  let highlighter: Highlighter | null = null;
  const containerRenderers: Record<string, ContainerRenderer> = {
    ...Object.fromEntries(BUILTIN_CONTAINERS.map((kind) => [kind, defaultContainer])),
    ...containers,
  };
  const container = createContainer(containerRenderers);

  const highlight = (code: string, lang: string): string => {
    if (!highlighter) throw new Error('init() must be awaited before rendering markdown');
    const known = langs.includes(lang);
    if (lang && !known) {
      throw new Error(`unknown code fence language "${lang}" — add it to this site's \`langs\``);
    }
    return highlighter.codeToHtml(code, { lang: known ? lang : 'text', themes: THEMES, defaultColor: false });
  };

  const isExternal = (href: string): boolean => /^https?:\/\//.test(href) && !href.startsWith(origin);

  return {
    async init(): Promise<void> {
      highlighter ??= await createHighlighter({ themes: [THEMES.light, THEMES.dark], langs: [...langs] });
    },
    render(source: string): RenderedMarkdown {
      const toc: TocEntry[] = [];
      const headings: string[] = [];
      const marked = createParser(
        new Map(),
        toc,
        headings,
        highlight,
        isExternal,
        resolveLink,
        container,
        fences,
        components,
      );
      const tokens = marked.lexer(source);
      const html = marked.parser(tokens) as string;
      let consumed = 0;
      const nextSlug = (): string => headings[consumed++] ?? '';
      return {
        html,
        toc,
        excerpt: truncate(firstParagraph(tokens)),
        sections: collectSections(tokens, nextSlug),
      };
    },
  };
};
