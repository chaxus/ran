# hexToRgb

مقدار رنگ شانزده‌شانزدهی را به آرایهٔ RGB تبدیل می‌کند.

## API

### hexToRgb

#### بازگشت

| آرگومان                 | توضیح                               | نوع                     |
| ----------------------- | ----------------------------------- | ----------------------- |
| `Array<number> \| null` | آرایهٔ RGB به شکل [r, g, b] یا null | `Array<number> \| null` |

#### پارامترها

| پارامتر | توضیح                    | نوع      | پیش‌فرض |
| ------- | ------------------------ | -------- | ------- |
| `hex`   | مقدار رنگ شانزده‌شانزدهی | `string` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#ff0000');
console.log(rgb); // [255, 0, 0]

const rgb2 = hexToRgb('#00ff00');
console.log(rgb2); // [0, 255, 0]
```

### مقدارهای نامعتبر

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#invalid');
console.log(rgb); // null
```

### با یا بدون نشانهٔ `#`

```js
import { hexToRgb } from 'ranuts';

const rgb1 = hexToRgb('#ff0000');
const rgb2 = hexToRgb('ff0000');
console.log(rgb1); // [255, 0, 0]
console.log(rgb2); // [255, 0, 0]
```

### تبدیل رنگ

```js
import { hexToRgb, rgbToHex } from 'ranuts';

const hex = '#ff5733';
const rgb = hexToRgb(hex);
console.log(rgb); // [255, 87, 51]

// بازگشت به شانزده‌شانزدهی
const hex2 = rgbToHex(rgb[0], rgb[1], rgb[2]);
console.log(hex2); // '#ff5733'
```

## یادداشت‌ها

1. **قالب پذیرفته‌شده**: مقدارهای رنگ شانزده‌شانزدهیِ شش‌رقمی (مثلاً `#ff0000` یا `ff0000`).
2. **مقدار بازگشتی**: در صورت موفقیت آرایهٔ `[r, g, b]` و در صورت شکست `null`.
3. **بزرگی و کوچکی حروف**: `#FF0000` و `#ff0000` یکسان‌اند.
4. **کاربرد**: معمولاً برای تبدیل و پردازش رنگ و کار با رنگ‌های CSS به کار می‌رود.
