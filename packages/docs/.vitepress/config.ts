import { defineConfig } from 'vitepress'

const BASE_PATH = '/ran/'

export default defineConfig({
  title: 'ran',
  description: '基于web component组件库,常用函数库utils,个人文章记录等',
  base: BASE_PATH,
  lastUpdated: true,
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => {
          return tag.startsWith('r-')
        },
      },
    },
  },
  head: [
    ['link', { rel: 'icon', href: `${BASE_PATH}favicon.ico` }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { httpEquiv: 'Permissions-Policy', content: 'interest-cohort=()' }],
  ],
  themeConfig: {
    logo: '/home.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '函数', link: '/src/ranuts/utils/' },
      { text: '组件', link: '/src/ranui/' },
      { text: '璀璨', link: '/src/article/designMode.md' },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/chaxus/ran' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-11-11',
    },
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
          text: 'Overview 总览', link: '/src/ranui/'
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
})
