import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'vitepress';
import { themeEnConfig } from './langs/en/index.ts';
import { themeCnConfig } from './langs/cn/index.ts';
import {
  ARTICLE_PATH,
  BASE_PATH,
  BD_ANALYSE,
  DESCRIPTION,
  GOOGLE_ANALYSE,
  GTAG,
  HOME,
  OG_IMAGE,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  PREVIEW_CODE,
  RANUI_PATH,
  SERVICE_WORK,
  SET_FONT_SIZE,
  UTILS_PATH,
} from './common/index.ts';
import { LANGS_DICT } from './lib/constant.ts';

// ── SEO helpers ──────────────────────────────────────────────────────────────
const ORIGIN = HOME.replace(/\/+$/, ''); // https://ran.chaxus.com
const SITE_TAGLINE = 'ran — Web Components UI library (ranui) & utility library (ranuts)';
const SITE_TAGLINE_CN = 'ran — Web Components 组件库（ranui）与 TypeScript 工具库（ranuts）';
const HOME_DESC_EN =
  'ran is an open-source front-end ecosystem: ranui, a framework-agnostic Web Components UI library on native custom elements, and ranuts, a tree-shakeable TypeScript utility library.';
const HOME_DESC_CN =
  'ran 是一套开源前端生态：ranui 是基于原生 custom elements、框架无关的 Web Components 组件库；ranuts 是可 tree-shaking 的 TypeScript 工具库。';

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

/**
 * Derive a unique <meta description> from a page's own content when it has no
 * hand-written frontmatter description. Reads the source markdown and returns
 * its first substantive prose paragraph, cleaned of markup and truncated — far
 * better for SEO than the near-duplicate site-wide template fallback, and it
 * scales to every long-tail page automatically.
 */
