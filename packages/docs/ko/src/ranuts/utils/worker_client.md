# WorkerClient

웹 워커 위에서 요청과 응답을 주고받습니다. 맨 워커에는 "메시지를 보낸다"와 "메시지를 받는다"밖에 없습니다. 일을 둘 한꺼번에 던지면 메시지도 둘 돌아오는데, 어느 것이 어느 것인지 가릴 길이 없지요. `WorkerClient`는 요청마다 id를 찍고, 각 응답을 그 요청의 프로미스로 돌려보냅니다.

## API

### new WorkerClient(options)

| 매개변수          | 설명                                                | 타입                | 기본값                    |
| ----------------- | --------------------------------------------------- | ------------------- | ------------------------- |
| `create`          | 워커를 어떻게 만들지                                | `() => Worker`      | 필수                      |
| `isProgress`      | 이것이 진행 상황 메시지인지(요청을 끝맺지 않습니다) | `(res) => boolean`  | `res.type === 'progress'` |
| `getProgress`     | 진행 상황의 알맹이를 꺼냅니다                       | `(res) => Progress` | `res.progress`            |
| `isError`         | 이것이 오류 메시지인지                              | `(res) => boolean`  | `res.type === 'error'`    |
| `getErrorMessage` | 오류 문구                                           | `(res) => string`   | `res.message`             |
| `timeout`         | 요청마다의 제한 시간(ms). 그 요청만 거부합니다      | `number`            | 없음                      |

| 멤버                                    | 설명                                         |
| --------------------------------------- | -------------------------------------------- |
| `send(request, onProgress?, transfer?)` | 요청을 하나 보내고 그 응답을 기다립니다      |
| `dispose()`                             | 워커를 끝내고 진행 중인 것을 모두 거부합니다 |
| `active`                                | 워커가 이미 만들어졌는지                     |
| `pendingCount`                          | 진행 중인 요청의 수                          |

### serveWorker(handler, options?) — 워커 쪽

워커 _안에서_ 도는 짝입니다. 요청마다 `operationId`를 읽어 내고, 여러분의 핸들러를 기다린 뒤, 같은 id를 실어 답을 돌려보냅니다.

| 매개변수             | 설명                                                                 | 타입       |
| -------------------- | -------------------------------------------------------------------- | ---------- |
| `handler`            | `(request, { progress }) => Response \| Promise<Response>`           | `Function` |
| `options.scope`      | 어디서 들을지. 기본은 `self`이며, 포트나 테스트에서는 바꿔 주세요    | object     |
| `options.resultType` | 핸들러가 객체가 아닌 것을 돌려줄 때 응답의 `type`. 기본은 `'result'` | `string`   |

리스너를 떼는 `stop` 함수를 돌려줍니다.

## 예시

```js
import { WorkerClient } from 'ranuts';

const client = new WorkerClient({
  create: () => new Worker(new URL('./nlp.worker.ts', import.meta.url), { type: 'module' }),
});

await client.send({ type: 'load', modelId }, (p) => renderProgress(p.progress));
const { scores } = await client.send({ type: 'classify', lines });
client.dispose();
```

그리고 워커 쪽:

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

## 참고

1. **워커는 첫 `send` 때 비로소 만들어집니다.** 무거운 일이 쪽을 불러오는 순간부터 시작돼서는 안 되니까요.
2. **진행 상황 메시지는 요청을 끝맺지 않습니다.** 그래서 한 요청이 갱신을 여러 번 흘려보내고도 마지막에 한 번만 이행할 수 있습니다.
3. **워커가 무너지면 진행 중인 요청이 전부 거부됩니다.** 워커 안에서 잡히지 않은 오류에는 `operationId`가 없어, 어느 요청의 것인지 가릴 수 없기 때문입니다.
4. **`dispose()`는 끝내고 거부합니다.** 다음 `send`가 워커를 다시 세웁니다.
5. **시간이 다하면 그 요청만 거부되고** 워커는 살아 있습니다.
6. **큰 버퍼에는 `transfer`를 쓰세요.** 구조화 복제로 사본을 뜨는 대신 소유권을 넘기기 위해서입니다.
7. **`serveWorker`는 동기로 던져진 예외도 잡습니다.** `onmessage` 안에서 동기로 던져진 예외는 워커의 오류 핸들러로 새어 나가는데, 그 길에는 `operationId`가 실리지 않습니다. 그러면 클라이언트는 정작 망가진 하나가 아니라 진행 중인 _모든_ 요청을 실패시킬 수밖에 없습니다.
8. **두 짝을 함께 내놓은 데는 까닭이 있습니다.** 워커 쪽을 손수 짜는 자리야말로 id를 되돌려 주는 방식과 오류를 감싸는 형식이 프로젝트마다 어긋나기 시작하는 곳입니다.
