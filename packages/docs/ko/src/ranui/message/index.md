---
description: 'ranui의 Message API는 작업 결과에 대한 전역 알림(info, success, warning, error, toast)을 명령형으로 띄우며, 가벼운 오버레이로 그립니다.'
---

# Message

작업 결과를 알리는 전역 알림 컴포넌트입니다. `message` API로 명령형으로 호출하고, 닫을 수 있는 토스트로 그려집니다.

> **이럴 때 쓰세요.** 작업 결과를 확인시켜 줄, 잠깐 떴다가 스스로 사라지는 토스트가 필요할 때. 마크업을 두는 대신 명령형 API인 `message.info` / `success` / `warning` / `error` / `toast`를 부르세요.

## 빠른 시작

<ran-demo>
  <r-button type="primary" onclick="message.info('안내 메시지입니다')">메시지 띄우기</r-button>
</ran-demo>

```html
<r-button type="primary" onclick="message.info('안내 메시지입니다')">메시지 띄우기</r-button>
```

Message는 보통 JavaScript에서 부릅니다. 전역 `message` 객체는 컴포넌트 모듈이 로드되는 즉시 `window`에 등록됩니다(`window.ranui.message`로도 쓸 수 있습니다).

```js
message.info('안내 메시지입니다');
message.success('프로젝트를 삭제했습니다');
```

## API 레퍼런스

### 전역 메서드

각 메서드는 토스트를 하나 붙이고 `duration` 밀리초(기본 `3000`) 뒤에 스스로 닫습니다. 다섯 가지 모두 같은 시그니처입니다.

| 메서드              | 설명                                           |
| ------------------- | ---------------------------------------------- |
| `message.info()`    | 중립적인 정보 토스트(파란 정보 아이콘)         |
| `message.success()` | 성공 토스트(초록 체크 아이콘)                  |
| `message.warning()` | 경고 토스트(호박색 아이콘). 강하게 읽어 줍니다 |
| `message.error()`   | 오류 토스트(빨간 아이콘). 강하게 읽어 줍니다   |
| `message.toast()`   | 아이콘 없는 어두운 민 토스트                   |

### 메서드 시그니처

각 메서드는 `string`(내용)이나 옵션 객체를 받습니다.

```js
// 1. 문자열 넘기기 — 내용만. 3000ms 뒤에 사라집니다
message.info('안내 메시지입니다');

// 2. 옵션 객체 넘기기
message.info({
  content: '안내 메시지입니다',
  duration: 2000,
  close: () => console.log('closed'),
});
```

### 옵션

| 옵션           | 타입                        | 기본값          | 설명                                                            |
| -------------- | --------------------------- | --------------- | --------------------------------------------------------------- |
| `content`      | `string`                    | —               | 보여 줄 텍스트(객체를 넘길 때는 필수)                           |
| `duration`     | `number`                    | `3000`          | 스스로 닫히기까지의 밀리초                                      |
| `close`        | `() => void`                | —               | 토스트가 제거된 뒤 실행되는 콜백                                |
| `top`          | `number \| string`          | `8`             | 토스트 더미가 컨테이너 위쪽에서 떨어진 거리(숫자는 px로 봅니다) |
| `zIndex`       | `number \| string`          | `1200`          | 토스트 컨테이너의 쌓임 순서                                     |
| `getContainer` | `() => HTMLElement \| null` | `document.body` | 토스트 더미를 붙일 엘리먼트를 돌려줍니다                        |

> `null`, `undefined`, 또는 인자 없이 부르면 아무 일도 하지 않습니다. 아무것도 보이지 않습니다.

### 엘리먼트 어트리뷰트 `r-message`

토스트 하나하나가 `<r-message>` 커스텀 엘리먼트입니다. 전역 API가 이 어트리뷰트들을 대신 지정하지만, 직접 써도 됩니다.

| 어트리뷰트 | 타입     | 기본값 | 설명                                                                                                     |
| ---------- | -------- | ------ | -------------------------------------------------------------------------------------------------------- |
| `type`     | `string` | —      | `info`, `success`, `warning`, `error`, `toast` 가운데 하나. 아이콘·색과 ARIA 라이브 영역 역할을 고릅니다 |
| `content`  | `string` | —      | 토스트 안에 그려질 텍스트                                                                                |
| `sheet`    | `string` | `''`   | 컴포넌트의 섀도 DOM에 주입할 CSS                                                                         |

## 메시지 종류 `type`

