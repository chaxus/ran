# ranuts/sw — سرویس‌ورکر

قطعه‌های ساختن یک سرویس‌ورکر: دو راهبرد کشی که هر SWی سرانجام می‌نویسد، و نیمهٔ ورکرِ قرارداد پیش‌کش که نیمهٔ صفحه‌اش در [prefetch](../utils/prefetch) است.

```js
import { cacheFirst, networkFirst, precache, dropCachesExcept, servePrecache } from 'ranuts/sw';
```

**نقطه ورودی خودش را دارد.** این کد در `ServiceWorkerGlobalScope` اجرا می‌شود، جایی که `window` و `document` وجود ندارند؛ وارد کردنش از `ranuts/utils` ماژول‌های رو به DOM را به باندل ورکر می‌کشاند.

**فرضش بر یک سرویس‌ورکرِ باندل‌شده است.** یک `sw.js` دست‌نویس که به‌صورت فایل ایستا سرو شود نمی‌تواند از `node_modules` وارد کند: یا باندلش کنید، یا قطعه‌های موردنیاز را رونویسی کنید.

## API

| تابع                               | توضیح                                                                       |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `cacheFirst(request, options)`     | نسخه کش‌شده را می‌دهد، وگرنه می‌گیرد و ذخیره می‌کند                         |
| `networkFirst(request, options)`   | می‌گیرد و کش را تازه می‌کند، و آفلاین به کش برمی‌گردد                       |
| `precache(cacheName, urls, opts?)` | یک کش را پر می‌کند و از آنچه هست می‌گذرد                                    |
| `dropCachesExcept(keep, opts?)`    | همه کش‌های دیگر را پاک می‌کند؛ نام‌های پاک‌شده را برمی‌گرداند               |
| `servePrecache(options)`           | به `prefetchUrls({ serviceWorkerMessage })` پاسخ می‌دهد؛ `stop` برمی‌گرداند |

گزینه‌های راهبرد: `{ cacheName, shouldCache?, scope? }`. پیش‌فرض `shouldCache` یعنی «هر GETی که با ۲۰۰ پاسخ گرفته باشد»؛ `scope` جای شیء سراسری را می‌گیرد، برای آزمون یا ورکری که سراسری نیست.

## نمونه

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

// سر دیگرِ prefetchUrls({ serviceWorkerMessage: 'precache-models' })
servePrecache({ type: 'precache-models', cacheName: MODELS });
```

## یادداشت‌ها

1. **برای دارایی‌های تغییرناپذیر و هش‌دار `cacheFirst`**: اسکریپت‌ها، استایل‌ها، قلم‌ها، وزن‌های مدل. **برای هرچه باید انتشار تازه را بی‌درنگ بازتاب دهد `networkFirst`**: ناوبری‌های HTML، یک مانیفست.
2. **هیچ‌کدام از این دو راهبرد reject نمی‌کنند.** شکست شبکه در نبود چیزی در کش به یک ۴۰۸ حل می‌شود، پس `respondWith` هرگز خطا پرتاب نمی‌کند.
3. **پاسخ پیش از خوانده‌شدن بدنه، به‌طور همگام کلون می‌شود.** اول منتظر `caches.open()` ماندن و بعد کلون کردن، همان اشکال کلاسیک است: تا آن موقع ممکن است بدنه از پیش به‌سوی صفحه در جریان باشد و `clone()` خطا بدهد.
4. **`precache` خودتوان است و در سطح هر URL بخشنده**: یک ۴۰۴ در فهرست نباید نصب را از کار بیندازد.
5. **دانلود کردن در خود SW دقیقاً نکته `servePrecache` است.** آن کار درون `event.waitUntil` پیچیده می‌شود، پس از ناوبری‌ها جان به در می‌برد؛ اما واکشیِ سمت صفحه همان لحظه که کاربر جای دیگری می‌رود لغو می‌شود و یک دارایی بزرگ در بازدید بعدی از صفر آغاز می‌کند.
