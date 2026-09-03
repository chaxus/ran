---
description: 'ranuts 选型指南：debounce 还是 throttle、once 还是 singleFlight、localStorage 还是 IndexedDB、bridge 还是 worker client——以及什么时候平台自己就够了。'
---

# 选型指南

[API 参考](/cn/src/ranuts/api)列出了每一个导出。本页回答它回答不了的问题：**两个看起来差不多的东西，
该用哪一个，为什么**。

> **适用场景**：你大致知道要什么——「少跑几次」「只跑一次」「存起来」「和 worker 通信」——但不知道该
> 用哪个导出。

## 先问一句：平台自己有没有？

ranuts 不打算替代标准库。优先用平台能力，只有当工具函数确实多做了点什么时才用它：

| 与其……                     | 平台已经有……                | 用 ranuts 的这个，当……                                                                                                    |
| -------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `cloneDeep(value)`         | `structuredClone(value)`    | 值里含有函数或其他 `structuredClone` 拒绝的东西——它会抛 `DataCloneError`，而 `cloneDeep` 能拷的照拷、拷不了的按引用保留。 |
| `getAllQueryString(url)`   | `new URL(url).searchParams` | 你想一次拿到一个普通对象，而不是迭代器。                                                                                  |
| `localStorageGetItem(key)` | `localStorage.getItem(key)` | 代码还会跑在存储不可用或被禁用的环境里——这些包装返回 `''` 而不是抛错（Safari 无痕、沙箱 iframe、SSR）。                   |
| `escapeHtml(str)`          | `textContent = str`         | 你在拼字符串，而不是在造节点。                                                                                            |

## 让某件事少跑几次

「少调用几次」背后其实藏着四个不同的问题：

| 你想要……                                         | 用                 | 行为                                              |
| ------------------------------------------------ | ------------------ | ------------------------------------------------- |
| 一串连续调用里**只要最后一次**——搜索框、窗口缩放 | `debounce(fn, ms)` | 停止输入 `ms` 之后才跑；过程中一次都不跑。        |
| 连续调用期间**保持固定频率**——滚动位置、进度读数 | `throttle(fn, ms)` | 第一次立即跑，之后每 `ms` 最多一次。              |
| 它**这辈子只跑一次**——初始化、一次性警告         | `once(fn)`         | 第一次求值，之后每次都返回同一个结果。            |
| 并发调用者**共享同一个进行中的请求**             | `singleFlight(fn)` | once 的异步版本：有调用在飞行中时，后来者加入它。 |

**`memoize` 是 `once` 的旧名字**，行为完全相同——它并不会按参数缓存，而名字容易让人以为会。新代码请写
`once`。

真正会咬人的差别：给按键处理加 `debounce`，用户打字期间什么都不会跑；加 `throttle`，则全程都在跑，只是
不是每一次按键都跑。搜索建议要 `debounce`，「还可以输入 N 字」的计数要 `throttle`。

## 让异步工作可控

| 你想要……                                        | 用                                           |
| ----------------------------------------------- | -------------------------------------------- |
| 跑很多任务，但同时只跑 n 个                     | `new QuestQueue({ simultaneous: n })`        |
| 放弃一个跑太久的 promise                        | `withTimeout(promise, ms)`                   |
| ……并且用默认值继续，而不是抛错                  | `withTimeoutFallback(promise, ms, fallback)` |
| 一个由别处决定何时 resolve 的 promise           | `deferred()`                                 |
| 把异步步骤串成 Koa 式的链，每一层都能包住下一层 | `compose(middleware)`                        |

想「全部一起跑」用 `Promise.all`；如果「全部一起」意味着一下开六十个连接，那就用 `QuestQueue`。
`withTimeout` 会 reject——记得配 `catch`，或者在超时对你来说不算错误时用 fallback 版本。

## 存东西

| 生命周期与体量                       | 用                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------ |
| 一小段需要跨刷新存活的字符串         | `localStorageSetItem` / `localStorageGetItem` / `localStorageRemoveItem` |
| 结构化数据、很多条记录，或超过几 MB  | `new WebDB({ dbName, stores })`——IndexedDB 的 Promise 包装               |
| 一个只需要**从这一页交到下一页**的值 | `createHandoff({ dbName, storeName, key })`                              |

`localStorage*` 这组包装之所以存在，是因为原生调用在存储不可用时会**抛错**——Safari 无痕模式、沙箱
iframe、禁用了站点数据的浏览器——而「读一下就崩」比「少了一个偏好设置」严重得多。它们返回 `''` 然后继续。

`createHandoff` 针对的是另外两者都不合适的情况：一个必须精确存活一次跳转、然后就该消失的值。

## 跨上下文通信

