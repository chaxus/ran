---
title: 채팅 입력
description: 고정 푸터 입력 (텍스트, 첨부, 음성, 컨텍스트 미터) 이 있는 대화 영역.
---

# 채팅 입력

채팅 페이지는 스크롤되는 대화 영역과 고정 입력 영역으로 나뉩니다. [`r-conversation`](../ranui/conversation/) 이 대화 (하단 추적, 행 reconciliation, `footer` 슬롯) 를 담당하고, 입력은 그 슬롯에 두는 일반 markup 입니다.

## Layout shell

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

Wire streaming rows and send handling in script; this demo shows only structure.

## Pieces

| Piece                                        | Role                                                                 |
| -------------------------------------------- | -------------------------------------------------------------------- |
| [`r-conversation`](../ranui/conversation/)   | Renders the event log; `footer` stays above the keyboard-safe area   |
| [`r-markdown`](../ranui/markdown/)           | Typical row for assistant prose (`mode="streaming"` during tokens)   |
| [`r-input`](../ranui/input/) or `<textarea>` | Text entry; paste/drag for files stays on the host you choose        |
| [`r-attachments`](../ranui/attachments/)     | Staged files; call `add()` from picker, paste, or drop               |
| [`r-voice-button`](../ranui/voice-button/)   | Speech-to-text into the input when you wire `createSpeechRecognizer` |
| [`r-token-meter`](../ranui/token-meter/)     | Context window fill; drive `used` from stream `usage` chunks         |

Event shape and SSE folding live in [ranuts/stream](../ranuts/stream/) and [ranuts/conversation](../ranuts/conversation/). For a full wiring walkthrough, see [Build AI chat](../ranui/ai-chat/).
