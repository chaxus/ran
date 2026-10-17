# ran

<p align="center">
  <a href="https://ran.chaxus.com/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
      <img width="120" src="./packages/docs/public/icon.png" alt="ran">
    </picture>
  </a>
</p>

一个工作区中的 Web Components、DOM 构建器与 TypeScript 工具库。

[![CI](https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml)](https://github.com/chaxus/ran/actions/workflows/ci.yml) · [MIT](./LICENSE)

[English](./README.md) | **中文** | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> 预发布阶段：API 和包格式可能变化。请锁定具体版本，升级前阅读迁移指南。

## 项目包

| 包                                            | 用途                                                                 |
| --------------------------------------------- | -------------------------------------------------------------------- |
| [ranui](packages/ranui/README.zh-CN.md)       | 框架无关的 Web Components，提供 Shadow DOM、主题 Token 和 SSR 工具。 |
| [ranuts](packages/ranuts/README.zh-CN.md)     | 覆盖浏览器 API、数据处理、流和二维渲染的 TypeScript 工具。           |
| [@alixex/ranview](packages/ranview/README.md) | DOM 构建器、信号和静态 HTML 快照，可独立于组件库使用。               |

## 快速开始

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

在 HTML 中使用自定义元素：

```html
<r-button type="primary">Hello</r-button>
```

## 文档

- [ranui](https://ran.chaxus.com/cn/src/ranui/)
- [ranuts](https://ran.chaxus.com/cn/src/ranuts/)
- [@alixex/ranview](packages/ranview/README.md)
- [迁移指南](https://ran.chaxus.com/cn/src/ranuts/migration/)

## 仓库开发

使用 Node 24+ 和 pnpm，在仓库根目录执行：

```sh
git clone https://github.com/chaxus/ran.git
cd ran
pnpm install --frozen-lockfile
pnpm build
pnpm --filter ranui dev
```

其他开发命令：

```sh
pnpm --filter docs dev
pnpm test
pnpm lint
pnpm verify:docs
pnpm clean
```

`pnpm clean` 仅删除生成产物，保留源码、已安装依赖和锁文件。

## 其他项目与学习资料

文档工具链：[docs](packages/docs)、[ranpress](packages/ranpress) 和 [site](packages/site)。[im](packages/im) 是实验性聊天应用。

原生示例：[C/C++](packages/cpro)、[图像处理](packages/image-process) 和 [Rust](packages/rust)。保留的学习资料：[Shader](docs/learning/visual/README.md) 与 [Koa/Nginx](docs/learning/debug/README.md)。

工作区状态和 CI 检查项声明在 [packages/manifest.json](packages/manifest.json)。

## AI / Claude Code

[维护者与 Agent 参考](packages/ranui/CLAUDE.md) · [ranuts](packages/ranuts/CLAUDE.md)

```text
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
/plugin install ranuts@ran
```

## 参与贡献

先阅读 [AGENTS.md](AGENTS.md) 中的职责和验证入口。示例、文档应与公共导出一致，并运行与改动相关的检查。

[发布指南](docs/RELEASING.md)

## 许可证

[MIT](./LICENSE)
