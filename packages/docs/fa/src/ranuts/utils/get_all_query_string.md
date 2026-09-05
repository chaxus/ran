# getAllQueryString

همهٔ پارامترهای پرس‌وجو را از یک نشانی بیرون می‌کشد و به شیء تبدیل می‌کند.

## API

### getAllQueryString

#### بازگشت

| آرگومان  | توضیح                  | نوع                      |
| -------- | ---------------------- | ------------------------ |
| `Object` | شیء پارامترهای پرس‌وجو | `Record<string, string>` |

#### پارامترها

| پارامتر | توضیح                                                         | نوع      | پیش‌فرض |
| ------- | ------------------------------------------------------------- | -------- | ------- |
| `url`   | نشانی‌ای که تجزیه می‌شود (اختیاری؛ پیش‌فرض نشانی صفحهٔ کنونی) | `string` | اختیاری |

## نمونه

### کاربرد پایه

```js
import { getAllQueryString } from 'ranuts';

// فرض کنید نشانی کنونی https://example.com?name=John&age=30 است
const params = getAllQueryString();
console.log(params); // { name: 'John', age: '30' }
```

### تجزیهٔ نشانی مشخص

```js
import { getAllQueryString } from 'ranuts';

const url = 'https://example.com?page=1&limit=10&sort=name';
const params = getAllQueryString(url);
console.log(params); // { page: '1', limit: '10', sort: 'name' }
```

### خواندن یک پارامتر مشخص

```js
import { getAllQueryString } from 'ranuts';

const params = getAllQueryString();
const page = params.page || '1';
const limit = params.limit || '10';
console.log(`صفحه: ${page}، شمار: ${limit}`);
```

### پارامترهای کدگذاری‌شده

```js
import { getAllQueryString } from 'ranuts';

// URL: https://example.com?search=hello%20world
const params = getAllQueryString();
console.log(params.search); // 'hello world' (خودبه‌خود رمزگشایی شد)
```

## یادداشت‌ها

۱. **پرچمِ بی‌مقدار جایش را نگه می‌دارد.** `?embed` و `?embed=` هر دو `{ embed: '' }` می‌دهند. پیش از ۰٫۳ هر پارامتر بی‌مقدار کنار گذاشته می‌شد و همین باعث می‌شد `?readonly` و `?embed` — که شیوهٔ معمول نوشتن پرچم بولی‌اند — از نبودِ پارامتر بازشناختنی نباشند. چنین پرچمی را با [`queryFlag`](/fa/src/ranuts/utils/query_flag) بخوانید.

۲. **قطعه هرگز به مقدار آخر نشت نمی‌کند.** `?lang=en#section` مقدار `{ lang: 'en' }` می‌دهد.

۳. **تنها نخستین `=` جدا می‌کند**، پس مقدار می‌تواند خودش یکی داشته باشد: `?next=/a?b=1` مقدار `{ next: '/a?b=1' }` می‌دهد.

۴. **رمزگشایی نشانی**: کلیدها و مقدارها درصدرمزگشایی می‌شوند و `+` به فاصله بدل می‌گردد، درست مانند `URLSearchParams`. گریزِ خراب مانند `%zz` عیناً نگه داشته می‌شود و پارامتر کنار گذاشته نمی‌شود، تا یک مقدار بد بقیه را پنهان نکند.

۵. **محیط سرور**: وقتی نه `window` هست و نه `url` داده شده، `{}` برمی‌گردد. برای کاربرد در اسکریپت زمان ساخت، نشانی بدهید.

۶. **نشانی پیش‌فرض**: بدون `url`، از `window.location.href` استفاده می‌شود.

۷. **پارامترهای تکراری**: تنها آخرین مقدار نگه داشته می‌شود.
