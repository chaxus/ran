# transformText

ArrayBuffer をテキストに変換します。エンコーディングを自動で判別してデコードします。

## API

### transformText

#### 戻り値

| 引数 | 説明 | 型 |
| ---------------------------- | ------------------------------------- | ---------------------------- |
| `TransformText \| undefined` | 変換結果のオブジェクト、または undefined | `TransformText \| undefined` |

#### TransformText

| プロパティ | 説明 | 型 |
| ---------- | ----------------- | -------- |
| `encoding` | 判別されたエンコーディング | `string` |
| `content` | デコード後のテキスト | `string` |

#### パラメーター

| パラメーター | 説明 | 型 | 既定値 |
| --------- | ------------------ | ----------------------- | -------- |
| `content` | 変換する中身 | `string \| ArrayBuffer` | 必須 |

## 使用例

### 基本的な使い方

```js
import { transformText } from 'ranuts';

const arrayBuffer = new TextEncoder().encode('Hello World').buffer;
const result = transformText(arrayBuffer);
if (result) {
  console.log('エンコーディング:', result.encoding);
  console.log('中身:', result.content); // 'Hello World'
}
```

### ファイルを処理する

```js
import { transformText } from 'ranuts';

async function readTextFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = transformText(arrayBuffer);
  if (result) {
    return result.content;
  }
  return null;
}
```

### エンコーディングの自動判別

```js
import { transformText } from 'ranuts';

// エンコーディングを自動で判別してデコードする
const result = transformText(arrayBuffer);
if (result) {
  console.log(`${result.encoding} でデコードできました`);
  console.log(result.content);
}
```

## 補足

1. **自動で判別**：`jschardet` を使ってエンコーディングを自動で判別します。
2. **ArrayBuffer のみ**：いまのところ `ArrayBuffer` にしか対応しておらず、文字列を渡すと警告が出ます。
3. **結果が返る条件**：エンコーディングが判別でき、デコードに成功したときだけ結果を返します。そうでなければ `undefined` です。
4. **使いどころ**：ファイルの読み込み、テキストのデコード、エンコーディングの変換などでよく使われます。
