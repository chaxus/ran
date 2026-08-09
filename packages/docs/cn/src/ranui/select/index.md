---
description: 'ranui Select（<r-select>）是从选项中选值的下拉选择器，支持搜索与原生表单参与。'
---

# Select 下拉选择框

从一组选项中选择单个值的下拉选择器，支持可选的搜索与表单参与。

> **适用场景**：需要一个由 `<r-option>` 子元素构建的单值下拉选择器，可选支持搜索和原生表单参与——`<r-select>` 负责展开、过滤，以及 `FormData` 上报。

## 快速开始

### 基础用法

选项通过插槽里的 `<r-option>` 子元素提供。每个选项的 `value` 属性是它的值，文本内容是显示的标签。

<Demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## API 参考

### Select 属性

| 属性                  | 类型      | 默认值     | 说明                                                                         |
| --------------------- | --------- | ---------- | ---------------------------------------------------------------------------- |
| `label`               | `string`  | `''`       | 字段上方的静态标题——和 `r-input` 的 `label` 用法一致，方便和输入框对齐       |
| `value`               | `string`  | `''`       | 选中的值。设置它会更新收起状态下的显示文本；`disabled` 时忽略                |
| `defaultValue`        | `string`  | `''`       | 初始选中的值，与选项的 `value` 匹配                                          |
| `disabled`            | `boolean` | `false`    | 是否禁用选择器                                                               |
| `type`                | `string`  | `''`       | `text` 渲染成无边框、透明背景、不带箭头图标的触发器；否则带边框              |
| `placement`           | `string`  | `'bottom'` | 下拉框展示方向：`top`、`bottom`                                              |
| `showSearch`          | `boolean` | `false`    | 是否显示按标签过滤选项的内联搜索框                                           |
| `getPopupContainerId` | `string`  | `''`       | 下拉框挂载元素的 `id`（默认挂载到 `document.body`）                          |
| `dropdownclass`       | `string`  | `''`       | 下拉面板的自定义 class 名                                                    |
| `trigger`             | `string`  | `'click'`  | 下拉框的触发方式：`click`、`hover`，或 `click,hover`（`hover` 在移动端无效） |
| `required`            | `boolean` | `false`    | 表单提交前是否要求已选择                                                     |
| `sheet`               | `string`  | `''`       | 注入 shadow DOM 的自定义样式                                                 |

> **注意**：`defaultValue` 和 `showSearch` 是响应式的——元素连接后再修改它们，也会在 `attributeChangedCallback` 里被重新处理（和 `value`、`disabled`、`sheet` 一样）。更新 `defaultValue` 会重新应用匹配的选中项；切换 `showSearch` 会装配或卸载内联搜索框。

### Option 属性

选项通过 `<r-option>` 子元素提供。

| 属性       | 类型      | 默认值  | 说明                                       |
| ---------- | --------- | ------- | ------------------------------------------ |
| `value`    | `string`  | `''`    | 选项的值；被选中时作为 select 的值发出     |
| `disabled` | `boolean` | `false` | 标记该选项不可选——点击和键盘选择都会跳过它 |
| `sheet`    | `string`  | `''`    | 注入选项 shadow DOM 的自定义样式           |

选项标签或值重复时会打印一条 `console.warn`。

### 标题 `label`

字段上方的静态标题——始终可见，不会和相邻内容重叠。使用和 `r-input` 的 `label` 相同的
token 与布局，所以并排放置的带标题 select 和带标题 input 会对齐（同样的高度、同样的顶边）。

<Demo>
  <r-select label="Country" style="width: 180px" defaultValue="185">
    <r-option value="185">United States</r-option>
    <r-option value="186">Canada</r-option>
    <r-option value="187">Mexico</r-option>
  </r-select>
</Demo>

```html
<r-select label="Country" defaultValue="185">
  <r-option value="185">United States</r-option>
  <r-option value="186">Canada</r-option>
  <r-option value="187">Mexico</r-option>
</r-select>
```

### 默认值 `defaultValue`

<Demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 禁用状态 `disabled`

<Demo>
  <r-select style="width: 120px; height: 40px" disabled defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 文本类型 `type`

