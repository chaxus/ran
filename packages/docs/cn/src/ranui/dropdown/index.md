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

## 说明

面板默认 `width` / `height: 100%` 撑满宿主，宿主携带 `--ran-z-dropdown`（`1100`），因此层级
高于对话框。使用方负责设置宿主的尺寸与位置并将其挂载。`r-popover` 与 `r-select` 均基于此
元素构建。

通过 `import 'ranui'`（注册全部组件）或独立子路径 `import 'ranui/dropdown'` 引入。
