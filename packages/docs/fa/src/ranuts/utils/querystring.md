# querystring

یک شیء را به رشتهٔ پرس‌وجوی نشانی تبدیل می‌کند.

## API

### querystring

#### بازگشت

| آرگومان  | توضیح                | نوع      |
| -------- | -------------------- | -------- |
| `string` | رشتهٔ پرس‌وجوی نشانی | `string` |

#### پارامترها

| پارامتر | توضیح                | نوع      | پیش‌فرض |
| ------- | -------------------- | -------- | ------- |
| `data`  | شیئی که تبدیل می‌شود | `Object` | `{}`    |

## نمونه

### کاربرد پایه

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: 30,
  city: 'New York',
};

const query = querystring(params);
console.log(query); // 'name=John&age=30&city=New%20York'
```

### ساختن نشانی

```js
import { querystring } from 'ranuts';

const baseUrl = 'https://api.example.com/users';
const params = {
  page: 1,
  limit: 10,
  sort: 'name',
};

const url = `${baseUrl}?${querystring(params)}`;
console.log(url);
// 'https://api.example.com/users?page=1&limit=10&sort=name'
```

### نویسه‌های ویژه

```js
import { querystring } from 'ranuts';

const params = {
  search: 'hello world',
  category: 'web development',
};

const query = querystring(params);
console.log(query); // 'search=hello%20world&category=web%20development'
```

### undefined و null کنار گذاشته می‌شوند

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: undefined,
  city: null,
  active: true,
};

const query = querystring(params);
console.log(query); // 'name=John&active=true'
// مقدارهای undefined و null کنار گذاشته می‌شوند
```

## یادداشت‌ها

۱. **کدگذاری نشانی**: مقدارها خودبه‌خود برای نشانی کدگذاری می‌شوند.
۲. **کنار گذاشتن مقدار خالی**: مقدارهای `undefined` و `null` خودبه‌خود کنار می‌روند و در رشتهٔ پرس‌وجو نمی‌آیند.
۳. **باید شیء باشد**: اگر چیزی جز شیء بدهید، `TypeError` پرتاب می‌شود.
۴. **پیش از کدگذاری**: کلیدها و مقدارها هر دو از `decodeURIComponent` می‌گذرند.
