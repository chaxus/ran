# TOTP

سازندهٔ گذرواژهٔ یک‌بارمصرفِ زمان‌بنیاد، بر پایهٔ استاندارد RFC 6238. برای ساختن کدهای تأیید متغیر به کار می‌رود و در احراز هویت دومرحله‌ای (2FA) رایج است.

## API

### TOTP.generate

یک گذرواژهٔ یک‌بارمصرفِ زمان‌بنیاد می‌سازد.

#### بازگشت

| آرگومان | توضیح | نوع |
| --------- | ------------------------------------------- | ---------------------------------- |
| `Object` | شیئی دربردارندهٔ OTP و زمان انقضا | `{ otp: string, expires: number }` |
| `otp` | رشتهٔ گذرواژهٔ یک‌بارمصرفِ ساخته‌شده | `string` |
| `expires` | برچسب زمانی (میلی‌ثانیه) که OTP در آن منقضی می‌شود | `number` |

#### پارامترها

| پارامتر | توضیح | نوع | پیش‌فرض |
| --------- | -------------------------------- | --------- | --------- |
| `key` | کلید محرمانه، همچون رشتهٔ کدشده با Base32 | `string` | الزامی |
| `options` | پیکربندی اختیاری | `Options` | پایین‌تر را ببینید |

#### گزینه‌ها

| پارامتر | توضیح | نوع | پیش‌فرض |
| ----------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| `digits` | تعداد رقم‌های OTP | `number` | `6` |
| `algorithm` | الگوریتم درهم‌سازی | `'SHA-1' \| 'SHA-224' \| 'SHA-256' \| 'SHA-384' \| 'SHA-512' \| 'SHA3-224' \| 'SHA3-256' \| 'SHA3-384' \| 'SHA3-512'` | `'SHA-1'` |
| `period` | درازای پنجرهٔ زمانی (ثانیه) | `number` | `30` |
| `timestamp` | برچسب زمانی (میلی‌ثانیه) که OTP بر پایهٔ آن ساخته می‌شود | `number` | `Date.now()` |

## نمونه

### کاربرد پایه

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP'; // کلید محرمانهٔ کدشده با Base32
const result = TOTP.generate(secret);

console.log(result.otp); // برای نمونه: '341128'
console.log(result.expires); // برای نمونه: 1465324730000 (برچسب زمانی)
```

### تغییر تعداد رقم‌ها

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { digits: 8 });

console.log(result.otp); // برای نمونه: '43341128' (۸ رقم)
```

### تغییر پنجرهٔ زمانی

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { period: 60 }); // پنجرهٔ ۶۰ ثانیه‌ای

console.log(result.otp);
console.log(result.expires);
```

### به کار بردن الگوریتم درهم‌سازی دیگر

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { algorithm: 'SHA-512' });

console.log(result.otp);
```

### ساخت OTP با برچسب زمانی مشخص

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const timestamp = 1465324707000; // برچسب زمانی ۲۰۱۶-۰۶-۰۸
const result = TOTP.generate(secret, { timestamp });

console.log(result.otp); // OTPِ ساخته‌شده بر پایهٔ برچسب زمانی داده‌شده
```

### ترکیب چند گزینه

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, {
  digits: 8,
  algorithm: 'SHA-256',
  period: 60,
});

console.log(result.otp);
console.log(result.expires);
```

## یادداشت‌ها

۱. **قالب کلید**: کلید باید رشته‌ای کدشده با Base32 باشد. اگر نویسه‌های نامعتبر داشته باشد، خطای `'Invalid base32 character in key'` پرتاب می‌شود.

۲. **هم‌زمانی ساعت‌ها**: TOTP به هم‌زمان بودن ساعت‌ها تکیه دارد. مطمئن شوید ساعت کارخواه و سرور با هم می‌خوانند، وگرنه ممکن است تأیید شکست بخورد.

۳. **زمان انقضا**: `expires` برچسب زمانی پایان پنجرهٔ کنونی را می‌دهد. هنگام تأیید معمولاً به اندازهٔ یک پنجره اغماض می‌گذارند (مثلاً ±۱ دوره).

۴. **امنیت**: کلیدها را باید امن نگه داشت و در کد ننوشت. توصیه می‌شود از متغیرهای محیطی یا سامانه‌ای امن برای مدیریت کلید استفاده کنید.
