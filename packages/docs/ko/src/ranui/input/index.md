---
description: 'ranui Input(<r-input>)은 키보드로 입력하는 기본 폼 컨트롤로, 타입·크기·검증을 갖췄으며 어떤 프레임워크에서도 쓸 수 있는 네이티브 웹 컴포넌트입니다.'
---

# Input

키보드로 내용을 입력하는 컴포넌트이자, 가장 기본이 되는 폼 컨트롤입니다.

> **이럴 때 씁니다.** 위쪽에 고정된 레이블, 앞쪽 아이콘, 검증 상태와 메시지, 그리고 네이티브 폼 참여가 필요한 텍스트 필드가 필요할 때. `<r-input>`은 텍스트·비밀번호·숫자 입력을 아우릅니다.

## 빠른 시작

### 기본 사용법

<Demo column>
  <r-input placeholder="내용을 입력하세요"></r-input>
</Demo>

```html
<r-input placeholder="내용을 입력하세요"></r-input>
```

## API 레퍼런스

### 속성

| 속성          | 타입      | 기본값  | 설명                                                                      |
| ------------- | --------- | ------- | ------------------------------------------------------------------------- |
| `label`       | `string`  | `''`    | 필드 위에 그려지는 고정 캡션                                              |
| `placeholder` | `string`  | `''`    | 자리 표시자 텍스트. 네이티브 `<input>`으로 그대로 전달됩니다              |
| `value`       | `string`  | `''`    | 필드 값. 어트리뷰트로 반영되고 폼에도 전달됩니다                          |
| `disabled`    | `boolean` | `false` | 입력을 비활성화할지 여부                                                  |
| `type`        | `string`  | `''`    | 내부 컨트롤로 전달되는 네이티브 입력 타입(`text`, `password`, `number` …) |
| `icon`        | `string`  | `''`    | 필드 안 앞쪽 아이콘 이름(`r-icon`으로 그려집니다)                         |
| `name`        | `string`  | `''`    | 폼에 참여할 때 쓰는 필드 이름                                             |
| `status`      | `string`  | `''`    | 검증 상태: `error`, `warning`                                             |
| `message`     | `string`  | `''`    | 필드 아래에 그려지는 도움말·검증 텍스트                                   |
| `min`         | `string`  | `''`    | 최솟값. `type="number"`일 때 내부 `<input>`으로 전달됩니다                |
| `max`         | `string`  | `''`    | 최댓값. `type="number"`일 때 내부 `<input>`으로 전달됩니다                |
| `step`        | `string`  | `''`    | 값의 증분. `type="number"`일 때 내부 `<input>`으로 전달됩니다             |
| `required`    | `boolean` | `false` | 내부 `<input>`으로 전달되어 네이티브 제약 검증이 적용됩니다               |
| `sheet`       | `string`  | `''`    | 섀도 루트에 주입할 CSS                                                    |

### 레이블 `label`

