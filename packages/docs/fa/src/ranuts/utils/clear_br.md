# clearBr

فاصله‌ها، تگ‌های HTML و شکست خط را از یک رشته برمی‌دارد.

## API

### clearBr

#### بازگشت

| آرگومان  | توضیح             | نوع      |
| -------- | ----------------- | -------- |
| `string` | رشته پاک‌سازی‌شده | `string` |

#### پارامترها

| پارامتر | توضیح                      | نوع      | پیش‌فرض |
| ------- | -------------------------- | -------- | ------- |
| `str`   | رشته‌ای که پاک‌سازی می‌شود | `string` | `''`    |

## نمونه

### کاربرد پایه

```js
import { clearBr } from 'ranuts';

const text = '  <p>Hello\nWorld</p>  ';
const cleaned = clearBr(text);
console.log(cleaned); // 'HelloWorld'
```

### پاک‌سازی محتوای HTML

```js
import { clearBr } from 'ranuts';

const html = '<div>این محتوای <strong>آزمایشی</strong> است</div>\nشکست خط';
const cleaned = clearBr(html);
console.log(cleaned); // 'اینمحتوایآزمایشیاستشکستخط'
```

### رشته خالی

```js
import { clearBr } from 'ranuts';

console.log(clearBr('')); // '' (رشته خالی)
console.log(clearBr()); // '' (رشته خالی)
```

## یادداشت‌ها

1. **چه چیزی پاک می‌شود**: همه فاصله‌ها، تگ‌های HTML و شکست خط‌ها (`\r\n`).
2. **رشته خالی**: اگر ورودی رشته خالی باشد، همان رشته خالی برمی‌گردد.
3. **کجا به کار می‌آید**: برای بیرون کشیدن متن خام و برداشتن نشانه‌های قالب‌بندی رایج است.
