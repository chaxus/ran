<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center"><b>用于 AI 对话和产品界面的 Web 组件。同一个 <code>&lt;r-*&gt;</code> 标签在 React、Vue、Svelte 和纯 HTML 文件里用法完全一样。</b></p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="npm 上的 ranui"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="npm 上的 ranuts"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="CI 状态"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="MIT 许可证"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/cn/">文档</a> · <a href="https://ran.chaxus.com/cn/ranui/">组件</a> · <a href="https://ran.chaxus.com/cn/agents/">Agent</a></p>
<p align="center"><a href="./README.md">English</a> · <b>中文</b> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

## 用数据说话

|                                     |       ranui | Shoelace | Web Awesome | Material Web |
| ----------------------------------- | ----------: | -------: | ----------: | -----------: |
| 一个按钮，含全部依赖和主题，gzip 后 | **12.4 kB** |  22.5 kB |     41.1 kB |      14.4 kB |
| 创建并渲染 1,000 个按钮             |   **32 ms** |    52 ms |       60 ms |       102 ms |

| ranui 自身                                                                     |                  |
| ------------------------------------------------------------------------------ | ---------------: |
| 五个控件的表单（按钮、输入框、复选框、下拉框、弹窗），gzip 后                  |          41.3 kB |
| 在 Node 中把 140 个元素服务端渲染成 Declarative Shadow DOM                     |           1.5 ms |
| 首次带样式绘制，服务端渲染 vs 纯客户端（Slow 4G，4× CPU）                      | 424 ms vs 662 ms |
| [ran.chaxus.com](https://ran.chaxus.com/) 的 Lighthouse 移动端：得分、LCP、CLS |     97, 2.5 s, 0 |

<details>
<summary>测量方法</summary>

- **横向对比：** ranui 0.5.5、Shoelace 2.20.1、Web Awesome 3.14.0（免费版）、Material Web 2.5.0，都从 npm 安装。体积是用 `esbuild --bundle --minify --format=esm` 打包按钮入口，加上各库文档要求引入的主题样式表（Material Web 不需要），再用 `gzip -9` 压缩后的大小。Web Awesome 和 Shoelace 的按钮会带上它们的图标和加载动画组件。时间取 10 个全新页面的中位数：创建 1,000 个按钮、插入页面、等待一个任务让基于 Lit 的组件完成渲染，然后读取布局。
- **表单体积：** 从 `main` 分支（`3f54e43`）的构建中一起导入这五个组件，用 esbuild 打包，统计浏览器请求的所有文件。逐个单独导入时合计 74.4 kB，因为它们共用一份运行时。
- **服务端渲染：** 用 `ranui/ssr-stream` 的 `renderHTMLToString` 渲染一个包含 20 个表单的页面，取 15 次采样的中位数。输出是 947 kB 的 HTML（gzip 后 125 kB），因为每个元素都带着自己的样式。
- **首次带样式绘制：** 同一个 20 个表单的页面，开启 gzip，Chromium 限速为 Slow 4G、CPU 降速 4 倍，取 10 次运行的中位数。服务端渲染时，首次绘制就是带样式的表单；纯客户端时，要等组件加载完才有样式。目前服务端渲染的页面在组件升级时会产生 0.125 的 CLS 偏移。
- **Lighthouse：** Lighthouse 12.8 移动端预设，取三次运行的中位数。按钮页面得分相同（97，LCP 2.3 s，CLS 0）。

</details>

ran 由三部分组成，每部分都能单独使用：**ranui** 是基于原生自定义元素的界面组件库；**ranuts** 是带类型的 TypeScript 工具函数；**Ran Design** 是一套布局、交互和验收方法，人和编程 agent 在任何技术栈里都能照着做。

- **不挑框架，也可以不用框架。** 每个组件都是一个 `<r-*>` 标签，React、Vue、Svelte 和纯 HTML 页面的用法完全一样。不需要适配层，也不带框架运行时，一个 script 标签就能跑起来。
- **现成的 AI 对话界面组件。** 包括跟随流式输出滚动的对话视图、能渲染写到一半的 Markdown、推理过程和工具调用的展示行、附件和语音输入。流式响应的解析交给 `ranuts/stream`。
- **主题、服务端渲染和类型都已内置。** 通过设计 token 切换亮色和暗色主题，附带 SSR 工具和 TypeScript 类型声明。
- **用到什么装什么。** 每个包、每个组件都有独立入口。

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
