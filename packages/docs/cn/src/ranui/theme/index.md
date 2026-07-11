# Theming 主题

ranui 提供基于**设计令牌**（CSS 自定义属性）的明暗主题系统。组件从不写死颜色，而是消费语义
令牌，因此切换主题或覆盖某个令牌即可一次性重塑整个组件库的样式。令牌体系基于
[Geist](https://vercel.com/geist) 设计语言。

主题只有 **light（浅色）** 和 **dark（深色）** 两种，外加跟随操作系统偏好的 **system** 模式。
（旧的「主题包（theme pack）」API 已移除，`setThemePack` / `RanThemePackName` 不再存在。）

## 快速开始

页面加载时调用一次 `initTheme()` 恢复用户上次的选择，再用 `setTheme()` 切换：

```js
import { initTheme, setTheme, getTheme } from 'ranui';

// 从 localStorage 恢复持久化的主题（'light' | 'dark' | 'system'）
initTheme();

// 切换主题——自动持久化
setTheme('dark');
setTheme('system'); // 跟随 prefers-color-scheme 实时更新

getTheme(); // → 'light' | 'dark' | 'system' | ''
```

`setTheme` 会在 `<html>` 上写入 `data-ran-theme`（以及兼容用的 `theme`）属性，所有组件样式随之
响应。选择会保存在 localStorage 键 `ran-theme` 下。

如果需要现成的主题切换 UI，直接使用 [`<r-theme-switch>`](/cn/src/ranui/theme-switch/) 组件——
一个接入该 API 的 system / light / dark 分段控件。

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

**`target`** — 所有函数默认作用于 `<html>`（`document.documentElement`）。传入某个元素可将
主题或令牌覆盖限定到局部子树。

**SSR 安全** — 所有对 `document` / `localStorage` / `matchMedia` 的访问都有守卫，服务端渲染
时这些函数不会抛错，只是空操作。

## 令牌分层

令牌分为两层，**应用中只消费语义层**——它会在明暗之间自动翻转。

**第一层 —— 基础调色板**（原始色阶，很少直接使用）：每种颜色从 `100 → 1000` 共 10 档 ——
`--ran-gray-100..1000`、`--ran-gray-alpha-100..1000`、`--ran-blue/red/amber/green-100..1000`，
以及 `--ran-background-100/200`。

**第二层 —— 语义令牌**（`--ran-color-*` 等）映射到基础色阶。深色模式只重定义基础色阶，因此每个
语义令牌通过 `var()` 自动翻转，无需为组件逐一编写深色覆盖。

### 语义颜色令牌

| 令牌                           | 用途            |
| ------------------------------ | --------------- |
| `--ran-color-primary`          | 主操作          |
| `--ran-color-primary-hover`    | 主操作悬停      |
| `--ran-color-primary-active`   | 主操作激活      |
| `--ran-color-success`          | 成功            |
| `--ran-color-warning`          | 警告            |
| `--ran-color-danger`           | 危险 / 错误     |
| `--ran-color-bg`               | 页面背景        |
| `--ran-color-bg-subtle`        | 次级背景        |
| `--ran-color-bg-elevated`      | 卡片 / 表面背景 |
| `--ran-color-bg-muted`         | 弱化表面        |
| `--ran-color-bg-hover`         | 悬停表面        |
| `--ran-color-bg-active`        | 激活表面        |
| `--ran-color-text`             | 主文本          |
| `--ran-color-text-secondary`   | 次级文本        |
| `--ran-color-text-disabled`    | 禁用文本        |
| `--ran-color-border`           | 默认边框        |
| `--ran-color-border-secondary` | 次级边框        |
| `--ran-color-border-hover`     | 悬停边框        |
| `--ran-color-border-active`    | 激活边框        |
| `--ran-color-link`             | 链接色          |
| `--ran-color-contrast-bg`        | 对比操作表面  |
| `--ran-color-contrast-bg-hover`  | 对比悬停      |
| `--ran-color-contrast-bg-active` | 对比激活      |
| `--ran-color-contrast-text`      | 对比表面上的文本 |

**contrast（对比）** 这组令牌支撑单色的「最高对比度」操作（即 Geist 对比按钮
`<r-button type="contrast">`）：浅色模式黑底白字，深色模式白底黑字。当主要操作不应携带
任何色相时使用。

**颜色是状态阶梯，而非调色板。** 在一条色阶内每一档都有固定职责：`100` 默认背景 · `200` 悬停背景 ·
`300` 激活背景 · `400` 边框 · `500` 悬停边框 · `600` 激活边框 · `700` 实色 · `800` 实色悬停 ·
`900` 次级文本 · `1000` 主文本。

### 非颜色令牌

| 分组 | 令牌                                                                                             |
| ---- | ------------------------------------------------------------------------------------------------ |
| 圆角 | `--ran-radius-sm` 6px · `--ran-radius-md` 12px · `--ran-radius-lg` 16px · `--ran-radius-full`    |
| 间距 | `--ran-space-1..24`（4px 基准：4 · 8 · 12 · 16 · 24 · 32 · 40 · 64 · 96）                        |
| 阴影 | `--ran-shadow-elevated`（在流表面）· `--ran-shadow-menu`（浮层）· `--ran-shadow-modal`（对话框） |
| 层级 | `--ran-z-modal` 1000 · `--ran-z-dropdown` 1100 · `--ran-z-message` 1200                          |
| 动效 | `--ran-motion-duration-fast` 0.15s · `--ran-motion-duration-base` 0.2s                           |
| 焦点 | `--ran-focus-ring`                                                                               |
| 排版 | `--ran-font-family`（Geist Sans）· `--ran-font-mono`（Geist Mono）                               |

## 字体

ranui 自托管了 `--ran-font-family` / `--ran-font-mono` 背后的标准字体——**Geist Sans** 与
**Geist Mono**（可变字重 100–900，SIL OFL 1.1 许可）。字体文件随包分发，一行导入即可加载，
不依赖任何 CDN：

```js
// 打包器
import 'ranui/fonts';
```

```html
<!-- 静态页面 -->
<link rel="stylesheet" href="…/ranui/dist/fonts/fonts.css" />
```

不导入也一切正常——排版令牌会回退到系统字体，只是没有 Geist 字形。

## 自定义令牌

### 运行时（JS）

```js
import { setThemeToken, setThemeTokens, clearThemeToken } from 'ranui';

// 在 <html> 上覆盖单个令牌（影响全局）
setThemeToken('--ran-color-primary', '#7c3aed');

// 批量覆盖
setThemeTokens({
  '--ran-color-primary': '#7c3aed',
  '--ran-radius-md': '8px',
});

// 限定到子树
setThemeToken('--ran-color-primary', '#e11d48', document.querySelector('#panel'));

// 移除覆盖
clearThemeToken('--ran-color-primary');
```

### 构建时（CSS）

在 `:root`（或任意作用域）下覆盖语义令牌。由于深色模式只重定义基础色阶，若想做「不随主题翻转」的
改动就覆盖**语义**令牌，若想让改动也随主题翻转则覆盖**基础色阶**：

```css
:root {
  --ran-color-primary: #7c3aed;
  --ran-radius-md: 8px;
}
```

## 深色模式原理

`setTheme('dark')` 会在 `<html>` 上设置 `data-ran-theme="dark"`。样式表只为深色重定义第一层基础
色阶（集中在 `theme/dark.less` 单一来源）；每个 `--ran-color-*` 语义令牌都通过 `var()` 引用色阶，
因此自动翻转。这也是组件级令牌必须使用**深色安全回退**的原因——回退值应指向一个会翻转的令牌
（`var(--ran-color-text, …)`），而不是像 `rgba(0,0,0,.06)` 这样只适用于浅色的字面量。
