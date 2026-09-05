---
description: '슬롯 본문 위에 접근성 있는 제목과 부제 (둘 다 선택) 를 두는 페이지 구역 표면입니다.'
---

# Section

슬롯 본문 위에 제목과 부제 (둘 다 선택) 를 두는 페이지 구역 표면입니다.

> **이럴 때 쓰세요.** 페이지의 주요 영역을 접근성 있는 2 단계 제목과 선택적 부제로 표시해야 할 때. `<r-section>`이 제목 줄과 본문 표면을 제공합니다.

## 빠른 시작

### 기본 사용법

<Demo align="stretch">
  <r-section heading="구역 제목" subtitle="이 구역을 설명하는 짧은 한 줄.">
    <p style="margin: 0;">본문 콘텐츠는 기본 슬롯에 들어갑니다.</p>
  </r-section>
</Demo>

```html
<r-section heading="구역 제목" subtitle="이 구역을 설명하는 짧은 한 줄.">
  <p>본문 콘텐츠는 기본 슬롯에 들어갑니다.</p>
</r-section>
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티   | 타입     | 기본값 | 설명                                         |
| ---------- | -------- | ------ | -------------------------------------------- |
| `heading`  | `string` | `''`   | 구역 제목. ARIA 2 단계 제목으로 렌더링됩니다 |
| `subtitle` | `string` | `''`   | 제목 아래에 붙는 보조 한 줄                  |
| `sheet`    | `string` | `''`   | 구역의 섀도 DOM 에 주입할 CSS                |

`heading`과 `subtitle`이 모두 비어 있으면 제목 줄 전체가 숨겨집니다.

### 제목 `heading`

구역 제목이며 ARIA 2 단계 제목 (`role="heading"`, `aria-level="2"`) 으로 렌더링됩니다. 비어 있으면 숨겨집니다.

<Demo align="stretch">
  <r-section heading="제목만">
    <p style="margin: 0;">본문 콘텐츠.</p>
  </r-section>
</Demo>

```html
<r-section heading="제목만">
  <p>본문 콘텐츠.</p>
</r-section>
```

### 부제 `subtitle`

제목 아래에 붙는 보조 한 줄입니다. 비어 있으면 숨겨집니다.

<Demo align="stretch">
  <r-section heading="제목" subtitle="보조 부제 텍스트.">
    <p style="margin: 0;">본문 콘텐츠.</p>
  </r-section>
</Demo>

```html
<r-section heading="제목" subtitle="보조 부제 텍스트.">
  <p>본문 콘텐츠.</p>
</r-section>
```

### 섀도 CSS `sheet`

구역의 섀도 DOM 에 주입하는 CSS 로, 다른 모든 ranui 컴포넌트와 같은 `sheet` 관례를 따릅니다.

<Demo align="stretch">
  <r-section heading="테마를 입힌 구역" subtitle="sheet로 제목 색을 바꿨습니다." sheet=".ran-section-heading { color: #006bff; }">
    <p style="margin: 0;">본문 콘텐츠.</p>
  </r-section>
</Demo>

```html
<r-section heading="테마를 입힌 구역" sheet=".ran-section-heading { color: #006bff; }">
  <p>본문 콘텐츠.</p>
</r-section>
```

## 슬롯

| 슬롯     | 설명                                    |
| -------- | --------------------------------------- |
| _(기본)_ | 본문 콘텐츠. 제목 줄 아래에 그려집니다. |

## CSS Part

| Part       | 설명                         |
| ---------- | ---------------------------- |
| `header`   | 제목과 부제를 감싸는 제목 줄 |
| `heading`  | ARIA 2 단계 제목 엘리먼트    |
| `subtitle` | 보조 부제 줄                 |
| `body`     | 기본 슬롯을 감싸는 본문 래퍼 |

공개된 CSS 변수: `--ran-section-border-color`, `--ran-section-radius`, `--ran-section-background`, `--ran-section-shadow`, `--ran-section-padding`, `--ran-section-heading-color`, `--ran-section-heading-font-size`, `--ran-section-heading-font-weight`, `--ran-section-subtitle-color`.

```css
r-section {
  --ran-section-background: var(--surface-1);
  --ran-section-padding: 32px;
  --ran-section-heading-color: var(--text-strong);
}
r-section::part(subtitle) {
  max-width: 48ch;
}
```

## 권장 사항

- **구역 제목**: 페이지의 주요 영역마다 `heading`을 지정해 이름을 붙이세요.
- **맥락**: 짧은 보조 문구에는 `subtitle`을 쓰고, 둘 다 생략하면 제목 줄 없는 민 표면이 됩니다.
- **접근성**: 제목은 ARIA 2 단계 제목으로 노출되어 문서 개요에 참여합니다. 의미 있는 제목을 쓰세요.
- **테마**: 재사용할 스타일이라면 `sheet` 어트리뷰트보다 `--ran-section-*` CSS 변수나 `::part()` 선택자를 먼저 쓰세요.
