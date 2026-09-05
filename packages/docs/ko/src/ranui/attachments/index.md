---
description: 'ranui Attachments(<r-attachments>)는 메시지와 함께 준비된 파일을 담아 미리보고 검증하며, 스스로 만든 object URL을 직접 해제합니다.'
---

# Attachments

메시지와 함께 준비된 파일들 — `<r-attachments>`는 그 목록을 들고 있으면서 미리보기를 그리고,
들어오는 파일을 검증하고, 자신이 만든 object URL을 직접 해제합니다.

> **이럴 때 씁니다.** 작성 영역에서 곧 보낼 것을 보여줘야 할 때. 파일을 **모아 오지는**
> 않습니다. 붙여넣기, 드래그 앤 드롭, 파일 선택기는 서로 다른 세 가지 동작이고 각각 작성
> 영역의 다른 요소에 속하며, 그중 무엇을 제공할지는 애플리케이션이 정할 일입니다. 직접 연결한
> 쪽에서 `add()`를 호출하세요.

## 빠른 시작

### 기본 사용법

```html
<r-attachments accept="image/*,.pdf" max-size="5242880" max-count="4"></r-attachments>
```

```js
const strip = document.createElement('r-attachments');

// 파일 선택기
picker.addEventListener('change', () => strip.add(picker.files));

// 붙여넣기 — 클립보드에 실제로 파일이 있을 때만. 모든 붙여넣기를 가로채면
// 텍스트 붙여넣기가 망가지는데, 그 입력창은 대부분의 시간 동안 바로 그 용도로 쓰입니다.
input.addEventListener('paste', (event) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault();
    strip.add(event.clipboardData.files);
  }
});

// 드래그 앤 드롭
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  strip.add(event.dataTransfer.files);
});

composer.append(strip);
```

이 스트립은 파일마다 한 줄씩 그립니다 — 썸네일(이미지), 이름, 크기, 그리고 제거 버튼. `count`는
호스트에 반영되며 스트립이 비면 `0`이 되는 대신 아예 **제거**되므로, 빈 스트립이 자리를 차지하지
않습니다.

```css
r-attachments:not([count]) {
  display: none;
}
```

### 전송

```js
const body = new FormData();
for (const file of strip.files) body.append('files', file);
await fetch('/api/messages', { method: 'POST', body });
strip.clear();
```

`files`는 순서를 지킨 `File` 객체만 담습니다 — 요청 본문이 원하는 모양 그대로입니다.
`attachments`는 같은 상태를 직접 그려야 할 때 쓰는 더 풍부한 목록(`id`, `name`, `size`, `type`,
`previewUrl`)입니다.

### 거절은 반드시 알리고, 조용히 넘어가지 않습니다

아무도 말해주지 않은 한도를 3MB 넘겼다는 이유로 파일이 사라지면, 사용자에게는 그저 페이지가
고장 난 것으로 보입니다. 모든 거절은 해당 파일과 어긴 규칙을 담아 이벤트를 발생시킵니다.

```js
const explain = {
  'too-large': '그 파일은 5MB를 넘습니다.',
  'type-not-accepted': '여기서는 그 형식의 파일을 받지 않습니다.',
  'too-many': '파일은 최대 4개까지 첨부할 수 있습니다.',
  duplicate: '이미 첨부된 파일입니다.',
};

strip.addEventListener('attachmentrejected', (event) => {
  toast(explain[event.detail.reason]);
});
```

`duplicate`는 이름, 크기, 수정 시각을 함께 비교합니다 — 파일 관리자가 두 파일을 같은 것으로
판단하는 방식 그대로입니다. 같은 파일을 두 번 첨부하는 것은 지시가 아니라 실수입니다.

## API 레퍼런스

### 속성

| 속성          | 어트리뷰트  | 타입                    | 기본값  | 설명                                                          |
| ------------- | ----------- | ----------------------- | ------- | ------------------------------------------------------------- |
| `accept`      | `accept`    | `string`                | `''`    | 쉼표로 구분한 타입 또는 확장자. `<input accept>`과 같은 형식. |
| `maxSize`     | `max-size`  | `number`                | `10 MB` | 허용하는 최대 파일 크기(바이트).                              |
| `maxCount`    | `max-count` | `number`                | —       | 한 번에 준비할 수 있는 파일 수. 지정하지 않으면 제한 없음.    |
| `attachments` | —           | `readonly Attachment[]` | `[]`    | 준비된 파일들. 추가된 순서대로.                               |
| `files`       | —           | `File[]`                | `[]`    | 요청 본문을 만들기 위한 파일 목록.                            |
| `sheet`       | `sheet`     | `string`                | `''`    | 섀도 루트에 주입할 CSS.                                       |

