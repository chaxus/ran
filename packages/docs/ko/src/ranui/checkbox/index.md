---
description: 'ranui 의 Checkbox(<r-checkbox>) 는 켬/끔 선택 하나를 토글합니다. 레이블을 붙일 수 있고 네이티브 폼을 지원합니다.'
---

# Checkbox

켬/끔 선택 하나를 토글하는 체크박스 컴포넌트입니다. 레이블을 붙일 수 있고 네이티브 폼을 지원합니다.

> **이럴 때 쓰세요.** 레이블이 붙은 켬/끔 토글 하나가 필요하고 네이티브 폼에 참여해야 할 때. `<r-checkbox>`는 체크 상태를 `FormData`에 알리고 키보드로도 조작됩니다.

## 빠른 시작

### 기본 사용법

<Demo>
  <r-checkbox>로그인 상태 유지</r-checkbox>
</Demo>

```html
<r-checkbox>로그인 상태 유지</r-checkbox>
```

기본 슬롯의 콘텐츠가 체크박스의 레이블이 됩니다.

## API 레퍼런스

### 프로퍼티

| 프로퍼티   | 타입      | 기본값    | 설명                                               |
| ---------- | --------- | --------- | -------------------------------------------------- |
| `checked`  | `boolean` | `false`   | 체크되어 있는지 여부                               |
| `value`    | `string`  | `'false'` | 폼 값. 체크 상태를 `'true'` / `'false'`로 비춥니다 |
| `disabled` | `boolean` | `false`   | 비활성인지 여부                                    |
| `required` | `boolean` | `false`   | 폼을 제출하려면 반드시 체크되어야 하는지           |
| `sheet`    | `string`  | `''`      | 모습을 바꾸려고 컴포넌트의 섀도 DOM 에 주입할 CSS  |

> `checked`와 `value` 어트리뷰트는 서로 동기화됩니다. 하나를 지정하면 다른 쪽도 갱신됩니다. 체크되면 `value`는 `'true'`, 아니면 `'false'` 입니다.

### 체크 상태 `checked`

<Demo>
  <r-checkbox checked="true">체크됨</r-checkbox>
  <r-checkbox checked="false">체크 안 됨</r-checkbox>
</Demo>

```html
<r-checkbox checked="true">체크됨</r-checkbox> <r-checkbox checked="false">체크 안 됨</r-checkbox>
```

### 값 `value`

<Demo>
  <r-checkbox value="true">value 는 true</r-checkbox>
  <r-checkbox value="false">value 는 false</r-checkbox>
</Demo>

```html
<r-checkbox value="true">value 는 true</r-checkbox> <r-checkbox value="false">value 는 false</r-checkbox>
```

### 비활성 상태 `disabled`

<Demo>
  <r-checkbox checked="true" disabled>체크됨</r-checkbox>
  <r-checkbox checked="false" disabled>체크 안 됨</r-checkbox>
</Demo>

```html
<r-checkbox checked="true" disabled>체크됨</r-checkbox> <r-checkbox checked="false" disabled>체크 안 됨</r-checkbox>
```

### 스타일 덮어쓰기 `sheet`

`sheet` 어트리뷰트는 섀도 DOM 에 CSS 를 주입해, 내부 요소를 클래스 이름으로 겨냥할 수 있게 합니다.

<Demo>
  <r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">색을 바꾼 레이블</r-checkbox>
</Demo>

```html
<r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">색을 바꾼 레이블</r-checkbox>
```

## 이벤트

### `change`

체크박스가 토글될 때 (클릭하거나 Space/Enter를 누를 때) 발생합니다. 이벤트는 `CustomEvent`이며 `detail`이 새 체크 상태를 담습니다.

```ts
detail: {
  checked: boolean; // 토글 뒤 체크박스의 체크 상태
}
```

비활성 체크박스는 `change`를 발생시키지 않습니다.

<Demo>
  <r-checkbox onchange="message.info(this)">눌러 보세요</r-checkbox>
