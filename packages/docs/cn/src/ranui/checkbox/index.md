---
description: 'ranui Checkbox（<r-checkbox>）用于切换单个开关选项，支持可选标签与原生表单。'
---

# Checkbox 多选框

用于切换单个开关选项的复选框组件，支持可选标签与原生表单。

> **适用场景**：需要一个带标签、能参与原生表单的单个开关控件——`<r-checkbox>` 会把选中状态上报给 `FormData`，并支持键盘操作。

## 快速开始

### 基础用法

<Demo>
  <r-checkbox>记住我</r-checkbox>
</Demo>

```html
<r-checkbox>记住我</r-checkbox>
```

默认插槽的内容会作为复选框的标签。

## API 参考

### 属性

| 属性         | 类型      | 默认值    | 说明                                       |
| ------------ | --------- | --------- | ------------------------------------------ |
| `checked`    | `boolean` | `false`   | 是否选中                                   |
| `value`      | `string`  | `'false'` | 表单值，随选中状态同步为 `'true'`/`'false'` |
| `disabled`   | `boolean` | `false`   | 是否禁用                                   |
| `required`   | `boolean` | `false`   | 表单提交前是否必须勾选                     |
| `sheet`      | `string`  | `''`      | 注入组件 shadow DOM 的自定义样式           |

> `checked` 和 `value` 两个属性保持同步：改其中一个另一个也会跟着变。选中时 `value` 为 `'true'`，未选中时为 `'false'`。

### 选中状态 `checked`

<Demo>
  <r-checkbox checked="true">已选中</r-checkbox>
  <r-checkbox checked="false">未选中</r-checkbox>
</Demo>

```html
<r-checkbox checked="true">已选中</r-checkbox> <r-checkbox checked="false">未选中</r-checkbox>
```

### 值 `value`

<Demo>
  <r-checkbox value="true">值为 true</r-checkbox>
  <r-checkbox value="false">值为 false</r-checkbox>
</Demo>

```html
<r-checkbox value="true">值为 true</r-checkbox> <r-checkbox value="false">值为 false</r-checkbox>
```

### 禁用状态 `disabled`

<Demo>
  <r-checkbox checked="true" disabled>已选中</r-checkbox>
  <r-checkbox checked="false" disabled>未选中</r-checkbox>
</Demo>

```html
<r-checkbox checked="true" disabled>已选中</r-checkbox> <r-checkbox checked="false" disabled>未选中</r-checkbox>
```

### 自定义样式 `sheet`

`sheet` 属性向 shadow DOM 注入 CSS，可以通过内部结构的类名定位并覆盖样式。

<Demo>
  <r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">带主题色的标签</r-checkbox>
</Demo>

```html
<r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">带主题色的标签</r-checkbox>
```

## 事件

### `change`

复选框被切换时触发（点击，或按 Space/Enter）。事件是一个 `CustomEvent`，`detail` 携带切换后的选中状态：

```ts
detail: {
  checked: boolean; // 切换后复选框的选中状态
}
```

禁用状态下的复选框不会触发 `change`。

<Demo>
  <r-checkbox onchange="message.info(this)">点我切换</r-checkbox>
</Demo>

```html
<r-checkbox onchange="handleChange(event)">点我切换</r-checkbox>

<script>
  function handleChange(event) {
    console.log('checked:', event.detail.checked);
  }
</script>
```

## 插槽

| 插槽      | 说明                       |
| --------- | -------------------------- |
| （默认）  | 复选框的标签，渲染在方框旁 |

## 表单关联

`r-checkbox` 是一个表单关联自定义元素（`formAssociated = true`）。它通过 `ElementInternals.setFormValue` 上报选中状态，因此只要是原生 `<form>` 的真实子孙元素，就能参与原生表单，并被 `new FormData(form)` 收集到。遵循原生 checkbox 的语义，只有选中时才会贡献自己的 `value`。

宿主元素本身携带无障碍语义：`role="checkbox"`、`aria-checked`、`aria-disabled`，并支持键盘操作（Space 或 Enter 切换）。

**重置**：原生的 `form.reset()` 会通过 `formResetCallback()` 把选中状态恢复到该复选框首次连接时的状态。

**校验**：`required` 会让未勾选的复选框通过 `ElementInternals.setValidity()` 变为无效状态，`form.checkValidity()`/`form.reportValidity()` 能感知到；`disabled` 的复选框永远不会阻塞校验。元素上暴露了和原生表单控件一致的 `checkValidity()`、`reportValidity()`、`validity`、`validationMessage`。

```html
<form>
  <r-checkbox name="terms" required>我同意条款</r-checkbox>
  <button type="submit">提交</button>
</form>
```

## CSS Parts

通过 `::part()` 选择器定位内部结构：

| Part       | 对应元素                                |
| ---------- | ---------------------------------------- |
| `wrapper`  | 包裹方框与标签的外层 flex 容器            |
| `checkbox` | 方框容器                                  |
| `input`    | 视觉隐藏的 `<input type="checkbox">`      |
| `inner`    | 实际渲染的方框（边框、填充、勾选标记）    |
| `label`    | 包裹默认插槽的标签                        |

```css
r-checkbox::part(inner) {
  border-radius: 50%;
}
r-checkbox::part(label) {
  font-weight: 600;
}
```

## 最佳实践

- **给复选框加标签**：提供插槽文本，让控件拥有可访问的名称。
- **checked 与 value 的选择**：用 `checked` 表示布尔状态；收集表单数据时读 `value`（`'true'`/`'false'`）。
- **禁用状态**：选项不可用时使用 `disabled`。
- **监听 `change`**：读取 `event.detail.checked`，而不是重新查询 DOM。
- **表单**：把 `r-checkbox` 放进 `<form>` 里，选中时会自动被收集。需要把提交结果转成普通对象时，参见 [Forms](/cn/src/ranui/form/) 里的 `serializeForm()` 辅助函数。
