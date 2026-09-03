---
description: 'ranui 是基于原生自定义元素（<r-*>）的 Web Components UI 组件库，内置 TypeScript 类型、明暗主题、Shadow DOM、SSR 与 PWA 支持。'
---

# ranui

一个建立在**原生自定义元素**之上的 UI 组件库。每个组件都是一个 `<r-*>` 标签，因此在 React、Vue、
Svelte、Solid、Astro 乃至一个纯 HTML 文件里的用法完全一致——没有适配层，也不需要匹配框架版本。
TypeScript 类型、基于设计令牌的明暗主题、Shadow DOM 封装与服务端渲染都是内置的。

<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://unpkg.com/ranui/dist/index.js"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

- **npm**：<a href="https://www.npmjs.com/package/ranui">`ranui`</a> ·
  **源码**：<a href="https://github.com/chaxus/ran/tree/main/packages/ranui">`packages/ranui`</a>
- ranui 处于 **alpha** 阶段：版本中会包含破坏性变更。请锁定确切版本，升级前先读
  [更新日志](/cn/src/ranui/changelog)。

## 安装

```bash
npm install ranui
```

```html
<!-- 或者直接用 CDN，不需要构建步骤 -->
<script src="https://unpkg.com/ranui/dist/umd/index.umd.cjs"></script>
```

## 使用

引入即完成注册，之后写标签就行。

```js
import 'ranui'; // 全部组件
import 'ranui/button'; // 或只要一个
```

```html
<r-button type="primary">部署项目</r-button>
```

