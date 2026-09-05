---
description: 'ranui Modal(<r-modal>)은 집중된 상호작용을 위한 대화 상자로, 포커스 가두기, 스크롤 잠금, 배경 비활성화, 명령형 Modal.confirm API를 갖췄습니다.'
---

# Modal

현재 페이지 위에서 집중된 상호작용을 하기 위한 대화 상자 컴포넌트입니다. 포커스 가두기, 스크롤 잠금, 배경 비활성화를 갖췄습니다.

> **이럴 때 씁니다.** 페이지 위에 겹쳐 집중된 상호작용을 시키는 대화 상자가 필요하고, 포커스 가두기·스크롤 잠금·배경 비활성화도 함께 원할 때. `<r-modal>`은 `open` 어트리뷰트나 명령형 `Modal.confirm` / `Modal.info` 헬퍼로 다룹니다.

## 빠른 시작

### 기본 사용법

모달이 보이는지는 `open` 어트리뷰트(또는 `open` 프로퍼티)가 정합니다. 처음에는 닫혀 있고 열리기 전까지 아무것도 그리지 않으니, 열고 닫을 트리거를 연결해 주세요.

<Demo>
  <r-button onclick="document.getElementById('quickstart-modal').open = true">모달 열기</r-button>
  <r-modal id="quickstart-modal" heading="기본 모달">
    <p>이것이 모달의 내용입니다.</p>
    <div slot="footer">
      <r-button type="primary" onclick="document.getElementById('quickstart-modal').open = false">확인</r-button>
    </div>
  </r-modal>
</Demo>

```html
<r-button onclick="modal.open = true">모달 열기</r-button>

<r-modal id="modal" heading="기본 모달">
  <p>이것이 모달의 내용입니다.</p>
  <div slot="footer">
    <r-button type="primary" onclick="modal.open = false">확인</r-button>
  </div>
</r-modal>
```

## API 레퍼런스

### 속성

| 속성           | 타입      | 기본값  | 설명                                                     |
| -------------- | --------- | ------- | -------------------------------------------------------- |
| `open`         | `boolean` | `false` | 모달이 보이는지 여부                                     |
| `heading`      | `string`  | `''`    | 헤더 제목 텍스트(비어 있으면 `Modal`로 대체)             |
| `closable`     | `boolean` | `true`  | 닫기(`x`) 버튼을 보일지 여부                             |
| `maskClosable` | `boolean` | `true`  | 배경 마스크를 클릭했을 때 닫을지 여부                    |
| `closeOnEsc`   | `boolean` | `true`  | `Escape`를 눌렀을 때 닫을지 여부                         |
| `lockScroll`   | `boolean` | `true`  | 모달이 열려 있는 동안 body 스크롤을 잠글지 여부          |
| `autoFocus`    | `boolean` | `true`  | 열릴 때 첫 포커스 가능한 요소에 포커스를 줄지 여부       |
| `hideHeader`   | `boolean` | `false` | 제목 표시줄을 통째로 없애고 떠 있는 닫기 버튼만 남깁니다 |
| `sheet`        | `string`  | `''`    | 섀도 DOM에 주입할 CSS                                    |

`closing`은 요소가 자신에게 반영하는 읽기 전용 어트리뷰트입니다(설정할 수 있는 프로퍼티가 아닙니다). `close()`가 실행되는 순간부터 마스크와 대화 상자의 페이드·축소 트랜지션이 실제로 끝날 때까지(약 0.3초 뒤, `afterclose` 이벤트와 같은 시점) 붙어 있습니다. 그 시각적 여운 동안에도 모달을 "아직 있는 것"으로 세어야 하는 호스트 페이지에 유용합니다. 아래 모범 사례를 보세요.

### 제목 `title`

```html
<r-modal open heading="항목 삭제">
  <p>이 항목을 삭제하시겠습니까?</p>
</r-modal>
```

### 닫기 버튼 `closable`

헤더의 닫기 버튼을 숨겨, 직접 만든 컨트롤로만 모달을 닫을 수 있게 합니다.

```html
<r-modal open heading="약관" closable="false">
  <p>계속하려면 약관에 동의해야 합니다.</p>
  <div slot="footer">
    <r-button type="primary">동의</r-button>
  </div>
</r-modal>
```

