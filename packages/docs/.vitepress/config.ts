import { defineConfig } from 'vitepress';
import { themeEnConfig } from './langs/en';
import { themeCnConfig } from './langs/cn';
import {
  GTAG,
  GOOGLE_ANALYSE,
  BD_ANALYSE,
  PREVIEW_CODE,
  DESCRIPTION,
  HOME,
  HOME_ICON,
  UTILS_PATH,
  RANUI_PATH,
  ARTICLE_PATH,
  KEY_WORDS,
  BASE_PATH,
  SERVICE_WORK,
} from './common/index';
import { pagefindPlugin } from 'vitepress-plugin-pagefind';
import { LANGS_DICT } from './lib/constant';

export default defineConfig({
  title: 'ran',
  description: DESCRIPTION,
  base: BASE_PATH,
  lastUpdated: true,
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
  vite: {
    plugins: [
      pagefindPlugin({
        locales: {
          root: {
            btnPlaceholder: 'Search',
            placeholder: 'Search Docs...',
            emptyText: 'No results',
            heading: 'Total: {{searchResult}} search results.',
          },
          zh: {
            customSearchQuery(input) {
              // 将搜索的每个中文单字两侧加上空格
              return input
                .replace(/[\u4e00-\u9fa5]/g, ' $& ')
                .replace(/\s+/g, ' ')
                .trim();
            },
            btnPlaceholder: '搜索',
            placeholder: '搜索文档',
            emptyText: '空空如也',
            heading: '共：{{searchResult}} 条结果',
            // 搜索结果不展示最后修改日期日期
            showDate: false,
          },
        },
      }),
    ],
    define: {
      __VUE_PROD_DEVTOOLS__: false,
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => {
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
    // og
    ['meta', { property: 'og:title', content: 'ran' }],
    [
      'meta',
      {
        property: 'og:description',
        content: DESCRIPTION,
      },
    ],
    ['meta', { property: 'og:url', content: HOME }],
    ['meta', { property: 'og:image', content: HOME_ICON }],
    ['meta', { property: 'og:type', content: 'article' }],
    [
      'meta',
      {
        property: 'article:home',
        content: UTILS_PATH,
      },
    ],
    ['meta', { property: 'article:ranui', content: RANUI_PATH }],
    ['meta', { property: 'article:section', content: ARTICLE_PATH }],
    // keywords
    ['meta', { name: 'keywords', content: KEY_WORDS }],
    // chrome
    ['meta', { httpEquiv: 'Permissions-Policy', content: 'interest-cohort=()' }],
    // report
    ['script', { defer: 'true', src: GTAG }],
    ['script', {}, GOOGLE_ANALYSE],
    ['script', {}, BD_ANALYSE],
    // preview component script
    ['script', {}, PREVIEW_CODE],
    ['script', {}, SERVICE_WORK],
  ],
  themeConfig: themeEnConfig,
});
