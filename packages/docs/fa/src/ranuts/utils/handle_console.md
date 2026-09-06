# قلاب‌های ابزارگذاری

به `console` و `fetch` و `XMLHttpRequest` و کلیک‌ها و خطاهای گرفته‌نشده دست می‌اندازد؛ برای پشتیبان پایش، لایهٔ اشکال‌زدایی، یا آزمون‌ها.

**همهٔ آن‌ها تابعی برای برچیدن برمی‌گردانند. نگهش دارید و صدایش بزنید.** ابزار گذاشتن روی یک سراسری بی آنکه راهی برای بازگرداندن باشد یعنی آزمون‌ها نمی‌توانند پس از خود پاکیزه کنند، و هر بارگذاری داغ روی سراسریِ از پیش وصله‌خورده باز وصله می‌زند تا آنجا که هر فراخوانی از میان ده‌ها پوشش می‌گذرد و هر رویداد N بار گزارش می‌شود.

## API

| Function                     | به چه دست می‌برد                     | بازگشت        |
| ---------------------------- | ------------------------------------ | ------------- |
| `handleConsole(hook)`        | `console.log/info/warn/error/assert` | `restore`     |
| `handleFetchHook(options)`   | `window.fetch`                       | `restore`     |
| `handleXhrHook(options)`     | `XMLHttpRequest#open` / `#send`      | `restore`     |
| `handleError(hook)`          | `error` و `unhandledrejection`       | `unsubscribe` |
| `handleClick(hook)`          | کلیک‌های سند (مرحلهٔ گرفتن)          | `unsubscribe` |
| `replaceOld(obj, key, wrap)` | هر ویژگی روی هر شیء                  | `restore`     |

`handleFetchHook` و `handleXhrHook` مقدار `{ requestHook, responseHook, errorHook }` را می‌گیرند.

## نمونه

```js
import { handleConsole, handleError, handleFetchHook } from 'ranuts';

const teardown = [
  handleConsole((type, ...args) => send({ type, args })),
  handleError((error) => send({ type: 'error', error: String(error) })),
  handleFetchHook({ errorHook: (url, error) => send({ type: 'fetchError', url }) }),
];

// هنگام برچیدن (HMR، تغییر مسیر، پاک‌سازی آزمون)
teardown.forEach((off) => off());
```

## یادداشت‌ها

1. **رفتار اصلی دست‌نخورده می‌ماند.** پاسخ‌ها از میان می‌گذرند، خطاها دوباره پرتاب می‌شوند و کنسول همچنان چاپ می‌کند.
2. **`restore` در `replaceOld` تنها وصلهٔ خودش را برمی‌دارد.** اگر پس از آن لایهٔ دیگری روی آن وصله زده باشد، برگرداندن کورکورانه آن لایه را خاموشانه از جا برمی‌کند، پس در آن حالت از این کار سر باز می‌زند.
3. **`handleXhrHook` به نمونهٔ اولیه وصله می‌زند**، پس بر همهٔ نمونه‌ها اثر می‌گذارد؛ شنونده‌هایش با `{ once: true }` ثبت می‌شوند تا شیء XHRِ بازاستفاده‌شده آن‌ها را روی هم انبار نکند.
4. **خروجی کنسول را به پشتیبانی که خودش در کنسول می‌نویسد گزارش نکنید**: آن قلاب با همان فراخوانی‌ای شلیک می‌کند که خودش پدید آورده است. (به همین سبب کانال `console` در `Monitor` به‌طور پیش‌فرض خاموش است.)

::: warning در ۰٫۳ دگرگون شد
پیش‌تر همهٔ این‌ها `void` برمی‌گرداندند و راهی برای برداشتنشان نبود. اکنون تابعی برای برچیدن برمی‌گردانند؛ محل‌های فراخوانی کنونی همچنان کار می‌کنند و کافی است از آن بهره ببرند.
:::
