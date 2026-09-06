# prefetch

덩치 큰 자원을 필요해지기 전에 브라우저 캐시에 미리 데워 둡니다. 사용자 몰래 데이터를 쓰는 일 없이 말이지요.

요점은 이것입니다. 서비스 워커가 같은 출처의 GET을 캐시 우선으로 다룬다면, URL을 한 번 `fetch`하는 것만으로 CacheStorage에 들어갑니다. 이후 같은 URL에 대한 요청은 캐시에 걸리고 오프라인에서도 됩니다. 그러니 미리 받기에 특별한 내려받기 장치는 필요 없습니다. 바이트를 끌어오기만 하면 됩니다.

## API

| 함수                               | 설명                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `whenIdle(callback, options?)`     | 브라우저가 한가할 때 실행합니다. 취소용 함수를 돌려줍니다                    |
| `networkAllowsDownload(options?)`  | 지금 사용자의 데이터를 써도 되는가?                                          |
| `isUrlCached(url)`                 | 이 URL이 이미 CacheStorage에 있는가?                                         |
| `prefetchUrl(url)`                 | URL 하나를 캐시로 끌어옵니다. 이미 있으면 건너뛰고, 실패해도 잠자코 있습니다 |
| `prefetchUrls(urls, options?)`     | 목록에 대해 같은 일을 **하나씩 차례로** 합니다                               |
| `prefetchWhenIdle(urls, options?)` | 셋을 합친 것. 허용 → 한가함 → 차례로 미리 받기. 호출을 막지 않습니다         |

### 옵션

| 옵션                   | 적용 대상      | 설명                                                                  | 기본값              |
| ---------------------- | -------------- | --------------------------------------------------------------------- | ------------------- |
| `timeout`              | `whenIdle`     | `requestIdleCallback`을 기다리는 한도(ms)                             | `8000`              |
| `fallbackDelay`        | `whenIdle`     | `requestIdleCallback`이 없을 때의 기다림(ms)                          | `2500`              |
| `optOutKey`            | 통신 허용      | localStorage의 키. 값이 무엇이든 사용자가 미리 받기를 껐다는 뜻입니다 | —                   |
| `slowTypes`            | 통신 허용      | 너무 느리다고 보는 `effectiveType` 값                                 | `['slow-2g', '2g']` |
| `serviceWorkerMessage` | `prefetchUrls` | 목록을 제어 중인 SW에 넘길 때 쓰는 메시지의 `type`                    | —                   |

## 예시

```js
import { prefetchWhenIdle, isUrlCached } from 'ranuts';

prefetchWhenIdle(modelFiles, {
  optOutKey: 'disable_model_prefetch',
  serviceWorkerMessage: 'precache-models',
});

// 나중에: 이미 로컬에 있는가? (가장 늦게 다 받아지는 파일로 확인합니다)
const ready = await isUrlCached(modelFiles.at(-1));
```

## 참고

1. **미리 받기가 쓰는 것은 남의 데이터입니다.** `networkAllowsDownload`는 데이터 절약이 켜져 있을 때, 회선이 느릴 때, 사용자가 마다했을 때 거절합니다.
2. **알 수 없으면 허용으로 봅니다.** Network Information API는 사파리에도 파이어폭스에도 없습니다. 회선 상태를 읽지 못한다는 것이 미리 받기를 아예 하지 않을 이유가 되지는 않습니다.
3. **목록은 하나씩 차례로 가져옵니다.** 대역을 다 채우면 정작 사용자가 보고 있는 쪽이 느려집니다.
4. **되도록 서비스 워커 쪽 길을 쓰세요.** `event.waitUntil`을 쓰는 SW는 쪽을 옮겨도 계속 내려받지만, 메인 스레드의 fetch는 사용자가 다른 데로 가면 죽습니다. 제어 중인 SW가 없으면 알아서 그쪽으로 물러섭니다.
5. **한 벌이 캐시됐는지 볼 때는 가장 큰 파일로 확인하세요.** 그러지 않으면 절반쯤 받다 만 것이 다 받은 것으로 읽힙니다.
6. **실패를 잠자코 삼키는 것은 일부러 그런 것입니다.** 미리 받기가 실패해도, 진짜로 쓸 때 내려받을 뿐입니다.
