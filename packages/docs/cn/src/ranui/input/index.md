# Select 下拉选择框

下拉选择器组件，支持单选、搜索、自定义样式等功能。

## 快速开始

### 基础用法

<r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
</r-select>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## API 参考

### Select 属性

| 属性                  | 类型      | 默认值      | 说明                                              |
| --------------------- | --------- | ----------- | ------------------------------------------------- |
| `defaultValue`        | `string`  | `''`        | 默认选中的值                                      |
| `disabled`            | `boolean` | `false`     | 是否禁用选择器                                    |
| `type`                | `string`  | `'default'` | 选择器类型：`default`、`text`                     |
| `placement`           | `string`  | `'bottom'`  | 下拉框展示方向：`top`、`bottom`                   |
| `showSearch`          | `boolean` | `false`     | 是否显示搜索框                                    |
| `getPopupContainerId` | `string`  | `''`        | 下拉框挂载元素的 id                               |
| `dropdownclass`       | `string`  | `''`        | 下拉框的自定义 class 名                           |
| `trigger`             | `string`  | `'click'`   | 触发方式：`click`、`hover`、`click,hover`、`none` |

### Option 属性

| 属性       | 类型      | 默认值  | 说明           |
| ---------- | --------- | ------- | -------------- |
| `value`    | `string`  | `''`    | 选项的值       |
| `disabled` | `boolean` | `false` | 是否禁用该选项 |

### 默认值 `defaultValue`

设置当前选中的值

<r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
</r-select>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 禁用状态 `disabled`

<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
</r-select>

```html
<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 文本类型 `type`

可以设置文本类型，不显示边框和下拉图标

<r-select
      style="width: 120px; height: 40px"
      type="text"
      defaultValue="185"
    >
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```html
<r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 下拉方向 `placement`

下拉框展示方向默认向下，设置成 `top` 可以向上展示

<r-select
      style="width: 120px; height: 40px"
      type="text"
      defaultValue="185"
      placement="top"
    >
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```html
<r-select style="width: 120px; height: 40px" type="text" defaultValue="185" placement="top">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 搜索功能 `showSearch`

展开后可对选项进行搜索

<r-select style="width: 120px; height: 40px" showSearch>
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```html
<r-select style="width: 120px; height: 40px" showSearch>
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 挂载容器 `getPopupContainerId`

下拉框默认挂载到 `document.body` 上，可以传入元素的 `id` 挂载到指定元素内

```html
<r-select getPopupContainerId="elementid">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 自定义样式 `dropdownclass`

如果需要自定义下拉框的样式，可以传入一个 `class` 名

```html
<r-select dropdownclass="custom-dropdown">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### 触发方式 `trigger`

控制下拉框的触发方式

<r-select style="width: 120px; height: 40px" trigger="click,hover">
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```html
<!-- 点击触发（默认） -->
<r-select trigger="click">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- 悬停触发 -->
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

<!-- 不触发 -->
<r-select trigger="none">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## 事件

### 选择变化事件

```html
<r-select onchange="handleChange">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  function handleChange(value) {
    console.log('选中的值：', value);
  }
</script>
```

## 最佳实践

- **选项数量**: 当选项较多时，建议启用搜索功能
- **触发方式**: 根据用户习惯选择合适的触发方式
- **挂载位置**: 在复杂布局中注意下拉框的挂载位置
- **样式定制**: 使用 `dropdownclass` 进行样式定制
- **禁用选项**: 使用 `disabled` 属性禁用不需要的选项
