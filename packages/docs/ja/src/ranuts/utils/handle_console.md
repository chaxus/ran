# 計測用のフック

`console`、`fetch`、`XMLHttpRequest`、クリック、拾われなかったエラーに割り込みます。監視のバックエンド、デバッグ用のオーバーレイ、テストなどに使えます。

**どれも後片づけ用の関数を返します。受け取って、必ず呼んでください。** グローバルに手を入れたまま元へ戻す術がないと、テストは自分の後始末ができませんし、ホットリロードのたびにすでに手の入ったグローバルへさらに手を入れることになり、やがて 1 回の呼び出しが十重二十重のラッパーをくぐり、イベントが N 回も報告されるようになります。

## API

| Function                     | 差し込む先                              | 戻り値        |
| ---------------------------- | --------------------------------------- | ------------- |
| `handleConsole(hook)`        | `console.log/info/warn/error/assert`    | `restore`     |
| `handleFetchHook(options)`   | `window.fetch`                          | `restore`     |
| `handleXhrHook(options)`     | `XMLHttpRequest#open` / `#send`         | `restore`     |
| `handleError(hook)`          | `error` と `unhandledrejection`         | `unsubscribe` |
| `handleClick(hook)`          | document のクリック（キャプチャー段階） | `unsubscribe` |
| `replaceOld(obj, key, wrap)` | 任意のオブジェクトの任意のプロパティ    | `restore`     |

`handleFetchHook` と `handleXhrHook` は `{ requestHook, responseHook, errorHook }` を受け取ります。

## 使用例

```js
import { handleConsole, handleError, handleFetchHook } from 'ranuts';

const teardown = [
  handleConsole((type, ...args) => send({ type, args })),
  handleError((error) => send({ type: 'error', error: String(error) })),
  handleFetchHook({ errorHook: (url, error) => send({ type: 'fetchError', url }) }),
];

// 後片づけのとき（HMR、ルートの切り替え、テストの後始末）
teardown.forEach((off) => off());
```

## 補足

1. **もとのふるまいはそのまま残ります。** レスポンスは素通りし、エラーは投げ直され、コンソールの出力も変わらず表示されます。
2. **`replaceOld` の restore は、自分が当てた手だけを戻します。** そのあと別の層が上から手を入れていた場合、何も考えずに戻せばその層を黙って取り外すことになるので、代わりに戻すのをやめます。
3. **`handleXhrHook` はプロトタイプに手を入れます。** ですからすべてのインスタンスに効きます。リスナーは `{ once: true }` で登録されるので、XHR オブジェクトを使い回してもリスナーが積み上がることはありません。
4. **コンソールの出力を、コンソールへ書くバックエンドに報告してはいけません。** そのフックは、自分が生んだ呼び出しそのもので発火します。（`Monitor` の `console` チャンネルが既定で切ってあるのは、このためです。）

::: warning 0.3 で変わりました
かつてはどれも `void` を返すだけで、取り外す手立てがありませんでした。いまは後片づけ用の関数を返します。既存の呼び出し側はそのまま動きますし、使い始めるだけで済みます。
:::
