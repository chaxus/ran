# createDocumentFragment

یک `DocumentFragment` می‌سازد و چند عنصر فرزند را در آن می‌گذارد.

## API

### createDocumentFragment

#### بازگشت

| آرگومان                         | توضیح                  | نوع                             |
| ------------------------------- | ---------------------- | ------------------------------- |
| `DocumentFragment \| undefined` | شیء `DocumentFragment` | `DocumentFragment \| undefined` |

#### پارامترها

| پارامتر | توضیح                             | نوع         | پیش‌فرض |
| ------- | --------------------------------- | ----------- | ------- |
| `list`  | آرایهٔ عنصرهایی که افزوده می‌شوند | `Element[]` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { createDocumentFragment } from 'ranuts';

const div1 = document.createElement('div');
const div2 = document.createElement('div');
const fragment = createDocumentFragment([div1, div2]);

// یکجا به DOM افزوده می‌شود
document.body.appendChild(fragment);
```

### افزودن دسته‌جمعی عنصرها

```js
import { createDocumentFragment } from 'ranuts';

const elements = Array.from({ length: 100 }, () => {
  const div = document.createElement('div');
  div.textContent = 'مورد';
  return div;
});

const fragment = createDocumentFragment(elements);
document.getElementById('container').appendChild(fragment);
```

### ایمنی سمت سرور

```js
import { createDocumentFragment } from 'ranuts';

// در محیط سرور مقدار undefined برمی‌گرداند
const fragment = createDocumentFragment([element]);
console.log(fragment); // undefined (محیط سرور)
```

## یادداشت‌ها

1. **بهبود کارایی**: با `DocumentFragment` از چندین دستکاری جداگانهٔ DOM پرهیز می‌شود و کار تندتر پیش می‌رود.
2. **امن در سمت سرور**: در محیط‌های سرور (بدون شیء `document`) مقدار `undefined` برمی‌گرداند و خطایی پرتاب نمی‌کند.
3. **تنها یک بار**: پس از افزودن فرگمنت به DOM، فرزندانش به عنصر مقصد می‌روند و خود فرگمنت باقی نمی‌ماند.
4. **کاربرد**: معمولاً برای افزودن دسته‌جمعی عنصرها، کاستن از بازچینش و بازترسیم، و تندتر کردن کار به کار می‌رود.
