import { defineConfig } from 'vitepress';
import { themeEnConfig } from './langs/en';
import { themeCnConfig } from './langs/cn';
import {
  ARTICLE_PATH,
  BASE_PATH,
  BD_ANALYSE,
  DESCRIPTION,
  GOOGLE_ANALYSE,
  GTAG,
  HOME,
  // KEY_WORDS,
  OG_IMAGE,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  PREVIEW_CODE,
  RANUI_PATH,
  SERVICE_WORK,
  SET_FONT_SIZE,
  UTILS_PATH,
} from './common/index';
import { LANGS_DICT } from './lib/constant';

// ── SEO helpers ──────────────────────────────────────────────────────────────
const ORIGIN = HOME.replace(/\/+$/, ''); // https://ran.chaxus.com
const SITE_TAGLINE = 'ran — Web Components UI library (ranui) & utility library (ranuts)';
const SITE_TAGLINE_CN = 'ran — Web Components 组件库（ranui）与 TypeScript 工具库（ranuts）';
const HOME_DESC_EN =
  'ran is an open-source front-end ecosystem: ranui, a framework-agnostic Web Components UI library on native custom elements, and ranuts, a tree-shakeable TypeScript utility library.';
const HOME_DESC_CN =
  'ran 是一套开源前端生态：ranui —— 基于原生 custom elements、框架无关的 Web Components 组件库；ranuts —— 可 tree-shaking 的 TypeScript 工具库。';

/**
 * Convert a VitePress source path (e.g. `src/ranui/index.md`) to its site URL path.
 * Extensionless to match the served URL (Cloudflare Pages serves `/foo`, and `/foo.html`
 * 308-redirects to it) and VitePress `cleanUrls`, so canonical/hreflang/sitemap agree.
 */
const relToUrl = (rel: string): string => {
  const p = rel.replace(/\.md$/, '');
  if (p === 'index') return '/';
  if (p.endsWith('/index')) return `/${p.slice(0, -'index'.length)}`;
  return `/${p}`;
};

/** Site-wide structured data: the site + its author (personal brand). */
const SITE_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${ORIGIN}/#website`,
      url: `${ORIGIN}/`,
      name: 'ran',
      description: DESCRIPTION,
      inLanguage: ['en', 'zh-CN'],
      publisher: { '@id': `${ORIGIN}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${ORIGIN}/#person`,
      name: 'chaxus',
      url: `${ORIGIN}/`,
      sameAs: ['https://github.com/chaxus'],
    },
  ],
};

