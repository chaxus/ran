---
description: 'ranuts 是一个可 tree-shake 的 JavaScript/TypeScript 工具库：DOM/BOM、字符串/对象/数字/颜色工具、存储、流式处理、2D 渲染引擎与虚拟 DOM。'
---

# ranuts

面向前端与 Node 的工具库，以**多个独立、可 tree-shake 的入口**发布。从拥有该能力的子路径引入，其余部分
就不会进入你的构建产物。全部用 TypeScript 编写，每个导出都从源码生成文档。

- **npm**：<a href="https://www.npmjs.com/package/ranuts">`ranuts`</a> ·
  **源码**：<a href="https://github.com/chaxus/ran/tree/main/packages/ranuts">`packages/ranuts`</a>

```bash
npm install ranuts
```

```js
import { debounce } from 'ranuts/utils';
```

## 入口

| 引入                                              | 内容                                            | 运行环境              |
| ------------------------------------------------- | ----------------------------------------------- | --------------------- |
| `ranuts`                                          | 根 barrel（utils + visual 的全部导出）          | 浏览器 + node         |
| [`ranuts/utils`](/cn/ranuts/utils/)               | DOM/BOM、字符串、对象、数字、颜色、时间、存储…… | 浏览器 + node         |
| [`ranuts/visual`](/cn/ranuts/visual/)             | 2D 渲染引擎（Canvas / WebGL / WebGPU）          | **仅浏览器**          |
| [`ranuts/i18n`](/cn/ranuts/i18n/)                 | 翻译引擎，扁平词条、运行时切换                  | 浏览器 + node         |
| [`ranuts/sw`](/cn/ranuts/sw/)                     | 缓存策略与预缓存协议的 worker 一侧              | **仅 service worker** |
| [`ranuts/vnode`](/cn/ranuts/vnode/)               | Snabbdom 风格的虚拟 DOM                         | 浏览器                |
| [`ranuts/stream`](/cn/ranuts/stream/)             | SSE 解析、模型流折叠、token 预算                | 浏览器 + node         |
| [`ranuts/conversation`](/cn/ranuts/conversation/) | 事件日志 → 可渲染的会话节点                     | 浏览器 + node         |

## 里面都有什么

**函数式**：[debounce 防抖](/cn/ranuts/utils/debounce) ·
[throttle 节流](/cn/ranuts/utils/throttle) ·
[once / singleFlight](/cn/ranuts/utils/memoize) ·
[QuestQueue 并发队列](/cn/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/cn/ranuts/utils/with_timeout) ·
[compose 中间件](/cn/ranuts/utils/compose)

**数据**：[cloneDeep 深拷贝](/cn/ranuts/utils/clone_deep) ·
[isEqual 深比较](/cn/ranuts/utils/is_equal) · [merge 合并](/cn/ranuts/utils/merge) ·
[filterObj 过滤键](/cn/ranuts/utils/filter_obj) ·
[数字格式化与解析](/cn/ranuts/utils/parse_number) ·
[颜色转换与混合](/cn/ranuts/utils/color)

**文本**：[truncate 截断](/cn/ranuts/utils/truncate) ·
[detectLanguage 语种识别](/cn/ranuts/utils/detect_language) ·
[resolveLocale 语言判定](/cn/ranuts/utils/resolve_locale) ·
[segmentByRanges 分段高亮](/cn/ranuts/utils/segment) ·
[paginate 文本分页](/cn/ranuts/utils/paginate) ·
[escapeHtml 转义](/cn/ranuts/utils/escape_html)

**浏览器**：[storage 存储](/cn/ranuts/utils/local_storage) ·
[IndexedDB](/cn/ranuts/utils/web_db) ·
[worker 客户端](/cn/ranuts/utils/worker_client) ·
[postMessage 桥](/cn/ranuts/bridge/) · [prefetch 预取](/cn/ranuts/utils/prefetch) ·
[设备识别](/cn/ranuts/utils/current_device) ·
[性能采集](/cn/ranuts/utils/get_performance) · [ZIP](/cn/ranuts/utils/zip) ·
[录音](/cn/ranuts/utils/audio_recorder) · [语音转文字](/cn/ranuts/utils/speech)

**AI 与对话**：[stream 流式](/cn/ranuts/stream/) ·
[conversation 会话](/cn/ranuts/conversation/) · [i18n 国际化](/cn/ranuts/i18n/)

**渲染**：[2D 引擎](/cn/ranuts/visual/) · [虚拟 DOM](/cn/ranuts/vnode/) ·
[canvas 工具](/cn/ranuts/utils/canvas) · [tween 缓动](/cn/ranuts/utils/tween)

以上只是一部分。[API 参考](/cn/ranuts/api)里有**每一个**导出，带签名与描述，从源码生成，因此不会
与代码脱节。

## 接下来读什么

| 如果你想……                   | 读                                                                      |
| ---------------------------- | ----------------------------------------------------------------------- |
| 查某个函数在不在、签名是什么 | [API 参考](/cn/ranuts/api)                                              |
| 在两个相似的工具之间做选择   | [选型指南](/cn/ranuts/choosing/)                                        |
| 按分类浏览                   | [工具函数索引](/cn/ranuts/utils/)                                       |
| 渲染流式的模型响应           | [stream](/cn/ranuts/stream/) → [conversation](/cn/ranuts/conversation/) |
| 在它之上搭界面               | [ranui](/cn/ranui/)                                                     |

两个包都会把 `CLAUDE.md` 打进 npm 包里，那是给编码智能体看的导览文件，可以直接从 `node_modules` 读，
不需要联网。
