# ran

<p align="center">
  <a href="https://ran.chaxus.com/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
      <img width="120" src="./packages/docs/public/icon.png" alt="ran">
    </picture>
  </a>
</p>

Web Components、DOM ビルダー、TypeScript ユーティリティをまとめたワークスペース。

[![CI](https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml)](https://github.com/chaxus/ran/actions/workflows/ci.yml) · [MIT](./LICENSE)

[English](./README.md) | [中文](./README.zh-CN.md) | **日本語** | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> Alpha 段階です。API とパッケージ形式は変更される場合があります。バージョンを固定し、更新前に移行ガイドを確認してください。

## パッケージ

| パッケージ                                    | 用途                                                                                      |
| --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [ranui](packages/ranui/README.ja.md)          | Shadow DOM、テーマトークン、SSR ヘルパーを備えたフレームワーク非依存の Web Components。   |
| [ranuts](packages/ranuts/README.ja.md)        | ブラウザー API、データ処理、ストリーム、2D 描画向け TypeScript ユーティリティ。           |
| [@alixex/ranview](packages/ranview/README.md) | コンポーネントライブラリから独立した DOM ビルダー、シグナル、静的 HTML スナップショット。 |

## クイックスタート

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

HTML にカスタム要素を配置します：

```html
<r-button type="primary">Hello</r-button>
```

## ドキュメント

- [ranui](https://ran.chaxus.com/ja/src/ranui/)
- [ranuts](https://ran.chaxus.com/ja/src/ranuts/)
- [@alixex/ranview](packages/ranview/README.md)
- [移行ガイド](https://ran.chaxus.com/ja/src/ranuts/migration/)

## リポジトリ開発

Node 24+ と pnpm を使用し、リポジトリのルートで実行します：

```sh
git clone https://github.com/chaxus/ran.git
cd ran
pnpm install --frozen-lockfile
pnpm build
pnpm --filter ranui dev
```

その他の開発コマンド：

```sh
pnpm --filter docs dev
pnpm test
pnpm lint
pnpm verify:docs
pnpm clean
```

`pnpm clean` は生成物のみを削除し、ソース、インストール済み依存関係、ロックファイルを保持します。

## その他のプロジェクトと学習資料

ドキュメントツール：[docs](packages/docs)、[ranpress](packages/ranpress)、[site](packages/site)。[im](packages/im) は実験的なチャットアプリです。

ネイティブコード例：[C/C++](packages/cpro)、[画像処理](packages/image-process)、[Rust](packages/rust)。学習資料：[Shader](docs/learning/visual/README.md)、[Koa/Nginx](docs/learning/debug/README.md)。

ワークスペースの状態と CI 検査は [packages/manifest.json](packages/manifest.json) に定義しています。

## AI / Claude Code

[メンテナーと Agent 向け資料](packages/ranui/CLAUDE.md) · [ranuts](packages/ranuts/CLAUDE.md)

```text
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
/plugin install ranuts@ran
```

## 貢献

担当範囲と検証手順は [AGENTS.md](AGENTS.md) を確認してください。例とドキュメントを公開 API に合わせ、変更に応じた検査を実行してください。

## ライセンス

[MIT](./LICENSE)