<Demo>
  <r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 下拉方向 `placement`

`placement` 只是一个偏好设置，不是保证：当触发器靠近视口边缘、偏好方向放不下时，下拉框会自动翻转到另一侧，并水平偏移以保持在屏幕内。这一行为只对默认的 body 级挂载生效——设置了 `getPopupContainerId` 时，请自行选一个适合容器的 `placement`。

<Demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 搜索功能 `showSearch`

<Demo>
  <r-select style="width: 120px; height: 40px" showSearch="true">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" showSearch="true">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 触发方式 `trigger`

<Demo>
  <r-select style="width: 120px; height: 40px" trigger="click,hover">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<!-- 点击触发（默认） -->
<r-select trigger="click">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- 悬停触发（移动端无效） -->
<r-select trigger="hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- 点击和悬停都触发 -->
<r-select trigger="click,hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 挂载容器 `getPopupContainerId`

下拉框默认挂载到 `document.body`。传入另一个元素的 `id`，可以改为挂载到那个元素内。

```html
<r-select getPopupContainerId="my-container">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 自定义下拉 class `dropdownclass`

```html
<r-select dropdownclass="custom-dropdown">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## 事件

### `change`

选中某个选项时触发。`event.detail` 是 `{ value, label }`，`value` 是选中选项的值，`label` 是它显示的文本。选中初始的 `defaultValue` 不会触发 `change`。

```html
<r-select id="picker">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('picker').addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.label); // 例如 "186" "Tom"
  });
</script>
```

### `search`

只有开启 `showSearch` 时才会触发，用户在搜索框输入时触发（节流过的）。`event.detail` 是 `{ value }`，也就是当前的搜索文本。组件内部也会按标签过滤可见选项。

```html
<r-select showSearch="true" id="searchable">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('searchable').addEventListener('search', (e) => {
    console.log(e.detail.value);
  });
</script>
```

## 表单关联

`r-select` 是一个表单关联自定义元素（`static formAssociated = true`）。它通过 `ElementInternals` 上报选中的 `value`，因此只要是原生 `<form>` 的真实子孙元素，就会以该 select 的 `name` 被 `new FormData(form)` 收集。表单值在连接时就会从初始选中项中取值，之后随值变化保持同步。

**重置**：原生 `form.reset()` 会通过 `formResetCallback()` 恢复 `defaultValue` 对应的选中项（如果设置了的话），否则清空选中状态。

**校验**：`required` 会让空选择通过 `ElementInternals.setValidity()` 变为无效状态，`form.checkValidity()`/`form.reportValidity()` 能感知到；`disabled` 的 select 永远不会阻塞校验。元素上暴露了和原生表单控件一致的 `checkValidity()`、`reportValidity()`、`validity`、`validationMessage`。

```html
<form>
  <r-select name="country" required>
    <r-option value="us">United States</r-option>
    <r-option value="ca">Canada</r-option>
  </r-select>
  <button type="submit">提交</button>
</form>
```

## 插槽

| 插槽     | 说明                                   |
| -------- | -------------------------------------- |
| （默认） | 接受用于定义可选项的 `<r-option>` 元素 |

## CSS Parts

| Part             | 说明                                        |
| ---------------- | ------------------------------------------- |
| `select`         | select 的根容器                             |
| `selection`      | 触发器方框（边框、背景、布局）              |
| `icon`           | 下拉箭头图标                                |
| `selection-item` | 显示选中项标签的元素                        |
| `search`         | 内联搜索输入框（`showSearch` 时可见）       |
| `label`          | 字段上方的静态标题（设置了 `label` 时存在） |

## 最佳实践

- **选项较多时**：开启 `showSearch`，让用户能按标签过滤。
- **触发方式**：`trigger` 要符合用户预期；`hover` 在移动端无效，记得保留 `click`。
- **挂载位置**：在滚动或裁剪溢出内容的布局里，用 `getPopupContainerId` 控制下拉框挂载到哪里。
- **自定义样式**：用 `dropdownclass` 或暴露的 `::part()` 名称来重新设计触发器和下拉框的样式。
- **表单**：给 select 加上 `name`，这样它的值才能被原生 `<form>` 里的 `FormData` 收集到。
