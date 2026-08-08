# Form

对原生 `<form>`的一层轻量封装，提交时会把它序列化为一段 JSON 字符串。

> **适用场景**：需要收集一组具名字段、并在提交时把它们读回一段序列化 JSON 字符串——`<r-form>` 包裹你自己的原生 `<form>`，拦掉它默认会跳转页面的提交行为，并替你做序列化。

## 快速开始

### 基础用法

<Demo column>
  <r-form>
    <form>
      <r-input name="username" label="Username" placeholder="Enter username"></r-input>
      <r-checkbox name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
      <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
    </form>
  </r-form>
</Demo>

```html
<r-form>
  <form>
    <r-input name="username" label="Username" placeholder="Enter username"></r-input>
    <r-checkbox name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
    <button type="submit">Submit</button>
  </form>
</r-form>
```

`<r-form>`要求你给它一个真正的 `<form>` 子元素——它自己不会创建一个。这是刻意的：藏在 shadow DOM 里的 `<form>` 永远不可能成为外部任何元素的表单归属（这一点已经实测验证，不只是理论推断；见下方[为什么要用一个真正的 `<form>`？](#为什么要用一个真正的-form)），所以没有任何 shadow DOM 技巧能替代你自己的 `<form>`。`<r-form>` 只是给这个 `<form>` 一套合理的默认布局（纵向排列、16px 间距——如上所示，零配置即可），并监听它的 `submit`/`reset`。

## API 参考

### 属性

| 属性    | 类型             | 默认值 | 说明                                                                    |
| ------- | ---------------- | ------ | ----------------------------------------------------------------------- |
| `value` | `string \| null` | `null` | 序列化后的表单状态；`<form>` 每次提交都会重新计算并写入这个 JSON 字符串 |
| `sheet` | `string`         | `''`   | 注入组件 shadow DOM 的 CSS，通过 `::slotted()` 定位投影进来的 `<form>`  |

### 序列化值 `value`

提交时，`<r-form>` 会调用 `preventDefault()`（拦掉原生的页面跳转式提交），通过 `FormData` 把表单的具名字段收集成一个普通对象，再把该对象 `JSON.stringify(...)` 的结果写入 `value`——每次提交都会重新计算，因此它反映的始终是提交那一刻字段的真实内容。设置 `value` 会反射到 `value` 属性上；传入 `null` 会被忽略。原生 `reset`（例如 `<button type="reset">` 或 `form.reset()`）会把 `value` 清回 `null`。

<Demo column>
  <r-form>
    <form>
      <r-input name="email" label="Email" placeholder="you@example.com"></r-input>
      <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Save</button></r-button>
    </form>
  </r-form>
</Demo>

```html
<r-form id="signup">
  <form>
    <r-input name="email" label="Email" placeholder="you@example.com"></r-input>
    <button type="submit">Save</button>
  </form>
</r-form>

<script>
  const form = document.querySelector('#signup');
  // 内部表单提交后读取序列化的 JSON 字符串
  console.log(form.value); // 例如 '{"email":"you@example.com"}'
</script>
```

### 布局与样式 `sheet`

投影进来的 `<form>` 默认使用纵向 flex 布局（`flex-direction: column`、`align-items: stretch`、`gap: 16px`）。按改动幅度从小到大有三种定制方式：

- **CSS 变量**——只想微调数值时直接设在宿主元素上，不需要 `sheet`：`--ran-form-gap`、`--ran-form-flex-direction`、`--ran-form-align-items`、`--ran-form-content-display`，以及宿主自身的 `--ran-form-display`（默认 `contents`）。
- **直接给自己的 `<form>` 写普通 CSS**——它是真正的 light DOM 元素，一条普通规则（一个 class、一个 id、`r-form form { ... }`）就够用，不需要任何 ranui 专属机制。
- **`sheet`**——用于结构性改动（比如切换成网格布局），和其它所有 ranui 组件的约定一致，注入形式是 `::slotted(form) { ... }`。

<Demo column>
  <r-form sheet="::slotted(form) { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }">
    <form>
      <r-input name="first" label="First name"></r-input>
      <r-input name="last" label="Last name"></r-input>
      <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Continue</button></r-button>
    </form>
  </r-form>
</Demo>

```html
<r-form sheet="::slotted(form) { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }">
  <form>
    <r-input name="first" label="First name"></r-input>
    <r-input name="last" label="Last name"></r-input>
    <button type="submit">Continue</button>
  </form>
</r-form>
```

```css
/* 等价的纯数值微调，不需要 sheet： */
r-form {
  --ran-form-gap: 24px;
}
```

## 事件

`r-form` 不派发任何自定义事件。它监听从投影进来的 `<form>` 冒泡上来的 `submit` 与 `reset`：`submit` 会被拦截（不再跳转页面）并（重新）计算 `value`；`reset` 会把 `value` 清回 `null`。

```html
<r-form id="profile">
  <form>
    <r-input name="name" label="Name"></r-input>
    <button type="submit">Submit</button>
  </form>
</r-form>

<script>
  const form = document.querySelector('#profile');
  document.querySelector('#profile button[type="submit"]').addEventListener('click', () => {
    // value 在冒泡上来的 submit 之后被设置
    console.log(form.value);
  });
</script>
```

## 插槽

### 默认插槽

唯一的（无名）插槽——把你自己的 `<form>`（且只有它）放进 `<r-form>` 里。

## 为什么要用一个真正的 `<form>`

表面上看，让 `<r-form>` 自己在 shadow DOM 里建一个内部 `<form>`、再把你的字段投影进去会更简单——这个组件早期版本就是这么做的。但这行不通：表单归属是沿着真实的（light DOM）祖先链去解析的，而这条链从不会跨进 shadow root。藏在 shadow DOM 里的 `<form>` 永远不可能成为 light DOM 子元素的表单归属，哪怕这些子元素是通过 `<slot>` 渲染出来的——这一点是直接实测出来的（一个通过这种方式投影的普通 `<input>`，它的 `.form` 是 `null`，`new FormData(...)` 也完全看不到它），是在真实浏览器里验证的，不是纸上谈兵。

所以这个 `<form>` 必须是真实的、由你自己写的、在 light DOM 里的。好处是：`r-input`、`r-checkbox`、`r-select` 本身就是 [Form-Associated Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_form-associated_custom_elements)（各自调用了 `attachInternals()` + `ElementInternals.setFormValue()`），一旦它们成为一个真正 `<form>` 的真实后代，所有原生能力就都能用了：`new FormData(form)` 能收集到它们，`form.reset()` 能把它们恢复到交互前的状态，`required` 字段会阻止提交并显示浏览器原生的校验提示（锚定在该字段上）——这些都不需要 `<r-form>` 写一行代码。`<r-form>` 本身只是在这基础上提供的可选便利：一套默认布局，外加一个帮你省掉手写 `FormData` → JSON 这段样板代码的 `value` 属性。如果你两个都不需要，完全可以跳过它，直接用一个普通的 `<form>`。

## 最佳实践

- **一定要嵌套一个真正的 `<form>`**：`<r-form>` 不会替你创建——见[为什么要用一个真正的 `<form>`](#为什么要用一个真正的-form)。
- **给字段命名**：只有带 `name` 的字段才会被收进序列化后的 `value`。
- **从 `value` 读取结果**：提交后，序列化的 JSON 字符串存在 `value` 属性/特性上，reset 后会被清空。
- **布局优先用 CSS 变量或普通 CSS**：只有结构性改动才用 `sheet`——见[布局与样式](#布局与样式-sheet)。
- **校验直接用字段自己的 `required`**：`r-input`、`r-checkbox`、`r-select` 都支持 `required` 以及 `checkValidity()`/`reportValidity()`——原生浏览器校验会阻止提交，`<r-form>` 里不需要写任何代码。