| 在……之间                              | 用                                                 |
| ------------------------------------- | -------------------------------------------------- |
| 页面与 Web Worker，请求/响应式        | `new WorkerClient({ create })`——按请求 id 对应回复 |
| 任意两端 `MessagePort`                | `createPortBridge(port)`                           |
| 需要先互相找到对方的两个窗口 / iframe | 一端 `acceptPortBridge()`，另一端发起握手          |

worker 要「回答问题」时就该用 `WorkerClient`：没有请求 id，两个重叠的调用分不清哪条回复是谁的。bridge
是更底层的东西——当通信不是请求/响应式，或者传输通道已经存在时用它。

## 处理对象

| 你想要……             | 用                     | 说明                             |
| -------------------- | ---------------------- | -------------------------------- |
| 一份别人碰不到的拷贝 | `cloneDeep(value)`     | 处理循环引用和常见内置类型。     |
| 判断两个值是不是一样 | `isEqual(a, b)`        | 深比较，不是引用比较。           |
| 合并两个对象         | `merge(a, b)`          |                                  |
| 去掉某些键           | `filterObj(obj, keys)` | 返回一份不含列出的那些键的副本。 |

## 语言与文本

- **`resolveLocale({ supported, … })`** 从常规链路（显式选择、存储、`navigator.languages`、兜底）里挑出
  该用**你支持的**哪个语言。它回答「用哪种语言」，不回答「这句话怎么说」。
- **`createI18n` / `useI18n`**（[`ranuts/i18n`](/cn/src/ranuts/i18n/)）是翻译引擎——扁平词条、`{param}`
  插值、运行时切换。
- **`segmentByRanges`** 与 **`paginateText`** 用于文本排布：偏移与高亮，以及把文本切成能放进指定盒子的分页。

即使你不用 i18n 引擎，也值得用 `resolveLocale`——它做的那个决定（尊重读者**有序**的
`navigator.languages`，而不是只看第一个）恰恰是最容易做错的部分。

## 流式渲染模型响应

三层，每层都可以单独使用：

1. **[`ranuts/stream`](/cn/src/ranuts/stream/)**——解析 SSE，再用 `createStreamAccumulator()` 把 delta
   折叠成快照。与厂商无关：文本、思维链和工具调用的 delta 最终都落到同一种形状。
2. **[`ranuts/conversation`](/cn/src/ranuts/conversation/)**——用 `createConversationEngine()` 把只追加的
   事件日志投影成可渲染的节点。它决定一行**是什么**，但不画任何东西。
3. ranui 的 **[`<r-conversation>`](/cn/src/ranui/conversation/)**——渲染这些节点、把视图钉在底部、并做行的
   协调。

只渲染纯文本就停在第一层；转录有值得投影的结构时加第二层；想把滚动和协调也解决掉时加第三层。

## 该从哪个入口引入

每个子路径都是独立、可 tree-shake 的 barrel——从拥有该符号的那个入口引入，不要从源码深路径引。

| 引入                  | 内容                                            | 运行环境              |
| --------------------- | ----------------------------------------------- | --------------------- |
| `ranuts`              | 根 barrel——utils + visual 的全部导出            | 浏览器 + node         |
| `ranuts/utils`        | DOM/BOM、字符串、对象、数字、颜色、时间、存储…… | 浏览器 + node\*       |
| `ranuts/node`         | HTTP server、路由、WebSocket、fs、流、中间件    | **仅 node**           |
| `ranuts/visual`       | 2D 渲染引擎（Canvas / WebGL / WebGPU）          | **仅浏览器**          |
| `ranuts/i18n`         | 翻译引擎，不依赖 DOM                            | 浏览器 + node         |
| `ranuts/sw`           | 缓存策略与预缓存协议的 worker 一侧              | **仅 service worker** |
| `ranuts/vnode`        | Snabbdom 风格的虚拟 DOM                         | 浏览器                |
| `ranuts/stream`       | SSE 解析、模型流折叠、token 预算                | 浏览器 + node         |
| `ranuts/conversation` | 事件日志 → 可渲染的会话节点                     | 浏览器 + node         |

\* `ranuts/utils` 很宽：大部分面向浏览器，但纯函数（字符串、对象、数字、`compose`、`cloneDeep` 等）在哪
都能跑。**不要在浏览器代码里引入 `ranuts/node`**——它会带进 `fs` / `http` / `child_process`。

## 还是拿不准？

去[API 参考](/cn/src/ranuts/api)里搜——每个导出都在那里，带签名和一行描述，且从源码生成。如果读完两行
描述仍然觉得它们可以互换，那就是一个值得[反馈](https://github.com/chaxus/ran/issues)的文档问题。
