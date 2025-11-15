# 工具函数

## 函数式编程

| 方法     | 说明           | 详细内容                  |
| -------- | -------------- | ------------------------- |
| debounce | 防抖函数       | [debounce](./debounce.md) |
| throttle | 节流函数       | [throttle](./throttle.md) |
| memoize  | 记忆化函数     | [memoize](./memoize.md)   |
| noop     | 空函数         | [noop](./noop.md)         |
| compose  | 组合中间件函数 | [compose](./compose.md)   |

## 字符串处理

| 方法                  | 说明                                  | 详细内容                                                |
| --------------------- | ------------------------------------- | ------------------------------------------------------- |
| md5                   | MD5 哈希函数                          | [md5](./md5.md)                                         |
| randomString          | 生成随机字符串                        | [randomString](./random_string.md)                      |
| clearBr               | 清除字符串中的空格、HTML 标签和换行符 | [clearBr](./clear_br.md)                                |
| clearStr              | 去除字符串首尾的空格、URL 编码和引号  | [clearStr](./clear_str.md)                              |
| strParse              | 将字符串解析为对象                    | [strParse](./str_parse.md)                              |
| toString              | 将值转换为字符串类型                  | [toString](./to_string.md)                              |
| transformText         | 将 ArrayBuffer 转换为文本             | [transformText](./transform_text.md)                    |
| checkEncoding         | 检测 Uint8Array 数据的字符编码        | [checkEncoding](./check_encoding.md)                    |
| changeHumpToLowerCase | 将驼峰命名转换为下划线命名            | [changeHumpToLowerCase](./change_hump_to_lower_case.md) |
| getMatchingSentences  | 提取包含关键词的完整句子              | [getMatchingSentences](./get_matching_sentences.md)     |
| isString              | 判断值是否为字符串类型                | [isString](./is_string.md)                              |
| str2Xml               | 字符串转成 `xml`                      | [str2Xml](./str2xml.md)                                 |

## 对象处理

| 方法        | 说明                        | 详细内容                        |
| ----------- | --------------------------- | ------------------------------- |
| merge       | 合并对象                    | [merge](./merge.md)             |
| isEqual     | 深度比较两个值是否相等      | [isEqual](./is_equal.md)        |
| cloneDeep   | 深度克隆对象或数组          | [cloneDeep](./clone_deep.md)    |
| querystring | 将对象转换为 URL 查询字符串 | [querystring](./querystring.md) |
| filterObj   | 过滤对象                    | [filterObj](./filter_obj.md)    |
| formatJson  | 格式化 JSON                 | [formatJson](./format_json.md)  |

## 数字处理

| 方法            | 说明                             | 详细内容                                 |
| --------------- | -------------------------------- | ---------------------------------------- |
| range           | 限制数字在指定范围内             | [range](./range.md)                      |
| mathjs          | 精确的数字运算函数               | [mathjs](./mathjs.md)                    |
| perToNum        | 将百分比字符串转换为数字         | [perToNum](./per_to_num.md)              |
| transformNumber | 将数字转换为带单位的格式化字符串 | [transformNumber](./transform_number.md) |
| addNumSym       | 给数字添加正负号                 | [addNumSym](./add_num_sym.md)            |

## 颜色处理

| 方法        | 说明                          | 详细内容                         |
| ----------- | ----------------------------- | -------------------------------- |
| hexToRgb    | 将十六进制颜色值转换为 RGB    | [hexToRgb](./hex_to_rgb.md)      |
| rgbToHex    | 将 RGB 值转换为十六进制颜色值 | [rgbToHex](./rgb_to_hex.md)      |
| randomColor | 生成随机颜色对象              | [randomColor](./random_color.md) |

## 时间处理

| 方法            | 说明                         | 详细内容                                  |
| --------------- | ---------------------------- | ----------------------------------------- |
| timeFormat      | 将时间秒数转换为格式化字符串 | [timeFormat](./time_format.md)            |
| timestampToTime | 将时间戳转换为 Date 对象     | [timestampToTime](./timestamp_to_time.md) |
| performanceTime | 获取高精度时间戳             | [performanceTime](./performance_time.md)  |

## 设备检测

| 方法          | 说明                     | 详细内容                             |
| ------------- | ------------------------ | ------------------------------------ |
| isMobile      | 判断是否为移动端设备     | [isMobile](./is_mobile.md)           |
| isWeiXin      | 判断是否为微信浏览器     | [isWeiXin](./is_weixin.md)           |
| isClient      | 判断是否为客户端环境     | [isClient](./is_client.md)           |
| isSafari      | 判断是否为 Safari 浏览器 | [isSafari](./is_safari.md)           |
| isBangDevice  | 判断是否为 iPhone 刘海屏 | [isBangDevice](./is_bang_device.md)  |
| currentDevice | 获取当前设备类型         | [currentDevice](./current_device.md) |

## DOM 操作

