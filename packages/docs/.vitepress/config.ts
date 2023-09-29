import { defineConfig } from 'vitepress';
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
  themeConfig: {
    logo: '/home.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '函数', link: '/src/ranuts/utils/' },
      { text: '组件', link: '/src/ranui/' },
      { text: '璀璨', link: '/src/article/designMode.md' },
    ],
    socialLinks: [{ icon: 'github', link: GITHUB }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-11-11',
    },
    // algolia: {
    //   appId: 'RDX0Y4AQW1',
    //   apiKey: 'c7b6e28f95335eddc66c5a1b54ad9834',
    //   indexName: 'chaxus_ran',
    //   placeholder: 'search',
    // },
    sidebar: {
      '/src/ranuts/': [
        {
          text: '通用函数',
          items: [
            { text: '过滤对象', link: '/src/ranuts/utils/' },
            { text: '统计执行时间', link: '/src/ranuts/utils/task' },
          ],
        },
        {
          text: '文件操作',
          items: [{ text: '监听文件是否改变', link: '/src/ranuts/file/' }],
        },
        {
          text: '排序算法',
          items: [
            { text: '概览', link: '/src/ranuts/sort/' },
            { text: '冒泡排序', link: '/src/ranuts/sort/bubble/' },
            { text: '选择排序', link: '/src/ranuts/sort/select/' },
            { text: '插入排序', link: '/src/ranuts/sort/insert/' },
            { text: '希尔排序', link: '/src/ranuts/sort/shell/' },
            { text: '归并排序', link: '/src/ranuts/sort/merge/' },
            { text: '快速排序', link: '/src/ranuts/sort/quick/' },
            { text: '堆排序', link: '/src/ranuts/sort/heap/' },
            { text: '计数排序', link: '/src/ranuts/sort/count/' },
            { text: '桶排序', link: '/src/ranuts/sort/bucket/' },
            { text: '基数排序', link: '/src/ranuts/sort/radix/' },
          ],
        },
      ],
      '/src/ranui/': [
        {
          text: 'Overview 总览',
          link: '/src/ranui/',
        },
        {
          text: '通用',
          items: [
            { text: 'Button 按钮', link: '/src/ranui/button/' },
            { text: 'Icon 图标', link: '/src/ranui/icon/' },
          ],
        },
        {
          text: '数据展示',
          items: [
            { text: 'Image 图片', link: '/src/ranui/image/' },
            { text: 'Tabs 标签页', link: '/src/ranui/tabs/' },
            { text: 'Preview 预览', link: '/src/ranui/preview/' },
            { text: 'Radar 雷达图', link: '/src/ranui/radar/' },
          ],
        },
        {
          text: '数据录入',
          items: [{ text: 'Input 输入框', link: '/src/ranui/input/' }],
        },
        {
          text: '反馈',
          items: [
            { text: 'Message 全局提示', link: '/src/ranui/message/' },
            { text: 'Skeleton 骨架屏', link: '/src/ranui/skeleton/' },
            // { text: 'Modal 对话框', link: '/src/ranui/modal/' },
          ],
        },
      ],
      '/src/article/': [
        {
          items: [
            { text: '23 种经典设计模式', link: '/src/article/designMode.md' },
            {
              text: '函数式编程',
              link: '/src/article/functionalProgramming.md',
            },
          ],
        },
      ],
    },
  },
});
