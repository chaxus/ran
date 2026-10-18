<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Web Components、DOM ビルダー、TypeScript ユーティリティ。</p>
<p align="center"><a href="https://ran.chaxus.com/ja/">ドキュメント</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <b>日本語</b> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

## パッケージ

| パッケージ                                      | 用途                                       |
| ----------------------------------------------- | ------------------------------------------ |
| [ranui](https://ran.chaxus.com/ja/src/ranui/)   | フレームワーク非依存の UI コンポーネント。 |
| [ranuts](https://ran.chaxus.com/ja/src/ranuts/) | ブラウザーとデータ処理のユーティリティ。   |
| [@alixex/ranview](packages/ranview/README.md)   | DOM ビルダーとリアクティブシグナル。       |

## クイックスタート

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

## 開発

Node 24+ · pnpm 11.6.0

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm -F docs dev
pnpm test
```

[貢献](./AGENTS.md) · [MIT](./LICENSE)
