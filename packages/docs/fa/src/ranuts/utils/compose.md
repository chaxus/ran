# compose

چند تابع میان‌افزار را در یکی می‌آمیزد که آن‌ها را پشت سر هم می‌دواند؛ هر کدام بستر و یک `next` می‌گیرند که زنجیره را ادامه می‌دهد. معمولاً برای ساختن سامانه‌های میان‌افزاری، مانند سبک Koa، به کار می‌رود.

## API

### compose

#### بازگشت

| آرگومان    | توضیح                   | نوع                     |
| ---------- | ----------------------- | ----------------------- |
| `Function` | تابع میان‌افزارِ آمیخته | `ComposedMiddleware<T>` |

#### پارامترها

| پارامتر      | توضیح                   | نوع                    | پیش‌فرض |
| ------------ | ----------------------- | ---------------------- | ------- |
| `middleware` | آرایهٔ توابع میان‌افزار | `Array<Middleware<T>>` | الزامی  |

#### نوع میان‌افزار

```typescript
type Middleware<T> = (context: T, next: Next) => any;
type Next = () => Promise<never> | Promise<void>;
```

## نمونه

### کاربرد پایه

```js
import { compose } from 'ranuts';

const middleware1 = async (ctx, next) => {
  console.log('میان‌افزار ۱ آغاز');
  await next();
  console.log('میان‌افزار ۱ پایان');
};

const middleware2 = async (ctx, next) => {
  console.log('میان‌افزار ۲ آغاز');
  await next();
  console.log('میان‌افزار ۲ پایان');
};

const middleware3 = async (ctx, next) => {
  console.log('میان‌افزار ۳ اجرا');
  ctx.data = 'پردازش‌شده';
};

const composed = compose([middleware1, middleware2, middleware3]);
const context = {};

await composed(context);
// خروجی:
// میان‌افزار ۱ آغاز
// میان‌افزار ۲ آغاز
// میان‌افزار ۳ اجرا
// میان‌افزار ۲ پایان
// میان‌افزار ۱ پایان

console.log(context.data); // 'پردازش‌شده'
```

### میان‌افزار پردازش درخواست

```js
import { compose } from 'ranuts';

// میان‌افزار ثبت رویداد
const logger = async (req, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  await next();
};

// میان‌افزار احراز هویت
const auth = async (req, next) => {
  if (!req.headers.authorization) {
    throw new Error('اجازه ندارید');
  }
  await next();
};

// میان‌افزاری که کار را انجام می‌دهد
const handler = async (req, next) => {
  req.response = { message: 'Hello World' };
};

const app = compose([logger, auth, handler]);

const request = {
  method: 'GET',
  url: '/api/users',
  headers: { authorization: 'Bearer token123' },
};

await app(request);
console.log(request.response); // { message: 'Hello World' }
```

### مدیریت خطا

```js
import { compose } from 'ranuts';

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('خطا:', error.message);
    ctx.error = error;
  }
};

const handler = async (ctx, next) => {
  throw new Error('پردازش شکست خورد');
};

const composed = compose([errorHandler, handler]);
const context = {};

await composed(context);
console.log(context.error); // Error: پردازش شکست خورد
```

## یادداشت‌ها

1. **ترتیب اجرا**: میان‌افزارها به ترتیب آرایه اجرا می‌شوند و پس از فراخوانی `next()` نوبت به بعدی می‌رسد.
2. **پشتیبانی ناهمگام**: همهٔ میان‌افزارها باید ناهمگام باشند یا Promise برگردانند.
3. **فراخوانی `next()`**: برای رفتن به میان‌افزار بعدی باید درون میان‌افزار `next()` را صدا بزنید.
4. **فراخوانی چندباره**: `next()` را نمی‌توان چند بار صدا زد، وگرنه خطا پرتاب می‌شود.
5. **انتقال بستر**: داده میان میان‌افزارها از راه شیء `context` رد و بدل می‌شود.
