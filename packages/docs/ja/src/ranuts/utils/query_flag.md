# queryFlag / isInIframe

URL の真偽値フラグを読み取り、そのページが埋め込まれているかを判定します。`?embed`、`?readonly`、`?debug` の裏にある、ふたつの確認です。

## API

| 関数                   | 説明                                                           |
| ---------------------- | -------------------------------------------------------------- |
| `queryFlag(key, url?)` | クエリパラメーターが真と読めるかどうか                         |
| `isInIframe()`         | このページが iframe の中で動いているかどうか。SSR では `false` |

### `queryFlag`

| パラメーター | 説明                           | 型       | 既定値          |
| ------------ | ------------------------------ | -------- | --------------- |
| `key`        | パラメーターの名前             | `string` | 必須            |
| `url`        | 完全な URL、またはクエリ文字列 | `string` | いまの location |

`?k`、`?k=`、`?k=1`、`?k=true` は真です（大文字小文字は問いません）。それ以外はすべて偽で、パラメーターがない場合や、はっきり `?k=false` と書かれている場合も偽です。

## 使用例

### フラグを読む

```js
import { queryFlag } from 'ranuts';

queryFlag('embed', '?embed'); // true  ← いちばんよくある書き方
queryFlag('embed', '?embed=1'); // true
queryFlag('embed', '?embed=true'); // true
queryFlag('embed', '?embed=false'); // false
queryFlag('embed', '?lang=en'); // false
```

### 埋め込みかどうかを見分ける

```js
import { queryFlag, isInIframe } from 'ranuts';

// フレームに入っているとき、または受け入れ側がはっきりそう指定したときは埋め込みとみなします。
const embedded = isInIframe() || queryFlag('embed') || queryFlag('embedded');

if (embedded) {
  document.body.classList.add('embed-mode');
}
```

### 他人のページの中では計測を止める

```js
import { isInIframe } from 'ranuts';

// ここで計測すると、受け入れ側のサイトの訪問者を自分たちの数として数えてしまいます。
if (!isInIframe()) initAnalytics();
```

### 読み取り専用のプレビュー

```js
import { queryFlag } from 'ranuts';

openDocument(file, { readonly: queryFlag('readonly') });
```

## 補足

1. **値を書かないフラグがいちばんよくある形です。** `?embed` には値がないので `getQuery(url).embed` は `''`（偽と評価される値）になり、素直に真偽を見るだけの確認は、いちばんよくある形を黙って取りこぼします。`queryFlag` があるのはそのためです。

2. **`?k=false` は偽です。** 「書いてあるのだから有効」とはみなさず、はっきり書かれた否定をそのまま尊重します。

3. **`isInIframe` は守りを固めてあります。** `window.parent` を読むと、エンジンによってはオリジンをまたぐときに例外になります。読めない親は埋め込みとみなします。読めないということが、まさにそういう意味だからです。

4. **どちらも SSR で安全です。** `window` がなければ `isInIframe` は `false` になり、`queryFlag` も `url` を渡さないかぎり `false` です。URL を渡せば、ビルド時のスクリプトでもどちらも使えます。
