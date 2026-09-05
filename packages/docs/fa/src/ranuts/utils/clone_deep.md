# cloneDeep

یک شیء یا آرایه را ژرف رونوشت می‌کند و نسخه‌ای کاملاً مستقل می‌سازد، همراه با همهٔ شیءها و آرایه‌های تودرتو.

## API

### cloneDeep

#### بازگشت

| آرگومان | توضیح                         | نوع   |
| ------- | ----------------------------- | ----- |
| `any`   | شیء یا مقدار تازهٔ رونوشت‌شده | `any` |

#### پارامترها

| پارامتر | توضیح                   | نوع   | پیش‌فرض |
| ------- | ----------------------- | ----- | ------- |
| `value` | مقداری که رونوشت می‌شود | `any` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { cloneDeep } from 'ranuts';

const original = { a: 1, b: { c: 2 } };
const cloned = cloneDeep(original);

cloned.b.c = 3;
console.log(original.b.c); // 2 (شیء اصلی دست‌نخورده می‌ماند)
console.log(cloned.b.c); // 3
```

### رونوشت آرایه

```js
import { cloneDeep } from 'ranuts';

const original = [1, 2, { a: 3 }];
const cloned = cloneDeep(original);

cloned[2].a = 4;
console.log(original[2].a); // 3 (آرایهٔ اصلی دست‌نخورده می‌ماند)
console.log(cloned[2].a); // 4
```

### رونوشت شیءهای تودرتو

```js
import { cloneDeep } from 'ranuts';

const original = {
  user: {
    name: 'John',
    address: {
      city: 'New York',
      zip: '10001',
    },
  },
};

const cloned = cloneDeep(original);
cloned.user.address.city = 'Los Angeles';

console.log(original.user.address.city); // 'New York'
console.log(cloned.user.address.city); // 'Los Angeles'
```

### رونوشت شیءهای `Date`

```js
import { cloneDeep } from 'ranuts';

const original = { date: new Date('2023-01-01') };
const cloned = cloneDeep(original);

cloned.date.setFullYear(2024);
console.log(original.date.getFullYear()); // 2023
console.log(cloned.date.getFullYear()); // 2024
```

## یادداشت‌ها

۱. **کاملاً مستقل**: رونوشت هیچ چیزی با نسخهٔ اصلی شریک نیست؛ دگرگون کردن یکی به دیگری کاری ندارد.
۲. **رونوشت ژرف**: همهٔ شیءها و آرایه‌های تودرتو را بازگشتی رونوشت می‌کند.
۳. **ارجاع‌های چرخه‌ای**: درست رسیدگی می‌شوند.
۴. **کارایی**: برای شیءها یا آرایه‌های بزرگ، رونوشت ژرف ممکن است کند باشد.
۵. **توابع و شیءهای ویژه**: شیوهٔ رونوشت برخی شیءهای ویژه (مانند توابع و عبارت‌های باقاعده) بسته به پیاده‌سازی می‌تواند فرق کند.
