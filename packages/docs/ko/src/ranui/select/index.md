---
description: 'ranui Select(<r-select>)은 여러 선택지 중 값 하나를 고르는 드롭다운으로, 검색과 네이티브 폼 참여를 지원합니다.'
---

# Select

선택지 목록에서 값 하나를 고르는 드롭다운 선택기입니다. 검색과 폼 참여도 지원합니다.

> **이럴 때 씁니다.** `<r-option>` 자식으로 만드는, 값 하나짜리 드롭다운이 필요할 때. 검색이나 네이티브 폼 참여도 함께 원한다면 더욱. `<r-select>`가 열고 닫기, 걸러내기, `FormData` 전달을 맡습니다.

## 빠른 시작

### 기본 사용법

선택지는 슬롯에 넣은 `<r-option>` 자식으로 줍니다. 각 선택지의 `value` 어트리뷰트가 값이고, 텍스트 내용이 화면에 보이는 레이블입니다.

<Demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## API 레퍼런스

### 속성

| 속성                  | 타입      | 기본값     | 설명                                                                                                                  |
| --------------------- | --------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `label`               | `string`  | `''`       | 필드 위의 고정 캡션(`r-input`의 `label`과 같은 방식). 레이블 달린 select와 레이블 달린 input이 폼에서 나란히 맞습니다 |
| `value`               | `string`  | `''`       | 선택된 값. 지정하면 닫힌 상태의 레이블이 갱신됩니다. `disabled`인 동안에는 무시됩니다                                 |
| `defaultValue`        | `string`  | `''`       | 처음 선택되는 값. 선택지의 `value`와 대조됩니다                                                                       |
| `disabled`            | `boolean` | `false`    | select를 비활성화할지 여부                                                                                            |
| `type`                | `string`  | `''`       | `text`이면 테두리도 배경도 없고 화살표 아이콘도 없는 트리거가 됩니다. 그 밖에는 테두리가 붙습니다                     |
| `open`                | `boolean` | `false`    | 드롭다운이 떠 있는지 여부. 이것이 곧 상태입니다. 지정하면 패널이 열리거나 닫힙니다                                    |
| `placement`           | `string`  | `'bottom'` | 드롭다운이 열리는 방향과 선택적 정렬: `bottom`, `bottom-end`, `top-center` …                                          |
| `showSearch`          | `boolean` | `false`    | 레이블로 선택지를 걸러 주는 내장 검색 상자를 보여 줍니다                                                              |
| `getPopupContainerId` | `string`  | `''`       | 드롭다운을 붙일 요소의 `id`(기본값은 `document.body`)                                                                 |
| `dropdownclass`       | `string`  | `''`       | 드롭다운 패널에 붙일 사용자 클래스                                                                                    |
| `trigger`             | `string`  | `'click'`  | 드롭다운을 여는 방식: `click`, `hover`, `click,hover`(모바일에서는 hover가 무시됩니다)                                |
| `required`            | `boolean` | `false`    | 폼을 제출하려면 선택이 필수인지 여부                                                                                  |
| `sheet`               | `string`  | `''`       | 섀도 DOM에 주입할 CSS                                                                                                 |

> **참고:** `defaultValue`와 `showSearch`는 반응형입니다. 요소가 연결된 뒤에 바꿔도 (`value`, `disabled`, `sheet`와 함께) `attributeChangedCallback`에서 다시 처리됩니다. `defaultValue`를 갱신하면 일치하는 선택이 다시 적용되고, `showSearch`를 켜고 끄면 내장 검색 상자가 붙거나 떨어집니다.

### 선택지의 속성

선택지는 `<r-option>` 자식 요소로 줍니다.

| 속성       | 타입      | 기본값  | 설명                                                                |
| ---------- | --------- | ------- | ------------------------------------------------------------------- |
| `value`    | `string`  | `''`    | 선택지의 값. 선택되면 select의 값으로 내보내집니다                  |
| `disabled` | `boolean` | `false` | 이 선택지를 고를 수 없게 합니다. 클릭에서도 키보드에서도 건너뜁니다 |
| `sheet`    | `string`  | `''`    | 선택지의 섀도 DOM에 주입할 CSS                                      |

레이블이나 값이 겹치는 선택지가 있으면 `console.warn`이 찍힙니다.

### 레이블 `label`

필드 위에 그려지는 고정 캡션입니다. 언제나 보이고, 옆 내용과 겹치지 않습니다. `r-input`의 `label`과 같은 토큰과 레이아웃을 쓰므로, 레이블 달린 select와 레이블 달린 input을 폼에 나란히 두면 높이와 윗변이 맞습니다.

