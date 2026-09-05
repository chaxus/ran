# getCookieByName

با کمک عبارت باقاعده، مقدار یک کوکی را از روی نامش می‌گیرد.

## API

### getCookieByName

#### بازگشت

| آرگومان  | توضیح                            | نوع      |
| -------- | -------------------------------- | -------- |
| `string` | مقدار کوکی؛ اگر نباشد رشتهٔ خالی | `string` |

#### پارامترها

| پارامتر | توضیح    | نوع      | پیش‌فرض |
| ------- | -------- | -------- | ------- |
| `name`  | نام کوکی | `string` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { getCookieByName } from 'ranuts';

const token = getCookieByName('token');
console.log(token); // مقدار کوکی یا رشتهٔ خالی
```

### تفاوت با getCookie

```js
import { getCookie, getCookieByName } from 'ranuts';

// getCookie رشته را تکه‌تکه می‌کند
const value1 = getCookie('token');

// getCookieByName از عبارت باقاعده استفاده می‌کند
const value2 = getCookieByName('token');

// کارشان یکی است و تنها پیاده‌سازی فرق دارد
```

### بررسی وجود کوکی

```js
import { getCookieByName } from 'ranuts';

const sessionId = getCookieByName('sessionId');
if (sessionId) {
  console.log('شناسهٔ نشست:', sessionId);
} else {
  console.log('شناسهٔ نشست وجود ندارد');
}
```

## یادداشت‌ها

۱. **تطبیق با عبارت باقاعده**: کوکی را با عبارت باقاعده پیدا می‌کند، پس فاصله‌های پیش یا پس از نام مشکلی ایجاد نمی‌کنند.
۲. **امن در سمت سرور**: در محیط‌های سرور (بدون شیء `window`) رشتهٔ خالی برمی‌گرداند و خطایی پرتاب نمی‌کند.
۳. **تفاوت با getCookie**: کارشان یکی است، اما `getCookieByName` از عبارت باقاعده و `getCookie` از تکه‌کردن رشته استفاده می‌کند.
۴. **مقدار بازگشتی**: وقتی کوکی وجود ندارد رشتهٔ خالی برمی‌گردد، نه `null` و نه `undefined`.
