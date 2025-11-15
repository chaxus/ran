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
        text: 'Utility Functions',
        link: '/src/ranuts/utils/',
        collapsed: false,
        items: [
          {
            text: 'Functional Programming',
            collapsed: true,
            items: [
              { text: 'debounce - Debounce function', link: '/src/ranuts/utils/debounce.md' },
              { text: 'throttle - Throttle function', link: '/src/ranuts/utils/throttle.md' },
              { text: 'memoize - Memoization function', link: '/src/ranuts/utils/memoize.md' },
              { text: 'noop - No-op function', link: '/src/ranuts/utils/noop.md' },
              { text: 'compose - Compose middleware', link: '/src/ranuts/utils/compose.md' },
            ],
          },
          {
            text: 'String Processing',
            collapsed: true,
            items: [
              { text: 'md5 - MD5 hash function', link: '/src/ranuts/utils/md5.md' },
              { text: 'randomString - Generate random string', link: '/src/ranuts/utils/random_string.md' },
              { text: 'clearBr - Remove spaces and line breaks', link: '/src/ranuts/utils/clear_br.md' },
              { text: 'clearStr - Remove leading/trailing spaces', link: '/src/ranuts/utils/clear_str.md' },
              { text: 'strParse - Parse string to object', link: '/src/ranuts/utils/str_parse.md' },
              { text: 'toString - Convert to string', link: '/src/ranuts/utils/to_string.md' },
              { text: 'transformText - ArrayBuffer to text', link: '/src/ranuts/utils/transform_text.md' },
              { text: 'checkEncoding - Detect encoding', link: '/src/ranuts/utils/check_encoding.md' },
              {
                text: 'changeHumpToLowerCase - Camel to snake',
                link: '/src/ranuts/utils/change_hump_to_lower_case.md',
              },
              { text: 'getMatchingSentences - Extract sentences', link: '/src/ranuts/utils/get_matching_sentences.md' },
              { text: 'isString - Check if string', link: '/src/ranuts/utils/is_string.md' },
              { text: 'str2Xml - String to XML', link: '/src/ranuts/utils/str2xml.md' },
            ],
          },
          {
            text: 'Object Processing',
            collapsed: true,
            items: [
              { text: 'merge - Merge objects', link: '/src/ranuts/utils/merge.md' },
              { text: 'isEqual - Deep comparison', link: '/src/ranuts/utils/is_equal.md' },
              { text: 'cloneDeep - Deep clone', link: '/src/ranuts/utils/clone_deep.md' },
              { text: 'querystring - Object to query string', link: '/src/ranuts/utils/querystring.md' },
              { text: 'filterObj - Filter object', link: '/src/ranuts/utils/filter_obj.md' },
              { text: 'formatJson - Format JSON', link: '/src/ranuts/utils/format_json.md' },
            ],
          },
          {
            text: 'Number Processing',
            collapsed: true,
            items: [
              { text: 'range - Clamp number range', link: '/src/ranuts/utils/range.md' },
              { text: 'mathjs - Precise calculation', link: '/src/ranuts/utils/mathjs.md' },
              { text: 'perToNum - Percentage to number', link: '/src/ranuts/utils/per_to_num.md' },
              { text: 'transformNumber - Format number', link: '/src/ranuts/utils/transform_number.md' },
              { text: 'addNumSym - Add sign to number', link: '/src/ranuts/utils/add_num_sym.md' },
            ],
          },
          {
            text: 'Color Processing',
            collapsed: true,
            items: [
              { text: 'hexToRgb - Hex to RGB', link: '/src/ranuts/utils/hex_to_rgb.md' },
              { text: 'rgbToHex - RGB to hex', link: '/src/ranuts/utils/rgb_to_hex.md' },
              { text: 'randomColor - Generate random color', link: '/src/ranuts/utils/random_color.md' },
            ],
          },
          {
            text: 'Time Processing',
            collapsed: true,
            items: [
              { text: 'timeFormat - Format time', link: '/src/ranuts/utils/time_format.md' },
              { text: 'timestampToTime - Timestamp to Date', link: '/src/ranuts/utils/timestamp_to_time.md' },
              { text: 'performanceTime - High precision timestamp', link: '/src/ranuts/utils/performance_time.md' },
            ],
          },
          {
            text: 'Device Detection',
            collapsed: true,
            items: [
              { text: 'isMobile - Check mobile device', link: '/src/ranuts/utils/is_mobile.md' },
              { text: 'isWeiXin - Check WeChat browser', link: '/src/ranuts/utils/is_weixin.md' },
              { text: 'isClient - Check client environment', link: '/src/ranuts/utils/is_client.md' },
              { text: 'isSafari - Check Safari browser', link: '/src/ranuts/utils/is_safari.md' },
              { text: 'isBangDevice - Check notch device', link: '/src/ranuts/utils/is_bang_device.md' },
              { text: 'currentDevice - Get device type', link: '/src/ranuts/utils/current_device.md' },
            ],
          },
          {
            text: 'DOM Manipulation',
            collapsed: true,
            items: [
              { text: 'addClassToElement - Add class', link: '/src/ranuts/utils/add_class_to_element.md' },
              { text: 'removeClassToElement - Remove class', link: '/src/ranuts/utils/remove_class_to_element.md' },
              {
                text: 'createDocumentFragment - Create fragment',
                link: '/src/ranuts/utils/create_document_fragment.md',
              },
              { text: 'escapeHtml - Escape HTML', link: '/src/ranuts/utils/escape_html.md' },
              { text: 'Chain - Chainable DOM', link: '/src/ranuts/utils/chain.md' },
              { text: 'create - Create DOM element', link: '/src/ranuts/utils/create.md' },
            ],
          },
          {
            text: 'Storage',
            collapsed: true,
            items: [
              { text: 'localStorageGetItem - Get storage', link: '/src/ranuts/utils/local_storage.md' },
              { text: 'localStorageSetItem - Set storage', link: '/src/ranuts/utils/local_storage.md' },
            ],
          },
          {
            text: 'URL/Query',
            collapsed: true,
            items: [
              { text: 'getAllQueryString - Extract query', link: '/src/ranuts/utils/get_all_query_string.md' },
              { text: 'getQuery - Extract query', link: '/src/ranuts/utils/get_query.md' },
              { text: 'encodeUrl - Encode URL safely', link: '/src/ranuts/utils/encode_url.md' },
              { text: 'appendUrl - Append query params', link: '/src/ranuts/utils/append_url.md' },
            ],
          },
          {
            text: 'Cookie',
            collapsed: true,
            items: [
              { text: 'getCookie - Get cookie', link: '/src/ranuts/utils/get_cookie.md' },
              { text: 'getCookieByName - Get cookie by regex', link: '/src/ranuts/utils/get_cookie_by_name.md' },
            ],
          },
          {
            text: 'Image Processing',
            collapsed: true,
            items: [
              { text: 'convertImageToBase64 - Image to Base64', link: '/src/ranuts/utils/convert_image_to_base64.md' },
              { text: 'isImageSize - Validate image size', link: '/src/ranuts/utils/is_image_size.md' },
            ],
          },
          {
            text: 'Performance',
            collapsed: true,
            items: [
              { text: 'getPerformance - Get performance metrics', link: '/src/ranuts/utils/get_performance.md' },
              { text: 'getFrame - Calculate frame rate', link: '/src/ranuts/utils/get_frame.md' },
              { text: 'getPixelRatio - Get resolution ratio', link: '/src/ranuts/utils/get_pixel_ratio.md' },
            ],
          },
          {
            text: 'Network',
            collapsed: true,
            items: [
              { text: 'imageRequest - Test network latency', link: '/src/ranuts/utils/image_request.md' },
              { text: 'networkSpeed - Test network speed', link: '/src/ranuts/utils/network_speed.md' },
              { text: 'connection - Get network info', link: '/src/ranuts/utils/connection.md' },
            ],
          },
          {
            text: 'Browser',
            collapsed: true,
            items: [
              { text: 'getWindow - Get window size', link: '/src/ranuts/utils/get_window.md' },
              { text: 'getHost - Get host address', link: '/src/ranuts/utils/get_host.md' },
              { text: 'createObjectURL - Create object URL', link: '/src/ranuts/utils/create_object_url.md' },
              { text: 'removeGhosting - Remove drag shadow', link: '/src/ranuts/utils/remove_ghosting.md' },
              { text: 'retain - Override back event', link: '/src/ranuts/utils/retain.md' },
            ],
          },
          {
            text: 'Script Loading',
            collapsed: true,
            items: [{ text: 'scriptOnLoad - Dynamic script loading', link: '/src/ranuts/utils/script_on_load.md' }],
          },
          {
            text: 'Error Handling',
            collapsed: true,
            items: [
              { text: 'handleConsole - Intercept console', link: '/src/ranuts/utils/handle_console.md' },
              { text: 'handleError - Global error handling', link: '/src/ranuts/utils/handle_error.md' },
              { text: 'handleFetchHook - Intercept fetch', link: '/src/ranuts/utils/handle_fetch_hook.md' },
            ],
          },
          {
            text: 'Others',
            collapsed: true,
            items: [
              { text: 'TOTP - One-time password generator', link: '/src/ranuts/utils/totp.md' },
              { text: 'OCR - Text recognition', link: '/src/ranuts/utils/ocr.md' },
              { text: 'createSignal - Create reactive signal', link: '/src/ranuts/utils/create_signal.md' },
              { text: 'setMime - Set MIME type', link: '/src/ranuts/utils/set_mime.md' },
              { text: 'getExtensions - Get extensions', link: '/src/ranuts/utils/get_extensions.md' },
              { text: 'setAttributeByGlobal - Global attribute', link: '/src/ranuts/utils/set_attribute_by_global.md' },
              { text: 'SyncHook - Sync event hook', link: '/src/ranuts/utils/sync_hook.md' },
              { text: 'durationHandler - Delayed execution', link: '/src/ranuts/utils/duration_handler.md' },
              { text: 'task - Statistical execution time', link: '/src/ranuts/utils/task.md' },
            ],
          },
        ],
      },
      {
        text: 'File Operations',
        collapsed: true,
        items: [
          { text: 'writeFile - Write to file', link: '/src/ranuts/file/write_file.md' },
          { text: 'readFile - Read file', link: '/src/ranuts/file/read_file.md' },
          { text: 'readDir - Read directory', link: '/src/ranuts/file/read_dir.md' },
          { text: 'watchFile - Watch file changes', link: '/src/ranuts/file/watch_file.md' },
          { text: 'queryFileInfo - Query file info', link: '/src/ranuts/file/file_info.md' },
          { text: 'appendFile - Append to file', link: '/src/ranuts/file/append_file.md' },
        ],
      },
      {
        text: 'Event System',
        collapsed: true,
        items: [{ text: 'EventEmitter - Publish-subscribe', link: '/src/ranuts/mode/subscribe.md' }],
      },
      {
        text: 'MIME Type',
        collapsed: true,
        items: [{ text: 'getMime - Get MIME type', link: '/src/ranuts/mime_type/mime_type.md' }],
      },
      {
        text: 'Others',
        collapsed: true,
        items: [
          { text: 'Binary Tree', link: '/src/ranuts/binary_tree/index.md' },
          { text: 'Bundler', link: '/src/ranuts/bundler/index.md' },
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
