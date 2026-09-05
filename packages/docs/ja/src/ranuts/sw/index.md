# ranuts/sw — Service Worker

Service Worker を組み立てるための部品です。どの SW でも結局は書くことになるふたつのキャッシュ戦略と、ページ側が [prefetch](../utils/prefetch) にあるプリキャッシュ規約の、ワーカー側の半分です。

```js
import { cacheFirst, networkFirst, precache, dropCachesExcept, servePrecache } from 'ranuts/sw';
```

**独立したエントリーポイントです。** このコードは `window` も `document` も存在しない `ServiceWorkerGlobalScope` で走ります。`ranuts/utils` から import すると、DOM を向いたモジュールをワーカーのバンドルに引きずり込んでしまいます。

**バンドルされた Service Worker を前提にしています。** 静的ファイルとして配信される手書きの `sw.js` は `node_modules` から import できません。バンドルするか、必要な部分をコピーしてください。

## API

| 関数                               | 説明                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `cacheFirst(request, options)`     | キャッシュにあればそれを返し、なければ取得して保存します               |
| `networkFirst(request, options)`   | 取得してキャッシュを更新し、オフラインではキャッシュにフォールバック   |
| `precache(cacheName, urls, opts?)` | キャッシュを埋めます。すでにあるものは飛ばします                       |
| `dropCachesExcept(keep, opts?)`    | それ以外のキャッシュをすべて削除し、削除した名前を返します             |
| `servePrecache(options)`           | `prefetchUrls({ serviceWorkerMessage })` に応えます。`stop` を返します |

戦略のオプションは `{ cacheName, shouldCache?, scope? }` です。`shouldCache` の既定は「200 で返ってきた GET すべて」。`scope` はグローバルを差し替えるもので、テストやグローバルでないワーカー向けです。

## 使用例

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

// prefetchUrls({ serviceWorkerMessage: 'precache-models' }) の相手側
servePrecache({ type: 'precache-models', cacheName: MODELS });
```

## 補足

1. **内容ハッシュで不変なアセットには `cacheFirst`** を。スクリプト、スタイル、フォント、モデルの重みなどです。**デプロイをすぐ反映しなければならないものには `networkFirst`** を。HTML のナビゲーションやマニフェストなどです。
2. **どちらの戦略も reject しません。** ネットワークが失敗してキャッシュにも何もなければ 408 に解決するので、`respondWith` が例外を投げることはありません。
3. **レスポンスは、本文を読む前に同期的にクローンされます。** 先に `caches.open()` を待ってからクローンするのが古典的なバグです。そのときには本文がすでにページへ流れ始めていることがあり、`clone()` が例外を投げます。
4. **`precache` は冪等で、URL 単位で寛容です。** リストの中の 404 ひとつが install を中断させてはいけません。
5. **SW の中でダウンロードすることこそが `servePrecache` の狙いです。** その処理は `event.waitUntil` で包まれるのでナビゲーションをまたいで生き残ります。ページ側の fetch は、利用者が別のページへ移った瞬間に中断され、大きなアセットは次の訪問でゼロからやり直しになります。