在任何框架里都是同一个标签——差别只在于各框架如何传值和绑事件，这部分在
[编码规范](/cn/src/ranui/coding-guides/#框架接入)里讲全了：

::: code-group

```html [HTML]
<script src="https://unpkg.com/ranui/dist/umd/index.umd.cjs"></script>

<body>
  <r-button>Button</r-button>
</body>
```

```jsx [React]
import 'ranui';

export const App = () => <r-button type="primary">部署</r-button>;
// 复杂值与事件监听要走 ref —— 见编码规范。
```

```vue [Vue]
<template>
  <r-button type="primary" @click="deploy">部署</r-button>
</template>

<script setup>
import 'ranui';
</script>
<!-- 需要在构建配置的 compilerOptions.isCustomElement 里放行 `r-` 前缀。 -->
```

```js [原生 JS]
import 'ranui';

const button = document.createElement('r-button');
button.textContent = '部署';
document.body.appendChild(button);
```

:::

## 入口

每个入口只注册名字所说的东西——只想要主题的页面不会为组件库付费。

| 引入                                                  | 内容                                      |
| ----------------------------------------------------- | ----------------------------------------- |
| `ranui`                                               | 全部组件                                  |
| `ranui/<component>`                                   | 单个组件——`ranui/button`、`ranui/select`… |
| [`ranui/theme`](/cn/src/ranui/theme/)                 | 明暗主题与令牌覆盖；不含元素              |
| [`ranui/i18n`](/cn/src/ranui/i18n/)                   | 翻译引擎；不含元素                        |
| `ranui/fonts`                                         | 自托管的 Geist Sans + Geist Mono          |
| `ranui/style`                                         | 样式表，供构建工具没有自动引入时使用      |
| [`ranui/builder`](/cn/src/ranui/builder/)             | 带细粒度响应式的链式 DOM 构建器           |
| [`ranui/ssr`](/cn/src/ranui/ssr/)、`ranui/ssr-stream` | 服务端渲染                                |
| `ranui/testing`                                       | 在测试中进入 closed shadow root 的助手    |
| `ranui/typings`                                       | JSX / TS 环境类型声明                     |

## 组件

共 40 个元素。每一个的属性、属性值、事件、插槽和 `::part()` 名称，都在
[元素 API 参考](/cn/src/ranui/api)里。

**通用** —— [Button 按钮](/cn/src/ranui/button/) · [Icon 图标](/cn/src/ranui/icon/) ·
[Loading 加载中](/cn/src/ranui/loading/)

**数据录入** —— [Input 输入框](/cn/src/ranui/input/) ·
[CheckBox 多选框](/cn/src/ranui/checkbox/) · [Select 选择框](/cn/src/ranui/select/) ·
[ColorPicker 颜色选择器](/cn/src/ranui/colorpicker/) ·
[Attachments 附件条](/cn/src/ranui/attachments/) ·
[VoiceButton 语音按钮](/cn/src/ranui/voice-button/) · [表单](/cn/src/ranui/form/)

**数据展示** —— [Card 卡片](/cn/src/ranui/card/) · [Section 区块](/cn/src/ranui/section/) ·
[Tabs 标签页](/cn/src/ranui/tab/) · [Image 图片](/cn/src/ranui/image/) ·
[Progress 进度条](/cn/src/ranui/progress/) · [Radar 雷达图](/cn/src/ranui/radar/) ·
[Player 播放器](/cn/src/ranui/player/) · [Preview 预览](/cn/src/ranui/preview/) ·
[Glass 毛玻璃](/cn/src/ranui/glass/) · [Scratch 刮刮卡](/cn/src/ranui/scratch/) ·
[StateDot 状态点](/cn/src/ranui/state-dot/) ·
[DisclosureRow 折叠行](/cn/src/ranui/disclosure-row/)

**内容渲染** —— [Markdown 富文本](/cn/src/ranui/markdown/) ·
[Math 数学公式](/cn/src/ranui/math/) · [Mermaid 图表](/cn/src/ranui/mermaid/)

**AI 与对话** —— [Conversation 对话](/cn/src/ranui/conversation/) ·
[Reasoning 思维链](/cn/src/ranui/reasoning/) ·
[ToolCard 工具卡片](/cn/src/ranui/tool-card/) ·
[TokenMeter 上下文用量](/cn/src/ranui/token-meter/)

**浮层与反馈** —— [Modal 对话框](/cn/src/ranui/modal/) ·
[Popover 气泡卡片](/cn/src/ranui/popover/) · [Dropdown 下拉面板](/cn/src/ranui/dropdown/) ·
[Message 全局提示](/cn/src/ranui/message/) · [Skeleton 骨架屏](/cn/src/ranui/skeleton/)

**导航** —— [Router 路由](/cn/src/ranui/router/) · [Route 路由出口](/cn/src/ranui/route/) ·
[Link 链接](/cn/src/ranui/link/)

**基础能力** —— [Theme 主题系统](/cn/src/ranui/theme/) ·
[ThemeSwitch 主题切换](/cn/src/ranui/theme-switch/) · [i18n 国际化](/cn/src/ranui/i18n/)

有五个元素没有独立页面，因为它们只存在于另一个组件内部：`<r-option>`（Select）、
`<r-tabs>`（Tabs）、`<r-img>`（Image）、`<r-dropdown-item>`（Dropdown）、
`<r-content>`（Popover）。它们和其他元素一样都在 API 参考里。

### 实时示例

<div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-bottom:12px">
  <r-button type="primary">主要按钮</r-button>
  <r-button type="warning">警告按钮</r-button>
  <r-button type="text">文字按钮</r-button>
  <r-button>默认按钮</r-button>
  <r-icon name="lock" size="28"></r-icon>
  <r-icon name="user" size="28"></r-icon>
  <r-icon name="loading" size="28" color="#1E90FF" spin></r-icon>
</div>

<div style="width:100%;margin-bottom:12px">
  <r-progress percent="0.7" type="drag"></r-progress>
</div>

<r-markdown copy content="**流式** Markdown，支持 `代码`、表格、mermaid 与数学公式。"></r-markdown>

## 自定义样式

组件渲染进 **closed** shadow root：页面 CSS 漏不进去，选择器也穿不过去。进入的方式有四种，按优先级
排列。

**1. 设计令牌（CSS 自定义属性）**——它们会继承穿过边界，因此设在 `:root`、外层容器或元素上都有效：

```html
<r-progress
  percent="0.7"
  type="drag"
  style="--ran-progress-track-background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f)"
></r-progress>
```

<div style="width:100%;margin:12px 0">
  <r-progress percent="0.7" type="drag" style="--ran-progress-track-background:linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);"></r-progress>
</div>

**2. `::part()`**——令牌覆盖不到的结构性调整 · **3. `sheet` 属性**——把 CSS 注入 shadow root ·
**4. 插槽内容**——它留在你的文档里，直接吃你的页面 CSS。

令牌名字见[设计系统](/cn/src/ranui/design-system/)，如何取舍见
[设计规范](/cn/src/ranui/design-guides/)，机制细节见
[编码规范](/cn/src/ranui/coding-guides/#跨-shadow-边界上样式)。

## 事件

组件派发 `CustomEvent`，负载放在 `detail` 里。请把监听绑在元素上——是否冒泡是各组件自己的决定，
API 参考里逐个都标注了：

```html
<r-select id="env"></r-select>

<script>
  document.getElementById('env').addEventListener('change', (event) => {
    console.log(event.detail.value);
  });
</script>
```

`onchange="…"` 属性写法和 `el.onchange = …` 属性值写法也都能用（它们本来就是普通 DOM 元素），但这
两种只能挂一个处理函数、也拿不到捕获阶段，所以首选 `addEventListener`。

## 接下来读什么

| 如果你想……               | 读                                       |
| ------------------------ | ---------------------------------------- |
| 查某个元素的确切接口     | [元素 API](/cn/src/ranui/api)            |
| 知道该用哪个令牌、为什么 | [设计系统](/cn/src/ranui/design-system/) |
| 做出像一套系统的界面     | [设计规范](/cn/src/ranui/design-guides/) |
| 把 ranui 正确接进应用    | [编码规范](/cn/src/ranui/coding-guides/) |
| 接入明暗主题，或整体换皮 | [主题系统](/cn/src/ranui/theme/)         |
| 把界面翻译成别的语言     | [i18n 国际化](/cn/src/ranui/i18n/)       |
| 在服务端渲染             | [服务端渲染](/cn/src/ranui/ssr/)         |
| 不用框架写响应式视图     | [Builder 构建器](/cn/src/ranui/builder/) |
| 升级前看看改了什么       | [更新日志](/cn/src/ranui/changelog)      |

## 兼容性

所有现代浏览器——组件库建立在 Custom Elements v1、Shadow DOM v1 与 CSS 自定义属性之上。
**不支持 Internet Explorer。**

![](../../../assets/ranui/customElements.png)

## 贡献者

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## 延伸阅读

这个库所依据的标准：[W3C](https://www.w3.org/) ·
[ECMA](https://www.ecma-international.org/) · [RFC](https://www.rfc-editor.org/) ·
[Can I use](https://caniuse.com/)

值得常开着的设计参考：[Checklist Design](https://www.checklist.design/) ·
[Laws of UX](https://lawsofux.com/) · [Geist](https://vercel.com/geist) ·
[Ant Design](https://ant.design/index-cn) · [Element UI](https://element.eleme.cn/#/zh-CN) ·
[Animista](https://animista.net/) · [WebGradients](https://webgradients.com/)
