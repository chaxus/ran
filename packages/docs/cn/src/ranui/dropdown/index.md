---
description: '底层浮层面板原语——r-popover 和 r-select 用来定位、控制层级的基础构建块。'
---

# Dropdown 下拉面板

底层浮层面板原语：一个圆角、带投影的悬浮表面，可选配指向箭头。它自身携带浮层 z-index，
是 `r-popover` 和 `r-select` 定位并挂载到 `<body>` 时复用的基础元素。

> **适用场景**：需要构建像弹出层或下拉菜单这样的低层级浮层面板 —— `<r-dropdown>` 携带 z-index 与箭头，省去手写定位逻辑。

## 快速开始

### 基础用法

<Demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">浮层面板内容</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">浮层面板内容</div>
</r-dropdown>
```

## API 参考

### 属性

| 属性      | 类型     | 默认值 | 说明                                                       |
| --------- | -------- | ------ | ---------------------------------------------------------- |
| `arrow`   | `string` | `''`   | 箭头方向：`top`、`bottom`、`left`、`right`。不设置则无箭头 |
| `transit` | `string` | `''`   | 应用到面板约 300ms 的 CSS class，用于播放入场动画          |
| `sheet`   | `string` | `''`   | 注入到组件 shadow DOM 的 CSS                               |

### 箭头方向 `arrow`

在面板某一侧渲染指向箭头。不设置该属性则无箭头。

<Demo column>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="top"</div>
  </r-dropdown>
  <r-dropdown arrow="bottom" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="bottom"</div>
  </r-dropdown>
  <r-dropdown arrow="left" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="left"</div>
  </r-dropdown>
  <r-dropdown arrow="right" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="right"</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">arrow="top"</div>
</r-dropdown>
<r-dropdown arrow="bottom">
  <div style="padding: 12px;">arrow="bottom"</div>
</r-dropdown>
<r-dropdown arrow="left">
  <div style="padding: 12px;">arrow="left"</div>
</r-dropdown>
<r-dropdown arrow="right">
  <div style="padding: 12px;">arrow="right"</div>
</r-dropdown>
```

### 入场动画 `transit`

短暂（约 300ms）作用于面板的 CSS 类名，用于播放进入/退出动画，动画结束后自动移除。
组件内置了这些动画类：`ran-dropdown-down-in` / `-down-out` / `-up-in` / `-up-out` /
`-left-in` / `-left-out` / `-right-in` / `-right-out`。

<Demo>
  <r-dropdown transit="ran-dropdown-down-in" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">连接后播放入场动画</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown transit="ran-dropdown-down-in">
  <div style="padding: 12px;">连接后播放入场动画</div>
</r-dropdown>
```

### 外部样式 `sheet`

注入到面板 shadow DOM 的 CSS，与其它所有 ranui 组件的 `sheet` 约定一致。

```html
<r-dropdown arrow="top" sheet=".ranui-dropdown { border: 1px solid #999; }">
  <div style="padding: 12px;">自定义样式的面板</div>
</r-dropdown>
```

## 事件

`r-dropdown` 是一个被动展示面板，不派发任何自定义事件。它的定位、显示与隐藏均由使用方
（例如 `r-popover` 或 `r-select`）控制。

## 插槽

| 插槽     | 说明               |
| -------- | ------------------ |
| （默认） | 面板内容，原样渲染 |

## CSS Parts

| Part       | 说明                               |
| ---------- | ---------------------------------- |
| `dropdown` | 面板表面，可在 shadow DOM 外部定制 |

```css
r-dropdown {
  --ran-dropdown-background: var(--ran-color-bg-muted);
  --ran-dropdown-border-radius: 8px;
}
r-dropdown::part(dropdown) {
  border: 1px solid var(--ran-color-border);
}
```

所有视觉属性都可以通过 `--ran-dropdown-*` 令牌覆盖，例如 `--ran-dropdown-background`、
`--ran-dropdown-border-radius`、`--ran-dropdown-box-shadow`、`--ran-dropdown-padding`、
`--ran-dropdown-arrow-width`，以及 `--ran-dropdown-host-z-index`。箭头是一个按自身
`viewBox` 缩放的内联 SVG，所以 `--ran-dropdown-arrow-width`/`-height` 改变的是真正的
三角形大小，而不只是外面那个空盒子：

<Demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px; --ran-dropdown-arrow-width: 28px; --ran-dropdown-arrow-height: 28px;">
    <div style="padding: 12px;">--ran-dropdown-arrow-width: 28px</div>
  </r-dropdown>
</Demo>

```css
r-dropdown {
  --ran-dropdown-arrow-width: 28px;
  --ran-dropdown-arrow-height: 28px;
}
```

## 最佳实践

- **底层原语**：只有需要自定义浮层面板时才直接使用 `r-dropdown`；常见场景优先用 `r-popover` 或 `r-select`。
- **设置宿主尺寸**：面板默认 `width` / `height` 为宿主的 100%，所以要给宿主显式的尺寸与定位，再将其挂载。
- **层级**：宿主携带 `--ran-z-dropdown`（`1100`），因此层级高于对话框；需要时可通过 `--ran-dropdown-host-z-index` 覆盖。
- **箭头默认居中于面板本身**：`r-dropdown` 并不知道"触发元素"是什么，只知道自己的面板。在没有外部定位逻辑接入的情况下，`arrow="top"` / `"bottom"` 默认居中于面板自身宽度——这正是上面示例中裸用 `r-dropdown` 时的正确表现。`r-popover` 在 `r-dropdown` 之上叠加了"感知触发元素"的能力：它会测量真实的触发元素，并通过 `--ran-dropdown-arrow-anchor-offset` 传入一个像素偏移量，即使面板比触发元素更宽、且与其边缘对齐而非居中对齐，箭头依然精确指向触发元素中心。若在 `r-dropdown` 之上自建感知触发元素的面板，可直接设置该变量，无需重新实现 `r-popover` 的定位逻辑。
- **引入方式**：通过 `import 'ranui'`（注册全部组件）或独立子路径 `import 'ranui/dropdown'` 引入。