| 方法                   | 说明                     | 详细内容                                                |
| ---------------------- | ------------------------ | ------------------------------------------------------- |
| addClassToElement      | 给 DOM 元素添加 CSS 类名 | [addClassToElement](./add_class_to_element.md)          |
| removeClassToElement   | 从 DOM 元素移除 CSS 类名 | [removeClassToElement](./remove_class_to_element.md)    |
| createDocumentFragment | 创建 DocumentFragment    | [createDocumentFragment](./create_document_fragment.md) |
| escapeHtml             | 转义 HTML 特殊字符       | [escapeHtml](./escape_html.md)                          |
| Chain                  | 链式调用的 DOM 操作类    | [Chain](./chain.md)                                     |
| create                 | 创建 DOM 元素的辅助函数  | [create](./create.md)                                   |

## 存储

| 方法                | 说明                 | 详细内容                                  |
| ------------------- | -------------------- | ----------------------------------------- |
| localStorageGetItem | 获取 localStorage 值 | [localStorageGetItem](./local_storage.md) |
| localStorageSetItem | 设置 localStorage 值 | [localStorageSetItem](./local_storage.md) |

## URL/Query

| 方法              | 说明                 | 详细内容                                       |
| ----------------- | -------------------- | ---------------------------------------------- |
| getAllQueryString | 从 URL 提取查询参数  | [getAllQueryString](./get_all_query_string.md) |
| getQuery          | 从 URL 提取查询参数  | [getQuery](./get_query.md)                     |
| encodeUrl         | 安全地编码 URL       | [encodeUrl](./encode_url.md)                   |
| appendUrl         | 将查询参数拼接到 URL | [appendUrl](./append_url.md)                   |

## Cookie

| 方法            | 说明                   | 详细内容                                   |
| --------------- | ---------------------- | ------------------------------------------ |
| getCookie       | 获取指定 cookie 的值   | [getCookie](./get_cookie.md)               |
| getCookieByName | 通过正则获取 Cookie 值 | [getCookieByName](./get_cookie_by_name.md) |

## 图片处理

| 方法                 | 说明                    | 详细内容                                             |
| -------------------- | ----------------------- | ---------------------------------------------------- |
| convertImageToBase64 | 将图片文件转换为 Base64 | [convertImageToBase64](./convert_image_to_base64.md) |
| isImageSize          | 校验图片文件的尺寸      | [isImageSize](./is_image_size.md)                    |

## 性能

| 方法           | 说明                   | 详细内容                               |
| -------------- | ---------------------- | -------------------------------------- |
| getPerformance | 获取页面性能指标数据   | [getPerformance](./get_performance.md) |
| getFrame       | 计算帧率               | [getFrame](./get_frame.md)             |
| getPixelRatio  | 获取 Canvas 分辨率比例 | [getPixelRatio](./get_pixel_ratio.md)  |

## 网络

| 方法         | 说明                     | 详细内容                           |
| ------------ | ------------------------ | ---------------------------------- |
| imageRequest | 通过图片请求测试网络延迟 | [imageRequest](./image_request.md) |
| networkSpeed | 测试网络的 ping 值和抖动 | [networkSpeed](./network_speed.md) |
| connection   | 获取当前网络连接信息     | [connection](./connection.md)      |

## 浏览器

| 方法            | 说明                 | 详细内容                                  |
| --------------- | -------------------- | ----------------------------------------- |
| getWindow       | 获取可视窗口大小     | [getWindow](./get_window.md)              |
| getHost         | 根据环境获取主机地址 | [getHost](./get_host.md)                  |
| createObjectURL | 创建对象 URL         | [createObjectURL](./create_object_url.md) |
| removeGhosting  | 移除拖拽事件的阴影   | [removeGhosting](./remove_ghosting.md)    |
| retain          | 覆盖浏览器的后退事件 | [retain](./retain.md)                     |

## 脚本加载

| 方法         | 说明                         | 详细内容                            |
| ------------ | ---------------------------- | ----------------------------------- |
| scriptOnLoad | 动态插入 script 或 link 标签 | [scriptOnLoad](./script_on_load.md) |

## 错误处理

| 方法            | 说明                        | 详细内容                                  |
| --------------- | --------------------------- | ----------------------------------------- |
| handleConsole   | 拦截并处理 console 方法调用 | [handleConsole](./handle_console.md)      |
| handleError     | 全局错误处理                | [handleError](./handle_error.md)          |
| handleFetchHook | 拦截并处理 fetch 请求       | [handleFetchHook](./handle_fetch_hook.md) |

## 其他

| 方法                 | 说明                       | 详细内容                                             |
| -------------------- | -------------------------- | ---------------------------------------------------- |
| TOTP                 | 基于时间的一次性密码生成器 | [TOTP](./totp.md)                                    |
| createSignal         | 创建响应式信号             | [createSignal](./create_signal.md)                   |
| setMime              | 设置或更新 MIME 类型映射   | [setMime](./set_mime.md)                             |
| getExtensions        | 根据 MIME 类型获取扩展名   | [getExtensions](./get_extensions.md)                 |
| setAttributeByGlobal | 给全局对象添加属性         | [setAttributeByGlobal](./set_attribute_by_global.md) |
| SyncHook             | 同步事件钩子类             | [SyncHook](./sync_hook.md)                           |
| durationHandler      | 创建延迟执行函数           | [durationHandler](./duration_handler.md)             |
