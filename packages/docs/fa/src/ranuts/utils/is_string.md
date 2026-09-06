# isString

تعیین می‌کند که آیا یک مقدار از نوع رشته است یا نه.

## API

### isString

#### بازگشت

| آرگومان   | توضیح                | نوع       |
| --------- | -------------------- | --------- |
| `boolean` | اینکه رشته هست یا نه | `boolean` |

#### پارامترها

| پارامتر | توضیح                  | نوع       | پیش‌فرض |
| ------- | ---------------------- | --------- | ------- |
| `obj`   | مقداری که بررسی می‌شود | `unknown` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { isString } from 'ranuts';

console.log(isString('hello')); // true
console.log(isString(123)); // false
console.log(isString(null)); // false
console.log(isString(undefined)); // false
```

### بررسی نوع

```js
import { isString } from 'ranuts';

function processValue(value) {
  if (isString(value)) {
    console.log('رشته است:', value.toUpperCase());
  } else {
    console.log('رشته نیست');
  }
}

processValue('hello'); // 'رشته است: HELLO'
processValue(123); // 'رشته نیست'
```

### وارسی آرگومان‌ها

```js
import { isString } from 'ranuts';

function validateInput(input) {
  if (!isString(input)) {
    throw new Error('ورودی باید رشته باشد');
  }
  return input.trim();
}
```

## یادداشت‌ها

1. **تشخیص نوع**: از `Object.prototype.toString.call()` استفاده می‌کند و نوع را دقیق تشخیص می‌دهد.
2. **سخت‌گیری**: تنها زمانی `true` برمی‌گرداند که مقدار واقعاً از نوع رشته باشد؛ بقیهٔ نوع‌ها (از جمله شیء String) `false` می‌دهند.
3. **کاربرد**: معمولاً برای بررسی نوع، وارسی آرگومان‌ها و مانند آن به کار می‌رود.
