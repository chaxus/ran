# appendUrl

クエリパラメーターのオブジェクトを URL の末尾に付け足します。

## API

### appendUrl

#### 戻り値

| 引数     | 説明                           | 型       |
| -------- | ------------------------------ | -------- |
| `string` | パラメーターが付いた完全な URL | `string` |

#### パラメーター

| パラメーター | 説明                             | 型                       | 既定値 |
| ------------ | -------------------------------- | ------------------------ | ------ |
| `url`        | もとになる URL                   | `string`                 | 必須   |
| `params`     | クエリパラメーターのオブジェクト | `Record<string, string>` | `{}`   |

## 使用例

### 基本的な使い方

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', limit: '10' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?page=1&limit=10'
```

### すでにクエリパラメーターがある URL

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com?sort=name';
const params = { page: '1' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?sort=name&page=1'
```

### プロトコル相対 URL の扱い

```js
import { appendUrl } from 'ranuts';

// // で始まる URL には自動で https:// が付きます
const url = '//example.com';
const params = { id: '123' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?id=123'
```

### 空の値は取り除かれる

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', empty: '' };
const fullUrl = appendUrl(url, params);
// 値が空文字列のものは取り除かれます
console.log(fullUrl); // 'https://example.com?page=1'
```

## 補足

1. **プロトコルの扱い**：URL が `//` で始まっていれば、自動で `https://` を付けます。

2. **パラメーターの併合**：URL にすでにクエリパラメーターがあれば、新しいものを後ろに足します。

3. **空の値の除去**：値が空文字列のパラメーターは取り除かれ、URL には入りません。

4. **URL エンコード**：パラメーターの値は自動で URL エンコードされます。

5. **上書き**：同じ名前のパラメーターがあれば、新しい値で上書きされます（URLSearchParams のふるまいに従います）。
