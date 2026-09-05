# setMime

نگاشت نوع MIME را تعیین یا به‌روز می‌کند.

## API

### setMime

#### بازگشت

| آرگومان               | توضیح                    | نوع                   |
| --------------------- | ------------------------ | --------------------- |
| `Map<string, string>` | نگاشت (Map) نوع‌های MIME | `Map<string, string>` |

#### پارامترها

| پارامتر    | توضیح      | نوع      | پیش‌فرض |
| ---------- | ---------- | -------- | ------- |
| `ext`      | پسوند فایل | `string` | الزامی  |
| `mimeType` | نوع MIME   | `string` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { setMime, getMime } from 'ranuts';

// تعیین یک نوع MIME سفارشی
setMime('.myext', 'application/x-my-custom-type');

// خواندن نوع MIME
const mime = getMime('.myext');
console.log(mime); // 'application/x-my-custom-type'
```

### به‌روز کردن نوع موجود

```js
import { setMime, getMime } from 'ranuts';

// تغییر نوع MIME برای .js
setMime('.js', 'application/javascript-custom');

const mime = getMime('script.js');
console.log(mime); // 'application/javascript-custom'
```

### افزودن نوع تازه

```js
import { setMime } from 'ranuts';

// افزودن نگاشت برای گونهٔ تازه‌ای از فایل
setMime('.xyz', 'application/x-xyz-format');
```

## یادداشت‌ها

۱. **اثر سراسری**: آنچه تعیین می‌کنید بر کل نگاشت نوع‌های MIME اثر می‌گذارد و هر جا `getMime` به کار رفته باشد دگرگون می‌شود.
۲. **رونویسی**: اگر آن پسوند از پیش باشد، نوع MIME پیشینش رونویسی می‌شود.
۳. **مقدار بازگشتی**: کل Map نوع‌های MIME را برمی‌گرداند، پس می‌توانید کار را روی آن ادامه دهید.
۴. **کاربرد**: معمولاً برای افزودن نوع MIME به گونه‌های سفارشی فایل به کار می‌رود.

## MimeType

همان `Map<string, string>` زیربنایی که `getMime` و `setMime` و `getExtensions` از آن می‌خوانند و در آن می‌نویسند. اگر می‌خواهید همهٔ جفت‌های شناخته‌شدهٔ پسوند/نوع را برشمرید — نه اینکه یکی را بجویید — آن را مستقیم وارد کنید.

```js
import { MimeType } from 'ranuts/utils';

MimeType.get('.pdf'); // 'application/pdf'
MimeType.size; // شمار کل پسوندهای شناخته‌شده
[...MimeType.entries()].filter(([, type]) => type.startsWith('image/'));
```

همان نمونهٔ `Map` است که `setMime` دگرگونش می‌کند، پس هر تغییری که از راه `setMime` بدهید بی‌درنگ اینجا پیداست و برعکس. دستکاری مستقیم هم کار می‌کند؛ `setMime` تنها دری نام‌دار برای حالت پرکاربرد است.
