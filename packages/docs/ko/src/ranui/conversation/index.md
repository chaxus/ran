---
description: '추가만 되는 이벤트 로그를 대화로 그립니다. 투영, 바닥 따라가기, 행 대조를 맡고, 콘텐츠 종류마다 독립된 뷰를 등록합니다.'
---

# Conversation

추가만 되는 이벤트 로그를 대화로 그립니다. 이 엘리먼트가 맡는 것은 번거롭고 틀리기 쉬운 세 가지뿐입니다.
이벤트를 노드로 투영하는 일, 독자 자신의 스크롤을 덮어쓰지 않으면서 화면을 바닥에 붙여 두는 일, 그리고
노드 목록에 맞춰 행을 대조하는 일입니다.

> **이럴 때 쓰세요.** 흘러 들어오는 대화 기록(채팅, 에이전트 세션, 로그)을 그리면서, 콘텐츠 종류(메시지,
> 도구 호출, 상태 줄)마다 점점 커지는 렌더러에 분기를 하나 더 넣는 대신 독립된 등록으로 다루고 싶을 때.

메시지나 도구 호출이 _어떻게 보이는지_ 는 등록된 뷰의 몫이지 이 엘리먼트가 관여할 일이 아닙니다. 투영은
[ranuts/conversation](../../ranuts/conversation/)이, 스크롤은 [ranuts/utils](../../ranuts/utils/)의
`createBottomFollower`가 맡습니다.

## 빠른 시작

```html
<r-conversation empty="아직 메시지가 없습니다" style="height: 400px"></r-conversation>
```

```ts
const chat = document.createElement('r-conversation');

chat.register({
  kind: 'message',
  // 어떤 이벤트가 내 것이고, 어느 노드에 속하는지.
  match: (e) =>
    e.type === 'message/start'
      ? { id: e.id, role: 'start' }
      : e.type === 'message/delta'
        ? { id: e.id, role: 'update' }
        : null,
  // 그것들을 내 상태로 접어 넣기.
  start: () => ({ text: '' }),
  update: (state, e) => ({ text: state.text + e.text }),
  // 토큰 단위 델타는 프레임당 한 번의 다시 그리기로 모으고, 확정된 사실은 기다리지 않습니다.
  publication: (e) => (e.type === 'message/delta' ? 'animation-frame' : 'immediate'),
  // 그 상태가 화면에 닿는 길.
  mount: () => document.createElement('r-markdown'),
  patch: (el, node) => {
    el.content = node.state.text;
  },
});

chat.push({ type: 'message/start', id: 'm1' });
chat.push({ type: 'message/delta', id: 'm1', text: 'Hello' });

container.append(chat);
```

산문 행으로는 `<r-markdown>`을 염두에 두었습니다. 기본값인 `mode="streaming"`에서 반쯤 흘러온 `**bold`,
백틱, 링크, `$$` 수식을 이미 닫아 주므로 뷰가 그 일을 할 필요가 없습니다.

## 어기면 무는 규칙

- **첫 `push` 전에 모든 뷰를 등록하세요.** 투영은 등록된 집합에서 한 번만 만들어지므로, 나중에 등록하면
  이미 접어 넣은 이벤트를 조용히 놓칩니다. 엘리먼트는 그렇게 하는 대신 예외를 던집니다.
- **`update`는 상태를 접고, `patch`는 그것을 DOM에 씁니다.** 이름이 다른 이유는 하는 일이 다르기
  때문입니다. `patch`는 아무것도 접지 않고, 흐르는 행에서는 프레임당 한 번 돌므로 가볍게 유지하세요.
- **`mount`는 선택입니다.** 없는 뷰는 다른 뷰가 `reader.previous`로 읽는 상태만 보태고 아무것도 그리지
  않습니다.
- **행은 열린 자리를 지킵니다.** 흐르는 메시지가 델타마다 목록 끝으로 뛰지 않습니다.

## 바닥 따라가기

