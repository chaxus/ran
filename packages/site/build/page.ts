/**
 * The HTML document each page is rendered into.
 *
 * The single most important property of this module: **one page's content per file**.
 *
 * That is worth naming because ranui's own `generateStaticPages()` does the opposite.
 * It renders an `<r-router>` element tree per path, and `<r-route>._update()` hides a
 * non-matching route by setting `hidden` — the content stays in the DOM. For an app
 * shell that is exactly right; the shell is small and the client takes over. For a
 * content site it means every output file carries every other page's prose, which is
 * near-duplicate content across the whole site and page weight that grows with the
 * archive. So this driver emits the matched page only, and ranui provides components
 * and cross-document view transitions rather than the page structure.
 */
import { BASE, NAV, ORIGIN, PILLARS, SITE } from './config.ts';
import type { Page, Post } from './content.ts';

export const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** `2026-09-08` → `2026 年 9 月 8 日`, for display next to a machine-readable <time>. */
export const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${y} 年 ${m} 月 ${d} 日`;
};

export const pillarName = (slug: string): string => PILLARS.find((p) => p.slug === slug)?.name ?? slug;

/** Absolute URL for a site-absolute path. `/` → `https://chaxus.com/`. */
export const absoluteUrl = (path: string): string => `${ORIGIN}${path}`;

/**
 * Applies the stored theme before first paint.
 *
 * ranui's `setTheme()` runs from the client bundle, which is a module script and
 * therefore deferred — by the time it stamps `data-ran-theme` the browser has already
 * painted a frame in the other theme. Anyone who chose dark sees a white flash on every
 * navigation. This runs synchronously in <head> instead, reading the same
 * localStorage key (`ran-theme`) and writing the same two attributes, so the bundle
 * later finds the state it would have set.
 *
 * `system` (and a first visit, which stores nothing) deliberately writes no attribute:
 * the stylesheet's `prefers-color-scheme` block handles that case, and stamping a
 * concrete value would freeze the page against a later OS change.
 */
const THEME_BOOTSTRAP = `(function(){try{
var t=localStorage.getItem('ran-theme');
if(t==='dark'||t==='light'){var e=document.documentElement;e.setAttribute('data-ran-theme',t);e.setAttribute('theme',t);}
}catch(e){}})();`;

// ── Fragments ───────────────────────────────────────────────────────────────

const navHtml = (current: string): string => {
  const items = NAV.map((item) => {
    const active = item.external
      ? false
      : item.match
        ? current === item.match || current.startsWith(`${item.match}/`)
        : current === item.href;
    const attrs = [`href="${escapeHtml(item.href)}"`, 'class="nav__link"'];
    if (active) attrs.push('aria-current="page"');
    if (item.external) attrs.push('target="_blank"', 'rel="noopener noreferrer"');
    return `<a ${attrs.join(' ')}>${escapeHtml(item.text)}</a>`;
  }).join('');
  return `<nav class="nav" aria-label="站点导航">${items}</nav>`;
};

const postMetaHtml = (post: Post): string =>
  `<p class="post-meta">` +
  `<time datetime="${post.date}">${formatDate(post.date)}</time>` +
  `<span class="post-meta__sep" aria-hidden="true">·</span>` +
  `<a class="post-meta__pillar" href="/blog/#${escapeHtml(post.pillar)}">${escapeHtml(pillarName(post.pillar))}</a>` +
  (post.draft ? `<span class="badge badge--draft">草稿</span>` : '') +
  `</p>`;

/** One row in a post list. The whole row is the link target, not just the title. */
const postCardHtml = (post: Post): string =>
  `<li class="post-card">` +
  `<a class="post-card__link" href="${escapeHtml(post.url)}">` +
  `<h3 class="post-card__title">${escapeHtml(post.title)}</h3>` +
  `<p class="post-card__excerpt">${escapeHtml(post.description)}</p>` +
  `</a>` +
  postMetaHtml(post) +
  `</li>`;

const postListHtml = (posts: Post[]): string =>
  posts.length ? `<ul class="post-list">${posts.map(postCardHtml).join('')}</ul>` : `<p class="empty">还没有文章。</p>`;

