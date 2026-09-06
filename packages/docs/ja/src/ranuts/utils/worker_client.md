# WorkerClient

Web Worker のうえで要求と応答をやりとりします。素の Worker にあるのは「メッセージを送る」「メッセージを受け取る」だけです。ふたつの仕事を同時に投げれば、ふたつのメッセージが返ってきますが、どちらがどちらのものか見分ける手立てがありません。`WorkerClient` はすべての要求に id を刻み、それぞれの応答をその要求自身の Promise へ送り届けます。

## API

### new WorkerClient(options)

| パラメーター      | 説明                                                       | 型                  | 既定値                    |
| ----------------- | ---------------------------------------------------------- | ------------------- | ------------------------- |
| `create`          | Worker をどう作るか                                        | `() => Worker`      | 必須                      |
| `isProgress`      | これは進捗のメッセージか（要求を決着させません）           | `(res) => boolean`  | `res.type === 'progress'` |
| `getProgress`     | 進捗の中身を取り出します                                   | `(res) => Progress` | `res.progress`            |
| `isError`         | これはエラーのメッセージか                                 | `(res) => boolean`  | `res.type === 'error'`    |
| `getErrorMessage` | エラーの文言                                               | `(res) => string`   | `res.message`             |
| `timeout`         | 要求ごとの制限時間（ミリ秒）。その要求だけを reject します | `number`            | なし                      |

| メンバー                                | 説明                                                  |
| --------------------------------------- | ----------------------------------------------------- |
| `send(request, onProgress?, transfer?)` | 要求をひとつ送り、その応答を待ちます                  |
| `dispose()`                             | Worker を終わらせ、処理中のものをすべて reject します |
| `active`                                | Worker がすでに作られているかどうか                   |
| `pendingCount`                          | 処理中の要求の数                                      |

### serveWorker(handler, options?) — Worker 側

Worker の _中で_ 走る、対になるほうです。それぞれの要求から `operationId` を読み取り、あなたのハンドラーを待って、同じ id を載せた返事を送り返します。

| パラメーター         | 説明                                                                             | 型         |
| -------------------- | -------------------------------------------------------------------------------- | ---------- |
| `handler`            | `(request, { progress }) => Response \| Promise<Response>`                       | `Function` |
| `options.scope`      | どこで待ち受けるか。既定は `self` です。ポートやテストのときは差し替えてください | object     |
| `options.resultType` | ハンドラーがオブジェクト以外を返したときの応答の `type`。既定は `'result'`       | `string`   |

リスナーを外す `stop` 関数を返します。

## 使用例

```js
import { WorkerClient } from 'ranuts';

const client = new WorkerClient({
  create: () => new Worker(new URL('./nlp.worker.ts', import.meta.url), { type: 'module' }),
});

await client.send({ type: 'load', modelId }, (p) => renderProgress(p.progress));
const { scores } = await client.send({ type: 'classify', lines });
client.dispose();
```

そして Worker 側：

```js
// nlp.worker.ts
import { serveWorker } from 'ranuts';

serveWorker(async (request, { progress }) => {
  if (request.type === 'load') {
    const device = await loadModel(request.modelId, (p) => progress(p));
    return { type: 'loaded', device };
  }
  return { type: 'result', scores: await classify(request.lines) };
});
```

## 補足

1. **Worker は必要になってから作られます。** 最初の `send` のときです。重たい仕事を、ページの読み込みと同時に始めるべきではありません。
2. **進捗のメッセージは要求を決着させません。** ですからひとつの要求が何度も更新を流しながら、最後に一度だけ解決できます。
3. **Worker が落ちると、処理中の要求はすべて reject されます。** Worker の中で拾われなかったエラーは `operationId` を持たないので、どの要求のものか結び付けられないからです。
4. **`dispose()` は終了させ、reject します。** 次に `send` を呼べば Worker は作り直されます。
5. **時間切れになるのはその要求だけで**、Worker は生きたままです。
6. **大きなバッファには `transfer` を使ってください。** 構造化複製で写しを作るのではなく、所有権を移すためです。
7. **`serveWorker` は同期的に投げられた例外も捕まえます。** `onmessage` の中で同期的に投げられた例外は Worker のエラーハンドラーへ抜けてしまい、その経路には `operationId` がありません。そうなるとクライアントは、実際に壊れたひとつではなく、処理中の _すべての_ 要求を失敗させるほかなくなります。
8. **ふたつでひと組にしてあるのは、そうする理由があるからです。** Worker 側を自作すると、id の返し方とエラーの包み方がプロジェクトごとにずれていく、まさにその場所になります。
