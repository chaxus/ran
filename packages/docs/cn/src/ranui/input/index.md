---
description: 'ranui Input（<r-input>）是用于键盘输入的基础表单控件，支持类型、尺寸与校验，可在任意框架中使用的原生 Web Component。'
---

# Input 输入框

用于键盘输入的基础表单控件，是最基础的表单控件。

> **适用场景**：需要一个带静态顶部标签、前置图标、校验状态/提示文本、并能参与原生表单的文本字段——`<r-input>` 覆盖文本、密码、数字输入。

## 快速开始

### 基础用法

<Demo column>
  <r-input placeholder="请输入"></r-input>
</Demo>

```html
<r-input placeholder="请输入"></r-input>
```

## API 参考

### 属性

| 属性          | 类型      | 默认值 | 说明                                                       |
| ------------- | --------- | ------ | ------------------------------------------------------------ |
| `label`       | `string`  | `''`   | 渲染在字段上方的静态标签                                    |
| `placeholder` | `string`  | `''`   | 占位提示文字，转发给内部原生 `<input>`                      |
| `value`       | `string`  | `''`   | 字段值，会反映为属性并同步给表单                              |
| `disabled`    | `boolean` | `false`| 是否禁用                                                     |
| `type`        | `string`  | `''`   | 转发给内部控件的原生 input 类型（`text`、`password`、`number` …） |
| `icon`        | `string`  | `''`   | 字段内前置图标名称（以 `r-icon` 渲染）                        |
| `name`        | `string`  | `''`   | 参与表单时使用的字段名                                        |
| `status`      | `string`  | `''`   | 校验状态：`error`、`warning`                                  |
| `message`     | `string`  | `''`   | 渲染在字段下方的辅助/校验文字                                  |
| `min`         | `string`  | `''`   | 最小值；`type="number"` 时转发给内部 `<input>`                |
| `max`         | `string`  | `''`   | 最大值；`type="number"` 时转发给内部 `<input>`                |
| `step`        | `string`  | `''`   | 步长；`type="number"` 时转发给内部 `<input>`                  |
| `required`    | `boolean` | `false`| 转发给内部 `<input>`，使原生约束校验生效                        |
| `sheet`       | `string`  | `''`   | 注入 shadow root 的自定义样式                                 |

### 标签 `label`