</Demo>

```html
<r-checkbox onchange="handleChange(event)">눌러 보세요</r-checkbox>

<script>
  function handleChange(event) {
    console.log('checked:', event.detail.checked);
  }
</script>
```

## 슬롯

| 슬롯   | 설명                                  |
| ------ | ------------------------------------- |
| (기본) | 체크박스 레이블. 상자 옆에 그려집니다 |

## 폼 연동 {#form-association}

`r-checkbox`는 폼 연동 커스텀 엘리먼트입니다 (`formAssociated = true`). 체크 상태를 `ElementInternals.setFormValue`로 넘기므로 네이티브 폼에 참여하고, 네이티브 `<form>`의 실제 자손일 때 `new FormData(form)`에 모입니다. 네이티브 체크박스의 의미를 따라, 체크되어 있을 때만 `value`를 내놓습니다.

호스트 자신이 접근성 있는 체크박스 의미를 갖습니다: `role="checkbox"`, `aria-checked`, `aria-disabled`, 그리고 키보드 조작 (Space 나 Enter 로 토글).

**초기화**: 네이티브 `form.reset()`은 `formResetCallback()`을 통해 처음 연결됐을 때의 체크 상태로 되돌립니다.

**검증**: `required`는 체크되지 않은 상자를 `ElementInternals.setValidity()`로 무효로 만들고, 이는 `form.checkValidity()`/`form.reportValidity()`에서 보입니다. `disabled`인 상자는 검증을 막지 않습니다. `checkValidity()`, `reportValidity()`, `validity`, `validationMessage`가 네이티브 필드처럼 엘리먼트에 노출됩니다.

```html
<form>
  <r-checkbox name="terms" required>약관에 동의합니다</r-checkbox>
  <button type="submit">제출</button>
</form>
```

## CSS Part

`::part()` 선택자로 내부 구조에 스타일을 주세요.

| Part       | 엘리먼트                                    |
| ---------- | ------------------------------------------- |
| `wrapper`  | 상자와 레이블을 담는 바깥 flex 컨테이너     |
| `checkbox` | 상자 컨테이너                               |
| `input`    | 시각적으로 감춰진 `<input type="checkbox">` |
| `inner`    | 그려지는 상자 (테두리, 채움, 체크 표시)     |
| `label`    | 기본 슬롯을 감싸는 레이블                   |

```css
r-checkbox::part(inner) {
  border-radius: 50%;
}
r-checkbox::part(label) {
  font-weight: 600;
}
```

## 스타일

`<r-checkbox>`는 자체 **CSS 커스텀 프로퍼티 32 개**와 테마에서 읽어 오는 의미 토큰을 공개합니다.
상속이 닿는 곳이면 어디에나 지정하세요 — `:root`, 바깥 컨테이너, 또는 엘리먼트 자체.

```css
r-checkbox {
  --ran-checkbox-color: var(--ran-color-text-secondary);
}
```

Part: `checkbox` · `inner` · `input` · `label` · `wrapper`

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#checkbox)에, 어떤 토큰을 고를지는 [디자인 시스템](/ko/src/ranui/design-system/)에 있습니다.

## 권장 사항

- **체크박스에 레이블을**: 슬롯에 텍스트를 넣어 컨트롤에 접근성 이름을 주세요.
- **checked 와 value**: 불리언 상태에는 `checked`를 쓰고, 폼 데이터를 모을 때는 `value`(`'true'` / `'false'`) 를 읽으세요.
- **비활성 상태**: 그 선택을 쓸 수 없을 때 `disabled`를 쓰세요.
- **`change`를 구독하세요**: DOM 을 다시 질의하지 말고 `event.detail.checked`를 읽으세요.
- **폼**: `r-checkbox`를 `<form>` 안에 넣기만 하면 체크됐을 때 값이 자동으로 모입니다. 제출을 평범한 객체로 바꾸는 `serializeForm()` 도우미는 [Forms](/ko/src/ranui/form/)를 보세요.
