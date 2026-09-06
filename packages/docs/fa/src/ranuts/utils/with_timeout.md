# withTimeout / deferred

قطعه‌های Promise که جاوااسکریپت با خود ندارد: Promiseای که از بیرون تعیین تکلیف می‌شود، و انتظاری کرانه‌دار.

## API

| تابع                                                     | توضیح                                                      |
| -------------------------------------------------------- | ---------------------------------------------------------- |
| `deferred<T>()`                                          | `{ promise, resolve, reject }`؛ از بیرون تعیین تکلیفش کنید |
| `withTimeout(promise, ms, options?)`                     | اگر در `ms` تعیین تکلیف نشود، با `TimeoutError` رد می‌کند  |
| `withTimeoutFallback(promise, ms, fallback, onTimeout?)` | به‌جای رد کردن، با `fallback` برآورده می‌شود               |
| `delay(ms)`                                              | پس از `ms` برآورده می‌شود                                  |
| `TimeoutError`                                           | کلاس خطایی که `withTimeout` پرتاب می‌کند                   |

### `withTimeout` options

| گزینه       | توضیح                                              | پیش‌فرض                            |
| ----------- | -------------------------------------------------- | ---------------------------------- |
| `message`   | پیام خطا                                           | `operation timed out after {ms}ms` |
| `onTimeout` | هنگام گذشتن مهلت فراخوانده می‌شود تا کار را برچیند | —                                  |

## نمونه

### کرانه گذاشتن بر یک درخواست و بریدنش هنگام پایان مهلت

```js
import { withTimeout } from 'ranuts';

const controller = new AbortController();
const res = await withTimeout(fetch(url, { signal: controller.signal }), 5000, {
  message: 'fetch timed out',
  onTimeout: () => controller.abort(),
});
```

### به‌جای شکست، پایین آمدن از توقع

```js
import { withTimeoutFallback } from 'ranuts';

// ذخیرهٔ کند باید فایل اصلی را برگرداند، نه اینکه جریان کار را بشکند.
const file = await withTimeoutFallback(editor.requestSave(), 60_000, originalFile);
```

### تعیین تکلیف Promise از دل یک فراخوان

```js
import { deferred } from 'ranuts';

const ready = deferred();
sdk.onReady((editor) => ready.resolve(editor));
sdk.onError((error) => ready.reject(error));

const editor = await ready.promise;
```

### به صف کردن کارهای مهلت‌دار

```js
import { QuestQueue, withTimeout } from 'ranuts';

const queue = new QuestQueue({ simultaneous: 1 });
await queue.add(() => withTimeout(recreateEditor(config), 30_000));
```

## یادداشت‌ها

۱. **زمان‌سنج همیشه پاک می‌شود**، حتی وقتی خودِ کار در مسابقه پیروز شود. آن نسخهٔ دست‌ساز رایج (`Promise.race([task, new Promise((_, r) => setTimeout(r, ms))])`) هر بار که کار زودتر تمام شود زمان‌سنج را نشت می‌دهد. در Node همین، فرایند را تا پایان مهلت زنده نگه می‌دارد؛ در آزمون‌ها زمان‌سنجی سرگردان به جا می‌گذارد که در آزمون بعدی شلیک می‌کند.

۲. **پایان مهلت، کار را لغو نمی‌کند.** Promise را نمی‌توان لغو کرد. `onTimeout` همان جایی است که fetch را می‌برید، worker را تمام می‌کنید یا اتصال را می‌بندید.

۳. **`withTimeoutFallback` تنها مهلت را می‌بلعد.** ردِ راستینِ Promiseِ پیچیده‌شده همچنان بیرون می‌تراود: پایان مهلت خطا نیست، اما خطا همچنان خطاست.

۴. **`delay` از `setTimeout` خام استفاده می‌کند**، پس در Node و Web Worker و مرورگر یکسان کار می‌کند. `window.setTimeout` بیرون از یک سند خطا می‌دهد.

۵. **`deferred` از `let`های بیرونی بهتر است.** گذاشتن آرگومان‌های اجراکننده در متغیرهایی که بیرون اعلام شده‌اند، جایگزین رایج است؛ اما TypeScript نمی‌تواند ثابت کند که مقدار گرفته‌اند و به‌آسانی می‌توان نامحسوس اشتباه کرد.