渲染在字段上方的静态标签——始终可见，不会与相邻内容重叠，聚焦时也不会引起布局跳动（顶部对齐的标签比内联/浮动标签填写更快，见 [Luke Wroblewski 的眼动研究](https://www.lukew.com/ff/entry.asp?504=)）。

<Demo column>
  <r-input label="用户名"></r-input>
</Demo>

```html
<r-input label="用户名"></r-input>
```

### 占位提示 `placeholder`

与原生 `placeholder` 属性一致。

<Demo column>
  <r-input placeholder="请输入用户名"></r-input>
</Demo>

```html
<r-input placeholder="请输入用户名"></r-input>
```

### 值 `value`

<Demo column>
  <r-input value="1234"></r-input>
</Demo>

```html
<r-input value="1234"></r-input>
```

### 禁用状态 `disabled`

<Demo column>
  <r-input label="用户名" disabled></r-input>
</Demo>

```html
<r-input label="用户名" disabled></r-input>
```

### 图标 `icon`

<Demo column>
  <r-input icon="user"></r-input>
</Demo>

```html
<r-input icon="user"></r-input>
```

### 输入类型 `type`

<Demo column>
  <r-input icon="lock" type="password" placeholder="密码"></r-input>
  <r-input type="number" placeholder="数字"></r-input>
</Demo>

```html
<r-input icon="lock" type="password" placeholder="密码"></r-input>
<r-input type="number" placeholder="数字"></r-input>
```

### 校验状态 `status`

把 `status` 和 `message` 配对使用，让状态通过文字而不是单纯的颜色传达。

<Demo column>
  <r-input status="error" label="用户名" message="该字段为必填项"></r-input>
  <r-input status="warning" label="用户名" message="请检查这个值"></r-input>
</Demo>

```html
<r-input status="error" label="用户名" message="该字段为必填项"></r-input>
<r-input status="warning" label="用户名" message="请检查这个值"></r-input>
```

### 辅助文字 `message`

在字段下方渲染辅助/校验文字。

<Demo column>
  <r-input label="邮箱" message="我们不会公开你的邮箱"></r-input>
</Demo>

```html
<r-input label="邮箱" message="我们不会公开你的邮箱"></r-input>
```

### 表单字段名 `name`

```html
<r-input name="username" label="用户名"></r-input>
```

## 事件

两个事件都以 `CustomEvent` 派发，当前值携带在 `detail` 中。

| 事件     | 触发时机                             | `detail`             |
| -------- | -------------------------------------- | -------------------- |
| `input`  | 每次按键时触发（对应原生 `input`）      | `{ value: string }`  |
| `change` | 提交/失焦时触发（对应原生 `change`）    | `{ value: string }`  |

### `input` 事件

<Demo column>
  <r-input oninput="console.log(event.detail.value)" label="用户名"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', '用户名');
input.addEventListener('input', (event) => {
  console.log('正在输入：', event.detail.value);
});
```

### `change` 事件

<Demo column>
  <r-input onchange="console.log(event.detail.value)" label="用户名"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', '用户名');
input.addEventListener('change', (event) => {
  console.log('值已变化：', event.detail.value);
});
```

## 表单关联

`r-input` 是一个表单关联自定义元素（`static formAssociated = true`）。它挂载了 `ElementInternals`，并通过 `setFormValue` 上报自己的值，因此只要是原生 `<form>` 的真实子孙元素，就能被 `new FormData(form)` 收集到——记得设置 `name` 来指定它的 key。把提交结果转成普通对象时，参见 [Forms](/cn/src/ranui/form/) 里的 `serializeForm()` 辅助函数。

```html
<form>
  <r-input name="username" label="用户名"></r-input>
</form>
```

**重置**：原生的 `form.reset()`（或 `<button type="reset">`）会把字段恢复到它首次连接时的值——通过浏览器自动调用的生命周期钩子 `formResetCallback()` 实现。

**校验**：设置 `required` 后，空字段会通过 `ElementInternals.setValidity()` 变为无效状态——`form.checkValidity()`/`form.reportValidity()` 能感知到，提交时会显示浏览器原生的校验提示，锚定在该字段上。`disabled` 的字段永远不会阻塞校验，与原生 `<input>` 语义一致。`r-input` 也暴露了原生字段常见的方法/属性：`checkValidity()`、`reportValidity()`、`validity`、`validationMessage`。

```html
<form>
  <r-input name="username" label="用户名" required></r-input>
  <button type="submit">提交</button>
</form>
```

## CSS Parts

通过 `::part()` 选择器定位内部结构：

| Part      | 对应元素                                |
| --------- | ---------------------------------------- |
| `input`   | 字段外层容器                              |
| `content` | 内部原生 `<input>` 控件                   |
| `label`   | 字段上方的静态标签（设置 `label` 时存在） |
| `message` | 辅助/校验文字（设置 `message` 时存在）    |

```css
r-input::part(content) {
  font-size: 16px;
}
```

## 最佳实践

- **标签**：设置有意义的 `label`，让字段拥有可访问的名称。
- **占位提示**：`placeholder` 用于输入提示，不能替代 `label`。
- **状态 + 提示**：把 `status` 和 `message` 配对使用，不要只靠颜色传达状态。
- **图标**：加上相关的 `icon` 提升可辨识度。
- **类型**：为内容选择合适的 `type`（`text`、`password`、`number` …）。
- **表单**：在表单中收集值时设置 `name`。
