# ranuts overview

## 方法列表

| 方法                   | 说明                                  | 详细内容                                                      |
| ---------------------- | ------------------------------------- | ------------------------------------------------------------- |
| writeFile              | 写入文件                              | [writeFile](./file/write_file.md)                             |
| readFile               | 读取文件                              | [readFile](./file/read_file.md)                               |
| readDir                | 读取目录，获取目录下所有文件的名字    | [readDir](./file/read_dir.md)                                 |
| watchFile              | 观察文件的内容是否发生变化            | [watchFile](./file/watch_file.md)                             |
| queryFileInfo          | 查询文件信息                          | [queryFileInfo](./file/file_info.md)                          |
| filterObj              | 过滤对象                              | [filterObj](./utils/filter_obj.md)                            |
| EventEmitter           | 发布订阅类                            | [EventEmitter](./mode/subscribe.md)                           |
| str2Xml                | 字符串转成`xml`                       | [str2Xml](./utils/str2xml.md)                                 |
| getMime                | 根据文件格式后缀获取 mime type        | [getMime](./mime_type/mime_type.md)                           |
| getCookie              | 获取指定 cookie 的值                  | [writeFile](./utils/get_cookie.md)                            |
| formatJson             | 格式化 JSON                           | [formatJson](./utils/format_json.md)                          |
| TOTP                   | 基于时间的一次性密码生成器            | [TOTP](./utils/totp.md)                                       |
| debounce               | 防抖函数                              | [debounce](./utils/debounce.md)                               |
| throttle               | 节流函数                              | [throttle](./utils/throttle.md)                               |
| memoize                | 记忆化函数                            | [memoize](./utils/memoize.md)                                 |
| noop                   | 空函数                                | [noop](./utils/noop.md)                                       |
| compose                | 组合中间件函数                        | [compose](./utils/compose.md)                                 |
| md5                    | MD5 哈希函数                          | [md5](./utils/md5.md)                                         |
| randomString           | 生成随机字符串                        | [randomString](./utils/random_string.md)                      |
| merge                  | 合并对象                              | [merge](./utils/merge.md)                                     |
| isEqual                | 深度比较两个值是否相等                | [isEqual](./utils/is_equal.md)                                |
| cloneDeep              | 深度克隆对象或数组                    | [cloneDeep](./utils/clone_deep.md)                            |
| querystring            | 将对象转换为 URL 查询字符串           | [querystring](./utils/querystring.md)                         |
| timeFormat             | 将时间秒数转换为格式化字符串          | [timeFormat](./utils/time_format.md)                          |
| timestampToTime        | 将时间戳转换为 Date 对象              | [timestampToTime](./utils/timestamp_to_time.md)               |
| performanceTime        | 获取高精度时间戳                      | [performanceTime](./utils/performance_time.md)                |
| isMobile               | 判断是否为移动端设备                  | [isMobile](./utils/is_mobile.md)                              |
| isWeiXin               | 判断是否为微信浏览器                  | [isWeiXin](./utils/is_weixin.md)                              |
| currentDevice          | 获取当前设备类型                      | [currentDevice](./utils/current_device.md)                    |
| localStorageGetItem    | 获取 localStorage 值                  | [localStorageGetItem](./utils/local_storage.md)               |
| localStorageSetItem    | 设置 localStorage 值                  | [localStorageSetItem](./utils/local_storage.md)               |
| getAllQueryString      | 从 URL 提取查询参数                   | [getAllQueryString](./utils/get_all_query_string.md)          |
| appendUrl              | 将查询参数拼接到 URL                  | [appendUrl](./utils/append_url.md)                            |
| clearBr                | 清除字符串中的空格、HTML 标签和换行符 | [clearBr](./utils/clear_br.md)                                |
| clearStr               | 去除字符串首尾的空格、URL 编码和引号  | [clearStr](./utils/clear_str.md)                              |
| strParse               | 将字符串解析为对象                    | [strParse](./utils/str_parse.md)                              |
| range                  | 限制数字在指定范围内                  | [range](./utils/range.md)                                     |
| mathjs                 | 精确的数字运算函数                    | [mathjs](./utils/mathjs.md)                                   |
| perToNum               | 将百分比字符串转换为数字              | [perToNum](./utils/per_to_num.md)                             |
| escapeHtml             | 转义 HTML 特殊字符                    | [escapeHtml](./utils/escape_html.md)                          |
| addClassToElement      | 给 DOM 元素添加 CSS 类名              | [addClassToElement](./utils/add_class_to_element.md)          |
| removeClassToElement   | 从 DOM 元素移除 CSS 类名              | [removeClassToElement](./utils/remove_class_to_element.md)    |
| isString               | 判断值是否为字符串类型                | [isString](./utils/is_string.md)                              |
| changeHumpToLowerCase  | 将驼峰命名转换为下划线命名            | [changeHumpToLowerCase](./utils/change_hump_to_lower_case.md) |
| getMatchingSentences   | 提取包含关键词的完整句子              | [getMatchingSentences](./utils/get_matching_sentences.md)     |
| transformNumber        | 将数字转换为带单位的格式化字符串      | [transformNumber](./utils/transform_number.md)                |
| addNumSym              | 给数字添加正负号                      | [addNumSym](./utils/add_num_sym.md)                           |
| convertImageToBase64   | 将图片文件转换为 Base64               | [convertImageToBase64](./utils/convert_image_to_base64.md)    |
| isImageSize            | 校验图片文件的尺寸                    | [isImageSize](./utils/is_image_size.md)                       |
| getPerformance         | 获取页面性能指标数据                  | [getPerformance](./utils/get_performance.md)                  |
| getWindow              | 获取可视窗口大小                      | [getWindow](./utils/get_window.md)                            |
| getQuery               | 从 URL 提取查询参数                   | [getQuery](./utils/get_query.md)                              |
| getCookieByName        | 通过正则获取 Cookie 值                | [getCookieByName](./utils/get_cookie_by_name.md)              |
| encodeUrl              | 安全地编码 URL                        | [encodeUrl](./utils/encode_url.md)                            |
| getPixelRatio          | 获取 Canvas 分辨率比例                | [getPixelRatio](./utils/get_pixel_ratio.md)                   |
| createObjectURL        | 创建对象 URL                          | [createObjectURL](./utils/create_object_url.md)               |
| getFrame               | 计算帧率                              | [getFrame](./utils/get_frame.md)                              |
| getHost                | 根据环境获取主机地址                  | [getHost](./utils/get_host.md)                                |
| isSafari               | 判断是否为 Safari 浏览器              | [isSafari](./utils/is_safari.md)                              |
| isBangDevice           | 判断是否为 iPhone 刘海屏              | [isBangDevice](./utils/is_bang_device.md)                     |
| isClient               | 判断是否为客户端环境                  | [isClient](./utils/is_client.md)                              |
| removeGhosting         | 移除拖拽事件的阴影                    | [removeGhosting](./utils/remove_ghosting.md)                  |
| retain                 | 覆盖浏览器的后退事件                  | [retain](./utils/retain.md)                                   |
| imageRequest           | 通过图片请求测试网络延迟              | [imageRequest](./utils/image_request.md)                      |
| networkSpeed           | 测试网络的 ping 值和抖动              | [networkSpeed](./utils/network_speed.md)                      |
| durationHandler        | 创建延迟执行函数                      | [durationHandler](./utils/duration_handler.md)                |
| connection             | 获取当前网络连接信息                  | [connection](./utils/connection.md)                           |
| scriptOnLoad           | 动态插入 script 或 link 标签          | [scriptOnLoad](./utils/script_on_load.md)                     |
| handleConsole          | 拦截并处理 console 方法调用           | [handleConsole](./utils/handle_console.md)                    |
| handleError            | 全局错误处理                          | [handleError](./utils/handle_error.md)                        |
| createDocumentFragment | 创建 DocumentFragment                 | [createDocumentFragment](./utils/create_document_fragment.md) |
| Chain                  | 链式调用的 DOM 操作类                 | [Chain](./utils/chain.md)                                     |
| create                 | 创建 DOM 元素的辅助函数               | [create](./utils/create.md)                                   |
| createSignal           | 创建响应式信号                        | [createSignal](./utils/create_signal.md)                      |
| setMime                | 设置或更新 MIME 类型映射              | [setMime](./utils/set_mime.md)                                |
| getExtensions          | 根据 MIME 类型获取扩展名              | [getExtensions](./utils/get_extensions.md)                    |
| handleFetchHook        | 拦截并处理 fetch 请求                 | [handleFetchHook](./utils/handle_fetch_hook.md)               |
| setAttributeByGlobal   | 给全局对象添加属性                    | [setAttributeByGlobal](./utils/set_attribute_by_global.md)    |
| toString               | 将值转换为字符串类型                  | [toString](./utils/to_string.md)                              |
| checkEncoding          | 检测 Uint8Array 数据的字符编码        | [checkEncoding](./utils/check_encoding.md)                    |
| transformText          | 将 ArrayBuffer 转换为文本             | [transformText](./utils/transform_text.md)                    |
| hexToRgb               | 将十六进制颜色值转换为 RGB            | [hexToRgb](./utils/hex_to_rgb.md)                             |
| rgbToHex               | 将 RGB 值转换为十六进制颜色值         | [rgbToHex](./utils/rgb_to_hex.md)                             |
| randomColor            | 生成随机颜色对象                      | [randomColor](./utils/random_color.md)                        |
| SyncHook               | 同步事件钩子类                        | [SyncHook](./utils/sync_hook.md)                              |
