<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Web Components、DOM 构建器与 TypeScript 工具库。</p>
<p align="center"><a href="https://ran.chaxus.com/cn/">文档</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <b>中文</b> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

## 项目包

| 包                                              | 用途                     |
| ----------------------------------------------- | ------------------------ |
| [ranui](https://ran.chaxus.com/cn/src/ranui/)   | 框架无关的 UI 组件。     |
| [ranuts](https://ran.chaxus.com/cn/src/ranuts/) | 浏览器与数据处理工具。   |
| [@alixex/ranview](packages/ranview/README.md)   | DOM 构建器与响应式信号。 |

## 快速开始

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

```html
<r-button type="primary">Hello</r-button>
```

## 开发

Node 24+ · pnpm 11.6.0

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm -F docs dev
pnpm test
```

[参与贡献](./AGENTS.md) · [MIT](./LICENSE)
