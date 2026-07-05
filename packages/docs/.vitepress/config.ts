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
  HOME_ICON,
  // KEY_WORDS,
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

/** Convert a VitePress source path (e.g. `src/ranui/index.md`) to its site URL path. */
const relToUrl = (rel: string): string => {
  const p = rel.replace(/\.md$/, '');
  if (p === 'index') return '/';
  if (p.endsWith('/index')) return `/${p.slice(0, -'index'.length)}`;
  return `/${p}.html`;
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
  sitemap: {
    hostname: HOME,
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

    const title = pageData.title || 'ran';
    const ogTitle = title === 'ran' ? SITE_TAGLINE : `${title} | ran`;
    const desc =
      pageData.frontmatter.description ||
      pageData.description ||
      `${title} — documentation for ran: ranui Web Components and ranuts utilities.`;
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
    ['meta', { name: 'theme-color', content: '#646cff' }],
    // author
    ['meta', { name: 'author', content: '81380@163.com' }],
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
    // Only the shared image + type stay static here.
    ['meta', { property: 'og:image', content: HOME_ICON }],
    ['meta', { property: 'og:type', content: 'website' }],
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
