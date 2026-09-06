# clearStr

فاصله‌های دو سر، کدگذاری نشانی و گیومه‌ها را از یک رشته برمی‌دارد.

## API

### clearStr

#### بازگشت

| آرگومان  | توضیح         | نوع      |
| -------- | ------------- | -------- |
| `string` | رشتهٔ پاک‌شده | `string` |

#### پارامترها

| پارامتر   | توضیح                 | نوع              | پیش‌فرض |
| --------- | --------------------- | ---------------- | ------- |
| `str`     | رشته‌ای که پاک می‌شود | `string`         | الزامی  |
| `options` | گزینه‌های پیکربندی    | `ClearStrOption` | `{}`    |

#### گزینه‌ها

| پارامتر      | توضیح                                | نوع       | پیش‌فرض |
| ------------ | ------------------------------------ | --------- | ------- |
| `urlencoded` | اینکه رمزگشایی نشانی انجام شود یا نه | `boolean` | `true`  |

## نمونه

### کاربرد پایه

```js
import { clearStr } from 'ranuts';

const str = '  "hello world"  ';
const cleaned = clearStr(str);
console.log(cleaned); // 'hello world'
```

### رشتهٔ کدگذاری‌شده برای نشانی

```js
import { clearStr } from 'ranuts';

const encoded = '  "hello%20world"  ';
const cleaned = clearStr(encoded);
console.log(cleaned); // 'hello world' (خودبه‌خود رمزگشایی شد)
```

### خاموش کردن رمزگشایی نشانی

```js
import { clearStr } from 'ranuts';

const str = '  "hello%20world"  ';
const cleaned = clearStr(str, { urlencoded: false });
console.log(cleaned); // 'hello%20world' (رمزگشایی نشد)
```

### گیومه‌ها

```js
import { clearStr } from 'ranuts';

const str1 = "'test'";
const str2 = '"test"';
console.log(clearStr(str1)); // 'test'
console.log(clearStr(str2)); // 'test'
```

## یادداشت‌ها

1. **چه چیزی برداشته می‌شود**: فاصله‌های دو سر و گیومه‌های تکی و دوتایی.
2. **رمزگشایی نشانی**: به‌طور پیش‌فرض انجام می‌شود و با `urlencoded: false` می‌توان خاموشش کرد.
3. **کاربرد**: معمولاً برای پاک کردن ورودی کاربر یا مقدارهایی که از پارامترهای نشانی بیرون کشیده شده‌اند به کار می‌رود.
