# isSafari

تعیین می‌کند که مرورگر کنونی سافاری است یا نه.

## API

### isSafari

#### بازگشت

| آرگومان                          | توضیح                         | نوع                              |
| -------------------------------- | ----------------------------- | -------------------------------- |
| `boolean \| undefined \| string` | اینکه مرورگر سافاری است یا نه | `boolean \| undefined \| string` |

#### پارامترها

بدون پارامتر

## نمونه

### کاربرد پایه

```js
import { isSafari } from 'ranuts';

const isSafariBrowser = isSafari();
if (isSafariBrowser) {
  console.log('مرورگر کنونی سافاری است');
} else {
  console.log('سافاری نیست');
}
```

### قابلیت‌های ویژه سافاری

```js
import { isSafari } from 'ranuts';

if (isSafari()) {
  // رسیدگی ویژه سافاری
  // مثلاً دور زدن برخی ناسازگاری‌های سافاری
  applySafariFix();
}
```

### محیط سمت سرور

```js
import { isSafari } from 'ranuts';

// در محیط سمت سرور undefined برمی‌گرداند
const result = isSafari();
console.log(result); // undefined (محیط سمت سرور)
```

## یادداشت‌ها

1. **شیوه تشخیص**: بررسی می‌کند که 'Apple' در `navigator.vendor` هست یا نه.
2. **کنار گذاشتن مرورگرهای دیگر**: کروم iOS (CriOS) و فایرفاکس iOS (FxiOS) را بیرون می‌گذارد.
3. **محیط سمت سرور**: در محیط سرور (بدون شیء `navigator`) مقدار `undefined` برمی‌گرداند.
4. **مقدار بازگشتی**: در مرورگر `boolean`، در سرور `undefined`؛ در برخی حالت‌ها ممکن است رشته برگرداند.
