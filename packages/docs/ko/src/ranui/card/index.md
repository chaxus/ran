---
description: '머리말·본문·바닥글 영역을 갖춘 구조화된 콘텐츠 컨테이너. 관련 있는 내용을 묶는 Geist 스타일의 테두리 표면입니다.'
---

# Card

머리말·본문·바닥글 영역을 갖추고 관련 있는 내용을 묶는 구조화된 콘텐츠 컨테이너입니다. 카드는 Geist 스타일의 테두리 표면 (페이지 배경에 1px 테두리이지, 회색 채움이 아닙니다) 이며, `hoverable`을 직접 켜지 않는 한 마우스를 올려도 반응하지 않습니다.

> **이럴 때 쓰세요.** 관련 있는 내용을 제목·설명·본문·바닥글 영역을 갖춘 테두리 표면으로 묶어야 할 때. `<r-card>`는 그 슬롯들과 함께 선택적인 `hoverable` 상호작용 상태를 제공합니다.

## 빠른 시작

### 기본 사용법

<Demo>
  <r-card heading="카드 제목" description="선택적 부제" style="max-width: 360px;">
    <span slot="extra" style="font-size: 12px;">tag</span>
    <p style="margin: 0;">본문 콘텐츠는 기본 슬롯에 들어갑니다.</p>
    <a slot="footer" href="#">메모 보기</a>
  </r-card>
</Demo>

```html
<r-card heading="카드 제목" description="선택적 부제">
  <span slot="extra">tag</span>
  <p>본문 콘텐츠는 기본 슬롯에 들어갑니다.</p>
  <a slot="footer" href="#">메모 보기</a>
</r-card>
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티      | 타입      | 기본값  | 설명                                                              |
| ------------- | --------- | ------- | ----------------------------------------------------------------- |
| `heading`     | `string`  | `''`    | 카드 제목. 머리말 맨 위에 나옵니다. 비면 숨겨집니다.              |
| `description` | `string`  | `''`    | 제목 아래에 그려지는 부제. 비면 숨겨집니다.                       |
| `hoverable`   | `boolean` | `false` | 상호작용 카드. 마우스를 올리면 테두리가 짙어지고 살짝 떠오릅니다. |
| `sheet`       | `string`  | `''`    | 카드의 섀도 DOM 에 주입할 CSS.                                    |

### 제목 `heading`

카드 제목이며 머리말 맨 위에 나옵니다. 비면 숨겨집니다.

<Demo>
  <r-card heading="제목만" style="max-width: 360px;">
    <p style="margin: 0;">본문 콘텐츠.</p>
  </r-card>
</Demo>

```html
<r-card heading="제목만">
  <p>본문 콘텐츠.</p>
</r-card>
```

### 설명 `description`

제목 아래에 그려지는 부제입니다. 비면 숨겨집니다. `title`도 `description`도 지정하지 않으면 머리말 전체가 숨겨집니다.

<Demo>
  <r-card heading="제목" description="짧은 보조 부제" style="max-width: 360px;">
    <p style="margin: 0;">본문 콘텐츠.</p>
  </r-card>
</Demo>

```html
<r-card heading="제목" description="짧은 보조 부제">
  <p>본문 콘텐츠.</p>
</r-card>
```

### 상호작용 카드 `hoverable`

카드는 기본적으로 마우스에 반응하지 않습니다. 실제로 클릭되는 카드에만 `hoverable` 어트리뷰트를 붙이세요. 마우스를 올리면 테두리가 회색 사다리에서 한 단계 짙어지고 (`--ran-color-border` → `--ran-color-border-hover`) 표면이 조용한 떠오름 그림자 (`--ran-shadow-elevated`) 를 입습니다.

<Demo>
  <r-card hoverable heading="호버되는 카드" description="마우스를 올려 보세요" style="max-width: 360px; cursor: pointer;">
    <p style="margin: 0;">테두리가 짙어지고 카드가 살짝 떠오릅니다.</p>
  </r-card>
</Demo>

```html
<r-card hoverable heading="호버되는 카드" description="마우스를 올려 보세요">
  <p>테두리가 짙어지고 카드가 살짝 떠오릅니다.</p>
</r-card>
```

`hoverable`은 순전히 보이는 것에 관한 것입니다. 클릭에 반응하는 카드에만 쓰고, 상호작용하지 않는 카드는 반응하지 않게 두세요.

### 외부 스타일 `sheet`

카드의 섀도 DOM 에 주입하는 CSS 로, 다른 모든 ranui 컴포넌트와 같은 `sheet` 관례를 따릅니다.

```html
<r-card heading="테마를 입힌 카드" sheet=".ran-card { background: #f6ffed; }">
  <p>본문 콘텐츠.</p>
</r-card>
```

## 슬롯

| 슬롯     | 설명                                                        |
| -------- | ----------------------------------------------------------- |
| _(기본)_ | 본문 콘텐츠. 카드 본문에 그려집니다.                        |
| `extra`  | 머리말 오른쪽: 배지, 링크, 동작.                            |
| `footer` | 바닥글 콘텐츠. 이 슬롯에 노드가 들어오기 전까지 숨겨집니다. |

## CSS Part

카드는 바깥에서 스타일을 주도록 다음 `::part()` 고리를 공개합니다.

| Part          | 설명                         |
| ------------- | ---------------------------- |
| `card`        | 카드의 바깥 컨테이너.        |
| `header`      | 머리말 줄.                   |
| `title`       | 제목 텍스트.                 |
| `description` | 부제 텍스트.                 |
| `extra`       | 머리말의 `extra` 슬롯.       |
| `body`        | 본문 영역 (기본 슬롯).       |
| `footer`      | 바닥글 영역 (`footer` 슬롯). |

덮어쓸 수 있는 CSS 변수: `--ran-card-display`, `--ran-card-min-height`, `--ran-card-gap`, `--ran-card-padding`, `--ran-card-radius`, `--ran-card-background`, `--ran-card-border-color`, `--ran-card-shadow`, `--ran-card-hover-border-color`, `--ran-card-hover-shadow`(뒤의 둘은 `hoverable`일 때 적용), `--ran-card-title-color`, `--ran-card-title-font-size`, `--ran-card-title-font-weight`, `--ran-card-description-color`, `--ran-card-description-font-size`.

```css
r-card {
  --ran-card-background: var(--surface-2);
  --ran-card-radius: 12px;
  --ran-card-min-height: 148px;
}
r-card::part(header) {
  border-bottom: 1px solid var(--line);
}
```

## 이벤트

카드는 수동적인 컨테이너이며 커스텀 이벤트를 디스패치하지 않습니다.

## 권장 사항

- **제목과 설명**: 제목에는 `title`을, 짧은 보조 문구에는 `description`을 쓰세요. 둘 다 생략하면 머리말이 통째로 숨겨집니다.
- **본문 콘텐츠**: 핵심 내용은 기본 슬롯에 두세요.
- **머리말 동작**: 머리말 오른쪽에 붙는 배지, 링크, 동작에는 `extra` 슬롯을 쓰세요.
- **바닥글**: 보조 동작이나 링크에는 `footer` 슬롯을 쓰세요. 내용을 넣기 전까지는 숨겨져 있습니다.
- **호버 피드백**: 클릭되는 카드에만 `hoverable`을 붙이세요. 상호작용하지 않는 카드는 마우스에 반응해서는 안 됩니다.
- **테마**: 재사용할 스타일이라면 `sheet` 어트리뷰트보다 CSS 변수와 `::part()`를 먼저 쓰세요.
