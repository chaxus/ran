---
description: '一组 chrome 下拉在悬停时交接：共享 viewport 在同伴之间变形并方向滑动。'
---

# Menubar

把一组 chrome 选择器（`r-select` / `r-theme-switch` / `r-surface-switch`，或任意带 `open` 的宿主）串成**悬停打开**，并用**共享 viewport** 在同伴之间交接。

在精细指针上，滑过触发器时只有一个浮层壳跟着变形（位置 + 尺寸），内容按方向滑入滑出（Stripe / Radix NavigationMenu）。原生 select portal 仍负责状态，但在 viewport 显示时被视觉压制。触控仍走各自的点击。空闲首次打开对壳做淡入。

> **适用**：文档站顶栏、设置工具条等「一排 chrome 菜单应像同一块表面」。单个选择器用 [`<r-select>`](/cn/ranui/select/) 即可。

## 快速开始

### 语言 + 主题 + 风格

在桌面端横向滑过三个控件：壳跟着指针滑动，内容按方向交叉过渡。

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

浮层面板需带 `dropdownclass="ran-chrome-menu"`（主题/风格开关已自带）。交接会把这个类的面板收进共享 viewport。

### 命令式宿主（不用自定义元素）

```js
import { mountMenubarHandoff } from 'ranui/menubar';

const stop = mountMenubarHandoff({ root: document.querySelector('.chrome') });
// 之后: stop()
```

## API

### 属性

| 属性             | 默认                         | 说明                                   |
| ---------------- | ---------------------------- | -------------------------------------- |
| `panel-selector` | `r-dropdown.ran-chrome-menu` | 收进共享 viewport 的原生面板。         |
| `leave-delay`    | `180`                        | 离开条带与 viewport 后关闭前的毫秒数。 |
| `duration`       | `280`                        | 壳变形与内容滑动时长（毫秒）。         |
| `sheet`          | `''`                         | 注入组件 shadow DOM 的 CSS。           |

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
- 同伴跳转使用共享 viewport（`html[data-ran-menubar-viewport]`）；减少动效时跳过滑动并直接落位。
