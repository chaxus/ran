---
description: '颜色主题选择器（跟随系统 / 浅色 / 深色），接入 ranui 主题 API。'
---

# ThemeSwitch 主题切换

紧凑的 **select**，在 **跟随系统 / 浅色 / 深色** 之间切换，直接接入 ranui 的
[主题 API](/cn/ranui/theme/)。选中一项会调用 `setTheme()`，持久化到 `ran-theme`，并让页面上
（以及其他标签页里）的所有实例保持同步。风格 / 液态玻璃是另一条轴，用
`<r-surface-switch>`。

> **适用场景**：需要开箱即用的颜色主题控件时。

## 快速开始

### 基础用法

<ran-demo>
  <r-theme-switch label="主题" label-system="跟随系统" label-light="浅色" label-dark="深色"></r-theme-switch>
</ran-demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui';
import 'ranui/theme-switch';
```

页面加载时先调用 `initTheme()`：

```js
import { initTheme } from 'ranui';
initTheme();
```

## API 参考

### 属性

| 属性    | 类型                            | 默认值     | 说明                                                         |
| ------- | ------------------------------- | ---------- | ------------------------------------------------------------ |
| `value` | `'system' \| 'light' \| 'dark'` | `'system'` | 当前主题，读取自 `getTheme()`；赋值会应用并持久化对应主题。 |
| `sheet` | `string`                        | `''`       | 注入组件 Shadow DOM 的 CSS。                                 |

### 本地化属性

| 属性           | 默认值     | 说明                      |
| -------------- | ---------- | ------------------------- |
| `label`        | `'Theme'`  | select 的 `aria-label`。  |
| `label-system` | `'System'` | 「跟随系统」选项文案。    |
| `label-light`  | `'Light'`  | 「浅色」选项文案。        |
| `label-dark`   | `'Dark'`   | 「深色」选项文案。        |

## 事件

| 事件     | Detail                                     | 说明                                        |
| -------- | ------------------------------------------ | ------------------------------------------- |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | 用户选择主题时触发。冒泡并穿透 Shadow DOM。 |

## CSS Parts

| Part                        | 说明                |
| --------------------------- | ------------------- |
| `select`                    | 内部的 `r-select`。 |
| `option`                    | 每一个 `r-option`。 |
| `system` / `light` / `dark` | 各选项。            |

```css
r-theme-switch {
  --ran-theme-switch-width: 9rem;
}
```
