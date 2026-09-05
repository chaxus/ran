---
description: 'ranui DisclosureRow(<r-disclosure-row>)는 "제목 · 요약"을 한 줄에 담고 펼치면 본문을 드러내는 행으로, 뒤에서 작업이 도는 동안 줄 위로 빛이 흐릅니다.'
---

# DisclosureRow

`[앞머리] 제목 · 요약`을 한 줄에 담고, 펼치면 본문을 드러내는 틀입니다. `<r-reasoning>`과 `<r-tool-card>`가 함께 쓰는 행이라, 둘이 섞인 기록에서도 펼침의 어휘가 둘로 갈리지 않습니다.

> **이럴 때 씁니다.** 더 큰 무언가(도구 호출, 생각의 흐름, 로그 묶음)를 대신하는 짧은 한 줄이 있고, 그 상세는 요청받기 전까지 감춰 두는 편이 나을 때.

## 빠른 시작

### 기본 사용법

<Demo column>
  <r-disclosure-row heading="파일 읽기" summary="packages/ranui/index.ts" expandable>
    <div style="padding:8px 0">행이 열려 있는 동안 본문이 나타납니다.</div>
  </r-disclosure-row>
</Demo>

```html
<r-disclosure-row heading="파일 읽기" summary="packages/ranui/index.ts" expandable>
  <div>행이 열려 있는 동안 본문이 나타납니다.</div>
</r-disclosure-row>
```

**heading은 너비가 정해진 왼쪽 절반**이고 **summary는 넘치면 잘리는 오른쪽 절반**입니다. 그래서 요약이 아무리 길어도 행을 세로로 쌓았을 때 같은 등뼈에 맞춰 정렬됩니다. 요약이 비면 구분 기호도 함께 사라집니다.

### 작업이 도는 동안

`busy`는 행 위로 빛의 띠를 흘려보냅니다. 스피너는 "어딘가에서 무언가가 벌어지고 있다"만 알려 주지만, 행 위를 지나는 빛은 어느 행이 아직 일하고 있는지 짚어 줍니다.

<Demo column>
  <r-disclosure-row heading="테스트 실행" summary="2351개 통과" busy expandable></r-disclosure-row>
  <r-disclosure-row heading="테스트 실행" summary="2351개 통과" expandable></r-disclosure-row>
</Demo>

### 앞머리 표시자와 함께

`leading` 슬롯과 꺾쇠는 같은 그리드 칸을 나눠 쓰므로, 둘이 자리를 바꿔도 레이아웃 비용이 들지 않고 제목이 포인터 아래에서 밀리지도 않습니다.

`leading`에 아무것도 넣지 않으면 꺾쇠는 계속 보입니다. 이 행이 열린다는 것을 읽는 사람에게 알려 주는 표시가 그것뿐이기 때문입니다. 앞머리에 내용이 있으면 꺾쇠는 호버할 때, 포커스가 갔을 때, 그리고 열려 있는 동안 나타나고, 그 밖의 시간에는 상태 표시자가 자리를 지킵니다.

<Demo column>
  <r-disclosure-row heading="빌드" summary="4.2초 만에 실패" tone="error" expandable>
    <r-state-dot slot="leading" state="error"></r-state-dot>
    <div style="padding:8px 0">번들이 크기 한도를 넘었습니다.</div>
  </r-disclosure-row>
</Demo>

```html
<r-disclosure-row heading="빌드" summary="4.2초 만에 실패" tone="error" expandable>
  <r-state-dot slot="leading" state="error"></r-state-dot>
  <div>번들이 크기 한도를 넘었습니다.</div>
</r-disclosure-row>
```

## API 레퍼런스

### 속성

