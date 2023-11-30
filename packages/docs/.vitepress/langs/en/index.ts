import { GITHUB } from '../../common/index';
import type { DefaultTheme } from 'vitepress';

const themeEnConfig: DefaultTheme.Config = {
  logo: '/home.svg',
  nav: [
    { text: 'Home', link: '/en/' },
    { text: 'Function', link: '/en/src/ranuts/' },
    { text: 'Ranui', link: '/en/src/ranui/' },
    { text: 'Article', link: '/en/src/article/designMode.md' },
  ],
  socialLinks: [{ icon: 'github', link: GITHUB }],
  footer: {
    message: 'Released under the MIT License.',
    copyright: 'Copyright © 2022-11-11',
  },
  algolia: {
    appId: 'RDX0Y4AQW1',
    apiKey: 'c7b6e28f95335eddc66c5a1b54ad9834',
    indexName: 'chaxus_ran',
    placeholder: 'search',
  },
  sidebar: {
    '/en/src/ranuts/': [
      {
        text: 'Overview 总览',
        link: '/en/src/ranuts/',
      },
      {
        text: '通用函数',
        items: [
          { text: '过滤对象', link: '/en/src/ranuts/utils/filterObj.md' },
          { text: '统计执行时间', link: '/en/src/ranuts/utils/task.md' },
          { text: '字符串转xml', link: '/en/src/ranuts/utils/str2xml.md' },
          {
            text: '图片转base64',
            link: '/en/src/ranuts/utils/convertImageToBase64.md',
          },
          { text: 'OCR文字识别`', link: '/en/src/ranuts/utils/ocr.md' },
        ],
      },
      {
        text: '文件',
        items: [
          {
            text: '查询一个文件的详细信息',
            link: '/en/src/ranuts/file/watchFile.md',
          },
          {
            text: '读取目录下的文件名称',
            link: '/en/src/ranuts/file/readDir.md',
          },
          {
            text: '监听文件是否改变',
            link: '/en/src/ranuts/file/watchFile.md',
          },
          { text: '读取文件内容', link: '/en/src/ranuts/file/readFile.md' },
          {
            text: '追加文件内容',
            link: '/en/src/ranuts/file/appendFile.md',
          },
          { text: '写入文件内容', link: '/en/src/ranuts/file/writeFile.md' },
        ],
      },
      {
        text: '设计模式',
        items: [
          { text: '发布订阅模式', link: '/en/src/ranuts/mode/subscribe.md' },
        ],
      },
      {
        text: 'mime type',
        items: [
          {
            text: '通过文件后缀获取mime type',
            link: '/en/src/ranuts/mimeType/mimeType.md',
          },
        ],
      },
    ],
    '/en/src/ranui/': [
      {
        text: 'Overview 总览',
        link: '/en/src/ranui/',
      },
      {
        text: '通用',
        items: [
          { text: 'Button 按钮', link: '/en/src/ranui/button/' },
          { text: 'Icon 图标', link: '/en/src/ranui/icon/' },
          { text: 'Player 视频播放器', link: '/en/src/ranui/video/' },
          { text: 'Progress 进度条', link: '/en/src/ranui/progress/' },
        ],
      },
      {
        text: '数据展示',
        items: [
          { text: 'Image 图片', link: '/en/src/ranui/image/' },
          { text: 'Tabs 标签页', link: '/en/src/ranui/tabs/' },
          { text: 'Preview 预览', link: '/en/src/ranui/preview/' },
          { text: 'Radar 雷达图', link: '/en/src/ranui/radar/' },
        ],
      },
      {
        text: '数据录入',
        items: [{ text: 'Input 输入框', link: '/en/src/ranui/input/' }],
      },
      {
        text: '反馈',
        items: [
          { text: 'Message 全局提示', link: '/en/src/ranui/message/' },
          { text: 'Skeleton 骨架屏', link: '/en/src/ranui/skeleton/' },
          // { text: 'Modal 对话框', link: '/src/ranui/modal/' },
        ],
      },
    ],
    '/en/src/article/': [
      {
        items: [
          {
            text: '23 种经典设计模式',
            link: '/en/src/article/designMode.md',
          },
          {
            text: '函数式编程',
            link: '/en/src/article/functionalProgramming.md',
          },
          {
            text: '排序算法',
            link: '/en/src/article/sort/index.md',
            items: [
              { text: '冒泡排序', link: '/en/src/article/sort/bubble/' },
              { text: '选择排序', link: '/en/src/article/sort/select/' },
              { text: '插入排序', link: '/en/src/article/sort/insert/' },
              { text: '希尔排序', link: '/en/src/article/sort/shell/' },
              { text: '归并排序', link: '/en/src/article/sort/merge/' },
              { text: '快速排序', link: '/en/src/article/sort/quick/' },
              { text: '堆排序', link: '/en/src/article/sort/heap/' },
              { text: '计数排序', link: '/en/src/article/sort/count/' },
              { text: '桶排序', link: '/en/src/article/sort/bucket/' },
              { text: '基数排序', link: '/en/src/article/sort/radix/' },
            ],
          },
        ],
      },
    ],
  },
};

export { themeEnConfig };
