# Form

对 shadow DOM 中原生 `<form>` 的容器封装，提交时会把表单字段序列化为一段 JSON 字符串。

> **适用场景**：需要收集一组具名字段、并在提交时把它们读回一段序列化 JSON 字符串——`<r-form>` 会包一层原生 `<form>`，替你收集投影进来的字段。

## 快速开始

### 基础用法

<Demo column>
  <r-form>
    <r-input name="username" label="Username" placeholder="Enter username"></r-input>
    <r-checkbox name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
  </r-form>
</Demo>

```html
<r-form>
  <r-input name="username" label="Username" placeholder="Enter username"></r-input>
  <r-checkbox name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
  <button type="submit">Submit</button>
</r-form>
```

任何直接放进 `<r-form>` 的子元素都会被投影进内部 `<form>`——不需要记住任何具名插槽，也不需要包一层 wrapper。`.ran-form` 还自带一套合理的默认布局（纵向排列、16px 间距），所以上面这个裸的 `<r-form>` 不用任何配置就已经排版正确。想改布局见下方[布局与样式](#布局与样式-sheet)。

## API 参考

### 属性

| 属性    | 类型             | 默认值 | 说明                                                            |
| ------- | ---------------- | ------ | --------------------------------------------------------------- |
| `value` | `string \| null` | `null` | 序列化后的表单状态；每次提交都会重新计算并写入这个 JSON 字符串  |
| `sheet` | `string`         | `''`   | 注入组件 shadow DOM 的 CSS（内部表单元素带有 `.ran-form` 类名） |

### 序列化值 `value`

提交时，组件通过 `FormData` 把表单的具名字段收集成一个普通对象，再把该对象 `JSON.stringify(...)` 的结果写入 `value`——每次提交都会重新计算，因此它反映的始终是提交那一刻字段的真实内容，而不是表单刚连接时的状态。设置 `value` 会反射到 `value` 属性上；传入 `null` 会被忽略。原生 `reset`（例如 `<button type="reset">` 或 `form.reset()`）会把 `value` 清回 `null`。

<Demo column>
  <r-form>
    <r-input name="email" label="Email" placeholder="you@example.com"></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Save</button></r-button>
  </r-form>
</Demo>

```html
<r-form id="signup">
  <r-input name="email" label="Email" placeholder="you@example.com"></r-input>
  <button type="submit">Save</button>
</r-form>

<script>
  const form = document.querySelector('#signup');
  // 内部表单提交后读取序列化的 JSON 字符串
  console.log(form.value); // 例如 '{"email":"you@example.com"}'
</script>
```

### 布局与样式 `sheet`

`.ran-form` 排的是它自己的直接子元素——每个直接放进 `<r-form>` 里的字段都会成为这些直接子元素之一——默认使用纵向 flex 布局（`flex-direction: column`、`align-items: stretch`、`gap: 16px`）。按改动幅度从小到大有三种定制方式：

- **CSS 变量**——只想微调数值时直接设在宿主元素上，不需要 `sheet`：`--ran-form-gap`、`--ran-form-flex-direction`、`--ran-form-align-items`、`--ran-form-content-display`，以及宿主自身的 `--ran-form-display`（默认 `contents`）。
- **`::part(form)`**——像普通样式表一样定位内部 `<form>`，和其它所有 ranui 组件的约定一致。
- **`sheet`**——用于结构性改动（比如切换成网格布局），把 CSS 直接注入 shadow DOM，同样是所有 ranui 组件通用的约定。

<Demo column>
  <r-form sheet=".ran-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }">
    <r-input name="first" label="First name"></r-input>
    <r-input name="last" label="Last name"></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Continue</button></r-button>
  </r-form>
</Demo>

```html
<r-form sheet=".ran-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }">
  <r-input name="first" label="First name"></r-input>
  <r-input name="last" label="Last name"></r-input>
  <button type="submit">Continue</button>
</r-form>
```

```css
/* 等价的纯数值微调，不需要 sheet： */
r-form {
  --ran-form-gap: 24px;
}
```

## 事件

`r-form` 不派发任何自定义事件。它监听内部 `<form>` 的原生 `submit` 与 `reset` 事件：`submit` 会重新计算并写入 `value`；`reset` 会把 `value` 清回 `null`。提交发生后，从 `value` 读取结果即可。

```html
<r-form id="profile">
  <r-input name="name" label="Name"></r-input>
  <button type="submit">Submit</button>
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

### 默认插槽

唯一的（无名）插槽，把你的字段投影进内部 `<form>`。`<r-form>` 的每个子元素都会落进这里，带 `name` 的会被序列化。

## 为什么不用具名插槽

`r-input`、`r-checkbox`、`r-select` 本身就是 [Form-Associated Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_form-associated_custom_elements)——它们各自调用 `attachInternals()`，通过 `ElementInternals.setFormValue()` 转发自己的值。这意味着它们本来就能在**一个普通的原生 `<form>`**里工作，完全不需要 `<r-form>`：`new FormData(form)` 能收集到它们，`form.reset()` 能把它们恢复到交互前的状态，`required` 字段会阻止提交并显示浏览器原生的校验提示（锚定在该字段上）。`<r-form>` 只是在这基础上提供的可选便利——一套默认布局，外加一个帮你省掉手写 `FormData` → JSON 这段样板代码的 `value` 属性。

## 最佳实践

- **不需要 slot 属性**：字段直接放进 `<r-form>` 即可；套一层 wrapper 也可以，但那样只有 wrapper 本身（而不是里面的字段）参与 `.ran-form` 的布局。
- **给字段命名**：只有带 `name` 的字段才会被收进序列化后的 `value`。
- **从 `value` 读取结果**：提交后，序列化的 JSON 字符串存在 `value` 属性/特性上，reset 后会被清空。
- **间距用 CSS 变量，结构性改动用 `sheet`**：见[布局与样式](#布局与样式-sheet)。
- **校验直接用字段自己的 `required`**：`r-input`、`r-checkbox`、`r-select` 都支持 `required` 以及 `checkValidity()`/`reportValidity()`——原生浏览器校验会阻止提交，`<r-form>` 里不需要写任何代码。