### 마스크 클릭으로 닫기 `maskClosable`

기본적으로는 배경을 클릭하면 모달이 닫힙니다. `false`로 두면 분명한 동작을 요구할 수 있습니다.

```html
<r-modal open heading="저장하지 않은 변경" maskClosable="false">
  <p>바깥을 클릭해도 이 대화 상자는 닫히지 않습니다.</p>
</r-modal>
```

### Escape로 닫기 `closeOnEsc`

```html
<r-modal open heading="보고서" closeOnEsc="false">
  <p>이 대화 상자에서는 Escape 키가 비활성화되어 있습니다.</p>
</r-modal>
```

### 스크롤 잠금 `lockScroll`

```html
<r-modal open heading="미리보기" lockScroll="false">
  <p>모달 뒤의 페이지는 여전히 스크롤할 수 있습니다.</p>
</r-modal>
```

### 자동 포커스 `autoFocus`

```html
<r-modal open heading="검색" autoFocus="false">
  <input type="text" placeholder="입력해서 검색" />
</r-modal>
```

### 헤더 없는 모드 `hideHeader`

제목 표시줄과 그 경계선을 통째로 없애고, `closable`일 때만 오른쪽 위에 떠 있는 닫기 버튼을 남깁니다. 이미지나 다이어그램 라이트박스처럼 내용만 있는 대화 상자에 어울립니다. 제목 표시줄이 있어 봐야 내용 자리만 갉아먹으니까요. 보이는 `<h3>` 제목이 사라져도 대화 상자는 `aria-label`(`title`에서 만들어집니다)로 접근 가능한 이름을 유지하므로, 헤더 없는 모드에서도 스크린 리더용 레이블로 `title`을 지정하세요.

```html
<r-modal open hide-header>
  <img src="/diagram.png" alt="아키텍처 다이어그램" style="display: block; max-width: 100%;" />
</r-modal>
```

## 슬롯

| 슬롯     | 설명                                               |
| -------- | -------------------------------------------------- |
| (기본)   | 모달의 본문 내용                                   |
| `footer` | 푸터 동작. 이 슬롯이 채워졌을 때만 푸터가 보입니다 |

```html
<r-modal open heading="확인">
  <p>본문 내용은 기본 슬롯에 들어갑니다.</p>
  <div slot="footer">
    <r-button onclick="modal.open = false">취소</r-button>
    <r-button type="primary">확인</r-button>
  </div>
</r-modal>
```

## 이벤트

닫힘과 관련된 모든 이벤트는 무엇이 닫힘을 일으켰는지 알려 주는 `trigger`를 `event.detail`에 싣습니다. 값은 `'mask'`, `'button'`, `'escape'`, `'program'` 중 하나입니다.

| 이벤트        | 취소 가능 | `detail`      | 설명                                             |
| ------------- | --------- | ------------- | ------------------------------------------------ |
| `beforeopen`  | 예        | —             | 열리기 전. `preventDefault()`로 막을 수 있습니다 |
| `open`        | 아니오    | —             | 모달이 열릴 때 발생                              |
| `afteropen`   | 아니오    | —             | 열림 트랜지션이 끝난 뒤 발생                     |
| `beforeclose` | 예        | `{ trigger }` | 닫히기 전. `preventDefault()`로 막을 수 있습니다 |
| `close`       | 아니오    | `{ trigger }` | 모달이 닫힐 때 발생                              |
| `afterclose`  | 아니오    | `{ trigger }` | 닫힘 트랜지션이 끝난 뒤 발생                     |

```html
<r-modal id="modal" heading="예시"></r-modal>

<script>
  const modal = document.getElementById('modal');

  modal.addEventListener('beforeclose', (e) => {
    if (!confirm('변경 사항을 버릴까요?')) e.preventDefault();
  });

  modal.addEventListener('close', (e) => {
    console.log('닫힌 경로:', e.detail.trigger); // 'mask' | 'button' | 'escape' | 'program'
  });
</script>
```

## 코드로 다루는 API

`Modal` 클래스는 마크업 없이 모달을 만들고 붙이고 결과까지 내주는 정적 헬퍼를 제공합니다. 모두 `Promise<{ action, trigger }>`를 반환하며, `action`은 `'confirm'`, `'cancel'`, `'dismiss'` 중 하나입니다.

