# removeClassToElement

یک نام کلاس CSS را از عنصر DOM مشخصی برمی‌دارد.

## API

### removeClassToElement

#### بازگشت

بدون مقدار بازگشتی (`void`)

#### پارامترها

| پارامتر       | توضیح                       | نوع       | پیش‌فرض |
| ------------- | --------------------------- | --------- | ------- |
| `element`     | عنصر DOM                    | `Element` | الزامی  |
| `removeClass` | نام کلاسی که برداشته می‌شود | `string`  | الزامی  |

## نمونه

### کاربرد پایه

```js
import { removeClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
removeClassToElement(element, 'active');
// کلاس 'active' از element برداشته شد
```

### حذف شرطی

```js
import { removeClassToElement } from 'ranuts';

const element = document.querySelector('.button');
if (shouldRemove) {
  removeClassToElement(element, 'highlighted');
}
```

### ایمنی سمت سرور

```js
import { removeClassToElement } from 'ranuts';

// در محیط سمت سرور خطا پرتاب نمی‌کند و بی‌صدا رد می‌شود
removeClassToElement(element, 'class-name'); // سمت سرور: هیچ کاری نمی‌کند
```

## یادداشت‌ها

1. **بررسی وجود**: تنها اگر عنصر آن کلاس را داشته باشد برش می‌دارد.
2. **ایمنی سمت سرور**: در محیط سرور (بدون شیء `document`) بی‌صدا و بدون پرتاب خطا رفتار می‌کند.
3. **از classList استفاده می‌کند**: از `classList.remove()` امروزی بهره می‌برد که از دستکاری مستقیم `className` ایمن‌تر است.
