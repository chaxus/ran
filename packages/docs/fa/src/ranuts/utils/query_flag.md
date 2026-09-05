# queryFlag / isInIframe

پرچمی بولی را از نشانی می‌خواند و می‌گوید صفحه جاسازی شده است یا نه: همان دو وارسی که پشت `?embed` و `?readonly` و `?debug` ایستاده‌اند.

## API

| تابع                   | توضیح                                                              |
| ---------------------- | ------------------------------------------------------------------ |
| `queryFlag(key, url?)` | اینکه یک پارامتر پرس‌وجو درست خوانده می‌شود یا نه                  |
| `isInIframe()`         | اینکه این صفحه درون iframe اجرا می‌شود یا نه؛ در SSR برابر `false` |

### `queryFlag`

| پارامتر | توضیح                       | نوع      | پیش‌فرض    |
| ------- | --------------------------- | -------- | ---------- |
| `key`   | نام پارامتر                 | `string` | الزامی     |
| `url`   | نشانی کامل یا رشتهٔ پرس‌وجو | `string` | مکان کنونی |

برای `?k` و `?k=` و `?k=1` و `?k=true` درست است (بی‌اعتنا به بزرگی حروف). برای هر چیز دیگری نادرست، از جمله نبودِ پارامتر و `?k=false` صریح.

## نمونه

### خواندن یک پرچم

```js
import { queryFlag } from 'ranuts';

queryFlag('embed', '?embed'); // true  ← رایج‌ترین شکل نوشتن
queryFlag('embed', '?embed=1'); // true
queryFlag('embed', '?embed=true'); // true
queryFlag('embed', '?embed=false'); // false
queryFlag('embed', '?lang=en'); // false
```

### تشخیص حالت جاسازی

```js
import { queryFlag, isInIframe } from 'ranuts';

// اگر در قابی باشد یا میزبان صریحاً خواسته باشد، جاسازی‌شده به شمار می‌آید.
const embedded = isInIframe() || queryFlag('embed') || queryFlag('embedded');

if (embedded) {
  document.body.classList.add('embed-mode');
}
```

### درون صفحهٔ دیگری سنجش نکنید

```js
import { isInIframe } from 'ranuts';

// سنجش در اینجا بازدیدکنندگان سایت میزبان را به پای ما می‌نویسد.
if (!isInIframe()) initAnalytics();
```

### پیش‌نمایش فقط‌خواندنی

```js
import { queryFlag } from 'ranuts';

openDocument(file, { readonly: queryFlag('readonly') });
```

## یادداشت‌ها

۱. **رایج آن است که پرچم را بی‌مقدار بنویسند.** `?embed` مقداری ندارد، پس `getQuery(url).embed` برابر `''` است (که نادرست ارزیابی می‌شود) و وارسی سادهٔ درستی، خاموشانه از کنار رایج‌ترین شکل می‌گذرد. `queryFlag` برای همین هست.

۲. **`?k=false` نادرست است.** نفیِ صریح ارج نهاده می‌شود، نه اینکه «هست، پس روشن است» خوانده شود.

۳. **`isInIframe` محافظت شده است.** خواندن `window.parent` در برخی موتورها میان مبدأهای گوناگون خطا می‌دهد؛ والدی که خوانده نشود، جاسازی‌شده به شمار می‌آید، چون معنایش دقیقاً همین است.

۴. **هر دو در SSR امن‌اند.** بی `window`، مقدار `isInIframe` برابر `false` است و `queryFlag` نیز `false` مگر آنکه `url` بدهید؛ پس با دادن نشانی، هر دو در اسکریپت‌های زمان ساخت هم کار می‌کنند.