| 메서드                | 설명                             |
| --------------------- | -------------------------------- |
| `Modal.open(opts)`    | 확인 버튼 하나짜리 모달 열기     |
| `Modal.confirm(opts)` | 확인·취소 버튼이 있는 모달 열기  |
| `Modal.info(opts)`    | 안내 모달(제목 기본값 `Info`)    |
| `Modal.success(opts)` | 성공 모달(제목 기본값 `Success`) |
| `Modal.warning(opts)` | 경고 모달(제목 기본값 `Warning`) |
| `Modal.error(opts)`   | 오류 모달(제목 기본값 `Error`)   |

옵션(모두 선택): `title`, `content`, `okText`, `cancelText`, `showCancel`, `maskClosable`, `closeOnEsc`, `lockScroll`, `autoFocus`, `closable`, `onConfirm`, `onCancel`. `onConfirm` / `onCancel`이 `false`(또는 `false`로 해결되는 프로미스)를 반환하면 모달은 열린 채로 남습니다.

```js
import { Modal } from 'ranui/modal';

const result = await Modal.confirm({
  title: '프로젝트 삭제',
  content: '이 작업은 되돌릴 수 없습니다.',
  okText: '삭제',
  cancelText: '유지',
  onConfirm: async () => {
    await deleteProject();
  },
});

if (result.action === 'confirm') {
  // 삭제됨
}
```

## CSS Part

`::part()`로 내부 조각에 스타일을 줍니다.

| Part     | 설명                   |
| -------- | ---------------------- |
| `root`   | 바깥 오버레이 컨테이너 |
| `mask`   | 대화 상자 뒤의 배경    |
| `dialog` | 대화 상자 본체         |
| `header` | 헤더 막대              |
| `title`  | 제목 헤딩              |
| `close`  | 닫기(`x`) 버튼         |
| `body`   | 스크롤되는 본문 영역   |
| `footer` | 푸터 동작 막대         |

```css
r-modal::part(dialog) {
  border-radius: 8px;
}
r-modal::part(mask) {
  background: rgba(0, 0, 0, 0.6);
}
```

## 스타일

`<r-modal>`은 자체 **CSS 사용자 정의 속성 23개**와 테마에서 읽어오는 시맨틱 토큰을 노출합니다. 상속이 닿는 곳이라면 어디든 지정할 수 있습니다 — `:root`, 감싸는 요소, 또는 요소 자신.

```css
r-modal {
  --ran-modal-mask-background: var(--ran-color-bg-subtle);
}
```

Part: `body` · `close` · `dialog` · `footer` · `header` · `mask` · `root` · `title`

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#modal)에 있고, 어떤 토큰을 쓸지는 [디자인 시스템](/ko/src/ranui/design-system/)이 다룹니다.

## 모범 사례

- **트리거와 토글**: `modal.open = true`로 열고 `modal.open = false`로 닫거나 `close()`를 호출하세요.
- **파괴적인 닫기를 막으세요**: `beforeclose`를 듣고 `preventDefault()`하면, 저장하지 않은 작업을 버리기 전에 확인을 넣을 수 있습니다.
- **푸터 동작**: 주요·보조 버튼은 `slot="footer"`에 두세요. 푸터 막대는 이 슬롯에 내용이 있을 때만 나타납니다.
- **닫을 수 없는 흐름**: `closable="false"`와 `maskClosable="false"`를 함께 두면 분명한 선택을 강제할 수 있습니다.
- **일회성 대화 상자**: 간단한 물음이라면 마크업을 쓰는 대신 `Modal.confirm` / `Modal.info`를 쓰세요.
- **모달이 열린 동안 호스트 페이지를 위로 올릴 때**: `[open]`만이 아니라 `:has(r-modal[open]), :has(r-modal[closing])`에 매칭하세요. `open`은 `close()`가 실행되는 즉시 사라지지만, 마스크와 대화 상자의 트랜지션은 그 뒤로도 0.3초쯤 더 그려집니다. 페이드 도중에 z-index 승격을 거둬들이면, 아직 보이는 마스크가 그동안 위로 올려 두었던 것 아래에서 다시 그려집니다.
