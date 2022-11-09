const sidebar = {
  "/": [
    { text: "快速开始", link: "/" },
    {
      text: "通用",
      children: [
        { text: "Button 按钮", link: "/docs/button/" },
        { text: "Icon 图标", link: "/docs/icon/" },
      ],
    },
    {
      text: "数据录入",
      children: [{ text: "Input 输入框", link: "/docs/input/" }],
    },
    {
      text: "数据展示",
      children: [
        { text: "Tab 标签页", link: "/docs/tab/" },
        { text: "Image 图片", link: "/docs/image/" },
      ],
    },
    {
      text: "反馈",
      children: [{ text: "message 提示", link: "/docs/message/" }],
    },
   
  ],
};
const config = {
  title: "ranui",
  description: "基于web component的组件库",
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    sidebar,
  },
};

export default config;
