---
description: 'ranuts 是一个可 tree-shake 的 JavaScript/TypeScript 工具库：DOM/BOM、字符串/对象/数字/颜色工具、存储、流式处理、2D 渲染引擎与虚拟 DOM。'
---

# ranuts

面向前端与 Node 的工具库，以**多个独立、可 tree-shake 的入口**发布。从拥有该能力的子路径引入，其余部分
永远不会进入你的产物。全部用 TypeScript 编写，每个导出都从源码生成文档。

- **npm**：<a href="https://www.npmjs.com/package/ranuts">`ranuts`</a> ·
  **源码**：<a href="https://github.com/chaxus/ran/tree/main/packages/ranuts">`packages/ranuts`</a>

```bash
npm install ranuts
```

```js
import { debounce } from 'ranuts/utils';
```

## 入口

| 引入                                                  | 内容                                            | 运行环境              |
| ----------------------------------------------------- | ----------------------------------------------- | --------------------- |
| `ranuts`                                              | 根 barrel——utils + visual 的全部导出            | 浏览器 + node         |
| [`ranuts/utils`](/cn/src/ranuts/utils/)               | DOM/BOM、字符串、对象、数字、颜色、时间、存储…… | 浏览器 + node\*       |
| [`ranuts/node`](/cn/src/ranuts/node/)                 | HTTP server、路由、WebSocket、fs、流、中间件    | **仅 node**           |
| [`ranuts/visual`](/cn/src/ranuts/visual/)             | 2D 渲染引擎（Canvas / WebGL / WebGPU）          | **仅浏览器**          |
| [`ranuts/i18n`](/cn/src/ranuts/i18n/)                 | 翻译引擎——扁平词条、运行时切换                  | 浏览器 + node         |
| [`ranuts/sw`](/cn/src/ranuts/sw/)                     | 缓存策略与预缓存协议的 worker 一侧              | **仅 service worker** |
| [`ranuts/vnode`](/cn/src/ranuts/vnode/)               | Snabbdom 风格的虚拟 DOM                         | 浏览器                |
| [`ranuts/stream`](/cn/src/ranuts/stream/)             | SSE 解析、模型流折叠、token 预算                | 浏览器 + node         |
| [`ranuts/conversation`](/cn/src/ranuts/conversation/) | 事件日志 → 可渲染的会话节点                     | 浏览器 + node         |

\* `ranuts/utils` 很宽：大部分面向浏览器，但纯函数在哪都能跑。**不要在浏览器代码里引入 `ranuts/node`**
——它会带进 `fs` / `http` / `child_process`。

## 里面都有什么

**函数式** —— [debounce 防抖](/cn/src/ranuts/utils/debounce) ·
[throttle 节流](/cn/src/ranuts/utils/throttle) ·
[once / singleFlight](/cn/src/ranuts/utils/memoize) ·
[QuestQueue 并发队列](/cn/src/ranuts/utils/quest_queue) ·
[withTimeout / deferred](/cn/src/ranuts/utils/with_timeout) ·
[compose 中间件](/cn/src/ranuts/utils/compose)

**数据** —— [cloneDeep 深拷贝](/cn/src/ranuts/utils/clone_deep) ·
[isEqual 深比较](/cn/src/ranuts/utils/is_equal) · [merge 合并](/cn/src/ranuts/utils/merge) ·
[filterObj 过滤键](/cn/src/ranuts/utils/filter_obj) ·
[数字格式化与解析](/cn/src/ranuts/utils/parse_number) ·
[颜色转换与混合](/cn/src/ranuts/utils/color)

**文本** —— [md5](/cn/src/ranuts/utils/md5) · [truncate 截断](/cn/src/ranuts/utils/truncate) ·
[detectLanguage 语种识别](/cn/src/ranuts/utils/detect_language) ·
[resolveLocale 语言判定](/cn/src/ranuts/utils/resolve_locale) ·
[segmentByRanges 分段高亮](/cn/src/ranuts/utils/segment) ·
[paginate 文本分页](/cn/src/ranuts/utils/paginate) ·
[escapeHtml 转义](/cn/src/ranuts/utils/escape_html)

**浏览器** —— [storage 存储](/cn/src/ranuts/utils/local_storage) ·
[IndexedDB](/cn/src/ranuts/utils/web_db) ·
[worker 客户端](/cn/src/ranuts/utils/worker_client) ·
[postMessage 桥](/cn/src/ranuts/bridge/) · [prefetch 预取](/cn/src/ranuts/utils/prefetch) ·
[设备识别](/cn/src/ranuts/utils/current_device) ·
[性能采集](/cn/src/ranuts/utils/get_performance) · [ZIP](/cn/src/ranuts/utils/zip) ·
[录音](/cn/src/ranuts/utils/audio_recorder) · [语音转文字](/cn/src/ranuts/utils/speech)

**AI 与对话** —— [stream 流式](/cn/src/ranuts/stream/) ·
[conversation 会话](/cn/src/ranuts/conversation/) · [i18n 国际化](/cn/src/ranuts/i18n/)

**渲染** —— [2D 引擎](/cn/src/ranuts/visual/) · [虚拟 DOM](/cn/src/ranuts/vnode/) ·
[canvas 工具](/cn/src/ranuts/utils/canvas) · [tween 缓动](/cn/src/ranuts/utils/tween)

**Node** —— [HTTP server 与路由](/cn/src/ranuts/node/) ·
[文件操作](/cn/src/ranuts/file/write_file) ·
[MIME 类型](/cn/src/ranuts/mime_type/mime_type)

以上只是一部分。[API 参考](/cn/src/ranuts/api)里有**每一个**导出，带签名与描述，从源码生成，因此不会
与代码脱节。

## 接下来读什么

| 如果你想……                   | 读                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------- |
| 查某个函数在不在、签名是什么 | [API 参考](/cn/src/ranuts/api)                                                  |
| 在两个相似的工具之间做选择   | [选型指南](/cn/src/ranuts/choosing/)                                            |
| 按分类浏览                   | [工具函数索引](/cn/src/ranuts/utils/)                                           |
| 渲染流式的模型响应           | [stream](/cn/src/ranuts/stream/) → [conversation](/cn/src/ranuts/conversation/) |
| 在它之上搭界面               | [ranui](/cn/src/ranui/)                                                         |

两个包都会把 `CLAUDE.md` 打进 npm 包里——那是给编码智能体看的导览文件，可以直接从 `node_modules` 读，
不需要联网。
