# prefetch

Warm a large asset into the browser cache before it is needed, without spending the user's
data behind their back.

The key fact: if a Service Worker does cache-first on same-origin GETs, simply `fetch`-ing a
URL once puts it in CacheStorage. Any later request for the same URL hits the cache and works
offline. Prefetching therefore needs no special downloader — just pull the bytes in.

## API

| Function                           | Description                                                        |
| ---------------------------------- | ------------------------------------------------------------------ |
| `whenIdle(callback, options?)`     | Run when the browser is idle; returns a cancel function            |
| `networkAllowsDownload(options?)`  | May we spend the user's data right now?                            |
| `isUrlCached(url)`                 | Is this URL already in CacheStorage?                               |
| `prefetchUrl(url)`                 | Pull one URL into cache; skips if cached, fails silently           |
| `prefetchUrls(urls, options?)`     | Same for a list, **serially**                                      |
| `prefetchWhenIdle(urls, options?)` | The three combined: allowed → idle → serial prefetch. Non-blocking |

### Options

| Option                 | Applies to        | Description                                                    | Default             |
| ---------------------- | ----------------- | -------------------------------------------------------------- | ------------------- |
| `timeout`              | `whenIdle`        | Max wait for `requestIdleCallback` (ms)                        | `8000`              |
| `fallbackDelay`        | `whenIdle`        | Delay when `requestIdleCallback` is missing (ms)               | `2500`              |
| `optOutKey`            | network allowance | localStorage key; any value means the user turned prefetch off | —                   |
| `slowTypes`            | network allowance | `effectiveType` values considered too slow                     | `['slow-2g', '2g']` |
| `serviceWorkerMessage` | `prefetchUrls`    | Message `type` to hand the list to a controlling SW            | —                   |

## Example

```js
import { prefetchWhenIdle, isUrlCached } from 'ranuts';

prefetchWhenIdle(modelFiles, {
  optOutKey: 'disable_model_prefetch',
  serviceWorkerMessage: 'precache-models',
});

// Later: is it already local? (probe the file that finishes downloading last)
const ready = await isUrlCached(modelFiles.at(-1));
```

## Notes

1. **Prefetching spends someone else's data.** `networkAllowsDownload` refuses under Data
   Saver, on a slow connection, or when the user opted out.
2. **Unknown means allowed.** The Network Information API does not exist in Safari or Firefox;
   being unable to read the connection is not a reason to never prefetch.
3. **Lists are fetched serially** — saturating the pipe would slow down the page the user is
   actually looking at.
4. **Prefer the Service Worker path.** A SW using `event.waitUntil` keeps downloading across
   navigations; a main-thread fetch dies when the user clicks away. Without a controlling SW
   it falls back automatically.
5. **Probe the largest file** when checking whether a set is cached, or a half-finished
   download reads as complete.
6. **Failures are silent by design** — a failed prefetch just means the real load downloads later.
