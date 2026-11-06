---
title: 聊天输入区
description: 带 sticky 底部输入区的会话：文本输入、附件条、语音按钮与上下文计量。
---

# 聊天输入区

聊天页分为可滚动会话区与 sticky 输入区。[`r-conversation`](../ranui/conversation/) 负责会话（贴底跟随、行 reconciliation 与 `footer` 插槽）；输入区是你放进插槽的普通 markup。

## 布局骨架

<ran-demo column align="start">
  <r-conversation empty="No messages yet" style="width: 100%; max-width: 420px; height: 280px">
    <div slot="footer" style="display: flex; flex-direction: column; gap: 12px; width: 100%; padding-top: 8px">
      <r-token-meter limit="65536" used="18400" label="Context"></r-token-meter>
      <r-attachments accept="image/*,.pdf" max-count="4"></r-attachments>
      <div style="display: flex; gap: 8px; align-items: flex-end; width: 100%">
        <textarea rows="2" placeholder="Message" style="flex: 1; min-height: 2.5rem; resize: vertical"></textarea>
        <r-voice-button aria-label="Voice input"></r-voice-button>
        <r-button type="primary">Send</r-button>
      </div>
    </div>
  </r-conversation>
</ran-demo>

流式行与发送逻辑在脚本中接入；此演示仅展示结构。

## 组成

| 部分                                         | 作用                                              |
| -------------------------------------------- | ------------------------------------------------- |
| [`r-conversation`](../ranui/conversation/)   | 渲染事件日志；`footer` 保持在键盘安全区之上       |
| [`r-markdown`](../ranui/markdown/)           | 助手正文常用行（流式阶段用 `mode="streaming"`）   |
| [`r-input`](../ranui/input/) 或 `<textarea>` | 文本输入；粘贴/拖放文件由你选定的宿主处理         |
| [`r-attachments`](../ranui/attachments/)     | 待发送文件；在 picker、粘贴或 drop 时调用 `add()` |
| [`r-voice-button`](../ranui/voice-button/)   | 接入 `createSpeechRecognizer` 后写入输入框        |
| [`r-token-meter`](../ranui/token-meter/)     | 上下文占用；用流式 `usage` 块更新 `used`          |

事件形状与 SSE 折叠见 [ranuts/stream](../ranuts/stream/) 与 [ranuts/conversation](../ranuts/conversation/)。完整接线见 [搭建 AI 聊天](../ranui/ai-chat/)。
