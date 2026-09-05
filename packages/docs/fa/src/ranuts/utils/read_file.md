# readFileAs*

پوشش‌های پرامیس‌دار دور `FileReader`.

| تابع                              | با چه چیزی حل می‌شود | کاربرد                                                   |
| --------------------------------- | -------------------- | -------------------------------------------------------- |
| `readFileAsArrayBuffer(blob)`     | `ArrayBuffer`        | پردازش دودویی                                            |
| `readFileAsUint8Array(blob)`      | `Uint8Array`         | خوراک `checkEncoding` / `arrayBufferToString`            |
| `readFileAsText(blob, encoding?)` | `string`             | فایل‌های متنی؛ اگر رمزگذاری ناشناخته است اول تشخیصش دهید |
| `readFileAsDataURL(blob)`         | `string`             | پیش‌نمایش تصویر                                          |

## نمونه

```js
import { readFileAsUint8Array, arrayBufferToString } from 'ranuts';

input.addEventListener('change', async (e) => {
  const bytes = await readFileAsUint8Array(e.target.files[0]);
  const text = arrayBufferToString(bytes); // رمزگذاری خودکار تشخیص داده می‌شود، از جمله GBK/Big5
});
```

## یادداشت‌ها

۱. **هر سه خروجی سیم‌کشی شده‌اند**: `onload`، `onerror` و `onabort`. فراموش‌کردن `onabort` همان راه کلاسیک است که وقتی کاربر انتخابگر فایل را لغو می‌کند، یک پرامیس را تا ابد در انتظار می‌گذارد.
۲. **با خطایی روشن reject می‌کند** جایی که `FileReader` وجود ندارد (Node و برخی بسترهای ورکر).
۳. **هرگز روی فایلی با منشأ ناشناخته `new TextDecoder().decode()` نزنید**: این کار UTF-8 را فرض می‌گیرد و GBK/Big5 را به هم می‌ریزد. از `arrayBufferToString` استفاده کنید که اول تشخیص می‌دهد.
