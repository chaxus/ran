# addClassToElement

یک نام کلاس CSS را به عنصر DOM مشخصی می‌افزاید.

## API

### addClassToElement

#### بازگشت

بدون مقدار بازگشتی (`void`)

#### پارامترها

| پارامتر    | توضیح                      | نوع       | پیش‌فرض |
| ---------- | -------------------------- | --------- | ------- |
| `element`  | عنصر DOM                   | `Element` | الزامی  |
| `addClass` | نام کلاسی که افزوده می‌شود | `string`  | الزامی  |

## نمونه

### کاربرد پایه

```js
import { addClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
addClassToElement(element, 'active');
// حالا element کلاس 'active' را دارد
```

### پرهیز از افزودن تکراری

```js
import { addClassToElement } from 'ranuts';

const element = document.querySelector('.button');
addClassToElement(element, 'highlighted');
addClassToElement(element, 'highlighted'); // تکراری افزوده نمی‌شود
```

### ایمنی سمت سرور

```js
import { addClassToElement } from 'ranuts';

// در محیط سمت سرور خطا پرتاب نمی‌کند و بی‌صدا رد می‌شود
addClassToElement(element, 'class-name'); // سمت سرور: هیچ کاری نمی‌کند
```

## یادداشت‌ها

۱. **بررسی تکرار**: اگر عنصر آن کلاس را داشته باشد، دوباره افزوده نمی‌شود.
۲. **ایمنی سمت سرور**: در محیط سرور (بدون شیء `document`) بی‌صدا و بدون پرتاب خطا رفتار می‌کند.
۳. **از classList استفاده می‌کند**: از `classList.add()` امروزی بهره می‌برد که از دستکاری مستقیم `className` ایمن‌تر است.
