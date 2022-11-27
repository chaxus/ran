import { defineConfig } from "vitepress";

export default defineConfig({
  title: "ranuts",
  description: "常用函数集合",
  base: "/docs/",
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: "首页", link: "/docs/" },
      { text: "工具函数", link: "/docs/utils/" },
      { text: "文件函数", link: "/docs/file/" },
      { text: "排序算法", link: "/docs/sort/" },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/chaxus/ran" }],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2022-11-11",
    },
    sidebar: {
      "/docs/utils/": [
        {
          items: [
            { text: "通用函数", link: "/docs/utils/" },
            { text: "统计执行时间", link: "/docs/utils/task" },
            { text: "compose函数", link: "/docs/utils/compose" },
          ],
        },
      ],
      "/docs/file/": [
        {
          items: [{ text: "文件函数", link: "/docs/file/" }],
        },
      ],
      "/docs/sort/": [
        {
          text: "排序",
          items: [
            { text: "冒泡排序", link: "/bubble/" },
            { text: "选择排序", link: "/docs/sort/selection/" },
            { text: "插入排序", link: "/docs/sort/insert/" },
            { text: "希尔排序", link: "/docs/sort/shell/" },
            { text: "归并排序", link: "/docs/sort/merge/" },
            { text: "快速排序", link: "/docs/sort/quick/" },
            { text: "堆排序", link: "/docs/sort/heap/" },
            { text: "计数排序", link: "/docs/sort/count/" },
            { text: "桶排序", link: "/docs/sort/bucket/" },
            { text: "基数排序", link: "/docs/sort/radix/" },
          ],
        },
      ],
    },
  },
});
