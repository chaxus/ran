# encodeUrl

یک نشانی را با احتیاط کدگذاری می‌کند: دنباله‌های از پیش کدگذاری‌شده را دست‌نخورده می‌گذارد و جفت‌های جانشین بی‌قرین را هم می‌رساند.

## API

### encodeUrl

#### بازگشت

| آرگومان  | توضیح             | نوع      |
| -------- | ----------------- | -------- |
| `string` | نشانی کدگذاری‌شده | `string` |

#### پارامترها

| پارامتر | توضیح                      | نوع      | پیش‌فرض |
| ------- | -------------------------- | -------- | ------- |
| `url`   | نشانی‌ای که کدگذاری می‌شود | `string` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/path with spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### نشانی‌های از پیش کدگذاری‌شده

```js
import { encodeUrl } from 'ranuts';

// آنچه پیش‌تر کدگذاری شده دوباره کدگذاری نمی‌شود
const url = 'https://example.com/path%20with%20spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### نویسه‌های ویژه

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/search?q=hello world&lang=zh-CN';
const encoded = encodeUrl(url);
console.log(encoded); // نشانی کدگذاری‌شده
```

### کدگذاری‌های خراب

```js
import { encodeUrl } from 'ranuts';

// دنباله‌های خراب (مانند %foo) دوباره کدگذاری می‌شوند
const url = 'https://example.com/path%foo';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%25foo'
```

## یادداشت‌ها

۱. **کدگذاری هوشمند**: تنها بخش‌های کدگذاری‌نشده را دست می‌زند و دنباله‌های از پیش کدگذاری‌شده مانند `%20` را همان‌طور می‌گذارد.
۲. **جفت‌های جانشین**: جفت‌های جانشین بی‌قرین خودبه‌خود رسیدگی و با نویسهٔ جایگزین یونیکد عوض می‌شوند.
۳. **ایمنی**: خطایی پرتاب نمی‌کند و تا جای ممکن نشانی را درست کدگذاری می‌کند.
۴. **کاربرد**: معمولاً برای نشانی‌هایی که کاربر وارد می‌کند و برای ساختن نشانی‌های امن به کار می‌رود.
