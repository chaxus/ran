<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Web Components, DOM-Builder und TypeScript-Hilfsfunktionen.</p>
<p align="center"><a href="https://ran.chaxus.com/de/">Dokumentation</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <b>Deutsch</b> · <a href="./README.fa.md">فارسی</a></p>

## Pakete

| Paket                                           | Zweck                                  |
| ----------------------------------------------- | -------------------------------------- |
| [ranui](https://ran.chaxus.com/de/src/ranui/)   | Frameworkunabhängige UI-Komponenten.   |
| [ranuts](https://ran.chaxus.com/de/src/ranuts/) | Browser- und Datenverarbeitungshilfen. |
| [@alixex/ranview](packages/ranview/README.md)   | DOM-Builder und reaktive Signale.      |

## Schnellstart

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

## Entwicklung

Node 24+ · pnpm 11.6.0

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm -F docs dev
pnpm test
```

[Mitwirken](./AGENTS.md) · [MIT](./LICENSE)
