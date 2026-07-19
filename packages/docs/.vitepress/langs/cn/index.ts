import type { DefaultTheme } from 'vitepress';
import { GITHUB, EDITOR } from '../../common/index';

const themeCnConfig: DefaultTheme.Config = {
  logo: '/home.svg',
  search: {
    provider: 'local',
  },
  nav: [
    { text: '首页', link: '/cn/' },
    { text: '文章', link: '/cn/src/article/design_mode' },
    { text: '文档编辑器', link: EDITOR },
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
    '/cn/src/ranuts/': [
      {
        text: '总览',
        link: '/cn/src/ranuts/',
      },
      {
        text: '工具函数',
        link: '/cn/src/ranuts/utils/',
        collapsed: false,
        items: [
          {
            text: '函数式编程',
            collapsed: true,
            items: [
              { text: 'debounce - 防抖函数', link: '/cn/src/ranuts/utils/debounce' },
              { text: 'throttle - 节流函数', link: '/cn/src/ranuts/utils/throttle' },
              { text: 'memoize - 记忆化函数', link: '/cn/src/ranuts/utils/memoize' },
              { text: 'noop - 空函数', link: '/cn/src/ranuts/utils/noop' },
              { text: 'compose - 组合中间件函数', link: '/cn/src/ranuts/utils/compose' },
            ],
          },
          {
            text: '字符串处理',
            collapsed: true,
            items: [
              { text: 'md5 - MD5 哈希函数', link: '/cn/src/ranuts/utils/md5' },
              { text: 'randomString - 生成随机字符串', link: '/cn/src/ranuts/utils/random_string' },
              { text: 'clearBr - 清除空格和换行', link: '/cn/src/ranuts/utils/clear_br' },
              { text: 'clearStr - 去除首尾空格和引号', link: '/cn/src/ranuts/utils/clear_str' },
              { text: 'strParse - 字符串解析为对象', link: '/cn/src/ranuts/utils/str_parse' },
              { text: 'toString - 转换为字符串', link: '/cn/src/ranuts/utils/to_string' },
              { text: 'transformText - ArrayBuffer 转文本', link: '/cn/src/ranuts/utils/transform_text' },
              { text: 'checkEncoding - 检测字符编码', link: '/cn/src/ranuts/utils/check_encoding' },
              {
                text: 'changeHumpToLowerCase - 驼峰转下划线',
                link: '/cn/src/ranuts/utils/change_hump_to_lower_case',
              },
              { text: 'getMatchingSentences - 提取匹配句子', link: '/cn/src/ranuts/utils/get_matching_sentences' },
              { text: 'isString - 判断是否为字符串', link: '/cn/src/ranuts/utils/is_string' },
              { text: 'str2Xml - 字符串转 XML', link: '/cn/src/ranuts/utils/str2xml' },
            ],
          },
          {
            text: '对象处理',
            collapsed: true,
            items: [
              { text: 'merge - 合并对象', link: '/cn/src/ranuts/utils/merge' },
              { text: 'isEqual - 深度比较', link: '/cn/src/ranuts/utils/is_equal' },
              { text: 'cloneDeep - 深度克隆', link: '/cn/src/ranuts/utils/clone_deep' },
              { text: 'querystring - 对象转查询字符串', link: '/cn/src/ranuts/utils/querystring' },
              { text: 'filterObj - 过滤对象', link: '/cn/src/ranuts/utils/filter_obj' },
              { text: 'formatJson - 格式化 JSON', link: '/cn/src/ranuts/utils/format_json' },
            ],
          },
          {
            text: '数字处理',
            collapsed: true,
            items: [
              { text: 'range - 限制数字范围', link: '/cn/src/ranuts/utils/range' },
              { text: 'mathjs - 精确数字运算', link: '/cn/src/ranuts/utils/mathjs' },
              { text: 'perToNum - 百分比转数字', link: '/cn/src/ranuts/utils/per_to_num' },
              { text: 'transformNumber - 数字格式化', link: '/cn/src/ranuts/utils/transform_number' },
              { text: 'addNumSym - 添加正负号', link: '/cn/src/ranuts/utils/add_num_sym' },
            ],
          },
          {
            text: '颜色处理',
            collapsed: true,
            items: [
              { text: 'hexToRgb - 十六进制转 RGB', link: '/cn/src/ranuts/utils/hex_to_rgb' },
              { text: 'rgbToHex - RGB 转十六进制', link: '/cn/src/ranuts/utils/rgb_to_hex' },
              { text: 'randomColor - 生成随机颜色', link: '/cn/src/ranuts/utils/random_color' },
              { text: 'Color - 颜色类与转换', link: '/cn/src/ranuts/utils/color' },
            ],
          },
          {
            text: '时间处理',
            collapsed: true,
            items: [
              { text: 'timeFormat - 时间格式化', link: '/cn/src/ranuts/utils/time_format' },
              { text: 'timestampToTime - 时间戳转 Date', link: '/cn/src/ranuts/utils/timestamp_to_time' },
              { text: 'performanceTime - 高精度时间戳', link: '/cn/src/ranuts/utils/performance_time' },
            ],
          },
          {
            text: '设备检测',
            collapsed: true,
            items: [
              { text: 'isMobile - 判断移动端', link: '/cn/src/ranuts/utils/is_mobile' },
              { text: 'isWeiXin - 判断微信浏览器', link: '/cn/src/ranuts/utils/is_weixin' },
              { text: 'isClient - 判断客户端环境', link: '/cn/src/ranuts/utils/is_client' },
              { text: 'isSafari - 判断 Safari', link: '/cn/src/ranuts/utils/is_safari' },
              { text: 'isBangDevice - 判断刘海屏', link: '/cn/src/ranuts/utils/is_bang_device' },
              { text: 'currentDevice - 获取设备类型', link: '/cn/src/ranuts/utils/current_device' },
            ],
          },
          {
            text: 'DOM 操作',
            collapsed: true,
            items: [
              { text: 'addClassToElement - 添加类名', link: '/cn/src/ranuts/utils/add_class_to_element' },
              { text: 'removeClassToElement - 移除类名', link: '/cn/src/ranuts/utils/remove_class_to_element' },
              {
                text: 'createDocumentFragment - 创建文档片段',
                link: '/cn/src/ranuts/utils/create_document_fragment',
              },
              { text: 'escapeHtml - 转义 HTML', link: '/cn/src/ranuts/utils/escape_html' },
              { text: 'Chain - 链式 DOM 操作', link: '/cn/src/ranuts/utils/chain' },
              { text: 'create - 创建 DOM 元素', link: '/cn/src/ranuts/utils/create' },
            ],
          },
          {
            text: '存储',
            collapsed: true,
            items: [
              { text: 'localStorageGetItem - 获取存储值', link: '/cn/src/ranuts/utils/local_storage' },
              { text: 'localStorageSetItem - 设置存储值', link: '/cn/src/ranuts/utils/local_storage' },
            ],
          },
          {
            text: 'URL/Query',
            collapsed: true,
            items: [
              { text: 'getAllQueryString - 提取查询参数', link: '/cn/src/ranuts/utils/get_all_query_string' },
              { text: 'getQuery - 提取查询参数', link: '/cn/src/ranuts/utils/get_query' },
              { text: 'encodeUrl - 安全编码 URL', link: '/cn/src/ranuts/utils/encode_url' },
              { text: 'appendUrl - 拼接查询参数', link: '/cn/src/ranuts/utils/append_url' },
            ],
          },
          {
            text: 'Cookie',
            collapsed: true,
            items: [
              { text: 'getCookie - 获取 Cookie', link: '/cn/src/ranuts/utils/get_cookie' },
              { text: 'getCookieByName - 正则获取 Cookie', link: '/cn/src/ranuts/utils/get_cookie_by_name' },
            ],
          },
          {
            text: '图片处理',
            collapsed: true,
            items: [
              { text: 'convertImageToBase64 - 图片转 Base64', link: '/cn/src/ranuts/utils/convert_image_to_base64' },
              { text: 'isImageSize - 校验图片尺寸', link: '/cn/src/ranuts/utils/is_image_size' },
            ],
          },
          {
            text: '性能',
            collapsed: true,
            items: [
              { text: 'getPerformance - 获取性能指标', link: '/cn/src/ranuts/utils/get_performance' },
              { text: 'getFrame - 计算帧率', link: '/cn/src/ranuts/utils/get_frame' },
              { text: 'getPixelRatio - 获取分辨率比例', link: '/cn/src/ranuts/utils/get_pixel_ratio' },
            ],
          },
          {
            text: '网络',
            collapsed: true,
            items: [
              { text: 'imageRequest - 测试网络延迟', link: '/cn/src/ranuts/utils/image_request' },
              { text: 'networkSpeed - 测试网络速度', link: '/cn/src/ranuts/utils/network_speed' },
              { text: 'connection - 获取网络连接信息', link: '/cn/src/ranuts/utils/connection' },
            ],
          },
          {
            text: '浏览器',
            collapsed: true,
            items: [
              { text: 'getWindow - 获取窗口大小', link: '/cn/src/ranuts/utils/get_window' },
              { text: 'getHost - 获取主机地址', link: '/cn/src/ranuts/utils/get_host' },
              { text: 'createObjectURL - 创建对象 URL', link: '/cn/src/ranuts/utils/create_object_url' },
              { text: 'removeGhosting - 移除拖拽阴影', link: '/cn/src/ranuts/utils/remove_ghosting' },
              { text: 'retain - 覆盖后退事件', link: '/cn/src/ranuts/utils/retain' },
            ],
          },
          {
            text: '脚本加载',
            collapsed: true,
            items: [{ text: 'scriptOnLoad - 动态加载脚本', link: '/cn/src/ranuts/utils/script_on_load' }],
          },
          {
            text: '错误处理',
            collapsed: true,
            items: [
              { text: 'handleConsole - 拦截 console', link: '/cn/src/ranuts/utils/handle_console' },
              { text: 'handleError - 全局错误处理', link: '/cn/src/ranuts/utils/handle_error' },
              { text: 'handleFetchHook - 拦截 fetch', link: '/cn/src/ranuts/utils/handle_fetch_hook' },
            ],
          },
          {
            text: '其他',
            collapsed: true,
            items: [
              { text: 'TOTP - 一次性密码生成器', link: '/cn/src/ranuts/utils/totp' },
              { text: 'createSignal - 创建响应式信号', link: '/cn/src/ranuts/utils/create_signal' },
              { text: 'setMime - 设置 MIME 类型', link: '/cn/src/ranuts/utils/set_mime' },
              { text: 'getExtensions - 获取扩展名', link: '/cn/src/ranuts/utils/get_extensions' },
              { text: 'setAttributeByGlobal - 全局属性', link: '/cn/src/ranuts/utils/set_attribute_by_global' },
              { text: 'SyncHook - 同步事件钩子', link: '/cn/src/ranuts/utils/sync_hook' },
              { text: 'durationHandler - 延迟执行', link: '/cn/src/ranuts/utils/duration_handler' },
              { text: 'task - 统计执行时间', link: '/cn/src/ranuts/utils/task' },
            ],
          },
        ],
      },
      {
        text: '文件操作',
        collapsed: true,
        items: [
          { text: 'writeFile - 写入文件', link: '/cn/src/ranuts/file/write_file' },
          { text: 'readFile - 读取文件', link: '/cn/src/ranuts/file/read_file' },
          { text: 'readDir - 读取目录', link: '/cn/src/ranuts/file/read_dir' },
          { text: 'watchFile - 监听文件变化', link: '/cn/src/ranuts/file/watch_file' },
          { text: 'queryFileInfo - 查询文件信息', link: '/cn/src/ranuts/file/file_info' },
          { text: 'appendFile - 追加文件内容', link: '/cn/src/ranuts/file/append_file' },
        ],
      },
      {
        text: 'MIME 类型',
        collapsed: true,
        items: [{ text: 'getMime - 获取 MIME 类型', link: '/cn/src/ranuts/mime_type/mime_type' }],
      },
      {
        text: '2D 渲染引擎 (visual)',
        collapsed: true,
        items: [{ text: '渲染引擎', link: '/cn/src/ranuts/visual/' }],
      },
      {
        text: '虚拟 DOM (vnode)',
        collapsed: true,
        items: [{ text: '虚拟 DOM', link: '/cn/src/ranuts/vnode/' }],
      },
      {
        text: 'Node 服务',
        collapsed: true,
        items: [{ text: 'HTTP 服务与路由', link: '/cn/src/ranuts/node/' }],
      },
      {
        text: 'Bridge 跨上下文通信',
        collapsed: true,
        items: [{ text: 'postMessage 桥接', link: '/cn/src/ranuts/bridge/' }],
      },
      {
        text: '其他',
        collapsed: true,
        items: [
          { text: '二叉树', link: '/cn/src/ranuts/binary_tree/' },
          { text: '打包器', link: '/cn/src/ranuts/bundler/' },
        ],
      },
    ],
    '/cn/src/ranui/': [
      {
        text: 'Overview 总览',
        link: '/cn/src/ranui/',
      },
      {
        text: '基础能力',
        items: [
          { text: 'Theme 主题与令牌', link: '/cn/src/ranui/theme/' },
          { text: 'ThemeSwitch 主题切换', link: '/cn/src/ranui/theme-switch/' },
          { text: 'i18n 国际化', link: '/cn/src/ranui/i18n/' },
        ],
      },
      {
        text: '通用',
        items: [
          { text: 'Button 按钮', link: '/cn/src/ranui/button/' },
          { text: 'Icon 图标', link: '/cn/src/ranui/icon/' },
          { text: 'Loading 加载中', link: '/cn/src/ranui/loading/' },
        ],
      },
      {
        text: '数据展示',
        items: [
          { text: 'Image 图片', link: '/cn/src/ranui/image/' },
          { text: 'Math 数学公式', link: '/cn/src/ranui/math/' },
          { text: 'Mermaid 图表', link: '/cn/src/ranui/mermaid/' },
          { text: 'CheckBox 多选框', link: '/cn/src/ranui/checkbox/' },
          { text: 'Tabs 标签页', link: '/cn/src/ranui/tab/' },
          { text: 'Preview 预览', link: '/cn/src/ranui/preview/' },
          { text: 'Radar 雷达图', link: '/cn/src/ranui/radar/' },
          { text: 'Select 选择框', link: '/cn/src/ranui/select/' },
          { text: 'Player 视频播放器', link: '/cn/src/ranui/player/' },
          { text: 'Progress 进度条', link: '/cn/src/ranui/progress/' },
          { text: 'Popover 气泡卡片', link: '/cn/src/ranui/popover/' },
          { text: 'Dropdown 下拉面板', link: '/cn/src/ranui/dropdown/' },
          { text: 'Card 卡片', link: '/cn/src/ranui/card/' },
          { text: 'Glass 毛玻璃', link: '/cn/src/ranui/glass/' },
          { text: 'Section 区块', link: '/cn/src/ranui/section/' },
          { text: 'Scratch 刮刮卡', link: '/cn/src/ranui/scratch/' },
        ],
      },
      {
        text: '数据录入',
        items: [
          { text: 'Input 输入框', link: '/cn/src/ranui/input/' },
          { text: 'Form 表单', link: '/cn/src/ranui/form/' },
          { text: 'ColorPicker 颜色选择器', link: '/cn/src/ranui/colorpicker/' },
        ],
      },
      {
        text: '反馈',
        items: [
          { text: 'Message 全局提示', link: '/cn/src/ranui/message/' },
          { text: 'Skeleton 骨架屏', link: '/cn/src/ranui/skeleton/' },
          { text: 'Modal 对话框', link: '/cn/src/ranui/modal/' },
        ],
      },
      {
        text: '导航',
        items: [
          { text: 'Router 路由', link: '/cn/src/ranui/router/' },
          { text: 'Route 路由出口', link: '/cn/src/ranui/route/' },
          { text: 'Link 链接', link: '/cn/src/ranui/link/' },
        ],
      },
    ],
    '/cn/src/article/': [
      {
        items: [
          { text: '23 种经典设计模式', link: '/cn/src/article/design_mode' },
          {
            text: '函数式编程',
            link: '/cn/src/article/functional_programming',
          },
          {
            text: 'web 文档预览方案',
            link: '/cn/src/article/doc_preview',
          },
          {
            text: 'Web 视频加密动态方案',
            link: '/cn/src/article/video',
          },
          {
            text: '可视化渲染引擎',
            link: '/cn/src/article/visual',
          },
          {
            text: '排序算法',
            link: '/cn/src/article/sort/',
            collapsed: true,
            items: [
              { text: '冒泡排序', link: '/cn/src/article/sort/bubble/' },
              { text: '选择排序', link: '/cn/src/article/sort/select/' },
              { text: '插入排序', link: '/cn/src/article/sort/insert/' },
              { text: '希尔排序', link: '/cn/src/article/sort/shell/' },
              { text: '归并排序', link: '/cn/src/article/sort/merge/' },
              { text: '快速排序', link: '/cn/src/article/sort/quick/' },
              { text: '堆排序', link: '/cn/src/article/sort/heap/' },
              { text: '计数排序', link: '/cn/src/article/sort/count/' },
              { text: '桶排序', link: '/cn/src/article/sort/bucket/' },
              { text: '基数排序', link: '/cn/src/article/sort/radix/' },
            ],
          },
          {
            text: '数学',
            collapsed: true,
            items: [{ text: '线性代数', link: '/cn/src/article/math/linear_algebra' }],
          },
        ],
      },
    ],
  },
};

export { themeCnConfig };
