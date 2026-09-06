# checkEncoding

کدگذاری نویسه‌های داده‌های `Uint8Array` را تشخیص می‌دهد.

## API

### checkEncoding

#### بازگشت

| آرگومان  | توضیح                  | نوع      |
| -------- | ---------------------- | -------- |
| `string` | کدگذاری تشخیص‌داده‌شده | `string` |

#### پارامترها

| پارامتر      | توضیح                   | نوع          | پیش‌فرض |
| ------------ | ----------------------- | ------------ | ------- |
| `uint8Array` | داده‌ای که بررسی می‌شود | `Uint8Array` | الزامی  |

## نمونه

### کاربرد پایه

```js
import { checkEncoding } from 'ranuts';

const data = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
const encoding = checkEncoding(data);
console.log(encoding); // 'UTF-8' یا هر کدگذاری تشخیص‌داده‌شدهٔ دیگر
```

### تشخیص کدگذاری یک فایل

```js
import { checkEncoding } from 'ranuts';

async function detectFileEncoding(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const encoding = checkEncoding(uint8Array);
  return encoding;
}
```

### رمزگشایی متن

```js
import { checkEncoding } from 'ranuts';

function decodeText(uint8Array) {
  const encoding = checkEncoding(uint8Array);
  const decoder = new TextDecoder(encoding);
  return decoder.decode(uint8Array);
}
```

## یادداشت‌ها

1. **وابستگی**: برای تشخیص کدگذاری از کتابخانهٔ `jschardet` استفاده می‌کند.
2. **کدگذاری پیش‌فرض**: اگر تشخیص شکست بخورد، `'utf-8'` در نظر گرفته می‌شود.
3. **دقت**: تشخیص کدگذاری صددرصد دقیق نیست، به‌ویژه برای متن‌های کوتاه.
4. **کاربرد**: معمولاً در پردازش فایل، رمزگشایی متن و تبدیل کدگذاری نویسه‌ها به کار می‌رود.
