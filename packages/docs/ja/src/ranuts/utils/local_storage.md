# localStorage のヘルパー

例外を投げない localStorage への入り口と、そのうえに接頭辞つきの JSON の見え方を重ねたものです。

`localStorage` は SSR でただ存在しないだけではありません。Cookie を塞がれたサードパーティの iframe では _触れた_ 時点で例外になりますし、Safari のプライベートモードや容量の上限では _書き込み_ で例外になります。ここでは読み書きのすべてに守りを付けてあります。保存に失敗しても、せいぜい設定がひとつ効かなくなるだけで済むべきで、ページが壊れてはいけないからです。

## API

### localStorageSetItem

localStorage に値を書き込みます。

#### パラメーター

| パラメーター | 説明       | 型       | 既定値 |
| ------------ | ---------- | -------- | ------ |
| `name`       | キーの名前 | `string` | 必須   |
| `value`      | 値         | `string` | 必須   |

#### 戻り値

戻り値はありません（`void`）

### localStorageGetItem

localStorage から値を読み取ります。

#### パラメーター

| パラメーター | 説明       | 型       | 既定値 |
| ------------ | ---------- | -------- | ------ |
| `name`       | キーの名前 | `string` | 必須   |

#### 戻り値

| 引数     | 説明                                         | 型       |
| -------- | -------------------------------------------- | -------- |
| `string` | 保存されている値。なければ空文字列を返します | `string` |

### localStorageRemoveItem

キーを取り除きます。

| パラメーター | 説明       | 型       | 既定値 |
| ------------ | ---------- | -------- | ------ |
| `name`       | キーの名前 | `string` | 必須   |

### createStore(prefix?)

localStorage のうえに重ねた、接頭辞つきで JSON に直列化する見え方です。

#### 戻り値

| メソッド             | 説明                                                                       |
| -------------------- | -------------------------------------------------------------------------- |
| `get(key, fallback)` | 保存されている値。ないとき、使えないとき、壊れているときは `fallback`      |
| `set(key, value)`    | 直列化して保存します。何も書けなければ `false`                             |
| `remove(key)`        | そのキーを取り除きます                                                     |
| `keyOf(key)`         | 完全な保存用のキー（`prefix + key`）。`storage` イベントの購読に役立ちます |

## 使用例

### 基本的な使い方

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// 値を書き込む
localStorageSetItem('username', 'john');

// 値を読み取る
const username = localStorageGetItem('username');
console.log(username); // 'john'
```

### オブジェクトを保存する

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

const user = { name: 'John', age: 30 };
localStorageSetItem('user', JSON.stringify(user));

const storedUser = JSON.parse(localStorageGetItem('user'));
console.log(storedUser); // { name: 'John', age: 30 }
```

### サーバー側での安全性

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// サーバー側の環境でも例外にならず、黙って何もしません
localStorageSetItem('key', 'value'); // サーバー側では何も起きません
const value = localStorageGetItem('key'); // サーバー側では '' が返ります
```

### あるかどうかを確かめる

```js
import { localStorageGetItem } from 'ranuts';

const value = localStorageGetItem('myKey');
if (value) {
  console.log('値があります:', value);
} else {
  console.log('値がありません');
}
```

### 名前空間つきの JSON の保存

```js
import { createStore } from 'ranuts';

const history = createStore('agent_history_');

history.set('default', messages); // agent_history_default に書き込みます
const restored = history.get('default', []); // ないとき、壊れているときは []
history.remove('default');
```

### ひとつのオリジンに、いくつもの機能

```js
import { createStore } from 'ranuts';

// 接頭辞のおかげで、関係のない機能どうしがぶつかりません。
const keys = createStore('agent_api_key_');
const prefs = createStore('editor_prefs_');

keys.set('anthropic', token);
prefs.set('theme', 'dark');
```

## 補足

1. **ここにあるものは何も例外を投げません。** 保存先がない、サードパーティのフレームが塞がれている、プライベートモード、容量の上限。どれも静かに諦めるだけです。`localStorageGetItem` は `''` を返し、書き込む側は何もせず、`createStore().set()` は `false` を報せます。

2. **守りを固めるのは呼び出しのときであって、モジュールの読み込みのときではありません。** 保存先を探すのは呼び出しごとに行われるので、SSR のあとで水和する場面でも動きますし、テストで差し替えることもできます。

3. **`createStore` は中身を検証しません。** 保存されていたものが、そのまま `T` として返ります。バージョンをまたぐなら、自分で確かめてください。`fallback` が受け止めるのは、値がないことと解析に失敗したことだけです。古いバージョンのコードが書いた値が呼び出し側へ `SyntaxError` を投げることはありませんが、形が違うことはありえます。

4. **`set` が `false` を返すのは**、循環した構造、`BigInt`、そして書き込みが届かなかったときです。書いたあとに読み直して確かめています。

5. **型の制限**：素のヘルパーが扱えるのは文字列だけです。呼び出しのたびに `JSON.stringify` / `JSON.parse` と try/catch を自分で書くのではなく、`createStore` を使ってください。

6. **戻り値**：`localStorageGetItem` は、値がないときに `null` ではなく `''` を返します。
