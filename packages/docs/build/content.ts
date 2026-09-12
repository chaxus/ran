/**
 * The documentation site's page model.
 *
 * The shape that matters here and does not exist on chaxus.com is **the locale**. Every
 * page belongs to one, its URL carries that locale's prefix, and the same page in
 * another language is a sibling reached by swapping the prefix. Getting that wrong is
 * not a visible bug — it is a set of hreflang tags pointing at 404s, which nobody
 * notices until a search console says so months later.
 */
import { readSources } from 'ssg';
import type { MarkdownRenderer, Section, TocEntry } from 'ssg';
import { setRenderContext } from './render-context.ts';
import { LOCALES, ROOT_LOCALE, SITE } from './config.ts';
import type { LocaleDef } from './config.ts';

export type DocKind = 'page' | 'notfound';

export interface DocPage {
  kind: DocKind;
  /** Source path relative to the package. `cn/src/ranui/index.md`. */
  file: string;
  /** The locale this page is written in. */
  locale: LocaleDef;
  /**
   * The path with the locale prefix removed — `src/ranui/index.md`. Two pages in
   * different languages share this, and that is what makes them translations of one
   * another rather than unrelated URLs.
   */
  baseRel: string;
  /** Site-absolute URL, extensionless. */
  url: string;
  outFile: string;
  title: string;
  description: string;
  html: string;
  toc: TocEntry[];
  /** The page split at its headings, for the search index. */
  sections: Section[];
}

/**
 * Cloudflare Pages serves `/404.html` from the root for any unmatched path, so the page
 * has to land there literally rather than at `404/index.html`.
 */
const kindFor = (rel: string): DocKind => (rel === '404.md' ? 'notfound' : 'page');

/** `cn/src/ranui/index.md` → the `cn` locale; anything unprefixed is the root locale. */
const localeOf = (rel: string): LocaleDef => {
  const head = rel.split('/')[0];
  return LOCALES.find((locale) => locale.dir && locale.dir === head) ?? ROOT_LOCALE;
};

/** `src/ranui/index.md` → `/src/ranui/`; `index.md` → `/`. */
const urlForBase = (baseRel: string, locale: LocaleDef): string => {
  const stem = baseRel.replace(/\.md$/, '');
  const prefix = locale.dir ? `/${locale.dir}` : '';
  if (stem === 'index') return `${prefix}/`;
  if (stem.endsWith('/index')) return `${prefix}/${stem.slice(0, -'index'.length)}`;
  return `${prefix}/${stem}`;
};

/** Always `<dir>/index.html`, so URLs need no extension and no redirect sits between. */
const outFileFor = (url: string, kind: DocKind): string => {
  if (kind === 'notfound') return '404.html';
  const clean = url.replace(/^\/|\/$/g, '');
  return clean ? `${clean}/index.html` : 'index.html';
};

/**
 * The site's first prose paragraph is a far better meta description than a site-wide
 * template. Without this every page shares one string — which is what happened here
 * across 316 pages before VitePress's config grew a `deriveDescription`.
 */
const MAX_DESCRIPTION = 155;

export interface DocContent {
  pages: DocPage[];
  /** Every URL the build produced, for existence-checking hreflang alternates. */
  urls: ReadonlySet<string>;
  /** `baseRel` → the locales that actually ship that page. */
  translations: ReadonlyMap<string, LocaleDef[]>;
}

export const loadDocs = (root: string, markdown: MarkdownRenderer): DocContent => {
  const pages: DocPage[] = [];
  const seen = new Map<string, string>();

  const sources = readSources(root, {
    // Everything that is not prose: the generator, its data, the client bundle, the
    // stylesheets, and whatever is copied verbatim into the output.
    ignore: ['node_modules', 'public', 'dist', 'bin', 'build', 'client', 'styles', 'assets'],
    // Orientation for maintainers, not a page — and VitePress excludes it for the same
    // reason, which is how its own "a bare {{ breaks the build" note used to break it.
    ignoreFiles: ['CLAUDE.md'],
    labelPrefix: 'docs',
  });

  for (const { rel, label, data, content } of sources) {
    const kind = kindFor(rel);
    const locale = localeOf(rel);
    const baseRel = locale.dir ? rel.slice(locale.dir.length + 1) : rel;
    const url = urlForBase(baseRel, locale);

    const clash = seen.get(url);
    if (clash) throw new Error(`${label}: URL ${url} is already produced by ${clash}`);
    seen.set(url, label);

    // The component renderers need the page's language; link resolution needs the page
    // a relative path is relative to.
    setRenderContext({ locale, url });
    const { html, toc, excerpt, sections } = markdown.render(content);
    const fmTitle = typeof data.title === 'string' ? data.title : '';
    const fmDescription = typeof data.description === 'string' ? data.description : '';
    // A page's own H1 is its title when frontmatter does not say otherwise; falling back
    // to the filename would put slugs in <title>, which is what a reader sees in a tab.
    const heading = toc.find((entry) => entry.level === 2)?.text ?? '';
    const title = fmTitle || /^#\s+(.+)$/m.exec(content)?.[1]?.trim() || heading || 'ran';

    // The home pages are a single component placeholder with no prose to derive from,
    // so they fall back to the site description rather than shipping an empty one — the
    // most-linked page on the site is the worst one to leave without a summary.
    const description = (fmDescription || excerpt || SITE.description).slice(0, MAX_DESCRIPTION);

    pages.push({
      kind,
      file: label,
      locale,
      baseRel,
      url,
      outFile: outFileFor(url, kind),
      title,
      description,
      html,
      toc,
      sections,
    });
  }

  const translations = new Map<string, LocaleDef[]>();
  for (const page of pages) {
    translations.set(page.baseRel, [...(translations.get(page.baseRel) ?? []), page.locale]);
  }

  return { pages, urls: new Set(pages.map((page) => page.url)), translations };
};