const pillarsHtml = (): string =>
  `<ul class="pillars">` +
  PILLARS.map(
    (p) =>
      `<li class="pillar"><h3 class="pillar__name">${escapeHtml(p.name)}</h3>` +
      `<p class="pillar__blurb">${escapeHtml(p.blurb)}</p></li>`,
  ).join('') +
  `</ul>`;

/** Posts grouped by year, newest year first — the archive's only structure. */
const archiveHtml = (posts: Post[]): string => {
  if (!posts.length) return `<p class="empty">还没有文章。</p>`;
  const byYear = new Map<string, Post[]>();
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    byYear.set(year, [...(byYear.get(year) ?? []), post]);
  }
  return [...byYear.entries()]
    .map(
      ([year, group]) =>
        `<section class="archive-year"><h2 class="archive-year__label">${year}</h2>${postListHtml(group)}</section>`,
    )
    .join('');
};

const tocHtml = (page: Page): string => {
  if (page.toc.length < 3) return ''; // a two-item outline is noise, not navigation
  const items = page.toc
    .map(
      (e) =>
        `<li class="toc__item toc__item--h${e.level}">` +
        `<a class="toc__link" href="#${encodeURIComponent(e.slug)}">${escapeHtml(e.text)}</a></li>`,
    )
    .join('');
  return `<aside class="toc" aria-label="本页目录"><p class="toc__label">本页目录</p><ul class="toc__list">${items}</ul></aside>`;
};

// ── Layouts ─────────────────────────────────────────────────────────────────

const bodyFor = (page: Page, posts: Post[]): string => {
  switch (page.kind) {
    case 'home':
      return (
        `<div class="prose prose--intro">${page.html}</div>` +
        `<section class="section"><h2 class="section__label">写什么</h2>${pillarsHtml()}</section>` +
        `<section class="section"><h2 class="section__label">最近的文章</h2>` +
        postListHtml(posts.slice(0, 5)) +
        (posts.length > 5 ? `<p class="more"><a href="/blog/">看全部 ${posts.length} 篇 →</a></p>` : '') +
        `</section>`
      );
    case 'archive':
      return `<div class="prose prose--intro">${page.html}</div>` + archiveHtml(posts);
    case 'post':
      return (
        `<article class="post">` +
        `<header class="post__header"><h1 class="post__title">${escapeHtml(page.title)}</h1>` +
        postMetaHtml(page as Post) +
        `</header>` +
        tocHtml(page) +
        `<div class="prose">${page.html}</div>` +
        `</article>`
      );
    default:
      return `<article class="page"><h1 class="page__title">${escapeHtml(page.title)}</h1>${tocHtml(page)}<div class="prose">${page.html}</div></article>`;
  }
};

// ── Document ────────────────────────────────────────────────────────────────

export interface RenderPageOptions {
  page: Page;
  posts: Post[];
  /** Extra `<head>` lines — canonical, og, JSON-LD. Supplied by `seo.ts`. */
  head: string[];
  /** Hashed asset URLs from the client bundle. */
  assets: { css: string[]; js: string[] };
}

export const renderPage = ({ page, posts, head, assets }: RenderPageOptions): string => {
  const isHome = page.kind === 'home';
  const title = isHome ? `${SITE.name} — ${SITE.title}` : `${page.title} · ${SITE.name}`;
  const year = new Date().getUTCFullYear();

  return `<!doctype html>
<html lang="${SITE.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(page.description)}">
<script>${THEME_BOOTSTRAP}</script>
${head.join('\n')}
${assets.css.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n')}
</head>
<body>
<a class="skip" href="#main">跳到正文</a>
<header class="site-header">
  <div class="site-header__inner">
    <a class="wordmark" href="${BASE}">${escapeHtml(SITE.name)}</a>
    ${navHtml(page.url)}
    <r-theme-switch class="theme-switch"></r-theme-switch>
  </div>
</header>
<main id="main" class="site-main site-main--${page.kind}">
${bodyFor(page, posts)}
</main>
<footer class="site-footer">
  <p>© ${year} ${escapeHtml(SITE.author)}</p>
  <p><a href="${escapeHtml(SITE.docs)}">ran 文档</a> · <a href="${escapeHtml(SITE.github)}">GitHub</a> · <a href="/feed.xml">RSS</a></p>
</footer>
${assets.js.map((src) => `<script type="module" src="${src}"></script>`).join('\n')}
</body>
</html>
`;
};
