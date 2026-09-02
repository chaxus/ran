---
description: 'ranui 的运行时主题系统：initTheme / setTheme / getTheme、light / dark / system 模式、局部作用域与运行时令牌覆盖。'
---

# Theming 主题系统

ranui 样式体系中**运行时**的那一半：在 light、dark、system 之间切换，持久化用户选择，以及在运行
时覆盖令牌。

令牌本身——它们叫什么、各自负责什么——属于[设计系统](/cn/src/ranui/design-system/)；如何在其中取舍
属于[设计规范](/cn/src/ranui/design-guides/)。本页只讲**如何应用**。

> **适用场景**：需要为 ranui 应用接入明暗主题时——加载时调用一次 `initTheme`，用 `setTheme` 切换，
> 若想在不新增 CSS 的前提下覆盖个别令牌则用 `setThemeToken(s)`。

主题只有 **light（浅色）** 和 **dark（深色）** 两种，外加跟随操作系统偏好的 **system** 模式。
（旧的「主题包（theme pack）」API 已移除，`setThemePack` / `RanThemePackName` 不再存在。）

## 快速开始

```js
import { initTheme, setTheme, getTheme } from 'ranui/theme';

// 从 localStorage 恢复持久化的主题（'light' | 'dark' | 'system'）
initTheme();

// 切换主题——自动持久化
setTheme('dark');
setTheme('system'); // 跟随 prefers-color-scheme 实时更新

getTheme(); // → 'light' | 'dark' | 'system' | ''
```

独立的 **`ranui/theme`** 入口只包含主题引擎——引入它不会注册任何自定义元素，因此只需要令牌和暗色
模式的页面不会把整个组件库带进来。如果偏好单一引入，这些函数同样从顶层 `ranui` 主入口重新导出。

`setTheme` 会在 `<html>` 上写入 `data-ran-theme`（以及兼容用的 `theme`）属性，所有组件样式随之
响应。选择保存在 localStorage 键 `ran-theme` 下。

如果需要现成的切换 UI，直接使用 [`<r-theme-switch>`](/cn/src/ranui/theme-switch/)——一个已接入
该 API 的 system / light / dark 分段控件，会在多个实例之间同步，并更新 `theme-color` meta。

## API

| 函数              | 签名                                                                    | 说明                                                                           |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `initTheme`       | `(target?: ThemeTarget) => void`                                        | 从 `localStorage` 恢复主题，加载时调用一次。SSR 下为空操作。                   |
| `setTheme`        | `(name: RanThemeName, target?: ThemeTarget) => void`                    | 应用 `'light'` \| `'dark'` \| `'system'` 并持久化；`'system'` 会实时跟随系统。 |
| `getTheme`        | `(target?: ThemeTarget) => RanThemeName \| ''`                          | 读取当前主题。system 模式下返回 `'system'`，未设置时返回 `''`。                |
| `setThemeToken`   | `(name: string, value: string \| number, target?: HTMLElement) => void` | 运行时覆盖单个令牌（作为目标元素的内联样式）。                                 |
| `setThemeTokens`  | `(tokens: ThemeTokenMap, target?: HTMLElement) => void`                 | 批量覆盖令牌，值为 `null` / `undefined` 时清除对应令牌。                       |
| `clearThemeToken` | `(name: string, target?: HTMLElement) => void`                          | 移除运行时的令牌覆盖。                                                         |

**类型**

```ts
type RanThemeName = 'light' | 'dark' | 'system';
type ThemeTarget = HTMLElement | Document; // 默认 document.documentElement
type ThemeTokenMap = Record<string, string | number | null | undefined>;
```

**`target`** — 所有函数默认作用于 `<html>`（`document.documentElement`）。传入某个元素可将主题或
令牌覆盖限定到局部子树。

**SSR 安全** — 所有对 `document` / `localStorage` / `matchMedia` 的访问都有守卫，服务端渲染时这些
函数不会抛错，只是空操作。

## 暗色模式是怎么工作的

`setTheme('dark')` 在 `<html>` 上写入 `data-ran-theme="dark"`。样式表随后**只重定义基础色板**
（单一来源），每个 `--ran-color-*` 语义令牌都通过 `var()` 引用它，于是自动翻转——没有任何组件带着
自己的暗色覆盖。

由此有两个结论：

- **只要消费语义令牌，你自己的 CSS 也免费获得暗色模式**；反之，写死颜色或写了只在浅色下成立的
  兜底值就会出错。见
  [在自己的 CSS 里使用令牌](/cn/src/ranui/design-system/#在自己的-css-里使用令牌)。
- **主题翻转时不应该有任何过渡动画。** CSS 分不清颜色为什么变了，因此调色属性上的 `transition`
  会在切换主题时让每个元素按各自的时长淡入淡出。ranui 的组件刻意不这么做，你的也不该这么做。

## 自定义令牌

### 运行时（JS）

```js
import { setThemeToken, setThemeTokens, clearThemeToken } from 'ranui/theme';

// 单个令牌，作用于 <html>（影响全局）
setThemeToken('--ran-color-primary', '#7c3aed');

// 批量设置
setThemeTokens({
  '--ran-color-primary': '#7c3aed',
  '--ran-radius-md': '8px',
});

// 限定到局部子树
setThemeToken('--ran-color-primary', '#e11d48', document.querySelector('#panel'));

// 移除覆盖
clearThemeToken('--ran-color-primary');
```

### 构建时（CSS）

在 `:root` 或任意作用域覆盖：

```css
:root {
  --ran-color-primary: #7c3aed;
  --ran-radius-md: 8px;
}
```

### 该覆盖哪一层

因为暗色模式只重定义基础色板：

- 覆盖**语义**令牌（`--ran-color-primary`）：明暗两套主题下都保持同一个值。
- 覆盖**基础**色阶档位（`--ran-blue-700`）：希望这个改动也跟着主题翻转——所有引用它的语义令牌都会
  跟随。
- 覆盖**组件**令牌（`--ran-btn-hover-background`）：只改一个元素。

完整分层见[设计系统](/cn/src/ranui/design-system/#两层令牌)。注意运行时覆盖是目标元素上的**内联
样式**：它在该子树内胜过样式表规则——这正是分区主题能生效的原因，也正是忘记清除的覆盖后来很难被
发现的原因。

## 把主题限定到页面局部

所有函数都接受 target，因此预览区可以和外层页面使用不同的主题：

```js
const preview = document.querySelector('#preview');

setTheme('dark', preview); // 只影响这棵子树
getTheme(preview); // → 'dark'
```

属性会写在该元素上而不是 `<html>`，剩下的交给令牌的层叠继承。
