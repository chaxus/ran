# encodeUrl

URL を安全にエンコードします。すでにエンコード済みの並びは避け、対にならないサロゲートペアも扱います。

## API

### encodeUrl

#### 戻り値

| 引数     | 説明               | 型       |
| -------- | ------------------ | -------- |
| `string` | エンコード後の URL | `string` |

#### パラメーター

| パラメーター | 説明               | 型       | 既定値 |
| ------------ | ------------------ | -------- | ------ |
| `url`        | エンコードする URL | `string` | 必須   |

## 使用例

### 基本的な使い方

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/path with spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### エンコード済みの URL の扱い

```js
import { encodeUrl } from 'ranuts';

// エンコード済みの部分は二重にエンコードされません
const url = 'https://example.com/path%20with%20spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### 特殊文字の扱い

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/search?q=hello world&lang=zh-CN';
const encoded = encodeUrl(url);
console.log(encoded); // エンコード後の URL
```

### 壊れたエンコードの扱い

```js
import { encodeUrl } from 'ranuts';

// 壊れたエンコードの並び（%foo など）はエンコードし直されます
const url = 'https://example.com/path%foo';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%25foo'
```

## 補足

1. **賢いエンコード**：エンコードされていない部分だけを対象にし、`%20` のようなエンコード済みの並びはそのまま残します。
2. **サロゲートペアの扱い**：対にならないサロゲートペアを自動で処理し、Unicode の置換文字に置き換えます。
3. **安全**：例外は投げず、できるかぎり正しくエンコードしようとします。
4. **使いどころ**：ユーザーが入力した URL の処理や、安全な URL の組み立てでよく使われます。
