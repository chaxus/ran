---
description: 'ranui の Preview（<r-preview>）は docx・pptx・pdf・xlsx をブラウザ内でオンラインプレビューします。'
---

# Preview

`docx`、`pptx`、`pdf`、`xlsx` のオンラインプレビュー用コンポーネントです。

> **使いどころ**：`docx`、`pptx`、`pdf`、`xlsx` をブラウザ内でプレビューしたいとき。`<r-preview>` はファイル URL からドキュメントプレビューのモーダルを開きます（現在は独立した `@ranui/preview` パッケージとして配布されています）。

> ⚠️ **重要なお知らせ**：バージョン 0.1.10-alpha-27 以降、ranui パッケージはこのコンポーネントを提供しません。独立した [@ranui/preview](https://www.npmjs.com/package/@ranui/preview) パッケージへ移行してください。

## クイックスタート

### インストール

```bash
# 独立した preview パッケージを使う（推奨）
npm install @ranui/preview

# あるいは ranui パッケージ全体（バージョン 0.1.10-alpha-27 より前）
npm install ranui
```

### 基本的な使い方

<div style="width: 100px; margin-top:10px">
    <r-preview id="preview-demo"></r-preview>
    <r-button type="primary" data-preview-upload="preview-demo">プレビューするファイルを選ぶ</r-button>
</div>

```html
<r-preview id="preview-demo"></r-preview>
<r-button type="primary" onclick="uploadFile()">プレビューするファイルを選ぶ</r-button>

<script>
  let selectedUrl;
  const uploadFile = () => {
    const preview = document.getElementById('preview-demo');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.docx,.pptx,.pdf,.xlsx,.xls');
    input.click();

    input.onchange = (e) => {
      const { files = [] } = input;
      if (files.length > 0) {
        const file = files[0];
        if (selectedUrl) URL.revokeObjectURL(selectedUrl);
        selectedUrl = URL.createObjectURL(file);
        preview.setAttribute('src', selectedUrl);
      }
    };
  };
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted && selectedUrl) URL.revokeObjectURL(selectedUrl);
  });
</script>
```

## API リファレンス

### プロパティ

| 属性 / プロパティ      | 型        | 既定値                    | 説明                                          |
| ---------------------- | --------- | ------------------------- | --------------------------------------------- |
| `src`                  | `string`  | —                         | ファイル URL。設定するとダイアログを開く      |
| `closeable`            | `string`  | —                         | 文字列 false で閉じるボタンと Escape を無効化 |
| `baseUrl` / `baseurl`  | `string`  | `https://edit.chaxus.com` | Office エディターのページ URL                 |
| `readonly`             | `boolean` | `false`                   | Office の読み取り専用モードを有効化           |
| `pdf-mode` / `pdfMode` | `string`  | `eager`                   | PDF モード：eager または virtual              |
| `label`                | `string`  | `Preview file`            | トリガーのアクセシブルな名前                  |

### ファイルの場所 `src`

ファイルの URL を設定するとプレビューのモーダルが開きます。空の場合は表示されません。

```html
<r-preview src="https://example.com/document.docx"></r-preview>
```

### 閉じられるか `closeable`

プレビューのモーダルを閉じられるかどうかを制御します。

```html
<!-- 既定では閉じられる -->
<r-preview closeable="true"></r-preview>

<!-- 閉じられない -->
<r-preview closeable="false"></r-preview>
```

### プレビューサービスの指定 `baseUrl`

ドキュメントプレビューのサービスを自前で用意する場合は、`baseUrl` プロパティでそのアドレスを指定できます。

```html
<r-preview baseUrl="https://edit.chaxus.com"></r-preview>
```

> 💡 **ヒント**：既定ではホスティング済みのプレビューサービス `https://edit.chaxus.com` を使います。自前でホストする方法は [OnlyOffice Web Local](https://github.com/ranuts/document) を参照してください。

## 0.3.0 の互換性

0.3.0 は自動登録と Office の既定の編集可能な動作を維持します。PDF の既定の `eager` モードは全ページの描画後に `load` を発火します。`pdf-mode="virtual"`（JavaScript: `pdfMode = 'virtual'`）では表示領域を描画し、最初の表示領域とバッファーの準備後に `load` を発火します。worker は閉じる、ソースの置換、要素の削除まで保持されます。`readonly` や `closeable` の変更は、Office エディターと未保存の編集を維持します。

```html
<r-preview pdf-mode="virtual" src="/reports/long.pdf"></r-preview>
<r-preview readonly src="/reports/annual.docx"></r-preview>
```

PDF はローカルで描画します。Office ファイルは設定されたエディター iframe に渡され、そのページは内容にアクセスできます。非公開・イントラネット文書には独自の `baseUrl` を使用してください。

## 移行ガイド

現在 ranui パッケージの `r-preview` コンポーネントを使っている場合は、次の手順で移行することをおすすめします。

1. **新しいパッケージをインストールする**：

   ```bash
   npm install @ranui/preview
   ```

2. **import を書き換える**：

   ```javascript
   // これまで
   import 'ranui';

   // これから
   import '@ranui/preview';
   ```

3. **HTML の書き方は変わりません**：
   ```html
   <r-preview src="your-file-url"></r-preview>
   ```
