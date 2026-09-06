# createObjectURL

Blob、ArrayBuffer、Response からオブジェクト URL を作ります。

## API

### createObjectURL

#### 戻り値

| 引数 | 説明 | 型 |
| ----------------- | ----------------------------------- | --------- |
| `Promise<string>` | オブジェクト URL で解決される Promise | `Promise` |

#### パラメーター

| パラメーター | 説明 | 型 | 既定値 |
| --------- | ----------- | ------------------------------------------- | -------- |
| `src` | データの元 | `Blob \| ArrayBuffer \| Response \| string` | 必須 |

## 使用例

### 基本的な使い方（Blob）

```js
import { createObjectURL } from 'ranuts';

const blob = new Blob(['Hello World'], { type: 'text/plain' });
const url = await createObjectURL(blob);
console.log(url); // 'blob:http://example.com/...'
```

### ArrayBuffer から作る

```js
import { createObjectURL } from 'ranuts';

const buffer = new ArrayBuffer(8);
const url = await createObjectURL(buffer);
console.log(url); // 'blob:http://example.com/...'
```

### Response から作る

```js
import { createObjectURL } from 'ranuts';

const response = await fetch('https://example.com/image.jpg');
const url = await createObjectURL(response);
console.log(url); // 'blob:http://example.com/...'
```

### 文字列の扱い

```js
import { createObjectURL } from 'ranuts';

// 文字列を渡すと、そのまま返します
const url = await createObjectURL('https://example.com/image.jpg');
console.log(url); // 'https://example.com/image.jpg'
```

### 画像のプレビュー

```js
import { createObjectURL } from 'ranuts';

async function previewImage(file) {
  const url = await createObjectURL(file);
  document.getElementById('preview').src = url;
}
```

## 補足

1. **非同期の処理**：Promise を返すので、`await` か `.then()` で扱ってください。
2. **対応する型**：Blob、ArrayBuffer、Response、文字列に対応します。
3. **メモリーの管理**：作った URL は、`URL.revokeObjectURL()` を自分で呼んで解放する必要があります。
4. **使いどころ**：ファイルのプレビュー、一時的な URL の生成、画像の処理などでよく使われます。

## requestUrlToBuffer

`XMLHttpRequest` を使って、URL の中身を生のバイト列として取ってきます。そのバイト列はたいてい上の `createObjectURL` へ渡します。表示できる URL に変える前に中身を調べたり加工したりしたいとき（マジックナンバーの確認、音声のデコードなど）に使います。

```js
import { requestUrlToBuffer, createObjectURL } from 'ranuts/utils';

const result = await requestUrlToBuffer('/assets/clip.webm', {});
if (result.success) {
  const url = await createObjectURL(new Blob([result.data]));
  video.src = url;
}
```

#### パラメーター

| パラメーター | 説明 | 型 | 既定値 |
| --------- | ----------------------------------------------------------------------- | ---------------------------------------- | -------- |
| `src` | 取ってくる URL | `string` | 必須 |
| `options` | `method`（既定は `'GET'`）と `responseType`（既定は `'arraybuffer'`） | `Partial<RequestUrlToArraybufferOption>` | 必須 |

#### 戻り値

HTTP 200 のときは `{ success: true, data, message: '' }` で解決され、そうでなければ `{ success: false, data: status, message }` で **reject される** `Promise` です。失敗したリクエストは reject であって、`success: false` で解決されるわけではありません。ですから `.catch()` を付けずに `.then()` だけを書くと、拾われなかった reject として表に出ます。

::: tip 新しく書くなら `fetch` を
これは `fetch` がどこでも使えるようになる前からあるもので、中では `XMLHttpRequest` を使っています。XHR でなければならない理由（アップロードの進捗イベント、`abort()`）が特にないなら、`fetch(url).then(r =>
r.arrayBuffer())` が同じ仕事を、Promise 本来の reject の形でこなします。
:::
