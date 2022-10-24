const sidebar = {
  "/": [
    { text: "快速开始", link: "/" },
    {
      text: "工具函数",
      children: [
        { text: "通用函数", link: "/docs/functions/" },
        { text: "文件系统函数", link: "/docs/file/" },
        { text: "统计执行时间", link: "/docs/functions/task/" },
      ],
    },
    {
      text: "排序",
      link:'/docs/sort/',
      children: [
        { text: "冒泡排序", link: "/docs/sort/bubble/" },
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
    { text: "反馈" },
    { text: "数据录入" },
    { text: "数据展示" },
    { text: "布局" },
  ],
};
const config = {
  title: "ranuts",
  themeConfig: {
    sidebar,
  },
};

export default config;
