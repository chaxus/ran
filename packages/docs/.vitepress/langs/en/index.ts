import type { DefaultTheme } from 'vitepress';
import { GITHUB, EDITOR } from '../../common/index';

// Shared across /src/article/, /src/blockchain/ and /src/note/ so those pages
// all render this sidebar (VitePress matches sidebars by path prefix).
const articleEnSidebar: DefaultTheme.SidebarItem[] = [
  {
    items: [
      { text: '23 classic design patterns', link: '/src/article/design_mode' },
      { text: 'How AI agents work', link: '/src/article/ai/' },
      { text: 'Functional programming', link: '/src/article/functional_programming' },
      { text: 'Web document preview', link: '/src/article/doc_preview' },
      { text: 'Web video encryption', link: '/src/article/video' },
      { text: 'Visual rendering engine', link: '/src/article/visual' },
      { text: 'Abstract syntax tree', link: '/src/article/ast_parse/tokenizer' },
      {
        text: 'TypeScript type system',
        collapsed: true,
        items: [
          { text: 'Overview', link: '/src/article/typescript/' },
          { text: 'Counting with array length', link: '/src/article/typescript/calculate' },
          { text: 'Pattern matching and extraction', link: '/src/article/typescript/pattern' },
          { text: 'Reconstruction for transformation', link: '/src/article/typescript/reconstruction' },
          { text: 'Recursive reuse', link: '/src/article/typescript/recursion' },
          { text: 'Distributed conditional types', link: '/src/article/typescript/union_type' },
        ],
      },
      {
        text: 'Sorting algorithm',
        link: '/src/article/sort/',
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
      {
        text: 'Math',
        collapsed: true,
        items: [{ text: 'Linear algebra', link: '/src/article/math/linear_algebra' }],
      },
      {
        text: 'Blockchain',
        collapsed: true,
        items: [
          { text: 'Blockchain data structures', link: '/src/blockchain/' },
          { text: 'How to participate in Web3', link: '/src/blockchain/web3' },
        ],
      },
      {
        text: 'Notes',
        collapsed: true,
        items: [
          { text: 'Compiling LibreOffice to WebAssembly', link: '/src/note/libreoffice2wasm' },
          { text: 'CentOS', link: '/src/note/centos' },
          { text: 'Docker', link: '/src/note/docker' },
        ],
      },
    ],
  },
];

const themeEnConfig: DefaultTheme.Config = {
  logo: '/home.svg',
  search: {
    provider: 'local',
  },
  nav: [
    { text: 'Home', link: '/' },
    { text: 'Articles', link: '/src/article/design_mode' },
    { text: 'Doc Editor', link: EDITOR },
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
        text: 'Utility Functions',
        link: '/src/ranuts/utils/',
        collapsed: false,
        items: [
          {
            text: 'Functional Programming',
            collapsed: true,
            items: [
              { text: 'debounce - Debounce function', link: '/src/ranuts/utils/debounce' },
              { text: 'throttle - Throttle function', link: '/src/ranuts/utils/throttle' },
              { text: 'memoize - Memoization function', link: '/src/ranuts/utils/memoize' },
              { text: 'noop - No-op function', link: '/src/ranuts/utils/noop' },
              { text: 'compose - Compose middleware', link: '/src/ranuts/utils/compose' },
            ],
          },
          {
            text: 'String Processing',
            collapsed: true,
            items: [
              { text: 'md5 - MD5 hash function', link: '/src/ranuts/utils/md5' },
              { text: 'randomString - Generate random string', link: '/src/ranuts/utils/random_string' },
              { text: 'clearBr - Remove spaces and line breaks', link: '/src/ranuts/utils/clear_br' },
              { text: 'clearStr - Remove leading/trailing spaces', link: '/src/ranuts/utils/clear_str' },
              { text: 'strParse - Parse string to object', link: '/src/ranuts/utils/str_parse' },
              { text: 'toString - Convert to string', link: '/src/ranuts/utils/to_string' },
              { text: 'transformText - ArrayBuffer to text', link: '/src/ranuts/utils/transform_text' },
              { text: 'checkEncoding - Detect encoding', link: '/src/ranuts/utils/check_encoding' },
              {
                text: 'changeHumpToLowerCase - Camel to snake',
                link: '/src/ranuts/utils/change_hump_to_lower_case',
              },
              { text: 'getMatchingSentences - Extract sentences', link: '/src/ranuts/utils/get_matching_sentences' },
              { text: 'isString - Check if string', link: '/src/ranuts/utils/is_string' },
              { text: 'str2Xml - String to XML', link: '/src/ranuts/utils/str2xml' },
            ],
          },
          {
            text: 'Object Processing',
            collapsed: true,
            items: [
              { text: 'merge - Merge objects', link: '/src/ranuts/utils/merge' },
              { text: 'isEqual - Deep comparison', link: '/src/ranuts/utils/is_equal' },
              { text: 'cloneDeep - Deep clone', link: '/src/ranuts/utils/clone_deep' },
              { text: 'querystring - Object to query string', link: '/src/ranuts/utils/querystring' },
              { text: 'filterObj - Filter object', link: '/src/ranuts/utils/filter_obj' },
              { text: 'formatJson - Format JSON', link: '/src/ranuts/utils/format_json' },
            ],
          },
          {
            text: 'Number Processing',
            collapsed: true,
            items: [
              { text: 'range - Clamp number range', link: '/src/ranuts/utils/range' },
              { text: 'mathjs - Precise calculation', link: '/src/ranuts/utils/mathjs' },
              { text: 'perToNum - Percentage to number', link: '/src/ranuts/utils/per_to_num' },
              { text: 'transformNumber - Format number', link: '/src/ranuts/utils/transform_number' },
              { text: 'addNumSym - Add sign to number', link: '/src/ranuts/utils/add_num_sym' },
            ],
          },
          {
            text: 'Color Processing',
            collapsed: true,
            items: [
              { text: 'hexToRgb - Hex to RGB', link: '/src/ranuts/utils/hex_to_rgb' },
              { text: 'rgbToHex - RGB to hex', link: '/src/ranuts/utils/rgb_to_hex' },
              { text: 'randomColor - Generate random color', link: '/src/ranuts/utils/random_color' },
              { text: 'Color - Color classes & conversions', link: '/src/ranuts/utils/color' },
            ],
          },
          {
            text: 'Time Processing',
            collapsed: true,
            items: [
              { text: 'timeFormat - Format time', link: '/src/ranuts/utils/time_format' },
              { text: 'timestampToTime - Timestamp to Date', link: '/src/ranuts/utils/timestamp_to_time' },
              { text: 'performanceTime - High precision timestamp', link: '/src/ranuts/utils/performance_time' },
            ],
          },
          {
            text: 'Device Detection',
            collapsed: true,
            items: [
              { text: 'isMobile - Check mobile device', link: '/src/ranuts/utils/is_mobile' },
              { text: 'isWeiXin - Check WeChat browser', link: '/src/ranuts/utils/is_weixin' },
              { text: 'isClient - Check client environment', link: '/src/ranuts/utils/is_client' },
              { text: 'isSafari - Check Safari browser', link: '/src/ranuts/utils/is_safari' },
              { text: 'isBangDevice - Check notch device', link: '/src/ranuts/utils/is_bang_device' },
              { text: 'currentDevice - Get device type', link: '/src/ranuts/utils/current_device' },
            ],
          },
          {
            text: 'DOM Manipulation',
            collapsed: true,
            items: [
              { text: 'addClassToElement - Add class', link: '/src/ranuts/utils/add_class_to_element' },
              { text: 'removeClassToElement - Remove class', link: '/src/ranuts/utils/remove_class_to_element' },
              {
                text: 'createDocumentFragment - Create fragment',
                link: '/src/ranuts/utils/create_document_fragment',
              },
              { text: 'escapeHtml - Escape HTML', link: '/src/ranuts/utils/escape_html' },
              { text: 'Chain - Chainable DOM', link: '/src/ranuts/utils/chain' },
              { text: 'create - Create DOM element', link: '/src/ranuts/utils/create' },
            ],
          },
          {
            text: 'Storage',
            collapsed: true,
            items: [
              { text: 'localStorageGetItem - Get storage', link: '/src/ranuts/utils/local_storage' },
              { text: 'localStorageSetItem - Set storage', link: '/src/ranuts/utils/local_storage' },
            ],
          },
          {
            text: 'URL/Query',
            collapsed: true,
            items: [
              { text: 'getAllQueryString - Extract query', link: '/src/ranuts/utils/get_all_query_string' },
              { text: 'getQuery - Extract query', link: '/src/ranuts/utils/get_query' },
              { text: 'encodeUrl - Encode URL safely', link: '/src/ranuts/utils/encode_url' },
              { text: 'appendUrl - Append query params', link: '/src/ranuts/utils/append_url' },
            ],
          },
          {
            text: 'Cookie',
            collapsed: true,
            items: [
              { text: 'getCookie - Get cookie', link: '/src/ranuts/utils/get_cookie' },
              { text: 'getCookieByName - Get cookie by regex', link: '/src/ranuts/utils/get_cookie_by_name' },
            ],
          },
          {
            text: 'Image Processing',
            collapsed: true,
            items: [
              { text: 'convertImageToBase64 - Image to Base64', link: '/src/ranuts/utils/convert_image_to_base64' },
              { text: 'isImageSize - Validate image size', link: '/src/ranuts/utils/is_image_size' },
            ],
          },
          {
            text: 'Performance',
            collapsed: true,
            items: [
              { text: 'getPerformance - Get performance metrics', link: '/src/ranuts/utils/get_performance' },
              { text: 'getFrame - Calculate frame rate', link: '/src/ranuts/utils/get_frame' },
              { text: 'getPixelRatio - Get resolution ratio', link: '/src/ranuts/utils/get_pixel_ratio' },
            ],
          },
          {
            text: 'Network',
            collapsed: true,
            items: [
              { text: 'imageRequest - Test network latency', link: '/src/ranuts/utils/image_request' },
              { text: 'networkSpeed - Test network speed', link: '/src/ranuts/utils/network_speed' },
              { text: 'connection - Get network info', link: '/src/ranuts/utils/connection' },
            ],
          },
          {
            text: 'Browser',
            collapsed: true,
            items: [
              { text: 'getWindow - Get window size', link: '/src/ranuts/utils/get_window' },
              { text: 'getHost - Get host address', link: '/src/ranuts/utils/get_host' },
              { text: 'createObjectURL - Create object URL', link: '/src/ranuts/utils/create_object_url' },
              { text: 'removeGhosting - Remove drag shadow', link: '/src/ranuts/utils/remove_ghosting' },
              { text: 'retain - Override back event', link: '/src/ranuts/utils/retain' },
            ],
          },
          {
            text: 'Script Loading',
            collapsed: true,
            items: [{ text: 'scriptOnLoad - Dynamic script loading', link: '/src/ranuts/utils/script_on_load' }],
          },
          {
            text: 'Error Handling',
            collapsed: true,
            items: [
              { text: 'handleConsole - Intercept console', link: '/src/ranuts/utils/handle_console' },
              { text: 'handleError - Global error handling', link: '/src/ranuts/utils/handle_error' },
              { text: 'handleFetchHook - Intercept fetch', link: '/src/ranuts/utils/handle_fetch_hook' },
            ],
          },
          {
            text: 'Others',
            collapsed: true,
            items: [
              { text: 'TOTP - One-time password generator', link: '/src/ranuts/utils/totp' },
              { text: 'createSignal - Create reactive signal', link: '/src/ranuts/utils/create_signal' },
              { text: 'setMime - Set MIME type', link: '/src/ranuts/utils/set_mime' },
              { text: 'getExtensions - Get extensions', link: '/src/ranuts/utils/get_extensions' },
              { text: 'setAttributeByGlobal - Global attribute', link: '/src/ranuts/utils/set_attribute_by_global' },
              { text: 'SyncHook - Sync event hook', link: '/src/ranuts/utils/sync_hook' },
              { text: 'durationHandler - Delayed execution', link: '/src/ranuts/utils/duration_handler' },
              { text: 'task - Statistical execution time', link: '/src/ranuts/utils/task' },
            ],
          },
        ],
      },
      {
        text: 'File Operations',
        collapsed: true,
        items: [
          { text: 'writeFile - Write to file', link: '/src/ranuts/file/write_file' },
          { text: 'readFile - Read file', link: '/src/ranuts/file/read_file' },
          { text: 'readDir - Read directory', link: '/src/ranuts/file/read_dir' },
          { text: 'watchFile - Watch file changes', link: '/src/ranuts/file/watch_file' },
          { text: 'queryFileInfo - Query file info', link: '/src/ranuts/file/file_info' },
          { text: 'appendFile - Append to file', link: '/src/ranuts/file/append_file' },
        ],
      },
      {
        text: 'MIME Type',
        collapsed: true,
        items: [{ text: 'getMime - Get MIME type', link: '/src/ranuts/mime_type/mime_type' }],
      },
      {
        text: '2D Rendering (visual)',
        collapsed: true,
        items: [{ text: 'Rendering engine', link: '/src/ranuts/visual/' }],
      },
      {
        text: 'Virtual DOM (vnode)',
        collapsed: true,
        items: [{ text: 'Virtual DOM', link: '/src/ranuts/vnode/' }],
      },
      {
        text: 'Node Server',
        collapsed: true,
        items: [{ text: 'HTTP server & router', link: '/src/ranuts/node/' }],
      },
      {
        text: 'Bridge (postMessage)',
        collapsed: true,
        items: [{ text: 'Cross-context messaging', link: '/src/ranuts/bridge/' }],
      },
      {
        text: 'Others',
        collapsed: true,
        items: [
          { text: 'Binary Tree', link: '/src/ranuts/binary_tree/' },
          { text: 'Bundler', link: '/src/ranuts/bundler/' },
        ],
      },
    ],
    '/src/ranui/': [
      {
        text: 'Overview ',
        link: '/src/ranui/',
      },
      {
        text: 'Foundations',
        items: [
          { text: 'Theme & Tokens', link: '/src/ranui/theme/' },
          { text: 'ThemeSwitch', link: '/src/ranui/theme-switch/' },
          { text: 'i18n', link: '/src/ranui/i18n/' },
        ],
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
          { text: 'Math', link: '/src/ranui/math/' },
          { text: 'Mermaid', link: '/src/ranui/mermaid/' },
          { text: 'CheckBox', link: '/src/ranui/checkbox/' },
          { text: 'Tabs', link: '/src/ranui/tab/' },
          { text: 'Preview', link: '/src/ranui/preview/' },
          { text: 'Radar', link: '/src/ranui/radar/' },
          { text: 'Select', link: '/src/ranui/select/' },
          { text: 'Player', link: '/src/ranui/player/' },
          { text: 'Progress', link: '/src/ranui/progress/' },
          { text: 'Popover', link: '/src/ranui/popover/' },
          { text: 'Dropdown', link: '/src/ranui/dropdown/' },
          { text: 'Card', link: '/src/ranui/card/' },
          { text: 'Glass', link: '/src/ranui/glass/' },
          { text: 'Section', link: '/src/ranui/section/' },
          { text: 'Scratch', link: '/src/ranui/scratch/' },
        ],
      },
      {
        text: 'Data Entry',
        items: [
          { text: 'Input', link: '/src/ranui/input/' },
          { text: 'Form', link: '/src/ranui/form/' },
          { text: 'ColorPicker', link: '/src/ranui/colorpicker/' },
        ],
      },
      {
        text: 'Feedback',
        items: [
          { text: 'Message', link: '/src/ranui/message/' },
          { text: 'Skeleton', link: '/src/ranui/skeleton/' },
          { text: 'Modal', link: '/src/ranui/modal/' },
        ],
      },
      {
        text: 'Navigation',
        items: [
          { text: 'Router', link: '/src/ranui/router/' },
          { text: 'Route', link: '/src/ranui/route/' },
          { text: 'Link', link: '/src/ranui/link/' },
        ],
      },
    ],
    '/src/article/': articleEnSidebar,
    '/src/blockchain/': articleEnSidebar,
    '/src/note/': articleEnSidebar,
  },
};

export { themeEnConfig };
