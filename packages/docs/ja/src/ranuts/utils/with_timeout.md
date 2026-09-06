# withTimeout / deferred

JavaScript が用意していない Promise の道具です。外から決着させられる Promise と、上限つきの待ちです。

## API

| 関数 | 説明 |
| -------------------------------------------------------- | -------------------------------------------------------- |
| `deferred<T>()` | `{ promise, resolve, reject }`。外から決着させられます |
| `withTimeout(promise, ms, options?)` | `ms` 以内に決着しなければ `TimeoutError` で reject します |
| `withTimeoutFallback(promise, ms, fallback, onTimeout?)` | reject する代わりに `fallback` で resolve します |
| `delay(ms)` | `ms` 後に resolve します |
| `TimeoutError` | `withTimeout` が投げるエラーのクラス |

### `withTimeout` options

| オプション | 説明 | 既定値 |
| ----------- | ----------------------------------------------------------- | ---------------------------------- |
| `message` | エラーのメッセージ | `operation timed out after {ms}ms` |
| `onTimeout` | 期限を過ぎたときに呼ばれます。処理を後片づけするためのものです | — |

## 使用例

### リクエストに上限を設け、時間切れで中断する

```js
import { withTimeout } from 'ranuts';

const controller = new AbortController();
const res = await withTimeout(fetch(url, { signal: controller.signal }), 5000, {
  message: 'fetch timed out',
  onTimeout: () => controller.abort(),
});
```

### 失敗させずに、控えめな結果で済ませる

```js
import { withTimeoutFallback } from 'ranuts';

// 保存が遅いときは、流れを断ち切らず、もとのファイルを返します。
const file = await withTimeoutFallback(editor.requestSave(), 60_000, originalFile);
```

### コールバックから Promise を決着させる

```js
import { deferred } from 'ranuts';

const ready = deferred();
sdk.onReady((editor) => ready.resolve(editor));
sdk.onError((error) => ready.reject(error));

const editor = await ready.promise;
```

### 期限つきの処理を順番に並べる

```js
import { QuestQueue, withTimeout } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 1 });
await queue.add(() => withTimeout(recreateEditor(config), 30_000));
```

## 補足

1. **タイマーは必ず片づけます。** 処理のほうが先に終わって競争に勝った場合も同じです。よくある自作の書き方（`Promise.race([task, new Promise((_, r) => setTimeout(r, ms))])`）は、処理が先に終わるたびにタイマーを取り残します。Node ではそれが期限いっぱいプロセスを生かし続けますし、テストでは次のテストへ発火する迷子のタイマーが残ります。

2. **時間切れになっても、処理そのものは止まりません。** Promise は取り消せないからです。fetch を中断する、Worker を終わらせる、接続を閉じる。それをやる場所が `onTimeout` です。

3. **`withTimeoutFallback` が吸収するのは期限だけです。** 包んだ Promise が本当に reject したときは、そのまま外へ伝わります。時間切れはエラーではありませんが、エラーはやはりエラーです。

4. **`delay` は素の `setTimeout` を使う**ので、Node でも Web Worker でもブラウザーでも同じように動きます。`window.setTimeout` では文書の外で例外になります。

5. **`deferred` は外側の `let` より優れています。** executor の引数を外で宣言した変数へ代入するのがよくある代替手段ですが、TypeScript には代入済みだと証明できませんし、気づきにくい形で間違えやすいのです。
