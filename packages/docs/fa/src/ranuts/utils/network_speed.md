# networkSpeed

با چند درخواست، مقدار ping و لرزش شبکهٔ کنونی را می‌سنجد.

## API

### networkSpeed

#### بازگشت

| آرگومان               | توضیح                                            | نوع       |
| --------------------- | ------------------------------------------------ | --------- |
| `Promise<ReturnType>` | Promise‌ای که با نتیجهٔ سنجش شبکه برآورده می‌شود | `Promise` |

#### ReturnType

| ویژگی    | توضیح                           | نوع      |
| -------- | ------------------------------- | -------- |
| `ping`   | میانگین مقدار ping (میلی‌ثانیه) | `number` |
| `jitter` | لرزش شبکه (میلی‌ثانیه)          | `number` |

#### پارامترها

| پارامتر   | توضیح              | نوع       | پیش‌فرض |
| --------- | ------------------ | --------- | ------- |
| `options` | گزینه‌های پیکربندی | `Options` | الزامی  |

#### گزینه‌ها

| پارامتر    | توضیح                               | نوع      | پیش‌فرض |
| ---------- | ----------------------------------- | -------- | ------- |
| `url`      | نشانی تصویری که با آن سنجیده می‌شود | `string` | الزامی  |
| `duration` | فاصلهٔ میان درخواست‌ها (میلی‌ثانیه) | `number` | `3000`  |
| `count`    | شمار سنجش‌ها                        | `number` | `5`     |

## نمونه

### کاربرد پایه

```js
import { networkSpeed } from 'ranuts';

const result = await networkSpeed({
  url: 'https://example.com/test.jpg',
  count: 5,
  duration: 3000,
});

console.log('میانگین تأخیر:', result.ping, 'ms');
console.log('لرزش شبکه:', result.jitter, 'ms');
```

### برآورد کیفیت شبکه

```js
import { networkSpeed } from 'ranuts';

async function assessNetwork() {
  const { ping, jitter } = await networkSpeed({ count: 10, url: 'https://example.com/test.jpg' });

  if (ping < 50 && jitter < 20) {
    console.log('کیفیت شبکه عالی است');
  } else if (ping < 100 && jitter < 50) {
    console.log('کیفیت شبکه خوب است');
  } else {
    console.log('کیفیت شبکه متوسط است');
  }
}
```

### تغییر پارامترهای سنجش

```js
import { networkSpeed } from 'ranuts';

// ده بار سنجش، هر بار با دو ثانیه فاصله
const result = await networkSpeed({
  url: 'https://example.com/ping.jpg',
  count: 10,
  duration: 2000,
});
```

## یادداشت‌ها

۱. **لرزش**: نوسان شبکه را نشان می‌دهد؛ اختلاف بیشترین و کمترین مقدار در چند سنجش، و هرچه کمتر، شبکه پایدارتر.
۲. **شیوهٔ سنجش**: چند درخواست تصویر می‌فرستد و میانگین تأخیر و لرزش را حساب می‌کند.
۳. **مقدارهای پیش‌فرض**: پنج سنجش با فاصلهٔ سه ثانیه.
۴. **کاربرد**: معمولاً برای سنجش کیفیت شبکه، پایش کارایی و بهبود تجربهٔ کاربر به کار می‌رود.
