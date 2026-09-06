# appendUrl

شیء پارامترهای پرس‌وجو را به انتهای یک نشانی می‌افزاید.

## API

### appendUrl

#### بازگشت

| آرگومان  | توضیح                                 | نوع      |
| -------- | ------------------------------------- | -------- |
| `string` | نشانی کامل همراه با پارامترهای افزوده | `string` |

#### پارامترها

| پارامتر  | توضیح                  | نوع                      | پیش‌فرض |
| -------- | ---------------------- | ------------------------ | ------- |
| `url`    | نشانی پایه             | `string`                 | الزامی  |
| `params` | شیء پارامترهای پرس‌وجو | `Record<string, string>` | `{}`    |

## نمونه

### کاربرد پایه

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', limit: '10' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?page=1&limit=10'
```

### نشانی‌ای که از پیش پارامتر دارد

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com?sort=name';
const params = { page: '1' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?sort=name&page=1'
```

### نشانی‌های نسبی به پروتکل

```js
import { appendUrl } from 'ranuts';

// به نشانی‌هایی که با // آغاز می‌شوند، خودبه‌خود https:// افزوده می‌شود
const url = '//example.com';
const params = { id: '123' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?id=123'
```

### مقدارهای خالی کنار گذاشته می‌شوند

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', empty: '' };
const fullUrl = appendUrl(url, params);
// مقدارهایی که رشتهٔ خالی‌اند کنار گذاشته می‌شوند
console.log(fullUrl); // 'https://example.com?page=1'
```

## یادداشت‌ها

1. **پروتکل**: اگر نشانی با `//` آغاز شود، `https://` پیش از آن گذاشته می‌شود.

2. **ادغام پارامترها**: اگر نشانی از پیش پارامتر پرس‌وجو داشته باشد، پارامترهای تازه پس از آن‌ها می‌آیند.

3. **کنار گذاشتن مقدار خالی**: پارامترهایی که مقدارشان رشتهٔ خالی است کنار می‌روند و به نشانی راه نمی‌یابند.

4. **کدگذاری نشانی**: مقدار پارامترها خودبه‌خود برای نشانی کدگذاری می‌شود.

5. **رونویسی**: اگر نام پارامتر از پیش باشد، مقدار تازه جای مقدار پیشین را می‌گیرد (رفتار `URLSearchParams` چنین است).
