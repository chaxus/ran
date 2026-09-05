# ranuts/sw — 서비스 워커

서비스 워커를 짓기 위한 부품입니다. 어떤 SW든 결국 쓰게 되는 캐시 전략 두 가지와, 페이지 쪽 절반이 [prefetch](../utils/prefetch)에 있는 프리캐시 규약의 워커 쪽 절반입니다.

```js
import { cacheFirst, networkFirst, precache, dropCachesExcept, servePrecache } from 'ranuts/sw';
```

**자체 진입점입니다.** 이 코드는 `window`도 `document`도 없는 `ServiceWorkerGlobalScope`에서 돕니다. `ranuts/utils`에서 import하면 DOM을 향한 모듈까지 워커 번들로 끌려 들어옵니다.

**번들된 서비스 워커를 전제합니다.** 정적 파일로 서빙되는 손으로 쓴 `sw.js`는 `node_modules`에서 import할 수 없습니다. 번들하거나, 필요한 조각을 복사해 쓰세요.

## API

| 함수                               | 설명                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `cacheFirst(request, options)`     | 캐시된 사본을 내주고, 없으면 받아 와 저장합니다                            |
| `networkFirst(request, options)`   | 받아 와 캐시를 갱신하고, 오프라인이면 캐시로 물러납니다                    |
| `precache(cacheName, urls, opts?)` | 캐시를 채우되 이미 있는 것은 건너뜁니다                                    |
| `dropCachesExcept(keep, opts?)`    | 나머지 캐시를 모두 지우고, 지운 이름들을 돌려줍니다                        |
| `servePrecache(options)`           | `prefetchUrls({ serviceWorkerMessage })`에 응답합니다. `stop`을 돌려줍니다 |

전략 옵션은 `{ cacheName, shouldCache?, scope? }`입니다. `shouldCache`의 기본값은 "200으로 응답된 모든 GET"이고, `scope`는 전역을 대신할 값으로 테스트나 전역이 아닌 워커에서 씁니다.

## 예시

```js
// sw.ts
import { cacheFirst, networkFirst, precache, dropCachesExcept, servePrecache } from 'ranuts/sw';

const ASSETS = `assets_${BUILD_ID}`;
const MODELS = 'models';

self.addEventListener('install', (e) => e.waitUntil(precache(ASSETS, PRECACHE_URLS)));
self.addEventListener('activate', (e) => e.waitUntil(dropCachesExcept([ASSETS, MODELS])));

self.addEventListener('fetch', (event) => {
  const isNavigation = event.request.mode === 'navigate';
  event.respondWith(
    isNavigation
      ? networkFirst(event.request, { cacheName: ASSETS })
      : cacheFirst(event.request, { cacheName: ASSETS }),
  );
});

// prefetchUrls({ serviceWorkerMessage: 'precache-models' })의 반대편
servePrecache({ type: 'precache-models', cacheName: MODELS });
```

## 참고

1. **내용 해시가 붙어 변하지 않는 자산에는 `cacheFirst`**를 쓰세요. 스크립트, 스타일, 폰트, 모델 가중치 같은 것들입니다. **배포를 곧바로 반영해야 하는 것에는 `networkFirst`**를 쓰세요. HTML 내비게이션이나 매니페스트 같은 것들입니다.
2. **두 전략 모두 reject하지 않습니다.** 네트워크가 실패했는데 캐시에도 아무것도 없으면 408로 해결되므로, `respondWith`가 예외를 던지는 일이 없습니다.
3. **응답은 본문을 읽기 전에 동기적으로 복제됩니다.** `caches.open()`을 먼저 기다렸다가 복제하는 것이 고전적인 버그입니다. 그때쯤이면 본문이 이미 페이지로 흘러가고 있을 수 있고, `clone()`이 예외를 던집니다.
4. **`precache`는 멱등하며 URL 단위로 너그럽습니다.** 목록 속 404 하나가 설치를 중단시켜서는 안 됩니다.
5. **SW 안에서 내려받는 것이 바로 `servePrecache`의 취지입니다.** 그 작업은 `event.waitUntil`로 감싸이므로 내비게이션을 넘어 살아남습니다. 페이지 쪽 fetch는 사용자가 자리를 뜨는 순간 중단되고, 큰 자산은 다음 방문에 처음부터 다시 시작합니다.
