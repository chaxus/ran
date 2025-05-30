import type { DefaultTheme } from 'vitepress';
import { GITHUB } from '../../common/index';

const themeEnConfig: DefaultTheme.Config = {
  logo: '/home.svg',
  search: {
    provider: 'local',
  },
  nav: [
    { text: 'Home', link: '/' },
    { text: 'Function', link: '/src/ranuts/' },
    { text: 'Component', link: '/src/ranui/' },
    { text: 'Article', link: '/src/article/design_mode.md' },
  ],
  socialLinks: [{ icon: 'github', link: GITHUB }],
  footer: {
    message: 'Released under the MIT License.',
    copyright: 'Copyright © 2022-11-11',
  },
  // algolia: {
  //   appId: 'RDX0Y4AQW1',
  //   apiKey: 'c7b6e28f95335eddc66c5a1b54ad9834',
  //   indexName: 'chaxus_ran',
  //   placeholder: 'search',
  // },
  sidebar: {
    '/src/ranuts/': [
      {
        text: 'Overview',
        link: '/src/ranuts/',
      },
      {
        text: 'Universal Function',
        items: [
          { text: 'Filter object', link: '/src/ranuts/utils/filter_obj.md' },
          {
            text: 'Statistical execution time',
            link: '/src/ranuts/utils/task.md',
          },
          { text: 'String to xml', link: '/src/ranuts/utils/str2xml.md' },
          {
            text: 'Image to base64',
            link: '/src/ranuts/utils/convert_image_to_base64.md',
          },
          { text: 'OCR text recognition`', link: '/src/ranuts/utils/ocr.md' },
        ],
      },
      {
        text: 'Document',
        items: [
          {
            text: 'Example Query details about a file',
            link: '/src/ranuts/file/watch_file.md',
          },
          {
            text: 'Read the name of the file in the directory',
            link: '/src/ranuts/file/read_dir.md',
          },
          {
            text: 'Listen for file changes',
            link: '/src/ranuts/file/watch_file.md',
          },
          { text: 'Read file contents', link: '/src/ranuts/file/read_file.md' },
          {
            text: 'Append file content',
            link: '/src/ranuts/file/append_file.md',
          },
          {
            text: 'Write to file content',
            link: '/src/ranuts/file/write_file.md',
          },
        ],
      },
      {
        text: 'Design Pattern',
        items: [
          {
            text: 'Publish-subscribe model',
            link: '/src/ranuts/mode/subscribe.md',
          },
        ],
      },
      {
        text: 'mime type',
        items: [
          {
            text: 'Get mime by file suffix type',
            link: '/src/ranuts/mimeType/mime_type.md',
          },
        ],
      },
    ],
    '/src/ranui/': [
      {
        text: 'Overview ',
        link: '/src/ranui/',
      },
      {
        text: 'Common',
        items: [
          { text: 'Button', link: '/src/ranui/button/' },
          { text: 'Icon', link: '/src/ranui/icon/' },
          { text: 'Loading', link: '/src/ranui/loading/' },
        ],
      },
      {
        text: 'Data Presentation',
        items: [
          { text: 'Image', link: '/src/ranui/image/' },
          { text: 'Math', link: '/src/ranui/math' },
          { text: 'CheckBox', link: '/src/ranui/checkbox/' },
          { text: 'Tabs', link: '/src/ranui/tabs/' },
          { text: 'Preview', link: '/src/ranui/preview/' },
          { text: 'Radar', link: '/src/ranui/radar/' },
          { text: 'Select', link: '/src/ranui/select/' },
          { text: 'Player', link: '/src/ranui/player/' },
          { text: 'Progress', link: '/src/ranui/progress/' },
          { text: 'Popover', link: '/src/ranui/popover/' },
        ],
      },
      {
        text: 'Data Entry',
        items: [{ text: 'Input', link: '/src/ranui/input/' }],
      },
      {
        text: 'Feedback',
        items: [
          { text: 'Message', link: '/src/ranui/message/' },
          { text: 'Skeleton', link: '/src/ranui/skeleton/' },
          // { text: 'Modal 对话框', link: '/src/ranui/modal/' },
        ],
      },
    ],
    '/src/article/': [
      {
        items: [
          {
            text: '23 classic design patterns',
            link: '/src/article/design_mode.md',
          },
          {
            text: 'Functional programming',
            link: '/src/article/functional_programming.md',
          },
          {
            text: 'Sorting algorithm',
            link: '/src/article/sort/index.md',
            collapsed: true,
            items: [
              { text: 'bubble sort', link: '/src/article/sort/bubble/' },
              { text: 'selection sort', link: '/src/article/sort/select/' },
              { text: 'insertion sort', link: '/src/article/sort/insert/' },
              { text: 'shell sort', link: '/src/article/sort/shell/' },
              { text: 'Merge sort', link: '/src/article/sort/merge/' },
              { text: 'Quick sort', link: '/src/article/sort/quick/' },
              { text: 'Heap Sort', link: '/src/article/sort/heap/' },
              { text: 'Counting sort', link: '/src/article/sort/count/' },
              { text: 'Bucket sort', link: '/src/article/sort/bucket/' },
              { text: 'Radix sort', link: '/src/article/sort/radix/' },
            ],
          },
        ],
      },
    ],
  },
};

export { themeEnConfig };
