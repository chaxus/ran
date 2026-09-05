# isEqual

برابری دو مقدار را ژرف می‌سنجد و از گونه‌های پیچیده مانند شیء، آرایه و تاریخ هم برمی‌آید.

## API

### isEqual

#### بازگشت

| آرگومان | توضیح | نوع |
| --------- | -------------------------------- | --------- |
| `boolean` | اینکه آن دو مقدار برابرند یا نه | `boolean` |

#### پارامترها

| پارامتر | توضیح | نوع | پیش‌فرض |
| --------- | ----------------------- | ----- | -------- |
| `value` | مقدار نخست برای سنجش | `any` | الزامی |
| `other` | مقدار دوم برای سنجش | `any` | الزامی |

## نمونه

### کاربرد پایه

```js
import { isEqual } from 'ranuts';

console.log(isEqual(1, 1)); // true
console.log(isEqual(1, 2)); // false
console.log(isEqual('hello', 'hello')); // true
```

### سنجش شیءها

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const obj3 = { a: 1, b: { c: 3 } };

console.log(isEqual(obj1, obj2)); // true
console.log(isEqual(obj1, obj3)); // false
```

### سنجش آرایه‌ها

```js
import { isEqual } from 'ranuts';

const arr1 = [1, 2, { a: 3 }];
const arr2 = [1, 2, { a: 3 }];
const arr3 = [1, 2, { a: 4 }];

console.log(isEqual(arr1, arr2)); // true
console.log(isEqual(arr1, arr3)); // false
```

### سنجش تاریخ‌ها

```js
import { isEqual } from 'ranuts';

const date1 = new Date('2023-01-01');
const date2 = new Date('2023-01-01');
const date3 = new Date('2023-01-02');

console.log(isEqual(date1, date2)); // true
console.log(isEqual(date1, date3)); // false
```

### رسیدگی به ارجاع چرخه‌ای

```js
import { isEqual } from 'ranuts';

const obj1 = { a: 1 };
obj1.self = obj1;

const obj2 = { a: 1 };
obj2.self = obj2;

console.log(isEqual(obj1, obj2)); // true (ارجاع‌های چرخه‌ای هم رسیدگی می‌شوند)
```

## یادداشت‌ها

۱. **سنجش ژرف**: همهٔ ویژگی‌های شیءها و آرایه‌ها را بازگشتی می‌سنجد.
۲. **ارجاع چرخه‌ای**: درست رسیدگی می‌شود.
۳. **وارسی نوع**: نوع مقدارها را هم می‌بیند و اگر فرق داشته باشند `false` می‌دهد.
۴. **کارایی**: برای شیءها یا آرایه‌های بزرگ، سنجش ژرف می‌تواند کند باشد.
