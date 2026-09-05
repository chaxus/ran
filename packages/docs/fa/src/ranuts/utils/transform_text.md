# transformText

یک `ArrayBuffer` را به متن تبدیل می‌کند: کدگذاری را خودکار تشخیص می‌دهد و رمزگشایی می‌کند.

## API

### transformText

#### بازگشت

| آرگومان                      | توضیح                         | نوع                          |
| ---------------------------- | ----------------------------- | ---------------------------- |
| `TransformText \| undefined` | شیء نتیجهٔ تبدیل یا undefined | `TransformText \| undefined` |

#### TransformText

| ویژگی      | توضیح                  | نوع      |
| ---------- | ---------------------- | -------- |
| `encoding` | کدگذاری تشخیص‌داده‌شده | `string` |
| `content`  | متن رمزگشایی‌شده       | `string` |

#### پارامترها

| پارامتر   | توضیح                   | نوع                     | پیش‌فرض |
| --------- | ----------------------- | ----------------------- | ------- |
| `content` | محتوایی که تبدیل می‌شود | `string \| ArrayBuffer` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { transformText } from 'ranuts';

const arrayBuffer = new TextEncoder().encode('Hello World').buffer;
const result = transformText(arrayBuffer);
if (result) {
  console.log('کدگذاری:', result.encoding);
  console.log('محتوا:', result.content); // 'Hello World'
}
```

### پردازش فایل

```js
import { transformText } from 'ranuts';

async function readTextFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = transformText(arrayBuffer);
  if (result) {
    return result.content;
  }
  return null;
}
```

### تشخیص خودکار کدگذاری

```js
import { transformText } from 'ranuts';

// کدگذاری را خودکار تشخیص می‌دهد و رمزگشایی می‌کند
const result = transformText(arrayBuffer);
if (result) {
  console.log(`با کدگذاری ${result.encoding} رمزگشایی شد`);
  console.log(result.content);
}
```

## یادداشت‌ها

۱. **تشخیص خودکار**: برای یافتن نوع کدگذاری از `jschardet` استفاده می‌کند.
۲. **تنها `ArrayBuffer`**: فعلاً فقط `ArrayBuffer` پشتیبانی می‌شود و دادن رشته هشدار می‌دهد.
۳. **شرط بازگشت نتیجه**: تنها وقتی کدگذاری تشخیص داده شود و رمزگشایی موفق باشد نتیجه برمی‌گردد، وگرنه `undefined`.
۴. **کاربرد**: معمولاً در خواندن فایل، رمزگشایی متن و تبدیل کدگذاری به کار می‌رود.
