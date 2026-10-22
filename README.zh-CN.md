<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">用于构建 Web 应用的界面组件和 TypeScript 工具。</p>
<p align="center"><a href="https://ran.chaxus.com/cn/">文档</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <b>中文</b> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran 是一组用于构建 Web 界面的库：用现成的 HTML 组件搭建表单、管理界面和内容页面，复用浏览器与数据处理函数，或直接用 TypeScript 编写响应式 DOM 界面。

每个包都可以单独安装。[文档站](./packages/docs/)和 [IM 示例](./packages/im/)展示了它们在完整应用中的组合用法。

## 选择需要的包

| 包                                                    | 能做什么                                                                                              |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [ranui@0.5.0](./packages/ranui/README.zh-CN.md)       | 用自定义 HTML 元素构建界面：输入框、选择器、弹窗、表格、Markdown 和播放器，提供主题和服务端渲染工具。 |
| [ranuts@0.5.0](./packages/ranuts/README.zh-CN.md)     | 处理浏览器与数据任务：颜色和二进制转换、存储操作、SSE 解析及流式响应状态。                            |
| [@alixex/ranview@0.2.0](./packages/ranview/README.md) | 用链式构建器和响应式信号组合 DOM 界面，也可生成用于服务端渲染的静态 HTML。                            |

## 试用 ranui

在使用 ESM 构建工具的浏览器项目中安装：

```sh
npm install ranui@0.5.0
```

将以下代码放进应用的 JavaScript 入口，即可生成一个能响应点击的按钮：

```js
import 'ranui/button';
import 'ranui/style';

const button = document.createElement('r-button');
button.setAttribute('type', 'primary');
button.textContent = '保存';
button.addEventListener('click', () => {
  button.textContent = '已保存';
});
document.body.append(button);
```

组件使用浏览器原生的自定义元素和标准事件，无需 React 或 Vue 运行时。其他组件通过各自入口引入，例如 `ranui/input`。在[组件示例](https://ran.chaxus.com/cn/src/ranui/)中查看标签、事件和定制方式；不使用构建工具时，可参考[独立脚本示例](./packages/ranui/README.zh-CN.md#iife--cdn)。

## 与 agent 一起使用

[ranui skill](./plugins/ranui/skills/ranui/SKILL.md) 用于界面实现、视觉审查和浏览器验收。
它按需读取宿主项目已安装的 ranui 规范，不会安装组件库，也不包含工具、hooks 或外部服务。

**Claude Code 插件**：添加本仓库的 marketplace，再安装 ranui：

```sh
claude plugin marketplace add chaxus/ran
claude plugin install ranui@ran
```

新会话中使用 `/ranui:ranui`。同一 marketplace 也提供用于工具函数任务的 `ranuts`。

**Codex 插件**：注册仓库的 marketplace，安装同一份 skill：

```sh
codex plugin marketplace add chaxus/ran
codex plugin add ranui@ran
```

新任务中使用 `$ranui`。本地检出仓库时，在仓库根目录执行 `codex plugin marketplace add .`。
[插件清单](./plugins/ranui/plugin.json)和 [Codex marketplace](./.agents/plugins/marketplace.json)
遵循[官方打包格式](https://developers.openai.com/plugins/build/plugins)。
两种安装入口使用同一份 skill 正文，不需要 MCP 服务、额外账号或 hook。

使用示例：“用 ranui 优化这个设置侧栏，保留任务和交互，用相关主题、宽度的实际截图验证。”
[UI 任务索引](./packages/ranui/docs/INTERFACE_GUIDE.md#ui-task-lookup)按任务进入唯一规则来源：
[设计](./packages/ranui/docs/DESIGN.md)、[交互](./packages/ranui/docs/INTERACTION.md)、
[公开 API](./packages/ranui/docs/COMPONENTS.md)和[证据与验收](./packages/ranui/docs/ACCEPTANCE.md)。
插件先明确简短的任务契约，再保留宿主产品已有决策，并用实际渲染证据支撑界面结论。
自动检查、agent 视觉审查和用户验收分别记录；[六个可选 agent 场景](./plugins/ranui/evals/README.md)
验证指引的实际执行效果，不用 token/API 检查冒充行为验证。源码贡献者先读 [AGENTS.md](./AGENTS.md)。

## 参与开发

使用 Node 24+ 和 pnpm 11.6.0。

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

各包目录包含自己的指南和示例。贡献前请阅读[仓库约定](./AGENTS.md)，准备发包时请参考[发布流程](./docs/RELEASING.md)。

## 许可证

[MIT](./LICENSE)
