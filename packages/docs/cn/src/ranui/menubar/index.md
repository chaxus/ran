---
description: '一组 chrome 下拉在悬停时交接：打开菜单，并在同伴之间变形面板。'
---

# Menubar

把一组 chrome 选择器（`r-select` / `r-theme-switch` / `r-surface-switch`，或任意带 `open` 的宿主）串成**悬停打开**，并在同伴之间做**共享布局跳转**。

在精细指针上，滑过触发器会打开下一个菜单，并把浮层面板从上一块盒子变形过来（Stripe / Floating UI FLIP）。触控仍走各自的点击。空闲首次打开保留下拉的进入动画；同伴跳转通过 `html[data-ran-menubar-switch]` 跳过进出场。

> **适用**：文档站顶栏、设置工具条等「一排 chrome 菜单应像同一块表面」。单个选择器用 [`<r-select>`](/cn/ranui/select/) 即可。

## 快速开始

### 语言 + 主题 + 风格

在桌面端横向滑过三个控件：面板跟着指针滑，而不是闪关闪开。

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

浮层面板需带 `dropdownclass="ran-chrome-menu"`（主题/风格开关已自带）。交接按这个类测量并变形。

### 命令式宿主（不用自定义元素）

已有自己的根节点时，可直接调用同一套接线：

```js
import { mountMenubarHandoff } from 'ranui/menubar';

const stop = mountMenubarHandoff({ root: document.querySelector('.chrome') });
// 之后: stop()
```

## API

### 属性

| 属性             | 默认                         | 说明                             |
| ---------------- | ---------------------------- | -------------------------------- |
| `panel-selector` | `r-dropdown.ran-chrome-menu` | 跳转时变形的浮层面板。           |
| `leave-delay`    | `180`                        | 离开条带与面板后关闭前的毫秒数。 |
| `duration`       | `320`                        | FLIP 变形时长（毫秒，偏 Stripe）。 |
| `sheet`          | `''`                         | 注入组件 shadow DOM 的 CSS。     |

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
- 减少动效时跳过变形，面板仍会开关。
