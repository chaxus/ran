---
description: 'ranui Button（<r-button>）用于触发即时操作，支持多种类型、尺寸、加载与禁用状态，是跨框架的原生 Web Component。'
---

# Button 按钮

按钮组件用于触发一个即时操作，支持多种样式和状态。

> **适用场景**：需要一个开箱即用、自带 primary/contrast/warning/text 样式以及禁用、图标支持的可点击操作控件时——用 `<r-button>` 代替手写 `<button>` 样式。

## 快速开始

### 基础用法

<Demo>
  <r-button>Button</r-button>
</Demo>

```html
<r-button>Button</r-button>
```

## API 参考

### 属性

| 属性       | 类型      | 默认值      | 说明                                                          |
| ---------- | --------- | ----------- | ------------------------------------------------------------- |
| `type`     | `string`  | `'default'` | 按钮类型：`default`、`primary`、`contrast`、`warning`、`text` |
| `disabled` | `boolean` | `false`     | 是否禁用按钮                                                  |
| `icon`     | `string`  | `''`        | 按钮图标名称                                                  |
| `effect`   | `boolean` | `true`      | 是否显示点击水波纹特效                                        |

### 按钮类型 `type`

按钮支持五种不同的类型，适用于不同的场景

<Demo>
  <r-button type="primary">主要按钮</r-button>
  <r-button type="warning">警告按钮</r-button>
  <r-button type="text">文本按钮</r-button>
  <r-button>默认按钮</r-button>
</Demo>

```html
<r-button type="primary">主要按钮</r-button>
<r-button type="warning">警告按钮</r-button>
<r-button type="text">文本按钮</r-button>
<r-button>默认按钮</r-button>
```

`primary` 是单色（无彩色）操作按钮，来自 Geist 设计语言：浅色模式下黑底白字，深色模式下白底黑字。蓝色在此不承载品牌含义——它只保留给链接和聚焦环。它消费 `--ran-color-primary*` 令牌（`--ran-color-primary`、`-hover`、`-active`，以及作为反色墨水的 `--ran-color-primary-text`）——参见 [Theme 主题与令牌](/cn/src/ranui/theme/)。

### 禁用状态 `disabled`

添加 `disabled` 属性可以让按钮处于不可用状态，同时按钮样式也会相应改变

<Demo>
  <r-button type="primary" disabled>主要按钮</r-button>
  <r-button type="warning" disabled>警告按钮</r-button>
  <r-button type="text" disabled>文本按钮</r-button>
  <r-button disabled>默认按钮</r-button>
</Demo>

```html
<r-button type="primary" disabled>主要按钮</r-button>
<r-button type="warning" disabled>警告按钮</r-button>
<r-button type="text" disabled>文本按钮</r-button>
<r-button disabled>默认按钮</r-button>
```

### 图标按钮 `icon`

可以通过 `icon` 属性为按钮添加图标，或者直接在按钮内使用 Icon 组件

> 💡 **提示**: 如果需要控制图标的具体位置，建议直接使用 Icon 组件而不是 icon 属性

<Demo>
  <r-button type="default" icon="user">默认按钮</r-button>
  <r-button type="primary" icon="home">主要按钮</r-button>
</Demo>

```html
<r-button type="default" icon="user">默认按钮</r-button> <r-button type="primary" icon="home">主要按钮</r-button>
```

### 特效控制 `effect`

如果需要纯净的按钮样式，可以设置 `effect="false"` 来禁用点击时的水波纹特效

<Demo>
  <r-button type="default" effect="false" icon="user">默认按钮</r-button>
  <r-button type="primary" effect="false" icon="home">主要按钮</r-button>
</Demo>

```html
<r-button type="default" effect="false" icon="user">默认按钮</r-button>
<r-button type="primary" effect="false" icon="home">主要按钮</r-button>
```

## 事件

### 点击事件

按钮支持标准的点击事件处理

```html
<r-button onclick="handleClick()">点击我</r-button>

<script>
  function handleClick() {
    console.log('按钮被点击了');
  }
</script>
```

## 自定义样式

`<r-button>` 自身暴露了 **43 个 CSS 自定义属性**——`--ran-btn-background`、`--ran-btn-color`、
`--ran-btn-border-color` 及其 `hover` / `active` 变体，加上 `warning` 变体的三个——另外还会读取主题
里的语义令牌。

```css
/* 单个按钮，或某个作用域下的所有按钮 */
r-button {
  --ran-btn-background: var(--ran-color-bg-subtle);
  --ran-btn-hover-background: var(--ran-color-bg-hover);
  --ran-btn-border-radius: var(--ran-radius-full);
}
```

如果这次改动并非按钮独有，优先改**语义**令牌：覆盖 `--ran-color-primary` 会重塑所有地方的主操作，
而不只是这里。

Part：`button` · `content`

```css
r-button::part(content) {
  letter-spacing: 0.02em;
}
```

完整清单见[样式令牌](/cn/src/ranui/style-tokens#button)；该选哪个令牌见
[设计系统](/cn/src/ranui/design-system/)。

## 最佳实践

- **主要操作**: 使用 `type="primary"` 的按钮（单色——浅色黑底白字 / 深色白底黑字）
- **危险操作**: 使用 `type="warning"` 的按钮
- **次要操作**: 使用 `type="text"` 的按钮
- **禁用状态**: 在操作不可用时使用 `disabled` 属性
- **图标使用**: 为按钮添加相关图标可以提升用户体验
