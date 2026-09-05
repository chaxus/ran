# querystring

オブジェクトを URL のクエリ文字列に変換します。

## API

### querystring

#### 戻り値

| 引数 | 説明 | 型 |
| -------- | ---------------- | -------- |
| `string` | URL のクエリ文字列 | `string` |

#### パラメーター

| パラメーター | 説明 | 型 | 既定値 |
| --------- | ----------------- | -------- | ------- |
| `data` | 変換するオブジェクト | `Object` | `{}` |

## 使用例

### 基本的な使い方

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: 30,
  city: 'New York',
};

const query = querystring(params);
console.log(query); // 'name=John&age=30&city=New%20York'
```

### URL を組み立てる

```js
import { querystring } from 'ranuts';

const baseUrl = 'https://api.example.com/users';
const params = {
  page: 1,
  limit: 10,
  sort: 'name',
};

const url = `${baseUrl}?${querystring(params)}`;
console.log(url);
// 'https://api.example.com/users?page=1&limit=10&sort=name'
```

### 特殊文字の扱い

```js
import { querystring } from 'ranuts';

const params = {
  search: 'hello world',
  category: 'web development',
};

const query = querystring(params);
console.log(query); // 'search=hello%20world&category=web%20development'
```

### undefined と null は取り除かれる

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: undefined,
  city: null,
  active: true,
};

const query = querystring(params);
console.log(query); // 'name=John&active=true'
// 値が undefined や null のものは取り除かれます
```

## 補足

1. **URL エンコード**：値は自動で URL エンコードされます。
2. **空の値の除去**：値が `undefined` や `null` のものは自動で取り除かれ、クエリ文字列には現れません。
3. **オブジェクトであること**：オブジェクト以外を渡すと `TypeError` が投げられます。
4. **エンコードの前処理**：キーも値も、エンコードの前に `decodeURIComponent` を通します。
