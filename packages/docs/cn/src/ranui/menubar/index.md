---
description: '一组 chrome 下拉在悬停时交接：打开菜单，同伴之间瞬时切换并跳过进出场。'
---

# Menubar

把一组 chrome 选择器（`r-select` / `r-theme-switch` / `r-surface-switch`，或任意带 `open` 的宿主）串成**悬停打开**，并在同伴之间做**瞬时交接**。

在精细指针上，滑过触发器会在各自触发器下方打开下一个菜单，并通过 `html[data-ran-menubar-switch]` 跳过进出场动画。各 select 仍是独立浮层——不做跨 portal 的共享布局缩放（那是大导航 viewport 的做法，不适合 chrome 选择器）。触控仍走各自的点击。空闲首次打开保留下拉的进入动画。

> **适用**：文档站顶栏、设置工具条等「一排 chrome 菜单应悬停打开、同伴之间不闪关」。单个选择器用 [`<r-select>`](/cn/ranui/select/) 即可。

## 快速开始

### 语言 + 主题 + 风格

在桌面端横向滑过三个控件：下一个面板在对应触发器下打开，同伴之间不闪淡入淡出。

<ran-demo>
  <r-menubar style="gap: 8px">
    <r-select style="width: 7.5rem" defaultValue="zh" dropdownclass="ran-chrome-menu" aria-label="语言">
      <r-option value="zh">简体中文</r-option>
      <r-option value="en">English</r-option>
      <r-option value="pt">Português</r-option>
    </r-select>
    <r-theme-switch></r-theme-switch>
    <r-surface-switch></r-surface-switch>
  </r-menubar>
</ran-demo>

```html
<r-menubar>
  <r-select dropdownclass="ran-chrome-menu" defaultValue="zh" aria-label="语言">
    <r-option value="zh">简体中文</r-option>
    <r-option value="en">English</r-option>
    <r-option value="pt">Português</r-option>
  </r-select>
  <r-theme-switch></r-theme-switch>
  <r-surface-switch></r-surface-switch>
</r-menubar>
```

```js
import 'ranui/menubar';
import 'ranui/select';
import 'ranui/theme-switch';
import 'ranui/surface-switch';
```

浮层面板需带 `dropdownclass="ran-chrome-menu"`（主题/风格开关已自带）。离开延迟按这个类做悬停宽容。

### 命令式宿主（不用自定义元素）

已有自己的根节点时，可直接调用同一套接线：

```js
import { mountMenubarHandoff } from 'ranui/menubar';

const stop = mountMenubarHandoff({ root: document.querySelector('.chrome') });
// 之后: stop()
```

## API

### 属性

| 属性             | 默认                         | 说明                                     |
| ---------------- | ---------------------------- | ---------------------------------------- |
| `panel-selector` | `r-dropdown.ran-chrome-menu` | 用于离开宽容的浮层面板选择器。           |
| `leave-delay`    | `180`                        | 离开条带与面板后关闭前的毫秒数。         |
| `switch-hold`    | `280`                        | 同伴跳转时「零进出场」CSS 保持的毫秒数。 |
| `sheet`          | `''`                         | 注入组件 shadow DOM 的 CSS。             |

### CSS Parts

| Part   | 说明                            |
| ------ | ------------------------------- |
| `root` | 内层壳（`display: contents`）。 |

```css
r-menubar {
  --ran-menubar-gap: 8px;
}
```

## 说明

- 触发器是 light DOM 里的 `r-select`、`r-theme-switch`、`r-surface-switch`，或带 `open` 的 `[data-ran-menubar-item]`。
- 外层包装（例如 `.appearance`）没问题——条带会找到真正的宿主。
- 同伴跳转不变形浮层尺寸/位置；每个面板各自定位在触发器下方。
