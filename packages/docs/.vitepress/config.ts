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
  KEY_WORDS,
  PREVIEW_CODE,
  RANUI_PATH,
  SERVICE_WORK,
  SET_FONT_SIZE,
  UTILS_PATH,
} from './common/index';
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
        content: HOME,
      },
    ],
    ['meta', { property: 'article:ranui', content: RANUI_PATH }],
    ['meta', { property: 'article:ranuts', content: UTILS_PATH }],
    ['meta', { property: 'article:section', content: ARTICLE_PATH }],
    // keywords
    ['meta', { name: 'keywords', content: KEY_WORDS }],
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
