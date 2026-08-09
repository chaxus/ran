---
description: '如何用 ranui 搭建表单——r-input、r-checkbox、r-select 可以直接放进一个普通的原生 <form>，不需要任何包装组件。'
---

# 表单

ranui 不提供一个专门包裹 `<form>` 的组件。`r-input`、`r-checkbox`、`r-select` 本身就是 [Form-Associated Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_form-associated_custom_elements)——各自调用了 `attachInternals()`，通过 `ElementInternals.setFormValue()` 转发自己的值——所以它们本来就能在一个普通的原生 `<form>` 里工作：`new FormData(form)` 能收集到它们，`form.reset()` 能把它们恢复到交互前的状态，`required` 字段会阻止提交并显示浏览器原生的校验提示（锚定在该字段上）。这些都不需要任何 ranui 专属的标记。

> **适用场景**：用 `r-input`/`r-checkbox`/`r-select` 拼一个表单——直接用一个普通的 `<form>` 就行，如果想把提交结果拿成一个普通对象而不是自己手写 `FormData` 遍历逻辑，可以用下面的 `serializeForm()`。

## 快速开始

三种字段类型放在同一个普通 `<form>` 里提交——改一下字段的值再提交，就能在下面看到完整的实时结果。这个 demo 用浏览器自带的 `FormData`/`Object.fromEntries` 拼对象，不需要任何 import；下面马上会介绍的 `serializeForm()` 做的是同一件事，只多做了一件 `Object.fromEntries` 做不到的事：同名字段重复出现时会返回数组，而不是悄悄只保留最后一个值。

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.info(JSON.stringify(Object.fromEntries(new FormData(this))))">
    <r-input name="username" label="Username" placeholder="Enter username"></r-input>
    <r-select name="role" style="width: 100%; height: 40px" defaultValue="member">
      <r-option value="member">Member</r-option>
      <r-option value="admin">Admin</r-option>
    </r-select>
    <r-checkbox name="subscribe">Subscribe to newsletter</r-checkbox>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
  </form>
</Demo>

> 就像下面「布局」一节说的：字段没有自带的表单级布局，所以这个页面上的每个例子——包括这一个——都给自己的 `<form>` 设置了 CSS（`display: flex; flex-direction: column; gap: …`）。不设置的话，字段会按普通文档流依次排列、彼此没有间距，看起来会像是重叠/错位，而不是一个表单。

```html
<form id="signup" style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="Username" placeholder="Enter username"></r-input>
  <r-select name="role" defaultValue="member">
    <r-option value="member">Member</r-option>
    <r-option value="admin">Admin</r-option>
  </r-select>
  <r-checkbox name="subscribe">Subscribe to newsletter</r-checkbox>
  <button type="submit">Submit</button>
</form>

<script type="module">
  import { serializeForm } from 'ranui';

  document.getElementById('signup').addEventListener('submit', (event) => {
    event.preventDefault(); // 一个真正的 <form> 默认会跳转页面
    console.log(serializeForm(event.target)); // { username: '...', role: 'member', subscribe: 'true' }
  });
</script>
```

## `serializeForm(form)`

通过 `FormData` 把一个 `<form>` 的具名字段收集成一个普通对象——这段样板代码本来每个使用者都要自己手写一遍，才能把一次提交变成能 `JSON.stringify` 或作为 fetch body 发出去的东西。它是一个纯函数，不依赖 ranui 的字段组件，任何真正的 `<form>` 都能用。

```ts
function serializeForm(form: HTMLFormElement): Record<string, unknown>;
```

同一个 `name` 下有多个值时（比如多个 checkbox 共用一个 name），返回的是数组；其它情况返回单个值。

```ts
import { serializeForm } from 'ranui';

const data = serializeForm(document.querySelector('form'));
// { username: 'alice', tags: ['a', 'b'] }
fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) });
```

## 布局

字段没有默认的表单级布局——用普通 CSS 给你自己的 `<form>` 设置样式即可：

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px;">
    <r-input name="first" label="First name"></r-input>
    <r-input name="last" label="Last name"></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Continue</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="first" label="First name"></r-input>
  <r-input name="last" label="Last name"></r-input>
  <button type="submit">Continue</button>
</form>
```

## 校验与重置

`r-input`、`r-checkbox`、`r-select` 都支持 `required`（会阻止提交并触发浏览器原生的校验提示，和原生字段一模一样），以及 `checkValidity()`、`reportValidity()`、`validity`、`validationMessage`。原生的 `form.reset()`（或 `<button type="reset">`）会通过 `formResetCallback()` 把每个字段恢复到交互前的状态。细节见各字段自己的文档（[Input](/cn/src/ranui/input/)、[Checkbox](/cn/src/ranui/checkbox/)、[Select](/cn/src/ranui/select/)）。

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.success('Valid — submitted')">
    <r-input name="username" label="Username" required></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="Username" required></r-input>
  <button type="submit">Submit</button>
</form>
```

## 为什么没有 `<r-form>` 包装组件

早期的 ranui 有过一个——它自己在 shadow DOM 里建一个内部 `<form>`，再把字段投影进去。这行不通：表单归属是沿着真实的（light DOM）祖先链去解析的，这条链从不会跨进 shadow root。藏在 shadow DOM 里的 `<form>` 永远不可能成为 light DOM 子元素的表单归属，哪怕这些子元素是通过 `<slot>` 渲染出来的——这一点是直接实测出来的（一个通过这种方式投影的普通 `<input>`，它的 `.form` 是 `null`，`new FormData(...)` 也完全看不到它），是在真实浏览器里验证的，不是纸上谈兵。也就是说无论如何这个 `<form>` 都必须是真实的、在 light DOM 里的——这意味着那层包装组件只是在你自己的 `<form>` 外面多套了一层元素，却没有多提供任何一个普通 `<form>` 本来就没有的能力。现在改用 `serializeForm()` 提供其中唯一真正有用的部分（提交 → 普通对象），不再需要这层包装。
