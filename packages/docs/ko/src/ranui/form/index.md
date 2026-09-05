---
description: 'ranui 로 폼을 만드는 법: r-input, r-checkbox, r-select 는 평범한 네이티브 <form> 안에서 그대로 동작하며, 감싸는 컴포넌트가 필요 없습니다.'
---

# Forms

ranui 에는 `<form>`을 감싸는 컴포넌트가 없습니다. `r-input`, `r-checkbox`, `r-select`가 그 자체로 [Form-Associated Custom Elements](https://developer.mozilla.org/ko/docs/Web/API/Web_components/Using_form-associated_custom_elements)이기 때문입니다 (각각 `attachInternals()`를 호출하고 값을 `ElementInternals.setFormValue()`로 넘깁니다). 그래서 평범한 네이티브 `<form>` 안에서 이미 동작합니다. `new FormData(form)`이 값을 모으고, `form.reset()`이 조작 전 상태로 되돌리며, `required` 필드는 제출을 막고 브라우저 기본 검증 UI 를 그 필드에 붙여 보여 줍니다. 어느 것도 ranui 전용 마크업을 요구하지 않습니다.

> **이럴 때 쓰세요.** `r-input`/`r-checkbox`/`r-select`로 폼을 조립하고 있을 때. 진짜 `<form>`을 그대로 쓰고, 제출된 값을 `FormData` 순회를 직접 짜는 대신 평범한 객체로 받고 싶다면 아래의 `serializeForm()`을 쓰세요.

## 빠른 시작

세 가지 필드 모두를 평범한 `<form>`으로 제출합니다. 필드를 바꿔 제출하면 아래에 결과가 나옵니다. 이 데모는 브라우저 자체의 `FormData`/`Object.fromEntries`로 객체를 만듭니다 (import 필요 없음). 다음에 소개할 `serializeForm()`은 같은 일을 하면서 `Object.fromEntries`가 못 하는 일을 하나 더 합니다. 같은 이름이 여러 번 나오면 조용히 마지막 값만 남기는 대신 배열로 돌려줍니다.

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.info(JSON.stringify(Object.fromEntries(new FormData(this))))">
    <r-input name="username" label="사용자 이름" placeholder="사용자 이름 입력"></r-input>
    <r-select name="role" label="역할" style="width: 100%" defaultValue="member">
      <r-option value="member">멤버</r-option>
      <r-option value="admin">관리자</r-option>
    </r-select>
    <r-checkbox name="subscribe">뉴스레터 구독</r-checkbox>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">제출</button></r-button>
  </form>
</Demo>

> 아래 [레이아웃](#layout) 절에서 다루듯이, 필드는 폼 수준의 레이아웃을 스스로 갖고 있지
> 않습니다. 그래서 이 페이지의 모든 예제 (이것 포함) 가 자기 `<form>`에 CSS 를 지정합니다
> (`display: flex; flex-direction: column; gap: …`). 이를 빼면 필드가 일반 흐름대로 사이 간격
> 없이 쌓여, 폼이라기보다 깨지거나 겹친 것처럼 보입니다.

```html
<form id="signup" style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="사용자 이름" placeholder="사용자 이름 입력"></r-input>
  <r-select name="role" label="역할" defaultValue="member">
    <r-option value="member">멤버</r-option>
    <r-option value="admin">관리자</r-option>
  </r-select>
  <r-checkbox name="subscribe">뉴스레터 구독</r-checkbox>
  <button type="submit">제출</button>
</form>

<script type="module">
  import { serializeForm } from 'ranui';

  document.getElementById('signup').addEventListener('submit', (event) => {
    event.preventDefault(); // 진짜 <form>은 그대로 두면 페이지를 이동시킵니다
    console.log(serializeForm(event.target)); // { username: '...', role: 'member', subscribe: 'true' }
  });
</script>
```

## `serializeForm(form)`

`<form>`의 이름 있는 필드를 `FormData`를 통해 평범한 객체로 모읍니다. 제출 결과를 `JSON.stringify`하거나 fetch 본문으로 보내려고 다들 직접 짜는 상투적인 코드입니다. ranui 필드에만 의존하지 않는 평범한 함수라서, 진짜 `<form>`이면 어디서든 동작합니다.

```ts
function serializeForm(form: HTMLFormElement): Record<string, unknown>;
```

같은 `name`에 값이 여럿인 필드 (이름을 공유하는 체크박스 여러 개 등) 는 배열로 돌아오고, 나머지는 단일 값으로 돌아옵니다.

```ts
import { serializeForm } from 'ranui';

const data = serializeForm(document.querySelector('form'));
// { username: 'alice', tags: ['a', 'b'] }
fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) });
```

## 레이아웃 {#layout}

필드에는 기본 폼 레이아웃이 없습니다. 여러분의 `<form>`에 평범한 CSS 로 스타일을 주세요.

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px;">
    <r-input name="first" label="이름"></r-input>
    <r-input name="last" label="성"></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">계속</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="first" label="이름"></r-input>
  <r-input name="last" label="성"></r-input>
  <button type="submit">계속</button>
</form>
```

## 검증과 초기화

`r-input`, `r-checkbox`, `r-select`는 모두 `required`(네이티브 필드와 똑같이 제출을 막고 브라우저 기본 검증 말풍선을 띄웁니다) 와 함께 `checkValidity()`, `reportValidity()`, `validity`, `validationMessage`를 지원합니다. 네이티브 `form.reset()`(또는 `<button type="reset">`) 은 `formResetCallback()`을 통해 각 필드를 조작 전 상태로 되돌립니다. 자세한 내용은 각 필드 문서 ([Input](/ko/src/ranui/input/#form-association), [Checkbox](/ko/src/ranui/checkbox/#form-association), [Select](/ko/src/ranui/select/#form-association)) 를 보세요.

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.success('Valid — submitted')">
    <r-input name="username" label="사용자 이름" required></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">제출</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="사용자 이름" required></r-input>
  <button type="submit">제출</button>
</form>
```

## 왜 `<r-form>` 래퍼가 없나요?

평범한 네이티브 `<form>`으로 이미 충분하기 때문입니다. ranui 의 필드 컴포넌트는 그 안에서 바로 동작하고 감쌀 것이 필요 없습니다. `serializeForm()`은 남은 진짜 빈틈 하나 — 제출 결과를 평범한 객체로 바꾸는 일 — 을 메웁니다.