필드 위에 그려지는 고정 캡션입니다. 언제나 보이고, 옆 내용과 겹치지 않으며, 포커스했다고 레이아웃이 흔들리지 않습니다(위쪽 정렬 레이블은 인라인이나 플로팅 레이블보다 폼을 더 빨리 끝내게 하기도 합니다. [Luke Wroblewski의 시선 추적 연구](https://www.lukew.com/ff/entry.asp?504=)를 보세요).

<Demo column>
  <r-input label="사용자 이름"></r-input>
</Demo>

```html
<r-input label="사용자 이름"></r-input>
```

### 자리 표시자 `placeholder`

네이티브 `placeholder` 어트리뷰트와 똑같이 동작합니다.

<Demo column>
  <r-input placeholder="사용자 이름을 입력하세요"></r-input>
</Demo>

```html
<r-input placeholder="사용자 이름을 입력하세요"></r-input>
```

### 값 `value`

<Demo column>
  <r-input value="1234"></r-input>
</Demo>

```html
<r-input value="1234"></r-input>
```

### 비활성 상태 `disabled`

<Demo column>
  <r-input label="사용자 이름" disabled></r-input>
</Demo>

```html
<r-input label="사용자 이름" disabled></r-input>
```

### 아이콘 `icon`

<Demo column>
  <r-input icon="user"></r-input>
</Demo>

```html
<r-input icon="user"></r-input>
```

### 입력 타입 `type`

<Demo column>
  <r-input icon="lock" type="password" placeholder="비밀번호"></r-input>
  <r-input type="number" placeholder="숫자"></r-input>
</Demo>

```html
<r-input icon="lock" type="password" placeholder="비밀번호"></r-input>
<r-input type="number" placeholder="숫자"></r-input>
```

### 상태 `status`

`status`는 늘 `message`와 짝지어 쓰세요. 그래야 상태가 색만이 아니라 글로도 전해집니다.

<Demo column>
  <r-input status="error" label="사용자 이름" message="필수 항목입니다"></r-input>
  <r-input status="warning" label="사용자 이름" message="이 값을 확인하세요"></r-input>
</Demo>

```html
<r-input status="error" label="사용자 이름" message="필수 항목입니다"></r-input>
<r-input status="warning" label="사용자 이름" message="이 값을 확인하세요"></r-input>
```

### 도움말 메시지 `message`

필드 아래에 도움말이나 검증 텍스트를 그립니다.

<Demo column>
  <r-input label="이메일" message="이메일은 절대 공유하지 않습니다"></r-input>
</Demo>

```html
<r-input label="이메일" message="이메일은 절대 공유하지 않습니다"></r-input>
```

### 폼 필드 이름 `name`

```html
<r-input name="username" label="사용자 이름"></r-input>
```

## 이벤트

두 이벤트 모두 `CustomEvent`로 발생하며 현재 값을 `detail`에 싣습니다.

| 이벤트   | 언제 발생하는가                                       | `detail`            |
| -------- | ----------------------------------------------------- | ------------------- |
| `input`  | 키를 누를 때마다(네이티브 `input`과 같음)             | `{ value: string }` |
| `change` | 확정하거나 포커스를 잃을 때(네이티브 `change`와 같음) | `{ value: string }` |

### 입력 이벤트 `input`

<Demo column>
  <r-input oninput="console.log(event.detail.value)" label="사용자 이름"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', '사용자 이름');
input.addEventListener('input', (event) => {
  console.log('입력 중:', event.detail.value);
});
```

### 변경 이벤트 `change`

<Demo column>
  <r-input onchange="console.log(event.detail.value)" label="사용자 이름"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', '사용자 이름');
input.addEventListener('change', (event) => {
  console.log('값이 바뀜:', event.detail.value);
});
```

## 폼 연동 {#form-association}

`r-input`은 폼 연동 커스텀 엘리먼트입니다(`static formAssociated = true`). `ElementInternals`를 붙이고 `setFormValue`로 값을 전달하므로, 네이티브 `<form>`의 실제 자손이라면 `new FormData(form)`이 이 필드를 수집합니다. 값에 키를 주려면 `name`을 지정하세요. 제출을 평범한 객체로 바꿔 주는 `serializeForm()` 헬퍼는 [폼](/ko/src/ranui/form/)을 보세요.

```html
<form>
  <r-input name="username" label="사용자 이름"></r-input>
</form>
```

**초기화**: 네이티브 `form.reset()`(또는 `<button type="reset">`)은 필드가 처음 연결됐을 때의 값으로 되돌립니다. `formResetCallback()`으로 구현되어 있는데, 이는 브라우저가 폼 연동 커스텀 엘리먼트에 대해 알아서 호출하는 생명주기 훅 중 하나입니다.

**검증**: `required`를 지정하면 빈 필드가 `ElementInternals.setValidity()`를 통해 유효하지 않게 됩니다. `form.checkValidity()` / `form.reportValidity()`가 이를 보고, 제출하면 브라우저 기본 검증 말풍선이 해당 필드에 붙어 나타납니다. `disabled` 필드는 검증을 막지 않으며, 이는 네이티브 `<input>`과 같습니다. `r-input`은 네이티브 필드에서 익숙한 메서드와 프로퍼티도 그대로 노출합니다: `checkValidity()`, `reportValidity()`, `validity`, `validationMessage`.

```html
<form>
  <r-input name="username" label="사용자 이름" required></r-input>
  <button type="submit">제출</button>
</form>
```

## CSS Part

바깥에서 스타일을 줄 수 있도록 `::part()`로 노출합니다.

| Part      | 요소                                              |
| --------- | ------------------------------------------------- |
| `input`   | 필드 래퍼                                         |
| `content` | 내부의 네이티브 `<input>` 컨트롤                  |
| `label`   | 필드 위의 고정 레이블(`label`을 지정했을 때 존재) |
| `message` | 도움말·검증 텍스트(`message`를 지정했을 때 존재)  |

```css
r-input::part(content) {
  font-size: 16px;
}
```

## 스타일

`<r-input>`은 자체 **CSS 사용자 정의 속성 61개**와 테마에서 읽어오는 시맨틱 토큰을 노출합니다. 상속이 닿는 곳이라면 어디든 지정할 수 있습니다 — `:root`, 감싸는 요소, 또는 요소 자신.

```css
r-input {
  --ran-input-color: var(--ran-color-text-secondary);
}
```

Part: `content` · `input` · `label` · `message`

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#input)에 있고, 어떤 토큰을 쓸지는 [디자인 시스템](/ko/src/ranui/design-system/)이 다룹니다.

## 모범 사례

- **레이블**: 뜻이 통하는 `label`을 붙여 필드에 접근 가능한 이름을 주세요.
- **자리 표시자**: `placeholder`는 입력 힌트이지 레이블의 대체물이 아닙니다.
- **상태와 메시지**: `status`는 `message`와 함께 써서 상태가 색만으로 전달되지 않게 하세요.
- **아이콘**: 내용에 맞는 `icon`을 더하면 알아보기 쉬워집니다.
- **타입**: 내용에 맞는 `type`(`text`, `password`, `number` …)을 고르세요.
- **폼**: 폼 안에서 값을 모을 때는 `name`을 지정하세요.
