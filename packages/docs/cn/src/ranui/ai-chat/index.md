---
title: 搭建 AI 聊天
description: 从空页面到流式聊天的一条路径——r-conversation、输入区控件、ranuts/stream 事件与 token 计量。
---

# 搭建 AI 聊天

本指南按既定决策走通一条实现：API 返回 Server-Sent Events，[`ranuts/stream`](../../ranuts/stream/) 把字节折叠成块，再把会话事件 `push` 进 [`r-conversation`](../conversation/)，底部输入区处理文本、附件、语音与上下文占用。

[示例](../../examples/) 列出其他组合；本页是端到端接线。

## 决策

- **传输：** 用 `fetch` 读 body，经 `parseEventStream` 与 `mapEventStream` 解析。各厂商字段名集中在一个 mapper 里。
- **会话区：** 在第一次 `push` 前注册所有 view，用 `<r-markdown>` 行渲染，读者上滑时停止贴底跟随。
- **输入区：** 原生 `<textarea>` 加 `<r-attachments>`、`<r-voice-button>`、`<r-token-meter>` 放在 `footer` 插槽——不是单个打包好的聊天组件。
- **用量：** 用流里的 `usage` 块更新计量条；它在服务端拒绝超大请求前给出提示，本身不作权威计数。

## 1. HTML 骨架

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Chat</title>
    <script type="module" src="./main.js"></script>
  </head>
  <body>
    <r-conversation id="chat" empty="Send a message to start" style="height: min(70vh, 640px)">
      <div slot="footer" class="composer">
        <r-token-meter id="meter" limit="65536" used="0" label="Context"></r-token-meter>
        <r-attachments id="files" accept="image/*,.pdf" max-count="4"></r-attachments>
        <div class="composer-row">
          <textarea id="input" rows="2" placeholder="Message"></textarea>
          <r-voice-button id="voice" aria-label="Voice input"></r-voice-button>
          <r-button id="send" type="primary">Send</r-button>
        </div>
      </div>
    </r-conversation>
  </body>
</html>
```

```css
.composer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.composer-row {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}
#input {
  flex: 1;
  min-height: 2.5rem;
  resize: vertical;
}
```

按需导入元素：

```js
import 'ranui/conversation';
import 'ranui/markdown';
import 'ranui/attachments';
import 'ranui/voice-button';
import 'ranui/token-meter';
import 'ranui/button';
```

## 2. 注册 conversation view

在第一次 `push` 前注册全部 view。最简的用户/助手 markdown 行：

```js
const chat = document.getElementById('chat');

chat.register({
  kind: 'message',
  match: (e) =>
    e.type === 'message/start'
      ? { id: e.id, role: 'start' }
      : e.type === 'message/delta'
        ? { id: e.id, role: 'update' }
        : null,
  start: (e) => ({ role: e.role, text: '' }),
  update: (state, e) => ({ ...state, text: state.text + e.text }),
  publication: (e) => (e.type === 'message/delta' ? 'animation-frame' : 'immediate'),
  mount: () => document.createElement('r-markdown'),
  patch: (el, node) => {
    el.content = node.state.text;
  },
});

function pushMessage(role, text) {
  const id = crypto.randomUUID();
  chat.push({ type: 'message/start', id, role });
  if (text) chat.push({ type: 'message/delta', id, text });
}
```

## 3. 流式模型响应

把 SSE 折叠成 chunk，再把文本 delta 推到当前助手行：

```js
import { mapEventStream, createStreamAccumulator } from 'ranuts/stream';

async function streamAssistant(response) {
  const accumulator = createStreamAccumulator();
  const id = crypto.randomUUID();
  chat.push({ type: 'message/start', id, role: 'assistant' });

  for await (const chunk of mapEventStream(response.body, mapProviderSseToChunks)) {
    accumulator.push(chunk);
    if (chunk.type === 'text-delta') {
      chat.push({ type: 'message/delta', id, text: chunk.text });
    }
    if (chunk.type === 'usage') {
      document.getElementById('meter').used = chunk.usage.inputTokens + chunk.usage.outputTokens;
    }
  }
}
```

为你的 API 实现 `mapProviderSseToChunks`；这是唯一与厂商绑定的模块。[`ranuts/stream`](../../ranuts/stream/) 说明中性的 `StreamChunk` 词汇。

## 4. 从输入区发送

```js
const input = document.getElementById('input');
const files = document.getElementById('files');

document.getElementById('send').addEventListener('click', async () => {
  const text = input.value.trim();
  if (!text) return;
  pushMessage('user', text);
  input.value = '';
  files.clear();

  const body = buildRequestBody(text, files); // your API shape
  const response = await fetch('/api/chat', { method: 'POST', body });
  await streamAssistant(response);
});
```

把 [`r-voice-button`](../voice-button/) 接到识别结果写入 `#input`。在 textarea 的 paste 或 picker 里调用 `files.add()` staging 文件——[`r-attachments`](../attachments/) 不会自行拦截手势。

## 另见

- [Conversation](../conversation/) — view、贴底、`footer` 插槽
- [Markdown](../markdown/) — 流式 `content` 属性
- [Attachments](../attachments/) · [VoiceButton](../voice-button/) · [TokenMeter](../token-meter/)
- [ranuts/stream](../../ranuts/stream/) · [ranuts/conversation](../../ranuts/conversation/)
- [聊天输入区示例](../../examples/chat-composer)
