# setMime

MIME タイプの対応づけを設定または更新します。

## API

### setMime

#### 戻り値

| 引数                  | 説明                        | 型                    |
| --------------------- | --------------------------- | --------------------- |
| `Map<string, string>` | MIME タイプの対応づけの Map | `Map<string, string>` |

#### パラメーター

| パラメーター | 説明             | 型       | 既定値 |
| ------------ | ---------------- | -------- | ------ |
| `ext`        | ファイルの拡張子 | `string` | 必須   |
| `mimeType`   | MIME タイプ      | `string` | 必須   |

## 使用例

### 基本的な使い方

```js
import { setMime, getMime } from 'ranuts';

// 独自の MIME タイプを設定する
setMime('.myext', 'application/x-my-custom-type');

// MIME タイプを取得する
const mime = getMime('.myext');
console.log(mime); // 'application/x-my-custom-type'
```

### 既存の対応を更新する

```js
import { setMime, getMime } from 'ranuts';

// .js の MIME タイプを更新する
setMime('.js', 'application/javascript-custom');

const mime = getMime('script.js');
console.log(mime); // 'application/javascript-custom'
```

### 新しい種類を追加する

```js
import { setMime } from 'ranuts';

// 新しいファイル種別の対応を追加する
setMime('.xyz', 'application/x-xyz-format');
```

## 補足

1. **全体に効きます**：設定すると MIME タイプの対応づけ全体に効くので、`getMime` を使っているところすべてに影響します。
2. **上書きします**：その拡張子がすでにあれば、もとの MIME タイプを上書きします。
3. **戻り値**：MIME タイプの Map 全体を返すので、そのまま操作を続けられます。
4. **使いどころ**：独自のファイル種別に MIME タイプを足すのによく使われます。

## MimeType

`getMime`、`setMime`、`getExtensions` がいずれも読み書きしている、土台の `Map<string, string>` です。ひとつ引くのではなく、既知の拡張子と種類の組をすべて並べたいときは、これを直接インポートしてください。

```js
import { MimeType } from 'ranuts/utils';

MimeType.get('.pdf'); // 'application/pdf'
MimeType.size; // 既知の拡張子の総数
[...MimeType.entries()].filter(([, type]) => type.startsWith('image/'));
```

`setMime` が書き換えるのと同じ `Map` のインスタンスなので、`setMime` を通した変更はここにすぐ現れますし、その逆も同じです。直接書き換えても構いません。`setMime` は、よくある使い方に名前を付けた入り口にすぎません。