기본으로 켜져 있습니다. 콘텐츠가 도착하는 동안 화면은 바닥에 붙어 있고, 독자가 위로 스크롤하는 순간
멈추며, 다시 아래로 내려오면 또 붙습니다. 어느 시점에도 수동 스크롤을 덮어쓰지 않습니다. 따라가기 장치가
입력 장치를 엿듣는 대신 자기 스크롤 쓰기와 독자의 것을 구분하기 때문입니다.

```ts
chat.addEventListener('pinnedchange', (e) => {
  jumpButton.hidden = e.detail.pinned;
});
```

`follow="false"`는 처음부터 독자에게 주도권을 줍니다. `scrollToBottom()`이 그것을 되찾습니다. 예전 내용을
페이지 단위로 불러올 때는, 앞에 붙이기 전에 `captureAnchor()`를 부르고 붙인 뒤에 `restoreAnchor()`를
부르면 독자가 보던 것을 계속 보게 됩니다.

## API 레퍼런스

### 프로퍼티

| 프로퍼티 | 타입      | 기본값 | 설명                                                          |
| -------- | --------- | ------ | ------------------------------------------------------------- |
| `follow` | `boolean` | `true` | 독자가 바닥에서 멀어질 때까지 새 콘텐츠를 따라갑니다.         |
| `empty`  | `string`  | `''`   | 투영이 아직 행을 만들지 않은 동안 보일 문구. 비면 숨겨집니다. |
| `pinned` | `boolean` | `true` | 읽기 전용. 지금 새 콘텐츠를 따라가고 있는지 여부.             |
| `sheet`  | `string`  | `''`   | 엘리먼트의 섀도 DOM에 주입할 CSS.                             |

### 메서드

| 메서드                | 설명                                                      |
| --------------------- | --------------------------------------------------------- |
| `register(view)`      | 콘텐츠 종류 하나를 등록합니다. 첫 `push` 뒤에는 던집니다. |
| `push(event)`         | 이벤트 하나를 투영하고 바뀐 곳을 그립니다.                |
| `reset()`             | 등록된 뷰는 남긴 채 모든 노드와 행을 버립니다.            |
| `scrollToBottom()`    | 바닥까지 스크롤하고 따라가기를 다시 시작합니다.           |
| `captureAnchor(key?)` | 예전 내용을 앞에 붙이기 전에 어느 행의 위치를 기억합니다. |
| `restoreAnchor()`     | 기억한 행을 있던 자리로 되돌립니다.                       |

### 이벤트

| 이벤트         | Detail                | 발생 시점                         |
| -------------- | --------------------- | --------------------------------- |
| `pinnedchange` | `{ pinned: boolean }` | 바닥 따라가기를 얻거나 잃었을 때. |

### 슬롯

| 슬롯     | 설명                                                           |
| -------- | -------------------------------------------------------------- |
| `footer` | 행 아래에 붙는 영역. 입력창이 여기 들어가며 높이가 관찰됩니다. |

### Part

`conversation`(스크롤 영역), `list`, `row`, `footer`, `empty`.

각 행은 `data-kind`와 `data-key`도 지니므로, 쓰는 쪽이 섀도 트리를 뒤지지 않고 스타일을 주거나 찾을 수
있습니다.

## 스타일

`<r-conversation>`은 자체 **CSS 커스텀 프로퍼티 14개**와 테마에서 읽어 오는 의미 토큰을 공개합니다.
상속이 닿는 곳이면 어디에나 지정하세요 — `:root`, 바깥 컨테이너, 또는 엘리먼트 자체.

```css
r-conversation {
  --ran-conversation-background: var(--ran-color-bg-subtle);
}
```

Part: `conversation` · `empty` · `footer` · `list` · `older`

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#conversation)에, 어떤 토큰을 고를지는 [디자인 시스템](/ko/src/ranui/design-system/)에 있습니다.

## 함께 보기

- [ranuts/stream](../../ranuts/stream/): 공급자의 SSE를 여기로 push할 이벤트로 바꾸기
- [ranuts/conversation](../../ranuts/conversation/): 투영. 갱신 리듬까지 포함해서
- [Markdown](../markdown/): 스트리밍을 아는 산문용 행
