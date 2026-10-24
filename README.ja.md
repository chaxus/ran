<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Web プロダクトを作るための設計手法、コンポーネント、ツール。開発者にもコーディングエージェントにも。</p>
<p align="center"><a href="https://ran.chaxus.com/ja/">ドキュメント</a> · <a href="https://ran.chaxus.com/ja/src/ranui/">コンポーネント</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <b>日本語</b> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran は 3 つの部分からなり、それぞれ単独で使えます。**ranui** はネイティブのカスタム要素で作られた UI コンポーネント、**ranuts** は型付きの TypeScript ユーティリティ、**Ran Design** はどの技術スタックでも人とコーディングエージェントが使えるレイアウト・インタラクション・レビューの手法です。ranui の各コンポーネントは `<r-*>` タグなので、React、Vue、Svelte、素の HTML のどれでも同じように動き、AI チャット画面向けのコンポーネントも揃っています。

## インストール

ビルドなしで試す場合は、CDN から読み込んでタグを書くだけです。

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">保存</r-button>
```

バンドラーを使う場合:

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

ranui はアルファ版で、リリースに破壊的変更が含まれることがあります。本番では正確なバージョンを固定してください。

## 詳しく

パッケージごとの説明は [ranui](./packages/ranui/README.ja.md) と [ranuts](./packages/ranuts/README.ja.md) を、ライブデモは[ドキュメントサイト](https://ran.chaxus.com/ja/)を参照してください。コーディングエージェント用プラグインと開発への参加方法は[英語版 README](./README.md) にあります。

## ライセンス

[MIT](./LICENSE)
