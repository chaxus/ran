# performanceTime

برچسب زمانی با دقت بالا می‌گیرد؛ هم در مرورگر و هم در Node.js.

## API

### performanceTime

#### بازگشت

| آرگومان  | توضیح                                | نوع      |
| -------- | ------------------------------------ | -------- |
| `number` | برچسب زمانی با دقت بالا (میلی‌ثانیه) | `number` |

#### پارامترها

بدون پارامتر

## نمونه

### کاربرد پایه

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// چند عملیات را اجرا کنید
const end = performanceTime();
console.log(`مدت: ${end - start} ms`);
```

### اندازه‌گیری کارایی

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// عملیات زمان‌بر را اجرا کنید
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}
const end = performanceTime();
console.log(`مدت عملیات: ${end - start} ms`);
```

### زمان اجرای یک تابع

```js
import { performanceTime } from 'ranuts';

function expensiveFunction() {
  // محاسبهٔ پیچیده
  return Math.random() * 1000;
}

const start = performanceTime();
const result = expensiveFunction();
const end = performanceTime();
console.log(`نتیجه: ${result}، مدت: ${end - start} ms`);
```

## یادداشت‌ها

۱. **محیط‌های پشتیبانی‌شده**:

- مرورگر: از `performance.now()` استفاده می‌کند
- Node.js: از `process.hrtime()` استفاده می‌کند
- سایر محیط‌ها: به `Date.now()` بازمی‌گردد

۲. **دقت**: `performance.now()` و `process.hrtime()` تا میکروثانیه دقت دارند و از `Date.now()` دقیق‌ترند.

۳. **زمان نسبی**: برچسب زمانی بازگشتی نسبی است؛ برای سنجش اختلاف زمان مناسب است، نه برای استفاده به‌عنوان زمان مطلق.

۴. **یکا**: مقدار بازگشتی بر حسب میلی‌ثانیه است.
