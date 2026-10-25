<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">构建 Web 产品用的设计方法、组件和工具，开发者和编程 agent 都能直接用。</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="npm 上的 ranui"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="npm 上的 ranuts"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="CI 状态"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="MIT 许可证"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/cn/">文档</a> · <a href="https://ran.chaxus.com/cn/ranui/">组件</a> · <a href="https://ran.chaxus.com/cn/agents/">Agent</a></p>
<p align="center"><a href="./README.md">English</a> · <b>中文</b> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran 由三部分组成，每部分都能单独使用：**ranui** 是基于原生自定义元素的界面组件库；**ranuts** 是带类型的 TypeScript 工具函数；**Ran Design** 是一套布局、交互和验收方法，人和编程 agent 在任何技术栈里都能照着做。

- **不挑框架，也可以不用框架。** 每个组件都是一个 `<r-*>` 标签，React、Vue、Svelte 和纯 HTML 页面的用法完全一样。不需要适配层，也不带框架运行时，一个 script 标签就能跑起来。
- **现成的 AI 对话界面组件。** 包括跟随流式输出滚动的对话视图、能渲染写到一半的 Markdown、推理过程和工具调用的展示行、附件和语音输入。流式响应的解析交给 `ranuts/stream`。
- **主题、服务端渲染和类型都已内置。** 通过设计 token 切换亮色和暗色主题，附带 SSR 工具和 TypeScript 类型声明。
- **用到什么装什么。** 每个包、每个组件都有独立入口。

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/readme-home-dark.webp">
    <img width="800" src="./.github/assets/readme-home.webp" alt="ran.chaxus.com 首页：左边是 ranui 的标签写法，右边的实时面板渲染出对应的按钮、进度条、加载动画和复选框">
  </picture>
</p>

## 包

| 包                                          | 用来做什么                                                                                     |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.zh-CN.md)   | 用自定义元素构建表单、弹窗、表格、Markdown、播放器和 AI 对话界面，并提供主题和服务端渲染工具。 |
| [ranuts](./packages/ranuts/README.zh-CN.md) | 处理字符串、颜色、时间、文件、存储和 DOM 的工具函数，以及 SSE 解析和流式响应的状态管理。       |
| [Ran Design](./design/README.md)            | 关于构图、交互、动效和基于证据的验收的方法。以 agent 插件的形式发布，不依赖 ranui。            |

ranui 的构建器和响应式层单独发布为 [@alixex/ranview](./packages/ranview/README.md)。

## 快速上手

不用构建工具时，从 CDN 引入组件，直接写标签：

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">保存</r-button>
```

使用构建工具时，先安装，再引入要用的组件：

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

ranui 还在 alpha 阶段，新版本可能包含不兼容的改动，生产环境请锁定具体版本号。每个组件的在线示例、事件和样式定制见[组件文档](https://ran.chaxus.com/cn/ranui/)。

## 配合编程 agent 使用

**ran** 插件给 Claude Code 和 Codex 加上 design、ranui、ranuts 三个技能，不需要 MCP 服务，也不需要注册账号。

```sh
claude plugin marketplace add chaxus/ran && claude plugin install ran@ran
```

```sh
codex plugin marketplace add chaxus/ran && codex plugin add ran@ran
```

新开一个会话后，在 Claude Code 里用 `/ran:design`、`/ran:ranui` 或 `/ran:ranuts`，在 Codex 里用 `$design`、`$ranui` 或 `$ranuts`。想从本地仓库安装，看 [Agent 指南](https://ran.chaxus.com/cn/agents/)；技能本身在 [plugins/ran](./plugins/ran/)。

## 参与开发

需要 Node 24 及以上，pnpm 版本以 `package.json` 里固定的为准。

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

贡献代码前请先读 [AGENTS.md](./AGENTS.md)，发布包时参考[发布指南](./docs/RELEASING.md)。

## 许可证

[MIT](./LICENSE)
