---
description: 'ranui/ssr-stream で ranui コンポーネントを declarative shadow DOM としてサーバー描画し、JavaScript が動く前から正しい初回描画を得ます。'
---

# サーバーレンダリング

ranui のコンポーネントは **declarative shadow DOM** にシリアライズされます。したがってサーバーが
本物のマークアップを吐き出せ、JavaScript が一行も動く前から初回描画が正しくなります。

> **使いどころ**：サーバーやビルド時にページを描画していて（SSG、Express / Hono / Workers の
> ルート、メールのプレビュー処理など）、`<r-*>` 要素をハイドレーション待ちの空タグではなく、
> 目に見えるマークアップとして届けたいとき。

## クイックスタート

```js
import 'ranui'; // SSR のレジストリを埋めます — 最初にこれを
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

登録済みの `<r-*>` タグはそれぞれインスタンス化され、属性が適用され、子が再帰的に描画され、
`<template shadowrootmode="closed">` を内側に持つ形で出力されます。知らないタグはそのまま通過するので、
普通の HTML のページ全体に対して実行しても安全です。

### ストリーミング

`renderToStream` は同じレンダラーを非同期ジェネレーターにしたものです。後続のコンポーネントを
描画している最中でも、静的なチャンクがクライアントへ届きます。

```js
import { renderToStream } from 'ranui/ssr-stream';

for await (const chunk of renderToStream(pageHtml)) response.write(chunk);
```

### コンポーネントを一つずつ

`ranui/ssr` は自分で構築したインスタンスを描画します。文字列をテンプレートするのではなく、
Node でツリーを組み立てているときに便利です。

```js
import { renderToString } from 'ranui/ssr';
import { Button } from 'ranui';

const html = renderToString(new Button());
```

## API リファレンス

| エクスポート               | エントリー         | シグネチャ                                 | 説明                                                       |
| -------------------------- | ------------------ | ------------------------------------------ | ---------------------------------------------------------- |
| `renderHTMLToString(html)` | `ranui/ssr-stream` | `(html: string) => Promise<string>`        | HTML 文字列の中の登録済み `<r-*>` タグをすべて展開します。 |
| `renderToStream(html)`     | `ranui/ssr-stream` | `(html: string) => AsyncGenerator<string>` | 同じものを、チャンクごとに。                               |
| `renderToString(el)`       | `ranui/ssr`        | `(component) => string`                    | コンポーネントのインスタンスを一つシリアライズします。     |
| `RanElement`               | `ranui/ssr`        | class                                      | ブラウザでは `HTMLElement`、Node では SSR のモック。       |
| `h(tag, props, …children)` | `ranui/ssr`        | `(tag, props?, ...children) => string`     | マークアップを手で組み立てるための小さなヘルパー。         |

## サーバーにできること、できないこと

**クライアントは組み直します。再利用はしません。** ranui は**閉じた** shadow root を付けますが、
すでに declarative shadow root を持つ要素に対して `attachShadow` を呼ぶと、モードが閉じている場合は
_その root の子が取り除かれます_。したがってサーバー描画されたツリーは最初のフレームを描いたあと、
まったく同じ内容のクライアント製ツリーに置き換わります。ここから二つの帰結があります。

- 得られるのは正しい初回描画であって、ハイドレーションの再利用ではありません。閉じた shadow root は
  上記の理由でクライアントが再利用できないからです。[コーディング規約](/ja/src/ranui/coding-guides/#server-rendering)
  を参照してください。
- **サーバー描画された shadow のマークアップに状態を入れて**、クライアントが読み戻してくれると
  期待してはいけません。状態は属性で渡してください。属性は生き残ります。

**測った値はサーバーには存在しません。** `getBoundingClientRect` や `offsetWidth` に依存するものは
すべて、マウント後にブラウザで解決します。コンポーネントの初期レイアウトが CSS から来るように
書かれているのは、まさにこのためです。

**今日の時点でサーバー描画されない要素が 4 つあります。** いずれもコンストラクターでブラウザの API に
触れるためです：`<r-content>`（`MutationObserver`）、`<r-link>`（`document`）、`<r-modal>`（SSR の
モックが実装していないスロットのメソッド）、`<r-radar>`（`ResizeObserver`）。これらは素のタグとして
通過し、クライアントでアップグレードされます。ほかのすべての要素には、描画されなくなったら失敗する
テストが付いているので、このリストが黙って増えることはありません。

## テーマとちらつき

`initTheme()` はサーバーでは何もしません（`document` / `localStorage` / `matchMedia` へのアクセスは
すべてガードされています）。したがってテーマはクライアントが適用します。違うテーマがちらつくのを
避けるには、サーバーのテンプレートで `<html>` に `data-ran-theme` を設定し（クッキーから、あるいは
初回描画前に `localStorage` を読む小さなインラインスクリプトから）、そのあとを
[`initTheme`](/ja/src/ranui/theme/) に引き継がせてください。

## ベストプラクティス

- **描画の前に `ranui`（または個別の `ranui/<component>` エントリー）を import する。** レジストリは
  import の副作用で埋まります。これがないとすべてのタグが展開されないまま通過し、ページは黙って
  マークアップを失います。
- **断片ではなくページを描画する。** `renderHTMLToString` は任意の HTML に対して安全なので、ranui の
  部分だけを切り出す必要はありません。
- **スタイルシートを配る。** DSD のマークアップはコンポーネントのスタイルを運びますが、ページ全体の
  トークンは `ranui/style` から（書体は `ranui/fonts` から）来ます。
