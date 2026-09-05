---
description: 'ranui の Attachments（<r-attachments>）は、メッセージに添える予定のファイルを持ち、プレビューし、検証し、自分が作ったオブジェクト URL を自分で始末します。'
---

# Attachments

メッセージに添える予定のファイルたちです。`<r-attachments>` はその一覧を持ち、プレビューし、
届いたものを検証し、自分が作ったオブジェクト URL を自分で始末します。

> **使いどころ**：入力欄が、これから送るものを見せる必要があるとき。この要素はファイルを
> **集めません**。貼り付け、ドラッグ＆ドロップ、ファイル選択は三つの別々の操作で、それぞれ入力欄の
> 別の要素に属します。そのどれをアプリが提供するかはあなたの判断です。配線したものから `add()` を
> 呼んでください。

## クイックスタート

### 基本的な使い方

```html
<r-attachments accept="image/*,.pdf" max-size="5242880" max-count="4"></r-attachments>
```

```js
const strip = document.createElement('r-attachments');

// ファイル選択
picker.addEventListener('change', () => strip.add(picker.files));

// 貼り付け —— クリップボードが実際にファイルを運んでいるときだけ。すべての貼り付けを
// 横取りすると、この箱の主な用途であるテキストの貼り付けが壊れます。
input.addEventListener('paste', (event) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault();
    strip.add(event.clipboardData.files);
  }
});

// ドラッグ＆ドロップ
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  strip.add(event.dataTransfer.files);
});

composer.append(strip);
```

この帯はファイルごとに一行を描き、サムネイル（画像の場合）、名前、大きさ、取り除くボタンを並べます。
`count` はホストに反映され、帯が空のときは `0` にするのではなく**取り除かれます**。したがって空の帯は
場所を取らずに済みます。

```css
r-attachments:not([count]) {
  display: none;
}
```

### 送信

```js
const body = new FormData();
for (const file of strip.files) body.append('files', file);
await fetch('/api/messages', { method: 'POST', body });
strip.clear();
```

`files` は `File` オブジェクトを順番に並べただけのもので、リクエストの本文が欲しがる形です。
同じ状態を自分で描きたいときのために、`attachments` のほうがより豊かな一覧（`id`、`name`、`size`、
`type`、`previewUrl`）を持っています。

### 拒否は必ず報告され、黙って起きません

誰も触れなかった上限を 3 MB 超えたせいで消えたファイルは、ページの不具合として読まれます。拒否は
どれも、そのファイルと破られた規則を運ぶイベントを発生させます。

```js
const explain = {
  'too-large': 'そのファイルは 5 MB を超えています。',
  'type-not-accepted': 'ここではその種類のファイルを受け付けていません。',
  'too-many': '添付できるのは最大 4 つまでです。',
  duplicate: 'そのファイルはすでに添付されています。',
};

strip.addEventListener('attachmentrejected', (event) => {
  toast(explain[event.detail.reason]);
});
```

`duplicate` は名前、大きさ、更新時刻をまとめて比べます。ファイルマネージャーが同じファイルとみなす
基準と同じです。同じファイルを二度添付するのは指示ではなく、うっかりです。

## API リファレンス

### プロパティ

| プロパティ    | 属性        | 型                      | 既定値  | 説明                                                              |
| ------------- | ----------- | ----------------------- | ------- | ----------------------------------------------------------------- |
| `accept`      | `accept`    | `string`                | `''`    | カンマ区切りの種類または拡張子。`<input accept>` が取る形式です。 |
| `maxSize`     | `max-size`  | `number`                | `10 MB` | 受け付ける最大のファイルサイズ（バイト）。                        |
| `maxCount`    | `max-count` | `number`                | —       | 同時に添えられるファイルの最大数。未設定なら無制限。              |
| `attachments` | —           | `readonly Attachment[]` | `[]`    | 添える予定のファイル。届いた順です。                              |
| `files`       | —           | `File[]`                | `[]`    | ファイルだけ。リクエストの本文を組み立てるためのもの。            |
| `sheet`       | `sheet`     | `string`                | `''`    | shadow root に注入する CSS。                                      |

`attachments` と `files` は読み取り専用のビューです。ファイルは `add()` から加えてください。

### メソッド

| メソッド     | 戻り値         | 説明                                                          |
| ------------ | -------------- | ------------------------------------------------------------- |
| `add(files)` | `Attachment[]` | `File` の反復可能なものを加え、受け入れられたものを返します。 |
| `detach(id)` | `boolean`      | id で添付を一つ取り除きます。その id がなければ `false`。     |
| `clear()`    | `void`         | すべて取り除き、そのオブジェクト URL を破棄します。           |

::: tip `remove(id)` ではなく `detach(id)` です
どの要素にも、引数を取らず自分自身を文書から取り除く `remove()` がすでにあります。それを違う意味で
覆い隠すのは、標準のメソッドに手を伸ばした人にとって罠です。
:::

### イベント

| イベント             | detail             | 派発                 | 説明                                                                                                     |
| -------------------- | ------------------ | -------------------- | -------------------------------------------------------------------------------------------------------- |
| `attachmentschange`  | `{ attachments }`  | バブリング、composed | 添える予定の一覧が変わった。                                                                             |
| `attachmentrejected` | `{ file, reason }` | バブリング、composed | ファイルが拒否された。`reason` は `too-large`、`type-not-accepted`、`too-many`、`duplicate` のいずれか。 |

### 型

```ts
interface Attachment {
  id: string; // この添付が生きているあいだ変わりません
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string | null; // 画像ならオブジェクト URL、それ以外は null
}

type AttachmentRejection = 'too-large' | 'type-not-accepted' | 'too-many' | 'duplicate';
```

### Part

`list` · `attachment` · `thumb` · `icon` · `name` · `size` · `remove`

## プレビューの仕組み

プレビューは **data URL ではなくオブジェクト URL** です。プレビューの費用は、ブラウザがすでに持って
いるバイト列への参照ひとつ。10 MB の写真を base64 の文字列に読み込んで 40px のサムネイルを見せれば、
その文字列ぶんを払うことになります。data URL は必要なとき、送る側で一度だけ作ってください。

この要素は自分が作った URL をすべて自分で破棄します。取り外したとき、まとめて消したとき、そして
接続が切れたときに。`previewUrl` を添付の寿命より長く持ち続けないでください。

## アクセシビリティ

サムネイルの代替テキストは「画像」ではなく**ファイル名**です。四つの添付がすべて「画像」と読み上げ
られても、どれがどれかは読み手に何も伝わりません。取り除くボタンにも同じ理由でファイル名が付きます。

## スタイリング

`<r-attachments>` は自前の **CSS カスタムプロパティを 17 個**、そしてテーマから読むセマンティック
トークンを公開しています。継承が届く場所ならどこにでも設定できます（`:root`、外側のコンテナ、要素）。

```css
r-attachments {
  --ran-attachment-background: var(--ran-color-bg-subtle);
}
```

Part：`attachment` · `icon` · `list` · `name` · `remove` · `size` · `thumb`

一覧は[スタイルトークン](/ja/src/ranui/style-tokens#attachments)に、どのトークンを選ぶかは[デザインシステム](/ja/src/ranui/design-system/)にあります。

## ベストプラクティス

- **サーバー側でも検証してください。** `accept` と `max-size` は添付する人への気配りであって、
  セキュリティの境界ではありません。
- **送信が成功したあとに消す**、前ではなく。リクエストが失敗したときは、やり直せるようにファイルを
  そのまま残しておくべきです。
- **拒否は必ず説明する。** この帯が黙ってファイルを落とさないために、あのイベントがあります。