| 속성         | 어트리뷰트   | 타입      | 기본값  | 설명                                                          |
| ------------ | ------------ | --------- | ------- | ------------------------------------------------------------- |
| `heading`    | `heading`    | `string`  | `''`    | 너비가 정해진 왼쪽 절반.                                      |
| `summary`    | `summary`    | `string`  | `''`    | 넘치면 잘리는 오른쪽 절반. 비우면 구분 기호도 함께 사라집니다. |
| `open`       | `open`       | `boolean` | `false` | 본문을 보일지 여부. 어트리뷰트로 반영되므로 `:has([open])`이 통합니다. |
| `expandable` | `expandable` | `boolean` | `false` | 열어 볼 만한 본문이 있는지 여부.                              |
| `busy`       | `busy`       | `boolean` | `false` | 이 행이 대신하는 작업이 아직 도는지 여부.                     |
| `tone`       | `tone`       | `string`  | `''`    | `error`는 요약에 색을 입힙니다. 그 밖의 값은 평범한 색조입니다. |
| `name`       | `name`       | `string`  | `''`    | 행을 묶어, 하나를 열면 나머지가 닫히게 합니다.                |
| `sheet`      | `sheet`      | `string`  | `''`    | 섀도 루트에 주입할 CSS.                                       |

::: warning 어트리뷰트는 `title`이 아니라 `heading`입니다
`title`은 브라우저가 툴팁으로 그려 주는 네이티브 `HTMLElement` 어트리뷰트입니다. 그러니 이것을 제목으로 쓰는 컴포넌트는 인스턴스마다 화면에 이미 있는 글자를 그대로 되풀이하는 툴팁을 돋게 만들고, 한번 붙으면 그것을 끌 방법이 없습니다. `<r-card>`와 `<r-modal>`도 같은 이유로 같은 이름을 바꿔 씁니다.
:::

### 이벤트

| 이벤트                   | detail              | 전파                       | 설명                              |
| ------------------------ | ------------------- | -------------------------- | --------------------------------- |
| `disclosurebeforetoggle` | `{ open: boolean }` | bubbles, composed, 취소 가능 | 행이 막 펼쳐지거나 접히려는 참.   |
| `disclosuretoggle`       | `{ open: boolean }` | bubbles, composed          | 행이 펼쳐졌거나 접혔습니다.       |

::: warning 이벤트는 `toggle`이 아니라 `disclosuretoggle`입니다
`toggle`은 `<details>`가 내보내는 것이고, 그 `ToggleEvent`는 `detail` 대신 `oldState` / `newState`를 싣습니다. 플랫폼 이름에 맞춰 타입을 준 리스너는 그 안에서 아무것도 찾지 못합니다. 상태는 요소에서 읽으세요: `row.open`.
:::

```js
row.addEventListener('disclosuretoggle', () => {
  console.log(row.open ? 'opened' : 'closed');
});
```

`disclosurebeforetoggle`이 먼저 발생하고 거절할 수 있습니다. 덕분에 "처음 열릴 때 본문을 가져온다", "편집이 저장되지 않은 동안에는 접기를 거부한다" 같은 것을 표현할 수 있습니다. 플랫폼에는 같은 것이 없습니다. `<details>`는 사후의 `toggle`만 내보내고, 취소 가능한 `beforetoggle`을 달라는 요청은 아직 열려 있습니다.

```js
row.addEventListener('disclosurebeforetoggle', async (event) => {
  if (!event.detail.open || row.dataset.loaded) return;
  event.preventDefault(); // 본문이 준비될 때까지 닫아 둡니다
  row.append(await fetchBody());
  row.dataset.loaded = 'true';
  row.open = true;
});
```

이 이벤트는 눌렀을 때만 발생합니다. 코드에서 준 `row.open = true`는 애플리케이션이 스스로 마음을 바꾼 것이라, 물어볼 상대가 없습니다.

### 한 번에 하나만

`name`은 `<details>`의 `name`처럼 행을 묶습니다. 하나를 열면 나머지가 닫힙니다. 묶음의 범위는 문서 전체이고, 행끼리 형제일 필요도 없습니다.

```html
<r-disclosure-row name="run" heading="Install" expandable>…</r-disclosure-row>
<r-disclosure-row name="run" heading="Build" expandable>…</r-disclosure-row>
<r-disclosure-row name="run" heading="Test" expandable>…</r-disclosure-row>
```

### 접근성

