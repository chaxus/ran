# Tab 图标

标签页，其中`r-tab`需要和`r-tabs`搭配使用

## 代码演示

<div style="width:100%;">
    <r-tabs >
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
<r-tabs >
      <r-tab label="tab1">11111</r-tab>
      <r-tab label="tab2">22222</r-tab>
      <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

## 属性

### 标签名`label`

`r-tab`的属性，设置标签的名称

<div style="width:100%;">
    <r-tabs >
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
<r-tabs >
      <r-tab label="tab1">11111</r-tab>
      <r-tab label="tab2">22222</r-tab>
      <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### 活跃标签`active`，标签的唯一标识`r-key`

- `r-key`是`r-tab`的属性，用于确定同一个`r-tabs`下`r-tab`的唯一值。如果`r-key`没有设置，默认等于`index`。(不采用`key`字段是防止`key`是保留字段)
- `active`是`r-tabs`的属性，用于设置活跃的标签。`active`等于`key`的标签为活跃标签。

1. 没有设置`key`

<div style="width:100%;">
    <r-tabs active="1">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
 <r-tabs active="1">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
 </r-tabs>
```

1. 设置`key`

<div style="width:100%;">
   <r-tabs active="c">
      <r-tab label="tab1" r-key="a">11111</r-tab>
      <r-tab label="tab2" r-key="b">22222</r-tab>
      <r-tab label="tab3" r-key="c">33333</r-tab>
      <r-tab label="tab4">4</r-tab>
    </r-tabs>
</div>

```xml
    <r-tabs active="c">
      <r-tab label="tab1" r-key="a">11111</r-tab>
      <r-tab label="tab2" r-key="b">22222</r-tab>
      <r-tab label="tab3" r-key="c">33333</r-tab>
      <r-tab label="tab4">4</r-tab>
    </r-tabs>
```

### 图标`icon`

`r-tab` 支持 `icon` 属性（`r-icon` 图标名），显示在标签文字前；`iconSize` 设置图标大小。

<div style="width:100%;">
   <r-tabs>
      <r-tab label="tab1" icon="edit">11111</r-tab>
      <r-tab label="tab2" icon="delete">22222</r-tab>
      <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
<r-tabs>
      <r-tab label="tab1" icon="edit">11111</r-tab>
      <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
      <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### 不可操作`disabled`

设置不可点击的标签

<div style="width:100%;">
   <r-tabs active="c">
      <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
      <r-tab label="tab2" r-key="b">22222</r-tab>
      <r-tab label="tab3" r-key="c">33333</r-tab>
      <r-tab label="tab4">4</r-tab>
    </r-tabs>
</div>

```xml
    <r-tabs active="c">
      <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
      <r-tab label="tab2" r-key="b">22222</r-tab>
      <r-tab label="tab3" r-key="c">33333</r-tab>
      <r-tab label="tab4">4</r-tab>
    </r-tabs>
```

### 类型`type`

`r-tabs`属性，设置标签页的种类。如果不设置，默认为`flat`

1. `flat`

<div style="width:100%;">
    <r-tabs type="flat">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
<r-tabs type="flat">
      <r-tab label="tab1">11111</r-tab>
      <r-tab label="tab2">22222</r-tab>
      <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

2. `line`

<div style="width:100%;">
    <r-tabs type="line">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
<r-tabs type="line">
      <r-tab label="tab1">11111</r-tab>
      <r-tab label="tab2">22222</r-tab>
      <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### 对齐方式`align`

设置标签的对齐方式，默认`align="start"`

1. `start`

<div style="width:100%;">
    <r-tabs type="line" align="start">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
 <r-tabs type="line" align="start">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
```

2. `center`

<div style="width:100%;">
    <r-tabs type="line" align="center">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
 <r-tabs type="line" align="center">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
```

3. `end`

<div style="width:100%;">
    <r-tabs type="line" align="end">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
</div>

```xml
 <r-tabs type="line" align="end">
        <r-tab label="tab1">11111</r-tab>
        <r-tab label="tab2">22222</r-tab>
        <r-tab label="tab3">33333</r-tab>
    </r-tabs>
```

## 事件

### `change`

当激活的标签切换时，`r-tabs` 会派发 `change` `CustomEvent`。`event.detail.active` 为新的激活键（选中 `r-tab` 的 `r-key`，未设置时为其索引）。

```js
const tabs = document.querySelector('r-tabs');
tabs.addEventListener('change', (e) => {
  console.log('active tab:', e.detail.active);
});
```
