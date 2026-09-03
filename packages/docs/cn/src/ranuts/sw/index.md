# ranuts/sw —— Service Worker

Service Worker 的基础件：每个 SW 最后都会写的那两种缓存策略，以及预取协议的 worker 半边。
它的页面半边在 [prefetch](../utils/prefetch)。

```js
import { cacheFirst, networkFirst, precache, dropCachesExcept, servePrecache } from 'ranuts/sw';
```

**单独的入口。** 这些代码跑在 `ServiceWorkerGlobalScope` 里，没有 `window` 和 `document`；
从 `ranuts/utils` 引会把面向 DOM 的模块一起拖进 worker 包。

**它假定 service worker 是打包产物。** 手写、以静态文件直接 serve 的 `sw.js` 引不了
`node_modules`，要么把它纳入打包，要么把需要的片段抄过去。

## API

| 函数                               | 说明                                                       |
| ---------------------------------- | ---------------------------------------------------------- |
| `cacheFirst(request, options)`     | 有缓存就用，没有则请求并存下                               |
| `networkFirst(request, options)`   | 优先网络并回填缓存，离线时回退缓存                         |
| `precache(cacheName, urls, opts?)` | 填充缓存，已存在的跳过                                     |
| `dropCachesExcept(keep, opts?)`    | 删掉其余所有缓存，返回被删的名字                           |
| `servePrecache(options)`           | 应答 `prefetchUrls({ serviceWorkerMessage })`，返回 `stop` |

策略选项：`{ cacheName, shouldCache?, scope? }`。`shouldCache` 默认「200 的 GET」；
`scope` 用于覆盖全局，测试或非全局 worker 时用。

## 示例

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

// prefetchUrls({ serviceWorkerMessage: 'precache-models' }) 的对侧
servePrecache({ type: 'precache-models', cacheName: MODELS });
```

## 注意

1. **`cacheFirst` 给内容哈希过的不可变资源**（脚本、样式、字体、模型权重）。
   **`networkFirst` 给必须立刻反映发版的东西**（HTML 导航、manifest）。
2. **两个策略都不会 reject**。离线且无缓存时返回 408，`respondWith` 不会炸。
3. **response 是在读 body 之前同步 clone 的**。先 `await caches.open()` 再 clone 是经典 bug：
   那时 body 可能已经在流向页面，`clone()` 直接抛。
4. **`precache` 幂等且逐条容错**：清单里有一个 404 不该让整个 install 失败。
5. **在 SW 里下载正是 `servePrecache` 的意义**。任务包在 `event.waitUntil` 里，能扛过页面导航；
   页面侧的 fetch 在用户点走的瞬间就被 abort，大文件下次访问从头重下。
