import { defineConfig } from "vitepress";

export default defineConfig({
  title: "chaxus",
  description: "基于web component组件库,常用函数库utils,个人文章记录等",
  base: "/ran/",
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/home.svg' }],
  ],
  themeConfig: {
    logo: '/home.svg',
    nav: [
      { text: "首页", link: "/" },
      { text: "函数库", link: "/ranuts/functions/" },
      { text: "组件库", link: "/ranui/" },
      // { text: "我的掘金", link: "https://juejin.cn/user/2981531263964718" },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/chaxus/ran" }],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2022-11-11",
    },
    sidebar: {
      "/ranuts/": [
        {
          text:'通用函数',
          items: [
            { text: "过滤对象", link: "/ranuts/functions/" },
            { text: "统计执行时间", link: "/ranuts/functions/task/" },
          ],
        },
        {
          text:'文件操作',
          items: [{ text: "监听文件是否改变", link: "/ranuts/file/" }],
        },
        {
          text: "排序算法",
          items: [
            { text: "概览", link: "/ranuts/sort/" },
            { text: "冒泡排序", link: "/ranuts/sort/bubble/" },
            { text: "选择排序", link: "/ranuts/sort/select/" },
            { text: "插入排序", link: "/ranuts/sort/insert/" },
            { text: "希尔排序", link: "/ranuts/sort/shell/" },
            { text: "归并排序", link: "/ranuts/sort/merge/" },
            { text: "快速排序", link: "/ranuts/sort/quick/" },
            { text: "堆排序", link: "/ranuts/sort/heap/" },
            { text: "计数排序", link: "/ranuts/sort/count/" },
            { text: "桶排序", link: "/ranuts/sort/bucket/" },
            { text: "基数排序", link: "/ranuts/sort/radix/" },
          ],
        },
      ],
      "/ranui/":[
        {
          text:'通用',
          items: [
            { text: "Button 按钮", link: "/ranui/button/" },
            { text: "Icon 图标", link: "/ranui/icon/" },
          ],
        },
        {
          text:'数据展示',
          items:[
            { text: "Image 图片", link: "/ranui/image/" },
            { text: "Tabs 标签页", link: "/ranui/tabs/" },
          ]
        },
        {
          text:'数据录入',
          items: [
            { text: "Input 输入框", link: "/ranui/input/" },
          ],
        },
        {
          text:'反馈',
          items: [
            { text: "Message 全局提示", link: "/ranui/message/" },
          ],
        }
      ]
    },
  },
});
