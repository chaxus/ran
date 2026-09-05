# rgbToHex

مقدارهای RGB را به مقدار رنگ شانزده‌شانزدهی تبدیل می‌کند.

## API

### rgbToHex

#### بازگشت

| آرگومان  | توضیح                    | نوع      |
| -------- | ------------------------ | -------- |
| `string` | مقدار رنگ شانزده‌شانزدهی | `string` |

#### پارامترها

| پارامتر | توضیح                    | نوع                         | پیش‌فرض |
| ------- | ------------------------ | --------------------------- | ------- |
| `r`     | مقدار قرمز یا آرایهٔ RGB | `string \| number \| Array` | الزامی  |
| `g`     | مقدار سبز (اختیاری)      | `string \| number`          | `0`     |
| `b`     | مقدار آبی (اختیاری)      | `string \| number`          | `0`     |

## نمونه

### کاربرد پایه

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex(255, 0, 0);
console.log(hex); // '#ff0000'

const hex2 = rgbToHex(0, 255, 0);
console.log(hex2); // '#00ff00'
```

### دادن آرایه

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex([255, 87, 51]);
console.log(hex); // '#ff5733'
```

### تبدیل رنگ

```js
import { rgbToHex, hexToRgb } from 'ranuts';

const rgb = [255, 87, 51];
const hex = rgbToHex(rgb);
console.log(hex); // '#ff5733'

// بازگشت به RGB
const rgb2 = hexToRgb(hex);
console.log(rgb2); // [255, 87, 51]
```

### ساخت پویای رنگ

```js
import { rgbToHex } from 'ranuts';

function generateColor(r, g, b) {
  return rgbToHex(r, g, b);
}

const color = generateColor(100, 150, 200);
console.log(color); // '#6496c8'
```

## یادداشت‌ها

۱. **شیوهٔ دادن آرگومان**: سه شکل پشتیبانی می‌شود:

- سه آرگومان جدا: `rgbToHex(r, g, b)`
- یک آرایه: `rgbToHex([r, g, b])`
- رشته یا عدد: خودبه‌خود تبدیل می‌شود

۲. **مقدار بازگشتی**: همیشه مقدار رنگ شانزده‌شانزدهی همراه با نشانهٔ `#`.

۳. **دامنهٔ مقدار**: مقدارهای RGB معمولاً بین ۰ تا ۲۵۵ هستند؛ مقدارهای بیرون از این دامنه هم تبدیل می‌شوند.

۴. **کاربرد**: معمولاً برای تبدیل رنگ، ساخت رنگ CSS و پردازش رنگ به کار می‌رود.
