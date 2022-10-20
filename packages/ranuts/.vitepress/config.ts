const sidebar = {
  "/": [
    { text: "快速开始", link: "/" },
    {
      text: "通用",
      children: [
        { text: "通用函数", link: "/docs/functions/" },
        { text: "文件系统函数", link: "/docs/file/" },
      ],
    },
    {
      text: "排序",
      link:'/docs/sort/',
      children: [
        { text: "冒泡排序", link: "/docs/sort/" },
        { text: "插入排序", link: "/docs/sort/" },
        { text: "希尔排序", link: "/docs/sort/" },
        { text: "选择排序", link: "/docs/sort/" },
        { text: "堆排序", link: "/docs/sort/" },
        { text: "快速排序", link: "/docs/sort/" },
        { text: "归并排序", link: "/docs/sort/" },
        { text: "计数排序", link: "/docs/sort/" },
        { text: "桶排序", link: "/docs/sort/" },
        { text: "基数排序", link: "/docs/sort/" },
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
