const sidebar = {
  "/": [
    { text: "快速开始", link: "/" },
    {
      text: "通用",
      children: [
        { text: "Button 按钮", link: "/docs/button/" },
        { text: "Input 输入框", link: "/docs/input/" },
        { text: "Image 图片", link: "/docs/image/" },
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
  title: "RanUI",
  themeConfig: {
    sidebar,
  },
};

export default config;
