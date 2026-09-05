---
description: 'Mermaid 다이어그램 (플로차트, 시퀀스, 클래스, 상태, 간트) 을 지연 로딩으로 렌더링하는 프레임워크 비종속 웹 컴포넌트.'
---

# Mermaid

[Mermaid](https://mermaid.js.org/) 다이어그램 (플로차트, 시퀀스, 클래스, 상태, 간트…) 을 프레임워크에
얽매이지 않는 웹 컴포넌트로 렌더링합니다. `<r-mermaid>`는 첫 렌더 때 mermaid 라이브러리를 지연
로딩하고 (쓰지 않는 앱은 아무 비용도 치르지 않습니다) 다이어그램을 자기 섀도 루트에 그리므로, 페이지
스타일에서 격리됩니다.

> **이럴 때 쓰세요.** mermaid 를 직접 배선하지 않고 텍스트로 쓴 다이어그램을 아무 페이지에나 넣고 싶을
> 때. 원하면 복사 / 다운로드 / 전체화면 툴바와 이동·확대 뷰어까지 붙습니다.

## 빠른 시작

<Demo>
  <r-mermaid>graph LR; A[Request] --> B[Validate]; B --> C[Store]; C --> D[Respond]</r-mermaid>
</Demo>

```html
<r-mermaid>graph LR; A[Request] --> B[Validate]; B --> C[Store]</r-mermaid>
```

```js
import 'ranui'; // 또는 단독 엔트리:
import 'ranui/mermaid';
```

다이어그램 원본은 엘리먼트의 **텍스트 콘텐츠**에서 읽거나, URI 로 인코딩된 `code` 어트리뷰트에서
읽습니다 (문법에 `<`가 들어갈 때, 예를 들어 `classDiagram`의 `<|--`는 HTML 파싱을 견디도록 `code`를
쓰세요).

```js
el.code = 'classDiagram\n  Dog --|> Animal'; // 프로퍼티 세터가 URI 인코딩을 대신 해 줍니다
```

## 컨트롤

모든 컨트롤은 불리언 어트리뷰트로 **직접 켜야** 합니다. 아무것도 붙이지 않은 `<r-mermaid>`는 깔끔한
정적 다이어그램입니다. 툴바는 마우스를 올리면 오른쪽 위에 나타납니다.

<Demo>
  <r-mermaid copy download fullscreen>graph TD; A[Start] --> B[Do work]; B --> C[End]</r-mermaid>
</Demo>

```html
<r-mermaid copy download fullscreen>graph TD; A --> B; B --> C</r-mermaid>
```

- **copy**: 다이어그램 원본을 클립보드에 복사합니다.
- **download**: SVG / PNG / 원본 (`.mmd`). 형식이 하나면 곧바로 내려받고, 여럿이면 메뉴를 보여 줍니다.
  `download="svg"`나 `download="svg png"`로 제한할 수 있습니다.
- **fullscreen**: 헤더 없는 라이트박스 (r-modal) 를 열어 **이동과 확대**를 지원합니다 (휠로 확대, 드래그로
  이동, 초기화 있음). 닫기는 ✕, 배경 클릭, 또는 `Esc`입니다.

## API 레퍼런스

### 어트리뷰트

| 어트리뷰트   | 타입                          | 기본값   | 설명                                                                                                                                                                     |
| ------------ | ----------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `code`       | `string` (URI 인코딩)         | —        | 다이어그램 원본. 없으면 엘리먼트의 텍스트 콘텐츠로 물러납니다.                                                                                                           |
| `theme`      | `'auto' \| 'light' \| 'dark'` | `'auto'` | mermaid 테마. `auto`는 페이지 (`.dark` / `[data-ran-theme]`) 를 따르고 전환 때 다시 렌더링합니다.                                                                        |
| `copy`       | 불리언                        | 꺼짐     | 원본 복사 버튼을 보입니다.                                                                                                                                               |
| `download`   | 불리언 / `"svg png source"`   | 꺼짐     | 다운로드 버튼을 보입니다. 값으로 제공 형식을 제한합니다.                                                                                                                 |
| `fullscreen` | 불리언                        | 꺼짐     | 전체화면 버튼을 보입니다.                                                                                                                                                |
| `sheet`      | `string`                      | —        | 섀도 루트에 주입할 추가 CSS.                                                                                                                                             |
| `label-*`    | `string`                      | 영어     | 컨트롤 레이블 덮어쓰기: `label-copy`, `label-download`, `label-fullscreen`, `label-zoom-in`, `label-zoom-out`, `label-reset`, `label-diagram`(전체화면 다이얼로그 이름). |

## 이벤트

모든 이벤트는 버블링되고 섀도 경계를 넘습니다 (`composed`).

| 이벤트             | `detail`                                 | 발생 시점                                |
| ------------------ | ---------------------------------------- | ---------------------------------------- |
| `render`           | `{ ok: true }`                           | 다이어그램 렌더링이 끝났을 때            |
| `copied`           | `{ kind: 'source' }`                     | 원본을 복사했을 때                       |
| `download`         | `{ format: 'svg' \| 'png' \| 'source' }` | 파일을 내려받았을 때                     |
| `error`            | `{ message: string }`                    | 다이어그램 파싱·렌더링이 실패했을 때     |
| `fullscreenchange` | `{ open: boolean }`                      | 전체화면 라이트박스가 열리거나 닫혔을 때 |

## CSS Part

| Part      | 설명                              |
| --------- | --------------------------------- |
| `mermaid` | 바깥 래퍼.                        |
| `diagram` | 렌더링된 다이어그램 컨테이너.     |
| `toolbar` | 마우스를 올리면 나오는 컨트롤 바. |
| `button`  | 툴바의 각 아이콘 버튼.            |
| `error`   | 오류 메시지 상자 (렌더 실패 시).  |

```css
r-mermaid::part(toolbar) {
  background: var(--surface);
}
```

## CSS 변수

엘리먼트에서 덮어쓰세요 (각각 의미 토큰으로, 다시 리터럴로 물러납니다):
`--ran-mermaid-padding`, `--ran-mermaid-toolbar-background`, `--ran-mermaid-toolbar-gap`,
`--ran-mermaid-button-size`, `--ran-mermaid-button-color`, `--ran-mermaid-button-hover-background`,
`--ran-mermaid-error-color`.

## 참고

- **지연 로딩**: mermaid(그리고 전체화면에 쓰는 r-modal) 는 동적 import 라서, 다이어그램이 렌더링되거나
  전체화면이 열릴 때만 별도 비동기 청크로 도착합니다.
- **렌더 충실도**: `<r-mermaid>`는 mermaid 자체 렌더를 쓰므로 모든 다이어그램 종류와 테마를
  지원합니다.
- **PNG 내보내기**: HTML 레이블 (mermaid 의 `htmlLabels`) 을 쓰는 다이어그램은 `<foreignObject>`로
  그려지는데, 이는 canvas 를 오염시켜 PNG 내보내기를 실패하게 만들 수 있습니다. 그럴 때는 `error`
  이벤트가 디스패치됩니다. SVG 와 원본 내보내기는 언제나 동작합니다.
