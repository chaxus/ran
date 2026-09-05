# checkEncoding

Uint8Array のデータの文字エンコーディングを判別します。

## API

### checkEncoding

#### 戻り値

| 引数 | 説明 | 型 |
| -------- | ---------------------- | -------- |
| `string` | 判別されたエンコーディング | `string` |

#### パラメーター

| パラメーター | 説明 | 型 | 既定値 |
| ------------ | -------------- | ------------ | -------- |
| `uint8Array` | 判別するデータ | `Uint8Array` | 必須 |

## 使用例

### 基本的な使い方

```js
import { checkEncoding } from 'ranuts';

const data = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
const encoding = checkEncoding(data);
console.log(encoding); // 'UTF-8' など、判別されたエンコーディング
```

### ファイルのエンコーディングを判別する

```js
import { checkEncoding } from 'ranuts';

async function detectFileEncoding(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const encoding = checkEncoding(uint8Array);
  return encoding;
}
```

### テキストのデコード

```js
import { checkEncoding } from 'ranuts';

function decodeText(uint8Array) {
  const encoding = checkEncoding(uint8Array);
  const decoder = new TextDecoder(encoding);
  return decoder.decode(uint8Array);
}
```

## 補足

1. **依存**：エンコーディングの判別に `jschardet` ライブラリを使います。
2. **既定のエンコーディング**：判別に失敗したときは `'utf-8'` になります。
3. **正確さ**：エンコーディングの判別は 100% 正確ではありません。とくに短い文章では外れやすくなります。
4. **使いどころ**：ファイルの処理、テキストのデコード、文字コードの変換などでよく使われます。
