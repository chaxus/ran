# imageRequest

تأخیر شبکه (ping) را با یک درخواست تصویر می‌سنجد.

## API

### imageRequest

#### بازگشت

| آرگومان           | توضیح                                                    | نوع       |
| ----------------- | -------------------------------------------------------- | --------- |
| `Promise<number>` | Promise‌ای که با مدت درخواست (میلی‌ثانیه) برآورده می‌شود | `Promise` |

#### پارامترها

| پارامتر | توضیح                                          | نوع      | پیش‌فرض |
| ------- | ---------------------------------------------- | -------- | ------- |
| `url`   | نشانی تصویر (اختیاری؛ پیش‌فرض favicon گیت‌هاب) | `string` | اختیاری |

## نمونه

### کاربرد پایه

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest();
console.log('تأخیر شبکه:', latency, 'ms');
```

### مشخص کردن نشانی آزمون

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest('https://example.com/test-image.jpg');
console.log('تأخیر:', latency, 'ms');
```

### سنجش شبکه

```js
import { imageRequest } from 'ranuts';

async function testNetwork() {
  try {
    const latency = await imageRequest();
    if (latency < 100) {
      console.log('شبکه خوب است');
    } else if (latency < 300) {
      console.log('شبکه متوسط است');
    } else {
      console.log('شبکه کند است');
    }
  } catch (error) {
    console.error('سنجش شکست خورد:', error);
  }
}
```

## یادداشت‌ها

۱. **نشانی پیش‌فرض**: اگر نشانی ندهید، favicon گیت‌هاب (حدود ۲٫۲ کیلوبایت) به کار می‌رود.
۲. **روش سنجش**: زمان بارگذاری تصویر، از آغاز درخواست تا پایان بارگذاری، اندازه گرفته می‌شود.
۳. **مدیریت خطا**: اگر تصویر بارگذاری نشود، Promise رد می‌شود.
۴. **کاربرد**: معمولاً برای سنجش کیفیت شبکه و پایش کارایی به کار می‌رود.
