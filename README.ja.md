<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Web アプリケーションのための UI コンポーネントと TypeScript ツール。</p>
<p align="center"><a href="https://ran.chaxus.com/ja/">ドキュメント</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <b>日本語</b> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran は Web インターフェースを構築するためのライブラリ群です。既製の HTML コンポーネントでフォーム、管理画面、コンテンツページを作り、ブラウザーやデータ処理の関数を再利用したり、TypeScript でリアクティブな DOM ビューを組み立てたりできます。

各パッケージは個別にインストールできます。[ドキュメントサイト](./packages/docs/)と [IM デモ](./packages/im/)では、これらを組み合わせたアプリケーションを紹介しています。

## パッケージを選ぶ

| パッケージ                                      | できること                                                                                                                                           |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.ja.md)          | カスタム HTML 要素で入力欄、セレクト、ダイアログ、テーブル、Markdown、メディアプレーヤーを構築。テーマとサーバーレンダリング用のツールも提供します。 |
| [ranuts](./packages/ranuts/README.ja.md)        | 色やバイナリの変換、ストレージ操作、SSE 解析、ストリーミング応答の状態管理など、ブラウザーとデータの処理。                                           |
| [@alixex/ranview](./packages/ranview/README.md) | チェーン可能なビルダーとリアクティブなシグナルで DOM ビューを構成。サーバーレンダリング用の静的 HTML も生成できます。                                |

## ranui を試す

ESM 対応のバンドラーを使うブラウザーアプリにインストールします。

```sh
npm install ranui
```

次のコードをアプリの JavaScript エントリーに追加すると、クリックに反応するボタンが表示されます。

```js
import 'ranui/button';
import 'ranui/style';

const button = document.createElement('r-button');
button.setAttribute('type', 'primary');
button.textContent = '保存';
button.addEventListener('click', () => {
  button.textContent = '保存済み';
});
document.body.append(button);
```

コンポーネントはブラウザー標準のカスタム要素とイベントを使うため、React や Vue のランタイムは不要です。他のコンポーネントも `ranui/input` のように個別のエントリーから読み込めます。[コンポーネントの例](https://ran.chaxus.com/ja/src/ranui/)でタグ、イベント、カスタマイズを確認できます。バンドラーを使わない場合は[独立スクリプトの例](./packages/ranui/README.ja.md#iife--cdn)を参照してください。

## 開発に参加する

Node 24+ と pnpm 11.6.0 を使用します。

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

各パッケージのディレクトリーにガイドと例があります。貢献する前に[リポジトリーの規約](./AGENTS.md)を、パッケージの公開準備には[リリース手順](./docs/RELEASING.md)を参照してください。

## ライセンス

[MIT](./LICENSE)
