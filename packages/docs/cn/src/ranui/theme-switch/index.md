# ThemeSwitch 主题切换

三态分段控件——**system（跟随系统）/ light（浅色）/ dark（深色）**——直接接入 ranui 的
[主题 API](/cn/src/ranui/theme/)。点击某一段会调用 `setTheme()`，把选择持久化到 localStorage
键 `ran-theme`，并让页面上（以及其他标签页里）的所有实例保持同步。

## 快速开始

### 基础用法

<r-theme-switch label="主题" label-system="跟随系统" label-light="浅色" label-dark="深色"></r-theme-switch>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui'; // 或者按组件单独引入：
import 'ranui/theme-switch';
```

> 💡 **在本文档站上**，主题由站点右上角的开关驱动，它会自行覆写 `data-ran-theme`——所以上面的
> 演示可能被站点重置。在你自己的应用里，`<r-theme-switch>` 就是主题的唯一入口。

页面加载时先调用一次 `initTheme()`，让保存的选择在开关渲染前恢复：

```js
import { initTheme } from 'ranui';
initTheme();
```

## API 参考

### 属性

| 属性    | 类型                            | 默认值     | 说明                                                                   |
| ------- | ------------------------------- | ---------- | ---------------------------------------------------------------------- |
| `value` | `'system' \| 'light' \| 'dark'` | `'system'` | 当前选择，读取自主题 API（`getTheme()`）；赋值会应用并持久化对应主题。 |
| `sheet` | `string`                        | `''`       | 注入组件 Shadow DOM 的 CSS。                                           |

### 本地化属性

三个按钮都只有图标，因此各自带有 `aria-label`，通过下列属性覆盖以完成本地化：

| 属性           | 默认值           | 说明                              |
| -------------- | ---------------- | --------------------------------- |
| `label`        | `'Theme'`        | 控件组的 `aria-label`。           |
| `label-system` | `'System theme'` | 「跟随系统」按钮的 `aria-label`。 |
| `label-light`  | `'Light theme'`  | 「浅色」按钮的 `aria-label`。     |
| `label-dark`   | `'Dark theme'`   | 「深色」按钮的 `aria-label`。     |

```html
<r-theme-switch label="主题" label-system="跟随系统" label-light="浅色" label-dark="深色"></r-theme-switch>
```

## 事件

| 事件     | Detail                                     | 说明                                        |
| -------- | ------------------------------------------ | ------------------------------------------- |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | 用户选择主题时触发。冒泡并穿透 Shadow DOM。 |

```js
document.querySelector('r-theme-switch').addEventListener('change', (e) => {
  console.log('当前主题', e.detail.theme);
});
```

## 行为

- **持久化** —— 选择通过 `setTheme()` 生效，保存到 localStorage（`ran-theme`），下次访问由
  `initTheme()` 恢复。
- **多实例同步** —— 页眉放一个、页脚放一个，任意一处切换两处都会更新。
- **跨标签页同步** —— 其他标签页切换了主题，本控件通过 `storage` 事件跟着更新。
- **浏览器界面色** —— 强制浅色/深色时会把 `<meta name="theme-color">` 更新为解析后的页面背景色，
  让浏览器 / PWA 的界面色匹配；选回 `system` 时恢复每个 meta 原本（可能带媒体查询）的内容。

## CSS Parts

| Part                        | 说明                                              |
| --------------------------- | ------------------------------------------------- |
| `switch`                    | 外层分段胶囊容器。                                |
| `button`                    | 每个选项按钮（同时还暴露各自的选项名作为 part）。 |
| `system` / `light` / `dark` | 各个选项按钮。                                    |

```css
r-theme-switch::part(switch) {
  border-color: var(--line);
}
r-theme-switch::part(dark) {
  color: rebeccapurple;
}
```

可覆盖的 CSS 变量：`--ran-theme-switch-display`、`--ran-theme-switch-gap`、
`--ran-theme-switch-padding`、`--ran-theme-switch-border-color`、`--ran-theme-switch-radius`、
`--ran-theme-switch-background`、`--ran-theme-switch-button-size`、`--ran-theme-switch-icon-size`、
`--ran-theme-switch-color`、`--ran-theme-switch-hover-color`、
`--ran-theme-switch-active-background`、`--ran-theme-switch-active-color`、
`--ran-theme-switch-focus-outline`。

```css
r-theme-switch {
  --ran-theme-switch-button-size: 32px;
  --ran-theme-switch-icon-size: 18px;
}
```

## 最佳实践

- **单一入口**：用 `<r-theme-switch>` 代替手写开关——持久化、系统跟随、实例同步、
  `theme-color` meta 更新它都已处理好。
- **尽早恢复**：尽可能早地调用 `initTheme()`（最好在首帧前内联执行），避免浅色→深色的闪烁。
- **本地化**：按钮只有图标，非英文界面请设置 `label` / `label-*`。
