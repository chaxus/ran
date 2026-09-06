# resolveLocale

از میان زبان‌هایی که پشتیبانی می‌کنید، برمی‌گزیند کدام به کار رود؛ آن هم با همان زنجیرهٔ همیشگی: **پرس‌وجو ← کوکی ← localStorage ← navigator ← مقدار پشتیبان**.

فهرست پیام‌ها از آنِ شماست؛ این تنها کلیدش را برمی‌گزیند.

## API

### resolveLocale(options)

| گزینه          | توضیح                                                                                      | نوع                 | پیش‌فرض        |
| -------------- | ------------------------------------------------------------------------------------------ | ------------------- | -------------- |
| `supported`    | زبان‌هایی که واقعاً عرضه می‌کنید، از مشخص‌ترین به بقیه                                     | `readonly string[]` | الزامی         |
| `fallback`     | وقتی هیچ‌چیز نخواند، این برمی‌گردد                                                         | `string`            | `supported[0]` |
| `query`        | پارامتر پرس‌وجویی که گزینشِ صریح را می‌آورد، مانند `lang`                                  | `string`            | —              |
| `cookie`       | نام کوکی‌ای که گزینش را می‌آورد                                                            | `string`            | —              |
| `storageKey`   | کلید localStorage که واپسین گزینش کاربر در آن است                                          | `string`            | —              |
| `useNavigator` | آیا پیش از افتادن به مقدار پشتیبان، `navigator.languages` و `navigator.language` دیده شوند | `boolean`           | `true`         |
| `url`          | نشانی‌ای که پرس‌وجو از آن خوانده می‌شود                                                    | `string`            | مکان کنونی     |

#### بازگشت

همان درایهٔ `supported` که خوانده است: همیشه یکی از آن‌ها، و هرگز رشته‌ای دلبخواه.

## نمونه

### زنجیرهٔ کامل

```js
import { resolveLocale } from 'ranuts';

const locale = resolveLocale({
  supported: ['en', 'zh-CN'],
  query: 'lang',
  cookie: 'lang',
  storageKey: 'app-lang',
});

document.documentElement.lang = locale;
render(messages[locale]);
```

### گونه‌های منطقه‌ای به زبان پایه می‌افتند

```js
import { resolveLocale } from 'ranuts';

const supported = ['en', 'zh-CN'];

resolveLocale({ supported, query: 'lang', url: '?lang=en-GB' }); // 'en'
resolveLocale({ supported, query: 'lang', url: '?lang=zh' }); // 'zh-CN'
resolveLocale({ supported, query: 'lang', url: '?lang=de' }); // 'en'  (پشتیبانی‌نشده ← مقدار پشتیبان)
```

### همراه با نشانی‌های زبان‌دار

```js
import { resolveLocale, createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }],
});

// آنچه نشانی از پیش می‌گوید مقدم است؛ وگرنه سراغ سلیقهٔ خود کاربر بروید.
const locale = paths.localeFromPath(location.pathname) ?? resolveLocale({ supported: ['en', 'zh-CN'] });
```

## یادداشت‌ها

1. **نکته همان ترتیب است.** `?lang=` در نشانی صریح است، دست‌به‌دست می‌شود و یک‌بارمصرف است، پس بر همه‌چیز می‌چربد. کوکی تصمیمی است که سرور هم می‌بیند، پس بر حالتی که تنها نزد کارخواه است می‌چربد. localStorage همان چیزی است که کاربر آخرین بار درون برنامه برگزیده. `navigator.language` تنها گمانی است دربارهٔ کسی که نخستین بار سر می‌زند. وارونه کردن این ترتیب همان اشکال کلاسیک را می‌سازد: پیوندِ به‌اشتراک‌گذاشته‌شده با `?lang=en` همچنان به زبان ذخیره‌شدهٔ گیرنده نمایش داده می‌شود.

2. **نتیجه همیشه یکی از `supported` است.** مقداری بیرون از فهرست، به‌جای بازگشت، نادیده گرفته می‌شود؛ پس می‌توان با نتیجه بی‌خطر فهرست پیام‌ها را نمایه کرد.

3. **تطبیق به بزرگی حروف کاری ندارد و به زبان پایه می‌افتد.** با `supported: ['en', 'zh-CN']`، مقدار `en-GB` به `en` و `zh` به `zh-CN` می‌خورد.

4. **`navigator.languages` به ترتیب دیده می‌شود**، نه فقط `navigator.language`: آن فهرست همان اولویت واقعی و رتبه‌بندی‌شدهٔ کاربر است و سرِ آن بارها بهترین تطبیقِ در دسترس نیست.

5. **هر سرچشمه بی‌سروصدا کنار می‌کشد.** نه `window`، نه `document.cookie`، نه localStorage: هر کدام صرفاً چیزی نمی‌افزاید، پس این زنجیره در SSR و در اسکریپت‌های زمان ساخت هم کار می‌کند.
