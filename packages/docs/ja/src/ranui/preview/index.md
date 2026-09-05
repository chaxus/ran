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
    <r-button type="primary" onclick="uploadFile('preview-demo')">プレビューするファイルを選ぶ</r-button>
</div>

```html
<r-preview id="preview-demo"></r-preview>
<r-button type="primary" onclick="uploadFile()">プレビューするファイルを選ぶ</r-button>

<script>
  const uploadFile = () => {
    const preview = document.getElementById('preview-demo');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.docx,.pptx,.pdf,.xlsx');
    input.click();

    input.onchange = (e) => {
      const { files = [] } = input;
      if (files.length > 0) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        preview.setAttribute('src', url);
      }
    };
  };
</script>
```

## API リファレンス

### プロパティ

| プロパティ  | 型        | 既定値                      | 説明                                                         |
| ----------- | --------- | --------------------------- | ------------------------------------------------------------ |
| `src`       | `string`  | `''`                        | プレビューするファイルの URL。設定するとモーダルが自動で開く |
| `closeable` | `boolean` | `true`                      | 閉じるボタンを表示するか                                     |
| `baseUrl`   | `string`  | `'https://edit.chaxus.com'` | ドキュメントプレビューサービスの URL                         |

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
