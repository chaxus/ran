# getWindow

اندازهٔ پنجرهٔ دید را می‌گیرد، در هر مرورگری.

## API

### getWindow

#### بازگشت

| آرگومان       | توضیح             | نوع           |
| ------------- | ----------------- | ------------- |
| `ClientRatio` | شیء اندازهٔ پنجره | `ClientRatio` |

#### ClientRatio

| ویژگی    | توضیح                | نوع      |
| -------- | -------------------- | -------- |
| `width`  | پهنای پنجره (پیکسل)  | `number` |
| `height` | بلندای پنجره (پیکسل) | `number` |

#### پارامترها

بدون پارامتر

## نمونه

### کاربرد پایه

```js
import { getWindow } from 'ranuts';

const windowSize = getWindow();
console.log('پهنای پنجره:', windowSize.width);
console.log('بلندای پنجره:', windowSize.height);
```

### چیدمان واکنش‌گرا

```js
import { getWindow } from 'ranuts';

function handleResize() {
  const { width, height } = getWindow();
  if (width < 768) {
    // چیدمان موبایل
  } else {
    // چیدمان دسکتاپ
  }
}

window.addEventListener('resize', handleResize);
```

### ایمنی سمت سرور

```js
import { getWindow } from 'ranuts';

// در محیط سرور خطا نمی‌دهد و { width: 0, height: 0 } برمی‌گرداند
const size = getWindow();
console.log(size); // { width: 0, height: 0 }
```

### محاسبهٔ نسبت ابعاد

```js
import { getWindow } from 'ranuts';

const { width, height } = getWindow();
const aspectRatio = width / height;
console.log('نسبت ابعاد:', aspectRatio);
```

## یادداشت‌ها

1. **سازگاری با مرورگرها**: از `window.innerWidth` و `window.innerHeight` استفاده می‌کند که در همهٔ مرورگرهای امروزی هست.

2. **امن در سمت سرور**: در محیط‌های سرور (بدون شیء `window`) مقدار `{ width: 0, height: 0 }` برمی‌گرداند و خطایی پرتاب نمی‌کند.

3. **همان لحظه**: اندازه را در لحظهٔ فراخوانی برمی‌گرداند؛ اگر پنجره تغییر کرد، دوباره صدایش بزنید.

4. **کاربرد**: معمولاً در چیدمان‌های واکنش‌گرا، پرس‌وجوهای رسانه‌ای و پایش اندازهٔ پنجره به کار می‌رود.
