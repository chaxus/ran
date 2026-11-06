---
title: AI 채팅 구축
description: 빈 페이지에서 스트리밍 채팅까지 — r-conversation, 입력 UI, ranuts/stream, 토큰 미터.
---

# AI 채팅 구축

이 가이드는 정해진 결정으로 한 구현을 따라갑니다. API 는 SSE 를 반환하고, [`ranuts/stream`](../../ranuts/stream/) 이 바이트를 블록으로 접으며, 이벤트를 [`r-conversation`](../conversation/) 에 push 하고, footer 입력이 텍스트·첨부·음성·컨텍스트를 처리합니다.

[Examples](../../examples/) lists other compositions; this page is the end-to-end wiring.

## Decisions

- **Transport:** `fetch` with a readable body, parsed through `parseEventStream` and `mapEventStream`. Vendor-specific field names stay in one mapper function.
- **Transcript:** `<r-conversation>` registers views before the first `push`, renders `<r-markdown>` rows, and keeps bottom-follow unless the reader scrolls up.
- **Composer:** A native `<textarea>` plus `<r-attachments>`, `<r-voice-button>`, and `<r-token-meter>` in the `footer` slot—not a single bundled chat element.
- **Usage:** Update the meter from `usage` chunks in the stream; it warns before the provider rejects an oversized request.

## 1. HTML shell

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

Import the elements you use:

```js
import 'ranui/conversation';
import 'ranui/markdown';
import 'ranui/attachments';
import 'ranui/voice-button';
import 'ranui/token-meter';
import 'ranui/button';
```

## 2. Register conversation views

Register every view before the first `push`. A minimal assistant/user pair using markdown rows:

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

## 3. Stream a model response

Fold SSE into chunks, then map finished text blocks into deltas on the open assistant row:

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

Implement `mapProviderSseToChunks` for your API; keep it as the only vendor-specific module. [`ranuts/stream`](../../ranuts/stream/) documents the neutral `StreamChunk` vocabulary.

## 4. Send from the composer

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

Wire [`r-voice-button`](../voice-button/) to append recognized text into `#input`. Stage files with `files.add()` from paste or a picker on the textarea—[`r-attachments`](../attachments/) does not intercept gestures by itself.

## See also

- [Conversation](../conversation/) — views, bottom-follow, footer slot
- [Markdown](../markdown/) — streaming `content` property
- [Attachments](../attachments/) · [VoiceButton](../voice-button/) · [TokenMeter](../token-meter/)
- [ranuts/stream](../../ranuts/stream/) · [ranuts/conversation](../../ranuts/conversation/)
- [Chat composer example](../../examples/chat-composer)
