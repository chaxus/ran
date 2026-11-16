<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center"><b>AI チャットとプロダクト UI のための Web コンポーネント。1 つの <code>&lt;r-*&gt;</code> タグが React、Vue、Svelte、素の HTML ファイルのどれでも同じように動きます。</b></p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="npm の ranui"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="npm の ranuts"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="CI の状態"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="MIT ライセンス"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/ja/">ドキュメント</a> · <a href="https://ran.chaxus.com/ja/ranui/">コンポーネント</a> · <a href="https://ran.chaxus.com/ja/agents/">エージェント</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <b>日本語</b> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

## 数字で見る

|                                       |       ranui | Shoelace | Web Awesome | Material Web |
| ------------------------------------- | ----------: | -------: | ----------: | -----------: |
| ボタン 1 つ、全依存とテーマ込み、gzip | **12.4 kB** |  22.5 kB |     41.1 kB |      14.4 kB |
| 1,000 個のボタンを生成して描画        |   **32 ms** |    52 ms |       60 ms |       102 ms |

| ranui 単体                                                                                 |                  |
| ------------------------------------------------------------------------------------------ | ---------------: |
| 5 つのコントロールのフォーム（ボタン、入力欄、チェックボックス、セレクト、モーダル）、gzip |          41.3 kB |
| 140 要素を Declarative Shadow DOM へサーバーレンダリング、Node                             |           1.5 ms |
| スタイル付きの初回描画、サーバーレンダリング vs クライアントのみ（Slow 4G、4× CPU）        | 424 ms vs 662 ms |
| [ran.chaxus.com](https://ran.chaxus.com/) の Lighthouse モバイル：スコア、LCP、CLS         |     97, 2.5 s, 0 |

<details>
<summary>測定方法</summary>

- **比較：** ranui 0.5.5、Shoelace 2.20.1、Web Awesome 3.14.0（無料版）、Material Web 2.5.0、いずれも npm から取得。サイズは、ボタンのエントリーを `esbuild --bundle --minify --format=esm` でバンドルし、各ライブラリのドキュメントが指定するテーマのスタイルシート（Material Web は不要）を加えて、`gzip -9` で圧縮したものです。Web Awesome と Shoelace のボタンは、アイコンとスピナーのコンポーネントも読み込みます。時間は新しいページ 10 回の中央値です。1,000 個のボタンを生成して追加し、Lit ベースのコンポーネントが描画を終えるよう 1 タスク待ってから、レイアウトを読み取ります。
- **フォームのサイズ：** `main`（`3f54e43`）のビルドから 5 つのコンポーネントをまとめて読み込み、esbuild でバンドルし、ブラウザーが取得したすべてのファイルを数えました。1 つずつ読み込むと合計 74.4 kB になります。共通のランタイムを 1 つ共有しているためです。
- **サーバーレンダリング：** `ranui/ssr-stream` の `renderHTMLToString` で 20 個のフォームを含むページを描画し、15 サンプルの中央値を取りました。各要素が自分のスタイルを持つため、出力は 947 kB の HTML（gzip で 125 kB）になります。
- **スタイル付きの初回描画：** 同じ 20 フォームのページを gzip 有効、Chromium を Slow 4G と 4 倍遅い CPU に制限して、10 回の中央値を取りました。サーバーレンダリングでは初回描画の時点でスタイル付きのフォームが表示され、クライアントのみではコンポーネントの読み込み後にスタイルが付きます。現状、サーバーレンダリングしたページはアップグレード時に CLS 0.125 のずれが生じます。
- **Lighthouse：** Lighthouse 12.8 のモバイルプリセット、3 回の中央値。ボタンのページも同じスコアです（97、LCP 2.3 s、CLS 0）。

</details>

ran は 3 つの部分からなり、それぞれ単独で使えます。**ranui** はネイティブのカスタム要素で作られた UI コンポーネント、**ranuts** は型付きの TypeScript ユーティリティ、**Ran Design** はどの技術スタックでも人とコーディングエージェントが使えるレイアウト・インタラクション・レビューの手法です。

- **フレームワークを選ばず、なくても動く。** すべてのコンポーネントは `<r-*>` タグなので、React、Vue、Svelte、素の HTML のどれでも同じように使えます。アダプターもフレームワークのランタイムも不要で、script タグ 1 つで動きます。
- **AI チャット画面の部品。** ストリーミング出力に追従する会話ビュー、書きかけのテキストも描画できる Markdown、推論とツール呼び出しの行、添付ファイル、音声入力。ストリーミング応答の解析は `ranuts/stream` が担います。
- **テーマ、サーバーレンダリング、型を同梱。** デザイントークンによるライト・ダークテーマ、SSR 用ツール、TypeScript の型宣言がパッケージに含まれます。
- **使うものだけインストール。** パッケージごと、コンポーネントごとに独立したエントリーがあります。

## パッケージ

| パッケージ                               | 用途                                                                                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.ja.md)   | カスタム要素で作るフォーム、ダイアログ、テーブル、Markdown、メディアプレーヤー、AI チャット画面。テーマとサーバーレンダリング用ツール付き。 |
| [ranuts](./packages/ranuts/README.ja.md) | 文字列、色、時刻、ファイル、ストレージ、DOM のためのヘルパーに加え、SSE の解析とストリーミング応答の状態管理。                              |
| [Ran Design](./design/README.md)         | 構成、インタラクション、モーション、根拠に基づくレビューの手法。エージェント用プラグインとして配布され、ranui がなくても使えます。          |

ranui のビルダーとリアクティブ層は [@alixex/ranview](./packages/ranview/README.md) として別途公開されています。

## クイックスタート

ビルドなしで使う場合は、CDN からコンポーネントを読み込んでタグを書きます。

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">保存</r-button>
```

バンドラーを使う場合は、パッケージをインストールして使うコンポーネントを読み込みます。

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

ranui はアルファ版で、リリースに破壊的変更が含まれることがあります。本番では正確なバージョンを固定してください。各要素のライブ例、イベント、スタイルは[コンポーネントのドキュメント](https://ran.chaxus.com/ja/ranui/)にあります。

## コーディングエージェントで使う

**ran** プラグインは Claude Code と Codex に design、ranui、ranuts の 3 つのスキルを追加します。MCP サーバーもアカウントも不要です。

```sh
claude plugin marketplace add chaxus/ran && claude plugin install ran@ran
```

```sh
codex plugin marketplace add chaxus/ran && codex plugin add ran@ran
```

新しいセッションで、Claude Code では `/ran:design`、`/ran:ranui`、`/ran:ranuts` を、Codex では `$design`、`$ranui`、`$ranuts` を使います。ローカルのチェックアウトからインストールする方法は[エージェントガイド](https://ran.chaxus.com/ja/agents/)を、スキル本体は [plugins/ran](./plugins/ran/) を参照してください。

## 開発に参加する

Node 24 以上と、`package.json` で固定されている pnpm のバージョンを使います。

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

参加する前に [AGENTS.md](./AGENTS.md) を、パッケージをリリースするときは[リリースガイド](./docs/RELEASING.md)を読んでください。

## ライセンス

[MIT](./LICENSE)