<ran-demo>
  <r-button onclick="message.info('안내 메시지입니다')">정보 알림</r-button>
  <r-button onclick="message.success('안내 메시지입니다')">성공 알림</r-button>
  <r-button onclick="message.warning('안내 메시지입니다')">경고 알림</r-button>
  <r-button onclick="message.error('안내 메시지입니다')">오류 알림</r-button>
  <r-button onclick="message.toast('안내 메시지입니다')">toast 알림</r-button>
</ran-demo>

```html
<r-button onclick="message.info('안내 메시지입니다')">정보 알림</r-button>
<r-button onclick="message.success('안내 메시지입니다')">성공 알림</r-button>
<r-button onclick="message.warning('안내 메시지입니다')">경고 알림</r-button>
<r-button onclick="message.error('안내 메시지입니다')">오류 알림</r-button>
<r-button onclick="message.toast('안내 메시지입니다')">toast 알림</r-button>
```

## 표시 시간 `duration`

<ran-demo>
  <r-button onclick="message.info({ content: '6초 머무릅니다', duration: 6000 })">6초 토스트</r-button>
  <r-button onclick="message.info({ content: '1초 머무릅니다', duration: 1000 })">1초 토스트</r-button>
</ran-demo>

```html
<r-button onclick="message.info({ content: '6초 머무릅니다', duration: 6000 })">6초 토스트</r-button>
<r-button onclick="message.info({ content: '1초 머무릅니다', duration: 1000 })">1초 토스트</r-button>
```

## 닫힘 콜백 `close`

`close` 콜백은 토스트가 DOM에서 제거된 뒤에 실행됩니다.

<ran-demo>
  <r-button onclick="message.success({ content: '저장했습니다', close: () => message.info('토스트가 닫혔습니다') })">이어지는 메시지</r-button>
</ran-demo>

```html
<r-button onclick="message.success({ content: '저장했습니다', close: () => message.info('토스트가 닫혔습니다') })"
  >이어지는 메시지</r-button
>
```

```js
message.success({
  content: '저장했습니다',
  close: () => {
    // 토스트가 사라지고 나면 한 번 실행됩니다
    console.log('toast closed');
  },
});
```

## 위치 지정 `top` / `zIndex` / `getContainer`

<ran-demo>
  <r-button onclick="message.info({ content: '아래로 밀었습니다', top: 120 })">위쪽에서 띄우기</r-button>
</ran-demo>

```js
message.info({
  content: '아래로 밀었습니다',
  top: 120, // 컨테이너 위쪽에서의 거리
  zIndex: 1300, // 쌓임 순서
  getContainer: () => document.querySelector('#app'), // 붙일 곳
});
```

## 스타일

토스트 더미는 body로 포털된 컨테이너 안에 있습니다. 각 `<r-message>`는 내용을 섀도 DOM 안에 그리고, 그 표면은 CSS 변수로 테마를 입힐 수 있습니다(모두 무난한 대비값이 있습니다).

| CSS 변수                              | 기본값                         | 설명                        |
| ------------------------------------- | ------------------------------ | --------------------------- |
| `--ran-message-content-background`    | `var(--ran-color-bg-elevated)` | 토스트 표면 배경            |
| `--ran-message-content-border-radius` | `var(--ran-radius-md)`         | 토스트 모서리 반경          |
| `--ran-message-content-box-shadow`    | `var(--ran-shadow-menu)`       | 토스트 떠오름               |
| `--ran-message-text-color`            | `var(--ran-color-text)`        | 토스트 글자색               |
| `--ran-message-z-index`               | `var(--ran-z-message, 1200)`   | 더미의 z-index              |
| `--ran-message-top`                   | `8px`                          | 더미가 위쪽에서 떨어진 거리 |

## 권장 사항

- **무엇이 바뀌었는지 쓰세요**: 토스트 문구는 "프로젝트를 삭제했습니다", "변경 사항을 저장했습니다"처럼 결과로 쓰고, 막연한 "성공"으로 두지 마세요.
- **성공 / 정보**: 흐름을 막지 않는 확인에는 `message.success` / `message.info`를 쓰세요.
- **오류 / 경고**: `message.error` / `message.warning`을 쓰세요. 이들은 단호한 ARIA 라이브 영역으로 올라가 스크린 리더가 끼어들어 읽습니다.
- **짧게 유지하세요**: 토스트는 스스로 사라지므로, 길거나 조치가 필요한 내용은 다이얼로그로 돌리세요.
- **시간 조정은 아껴서**: 긴 메시지에는 `duration`을 늘려도 되지만, 잠깐 뜨는 알림을 눌러앉게 만들지는 마세요.