<Demo>
  <r-select label="국가" style="width: 180px" defaultValue="185">
    <r-option value="185">미국</r-option>
    <r-option value="186">캐나다</r-option>
    <r-option value="187">멕시코</r-option>
  </r-select>
</Demo>

```html
<r-select label="국가" defaultValue="185">
  <r-option value="185">미국</r-option>
  <r-option value="186">캐나다</r-option>
  <r-option value="187">멕시코</r-option>
</r-select>
```

### 기본값 `defaultValue`

<Demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 비활성 상태 `disabled`

<Demo>
  <r-select style="width: 120px; height: 40px" disabled defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 텍스트 형태 `type`

<Demo>
  <r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 열리는 방향 `placement`

`placement`는 선호이지 보장이 아닙니다. 트리거가 뷰포트 가장자리에 가까워 선호한 방향에 자리가 없으면, 드롭다운이 알아서 반대쪽으로 뒤집히고 가로로 움직여 화면 안에 남습니다. 이는 기본값인 body 수준 배치에만 적용됩니다. `getPopupContainerId`를 지정했다면 그 컨테이너에 맞는 `placement`를 고르세요.

방향에는 정렬 접미사를 붙일 수 있습니다. `bottom-end`, `top-center` 등, `r-popover`가 받는 문법과 같습니다. 방향만 쓰면 `-start`를 뜻하며, 패널의 시작 모서리가 트리거의 시작 모서리에 맞춰집니다.

이 접미사는 패널의 너비가 트리거와 다를 때만 의미가 있습니다. 패널은 기본적으로 트리거의 너비를 따라가기 때문입니다. 패널을 넓히면(`r-dropdown::part(dropdown)`. 패널은 select의 섀도 루트가 아니라 `<body>`로 포털되므로 `dropdownclass`를 통해 닿습니다) 정렬은 실제로 그려진 너비를 기준으로 계산됩니다.

```html
<style>
  r-dropdown.wide::part(dropdown) {
    min-width: 220px;
  }
</style>

<!-- 패널의 오른쪽 모서리를 트리거의 오른쪽 모서리에 맞춤 -->
<r-select placement="bottom-end" dropdownclass="wide" style="width: 80px">
  <r-option value="a">아주 긴 선택지 레이블</r-option>
</r-select>
```

경계에 맞추는 이동은 정렬보다 우선한다는 점을 기억하세요. 트리거가 뷰포트 가장자리에 충분히 가까우면, 어떤 정렬을 요청했든 패널은 화면 안쪽으로 밀려 들어옵니다.

<Demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 열림 상태 `open`

`open`은 드롭다운의 상태 그 자체이며, `<details open>`이나 `<dialog open>`처럼 어트리뷰트로 반영됩니다. 패널의 `display`에서 상태를 되짚는 곳은 어디에도 없습니다(그 값은 퇴장 애니메이션만큼 상태보다 늦습니다). 그래서 어트리뷰트와 `aria-expanded`, 화면에 보이는 것이 서로 어긋날 수 없습니다.

덕분에 이것은 컴포넌트를 다루는 정식 방법이고, 스타일을 걸 대상이자 테스트에서 단언할 대상이기도 합니다.

```html
<r-select id="picker" open>
  <r-option value="185">Mike</r-option>
</r-select>

<script>
  const picker = document.getElementById('picker');
  picker.open = true; // 또는 picker.show()
  picker.open = false; // 또는 picker.hide()
  picker.toggle();
</script>

<style>
  /* 패널이 열려 있는 동안의 트리거 */
  r-select[open]::part(selection) {
    border-color: var(--ran-color-primary);
  }
</style>
```

`show()`, `hide()`, `toggle()`은 그 위에 얹힌 얇은 래퍼로, 대입보다 메서드가 더 잘 읽히는 자리를 위한 것입니다.

### 검색 기능 `showSearch`

<Demo>
  <r-select style="width: 120px; height: 40px" showSearch="true">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" showSearch="true">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 여는 방식 `trigger`

<Demo>
  <r-select style="width: 120px; height: 40px" trigger="click,hover">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<!-- 클릭으로 열기(기본) -->
<r-select trigger="click">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- 호버로 열기(모바일에서는 무시됩니다) -->
<r-select trigger="hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- 클릭과 호버 모두 -->
<r-select trigger="click,hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 붙일 컨테이너 `getPopupContainerId`

드롭다운은 기본적으로 `document.body`로 포털됩니다. 다른 요소의 `id`를 넘기면 그쪽에 붙습니다.

```html
<r-select getPopupContainerId="my-container">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 드롭다운 사용자 클래스 `dropdownclass`

```html
<r-select dropdownclass="custom-dropdown">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## 이벤트

### `change`

