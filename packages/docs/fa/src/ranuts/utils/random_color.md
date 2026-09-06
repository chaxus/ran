# randomColor

یک شیء رنگ تصادفی می‌سازد.

## API

### randomColor

#### بازگشت

| آرگومان | توضیح          | نوع     |
| ------- | -------------- | ------- |
| `Color` | شیء رنگ تصادفی | `Color` |

#### پارامترها

بدون پارامتر

## نمونه

### کاربرد پایه

```js
import { randomColor } from 'ranuts';

const color = randomColor();
console.log(color.hex); // '#a3f5c2' (تصادفی)
console.log(color.rgb); // Rgb { r: 163, g: 245, b: 194 }
console.log(color.hsl); // Hsl { h: 150, s: 80, l: 80 }
```

### گرفتن مقدارهای رنگ تصادفی

```js
import { randomColor } from 'ranuts';

const color = randomColor();
const hexColor = color.hex;
const rgbColor = color.rgb.toString();
const hslColor = color.hsl.toString();

console.log(hexColor); // '#a3f5c2'
console.log(rgbColor); // 'rgb(163,245,194)'
console.log(hslColor); // 'hsl(150,80%,80%)'
```

### ساختن چند رنگ تصادفی

```js
import { randomColor } from 'ranuts';

const colors = Array.from({ length: 5 }, () => randomColor());
colors.forEach((color, index) => {
  console.log(`رنگ ${index + 1}:`, color.hex);
});
```

### به‌کار بردن یک رنگ تصادفی

```js
import { randomColor } from 'ranuts';

const color = randomColor();
document.body.style.backgroundColor = color.hex;
```

## یادداشت‌ها

1. **ساخت تصادفی**: هر بار فراخوانی، یک مقدار رنگ شانزده‌شانزدهیِ تصادفی می‌سازد.
2. **شیء کامل**: یک شیء `Color` کامل با همهٔ ویژگی‌ها — hex، rgb، hsl و بقیه — برمی‌گرداند.
3. **قالب رنگ**: مقدار ساخته‌شده نشانهٔ `#` را دارد و می‌توان آن را مستقیم در CSS به کار برد.
4. **کاربرد**: معمولاً برای ساخت رنگ تصادفی، انتخابگر رنگ و مصورسازی داده به کار می‌رود.
