---
description: 'ranui Skeleton（<r-skeleton>）在内容加载时展示带微光动画的占位骨架。'
---

# Skeleton 骨架屏

内容加载期间填充其所在空间的占位图形，带有微光扫过的动画效果。

> **适用场景**：需要一根带微光动画的占位条，在内容加载期间占住它的位置——把 `<r-skeleton>` 的父容器调整成真实内容的尺寸，数据到达后再替换掉它。

## 快速开始

### 基础用法

骨架屏会撑满父元素的宽度，默认高度为 `16px`。

<Demo>
  <r-skeleton></r-skeleton>
</Demo>

```html
<r-skeleton></r-skeleton>
```

### 宽度跟随父元素

因为骨架屏是 `width: 100%`，所以通过调整它所在容器的尺寸来控制长度。

<Demo column>
  <div style="width: 100px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 200px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 100%">
    <r-skeleton></r-skeleton>
  </div>
</Demo>

```html
<div style="width: 100px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 200px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 100%">
  <r-skeleton></r-skeleton>
</div>
```

### 堆叠占位

组合多个骨架屏，模拟一段文字或一个段落。

<Demo column>
  <div style="width: 100%; display: flex; flex-direction: column; gap: 12px">
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
  </div>
</Demo>

```html
<div style="display: flex; flex-direction: column; gap: 12px">
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
</div>
```

## API 参考

### 属性

| 属性    | 类型     | 默认值 | 说明                             |
| ------- | -------- | ------ | -------------------------------- |
| `sheet` | `string` | `''`   | 注入组件 shadow DOM 的自定义样式 |

### 自定义样式 `sheet`

通过 `sheet` 传入一段 CSS，覆盖骨架屏在 shadow DOM 内的外观。

<Demo>
  <r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
</Demo>

```html
<r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
```

### CSS 变量

骨架屏还暴露了一组 CSS 自定义属性，不用 `sheet` 也能做主题定制：

| 变量                                        | 默认值                         | 说明                 |
| ------------------------------------------- | ------------------------------ | -------------------- |
| `--ran-skeleton-height`                     | `16px`                         | 占位条的高度         |
| `--ran-skeleton-background`                 | `var(--ran-gray-alpha-200, …)` | 基础（非微光）填充色 |
| `--ran-skeleton-border-radius`              | `var(--ran-radius-sm, 6px)`    | 圆角半径             |
| `--ran-skeleton-shimmer-background`         | `linear-gradient(90deg, …)`    | 移动高光的渐变       |
| `--ran-skeleton-shimmer-animation-duration` | `1.4s`                         | 一次微光扫过的时长   |

<Demo>
  <r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
</Demo>

```html
<r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
```

## 事件

无。骨架屏不派发任何自定义事件。

## 插槽

无。骨架屏只渲染自己的占位条，不投影插槽内容。

## 最佳实践

- **匹配布局**：调整父容器尺寸，让每根骨架屏和它所代表的真实内容宽度一致。
- **模拟形状**：用一致的间距堆叠多根骨架屏，代表多行文字或列表行。
- **优先用变量做主题**：简单调整优先用 `--ran-skeleton-*` 系列 CSS 变量；只有变量覆盖不到的选择器才需要用 `sheet`。
- **数据到达后替换**：数据到达后就把骨架屏换成真实内容，不要让它一直动画下去。