선택지를 고를 때 발생합니다. `event.detail`은 `{ value, label }`로, `value`는 고른 선택지의 값이고 `label`은 화면에 보이던 텍스트입니다. 처음의 `defaultValue`가 선택되는 것으로는 `change`가 발생하지 않습니다.

```html
<r-select id="picker">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('picker').addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.label); // 예: "186" "Tom"
  });
</script>
```

### `search`

`showSearch`가 켜져 있을 때만, 검색 상자에 입력하는 동안 발생합니다(빈도 제한이 걸립니다). `event.detail`은 `{ value }`로 현재 검색어입니다. 컴포넌트 안에서도 보이는 선택지를 레이블로 걸러 냅니다.

```html
<r-select showSearch="true" id="searchable">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('searchable').addEventListener('search', (e) => {
    console.log(e.detail.value);
  });
</script>
```

### `show` / `after-show` / `hide` / `after-hide`

패널의 전환 앞뒤로 발생합니다. `show`와 `hide`는 전환이 시작될 때 의도를 알리고, `after-show`와 `after-hide`는 패널이 실제로 도착하고 애니메이션까지 끝난 뒤에 발생합니다. 패널이 정말로 사라진 다음에만 무언가를 해야 한다면 뒤쪽 둘을 들으세요.

이들은 `detail`을 싣지 않습니다.

```html
<script>
  const picker = document.getElementById('picker');
  picker.addEventListener('show', () => console.log('열리는 중'));
  picker.addEventListener('after-hide', () => console.log('닫혔고 애니메이션도 끝'));
</script>
```

기다리는 대상은 스크립트에 옮겨 적은 시간이 아니라 스타일시트의 애니메이션 자체입니다. 그래서 `prefers-reduced-motion`에서는(패널이 재생할 애니메이션이 아예 없으므로) `after-hide`가 고정된 지연 뒤가 아니라 `hide` 바로 다음에 옵니다.

## 폼 연동 {#form-association}

`r-select`는 폼 연동 커스텀 엘리먼트입니다(`static formAssociated = true`). 선택된 `value`를 `ElementInternals`로 전달하므로, 네이티브 `<form>`의 실제 자손이라면 select의 `name` 아래로 `new FormData(form)`이 값을 수집합니다. 폼 값은 연결 시점의 초기 선택으로 채워지고, 값이 바뀔 때마다 함께 갱신됩니다.

**초기화**: 네이티브 `form.reset()`은 `defaultValue`가 지정되어 있으면 그 선택으로 되돌리고, 없으면 선택을 완전히 지웁니다. 구현은 `formResetCallback()`입니다.

**검증**: `required`를 주면 선택이 비었을 때 `ElementInternals.setValidity()`를 통해 유효하지 않게 되고, `form.checkValidity()` / `form.reportValidity()`에서 보입니다. `disabled`인 select는 검증을 막지 않습니다. `checkValidity()`, `reportValidity()`, `validity`, `validationMessage`는 네이티브 필드와 똑같이 요소에 노출됩니다.

```html
<form>
  <r-select name="country" required>
    <r-option value="us">미국</r-option>
    <r-option value="ca">캐나다</r-option>
  </r-select>
  <button type="submit">제출</button>
</form>
```

## 슬롯

| 슬롯   | 설명                                               |
| ------ | -------------------------------------------------- |
| (기본) | 고를 수 있는 선택지를 정의하는 `<r-option>` 요소들 |

## CSS Part

| Part             | 설명                                              |
| ---------------- | ------------------------------------------------- |
| `select`         | select의 최상위 래퍼                              |
| `selection`      | 트리거 상자(테두리, 배경, 레이아웃)               |
| `icon`           | 드롭다운 화살표 아이콘                            |
| `selection-item` | 고른 선택지의 레이블을 보여 주는 요소             |
| `search`         | 내장 검색 입력(`showSearch`일 때 보입니다)        |
| `label`          | 필드 위의 고정 레이블(`label`을 지정했을 때 존재) |

## 모범 사례

- **선택지가 많을 때**: `showSearch`를 켜서 레이블로 걸러 볼 수 있게 하세요.
- **여는 방식**: `trigger`는 사용자의 기대에 맞추세요. 모바일에서는 `hover`가 무시되니 `click`은 남겨 두세요.
- **붙는 위치**: 스크롤되거나 넘침을 잘라 내는 레이아웃에서는 `getPopupContainerId`로 드롭다운이 붙을 곳을 정하세요.
- **스타일 조정**: `dropdownclass`나 공개된 `::part()` 이름으로 트리거와 드롭다운의 모습을 바꾸세요.
- **폼**: select에 `name`을 주면 네이티브 `<form>` 안에서 값이 `FormData`에 담깁니다.
