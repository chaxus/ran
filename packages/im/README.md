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

## 流式管线

`im` 是 `ranuts/stream` 在仓库内的真实使用者。分帧与折叠都来自 ranuts，这里只保留三样东西：请求、厂商映射、取消。

```
app/controllers/im.ts   服务端：OpenAI 兼容的 SSE，逐段发送增量
client/lib/eventSource  客户端：toStreamChunks 映射 + streamDialog
client/pages/home       视图：持有 StreamSnapshot，而不是自己拼接字符串
```

**厂商映射是本地代码，这是有意的。** `ranuts/stream` 不提供任何厂商的映射：分帧与折叠各家一样，wire 格式不一样。要接到别的服务商，只需重写 [`toStreamChunks`](./client/lib/eventSource.ts) 一个函数。

服务端发的是 OpenAI 兼容格式（`choices[].delta.content`、终止的 `finish_reason`、结尾的 `[DONE]`），所以这条路由可以直接换成真实服务商而客户端一行不改。

### 这次重写修掉的问题

- 服务端声明 `Content-Type: text/event-stream`，却写裸 JSON——没有 `data:` 前缀，也没有空行终止符。任何按协议解析的客户端都读不到内容。
- 客户端把每个到达的 chunk 直接 `JSON.parse`。**一次网络合并或一次切分就会抛异常并终止整条流**，而 40ms 的发送间隔让合并几乎必然发生。
- 服务端每 40ms 重发一次**累积的完整答案**（`answer.slice(0, i)`），传输 142 个字符要发 10,153 个。现在只发增量。
- 非 2xx 响应会静默渲染空白：`response.body` 为 undefined，读取循环直接结束，没有任何错误上报。

### 测试

`pnpm -F im test` —— 映射的单元测试，加上一个**往返测试**：真实 controller 的输出字节喂进真实客户端管线，并在 1 / 7 / 64 字节三种切分下断言重建出同一段文本。两边的分帧一旦不一致，这个测试就会失败；一个自己重新声明 wire 格式的测试则永远只会和自己一致。
