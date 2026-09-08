---
description: 'ranui Tabs(<r-tabs>)는 어떤 프레임워크에서도 쓸 수 있는 네이티브 웹 컴포넌트로, 내용을 전환 가능한 패널로 정리합니다.'
---

# Tab

패널 사이를 오가는 탭 컨테이너입니다. `<r-tabs>`를 컨테이너로 두고 그 안에 `<r-tab>` 패널을 하나 이상 넣어 조립합니다.

> **이럴 때 씁니다.** 패널 사이를 오가는 탭 컨테이너가 필요할 때. `<r-tabs>` 안에 `<r-tab>` 자식들을 두고, 각각에 헤더 `label`과 패널 본문을 주면 됩니다.

## 빠른 시작

### 기본 사용법

<ran-demo column>
  <r-tabs>
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs>
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

`<r-tab>` 하나가 패널 하나가 됩니다. `label`은 헤더 버튼으로 그려지고, 슬롯에 넣은 내용이 패널 본문입니다. 헤더를 고르면 해당 패널이 미끄러져 들어옵니다.

## API 레퍼런스

### `r-tabs` 속성

컨테이너입니다. 헤더 줄, 활성 표시자, 패널 내용 영역을 담습니다.

| 속성     | 타입      | 기본값          | 설명                                                      |
| -------- | --------- | --------------- | --------------------------------------------------------- |
| `active` | `string`  | 첫 번째 활성 탭 | 지금 활성인 탭의 `r-key`                                  |
| `type`   | `string`  | `'flat'`        | 헤더 스타일: `flat`, `line`                               |
| `align`  | `string`  | `'start'`       | 헤더 정렬: `start`, `center`, `end`                       |
| `effect` | `boolean` | `false`         | 헤더 버튼에 물결 효과를 켜고 미끄러지는 표시자를 숨깁니다 |
| `sheet`  | `string`  | `''`            | 섀도 DOM에 주입할 CSS 텍스트                              |

> `active` 세터는 키 문자열을 받습니다. `null`을 대입하면 어트리뷰트가 제거됩니다. `active`가 없으면 마운트 시 비활성이 아닌 첫 탭이 선택됩니다.

### `r-tab` 속성

패널 하나입니다. 이 어트리뷰트들을 부모 `<r-tabs>`가 읽어 대응하는 헤더 버튼을 만듭니다.

| 속성       | 타입      | 기본값  | 설명                                                      |
| ---------- | --------- | ------- | --------------------------------------------------------- |
| `label`    | `string`  | `''`    | 탭 헤더에 보이는 텍스트                                   |
| `r-key`    | `string`  | 인덱스  | 한 `<r-tabs>` 안에서 유일한 식별자. `active`와 대조됩니다 |
| `icon`     | `string`  | —       | 레이블 앞에 보이는 `r-icon` 이름                          |
| `iconSize` | `string`  | —       | 헤더 아이콘의 크기                                        |
| `disabled` | `boolean` | `false` | 이 탭을 고를 수 없게 만듭니다                             |
| `effect`   | `boolean` | —       | 헤더의 물결 효과(보통 부모의 `effect`가 정합니다)         |
| `sheet`    | `string`  | `''`    | 섀도 DOM에 주입할 CSS 텍스트                              |

> `key` 프로퍼티의 게터·세터는 `r-key` 어트리뷰트를 읽고 씁니다(그냥 `key`라는 이름은 예약된 필드라 피했습니다). `label`과 `r-key`는 요소가 연결되기 전에 지정하세요. 헤더가 만들어진 뒤에는 이 두 어트리뷰트의 변경이 다시 처리되지 않습니다.

### 헤더 스타일 `type`

`flat`(기본)은 미끄러지는 밑줄 표시자를 보여 주고, `line`은 테두리가 있는 탭 헤더를 그립니다.

<ran-demo column>
  <r-tabs type="flat">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs type="flat">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>

<r-tabs type="line">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### 헤더 정렬 `align`

헤더 줄을 정렬합니다. 기본값은 `start`입니다.

<ran-demo column>
  <r-tabs type="line" align="start">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="center">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="end">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs type="line" align="start"> ... </r-tabs>
