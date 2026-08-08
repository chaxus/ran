# Form 表单

对 shadow DOM 中原生 `<form>` 的容器封装，提交时会把表单字段序列化为一段 JSON 字符串。

> **适用场景**：需要收集一组具名字段、并在提交时把它们读回一段序列化 JSON 字符串——`<r-form>` 会包一层原生 `<form>`，替你收集投影进来的字段。

## 快速开始

### 基础用法

<Demo column>
  <r-form sheet=".r-form { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }">
    <r-input slot="r-form_content" name="username" label="Username" placeholder="Enter username"></r-input>
    <r-checkbox slot="r-form_content" name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
    <r-button slot="r-form_content" type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
  </r-form>
</Demo>

```html
<r-form sheet=".r-form { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }">
  <r-input slot="r-form_content" name="username" label="Username" placeholder="Enter username"></r-input>
  <r-checkbox slot="r-form_content" name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
  <button slot="r-form_content" type="submit">Submit</button>
</r-form>
```

字段必须通过具名插槽 `r-form_content` 投影进来（直接投影，或包裹在一个带 `slot="r-form_content"` 的元素里）。像上面这样直接投影，才能让 `.r-form` 上的 `sheet` 规则（见下方 [注入样式](#注入样式-sheet)）直接给这些字段本身排版；如果套一层 `<div>` 包装，`.r-form` 能布局的就只剩这一个 wrapper 子元素了。

## API 参考

### 属性

| 属性     | 类型             | 默认值  | 说明                                                             |
| -------- | ---------------- | ------- | ------------------------------------------------------------------ |
| `value`  | `string \| null` | `null`  | 序列化后的表单状态，内部表单提交时写入这个 JSON 字符串。           |
| `sheet`  | `string`         | `''`    | 注入组件 shadow DOM 的 CSS（内部表单元素带有 `.r-form` 类名）。    |

### 序列化值 `value`

提交时，组件通过 `FormData` 把具名字段收集成一个普通对象，再把该对象 `JSON.stringify(...)` 的结果写入 `value`。设置 `value` 会反射到 `value` 属性上；传入 `null` 会被忽略。

<Demo column>
  <r-form sheet=".r-form { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }">
    <r-input slot="r-form_content" name="email" label="Email" placeholder="you@example.com"></r-input>
    <r-button slot="r-form_content" type="primary"><button type="submit" style="all: unset; cursor: pointer">Save</button></r-button>
  </r-form>
</Demo>

```html
<r-form id="signup" sheet=".r-form { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }">
  <r-input slot="r-form_content" name="email" label="Email" placeholder="you@example.com"></r-input>
  <button slot="r-form_content" type="submit">Save</button>
</r-form>

<script>
  const form = document.querySelector('#signup');
  // 内部表单提交后读取序列化的 JSON 字符串
  console.log(form.value); // 例如 '{"email":"you@example.com"}'
</script>
```

### 注入样式 `sheet`

`sheet` 与其它所有 ranui 组件的约定一致：其 CSS 会被注入 shadow DOM。通过 `.r-form` 类名定位内部表单——例如把字段排成网格布局。

<Demo column>
  <r-form sheet=".r-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }">
    <r-input slot="r-form_content" name="first" label="First name"></r-input>
    <r-input slot="r-form_content" name="last" label="Last name"></r-input>
    <r-button slot="r-form_content" type="primary"><button type="submit" style="all: unset; cursor: pointer">Continue</button></r-button>
  </r-form>
</Demo>

```html
<r-form sheet=".r-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }">
  <r-input slot="r-form_content" name="first" label="First name"></r-input>
  <r-input slot="r-form_content" name="last" label="Last name"></r-input>
  <button slot="r-form_content" type="submit">Continue</button>
</r-form>
```

之所以能这样布局，是因为 `.r-form` 排的是它自己的直接子元素——每个直接投影进 `r-form_content`（而非套在 `<div>` 里）的字段，都会成为这些直接子元素之一，所以 `.r-form` 上的 `display: grid` 排的是字段本身，而不是单单一个 wrapper。

## 事件

`r-form` 不派发任何自定义事件。它唯一的事件行为，是监听内部 `<form>` 的原生 `submit` 事件，并据此更新 `value` 属性为序列化后的 JSON 字符串。提交发生后，从 `value` 读取结果即可。

```html
<r-form id="profile">
  <div slot="r-form_content">
    <r-input name="name" label="Name"></r-input>
    <button type="submit">Submit</button>
  </div>
</r-form>

<script>
  const form = document.querySelector('#profile');
  document.querySelector('#profile button[type="submit"]').addEventListener('click', () => {
    // value 在内部表单提交后被设置
    console.log(form.value);
  });
</script>
```

## 插槽

### `r-form_content`

用于把你的字段投影进内部 `<form>` 的唯一具名插槽。没有 `slot="r-form_content"` 的内容不会被放进表单，也不会被序列化。

## 最佳实践

- **通过插槽投影**：始终给字段加上 `slot="r-form_content"`（或包裹在带此属性的元素里）。
- **给字段命名**：只有带 `name` 的字段才会被收进序列化后的 `value`。
- **从 `value` 读取结果**：提交后，序列化的 JSON 字符串存在 `value` 属性/特性上。
- **通过 `sheet` 布局**：shadow 树没有暴露任何 `::part()` 句柄或 CSS 变量——要么通过 `sheet` 属性给内部的 `<form class="r-form">` 注入样式规则，要么直接在 light DOM 里给自己的字段设置样式。
