# getExtensions

آرایهٔ پسوندهای فایلِ متناظر با یک نوع MIME را می‌گیرد.

## API

### getExtensions

#### بازگشت

| آرگومان | توضیح | نوع |
| -------- | ---------------------------------- | ---------- |
| `Array` | آرایهٔ پسوندهای فایل (بدون نقطه) | `string[]` |

#### پارامترها

| پارامتر | توضیح | نوع | پیش‌فرض |
| ---------- | ----------- | -------- | -------- |
| `mimeType` | نوع MIME | `string` | الزامی |

## نمونه

### کاربرد پایه

```js
import { getExtensions } from 'ranuts';

const exts = getExtensions('image/jpeg');
console.log(exts); // ['jpeg', 'jpg', 'jpe']
```

### گرفتن همهٔ پسوندها

```js
import { getExtensions } from 'ranuts';

const jsExts = getExtensions('application/javascript');
console.log(jsExts); // ['js', 'jsx', 'ts', 'tsx']
```

### بررسی نوع فایل

```js
import { getExtensions } from 'ranuts';

function isValidImageFile(filename, mimeType) {
  const exts = getExtensions(mimeType);
  const fileExt = filename.split('.').pop();
  return exts.includes(fileExt);
}

console.log(isValidImageFile('photo.jpg', 'image/jpeg')); // true
```

## یادداشت‌ها

۱. **شکل خروجی**: پسوندهای بازگشتی نقطه (`.`) ندارند؛ یعنی `'jpg'` نه `'.jpg'`.
۲. **چند پسوند**: یک نوع MIME ممکن است به چند پسوند مربوط باشد و همهٔ موارد منطبق برگردانده می‌شوند.
۳. **آرایهٔ خالی**: اگر آن نوع MIME وجود نداشته باشد، آرایهٔ خالی برمی‌گردد.
۴. **کاربرد**: معمولاً برای بررسی نوع فایل، وارسی بارگذاری‌ها و مانند آن به کار می‌رود.
