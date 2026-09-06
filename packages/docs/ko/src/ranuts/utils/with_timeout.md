# withTimeout / deferred

자바스크립트가 갖추지 않은 프로미스 부품입니다. 밖에서 결말을 지어 주는 프로미스와, 한도를 둔 기다림.

## API

| 함수 | 설명 |
| -------------------------------------------------------- | -------------------------------------------------------- |
| `deferred<T>()` | `{ promise, resolve, reject }`. 밖에서 결말을 지을 수 있습니다 |
| `withTimeout(promise, ms, options?)` | `ms` 안에 결말이 나지 않으면 `TimeoutError`로 거부합니다 |
| `withTimeoutFallback(promise, ms, fallback, onTimeout?)` | 거부하는 대신 `fallback`으로 이행합니다 |
| `delay(ms)` | `ms` 뒤에 이행합니다 |
| `TimeoutError` | `withTimeout`이 던지는 오류 클래스 |

### `withTimeout` options

| 옵션 | 설명 | 기본값 |
| ----------- | ----------------------------------------------------------- | ---------------------------------- |
| `message` | 오류 메시지 | `operation timed out after {ms}ms` |
| `onTimeout` | 기한이 지날 때 불립니다. 하던 일을 거두기 위한 자리입니다 | — |

## 예시

### 요청에 한도를 두고, 시간이 다하면 끊기

```js
import { withTimeout } from 'ranuts';

const controller = new AbortController();
const res = await withTimeout(fetch(url, { signal: controller.signal }), 5000, {
  message: 'fetch timed out',
  onTimeout: () => controller.abort(),
});
```

### 실패시키는 대신 눈높이를 낮추기

```js
import { withTimeoutFallback } from 'ranuts';

// 저장이 더디면 흐름을 끊는 대신 원래 파일을 돌려줍니다.
const file = await withTimeoutFallback(editor.requestSave(), 60_000, originalFile);
```

### 콜백에서 프로미스의 결말 짓기

```js
import { deferred } from 'ranuts';

const ready = deferred();
sdk.onReady((editor) => ready.resolve(editor));
sdk.onError((error) => ready.reject(error));

const editor = await ready.promise;
```

### 기한을 둔 작업을 차례로 세우기

```js
import { QuestQueue, withTimeout } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 1 });
await queue.add(() => withTimeout(recreateEditor(config), 30_000));
```

## 참고

1. **타이머는 언제나 치웁니다.** 일 쪽이 경주에서 이겼을 때도 마찬가지입니다. 흔히 손수 짜는 꼴(`Promise.race([task, new Promise((_, r) => setTimeout(r, ms))])`)은 일이 먼저 끝날 때마다 타이머를 흘립니다. Node에서는 그것이 기한이 다할 때까지 프로세스를 살려 두고, 테스트에서는 다음 테스트로 발화하는 떠돌이 타이머를 남깁니다.

2. **시간이 다해도 하던 일이 취소되지는 않습니다.** 프로미스는 취소할 수 없기 때문입니다. fetch를 끊고, 워커를 끝내고, 연결을 닫는 일은 `onTimeout`에서 합니다.

3. **`withTimeoutFallback`이 삼키는 것은 기한뿐입니다.** 감싼 프로미스가 진짜로 거부하면 그대로 밖으로 퍼집니다. 시간이 다한 것은 오류가 아니지만, 오류는 여전히 오류입니다.

4. **`delay`는 맨 `setTimeout`을 씁니다.** 그래서 Node에서도 웹 워커에서도 브라우저에서도 똑같이 됩니다. `window.setTimeout`은 문서 밖에서 예외를 냅니다.

5. **`deferred`가 바깥의 `let`보다 낫습니다.** 실행자의 인자를 밖에 선언한 변수에 넣는 것이 흔한 대안이지만, 타입스크립트는 그것들이 대입되었음을 증명하지 못하고, 눈에 잘 띄지 않게 어긋나기 쉽습니다.
