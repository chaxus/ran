const sidebar = {
  "/": [
    { text: "快速开始", link: "/" },
    {
      text: "通用",
      children: [
        { text: "Button 按钮", link: "/docs/button/" },
        { text: "Input 输入框", link: "/docs/input/" },
        { text: "Image 图片", link: "/docs/image/" },
        { text: "Icon 图标", link: "/docs/icon/" },
        { text: "Tab 标签页", link: "/docs/tab/" },
        { text: "message 提示", link: "/docs/message/" },
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
  title: "ranui",
  description:'基于web component的组件库',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    sidebar,
  },
};

export default config;
