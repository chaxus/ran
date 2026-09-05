# QuestQueue

동시 실행 수에 상한을 둔 비동기 작업 대기열입니다. 한꺼번에 도는 것은 많아야 `simultaneous`개이고 나머지는 기다리며, 하나가 끝날 때마다 빈자리가 채워집니다. 한 번에 다 던질 수 없는 일 — 묶음 업로드나 묶음 요청 — 에 쓰세요.

## API

### new QuestQueue({ simultaneous })

| 매개변수       | 설명                                   | 타입     | 기본값 |
| -------------- | -------------------------------------- | -------- | ------ |
| `simultaneous` | 최대 동시 실행 수. `<= 0`은 1로 봅니다 | `number` | `1`    |

| 멤버                                        | 설명                                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| `add(task)`                                 | 작업을 넣고 **그 작업만의** 결과 Promise를 받습니다. 자리가 나면 시작합니다 |
| `allSettled(tasks)`                         | 묶음으로 넣습니다. `Promise.allSettled`처럼 넣은 순서대로 이행됩니다        |
| `onIdle()`                                  | 대기열이 빌 때까지 기다립니다                                               |
| `clear()`                                   | 아직 시작하지 않은 것을 모두 버립니다(도는 작업은 그대로)                   |
| `running` / `pending` / `executed` / `idle` | 실시간 계수기                                                               |

## 예시

```js
import { QuestQueue } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 3 });
const results = await Promise.all(urls.map((url) => queue.add(() => fetch(url))));

// 아니면 던져 두고, 실패까지 아울러 전부를 기다립니다
urls.forEach((url) => queue.add(() => fetch(url)).catch(report));
await queue.onIdle();
```

## 참고

1. **선입선출**: 작업은 넣은 순서대로 돕니다.
2. **하나가 실패해도 대기열은 멎지 않습니다.** 작업마다 제 Promise만 거부하고, 다음 작업은 그대로 시작합니다.
3. **동기로 예외를 던지는 작업도 잡습니다.** 그래서 `add()` 밖으로 새어 나가 동시 실행 계수기를 붙들어 두는 일이 없습니다.
4. **`allSettled`는 넣은 순서를 지키며** 각 결과를 따로 알려 줍니다.

::: warning 0.3에서 다시 썼습니다
예전 구현은 쓸 수 없는 물건이었습니다. `add()`는 넣기만 했고(돌리려면 `running()`을 손수 불러야 했지요), 꺼낼 때는 후입선출이었으며, 하나의 Promise가 상관없는 작업의 결과까지 실어 날랐고, `allSettled`는 결과를 첨자 1부터 적으면서 첫 작업에서 이행해 버렸습니다. 생성자의 `total` 옵션은 없어졌습니다. 대신 `onIdle()`이나 `allSettled(tasks)`를 쓰세요.
:::
