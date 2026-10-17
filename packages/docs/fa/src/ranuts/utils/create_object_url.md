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

1. **ناهمگام است**: Promise برمی‌گرداند، پس با `await` یا `.then()` رسیدگی کنید.
2. **نوع‌های پذیرفته**: Blob، ArrayBuffer، Response و رشته.
3. **مدیریت حافظه**: نشانی‌های ساخته‌شده را باید خودتان با `URL.revokeObjectURL()` آزاد کنید.
4. **کاربرد**: معمولاً برای پیش‌نمایش فایل، ساخت نشانی موقت و پردازش تصویر به کار می‌رود.

## requestUrlToBuffer

محتوای یک نشانی را با `XMLHttpRequest` همچون بایت خام می‌آورد. این بایت‌ها معمولاً به `createObjectURL` بالا می‌رسند؛ آنجا که پیش از تبدیلشان به نشانی قابل نمایش باید وارسی یا دگرگونشان کنید (وارسی عدد جادویی، رمزگشایی صدا).

```js
import { requestUrlToBuffer, createObjectURL } from 'ranuts/utils';

const result = await requestUrlToBuffer('/assets/clip.webm');
if (result.success) {
  const url = await createObjectURL(new Blob([result.data]));
  video.src = url;
}
```

#### پارامترها

| پارامتر   | توضیح                                                                 | نوع                                      | پیش‌فرض |
| --------- | --------------------------------------------------------------------- | ---------------------------------------- | ------- |
| `src`     | نشانی‌ای که گرفته می‌شود                                              | `string`                                 | الزامی  |
| `options` | `method` (پیش‌فرض `'GET'`) و `responseType` (پیش‌فرض `'arraybuffer'`) | `Partial<RequestUrlToArraybufferOption>` | `{}`    |

#### بازگشت

`Promise`ای که در HTTP 200 با `{ success: true, data, message: '' }` برآورده می‌شود و در غیر آن با `{ success: false, data: status, message }` **رد** می‌شود. درخواست ناکام یک رد است، نه برآورده‌شدنی با `success: false`؛ پس `.then()`ِ تنها و بدون `.catch()` آن را همچون ردِ رسیدگی‌نشده آشکار می‌کند.

### نوع پاسخ

حالت پیش‌فرض و خالی ArrayBuffer برمی‌گردانند؛ blob و text نوع متناظر را دارند. JSON و حالت پویا unknown هستند و به اعتبارسنجی نیاز دارند. پیشرفت مربوط به دانلود است؛ این پوشش رابط لغو ندارد.

| `responseType`                 | `data`             |
| ------------------------------ | ------------------ |
| omitted / `arraybuffer` / `''` | `ArrayBuffer`      |
| `blob`                         | `Blob`             |
| `text`                         | `string`           |
| `document`                     | `Document \| null` |
| `json` / dynamic               | `unknown`          |

```ts
const bytes = (await requestUrlToBuffer('/file')).data; // ArrayBuffer
const blob = (await requestUrlToBuffer('/file', { responseType: 'blob' })).data; // Blob
```
