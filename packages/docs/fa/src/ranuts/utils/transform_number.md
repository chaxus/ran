# transformNumber

عدد را به رشته‌ای همراه با یکا تبدیل می‌کند و یکاهای چینی و انگلیسی را پشتیبانی می‌کند.

## API

### transformNumber

#### بازگشت

| آرگومان  | توضیح        | نوع      |
| -------- | ------------ | -------- |
| `string` | رشتهٔ آراسته | `string` |

#### پارامترها

| پارامتر     | توضیح                      | نوع      | پیش‌فرض   |
| ----------- | -------------------------- | -------- | --------- |
| `value`     | رشتهٔ عددی که تبدیل می‌شود | `string` | الزامی    |
| `locale`    | زبان و منطقه               | `string` | `'zh-CN'` |
| `precision` | دقتِ محاسبه                | `number` | `2`       |
| `fixed`     | رقم‌های اعشار در نمایش     | `number` | `2`       |

## نمونه

### کاربرد پایه

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000')); // '1.00 万' (ده هزار، به چینی)
console.log(transformNumber('1000000')); // '100.00 万' (یک میلیون)
console.log(transformNumber('100000000')); // '1.00 亿' (صد میلیون)
```

### یکاهای انگلیسی

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000', 'en')); // '1.00K'
console.log(transformNumber('1000000', 'en')); // '1.00M'
console.log(transformNumber('1000000000', 'en')); // '1.00B'
```

### تنظیم دقت

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1234', 'zh-CN', 2, 1)); // '0.1 万'
console.log(transformNumber('12345', 'zh-CN', 2, 0)); // '1 万'
```

### ورودی نامعتبر

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('abc')); // '--'
console.log(transformNumber('')); // '--'
```

## یادداشت‌ها

۱. **دستگاه یکاها**:

- `zh-CN`: 万 (ده هزار)، 亿 (صد میلیون)، 万亿 (تریلیون) — هر چهار رقم
- `zh-HK`: 萬، 億، 萬億 — باز هم هر چهار رقم
- `en`: K (هزار)، M (میلیون)، B (میلیارد)، T (تریلیون) — هر سه رقم

۲. **رسیدگی به دقت**: با `Mathjs` حساب می‌کند تا خطای اعشار شناور پیش نیاید.

۳. **ورودی نامعتبر**: اگر ورودی عدد معتبری نباشد، `'--'` برمی‌گرداند.

۴. **کاربرد**: معمولاً برای نمایش عددهای بزرگ مانند مبلغ، بازدید و شمار دنبال‌کنندگان به کار می‌رود.
