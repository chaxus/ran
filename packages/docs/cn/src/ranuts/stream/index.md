# ranuts/stream — 流式模型响应

Server-Sent Events 解析、一份厂商中立的流式响应词汇表，以及把该词汇表折叠成可渲染块的实现。

```js
import { parseEventStream, mapEventStream, createStreamAccumulator } from 'ranuts/stream';
```

**独立入口。** 这里不碰 DOM，因此一段响应可以在测试里或服务端折叠；若从 `ranuts/utils` 引入，会把面向 DOM 的模块一并拖进来。

**不含任何厂商实现。** 主流的对话补全 API 流式传输的其实是同样四件事（助手正文、单独计费的推理文本、工具调用、token 用量），只是各家的命名和交错方式不同。把某一家的事件映射到 `StreamChunk` 是唯一与厂商相关的一步，这一步留给你：把某个 wire format 焊死在这里，会让另外两层对其他人失去价值。

## 三层

| 层                          | 职责                             |
| --------------------------- | -------------------------------- |
| `parseEventStream(source)`  | 字节 → `ServerSentEvent`，纯传输 |
| `StreamChunk`               | 一次响应流式传输的词汇表         |
| `createStreamAccumulator()` | 折叠成视图可渲染的块             |

`mapEventStream(source, map)` 把前两层接起来：它遍历事件，让你的映射为每个事件返回零到多个 chunk。返回 `[]` 就是丢弃心跳或 `[DONE]` 哨兵的方式。

## 词汇表

```ts
type StreamChunk =
  | { type: 'block-start'; index: number; blockType: ContentBlockType }
  | { type: 'text-delta'; index: number; text: string }
  | { type: 'reasoning-delta'; index: number; text: string }
  | { type: 'tool-call-delta'; index: number; id: string; name?: string; argumentsDelta: string }
  | { type: 'block-end'; index: number; block: ContentBlock }
  | { type: 'usage'; usage: TokenUsage }
  | { type: 'finish'; reason: FinishReason };
```

- **`index` 用于关联交错的增量。** 推理与正文会交错到达，多个工具调用也会同时开启，所以到达顺序并不等于分组依据。
- **`block-end` 携带已组装好的完整块**，并覆盖增量累加出的结果。只关心完成态的消费方可以忽略全部增量。
- **工具参数保持原始 JSON 文本。** 半截 JSON 文档不是一个值。请在 `finish` 之后一次性解析 `arguments`：中途解析 `argumentsDelta` 正是流式工具调用最常翻车的地方。
- **`block-start` 是可选的。** 有些厂商用第一个增量直接开启一个块，因此累加器会按需创建；你的映射也不应强制要求它。
- **`finish` 表示终止。** `usage` 在它之前到达，它之后不再有任何内容。

## 折叠一次响应

```js
const accumulator = createStreamAccumulator();

for await (const chunk of mapEventStream(response.body, toStreamChunks)) {
  accumulator.push(chunk);
  render(accumulator.snapshot());
}

const { blocks, usage, finishReason } = accumulator.snapshot();
const calls = accumulator.toolCalls(); // arguments 仍是文本——在这里解析
```

`snapshot()` 是不可变的：流式过程中取得的快照会保留当时的值，视图可以持有它而不会被后续 `push` 从底下改掉。`text()` 与 `reasoning()` 按 index 顺序拼接各自的块，`reset()` 清空实例以便折叠下一次响应。

## SSE 解析器覆盖了什么

这套分帧规则很小，却几乎没人完整实现过。`parseEventStream` 覆盖：

- chunk 边界落在**任意位置**，包括多字节字符内部、以及 `\r\n` 的两半之间
- 重复的 `data:` 字段以 `\n` 拼接
- 冒号后正好剥掉一个空格
- `:` 注释行（服务端用它保持连接活跃）
- 开头的 BOM
- 服务端未以空行结束的尾部块
- 没有 `Symbol.asyncIterator` 的 `ReadableStream`

它同时接受 `AsyncIterable<Uint8Array>` 和 `ReadableStream`，因此测试可以直接喂字节切片，无需网络。

## 一份可参考的映射实现

本仓库的 `packages/im` 就是一个真实使用者：一条 OpenAI 兼容的 SSE 路由、到 `StreamChunk` 的映射，以及一个持有快照而非自行拼接增量的视图。它的往返测试会把真实服务端产生的字节、按多种分块大小喂进真实客户端，因此两侧的分帧无法悄悄跑偏。

## 相关

- [ranuts/conversation](../conversation/)：把产生的事件投影为可渲染节点
- [`<r-conversation>`](../../ranui/conversation/)：渲染这些节点
