# durationHandler

تابعی با اجرای تأخیری می‌سازد که پس از زمان تعیین‌شده، تابع مشخص را اجرا می‌کند.

## API

### durationHandler

#### بازگشت

| آرگومان    | توضیح                                       | نوع                                |
| ---------- | ------------------------------------------- | ---------------------------------- |
| `Function` | تابعی برمی‌گرداند که زمان تأخیر را می‌پذیرد | `(duration: number) => Promise<U>` |

#### پارامترها

| پارامتر     | توضیح                               | نوع        | پیش‌فرض |
| ----------- | ----------------------------------- | ---------- | ------- |
| `handler`   | تابعی که اجرا می‌شود                | `Function` | الزامی  |
| `...params` | آرگومان‌هایی که به تابع داده می‌شود | `T[]`      | الزامی  |

## نمونه

### کاربرد پایه

```js
import { durationHandler } from 'ranuts';

const delayedFn = durationHandler((name) => {
  console.log('سلام', name);
  return 'done';
}, 'World');

// پس از یک ثانیه اجرا می‌شود
const result = await delayedFn(1000);
console.log(result); // 'done'
```

### به تأخیر انداختن درخواست API

```js
import { durationHandler } from 'ranuts';

const delayedRequest = durationHandler(async (url) => {
  const response = await fetch(url);
  return response.json();
}, 'https://api.example.com/data');

// درخواست پس از دو ثانیه فرستاده می‌شود
const data = await delayedRequest(2000);
console.log(data);
```

### همراه با networkSpeed

```js
import { durationHandler, imageRequest } from 'ranuts';

// ساخت درخواست تصویرِ تأخیری
const delayedImageRequest = durationHandler(imageRequest, 'https://example.com/test.jpg');

// پس از سه ثانیه اجرا می‌شود
const latency = await delayedImageRequest(3000);
console.log('تأخیر:', latency, 'ms');
```

## یادداشت‌ها

1. **تابع کاری‌شده**: تابعی برمی‌گرداند که زمان تأخیر را می‌پذیرد و با سبک تابعی جور درمی‌آید.
2. **پشتیبانی از ناهمگام**: توابع ناهمگام را هم می‌پذیرد و تا پایان اجرا صبر می‌کند.
3. **مدیریت خطا**: اگر اجرای تابع شکست بخورد، Promise رد می‌شود.
4. **کاربرد**: معمولاً برای اجرای تأخیری، کارهای زمان‌بندی‌شده و سنجش شبکه به کار می‌رود.
