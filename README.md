<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Web Components, DOM builders and TypeScript utilities.</p>
<p align="center"><a href="https://ran.chaxus.com/">Documentation</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><b>English</b> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

## Packages

| Package                                       | Use for                                |
| --------------------------------------------- | -------------------------------------- |
| [ranui](https://ran.chaxus.com/src/ranui/)    | Framework-independent UI components.   |
| [ranuts](https://ran.chaxus.com/src/ranuts/)  | Browser and data-processing utilities. |
| [@alixex/ranview](packages/ranview/README.md) | DOM builders and reactive signals.     |

## Quick start

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

## Development

Node 24+ · pnpm 11.6.0

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm -F docs dev
pnpm test
```

[Contributing](./AGENTS.md) · [MIT](./LICENSE)
