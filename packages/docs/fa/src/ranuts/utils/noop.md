# noop

تابعی تهی که هیچ کاری نمی‌کند. معمولاً به‌عنوان فراخوان پیش‌فرض یا جای‌نگه‌دار به کار می‌رود.

## API

### noop

#### بازگشت

| آرگومان | توضیح              | نوع    |
| ------- | ------------------ | ------ |
| `void`  | بدون مقدار بازگشتی | `void` |

#### پارامترها

بدون پارامتر

## نمونه

### کاربرد پایه

```js
import { noop } from 'ranuts';

// به‌عنوان فراخوان پیش‌فرض
const callback = noop;
callback(); // هیچ کاری نمی‌کند
```

### به‌عنوان مقدار پیش‌فرض یک آرگومان

```js
import { noop } from 'ranuts';

function processData(data, onSuccess = noop, onError = noop) {
  try {
    // پردازش داده
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

// تنها فراخوان موفقیت داده می‌شود
processData({ id: 1 }, (data) => {
  console.log('موفق:', data);
});

// هیچ فراخوانی داده نمی‌شود
processData({ id: 2 }); // خطایی پرتاب نمی‌شود
```

### فراخوان شرطی

```js
import { noop } from 'ranuts';

const handleClick = isEnabled
  ? () => {
      console.log('اجرای کنش');
    }
  : noop;

button.addEventListener('click', handleClick);
```

### جای‌نگه‌دار شنوندهٔ رویداد

```js
import { noop } from 'ranuts';

const unsubscribe = someService.subscribe(noop); // فعلاً رویدادها رسیدگی نمی‌شوند
```

## یادداشت‌ها

1. **هزینه**: فراخوانی یک تابع تهی هزینهٔ ناچیزی دارد و برای مقدار پیش‌فرض مناسب است.
2. **ایمنی نوع**: در TypeScript نوع `noop` برابر `() => void` است و هر جا تابعی لازم باشد بی‌خطر جا می‌افتد.
3. **خوانایی**: `noop` مقصودِ «هیچ کاری انجام نشود» را روشن‌تر از `() => {}` می‌رساند.
