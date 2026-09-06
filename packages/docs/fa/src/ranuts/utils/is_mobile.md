# isMobile

تعیین می‌کند که دستگاه کنونی موبایل است یا نه.

## API

### isMobile

#### بازگشت

| آرگومان   | توضیح                         | نوع       |
| --------- | ----------------------------- | --------- |
| `boolean` | اینکه دستگاه موبایل است یا نه | `boolean` |

#### پارامترها

بدون پارامتر

## نمونه

### کاربرد پایه

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  console.log('دستگاه کنونی موبایل است');
} else {
  console.log('دستگاه کنونی رومیزی است');
}
```

### چیدمان واکنش‌گرا

```js
import { isMobile } from 'ranuts';

const layout = isMobile() ? 'mobile' : 'desktop';
console.log(`از چیدمان ${layout} استفاده می‌شود`);
```

### بارگذاری شرطی

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  // کد ویژه موبایل را بار کن
  import('./mobile-module');
} else {
  // کد رومیزی را بار کن
  import('./desktop-module');
}
```

## یادداشت‌ها

1. **قواعد تشخیص**: این دستگاه‌ها را از روی User Agent تشخیص می‌دهد:

- Android
- webOS
- iPhone
- iPod
- iPad
- BlackBerry

2. **رندر سمت سرور**: در محیط سرور (بدون شیء `window`) مقدار `false` برمی‌گرداند.

3. **دقت**: بر پایه User Agent است، پس UAی دستکاری‌شده می‌تواند فریبش دهد.

4. **آی‌پد**: بسته به User Agent، در برخی حالت‌ها آی‌پد موبایل شناخته می‌شود.
