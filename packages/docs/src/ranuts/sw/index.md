# ranuts/sw — Service Worker

Building blocks for a service worker: the two caching strategies every SW ends up writing, and
the worker half of the precache protocol whose page half lives in
[prefetch](../utils/prefetch).

```js
import { cacheFirst, networkFirst, precache, dropCachesExcept, servePrecache } from 'ranuts/sw';
```

**Its own entry point.** This code runs in a `ServiceWorkerGlobalScope` where `window` and
`document` do not exist; importing it from `ranuts/utils` would drag DOM-facing modules into a
worker bundle.

**It assumes a bundled service worker.** A hand-written `sw.js` served as a static file cannot
import from `node_modules` — either bundle it, or copy the pieces you need.

## API

| Function                           | Description                                                     |
| ---------------------------------- | --------------------------------------------------------------- |
| `cacheFirst(request, options)`     | Serve the cached copy, else fetch and store                     |
| `networkFirst(request, options)`   | Fetch and refresh the cache, fall back to it offline            |
| `precache(cacheName, urls, opts?)` | Fill a cache, skipping what is already there                    |
| `dropCachesExcept(keep, opts?)`    | Delete every other cache; returns the names dropped             |
| `servePrecache(options)`           | Answer `prefetchUrls({ serviceWorkerMessage })`; returns `stop` |

Strategy options: `{ cacheName, shouldCache?, scope? }`. `shouldCache` defaults to "any GET
answered with 200"; `scope` overrides the global, for tests or a non-global worker.

## Example

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

// The other end of prefetchUrls({ serviceWorkerMessage: 'precache-models' })
servePrecache({ type: 'precache-models', cacheName: MODELS });
```

## Notes

1. **`cacheFirst` for immutable, content-hashed assets** — scripts, styles, fonts, model
   weights. **`networkFirst` for anything that must reflect a deploy immediately** — HTML
   navigations, a manifest.
2. **Neither strategy rejects.** A network failure with nothing cached resolves to a 408, so a
   `respondWith` never blows up.
3. **The response is cloned synchronously, before the body is read.** Awaiting `caches.open()`
   first and cloning afterwards is the classic bug: by then the body may already be streaming
   to the page, and `clone()` throws.
4. **`precache` is idempotent and per-URL forgiving** — one 404 in the list must not abort an
   install.
5. **Downloading in the SW is the point of `servePrecache`.** The work is wrapped in
   `event.waitUntil`, so it survives navigations; a page-side fetch is aborted the moment the
   user clicks away and a large asset restarts from zero next visit.
