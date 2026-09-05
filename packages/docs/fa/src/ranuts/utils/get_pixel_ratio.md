# getPixelRatio

نسبت تفکیک‌پذیری بافتار Canvas را می‌گیرد تا نمایشگرهای پرتراکم را بتوان درست پوشش داد.

## API

### getPixelRatio

#### بازگشت

| آرگومان  | توضیح      | نوع      |
| -------- | ---------- | -------- |
| `number` | نسبت پیکسل | `number` |

#### پارامترها

| پارامتر   | توضیح                      | نوع                        | پیش‌فرض |
| --------- | -------------------------- | -------------------------- | ------- |
| `context` | بافتار ترسیم دوبعدی Canvas | `CanvasRenderingContext2D` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);
console.log('نسبت پیکسل:', ratio);
```

### هماهنگی با نمایشگرهای پرتراکم

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);

// اندازهٔ Canvas را با نسبت هماهنگ کنید
canvas.width = canvas.clientWidth * ratio;
canvas.height = canvas.clientHeight * ratio;

// بافتار را مقیاس بدهید تا اندازهٔ ترسیم درست بماند
ctx.scale(ratio, ratio);
```

### ترسیم شفاف

```js
import { getPixelRatio } from 'ranuts';

function drawHighDPI(canvas) {
  const ctx = canvas.getContext('2d');
  const ratio = getPixelRatio(ctx);

  // اندازهٔ واقعی را تعیین کنید
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;

  // بافتار را مقیاس بدهید
  ctx.scale(ratio, ratio);

  // محتوا را بکشید (بر حسب پیکسل منطقی)
  ctx.fillRect(10, 10, 100, 100);
}
```

## یادداشت‌ها

۱. **سازگاری با مرورگرها**: ویژگی `backingStorePixelRatio` را در مرورگرهای گوناگون در نظر می‌گیرد.
۲. **پشتیبانی از تراکم بالا**: نمایشگرهای پرتراکم (Retina) را خودش می‌رساند تا ترسیم شفاف بماند.
۳. **شیوهٔ محاسبه**: مقدار `devicePixelRatio / backingStorePixelRatio` را برمی‌گرداند.
۴. **کاربرد**: معمولاً در ترسیم روی Canvas، کتابخانه‌های نمودار و ساخت بازی — هر جا شفافیت مهم است — به کار می‌رود.
