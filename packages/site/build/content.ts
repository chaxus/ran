/**
 * Content discovery and the page model.
 *
 * Every markdown file under `content/` becomes exactly one page, and the URL is its
 * path — no route table to keep in sync with the filesystem. What a file *is* follows
 * from where it sits rather than from a `layout:` field, because a `layout:` field is
 * one more thing a new post can get wrong:
 *
 *     content/index.md        → /              home     (latest posts injected)
 *     content/blog/index.md   → /blog/         archive  (every post injected)
 *     content/blog/<slug>.md  → /blog/<slug>   post     (dated, needs a pillar)
 *     content/404.md          → /404.html      notfound (served for every unmatched path)
 *     content/<name>.md       → /<name>        page
 *
 * Validation is strict and happens once, here, so a malformed post fails the build
 * naming its own file instead of rendering something subtly wrong that nobody reads
 * again.
 */
import { readBoolean, readList, readSources, readString, truncate } from 'ranpress';
import type { MarkdownRenderer, TocEntry } from 'ranpress';
import { PILLAR_SLUGS } from './config.ts';

export type PageKind = 'home' | 'archive' | 'post' | 'page' | 'notfound';

export interface Page {
  kind: PageKind;
  /** Source path relative to the package, for error messages. */
  file: string;
  /** Site-absolute URL, extensionless. `/` for the home page. */
  url: string;
  /** Path within dist. Always `<dir>/index.html` so URLs need no extension. */
  outFile: string;
  title: string;
  description: string;
  html: string;
  toc: TocEntry[];
}

export interface Post extends Page {
  kind: 'post';
  /** `YYYY-MM-DD`, validated. */
  date: string;
  pillar: string;
  tags: string[];
  draft: boolean;
}

export const isPost = (page: Page): page is Post => page.kind === 'post';

/**
 * `YYYY-MM-DD`, and a date that actually exists. `2026-02-30` parses happily in most
 * naive checks and then sorts into the wrong place forever.
 */
const validateDate = (value: string, file: string): string => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${file}: date must be YYYY-MM-DD, got ${JSON.stringify(value)}`);
  }
  const [y, m, d] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(y, m - 1, d));
  if (parsed.getUTCFullYear() !== y || parsed.getUTCMonth() !== m - 1 || parsed.getUTCDate() !== d) {
    throw new Error(`${file}: ${value} is not a real date`);
  }
  return value;
};

/** `content/blog/foo.md` → `/blog/foo`; `content/index.md` → `/`. */
const urlFor = (rel: string): string => {
  const stem = rel.replace(/\.md$/, '');
  if (stem === 'index') return '/';
  if (stem.endsWith('/index')) return `/${stem.slice(0, -'index'.length)}`;
  return `/${stem}`;
};

/**
 * `/` → `index.html`; `/blog/` → `blog/index.html`; `/about` → `about/index.html`.
 *
 * The 404 page is the exception: Cloudflare Pages serves `/404.html` from the root for
 * any unmatched path, so it must land there literally rather than at `404/index.html`.
 */
const outFileFor = (url: string, kind: PageKind): string => {
  if (kind === 'notfound') return '404.html';
  if (url === '/') return 'index.html';
  return `${url.replace(/^\/|\/$/g, '')}/index.html`;
};

const kindFor = (rel: string): PageKind => {
  if (rel === 'index.md') return 'home';
  if (rel === '404.md') return 'notfound';
  if (rel === 'blog/index.md') return 'archive';
  if (rel.startsWith('blog/')) return 'post';
  return 'page';
};

export interface LoadOptions {
  /** Include posts marked `draft: true`. On for `dev`, off for a published build. */
  includeDrafts?: boolean;
}

export interface Content {
  pages: Page[];
  /** Posts only, newest first. Drafts already filtered per `includeDrafts`. */
  posts: Post[];
}

export const loadContent = (contentDir: string, markdown: MarkdownRenderer, options: LoadOptions = {}): Content => {
  const pages: Page[] = [];
  const seenUrls = new Map<string, string>();

  for (const { rel, label: file, data, content } of readSources(contentDir)) {
    const kind = kindFor(rel);
    const url = urlFor(rel);

    const clash = seenUrls.get(url);
    if (clash) throw new Error(`${file}: URL ${url} is already produced by ${clash}`);
    seenUrls.set(url, file);

    const { html, toc, excerpt } = markdown.render(content);
    const title = readString(data, 'title', file);
    // A page's own words beat a generated summary, but an empty description is worse
    // than either — a page with no prose at all still needs something in <head>.
    const description = truncate(readString(data, 'description', file, excerpt));

    const base: Page = { kind, file, url, outFile: outFileFor(url, kind), title, description, html, toc };

    if (kind === 'post') {
      const pillar = readString(data, 'pillar', file);
      if (!PILLAR_SLUGS.includes(pillar)) {
        throw new Error(`${file}: unknown pillar ${JSON.stringify(pillar)} — expected ${PILLAR_SLUGS.join(', ')}`);
      }
      const post: Post = {
        ...base,
        kind: 'post',
        date: validateDate(readString(data, 'date', file), file),
        pillar,
        tags: readList(data, 'tags', file),
        draft: readBoolean(data, 'draft', file, false),
      };
      if (post.draft && !options.includeDrafts) continue;
      pages.push(post);
      continue;
    }

    pages.push(base);
  }

  const posts = pages
    .filter(isPost)
    // Newest first. Ties break on URL so two posts sharing a date keep a stable order
    // between builds instead of following readdir.
    .sort((a, b) => (a.date === b.date ? a.url.localeCompare(b.url) : b.date.localeCompare(a.date)));

  if (!pages.some((p) => p.kind === 'home')) throw new Error('content/index.md is required — it is the home page');

  return { pages, posts };
};
