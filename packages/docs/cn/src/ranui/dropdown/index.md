---
description: '底层浮层面板原语——r-popover 和 r-select 用来定位、控制层级的基础构建块。'
---

# Dropdown 下拉面板

底层浮层面板原语：一个圆角、带投影的悬浮表面，可选配指向箭头。它自身携带浮层 z-index，
是 `r-popover` 和 `r-select` 定位并挂载到 `<body>` 时复用的基础元素。当你需要自定义悬浮
面板时，可以直接使用它。

## 代码演示

<div style="position: relative; width: 180px; height: 72px;">
  <r-dropdown arrow="top" style="position: absolute; width: 180px;">
    <div style="padding: 12px;">浮层面板内容</div>
  </r-dropdown>
</div>

```xml
<r-dropdown arrow="top">
  <div style="padding: 12px;">浮层面板内容</div>
</r-dropdown>
```

## 属性

### `arrow`

在面板某一侧渲染指向箭头，取值为 `top` · `bottom` · `left` · `right`。不设置该属性则无箭头。

| 取值     | 箭头位置 |
| -------- | -------- |
| `top`    | 顶部     |
| `bottom` | 底部     |
| `left`   | 左侧     |
| `right`  | 右侧     |

### `transit`

短暂（约 300ms）作用于面板的 CSS 类名，用于播放进入/退出动画，动画结束后自动移除。
组件内置了这些动画类：`ran-dropdown-down-in` / `-down-out` / `-up-in` / `-up-out` /
`-left-in` / `-left-out` / `-right-in` / `-right-out`。

### `sheet`

注入到面板 shadow DOM 的 CSS，与其它所有 ranui 组件的 `sheet` 约定一致。

## 样式定制

- **`::part(dropdown)`** — 面板表面，可在 shadow DOM 外部定制。
- **CSS 变量** — 所有视觉属性都可通过 `--ran-dropdown-*` 令牌覆盖，例如
  `--ran-dropdown-background`、`--ran-dropdown-border-radius`、`--ran-dropdown-box-shadow`、
  `--ran-dropdown-padding`、`--ran-dropdown-arrow-width`、`--ran-dropdown-host-z-index`。

```css
r-dropdown {
  --ran-dropdown-background: var(--surface-2);
  --ran-dropdown-border-radius: 8px;
}
r-dropdown::part(dropdown) {
  border: 1px solid var(--line);
}
```

箭头是一个按自身 `viewBox` 缩放的内联 SVG，所以 `--ran-dropdown-arrow-width`/`-height` 改的是真正的三角形大小，不再只是外面那个空盒子：

<Demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px; --ran-dropdown-arrow-width: 28px; --ran-dropdown-arrow-height: 28px;">
    <div style="padding: 12px;">--ran-dropdown-arrow-width: 28px</div>
  </r-dropdown>
</Demo>

## 说明

面板默认 `width` / `height: 100%` 撑满宿主，宿主携带 `--ran-z-dropdown`（`1100`），因此层级
高于对话框。使用方负责设置宿主的尺寸与位置并将其挂载。`r-popover` 与 `r-select` 均基于此
元素构建。

**箭头默认居中于面板本身**：`r-dropdown` 并不知道"触发元素"是什么，只知道自己的面板。
在没有外部定位逻辑接入的情况下，`arrow="top"` / `"bottom"` 默认居中于面板自身宽度——这正是
上面示例中裸用 `r-dropdown` 时的正确表现。`r-popover` 在 `r-dropdown` 之上叠加了"感知触发元素"
的能力：它会测量真实的触发元素，并通过 `--ran-dropdown-arrow-anchor-offset` 传入一个像素偏移量，
即使面板比触发元素更宽、且与其边缘对齐而非居中对齐，箭头依然精确指向触发元素中心。若在
`r-dropdown` 之上自建感知触发元素的面板，可直接设置该变量，无需重新实现 `r-popover` 的定位逻辑。

通过 `import 'ranui'`（注册全部组件）或独立子路径 `import 'ranui/dropdown'` 引入。
