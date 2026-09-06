# toString

یک مقدار را به نوع رشته تبدیل می‌کند.

## API

### toString

#### بازگشت

| آرگومان  | توضیح     | نوع      |
| -------- | --------- | -------- |
| `string` | رشته حاصل | `string` |

#### پارامترها

| پارامتر | توضیح                  | نوع                | پیش‌فرض |
| ------- | ---------------------- | ------------------ | ------- |
| `value` | مقداری که تبدیل می‌شود | `string \| number` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { toString } from 'ranuts';

const str1 = toString(123);
console.log(str1); // '123'

const str2 = toString('hello');
console.log(str2); // 'hello'
```

### تبدیل نوع

```js
import { toString } from 'ranuts';

const num = 42;
const str = toString(num);
console.log(typeof str); // 'string'
```

## یادداشت‌ها

1. **پوششی ساده**: پوشش نازکی است روی تابع `String()`.
2. **نوع‌های پشتیبانی‌شده**: تبدیل رشته و عدد را پشتیبانی می‌کند.
3. **کجا به کار می‌آید**: در تبدیل نوع، پردازش رشته و مانند آن رایج است.