export default defineConfig({
  title: 'ran',
  description: DESCRIPTION,
  base: BASE_PATH,
  vite: {
    // esbuild is pinned to >=0.28.1 workspace-wide (security override in
    // pnpm-workspace.yaml). esbuild 0.28 refuses to down-level destructuring
    // to VitePress/vite 5.4's default browser baseline, which breaks dev-time
    // dependency optimization. Target esnext so no syntax lowering is attempted
    // — the docs ship to modern browsers anyway.
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
    },
    build: {
      target: 'esnext',
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'INVALID_ANNOTATION') return;
          warn(warning);
        },
      },
    },
  },
  lastUpdated: true,
  // Serve/link extensionless URLs so generated links, canonical, hreflang and the
  // sitemap all match what Cloudflare Pages actually serves (`/foo`, with `/foo.html`
  // 308-redirecting to it). Previously ~214 sitemap/canonical URLs pointed at the
  // redirecting `.html` form.
  cleanUrls: true,
  sitemap: {
    hostname: HOME,
  },
  markdown: {
    // Render ```mermaid fenced blocks as diagrams. We can't use
    // vitepress-plugin-mermaid (it peers on VitePress 1.x; this repo is 2.x-alpha),
    // so we hand off to the <Mermaid> theme component: base64 the source (so the
    // diagram syntax survives Vue template compilation) and let it render client-side.
    config(md) {
      const defaultFence =
        md.renderer.rules.fence?.bind(md.renderer.rules) ??
        ((tokens: any, idx: number, options: any, _env: any, self: any) => self.renderToken(tokens, idx, options));
      md.renderer.rules.fence = (tokens: any, idx: number, options: any, env: any, self: any) => {
        const token = tokens[idx];
        if (token.info.trim().toLowerCase() === 'mermaid') {
          const code = Buffer.from(token.content, 'utf-8').toString('base64');
          return `<Mermaid id="mermaid-${idx}" code="${code}"></Mermaid>\n`;
        }
        return defaultFence(tokens, idx, options, env, self);
      };
    },
  },
  // Per-page SEO: canonical, EN/CN hreflang alternates (existence-checked so we never
  // point at a 404), unique og:/twitter: tags, meta description, and SoftwareSourceCode
  // structured data on the ranui/ranuts landing pages.
  transformPageData(pageData, { siteConfig }) {
    const rel = pageData.relativePath;
    const pages = siteConfig.pages;
    const exists = (p: string): boolean => pages.includes(p);

    const enRel = rel.startsWith('cn/') ? rel.slice(3) : rel;
    const cnRel = `cn/${enRel}`;
    const selfUrl = ORIGIN + relToUrl(rel);
    const enUrl = ORIGIN + relToUrl(enRel);
    const cnUrl = ORIGIN + relToUrl(cnRel);

    // The home page's document <title> is otherwise just "ran" (title === site
    // title, so no template is applied). Promote it to the full tagline so the
    // most important on-page SEO signal carries the product keywords.
    const isCn = rel.startsWith('cn/');
    const isHome = enRel === 'index.md';
    const homeTagline = isCn ? SITE_TAGLINE_CN : SITE_TAGLINE;
    if (isHome) {
      pageData.title = homeTagline;
      pageData.titleTemplate = false;
    }

    const title = pageData.title || 'ran';
    const ogTitle = isHome ? homeTagline : `${title} | ran`;
    const desc = isHome
      ? isCn
        ? HOME_DESC_CN
        : HOME_DESC_EN
      : pageData.frontmatter.description ||
        pageData.description ||
        `${title} — documentation for ran: ranui Web Components and ranuts utilities.`;
    // Assign to pageData.description (the field VitePress renders into
    // <meta name="description">). Setting frontmatter.description alone is too late —
    // it left all 316 pages sharing the site-level description.
    pageData.description = desc;
    pageData.frontmatter.description = desc;

    const head = (pageData.frontmatter.head ??= []);
    head.push(['link', { rel: 'canonical', href: selfUrl }]);
    if (exists(enRel)) {
      head.push(['link', { rel: 'alternate', hreflang: 'en', href: enUrl }]);
      head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: enUrl }]);
    }
    if (exists(cnRel)) {
      head.push(['link', { rel: 'alternate', hreflang: 'zh-CN', href: cnUrl }]);
    }
    head.push(
      ['meta', { property: 'og:title', content: ogTitle }],
      ['meta', { property: 'og:description', content: desc }],
      ['meta', { property: 'og:url', content: selfUrl }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: ogTitle }],
      ['meta', { name: 'twitter:description', content: desc }],
    );

    const lib =
      enRel === 'src/ranui/index.md'
        ? {
            name: 'ranui',
            description:
              'A Web Components UI library built on native custom elements, with TypeScript types, light/dark theming, SSR and PWA support.',
          }
        : enRel === 'src/ranuts/index.md'
          ? {
              name: 'ranuts',
              description:
                'A tree-shakeable JavaScript/TypeScript utility library: DOM/BOM, string/object/number helpers, a 2D rendering engine, and a virtual DOM.',
            }
          : null;
    if (lib) {
      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: lib.name,
          description: lib.description,
          programmingLanguage: 'TypeScript',
          codeRepository: 'https://github.com/chaxus/ran',
          url: selfUrl,
          author: { '@type': 'Person', name: 'chaxus', url: 'https://github.com/chaxus' },
        }),
      ]);
    }

    // Per-page structured data for individual component (ranui) and utility (ranuts)
    // reference pages: a TechArticle so search engines and AI answer engines can
    // extract and cite them as API documentation. The two library landing pages
    // above already carry SoftwareSourceCode, so they're excluded here.
    const isComponentPage = /^src\/ranui\/[^/]+\/index\.md$/.test(enRel) && enRel !== 'src/ranui/index.md';
    const isUtilPage = enRel.startsWith('src/ranuts/') && enRel !== 'src/ranuts/index.md' && enRel.endsWith('.md');
    if (isComponentPage || isUtilPage) {
      head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: ogTitle,
          name: title,
          description: desc,
          inLanguage: isCn ? 'zh-CN' : 'en',
          url: selfUrl,
          about: {
            '@type': 'SoftwareSourceCode',
            name: isComponentPage ? 'ranui' : 'ranuts',
            codeRepository: 'https://github.com/chaxus/ran',
            programmingLanguage: 'TypeScript',
          },
          isPartOf: { '@id': `${ORIGIN}/#website` },
          author: { '@type': 'Person', name: 'chaxus', url: 'https://github.com/chaxus' },
        }),
      ]);
    }
  },
  locales: {
    // root: { label: '简体中文', lang: 'zh-CN' },
    // en: {
    //   label: 'English',
    //   lang: 'en',
    //   themeConfig: themeEnConfig,
    // },
    root: { label: 'English', lang: LANGS_DICT.EN },
    cn: {
      label: '简体中文',
      lang: LANGS_DICT.ZH_CN,
      themeConfig: themeCnConfig,
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag: string) => {
          return tag.startsWith('r-');
        },
      },
    },
  },
  head: [
    // base
    ['link', { rel: 'icon', href: `${BASE_PATH}favicon.ico` }],
    ['link', { rel: 'manifest', href: `${BASE_PATH}manifest.json` }],
    // Geist Sans carries all body text — preload so the swap happens before first paint.
    // Geist Mono is intentionally not preloaded: pages without code shouldn't pay for it.
    [
      'link',
      {
        rel: 'preload',
        href: `${BASE_PATH}fonts/geist-variable.woff2`,
        as: 'font',
        type: 'font/woff2',
        crossorigin: '',
      },
    ],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff' }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#000000' }],
    // author
    ['meta', { name: 'author', content: 'chaxus' }],
    // 表示爬虫对此页面的处理行为 或 应当遵守的规则，是用来做搜索引擎抓取的
    // all：搜索引擎将索引此网页，并继续通过此 网页的链接索引文件 将被检索
    // none：搜索引擎将 忽略 此网页
    // index：搜索引擎 索引 此网页
    // follow：搜索引擎继续通过此网页的链接索引搜索 其它的网页
    ['meta', { name: 'robots', content: 'all' }],
    // 用来指定支持双核浏览器要采用哪种的渲染方式
    ['meta', { name: 'renderer', content: 'webkit' }],
    // 已经有国际化，禁止谷歌自动翻译
    ['meta', { name: 'google', content: 'notranslate' }],
    // og — per-page og:title / og:description / og:url are injected in transformPageData.
    // Only the shared image + type + site identity stay static here.
    ['meta', { property: 'og:image', content: OG_IMAGE }],
    ['meta', { property: 'og:image:width', content: OG_IMAGE_WIDTH }],
    ['meta', { property: 'og:image:height', content: OG_IMAGE_HEIGHT }],
    ['meta', { property: 'og:image:alt', content: OG_IMAGE_ALT }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ran' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:locale:alternate', content: 'zh_CN' }],
    // twitter:image is explicit so the large-summary card never falls back to the icon.
    ['meta', { name: 'twitter:image', content: OG_IMAGE }],
    ['meta', { name: 'twitter:image:alt', content: OG_IMAGE_ALT }],
    // site-wide structured data (JSON-LD): the site + its author (personal brand)
    ['script', { type: 'application/ld+json' }, JSON.stringify(SITE_JSONLD)],
    [
      'meta',
      {
        property: 'article:home',
        content: HOME,
      },
    ],
    ['meta', { property: 'article:ranui', content: RANUI_PATH }],
    ['meta', { property: 'article:ranuts', content: UTILS_PATH }],
    ['meta', { property: 'article:section', content: ARTICLE_PATH }],
    // keywords
    // ['meta', { name: 'keywords', content: KEY_WORDS }],
    // chrome
    ['meta', { httpEquiv: 'Permissions-Policy', content: 'interest-cohort=()' }],
    // set font size
    ['script', {}, SET_FONT_SIZE],
    // report
    ['script', { defer: 'true', src: GTAG }],
    ['script', {}, GOOGLE_ANALYSE],
    ['script', {}, BD_ANALYSE],
    // preview component script
    ['script', {}, PREVIEW_CODE],
    // service worker and pwa
    ['script', {}, SERVICE_WORK],
  ],
  themeConfig: themeEnConfig,
});
