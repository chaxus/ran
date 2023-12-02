import { GITHUB } from '../../common/index';
import type { DefaultTheme } from 'vitepress';

const themeEnConfig: DefaultTheme.Config = {
  logo: '/home.svg',
  nav: [
    { text: 'Home', link: '/en/' },
    { text: 'Function', link: '/en/src/ranuts/' },
    { text: 'Component', link: '/en/src/ranui/' },
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
        text: 'Overview',
        link: '/en/src/ranuts/',
      },
      {
        text: 'Universal function',
        items: [
          { text: 'Filter object', link: '/en/src/ranuts/utils/filterObj.md' },
          { text: 'Statistical execution time', link: '/en/src/ranuts/utils/task.md' },
          { text: 'String to xml', link: '/en/src/ranuts/utils/str2xml.md' },
          {
            text: 'Image to base64',
            link: '/en/src/ranuts/utils/convertImageToBase64.md',
          },
          { text: 'OCR text recognition`', link: '/en/src/ranuts/utils/ocr.md' },
        ],
      },
      {
        text: 'document',
        items: [
          {
            text: 'Example Query details about a file',
            link: '/en/src/ranuts/file/watchFile.md',
          },
          {
            text: 'Read the name of the file in the directory',
            link: '/en/src/ranuts/file/readDir.md',
          },
          {
            text: 'Listen for file changes',
            link: '/en/src/ranuts/file/watchFile.md',
          },
          { text: 'Read file contents', link: '/en/src/ranuts/file/readFile.md' },
          {
            text: 'Append file content',
            link: '/en/src/ranuts/file/appendFile.md',
          },
          { text: 'Write to file content', link: '/en/src/ranuts/file/writeFile.md' },
        ],
      },
      {
        text: 'Design pattern',
        items: [
          { text: 'Publish-subscribe model', link: '/en/src/ranuts/mode/subscribe.md' },
        ],
      },
      {
        text: 'mime type',
        items: [
          {
            text: 'Get mime by file suffix type',
            link: '/en/src/ranuts/mimeType/mimeType.md',
          },
        ],
      },
    ],
    '/en/src/ranui/': [
      {
        text: 'Overview ',
        link: '/en/src/ranui/',
      },
      {
        text: 'Be common',
        items: [
          { text: 'Button ', link: '/en/src/ranui/button/' },
          { text: 'Icon ', link: '/en/src/ranui/icon/' },
        ],
      },
      {
        text: 'Data presentation',
        items: [
          { text: 'Image ', link: '/en/src/ranui/image/' },
          { text: 'Tabs ', link: '/en/src/ranui/tabs/' },
          { text: 'Preview ', link: '/en/src/ranui/preview/' },
          { text: 'Radar ', link: '/en/src/ranui/radar/' },
          { text: 'Select ', link: '/en/src/ranui/select/' },
          { text: 'Player ', link: '/en/src/ranui/player/' },
          { text: 'Progress ', link: '/en/src/ranui/progress/' },
        ],
      },
      {
        text: 'Data entry',
        items: [{ text: 'Input', link: '/en/src/ranui/input/' }],
      },
      {
        text: 'feedback',
        items: [
          { text: 'Message', link: '/en/src/ranui/message/' },
          { text: 'Skeleton', link: '/en/src/ranui/skeleton/' },
          // { text: 'Modal 对话框', link: '/src/ranui/modal/' },
        ],
      },
    ],
    '/en/src/article/': [
      {
        items: [
          {
            text: '23 classic design patterns',
            link: '/en/src/article/designMode.md',
          },
          {
            text: 'Functional programming',
            link: '/en/src/article/functionalProgramming.md',
          },
          {
            text: 'Sorting algorithm',
            link: '/en/src/article/sort/index.md',
            items: [
              { text: 'bubble sort', link: '/en/src/article/sort/bubble/' },
              { text: 'selection sort', link: '/en/src/article/sort/select/' },
              { text: 'insertion sort', link: '/en/src/article/sort/insert/' },
              { text: 'shell sort', link: '/en/src/article/sort/shell/' },
              { text: 'Merge sort', link: '/en/src/article/sort/merge/' },
              { text: 'Quick sort', link: '/en/src/article/sort/quick/' },
              { text: 'heapsort', link: '/en/src/article/sort/heap/' },
              { text: 'Counting sort', link: '/en/src/article/sort/count/' },
              { text: 'Bucket sort', link: '/en/src/article/sort/bucket/' },
              { text: 'Radix sort', link: '/en/src/article/sort/radix/' },
            ],
          },
        ],
      },
    ],
  },
};

export { themeEnConfig };
