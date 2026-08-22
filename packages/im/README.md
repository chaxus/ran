# IM

实现 SSE 流式请求和 web 端

## 减法

现在构建一个前端项目已经过于复杂。

至少需要一个构建工具 (vite,webpack,rspack),一个 UI 框架 (react,vue)。

我们至少需要去学习 UI 框架的语法，为了更好的使用，就要学习实现原理。

构建工具也是如此，简单使用可以照抄官网的指导配置。深度优化必然涉及到阅读和学习源码。

因此，我希望能去做减法，去思考，那些东西是不必要的。

我实现了一套 webcomponets 的开发方案。

```html
<router-view> </router-view>
```

## 现在它没有框架了

README 开头那段"做减法"以前只是主张：这个包自己用着 React、React Router 和 React DOM 的 SSR。现在没有了。

页面由 ranui 的 Web Components 构成，服务端用 `ranui/ssr-stream` 把同一批元素序列化成 Declarative Shadow DOM，浏览器先画出外壳，脚本加载后同一批元素就地升级。**没有第二套组件树要和第一套保持同步**——因为每个元素只有一份实现。

| 原来                                           | 现在                                                       |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `react` / `react-dom` / `react-router-dom`     | `<r-router>` 不需要（单页），路由留在服务端                |
| `renderToPipeableStream` + `<!--ssr-outlet-->` | `renderHTMLToString(template)`                             |
| 自写 Loading / BackDrop 组件                   | `r-loading` / `r-glass`                                    |
| `<pre>{text}</pre>`                            | `r-conversation` + `r-card` + `r-markdown` + `r-reasoning` |
| `classnames` + CSS Modules                     | ranui token + 一份页面级 CSS                               |

与 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的差距分析与后续规划见 [ROADMAP.md](./ROADMAP.md)。

## 会话

左侧是这台浏览器上的对话列表，按最近使用排序。刷新会回到刚才那一条，而不是回到空白页再让你自己找回去。

标题取自第一句话，只取一次——每轮都重命名会让列表条目在读者眼皮底下不停移动。

**持久化在 IndexedDB**（`ranuts/utils` 的 `WebDB`），读用 `collection` 的宽容句柄：无痕窗口、禁用存储的浏览器读不到时返回空列表，页面照常打开而不是白屏。**写不走这条路**——`WebDB` 自己的文档说得清楚，当写入本身就是用户的动作时，吞掉失败是错的默认值，而刚聊完的一段对话正是这种情况。写失败会提示一次（不是每轮一次，否则磁盘满会变成一堵墙）。

空对话不落库：一个还没人说过话的会话不值一条记录，每次开页都写一条只会把列表填满空白。

## 配置

不配置也能跑：没有 API key 时走内置示例回答，页面上会说明。

要接真实模型，在仓库根目录建 `.env`（Node 原生的 `process.loadEnvFile` 读取，无需依赖）：

```sh
IM_API_KEY=sk-...
IM_BASE_URL=https://api.deepseek.com/v1   # 可选，默认即此
IM_MODEL=deepseek-chat                    # 可选
```

也接受 `DEEPSEEK_API_KEY` / `DEEPSEEK_BASE_URL` / `DEEPSEEK_MODEL`；`IM_*` 优先，这样一台已经为别的用途配了 DeepSeek key 的机器可以只把这个 demo 指向别处。

**key 只在服务端。** 浏览器持有 key 等于发给每一位访客，客户端再小心也改变不了这一点，所以客户端只和本应用对话，本应用再去和厂商对话。走哪条路由通过 `X-IM-Mode` 响应头告知，而不是混进流里——回答的内容属于模型，关于配置的说明不属于。

## 管线

```
app/lib/provider.ts      从环境解析 provider
app/controllers/im.ts    真实模式：原样转发上游 SSE；演示模式：内置回答
client/lib/eventSource   toStreamChunks 映射 + streamDialog
client/chat.ts           两个对话 view：turn 与 reasoning
client/chat-types.ts     消息形状，供 client 与 sessions 共用
client/sessions.ts       IndexedDB 会话存储与标题推导
client/client.ts         注册 view、驱动输入框、会话列表、附件、语音
```

**厂商映射是本地代码，这是有意的。** `ranuts/stream` 不提供任何厂商的映射：分帧与折叠各家一样，wire 格式不一样。要接到别的服务商，只需重写 [`toStreamChunks`](./client/lib/eventSource.ts) 一个函数。

真实模式下服务端**只做字节转发**，不解析也不重组。在链路里再放一份 SSE 实现，就多了一处可能和厂商对"事件在哪里结束"产生分歧的地方；只做拷贝的代理不会。

### 对话如何构成

推理和答案是两个独立注册的 view，而不是一个 view 里的两段分支。节点按**开启它的事件**排序，而推理先到——所以推理行自然排在答案上方，不需要任何排序逻辑。两者都只在真正有内容时才开启节点，因此不输出推理的模型不会留下一个空的"思考过程"块。

### 这次重写修掉的问题

- 服务端声明 `Content-Type: text/event-stream`，却写裸 JSON——没有 `data:` 前缀，也没有空行终止符。任何按协议解析的客户端都读不到内容。
- 客户端把每个到达的 chunk 直接 `JSON.parse`。**一次网络合并或一次切分就会抛异常并终止整条流**，而 40ms 的发送间隔让合并几乎必然发生。
- 服务端每 40ms 重发一次**累积的完整答案**，传输 142 个字符要发 10,153 个。现在只发增量。
- 非 2xx 响应会静默渲染空白：`response.body` 为 undefined，读取循环直接结束，没有任何错误上报。
- 厂商中途报错（key 失效、模型不存在）会被映射当成"没有 choices"丢弃，整条流看起来像一个正常的空回答。现在带着厂商自己的消息抛出。

### 测试

`pnpm -F im test` —— 映射的单元测试、页面的 SSR 测试，以及一个**往返测试**：真实 controller 的输出字节喂进真实客户端管线，并在 1 / 7 / 64 字节三种切分下断言重建出同一段文本。两边的分帧一旦不一致，这个测试就会失败；一个自己重新声明 wire 格式的测试则永远只会和自己一致。

往返测试会显式把 `IM_API_KEY` 置空。否则它会读到机器上恰好存在的 key，一个单元测试就开始发付费网络请求了。
