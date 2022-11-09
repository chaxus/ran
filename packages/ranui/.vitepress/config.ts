const sidebar = {
  "/": [
    { text: "快速开始", link: "/" },
    {
      text: "通用",
      children: [
        { text: "Button 按钮", link: "/button/" },
        { text: "Icon 图标", link: "/icon/" },
      ],
    },
    {
      text: "数据录入",
      children: [{ text: "Input 输入框", link: "/input/" }],
    },
    {
      text: "数据展示",
      children: [
        { text: "Tab 标签页", link: "/tab/" },
        { text: "Image 图片", link: "/image/" },
      ],
    },
    {
      text: "反馈",
      children: [{ text: "message 提示", link: "/message/" }],
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
  base:'/docs/'
};

export default config;
