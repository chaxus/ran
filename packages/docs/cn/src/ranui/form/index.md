# Form 表单

对 shadow DOM 中的原生 `<form>` 的轻量自定义元素封装。它通过具名插槽投影你的表单字段，
并在提交时将表单中的具名字段序列化为 JSON 字符串，暴露在 `value` 属性上。

## 代码演示

<r-form>
  <div slot="r-form_content">
    <input name="username" placeholder="用户名" />
    <button type="submit">提交</button>
  </div>
</r-form>

```xml
<r-form>
  <div slot="r-form_content">
    <input name="username" placeholder="用户名" />
    <button type="submit">提交</button>
  </div>
</r-form>
```

投影到表单中的字段必须带有 `slot="r-form_content"`（或包裹在带此属性的元素中），
才能落入内部 `<form>` 的具名插槽。

## 属性

### `value`

序列化后的表单状态。内部表单提交时，组件将其具名字段收集成一个 JSON 对象，
并把该对象的 `JSON.stringify(...)` 存到该属性/属性值上。通过 `value` getter 读取：

```js
const form = document.querySelector('r-form');
form.addEventListener('submit', () => {
  console.log(form.value); // 例如 '{"username":"jane"}'
});
```

设置 `value` 会反射到 `value` 特性上（值为 `null` 时忽略）。

### `sheet`

注入到组件 shadow DOM 的 CSS，与其它所有 ranui 组件的 `sheet` 约定一致。
内部的表单元素带有 `.r-form` 类名，因此可以在注入的样式表中定位它。

## 插槽

### `r-form_content`

用于把你的字段投影进内部 `<form>` 的唯一具名插槽。没有 `slot="r-form_content"` 的内容
不会被放进表单。

## 样式定制

`r-form` 不暴露任何 `::part()` 句柄，也没有专属的 `--ran-form-*` CSS 变量 —— 它的 shadow
树就是一个原生的 `<form class="r-form">`。你可以通过 light DOM（你自己的字段）为其设置样式，
或通过 `sheet` 属性注入规则。

```xml
<r-form sheet=".r-form { display: grid; gap: 12px; }">
  <div slot="r-form_content">
    <input name="email" />
    <button type="submit">保存</button>
  </div>
</r-form>
```

通过 `import 'ranui'`（注册全部组件）或独立子路径 `import 'ranui/form'` 引入。
