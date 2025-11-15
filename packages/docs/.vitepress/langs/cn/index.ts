import type { DefaultTheme } from 'vitepress';
import { GITHUB } from '../../common/index';

const themeCnConfig: DefaultTheme.Config = {
  logo: '/home.svg',
  search: {
    provider: 'local',
  },
  nav: [
    { text: '首页', link: '/cn/' },
    { text: '函数', link: '/cn/src/ranuts/' },
    { text: '组件', link: '/cn/src/ranui/' },
    { text: '璀璨', link: '/cn/src/article/design_mode.md' },
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
              { text: 'debounce - 防抖函数', link: '/cn/src/ranuts/utils/debounce.md' },
              { text: 'throttle - 节流函数', link: '/cn/src/ranuts/utils/throttle.md' },
              { text: 'memoize - 记忆化函数', link: '/cn/src/ranuts/utils/memoize.md' },
              { text: 'noop - 空函数', link: '/cn/src/ranuts/utils/noop.md' },
              { text: 'compose - 组合中间件函数', link: '/cn/src/ranuts/utils/compose.md' },
            ],
          },
          {
            text: '字符串处理',
            collapsed: true,
            items: [
              { text: 'md5 - MD5 哈希函数', link: '/cn/src/ranuts/utils/md5.md' },
              { text: 'randomString - 生成随机字符串', link: '/cn/src/ranuts/utils/random_string.md' },
              { text: 'clearBr - 清除空格和换行', link: '/cn/src/ranuts/utils/clear_br.md' },
              { text: 'clearStr - 去除首尾空格和引号', link: '/cn/src/ranuts/utils/clear_str.md' },
              { text: 'strParse - 字符串解析为对象', link: '/cn/src/ranuts/utils/str_parse.md' },
              { text: 'toString - 转换为字符串', link: '/cn/src/ranuts/utils/to_string.md' },
              { text: 'transformText - ArrayBuffer 转文本', link: '/cn/src/ranuts/utils/transform_text.md' },
              { text: 'checkEncoding - 检测字符编码', link: '/cn/src/ranuts/utils/check_encoding.md' },
              {
                text: 'changeHumpToLowerCase - 驼峰转下划线',
                link: '/cn/src/ranuts/utils/change_hump_to_lower_case.md',
              },
              { text: 'getMatchingSentences - 提取匹配句子', link: '/cn/src/ranuts/utils/get_matching_sentences.md' },
              { text: 'isString - 判断是否为字符串', link: '/cn/src/ranuts/utils/is_string.md' },
              { text: 'str2Xml - 字符串转 XML', link: '/cn/src/ranuts/utils/str2xml.md' },
            ],
          },
          {
            text: '对象处理',
            collapsed: true,
            items: [
              { text: 'merge - 合并对象', link: '/cn/src/ranuts/utils/merge.md' },
              { text: 'isEqual - 深度比较', link: '/cn/src/ranuts/utils/is_equal.md' },
              { text: 'cloneDeep - 深度克隆', link: '/cn/src/ranuts/utils/clone_deep.md' },
              { text: 'querystring - 对象转查询字符串', link: '/cn/src/ranuts/utils/querystring.md' },
              { text: 'filterObj - 过滤对象', link: '/cn/src/ranuts/utils/filter_obj.md' },
              { text: 'formatJson - 格式化 JSON', link: '/cn/src/ranuts/utils/format_json.md' },
            ],
          },
          {
            text: '数字处理',
            collapsed: true,
            items: [
              { text: 'range - 限制数字范围', link: '/cn/src/ranuts/utils/range.md' },
              { text: 'mathjs - 精确数字运算', link: '/cn/src/ranuts/utils/mathjs.md' },
              { text: 'perToNum - 百分比转数字', link: '/cn/src/ranuts/utils/per_to_num.md' },
              { text: 'transformNumber - 数字格式化', link: '/cn/src/ranuts/utils/transform_number.md' },
              { text: 'addNumSym - 添加正负号', link: '/cn/src/ranuts/utils/add_num_sym.md' },
            ],
          },
          {
            text: '颜色处理',
            collapsed: true,
            items: [
              { text: 'hexToRgb - 十六进制转 RGB', link: '/cn/src/ranuts/utils/hex_to_rgb.md' },
              { text: 'rgbToHex - RGB 转十六进制', link: '/cn/src/ranuts/utils/rgb_to_hex.md' },
              { text: 'randomColor - 生成随机颜色', link: '/cn/src/ranuts/utils/random_color.md' },
            ],
          },
          {
            text: '时间处理',
            collapsed: true,
            items: [
              { text: 'timeFormat - 时间格式化', link: '/cn/src/ranuts/utils/time_format.md' },
              { text: 'timestampToTime - 时间戳转 Date', link: '/cn/src/ranuts/utils/timestamp_to_time.md' },
              { text: 'performanceTime - 高精度时间戳', link: '/cn/src/ranuts/utils/performance_time.md' },
            ],
          },
          {
            text: '设备检测',
            collapsed: true,
            items: [
              { text: 'isMobile - 判断移动端', link: '/cn/src/ranuts/utils/is_mobile.md' },
              { text: 'isWeiXin - 判断微信浏览器', link: '/cn/src/ranuts/utils/is_weixin.md' },
              { text: 'isClient - 判断客户端环境', link: '/cn/src/ranuts/utils/is_client.md' },
              { text: 'isSafari - 判断 Safari', link: '/cn/src/ranuts/utils/is_safari.md' },
              { text: 'isBangDevice - 判断刘海屏', link: '/cn/src/ranuts/utils/is_bang_device.md' },
              { text: 'currentDevice - 获取设备类型', link: '/cn/src/ranuts/utils/current_device.md' },
            ],
          },
          {
            text: 'DOM 操作',
            collapsed: true,
            items: [
              { text: 'addClassToElement - 添加类名', link: '/cn/src/ranuts/utils/add_class_to_element.md' },
              { text: 'removeClassToElement - 移除类名', link: '/cn/src/ranuts/utils/remove_class_to_element.md' },
              {
                text: 'createDocumentFragment - 创建文档片段',
                link: '/cn/src/ranuts/utils/create_document_fragment.md',
              },
              { text: 'escapeHtml - 转义 HTML', link: '/cn/src/ranuts/utils/escape_html.md' },
              { text: 'Chain - 链式 DOM 操作', link: '/cn/src/ranuts/utils/chain.md' },
              { text: 'create - 创建 DOM 元素', link: '/cn/src/ranuts/utils/create.md' },
            ],
          },
          {
            text: '存储',
            collapsed: true,
            items: [
              { text: 'localStorageGetItem - 获取存储值', link: '/cn/src/ranuts/utils/local_storage.md' },
              { text: 'localStorageSetItem - 设置存储值', link: '/cn/src/ranuts/utils/local_storage.md' },
            ],
          },
          {
            text: 'URL/Query',
            collapsed: true,
            items: [
              { text: 'getAllQueryString - 提取查询参数', link: '/cn/src/ranuts/utils/get_all_query_string.md' },
              { text: 'getQuery - 提取查询参数', link: '/cn/src/ranuts/utils/get_query.md' },
              { text: 'encodeUrl - 安全编码 URL', link: '/cn/src/ranuts/utils/encode_url.md' },
              { text: 'appendUrl - 拼接查询参数', link: '/cn/src/ranuts/utils/append_url.md' },
            ],
          },
          {
            text: 'Cookie',
            collapsed: true,
            items: [
              { text: 'getCookie - 获取 Cookie', link: '/cn/src/ranuts/utils/get_cookie.md' },
              { text: 'getCookieByName - 正则获取 Cookie', link: '/cn/src/ranuts/utils/get_cookie_by_name.md' },
            ],
          },
          {
            text: '图片处理',
            collapsed: true,
            items: [
              { text: 'convertImageToBase64 - 图片转 Base64', link: '/cn/src/ranuts/utils/convert_image_to_base64.md' },
              { text: 'isImageSize - 校验图片尺寸', link: '/cn/src/ranuts/utils/is_image_size.md' },
            ],
          },
          {
            text: '性能',
            collapsed: true,
            items: [
              { text: 'getPerformance - 获取性能指标', link: '/cn/src/ranuts/utils/get_performance.md' },
              { text: 'getFrame - 计算帧率', link: '/cn/src/ranuts/utils/get_frame.md' },
              { text: 'getPixelRatio - 获取分辨率比例', link: '/cn/src/ranuts/utils/get_pixel_ratio.md' },
            ],
          },
          {
            text: '网络',
            collapsed: true,
            items: [
              { text: 'imageRequest - 测试网络延迟', link: '/cn/src/ranuts/utils/image_request.md' },
              { text: 'networkSpeed - 测试网络速度', link: '/cn/src/ranuts/utils/network_speed.md' },
              { text: 'connection - 获取网络连接信息', link: '/cn/src/ranuts/utils/connection.md' },
            ],
          },
          {
            text: '浏览器',
            collapsed: true,
            items: [
              { text: 'getWindow - 获取窗口大小', link: '/cn/src/ranuts/utils/get_window.md' },
              { text: 'getHost - 获取主机地址', link: '/cn/src/ranuts/utils/get_host.md' },
              { text: 'createObjectURL - 创建对象 URL', link: '/cn/src/ranuts/utils/create_object_url.md' },
              { text: 'removeGhosting - 移除拖拽阴影', link: '/cn/src/ranuts/utils/remove_ghosting.md' },
              { text: 'retain - 覆盖后退事件', link: '/cn/src/ranuts/utils/retain.md' },
            ],
          },
          {
            text: '脚本加载',
            collapsed: true,
            items: [{ text: 'scriptOnLoad - 动态加载脚本', link: '/cn/src/ranuts/utils/script_on_load.md' }],
          },
          {
            text: '错误处理',
            collapsed: true,
            items: [
              { text: 'handleConsole - 拦截 console', link: '/cn/src/ranuts/utils/handle_console.md' },
              { text: 'handleError - 全局错误处理', link: '/cn/src/ranuts/utils/handle_error.md' },
              { text: 'handleFetchHook - 拦截 fetch', link: '/cn/src/ranuts/utils/handle_fetch_hook.md' },
            ],
          },
          {
            text: '其他',
            collapsed: true,
            items: [
              { text: 'TOTP - 一次性密码生成器', link: '/cn/src/ranuts/utils/totp.md' },
              { text: 'OCR - 文字识别', link: '/cn/src/ranuts/utils/ocr.md' },
              { text: 'createSignal - 创建响应式信号', link: '/cn/src/ranuts/utils/create_signal.md' },
              { text: 'setMime - 设置 MIME 类型', link: '/cn/src/ranuts/utils/set_mime.md' },
              { text: 'getExtensions - 获取扩展名', link: '/cn/src/ranuts/utils/get_extensions.md' },
              { text: 'setAttributeByGlobal - 全局属性', link: '/cn/src/ranuts/utils/set_attribute_by_global.md' },
              { text: 'SyncHook - 同步事件钩子', link: '/cn/src/ranuts/utils/sync_hook.md' },
              { text: 'durationHandler - 延迟执行', link: '/cn/src/ranuts/utils/duration_handler.md' },
              { text: 'task - 统计执行时间', link: '/cn/src/ranuts/utils/task.md' },
            ],
          },
        ],
      },
      {
        text: '文件操作',
        collapsed: true,
        items: [
          { text: 'writeFile - 写入文件', link: '/cn/src/ranuts/file/write_file.md' },
          { text: 'readFile - 读取文件', link: '/cn/src/ranuts/file/read_file.md' },
          { text: 'readDir - 读取目录', link: '/cn/src/ranuts/file/read_dir.md' },
          { text: 'watchFile - 监听文件变化', link: '/cn/src/ranuts/file/watch_file.md' },
          { text: 'queryFileInfo - 查询文件信息', link: '/cn/src/ranuts/file/file_info.md' },
          { text: 'appendFile - 追加文件内容', link: '/cn/src/ranuts/file/append_file.md' },
        ],
      },
      {
        text: '事件系统',
        collapsed: true,
        items: [{ text: 'EventEmitter - 发布订阅模式', link: '/cn/src/ranuts/mode/subscribe.md' }],
      },
      {
        text: 'MIME 类型',
        collapsed: true,
        items: [{ text: 'getMime - 获取 MIME 类型', link: '/cn/src/ranuts/mime_type/mime_type.md' }],
      },
      {
        text: '其他',
        collapsed: true,
        items: [
          { text: '二叉树', link: '/cn/src/ranuts/binary_tree/index.md' },
          { text: '打包器', link: '/cn/src/ranuts/bundler/index.md' },
        ],
      },
    ],
    '/cn/src/ranui/': [
      {
        text: 'Overview 总览',
        link: '/cn/src/ranui/',
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
          { text: 'CheckBox 多选框', link: '/cn/src/ranui/checkbox/' },
          { text: 'Tabs 标签页', link: '/cn/src/ranui/tabs/' },
          { text: 'Preview 预览', link: '/cn/src/ranui/preview/' },
          { text: 'Radar 雷达图', link: '/cn/src/ranui/radar/' },
          { text: 'Select 选择框', link: '/cn/src/ranui/select/' },
          { text: 'Player 视频播放器', link: '/cn/src/ranui/player/' },
          { text: 'Progress 进度条', link: '/cn/src/ranui/progress/' },
          { text: 'Popover 气泡卡片', link: '/cn/src/ranui/popover/' },
        ],
      },
      {
        text: '数据录入',
        items: [{ text: 'Input 输入框', link: '/cn/src/ranui/input/' }],
      },
      {
        text: '反馈',
        items: [
          { text: 'Message 全局提示', link: '/cn/src/ranui/message/' },
          { text: 'Skeleton 骨架屏', link: '/cn/src/ranui/skeleton/' },
          // { text: 'Modal 对话框', link: '/src/ranui/modal/' },
        ],
      },
    ],
    '/cn/src/article/': [
      {
        items: [
          { text: '23 种经典设计模式', link: '/cn/src/article/design_mode.md' },
          {
            text: '函数式编程',
            link: '/cn/src/article/functional_programming.md',
          },
          {
            text: 'web 文档预览方案',
            link: '/cn/src/article/doc_preview.md',
          },
          {
            text: 'Web 视频加密动态方案',
            link: '/cn/src/article/video.md',
          },
          {
            text: '可视化渲染引擎',
            link: '/cn/src/article/visual.md',
          },
          {
            text: '排序算法',
            link: '/cn/src/article/sort/index.md',
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
            items: [{ text: '线性代数', link: '/cn/src/article/math/linear_algebra.md' }],
          },
        ],
      },
    ],
  },
};

export { themeCnConfig };
