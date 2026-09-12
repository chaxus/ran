/**
 * Everything about the site that is not content.
 *
 * One module so that a rename, a new nav entry or a domain change is a single edit
 * rather than a grep. `packages/docs` learned this the hard way: its base path and
 * origin were spelled out in the config, the build script and the Service Worker, and
 * the three drifted.
 */

/** Canonical origin. No trailing slash — every URL helper appends its own. */
export const ORIGIN = 'https://chaxus.com';

/** Served from the domain root, so the base is `/`. */
export const BASE = '/';

export const SITE = {
  /** Used as the site name in metadata and as the wordmark in the header. */
  name: 'chaxus',
  /** The <title> of the home page and the og:site_name everywhere. */
  title: '从零手写前端基础设施',
  /**
   * The one paragraph a search engine or a model ingests as "what is this site".
   * Written for SEO/GEO, not as a tagline — the same rule the docs site follows.
   */
  description:
    '从零手写前端基础设施：解析器、编译器、WASM、Web Components 组件库。ranui 与 ranuts 的作者，用可运行的代码而不是教程复述来讲清楚这些东西是怎么造出来的。',
  lang: 'zh-CN',
  author: 'chaxus',
  github: 'https://github.com/chaxus',
  /** The documentation site for the libraries this site is the proof of. */
  docs: 'https://ran.chaxus.com',
} as const;

/**
 * The social card. A 1200x630 PNG is what every platform crops from; SVG is not
 * accepted by any of them, which is why this one asset is a raster.
 *
 * It is generated from `assets/og.html` rather than drawn by hand — regenerate with
 * `pnpm -F site og` after changing the wordmark or the tagline.
 */
export const OG_IMAGE = {
  src: '/og.png',
  width: 1200,
  height: 630,
  alt: 'chaxus — 从零手写前端基础设施',
} as const;

/**
 * Code fence languages this site writes in. shiki loads grammars eagerly and ships ~600
 * of them, so naming the ones in use is what keeps the build at two seconds. An unlisted
 * language fails the build by name rather than rendering silently as plain text.
 */
export const LANGS = [
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

export interface NavItem {
  text: string;
  href: string;
  /** Path prefix that marks this entry active. Defaults to an exact match on href. */
  match?: string;
  /** Rendered with an external-link affordance and rel="noopener". */
  external?: boolean;
}

/**
 * Deliberately flat — five entries, no dropdowns. The docs site's CLAUDE.md records
 * why: a product switcher next to the wordmark needed pixel measuring and a
 * pointer-events hack to be clickable, and plain nav items replaced it.
 */
export const NAV: NavItem[] = [
  { text: '首页', href: '/' },
  { text: '文章', href: '/blog/', match: '/blog' },
  { text: '关于', href: '/about' },
  { text: 'ranui', href: `${SITE.docs}/src/ranui/`, external: true },
  { text: 'GitHub', href: SITE.github, external: true },
];

/**
 * The three content pillars from the site plan. `slug` matches the `pillar` field a
 * post declares in its frontmatter; a post naming anything else fails the build.
 */
export const PILLARS = [
  {
    slug: 'from-scratch',
    name: '从零手写',
    blurb: '招牌连载。解析器、编译器、WASM、组件库 —— 一行一行造出来，不是复述别人的实现。',
  },
  {
    slug: 'internals',
    name: '原理与源码',
    blurb: '把一个东西拆开看它为什么这样设计，以及哪里其实设计错了。',
  },
  {
    slug: 'practice',
    name: '工程实践',
    blurb: '构建、部署、性能、可维护性。踩过的坑按可复现的方式写下来。',
  },
] as const;

export type PillarSlug = (typeof PILLARS)[number]['slug'];

export const PILLAR_SLUGS: readonly string[] = PILLARS.map((p) => p.slug);
