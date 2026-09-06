# createObjectURL

از Blob، ArrayBuffer یا Response یک نشانی شیء می‌سازد.

## API

### createObjectURL

#### بازگشت

| آرگومان           | توضیح                                    | نوع       |
| ----------------- | ---------------------------------------- | --------- |
| `Promise<string>` | Promiseای که با نشانی شیء برآورده می‌شود | `Promise` |

#### پارامترها

| پارامتر | توضیح        | نوع                                         | پیش‌فرض |
| ------- | ------------ | ------------------------------------------- | ------- |
| `src`   | سرچشمهٔ داده | `Blob \| ArrayBuffer \| Response \| string` | الزامی  |

## نمونه

### کاربرد پایه (Blob)

```js
import { createObjectURL } from 'ranuts';

const blob = new Blob(['Hello World'], { type: 'text/plain' });
const url = await createObjectURL(blob);
console.log(url); // 'blob:http://example.com/...'
```

### ساختن از ArrayBuffer

```js
import { createObjectURL } from 'ranuts';

const buffer = new ArrayBuffer(8);
const url = await createObjectURL(buffer);
console.log(url); // 'blob:http://example.com/...'
```

### ساختن از Response

```js
import { createObjectURL } from 'ranuts';

const response = await fetch('https://example.com/image.jpg');
const url = await createObjectURL(response);
console.log(url); // 'blob:http://example.com/...'
```

### وقتی رشته داده شود

```js
import { createObjectURL } from 'ranuts';

// اگر رشته بدهید، همان را برمی‌گرداند
const url = await createObjectURL('https://example.com/image.jpg');
console.log(url); // 'https://example.com/image.jpg'
```

### پیش‌نمایش تصویر

```js
import { createObjectURL } from 'ranuts';

async function previewImage(file) {
  const url = await createObjectURL(file);
  document.getElementById('preview').src = url;
}
```

## یادداشت‌ها

۱. **ناهمگام است**: Promise برمی‌گرداند، پس با `await` یا `.then()` رسیدگی کنید.
۲. **نوع‌های پذیرفته**: Blob، ArrayBuffer، Response و رشته.
۳. **مدیریت حافظه**: نشانی‌های ساخته‌شده را باید خودتان با `URL.revokeObjectURL()` آزاد کنید.
۴. **کاربرد**: معمولاً برای پیش‌نمایش فایل، ساخت نشانی موقت و پردازش تصویر به کار می‌رود.

## requestUrlToBuffer

محتوای یک نشانی را با `XMLHttpRequest` همچون بایت خام می‌آورد. این بایت‌ها معمولاً به `createObjectURL` بالا می‌رسند؛ آنجا که پیش از تبدیلشان به نشانی قابل نمایش باید وارسی یا دگرگونشان کنید (وارسی عدد جادویی، رمزگشایی صدا).

```js
import { requestUrlToBuffer, createObjectURL } from 'ranuts/utils';

const result = await requestUrlToBuffer('/assets/clip.webm', {});
if (result.success) {
  const url = await createObjectURL(new Blob([result.data]));
  video.src = url;
}
```

#### پارامترها

| پارامتر   | توضیح                                                                 | نوع                                      | پیش‌فرض |
| --------- | --------------------------------------------------------------------- | ---------------------------------------- | ------- |
| `src`     | نشانی‌ای که گرفته می‌شود                                              | `string`                                 | الزامی  |
| `options` | `method` (پیش‌فرض `'GET'`) و `responseType` (پیش‌فرض `'arraybuffer'`) | `Partial<RequestUrlToArraybufferOption>` | الزامی  |

#### بازگشت

`Promise`ای که در HTTP 200 با `{ success: true, data, message: '' }` برآورده می‌شود و در غیر آن با `{ success: false, data: status, message }` **رد** می‌شود. درخواست ناکام یک رد است، نه برآورده‌شدنی با `success: false`؛ پس `.then()`ِ تنها و بدون `.catch()` آن را همچون ردِ رسیدگی‌نشده آشکار می‌کند.

::: tip برای کد تازه، `fetch` بهتر است
این از روزگاری مانده که هنوز `fetch` همه‌جا در دسترس نبود و در درون از `XMLHttpRequest` بهره می‌برد. اگر به‌طور مشخص به XHR نیاز ندارید (رویدادهای پیشرفت بارگذاری، `abort()`)، `fetch(url).then(r =>
r.arrayBuffer())` همان کار را با شکل ردِ بومیِ Promise انجام می‌دهد.
:::