const deriveDescription = (absPath: string): string => {
  let raw: string;
  try {
    raw = readFileSync(absPath, 'utf8');
  } catch {
    return '';
  }
  raw = raw.replace(/^---\n[\s\S]*?\n---\n/, ''); // drop leading frontmatter
  let inCode = false;
  const collected: string[] = [];
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (/^(```|~~~)/.test(t)) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    if (!t) {
      if (collected.length) break; // blank line ends the first paragraph
      continue;
    }
    // Skip structural lines that don't read as prose.
    if (/^(#|import\s|<|!|\||=|:::)/.test(t)) continue;
    const text = t
      .replace(/^>+\s*/, '') // blockquote marker
      .replace(/^[-*+]\s+/, '') // bullet marker
      .replace(/^\d+\.\s+/, ''); // ordered marker
    if (!text) continue;
    collected.push(text);
    if (collected.join(' ').length >= 160) break;
  }
  const s = collected
    .join(' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/`([^`]*)`/g, '$1') // inline code
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1') // bold / italic
    .replace(/<[^>]+>/g, '') // stray html
    .replace(/\s+/g, ' ')
    .trim();
  if (!s) return '';
  if (s.length <= 160) return s;
  const cut = s.slice(0, 157);
  const sp = cut.lastIndexOf(' ');
  return `${(sp > 100 ? cut.slice(0, sp) : cut).trim()}…`;
};

export default defineConfig({
  title: 'ran',
  description: DESCRIPTION,
  base: BASE_PATH,
  vite: {
    build: {
      target: 'esnext',
      // Default (500kB) fires on every single build — every page-specific demo chunk
      // over that size is a real, per-feature library that has no smaller substitute
      // (KaTeX + temml + the latinmodernmath font for math rendering, hls.js/dash.js/
      // mpegts.js for the video-streaming article, pdf.js for the doc-preview demo,
      // cytoscape for graph diagrams, mermaid's per-diagram-type chunks). None of them
      // are in the eagerly-loaded homepage/theme bundle — verified by inspecting
      // dist/index.html's script tags, which pull in only the ~340kB Vue framework +
      // theme chunk. Raised just above the largest known-legitimate chunk (pdf.js,
      // ~1.36MB) so the warning stays a tripwire for an unexpected new large chunk
      // instead of noise that's identical on every build and easy to stop reading.
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'INVALID_ANNOTATION') return;
          // dashjs ships a UMD build; its `typeof exports !== 'undefined'` CJS-interop
          // guard resolves to `undefined` at runtime in the browser and is harmless, but
          // Rollup flags it every time it re-bundles ranui's already-built dist chunk for
          // this dashjs adapter (see packages/ranui/components/player/core/adapters/dash.ts).
          // Scoped to that one chunk so a real COMMONJS_VARIABLE_IN_ESM elsewhere still surfaces.
          if (warning.code === 'COMMONJS_VARIABLE_IN_ESM' && warning.id?.includes('dash.all.min')) return;
          // ranui's icon system (see "Name-driven lazy variant loading" in packages/ranui/CLAUDE.md)
          // deliberately both statically imports a few common icons into the entry chunk (so they
          // render with zero async flash) and dynamically imports every builtin on first use by name
          // (so uncommon ones stay lazy). Rollup can't tell that's intentional and flags every such
          // icon as an "ineffective" dynamic import — expected and desired, per that doc, not a bug.
          // Scoped to ranui's dist so a genuinely ineffective dynamic import in docs' own code still surfaces.
          if (warning.code === 'INEFFECTIVE_DYNAMIC_IMPORT' && warning.id?.includes('/ranui/dist/')) return;
          warn(warning);
        },
      },
    },
  },
  // CLAUDE.md is an internal orientation doc, not a page. It lives inside the VitePress root,
  // so without this VitePress compiles it as a route — and since every page is compiled as a
  // Vue template, its own "a bare `{{` breaks the build" note breaks the build.
  srcExclude: ['**/CLAUDE.md'],
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

      // Every table is wrapped in a horizontal-scroll container. `doc.less` renders
      // tables as a real `display: table` card (VitePress's default is a scrolling
      // `display: block`), and a real table can never be narrower than its widest
      // unbreakable cell — so a long signature used to push the whole table past the
      // content column and under the right-hand outline. With the wrapper the table
      // keeps its card look at 100% width and, in the rare case its min-content still
      // exceeds the column, the wrapper scrolls instead of overlapping.
      md.renderer.rules.table_open = () => '<div class="vp-table-wrap"><table>';
      md.renderer.rules.table_close = () => '</table></div>';

      // A hard line break inside a Chinese paragraph is rendered as a space by
      // markdown-it (softbreak → "\n" → collapsed by Vue's whitespace condensing), so
      // the hard-wrapped `cn/src/**/*.md` sources showed stray spaces mid-sentence
      // ("执行 之前"). Drop the break when both neighbours are CJK text; keep it when
      // either side is Latin, inline code or a link, where the source style already
      // puts a space between Chinese and Western text anyway.
      const CJK = /[\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]/;
      const defaultSoftbreak =
        md.renderer.rules.softbreak?.bind(md.renderer.rules) ??
        ((_tokens: any, _idx: number, options: any) => (options.breaks ? '<br>\n' : '\n'));
      md.renderer.rules.softbreak = (tokens: any, idx: number, options: any, env: any, self: any) => {
        const prev = tokens[idx - 1];
        const next = tokens[idx + 1];
        if (
          prev?.type === 'text' &&
          next?.type === 'text' &&
          CJK.test(prev.content.slice(-1)) &&
          CJK.test(next.content.charAt(0))
        ) {
          return '';
        }
        return defaultSoftbreak(tokens, idx, options, env, self);
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
        deriveDescription(join(siteConfig.srcDir, rel)) ||
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
      ['meta', { property: 'og:locale', content: isCn ? 'zh_CN' : 'en_US' }],
      ['meta', { property: 'og:locale:alternate', content: isCn ? 'en_US' : 'zh_CN' }],
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
    // llms.txt — the curated entry map for LLM crawlers, and llms-full.txt, the whole
    // corpus as plain text. The convention is that agents fetch `/llms.txt` directly, so
    // these links are belt-and-braces rather than required; they cost two tags and make the
    // files discoverable to anything that reads <head> instead of guessing the well-known
    // path. `type: text/markdown` matches what the files actually are.
    ['link', { rel: 'alternate', type: 'text/markdown', href: `${BASE_PATH}llms.txt`, title: 'llms.txt' }],
    ['link', { rel: 'alternate', type: 'text/plain', href: `${BASE_PATH}llms-full.txt`, title: 'llms-full.txt' }],
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
    // og:locale / og:locale:alternate are injected per-page in transformPageData
    // so Chinese pages emit zh_CN instead of a hard-coded en_US.
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