`attachments`와 `files`는 읽기 전용 뷰입니다. 파일 준비는 `add()`로 합니다.

### 메서드

| 메서드       | 반환값         | 설명                                                      |
| ------------ | -------------- | --------------------------------------------------------- |
| `add(files)` | `Attachment[]` | `File` 이터러블을 준비하고, 받아들여진 것들을 돌려줍니다. |
| `detach(id)` | `boolean`      | id로 첨부를 제거합니다. 그런 id가 없으면 `false`.         |
| `clear()`    | `void`         | 전부 제거하고 object URL을 해제합니다.                    |

::: tip `remove(id)`가 아니라 `detach(id)`입니다
모든 요소에는 이미 인자를 받지 않고 자기 자신을 문서에서 떼어내는 `remove()`가 있습니다. 여기에
다른 의미를 덮어씌우면 표준 메서드를 찾던 사람에게 함정이 됩니다.
:::

### 이벤트

| 이벤트               | detail             | 전파              | 설명                                                                                                 |
| -------------------- | ------------------ | ----------------- | ---------------------------------------------------------------------------------------------------- |
| `attachmentschange`  | `{ attachments }`  | bubbles, composed | 준비된 목록이 바뀌었습니다.                                                                          |
| `attachmentrejected` | `{ file, reason }` | bubbles, composed | 파일이 거절되었습니다. `reason`은 `too-large`, `type-not-accepted`, `too-many`, `duplicate` 중 하나. |

### 타입

```ts
interface Attachment {
  id: string; // 이 첨부가 살아 있는 동안 변하지 않음
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string | null; // 이미지는 object URL, 그 외에는 null
}

type AttachmentRejection = 'too-large' | 'type-not-accepted' | 'too-many' | 'duplicate';
```

### Part

`list` · `attachment` · `thumb` · `icon` · `name` · `size` · `remove`

## 미리보기가 동작하는 방식

미리보기는 **data URL이 아니라 object URL**입니다. 미리보기의 비용은 브라우저가 이미 가지고 있는
바이트에 대한 참조 하나뿐이지만, 40px 썸네일 하나를 보여주자고 10MB 사진을 base64 문자열로 읽으면
그 문자열만큼을 그대로 치릅니다. data URL이 필요하다면 나중에, 실제로 전송하는 쪽에서 한 번만
만드세요.

요소가 만든 URL은 요소가 직접 해제합니다 — 첨부를 뗄 때, 비울 때, 그리고 연결이 끊길 때.
`previewUrl`을 해당 첨부의 수명 밖으로 들고 다니지 마세요.

## 접근성

썸네일의 대체 텍스트는 "이미지"가 아니라 **파일 이름**입니다. 네 개의 첨부가 모두 "이미지"라고만
읽힌다면 어느 것이 무엇인지 아무것도 알려주지 못한 셈입니다. 제거 버튼이 각자 파일 이름을 달고
있는 이유도 같습니다.

## 스타일

`<r-attachments>`는 자체 **CSS 사용자 정의 속성 17개**와 테마에서 읽어오는 시맨틱 토큰을
노출합니다. 상속이 닿는 곳이라면 어디든 지정할 수 있습니다 — `:root`, 감싸는 요소, 또는 요소 자신.

```css
r-attachments {
  --ran-attachment-background: var(--ran-color-bg-subtle);
}
```

Part: `attachment` · `icon` · `list` · `name` · `remove` · `size` · `thumb`

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#attachments)에 있고, 어떤 토큰을 골라야 하는지는 [디자인 시스템](/ko/src/ranui/design-system/)이 다룹니다.

## 모범 사례

- **서버에서도 검증하세요.** `accept`와 `max-size`는 첨부하는 사람을 위한 배려이지 보안 경계가
  아닙니다.
- **전송에 성공한 뒤에 비우세요**, 그 전이 아니라. 요청이 실패했다면 다시 시도할 수 있도록 파일이
  그대로 남아 있어야 합니다.
- **거절은 빠짐없이 설명하세요.** 이 이벤트는 스트립이 파일을 조용히 버리는 일이 없도록 존재합니다.
