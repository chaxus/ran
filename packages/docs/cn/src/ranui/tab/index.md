---
description: 'ranui Tabs（<r-tabs>）将内容组织为可切换的标签页，是可用于任意框架的原生 Web Component。'
---

# Tab 标签页

在多个面板之间切换的标签容器。用 `<r-tabs>` 作为容器，里面放一个或多个 `<r-tab>` 面板。

> **适用场景**：需要一个能在多个面板间切换的标签容器——用 `<r-tabs>` 搭配 `<r-tab>` 子元素，每个子元素提供一个标题 `label` 和面板内容。

## 快速开始

### 基础用法

<Demo column>
  <r-tabs>
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs>
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

每个 `<r-tab>` 就是一个面板；它的 `label` 会渲染成标题按钮，插槽内容就是面板主体。选中某个标题会把对应面板滑动展示出来。

## API 参考

### `r-tabs` 属性

容器元素，承载标题行、激活指示条，以及面板内容区域。

| 属性     | 类型      | 默认值             | 说明                                       |
| -------- | --------- | ------------------ | ------------------------------------------ |
| `active` | `string`  | 第一个未禁用的标签 | 当前激活标签的 `r-key`                     |
| `type`   | `string`  | `'flat'`           | 标题样式：`flat`、`line`                   |
| `align`  | `string`  | `'start'`          | 标题对齐方式：`start`、`center`、`end`     |
| `effect` | `boolean` | `false`            | 开启标题按钮的水波纹效果，并隐藏滑动指示条 |
| `sheet`  | `string`  | `''`               | 注入 shadow DOM 的自定义样式文本           |

> `active` 属性的 setter 接受一个 key 字符串；赋值为 `null` 会移除该属性。没有设置 `active` 时，挂载后会默认选中第一个未禁用的标签。

### `r-tab` 属性

单个面板。它的属性会被父级 `<r-tabs>` 读取，用来构建对应的标题按钮。

| 属性       | 类型      | 默认值  | 说明                                               |
| ---------- | --------- | ------- | -------------------------------------------------- |
| `label`    | `string`  | `''`    | 标签标题显示的文字                                 |
| `r-key`    | `string`  | 索引值  | 在同一个 `<r-tabs>` 内的唯一标识；与 `active` 匹配 |
| `icon`     | `string`  | —       | 标题文字前显示的 `r-icon` 图标名                   |
| `iconSize` | `string`  | —       | 标题图标的大小                                     |
| `disabled` | `boolean` | `false` | 让该标签不可选中                                   |
| `effect`   | `boolean` | —       | 标题的水波纹效果（通常由父级的 `effect` 设置）     |
| `sheet`    | `string`  | `''`    | 注入 shadow DOM 的自定义样式文本                   |

> `key` 属性的 getter/setter 读写的是 `r-key` 这个 attribute（没有直接用 `key` 这个名字，因为它是保留字段）。请在元素连接前设置好 `label` 和 `r-key`——标题构建完成之后，这两个属性的变化不会被重新处理。

### 标题样式 `type`

`flat`（默认）显示一条滑动的下划线指示条；`line` 渲染带边框的标签标题。

<Demo column>
  <r-tabs type="flat">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs type="flat">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>

<r-tabs type="line">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### 标题对齐 `align`

设置标题行的对齐方式，默认 `start`。

<Demo column>
  <r-tabs type="line" align="start">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="center">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="end">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs type="line" align="start"> ... </r-tabs>
<r-tabs type="line" align="center"> ... </r-tabs>
<r-tabs type="line" align="end"> ... </r-tabs>
```

### 激活标签 `active` 和 `r-key`

- `r-key` 是 `<r-tab>` 的属性，为每个面板在同一个 `<r-tabs>` 内提供一个稳定的身份标识。省略时默认等于该面板的索引。
- `active` 是 `<r-tabs>` 的属性，用来选择初始激活的标签：`r-key` 等于 `active` 的那个面板会被显示。

不显式设置 key 时，`active` 按从零开始的索引匹配：

<Demo column>
  <r-tabs active="1">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="1">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

显式设置 `r-key`（没设置 key 的面板回退到自己的索引）：

<Demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a">11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a">11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

> 同一个 `<r-tabs>` 内每个 `r-key` 必须唯一——构建标题时如果有面板的 key 重复或缺失会抛出错误。

### 禁用面板 `disabled`

禁用的 `<r-tab>` 不能被选中，挑选默认激活标签时也会跳过它。

<Demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

### 标题图标 `icon` 与 `iconSize`

`<r-tab>` 接受一个 `icon` 属性（`r-icon` 图标名），渲染在标题文字前；`iconSize` 设置它的大小。

<Demo column>
  <r-tabs>
    <r-tab label="tab1" icon="edit">11111</r-tab>
    <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs>
  <r-tab label="tab1" icon="edit">11111</r-tab>
  <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### 水波纹效果 `effect`

在 `<r-tabs>` 上设置 `effect`，开启标题按钮的点击水波纹效果。`effect` 生效时，滑动的下划线指示条会被隐藏。

<Demo column>
  <r-tabs effect="true">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs effect="true">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

## 插槽

| 元素     | 插槽     | 说明                           |
| -------- | -------- | ------------------------------ |
| `r-tabs` | （默认） | 接受 `<r-tab>` 面板            |
| `r-tab`  | （默认） | 面板的主体内容，标签激活时显示 |

## CSS Parts

`r-tabs` 暴露：

| Part           | 说明                   |
| -------------- | ---------------------- |
| `tabs`         | 根容器                 |
| `header`       | 标题行容器             |
| `nav`          | 承载标题项的 tablist   |
| `indicator`    | 滑动的下划线           |
| `content`      | 面板内容的可视区域     |
| `content-wrap` | 承载所有面板的滑动轨道 |

`r-tab` 暴露：

| Part      | 说明           |
| --------- | -------------- |
| `content` | 面板的内容插槽 |

## 事件

### `change`

当某个观察中的属性发生变化时——最主要是激活标签切换时——`<r-tabs>` 会派发 `change` `CustomEvent`。`event.detail.active` 是当前激活的 key（选中 `<r-tab>` 的 `r-key`，没设置 `r-key` 时为其索引）。

```js
const tabs = document.querySelector('r-tabs');
tabs.addEventListener('change', (e) => {
  console.log('active tab:', e.detail.active);
});
```

`<r-tab>` 本身不派发任何自定义事件。

## 最佳实践

- **稳定的身份标识**：给每个 `<r-tab>` 一个唯一的 `r-key`，用 `<r-tabs>` 上的 `active` 驱动选中状态，而不是依赖位置索引。
- **样式选择**：需要带边框、文档风格的标签条时用 `type="line"`；需要极简的滑动下划线时用默认的 `type="flat"`。
- **对齐**：在宽容器里用 `align="center"` 或 `align="end"` 重新定位标题行。
- **禁用面板**：用 `disabled` 标记不可用的面板；它们会同时跳过点击选择和默认选中逻辑。
- **键盘导航**：标题行是一个 WAI-ARIA tablist——方向键在标签间移动（配合 `Home`/`End`），只有激活的标签在 tab 顺序里。
