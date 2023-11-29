import { defineConfig } from 'vitepress';
import { themeEnConfig } from './langs/en'
import { themeCnConfig } from './langs/cn'
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
  GITHUB,
  BASE_PATH,
} from './common/index';

export default defineConfig({
  title: 'ran',
  description: DESCRIPTION,
  base: BASE_PATH,
  lastUpdated: true,
  locales: {
    root: { label: '简体中文', lang: 'zh-CN' },
    en: {
      label: 'English',
      lang: 'en',
      themeConfig: themeEnConfig,
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
    [
      'meta',
      { httpEquiv: 'Permissions-Policy', content: 'interest-cohort=()' },
    ],
    // report
    ['script', { defer: 'true', src: GTAG }],
    ['script', {}, GOOGLE_ANALYSE],
    ['script', {}, BD_ANALYSE],
    // preview component script
    ['script', {}, PREVIEW_CODE],
  ],
  themeConfig: themeCnConfig
});
