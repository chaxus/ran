# WebDB

IndexedDB を Promise で包んだものです。素の IndexedDB はイベントのコールバックとトランザクションを土台にしており、読み書きのたびに 5 つの段（開く → トランザクション → objectStore → 要求 → `onsuccess`/`onerror`）を踏みます。`WebDB` はそれを `await db.add({ storeName, data })` のひと言にまとめます。

## API

### new WebDB(options)

| パラメーター | 説明                                                              | 型                 | 既定値 |
| ------------ | ----------------------------------------------------------------- | ------------------ | ------ |
| `dbName`     | データベースの名前                                                | `string`           | 必須   |
| `version`    | スキーマのバージョン。`stores` を変えたら必ず上げてください       | `number`           | `1`    |
| `stores`     | オブジェクトストアと索引の宣言。アップグレードのときに作られます  | `IDBStoreSchema[]` | `[]`   |
| `upgrade`    | スキーマでは表せない移行のための逃げ道。`stores` のあとに走ります | `Function`         | —      |

どのメソッドも同じ `IDBResult` の形で解決または reject するので、呼ぶ側は `error` だけを見れば済みます。

| メソッド                                             | 説明                                     |
| ---------------------------------------------------- | ---------------------------------------- |
| `openDataBase()`                                     | 開きます（必要ならアップグレードも）     |
| `closeDataBase()`                                    | 閉じて、持っていた参照を手放します       |
| `refreshDatabase()`                                  | 閉じてから開き直します                   |
| `deleteDatabase()`                                   | データベースを削除します                 |
| `add({ storeName, data })`                           | 挿入します。キーがすでにあれば失敗します |
| `update({ storeName, data })`                        | put です。挿入するか、上書きします       |
| `readByKey({ storeName, key })`                      | レコードをひとつ読みます                 |
| `readAll({ storeName, query?, count? })`             | すべてのレコードを読みます               |
| `readByCursor({ storeName, keyRange?, direction? })` | カーソルでたどります                     |
| `count({ storeName, query? })`                       | レコードを数えます                       |
| `delete({ storeName, key })`                         | レコードをひとつ削除します               |
| `clear({ storeName })`                               | ストアを空にします                       |

### `db.collection<T>(name)`

ひとつのストアに対する、型の付いた、寛容な取っ手です。ストアの名前を一度結び付けておき、`IDBResult` ではなく素の値を返します。

| メンバー      | 戻り値               | 失敗したとき |
| ------------- | -------------------- | ------------ |
| `get(key)`    | `Promise<T \| null>` | `null`       |
| `all()`       | `Promise<T[]>`       | `[]`         |
| `count()`     | `Promise<number>`    | `0`          |
| `add(value)`  | `Promise<boolean>`   | `false`      |
| `put(value)`  | `Promise<boolean>`   | `false`      |
| `remove(key)` | `Promise<boolean>`   | `false`      |
| `clear()`     | `Promise<boolean>`   | `false`      |

```js
const notes = db.collection('books_notes');
await notes.put(note); // 失敗すれば false
const all = await notes.all(); // 失敗すれば []
```

::: warning 適した層を選んでください
どのメソッドも **エラーを飲み込みます**。IndexedDB に置かれるものの大半（読んだところ、下書き、キャッシュ）にとっては、これが正しい既定です。読み取りに失敗したら、その機能が控えめになるだけで済むべきで、画面ごと落ちてはいけません。けれども、その書き込み _そのもの_ が利用者の行為であるとき（文書の保存、買い物の完了）には、これは誤った既定です。その場合は上の `IDBResult` を返すメソッドを呼び、失敗に向き合ってください。
:::

## 使用例

```js
import { WebDB } from 'ranuts';

const db = new WebDB({
  dbName: 'read',
  version: 4,
  stores: [
    { name: 'books', options: { keyPath: 'id' }, indexes: [{ name: 'byAuthor', keyPath: 'author' }] },
    { name: 'notes', options: { keyPath: 'id' } },
  ],
});

await db.openDataBase();
await db.add({ storeName: 'books', data: { id: '1', title: 'Walden' } });
const { data } = await db.readByKey({ storeName: 'books', key: '1' });
```

## 補足

1. **ストアはアップグレードのトランザクションの中でしか作れません。** データベースを開いたあとに作るのではなく、あらかじめ宣言しておくのはそのためです。足りないストアや索引を作る処理は何度走らせても同じ結果になるので、バージョンをまたいで同じ `stores` の配列を持ち続けても大丈夫です。
2. **バージョンの下げは自分で直します。** ディスク上のものより低いバージョンで開こうとすると `VersionError` が投げられますが、`WebDB` はそこから本当のバージョンを読み取り、揃え直して開き直します。エラーを表に出しません。
3. **この接続がアップグレードを塞ぐことはありません。** 開くたびに `onversionchange` を登録しているので、別のタブや Worker がより高いバージョンを求めたとき、この接続は自分から閉じます。
4. **`singleFlight` と組み合わせてください。** そうすれば同時に呼んだ側がひとつの「開く」を共有できます。`const ready = singleFlight(() => db.openDataBase())` のように書きます。
