# readFileAs*

`FileReader` を Promise で包んだものです。

| 関数                              | 解決される値  | 用途                                                   |
| --------------------------------- | ------------- | ------------------------------------------------------ |
| `readFileAsArrayBuffer(blob)`     | `ArrayBuffer` | バイナリの処理                                         |
| `readFileAsUint8Array(blob)`      | `Uint8Array`  | `checkEncoding` / `arrayBufferToString` に渡す         |
| `readFileAsText(blob, encoding?)` | `string`      | テキストファイル。エンコーディングが不明ならまず判別を |
| `readFileAsDataURL(blob)`         | `string`      | 画像のプレビュー                                       |

## 使用例

```js
import { readFileAsUint8Array, arrayBufferToString } from 'ranuts';

input.addEventListener('change', async (e) => {
  const bytes = await readFileAsUint8Array(e.target.files[0]);
  const text = arrayBufferToString(bytes); // エンコーディングは自動判別。GBK / Big5 も含みます
});
```

## 補足

1. **3 つの出口をすべて配線しています**：`onload`、`onerror`、`onabort` です。`onabort` を忘れるのが、利用者がファイル選択を取り消したときに Promise を永遠に未解決のまま残す古典的な手口です。
2. **`FileReader` が存在しないところでは、はっきりしたエラーで reject します**（Node や一部のワーカーの文脈）。
3. **出どころの分からないファイルに `new TextDecoder().decode()` を使わないこと**：UTF-8 だと決めつけることになり、GBK / Big5 が文字化けします。まず判別する `arrayBufferToString` を使ってください。
