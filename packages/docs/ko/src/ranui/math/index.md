---
description: 'Temml 로 LaTeX 수식을 네이티브 MathML 로 렌더링합니다. canvas 도 SVG 도 KaTeX 런타임도 쓰지 않습니다.'
---

# Math

Temml 을 써서 HTML 페이지에 품질 좋은 LaTeX 수식을 렌더링합니다. 네이티브 MathML 로 곧장 컴파일합니다.

> **이럴 때 쓰세요.** HTML 페이지 안에서 LaTeX 수식을 블록 수식으로 렌더링해야 할 때. `<r-math>`는 `latex` 어트리뷰트의 식을 [Temml](https://temml.org/)로 조판합니다. Temml 은 LaTeX 을 MathML 로 컴파일하고, 배치는 브라우저가 직접 합니다 (canvas 도 SVG 도, KaTeX 런타임도 없습니다).

## 빠른 시작

### 기본 사용법

<ran-demo>
  <r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
</ran-demo>

```html
<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티   | 타입      | 기본값    | 설명                                                                                      |
| ---------- | --------- | --------- | ----------------------------------------------------------------------------------------- |
| `latex`    | `string`  | `''`      | 렌더링할 LaTeX 식. 슬롯 텍스트가 아니라 이 어트리뷰트로 줍니다.                           |
| `display`  | `string`  | `'block'` | `block`(블록 수식) 또는 `inline`(인라인 수식).                                            |
| `font`     | `string`  | `''`      | `system`으로 두면 내장 Latin Modern Math 대신 사용자의 시스템 수식 글꼴을 씁니다.         |
| `macros`   | `string`  | `''`      | Temml 매크로를 담은 JSON 객체. 잘못된 JSON 은 조용히 무시됩니다.                          |
| `wrap`     | `string`  | `''`      | Temml 의 부드러운 줄바꿈: `none`, `tex`, `=`.                                             |
| `copy`     | `boolean` | `false`   | 복사 버튼을 보입니다. `copy`만 쓰면 LaTeX 원본을, `copy="mathml"`은 MathML 을 복사합니다. |
| `download` | `boolean` | `false`   | 원본 (`.tex`) 이나 MathML(`.mml`) 을 내려받는 버튼·메뉴를 보입니다.                       |
| `sheet`    | `string`  | `''`      | 컴포넌트의 섀도 DOM 에 주입할 CSS.                                                        |

> 💡 **참고**: `latex` 프로퍼티의 게터는 값을 `decodeURIComponent`로 디코딩하므로, URI 인코딩된 식은 렌더링 전에 디코딩됩니다. 식을 슬롯 텍스트로 넣어도 아무 효과가 없습니다. 렌더링되는 것은 `latex` 어트리뷰트뿐입니다.

### 식 `latex`

<ran-demo>
  <r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
</ran-demo>

```html
<r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
```

### 외부 스타일 `sheet`

<ran-demo>
  <r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
</ran-demo>

```html
<r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
```

## 이벤트

| 이벤트     | detail                             | 발생 시점                                              |
| ---------- | ---------------------------------- | ------------------------------------------------------ |
| `render`   | `{ ok: true }`                     | 식이 성공적으로 렌더링되었을 때.                       |
| `error`    | `{ message: string }`              | Temml 이 식을 파싱하지 못했을 때 (잘못된 LaTeX 등).    |
| `copied`   | `{ kind: 'source' \| 'mathml' }`   | 복사 버튼이 원본이나 MathML 을 클립보드에 복사했을 때. |
| `download` | `{ format: 'source' \| 'mathml' }` | 다운로드 버튼이 `.tex`나 `.mml` 파일을 저장했을 때.    |

## 스타일

`<r-math>`는 자체 **CSS 커스텀 프로퍼티 16 개**와 테마에서 읽어 오는 의미 토큰을 공개합니다. 상속이 닿는 곳이면 어디에나 지정하세요 — `:root`, 바깥 컨테이너, 또는 엘리먼트 자체.

```css
r-math {
  --ran-math-error-background: var(--ran-color-bg-subtle);
}
```

Part: `button` · `error` · `math` · `menu` · `render` · `toolbar`

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#math)에, 어떤 토큰을 쓸지는 [디자인 시스템](/ko/src/ranui/design-system/)에 있습니다.

## 권장 사항

- **식은 `latex`로 주세요**: 식은 `latex` 어트리뷰트에 지정합니다. 슬롯 텍스트는 렌더링되지 않습니다.
- **JavaScript 에서는 역슬래시를 이스케이프하세요**: JS 문자열 리터럴로 `latex`를 대입할 때 `\`는 이스케이프해야 합니다 (예: `'\\frac{1}{2}'`).
- **파싱 실패에 대비하세요**: 모든 식이 올바른 LaTeX 이라고 가정하지 말고 `error`를 구독하세요 (또는 렌더링된 `::part(error)` 상자를 확인하세요).
- **`sheet`로 배치를 바꾸세요**: 내부 `.ran-math` 배치를 덮어써야 할 때 `sheet` 어트리뷰트를 쓰세요.