<r-tabs type="line" align="center"> ... </r-tabs>
<r-tabs type="line" align="end"> ... </r-tabs>
```

### 활성 탭 `active`와 `r-key`

- `r-key`는 `<r-tab>`의 어트리뷰트로, 같은 `<r-tabs>` 안에서 각 패널에 안정적인 정체성을 줍니다. 생략하면 그 패널의 인덱스가 기본값이 됩니다.
- `active`는 `<r-tabs>`의 어트리뷰트로, 처음에 활성인 탭을 고릅니다. `r-key`가 `active`와 같은 패널이 보입니다.

키를 명시하지 않으면 `active`는 0부터 시작하는 인덱스와 맞춰집니다.

<ran-demo column>
  <r-tabs active="1">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs active="1">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

`r-key` 값을 명시한 경우(키가 없는 패널은 인덱스로 대체됩니다):

<ran-demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a">11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a">11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

> 한 `<r-tabs>` 안의 `r-key`는 모두 달라야 합니다. 일부 패널에서 키가 겹치거나 빠지면 헤더를 만드는 도중 오류가 납니다.

### 비활성 패널 `disabled`

`disabled`인 `<r-tab>`은 선택할 수 없고, 기본 활성 탭을 고를 때도 건너뜁니다.

<ran-demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

### 헤더 아이콘 `icon`과 `iconSize`

`<r-tab>`은 `icon` 어트리뷰트(`r-icon` 이름)를 받아 레이블 앞에 그립니다. 크기는 `iconSize`로 정합니다.

<ran-demo column>
  <r-tabs>
    <r-tab label="tab1" icon="edit">11111</r-tab>
    <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs>
  <r-tab label="tab1" icon="edit">11111</r-tab>
  <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### 물결 효과 `effect`

`<r-tabs>`에 `effect`를 주면 헤더 버튼을 누를 때 물결이 퍼집니다. `effect`가 켜져 있는 동안에는 미끄러지는 밑줄 표시자가 숨겨집니다.

<ran-demo column>
  <r-tabs effect="true">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</ran-demo>

```html
<r-tabs effect="true">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

## 슬롯

| 요소     | 슬롯   | 설명                                    |
| -------- | ------ | --------------------------------------- |
| `r-tabs` | (기본) | `<r-tab>` 패널들을 받습니다             |
| `r-tab`  | (기본) | 패널의 본문. 그 탭이 활성일 때 보입니다 |

## CSS Part

`r-tabs`가 노출하는 것:

| Part           | 설명                             |
| -------------- | -------------------------------- |
| `tabs`         | 최상위 래퍼                      |
| `header`       | 헤더 줄 래퍼                     |
| `nav`          | 헤더 항목을 담은 tablist         |
| `indicator`    | 미끄러지는 밑줄                  |
| `content`      | 패널 내용의 뷰포트               |
| `content-wrap` | 모든 패널을 얹은 미끄러지는 트랙 |

`r-tab`이 노출하는 것:

| Part      | 설명             |
| --------- | ---------------- |
| `content` | 패널의 내용 슬롯 |

## 이벤트

### `change`

`<r-tabs>`는 관찰 중인 어트리뷰트가 바뀔 때 `change` `CustomEvent`를 보냅니다. 가장 흔한 경우는 활성 탭이 바뀔 때입니다. `event.detail.active`는 현재 활성 키입니다(선택된 `<r-tab>`의 `r-key`, `r-key`가 없으면 그 인덱스).

```js
const tabs = document.createElement('r-tabs');
tabs.addEventListener('change', (e) => {
  console.log('활성 탭:', e.detail.active);
});
tabbar.append(tabs);
```

`<r-tab>`은 커스텀 이벤트를 보내지 않습니다.

## 스타일

`<r-tabs>`는 자체 **CSS 사용자 정의 속성 10개**와 테마에서 읽어오는 시맨틱 토큰을 노출합니다. 상속이 닿는 곳이라면 어디든 지정할 수 있습니다 — `:root`, 감싸는 요소, 또는 요소 자신.

```css
r-tabs {
  --ran-tab-content-background: var(--ran-color-bg-subtle);
}
```

Part: `content` · `content-wrap` · `header` · `indicator` · `nav` · `tabs`

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#tab)에 있고, 어떤 토큰을 골라야 하는지는 [디자인 시스템](/ko/src/ranui/design-system/)이 다룹니다.

## 모범 사례

- **안정적인 정체성**: 각 `<r-tab>`에 유일한 `r-key`를 주고, 위치 인덱스에 기대는 대신 `<r-tabs>`의 `active`로 선택을 다루세요.
- **스타일 선택**: 문서풍의 테두리 있는 탭 띠에는 `type="line"`을, 최소한의 미끄러지는 밑줄에는 `type="flat"`(기본)을 쓰세요.
- **정렬**: 넓은 컨테이너 안에서 헤더 줄의 위치를 옮기려면 `align="center"`나 `align="end"`를 쓰세요.
- **비활성 패널**: 쓸 수 없는 패널에는 `disabled`를 표시하세요. 클릭에서도, 기본 선택에서도 건너뜁니다.
- **키보드 탐색**: 헤더 줄은 WAI-ARIA tablist입니다. 화살표 키로 탭 사이를 오갈 수 있고(`Home`/`End`도 됩니다), 탭 순서에 들어가는 것은 활성 탭 하나뿐입니다.
