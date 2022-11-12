import { defineConfig } from "vitepress";

const nav = [
  { text: "组件库", link: "/docs/" },
]

const sidebar = {
  "/": [
    {
      text: "通用",
      items: [
        { text: "Button 按钮", link: "/docs/button/" },
        { text: "Icon 图标", link: "/docs/icon/" },
      ],
    },
    {
      text: "数据录入",
      items: [{ text: "Input 输入框", link: "/docs/input/" }],
    },
    {
      text: "数据展示",
      items: [
        { text: "Tab 标签页", link: "/docs/tab/" },
        { text: "Image 图片", link: "/docs/image/" },
      ],
    },
    {
      text: "反馈",
      items: [{ text: "message 提示", link: "/docs/message/" }],
    },
  ],
};
const config = {
  title: "ranui",
  description: "基于web component的组件库",
  themeConfig: {
    nav,
    sidebar,
  },
  base: "/",
};

export default defineConfig(config)
