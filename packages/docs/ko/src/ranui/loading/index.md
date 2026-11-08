---
description: 'ranui 의 Loading(<r-loading>) 은 콘텐츠나 작업이 진행 중일 때 회전하는 표시를 보여 줍니다.'
---

# Loading

진행 중인 작업을 알리는 애니메이션 표시를 모아 둔 로딩 컴포넌트입니다.

> **이럴 때 쓰세요.** 작업이 진행 중임을 알리는 애니메이션 스피너가 필요할 때. `<r-loading>`은 `name`으로 고르는 약 30 가지 내장 애니메이션을 제공하고, CSS 변수로 테마를 입힐 수 있습니다.

## 빠른 시작

### 기본 사용법

<ran-demo>
  <r-loading name="circle"></r-loading>
</ran-demo>

```html
<r-loading name="circle"></r-loading>
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티 | 타입     | 기본값     | 설명                                                                |
| -------- | -------- | ---------- | ------------------------------------------------------------------- |
| `name`   | `string` | `'circle'` | 애니메이션 종류. 지정하지 않거나 알 수 없으면 `circle`로 돌아갑니다 |
| `sheet`  | `string` | `''`       | 바깥에서 스타일을 주도록 컴포넌트의 섀도 DOM 에 주입할 CSS 텍스트   |

### 로딩 종류 `name`

`name`을 내장 애니메이션 종류 가운데 하나로 지정하세요. 모르는 값은 아무것도 그리지 않습니다 (아래 목록의 이름만 처리됩니다).

<ran-demo>
  <r-loading name="double-bounce"></r-loading>
  <r-loading name="rotate"></r-loading>
  <r-loading name="stretch"></r-loading>
  <r-loading name="cube"></r-loading>
</ran-demo>

```html
<r-loading name="double-bounce"></r-loading>
<r-loading name="rotate"></r-loading>
<r-loading name="stretch"></r-loading>
<r-loading name="cube"></r-loading>
```

지정할 수 있는 값:

`double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`

### 외부 스타일 `sheet`

`sheet` 어트리뷰트는 컴포넌트의 섀도 루트에 CSS 를 그대로 주입해, 빌드 단계 없이 바깥에서 내부 규칙을 덮어쓸 수 있게 합니다.

```html
<r-loading name="circle" sheet=".circle { transform: scale(1.5); }"></r-loading>
```

## 스타일 덮어쓰기

모든 애니메이션은 전적으로 CSS 변수로 테마가 정해집니다. 크기와 색을 조절하려면 `r-loading` 엘리먼트 (또는 그 조상) 에 지정하세요. 기본값인 `em` 기반 크기보다 `px` 단위가 더 정밀합니다.

### 크기 조절

```css
/* Circle */
r-loading {
  --loading-circle-width: 32px;
  --loading-circle-height: 32px;
}

/* Double-bounce */
r-loading {
  --loading-double-bounce-width: 40px;
  --loading-double-bounce-height: 40px;
}

/* Rotate */
r-loading {
  --loading-rotate-width: 48px;
  --loading-rotate-height: 48px;
}

/* Stretch */
r-loading {
  --loading-stretch-width: 60px;
  --loading-stretch-height: 72px;
}
```

### 색 조절

```css
/* Circle */
r-loading {
  --loading-circle-container-div-background: #1890ff;
}

/* Double-bounce */
r-loading {
  --loading-double-bounce1-background: #52c41a;
  --loading-double-bounce2-background: #52c41a;
}

/* Rotate */
r-loading {
  --loading-rotate-background: #faad14;
}

/* Stretch */
r-loading {
  --loading-stretch-div-background-color: #f5222d;
}
```

### 실제 예제

<ran-demo>
  <r-loading name="circle" style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"></r-loading>
  <r-loading name="rotate" style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"></r-loading>
</ran-demo>

```html
<r-loading
  name="circle"
  style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"
></r-loading>
<r-loading
  name="rotate"
  style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"
></r-loading>
```

### 자주 쓰는 CSS 변수

애니메이션 종류마다 자체 토큰 이름 공간이 있습니다. 가장 흔한 것들은 다음 형태를 따릅니다.

| 변수                                    | 기본값    | 설명                             |
| --------------------------------------- | --------- | -------------------------------- |
| `--loading-{type}-width`                | `4em`     | 애니메이션 너비 (`px` 단위 권장) |
| `--loading-{type}-height`               | `4em`     | 애니메이션 높이 (`px` 단위 권장) |
| `--loading-{type}-background`           | `#4096ff` | 주 배경색                        |
| `--loading-{type}-div-background-color` | `#4096ff` | 하위 요소 배경색                 |

> `{type}`은 구체적인 애니메이션 이름 (`circle`, `double-bounce`, `rotate` 등) 으로 바꾸세요. 기본 색은 테마 토큰 `--ran-color-primary`, `--ran-color-success`, `--ran-color-text`를 따릅니다.

## CSS Part

모든 애니메이션은 자기 루트 엘리먼트를 `name` 값과 같은 이름의 `::part()`로 공개하므로, 섀도 DOM 바깥에서 겨냥할 수 있습니다.

```css
r-loading::part(rotate) {
  filter: drop-shadow(0 0 4px currentColor);
}
```

Part 이름: `double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`. `solar` 애니메이션은 `sun` part 도 추가로 공개합니다.

## 슬롯

없습니다. 컴포넌트는 애니메이션을 전부 섀도 DOM 에서 그리며 light DOM 자식을 투영하지 않습니다.

## 이벤트

없습니다. 커스텀 이벤트를 디스패치하지 않습니다.

## 모든 로딩 애니메이션

<Loading />
