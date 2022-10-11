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
    { text: "导航" },
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
