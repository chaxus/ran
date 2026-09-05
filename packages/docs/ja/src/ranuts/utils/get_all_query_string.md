# getAllQueryString

URL からクエリパラメーターをすべて取り出し、オブジェクトにします。

## API

### getAllQueryString

#### 戻り値

| 引数     | 説明                             | 型                       |
| -------- | -------------------------------- | ------------------------ |
| `Object` | クエリパラメーターのオブジェクト | `Record<string, string>` |

#### パラメーター

| パラメーター | 説明                                           | 型       | 既定値 |
| ------------ | ---------------------------------------------- | -------- | ------ |
| `url`        | 解析する URL（任意。既定はいまのページの URL） | `string` | 任意   |

## 使用例

### 基本的な使い方

```js
import { getAllQueryString } from 'ranuts';

// いまの URL が https://example.com?name=John&age=30 だとします
const params = getAllQueryString();
console.log(params); // { name: 'John', age: '30' }
```

### 指定した URL を解析する

```js
import { getAllQueryString } from 'ranuts';

const url = 'https://example.com?page=1&limit=10&sort=name';
const params = getAllQueryString(url);
console.log(params); // { page: '1', limit: '10', sort: 'name' }
```

### 特定のパラメーターを取り出す

```js
import { getAllQueryString } from 'ranuts';

const params = getAllQueryString();
const page = params.page || '1';
const limit = params.limit || '10';
console.log(`ページ: ${page}, 件数: ${limit}`);
```

### エンコードされたパラメーターの扱い

```js
import { getAllQueryString } from 'ranuts';

// URL: https://example.com?search=hello%20world
const params = getAllQueryString();
console.log(params.search); // 'hello world'（自動でデコードされます）
```

## 補足

1. **値を書かないフラグも残ります。** `?embed` も `?embed=` も、どちらも `{ embed: '' }` になります。0.3 より前は値のないパラメーターを落としていたので、真偽値フラグのふつうの書き方である `?readonly` や `?embed` が、パラメーターがない場合と見分けられませんでした。この種のフラグは [`queryFlag`](/ja/src/ranuts/utils/query_flag) で読んでください。

2. **フラグメントが最後の値に紛れ込むことはありません。** `?lang=en#section` は `{ lang: 'en' }` になります。

3. **分割するのは最初の `=` だけ**なので、値の中に `=` があっても構いません。`?next=/a?b=1` は `{ next: '/a?b=1' }` になります。

4. **URL のデコード**：キーも値もパーセントデコードされ、`+` は空白になります。`URLSearchParams` と同じふるまいです。`%zz` のような壊れたエスケープは、パラメーターごと落とさずにそのまま残します。ひとつの悪い値がほかを覆い隠さないようにするためです。

5. **サーバー側の環境**：`window` がなく `url` も渡されなければ `{}` を返します。URL を渡せば、ビルド時のスクリプトでも使えます。

6. **既定の URL**：`url` を渡さなければ `window.location.href` を使います。

7. **同じ名前のパラメーター**：最後の値だけが残ります。