행이 컨트롤이 되는 것은 열 것이 있을 때뿐입니다. `expandable`이 붙은 행은 `role="button"`, 탭 정지, `aria-expanded`, 그리고 본문을 가리키는 `aria-controls`를 지닙니다. 붙지 않은 행은 그중 무엇도 지니지 않습니다. 그냥 글줄을 버튼이라고 알리면 아무 일도 없는 누름을 불러오기 때문입니다. `busy`는 `aria-busy`를 세우므로, 흐르는 빛만이 "아직 도는 중"이라는 신호가 아니게 됩니다.

접힌 본문은 애니메이션할 수 있도록 제거되는 대신 잘려 나갑니다. 아울러 `inert`가 되고 내용은 `content-visibility: hidden`으로 건너뛰므로, 닫혀 있는 동안에는 탭 순서에서도 렌더 경로에서도 빠집니다.

행의 높이는 24px로 WCAG 2.5.8의 최소치와 정확히 같고, 행끼리 틈 없이 쌓입니다. 굵은 포인터에서는 기본 높이가 32px이 됩니다. 누를 수 있는 영역을 행보다 크게 키우면 위 행과 겹치는데, 그러면 작은 표적을 잘못된 표적으로 바꾸는 셈이기 때문입니다. `--ran-disclosure-row-height`를 지정하면 어떤 입력 방식에서든 높이가 고정됩니다.

### 슬롯

| 슬롯      | 내용                                                          |
| --------- | ------------------------------------------------------------- |
| `default` | 본문. `open`인 동안 드러납니다.                               |
| `leading` | 제목 앞의 표시자. 보통 `<r-state-dot>`.                       |
| `heading` | 왼쪽 절반의 마크업. `heading` 어트리뷰트의 평문을 대신합니다. |
| `summary` | 오른쪽 절반의 마크업. `summary` 어트리뷰트의 평문을 대신합니다. |

`heading`과 `summary`는 어트리뷰트로 평범한 문자열을 받으며, 도구 호출 행에는 대개 그것으로 충분합니다. 그 절반이 마크업을 품어야 할 때(코드, 링크, 약어 같은 것) 슬롯에 넣으세요. 어트리뷰트의 글자는 슬롯의 대체 내용이므로, 슬롯에 넣은 것이 그대로 자리를 대신합니다.

```html
<r-disclosure-row expandable>
  <code slot="heading">fetch()</code>
  <a slot="summary" href="https://example.com">https://example.com</a>
  <pre>…</pre>
</r-disclosure-row>
```

슬롯에 넣은 내용도 줄의 절반으로 셈하므로, 구분 기호는 어트리뷰트를 쓸 때와 똑같이 나타나고 사라집니다.

### Part

`row` · `leading` · `title` · `separator` · `summary` · `disclosure` · `body`

## 스타일

`<r-disclosure-row>`는 자체 **CSS 사용자 정의 속성 15개**와 테마에서 읽어오는 시맨틱 토큰을 노출합니다. 상속이 닿는 곳이라면 어디든 지정할 수 있습니다 — `:root`, 감싸는 요소, 또는 요소 자신.

```css
r-disclosure-row {
  --ran-disclosure-hover-background: var(--ran-color-bg-subtle);
}
```

Part: `body` · `disclosure` · `leading` · `row` · `separator` · `summary` · `title`

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#disclosure-row)에 있고, 어떤 토큰을 골라야 하는지는 [디자인 시스템](/ko/src/ranui/design-system/)이 다룹니다.

## 모범 사례

- **행에 본문을 주거나, 아니면 펼칠 수 있게 만들지 마세요.** 빈 공간으로 열리는 꺾쇠는 아무 쓸모가 없습니다. `expandable`을 빼면 행은 한 줄로 남습니다.
- **제목은 정해진 어휘로 유지하고**(`파일 읽기`, `테스트 실행`, `검색`) 변하는 부분은 요약에 두세요. 행을 세로로 쌓았을 때 눈으로 훑을 수 있는 것은 그 덕분입니다.
- **`tone="error"`는 반드시 말과 함께 쓰고, 색에만 기대지 마세요.** 무엇이 실패했는지는 요약이 말해야 합니다.
