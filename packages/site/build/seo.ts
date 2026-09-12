/**
 * Per-page `<head>` metadata, plus the three files that are read by machines rather
 * than people: `sitemap.xml`, `feed.xml`, `llms.txt`.
 *
 * The rule this module exists to enforce: **every URL it emits is the URL that is
 * actually served**. `packages/docs` pointed roughly 214 canonical and sitemap URLs at
 * `/foo.html` while the host served `/foo` and 308-redirected the other form. Nothing
 * broke visibly; the canonical signal just quietly pointed at a redirect. Here every
 * URL comes from `Page.url`, which is also what the driver writes to disk, so the two
 * cannot disagree.
 */
import { renderFeed, renderRobotsTxt, renderSitemap } from 'ssg';
import { OG_IMAGE, ORIGIN, SITE } from './config.ts';
import type { Content, Page, Post } from './content.ts';
import { absoluteUrl, escapeHtml } from './page.ts';

const meta = (attr: 'name' | 'property', key: string, content: string): string =>
  `<meta ${attr}="${key}" content="${escapeHtml(content)}">`;

/**
 * Icons and the manifest. On every page including the 404 — a browser tab with no
 * favicon is the one piece of chrome a reader notices missing.
 */
const ICON_LINKS = [
  `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`,
  `<link rel="apple-touch-icon" href="/icon-180.png">`,
  `<link rel="manifest" href="/manifest.webmanifest">`,
];

/**
 * The site-wide graph: the site itself and the person who writes it, linked so a search
 * engine reads the two as one identity rather than as an anonymous domain. This is the
 * personal-brand half of the site plan expressed in structured data.
 */
export const siteJsonLd = (): string =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${ORIGIN}/#website`,
        url: `${ORIGIN}/`,
        name: SITE.name,
        description: SITE.description,
        inLanguage: SITE.lang,
        publisher: { '@id': `${ORIGIN}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${ORIGIN}/#person`,
        name: SITE.author,
        url: `${ORIGIN}/`,
        sameAs: [SITE.github, SITE.docs],
        knowsAbout: ['Web Components', 'TypeScript', 'compilers', 'WebAssembly', 'frontend infrastructure'],
      },
    ],
  });

/** A post as a citable article, so an answer engine can attribute it. */
const postJsonLd = (post: Post): string =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: SITE.lang,
    url: absoluteUrl(post.url),
    keywords: post.tags.join(', ') || undefined,
    author: { '@id': `${ORIGIN}/#person` },
    publisher: { '@id': `${ORIGIN}/#person` },
    isPartOf: { '@id': `${ORIGIN}/#website` },
  });

export const headFor = (page: Page): string[] => {
  // The 404 page is served from every wrong URL there is, so it must never claim a
  // canonical (it would be claiming a different page each time) and must never be
  // indexed. Everything else in <head> would be actively harmful here.
  if (page.kind === 'notfound') {
    return [`<meta name="robots" content="noindex, follow">`, ...ICON_LINKS];
  }

  const url = absoluteUrl(page.url);
  const isHome = page.kind === 'home';
  const ogTitle = isHome ? `${SITE.name} — ${SITE.title}` : `${page.title} · ${SITE.name}`;

  const head = [
    `<link rel="canonical" href="${url}">`,
    meta('name', 'author', SITE.author),
    // The site ships one language. Saying so explicitly stops a translation proxy's
    // copy from competing with the original for the same query.
    `<link rel="alternate" hreflang="${SITE.lang}" href="${url}">`,
    `<link rel="alternate" hreflang="x-default" href="${url}">`,
    meta('property', 'og:type', page.kind === 'post' ? 'article' : 'website'),
    meta('property', 'og:site_name', SITE.name),
    meta('property', 'og:title', ogTitle),
    meta('property', 'og:description', page.description),
    meta('property', 'og:url', url),
    meta('property', 'og:locale', 'zh_CN'),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', ogTitle),
    meta('name', 'twitter:description', page.description),
    `<link rel="alternate" type="application/rss+xml" title="${escapeHtml(SITE.name)}" href="/feed.xml">`,
    // llms.txt is the curated paragraph a model ingests as "what is this site". The
    // convention is that agents fetch /llms.txt directly; the tag costs one line and
    // makes it discoverable to anything that reads <head> instead of guessing.
    `<link rel="alternate" type="text/markdown" title="llms.txt" href="/llms.txt">`,
    ...ICON_LINKS,
    meta('property', 'og:image', `${ORIGIN}${OG_IMAGE.src}`),
    meta('property', 'og:image:width', String(OG_IMAGE.width)),
    meta('property', 'og:image:height', String(OG_IMAGE.height)),
    meta('property', 'og:image:alt', OG_IMAGE.alt),
    meta('name', 'twitter:image', `${ORIGIN}${OG_IMAGE.src}`),
  ];

  if (page.kind === 'post') {
    const post = page as Post;
    head.push(
      meta('property', 'article:published_time', post.date),
      ...post.tags.map((tag) => meta('property', 'article:tag', tag)),
      `<script type="application/ld+json">${postJsonLd(post)}</script>`,
    );
  } else if (isHome) {
    head.push(`<script type="application/ld+json">${siteJsonLd()}</script>`);
  }

  return head;
};

// ── Machine-readable files ──────────────────────────────────────────────────

/**
 * The entry map for LLM crawlers. Hand-shaped rather than a dump: this is the paragraph
 * a model actually ingests as "what is this site", so it is the highest-leverage prose
 * here after the home page itself.
 */
export const renderLlmsTxt = (posts: Post[]): string =>
  `# ${SITE.name} — ${SITE.title}\n\n` +
  `> ${SITE.description}\n\n` +
  `站点: ${ORIGIN}/\n` +
  `作者: ${SITE.author} (${SITE.github})\n` +
  `库文档: ${SITE.docs}\n\n` +
  `## 项目\n\n` +
  `- ranui — 基于原生自定义元素的 Web Components 组件库，不绑定框架: ${SITE.docs}/src/ranui/\n` +
  `- ranuts — TypeScript 工具库 (i18n / zip / IndexedDB / Worker): ${SITE.docs}/src/ranuts/\n\n` +
  `## 文章\n\n` +
  (posts.length ? posts.map((p) => `- [${p.title}](${absoluteUrl(p.url)}) — ${p.description}`).join('\n') : '(暂无)') +
  `\n`;

// ── The files a build emits alongside its pages ─────────────────────────────

/**
 * Everything read by machines rather than people, built from the same page objects the
 * driver writes to disk so a URL here cannot name a page that was not generated.
 */
export const generatedFiles = ({ pages, posts }: Content): Array<[string, string]> => [
  [
    'sitemap.xml',
    renderSitemap(
      pages
        // The 404 is reachable from every wrong URL and indexable from none of them.
        .filter((page) => page.kind !== 'notfound')
        .map((page) => ({
          loc: absoluteUrl(page.url),
          lastmod: page.kind === 'post' ? (page as Post).date : undefined,
          // The home page is the entry point; posts outrank the archive index.
          priority: page.kind === 'home' ? '1.0' : page.kind === 'post' ? '0.8' : '0.5',
        })),
    ),
  ],
  [
    'feed.xml',
    renderFeed({
      title: SITE.name,
      origin: ORIGIN,
      description: SITE.description,
      lang: SITE.lang,
      items: posts.map((post) => ({
        title: post.title,
        url: absoluteUrl(post.url),
        date: post.date,
        description: post.description,
        categories: post.tags,
      })),
    }),
  ],
  ['llms.txt', renderLlmsTxt(posts)],
  ['robots.txt', renderRobotsTxt(ORIGIN)],
];
