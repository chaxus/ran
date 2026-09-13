---
description: 'زبان طراحی ranui و مرجع کامل توکن‌هایش: هر توکن سراسری `--ran-*`، همراه با نردبان رنگ Geist در حالت روشن و تیره، نقش‌های معنایی، فاصله، اندازه، تایپوگرافی، شعاع گوشه، ارتفاع سایه، چیدمان لایه‌ها، حرکت، فوکوس و ابتدایی‌های پوسته.'
---

# سیستم طراحی

**زبان طراحی**ای که ranui از آن ساخته شده، و فهرست **کامل** توکن‌هایی که آن را بیان می‌کنند: هر ویژگی سفارشی سراسری `--ran-*` که کتابخانه اعلام می‌کند، با مقدارش در هر دو پوسته. کامپوننت‌ها به‌جای نوشتن مقدار ثابت این توکن‌ها را می‌خوانند، پس بازنویسی یک توکن، ظاهر هر چیزی را که آن را مصرف می‌کند عوض می‌کند.

چهار صفحه به چهار پرسش متفاوت پاسخ می‌دهند و عمداً از هم جدا مانده‌اند:

| صفحه                                          | پاسخ می‌دهد به                                   |
| --------------------------------------------- | ------------------------------------------------ |
| **سیستم طراحی** (همین صفحه)                   | توکن‌ها _چیستند_: واژگان                         |
| [راهنمای طراحی](/fa/src/ranui/design-guides/) | هنگام ساختن یک صفحه، _چگونه_ میانشان انتخاب کنیم |
| [معماری اطلاعات](/fa/src/ranui/information-architecture/) | خودِ صفحه باید _چه شکلی_ داشته باشد |
| [پوسته‌بندی](/fa/src/ranui/theme/)            | _چگونه_ در زمان اجرا عوض و بازنویسی‌شان کنیم     |

> **کجا به کار می‌آید:** وقتی نام یا مقدار یک توکن را لازم دارید (نقش یک رنگ، پله‌ای از فاصله، اندازه یک آیکن، رده‌ای از سایه، منحنی شتاب) یا می‌خواهید بدانید چرا مقیاس‌ها همین شکل را دارند.

## زبان: Geist

توکن‌های ranui بر پایه [Geist](https://vercel.com/geist) است، سیستم طراحی متن‌باز Vercel. هر مقیاس رنگ یک نردبان از وظیفه‌های ثابت است، برای هر پله یکی، نه مجموعه‌ای از سایه‌ها که از میانشان انتخاب کنید: پله ۲۰۰ «خاکستریِ کمی تیره‌تر» نیست، «پس‌زمینه هاور» است. وقتی وظیفه یک پله تثبیت شد، انتخاب رنگ برای یک حالت تعاملی به‌جای داوری، به یک جست‌وجو تبدیل می‌شود.

ranui همان نردبان را به‌شکل مقیاس‌های `--ran-*` خود برمی‌دارد، توکن‌های معنایی را رویش می‌گذارد، و **Geist Sans / Geist Mono** را به‌عنوان قلم‌های پیش‌فرض همراه می‌آورد.

## دو لایه {#two-layers}

**لایه ۱: پالت پایه.** همان مقیاس‌های خام پایین. به‌ندرت مستقیم مصرف می‌شوند.

**لایه ۲: توکن‌های معنایی.** `--ran-color-*` و هم‌خانواده‌هایش، که روی لایه ۱ نگاشت شده‌اند. **همین لایه را مصرف کنید.** حالت تیره تنها لایه ۱ را از نو تعریف می‌کند، پس هر توکن معنایی از راه `var()` می‌چرخد و هیچ‌جای کتابخانه بازنویسیِ تیرهٔ کامپوننت‌به‌کامپوننت وجود ندارد.

```
--ran-gray-1000        →  #171717 (روشن) / #ededed (تیره)        ← لایه ۱، می‌چرخد
--ran-color-text       →  var(--ran-gray-1000)                    ← لایه ۲، دنبال می‌کند
--ran-btn-color        →  var(--ran-color-text, …)                ← توکن کامپوننت
```

همین زنجیره تمام معماری است: یک پله پایه را عوض کنید و همه‌جا منتشر می‌شود؛ یک توکن معنایی را عوض کنید و یک نقش عوض می‌شود؛ یک توکن کامپوننت را عوض کنید و یک عنصر عوض می‌شود.

## رنگ

### نردبان {#the-ladder}

هر مقیاس رنگ از `100` تا `1000` می‌رود و هر پله یک وظیفه ثابت دارد:

| پله | نقش                 | پله  | نقش                     |
| --- | ------------------- | ---- | ----------------------- |
| 100 | پس‌زمینه پیش‌فرض    | 600  | کادر در حالت فشرده      |
| 200 | پس‌زمینه هاور       | 700  | پرشدگی توپر (دکمه/نشان) |
| 300 | پس‌زمینه حالت فشرده | 800  | پرشدگی توپر (هاور)      |
| 400 | کادر پیش‌فرض        | 900  | متن و آیکن ثانویه       |
| 500 | کادر هاور           | 1000 | متن و آیکن اصلی         |

### پس‌زمینه‌ها

| توکن                   | روشن                                                            | تیره                                                            | کاربرد           |
| ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | ---------------- |
| `--ran-background-100` | <span class="swatch" style="--swatch:#ffffff"></span> `#ffffff` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | پس‌زمینه صفحه    |
| `--ran-background-200` | <span class="swatch" style="--swatch:#fafafa"></span> `#fafafa` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | نواحی ملایم صفحه |

### خاکستری — `--ran-gray-100..1000`

مقیاسی که پشت متن و کادرها و سطح‌ها ایستاده است.

| پله  | روشن                                                            | تیره                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#f2f2f2"></span> `#f2f2f2` | <span class="swatch" style="--swatch:#1a1a1a"></span> `#1a1a1a` |
| 200  | <span class="swatch" style="--swatch:#ebebeb"></span> `#ebebeb` | <span class="swatch" style="--swatch:#1f1f1f"></span> `#1f1f1f` |
| 300  | <span class="swatch" style="--swatch:#e6e6e6"></span> `#e6e6e6` | <span class="swatch" style="--swatch:#292929"></span> `#292929` |
| 400  | <span class="swatch" style="--swatch:#eaeaea"></span> `#eaeaea` | <span class="swatch" style="--swatch:#2e2e2e"></span> `#2e2e2e` |
| 500  | <span class="swatch" style="--swatch:#c9c9c9"></span> `#c9c9c9` | <span class="swatch" style="--swatch:#454545"></span> `#454545` |
| 600  | <span class="swatch" style="--swatch:#a8a8a8"></span> `#a8a8a8` | <span class="swatch" style="--swatch:#878787"></span> `#878787` |
| 700  | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` |
| 800  | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` |
| 900  | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` | <span class="swatch" style="--swatch:#a0a0a0"></span> `#a0a0a0` |
| 1000 | <span class="swatch" style="--swatch:#171717"></span> `#171717` | <span class="swatch" style="--swatch:#ededed"></span> `#ededed` |

### خاکستری آلفا — `--ran-gray-alpha-100..1000`

نیمه‌شفاف است، پس روی هر سطحی می‌نشیند: انتخاب درست برای یک پرده، یک شست‌وشوی هاور، یا جداکننده‌ای که باید روی محتوای ناشناخته بنشیند.

| پله  | روشن                                                                         | تیره                                                                         |
| ---- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 100  | <span class="swatch is-alpha" style="--swatch:#0000000d"></span> `#0000000d` | <span class="swatch is-alpha" style="--swatch:#ffffff12"></span> `#ffffff12` |
| 200  | <span class="swatch is-alpha" style="--swatch:#00000015"></span> `#00000015` | <span class="swatch is-alpha" style="--swatch:#ffffff17"></span> `#ffffff17` |
| 300  | <span class="swatch is-alpha" style="--swatch:#0000001a"></span> `#0000001a` | <span class="swatch is-alpha" style="--swatch:#ffffff21"></span> `#ffffff21` |
| 400  | <span class="swatch is-alpha" style="--swatch:#00000014"></span> `#00000014` | <span class="swatch is-alpha" style="--swatch:#ffffff24"></span> `#ffffff24` |
| 500  | <span class="swatch is-alpha" style="--swatch:#00000036"></span> `#00000036` | <span class="swatch is-alpha" style="--swatch:#ffffff3d"></span> `#ffffff3d` |
| 600  | <span class="swatch is-alpha" style="--swatch:#0000003d"></span> `#0000003d` | <span class="swatch is-alpha" style="--swatch:#ffffff82"></span> `#ffffff82` |
| 700  | <span class="swatch is-alpha" style="--swatch:#00000070"></span> `#00000070` | <span class="swatch is-alpha" style="--swatch:#ffffff8a"></span> `#ffffff8a` |
| 800  | <span class="swatch is-alpha" style="--swatch:#00000082"></span> `#00000082` | <span class="swatch is-alpha" style="--swatch:#ffffff78"></span> `#ffffff78` |
| 900  | <span class="swatch is-alpha" style="--swatch:#000000b3"></span> `#000000b3` | <span class="swatch is-alpha" style="--swatch:#ffffff9c"></span> `#ffffff9c` |
| 1000 | <span class="swatch is-alpha" style="--swatch:#000000e8"></span> `#000000e8` | <span class="swatch is-alpha" style="--swatch:#ffffffeb"></span> `#ffffffeb` |

### آبی — `--ran-blue-100..1000`

برای پیوندها و حلقه فوکوس کنار گذاشته شده است.

| پله  | روشن                                                            | تیره                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#f0f7ff"></span> `#f0f7ff` | <span class="swatch" style="--swatch:#06193a"></span> `#06193a` |
| 200  | <span class="swatch" style="--swatch:#e9f4ff"></span> `#e9f4ff` | <span class="swatch" style="--swatch:#022248"></span> `#022248` |
| 300  | <span class="swatch" style="--swatch:#dfefff"></span> `#dfefff` | <span class="swatch" style="--swatch:#002f62"></span> `#002f62` |
| 400  | <span class="swatch" style="--swatch:#cae7ff"></span> `#cae7ff` | <span class="swatch" style="--swatch:#003674"></span> `#003674` |
| 500  | <span class="swatch" style="--swatch:#94ccff"></span> `#94ccff` | <span class="swatch" style="--swatch:#00418b"></span> `#00418b` |
| 600  | <span class="swatch" style="--swatch:#48aeff"></span> `#48aeff` | <span class="swatch" style="--swatch:#0090ff"></span> `#0090ff` |
| 700  | <span class="swatch" style="--swatch:#006bff"></span> `#006bff` | <span class="swatch" style="--swatch:#006efe"></span> `#006efe` |
| 800  | <span class="swatch" style="--swatch:#0059ec"></span> `#0059ec` | <span class="swatch" style="--swatch:#005be7"></span> `#005be7` |
| 900  | <span class="swatch" style="--swatch:#005ff2"></span> `#005ff2` | <span class="swatch" style="--swatch:#47a8ff"></span> `#47a8ff` |
| 1000 | <span class="swatch" style="--swatch:#002359"></span> `#002359` | <span class="swatch" style="--swatch:#eaf6ff"></span> `#eaf6ff` |

### قرمز — `--ran-red-100..1000`

خطر و ارور.

| پله  | روشن                                                            | تیره                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#ffeeef"></span> `#ffeeef` | <span class="swatch" style="--swatch:#330a11"></span> `#330a11` |
| 200  | <span class="swatch" style="--swatch:#ffe8ea"></span> `#ffe8ea` | <span class="swatch" style="--swatch:#440d13"></span> `#440d13` |
| 300  | <span class="swatch" style="--swatch:#ffe3e4"></span> `#ffe3e4` | <span class="swatch" style="--swatch:#5d0e17"></span> `#5d0e17` |
| 400  | <span class="swatch" style="--swatch:#ffd7d6"></span> `#ffd7d6` | <span class="swatch" style="--swatch:#6f101b"></span> `#6f101b` |
| 500  | <span class="swatch" style="--swatch:#ffb1b3"></span> `#ffb1b3` | <span class="swatch" style="--swatch:#88151f"></span> `#88151f` |
| 600  | <span class="swatch" style="--swatch:#ff676d"></span> `#ff676d` | <span class="swatch" style="--swatch:#f32e40"></span> `#f32e40` |
| 700  | <span class="swatch" style="--swatch:#fc0035"></span> `#fc0035` | <span class="swatch" style="--swatch:#f13242"></span> `#f13242` |
| 800  | <span class="swatch" style="--swatch:#ea001d"></span> `#ea001d` | <span class="swatch" style="--swatch:#e2162a"></span> `#e2162a` |
| 900  | <span class="swatch" style="--swatch:#d8001b"></span> `#d8001b` | <span class="swatch" style="--swatch:#ff565f"></span> `#ff565f` |
| 1000 | <span class="swatch" style="--swatch:#47000c"></span> `#47000c` | <span class="swatch" style="--swatch:#ffe9ed"></span> `#ffe9ed` |

### کهربایی — `--ran-amber-100..1000`

هشدارها.

| پله  | روشن                                                            | تیره                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#fff6de"></span> `#fff6de` | <span class="swatch" style="--swatch:#2a1700"></span> `#2a1700` |
| 200  | <span class="swatch" style="--swatch:#fff4cf"></span> `#fff4cf` | <span class="swatch" style="--swatch:#361900"></span> `#361900` |
| 300  | <span class="swatch" style="--swatch:#fff1c1"></span> `#fff1c1` | <span class="swatch" style="--swatch:#502800"></span> `#502800` |
| 400  | <span class="swatch" style="--swatch:#ffdc73"></span> `#ffdc73` | <span class="swatch" style="--swatch:#5b3000"></span> `#5b3000` |
| 500  | <span class="swatch" style="--swatch:#ffc543"></span> `#ffc543` | <span class="swatch" style="--swatch:#703e00"></span> `#703e00` |
| 600  | <span class="swatch" style="--swatch:#ffa600"></span> `#ffa600` | <span class="swatch" style="--swatch:#ed9a00"></span> `#ed9a00` |
| 700  | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` |
| 800  | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 900  | <span class="swatch" style="--swatch:#aa4d00"></span> `#aa4d00` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 1000 | <span class="swatch" style="--swatch:#561900"></span> `#561900` | <span class="swatch" style="--swatch:#fff3d5"></span> `#fff3d5` |

### سبز — `--ran-green-100..1000`

موفقیت.

| پله  | روشن                                                            | تیره                                                            |
| ---- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100  | <span class="swatch" style="--swatch:#ecfdec"></span> `#ecfdec` | <span class="swatch" style="--swatch:#002608"></span> `#002608` |
| 200  | <span class="swatch" style="--swatch:#e5fce7"></span> `#e5fce7` | <span class="swatch" style="--swatch:#00320b"></span> `#00320b` |
| 300  | <span class="swatch" style="--swatch:#d3fad1"></span> `#d3fad1` | <span class="swatch" style="--swatch:#003a0e"></span> `#003a0e` |
| 400  | <span class="swatch" style="--swatch:#b9f5bc"></span> `#b9f5bc` | <span class="swatch" style="--swatch:#004615"></span> `#004615` |
| 500  | <span class="swatch" style="--swatch:#82eb8d"></span> `#82eb8d` | <span class="swatch" style="--swatch:#006717"></span> `#006717` |
| 600  | <span class="swatch" style="--swatch:#4ce15e"></span> `#4ce15e` | <span class="swatch" style="--swatch:#00952d"></span> `#00952d` |
| 700  | <span class="swatch" style="--swatch:#28a948"></span> `#28a948` | <span class="swatch" style="--swatch:#00ac3a"></span> `#00ac3a` |
| 800  | <span class="swatch" style="--swatch:#279141"></span> `#279141` | <span class="swatch" style="--swatch:#009432"></span> `#009432` |
| 900  | <span class="swatch" style="--swatch:#107d32"></span> `#107d32` | <span class="swatch" style="--swatch:#00ca50"></span> `#00ca50` |
| 1000 | <span class="swatch" style="--swatch:#003a00"></span> `#003a00` | <span class="swatch" style="--swatch:#d8ffe4"></span> `#d8ffe4` |

### توکن‌های معنایی رنگ

لایه‌ای که کامپوننت‌ها واقعاً می‌خوانند. هرچه اینجاست از راه مقیاس‌های بالا حل می‌شود، پس خودش با پوسته می‌چرخد.

| توکن                           | حل می‌شود به                                                                                                                             | نقش                                   |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `--ran-color-bg`               | `--ran-background-100`                                                                                                                   | پس‌زمینه صفحه                         |
| `--ran-color-bg-subtle`        | `--ran-background-200`                                                                                                                   | نواحی ملایم صفحه                      |
| `--ran-color-bg-elevated`      | `--ran-background-100` · gray-100 (تیره)                                                                                                 | کارت‌ها، سطح‌ها                       |
| `--ran-color-bg-muted`         | `--ran-gray-100`                                                                                                                         | پرشدگی فرورفته یا خفه                 |
| `--ran-color-bg-hover`         | `--ran-gray-200`                                                                                                                         | سطح هاور                              |
| `--ran-color-bg-active`        | `--ran-gray-300`                                                                                                                         | سطح حالت فشرده                        |
| `--ran-color-text`             | `--ran-gray-1000`                                                                                                                        | متن اصلی                              |
| `--ran-color-text-secondary`   | `--ran-gray-900`                                                                                                                         | متن ثانویه                            |
| `--ran-color-text-disabled`    | `--ran-gray-700`                                                                                                                         | متن غیرفعال                           |
| `--ran-color-border`           | `--ran-gray-400`                                                                                                                         | کادر پیش‌فرض                          |
| `--ran-color-border-secondary` | `--ran-gray-300`                                                                                                                         | کادر ملایم‌تر                         |
| `--ran-color-border-hover`     | `--ran-gray-500`                                                                                                                         | کادر هاور                             |
| `--ran-color-border-active`    | `--ran-gray-600`                                                                                                                         | کادر حالت فشرده                       |
| `--ran-color-primary`          | `--ran-gray-1000`                                                                                                                        | کنش اصلی (تک‌رنگ)                     |
| `--ran-color-primary-hover`    | <span class="swatch" style="--swatch:#383838"></span> `#383838` · <span class="swatch" style="--swatch:#cccccc"></span> `#cccccc` (تیره) | هاورِ primary                         |
| `--ran-color-primary-active`   | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` · <span class="swatch" style="--swatch:#b3b3b3"></span> `#b3b3b3` (تیره) | فشردنِ primary                        |
| `--ran-color-primary-text`     | `--ran-background-100`                                                                                                                   | جوهری که **روی** سطح primary می‌نشیند |
| `--ran-color-success`          | `--ran-green-700`                                                                                                                        | موفقیت                                |
| `--ran-color-warning`          | `--ran-amber-700`                                                                                                                        | هشدار                                 |
| `--ran-color-danger`           | `--ran-red-700`                                                                                                                          | خطر / ارور                            |
| `--ran-color-link`             | `--ran-blue-700`                                                                                                                         | پیوندها                               |

`--ran-color-primary-hover` / `-active` دو مقدار ثابت لایه معنایی‌اند: به‌جای حرکت در طول یک مقیاس، به‌سوی پس‌زمینه صفحه گام برمی‌دارند، پس حالت تیره مستقیم از نو تعریفشان می‌کند.

### هر رنگ تأکیدی چه معنایی دارد

- **primary تک‌رنگ است**: در روشن سیاه روی سفید، در تیره سفید روی سیاه (لحن برند Geist، `<r-button type="primary">`). متن و آیکن‌های رویش `--ran-color-primary-text` را به کار می‌برند که همراهش می‌چرخد. توکن جداگانه‌ای برای «کنتراست» نیست: primary _خودش_ پرکنتراست‌ترین کنش است.
- **آبی کنار گذاشته شده** برای پیوندها (`--ran-color-link`) و حلقه فوکوس. جایگزینی برای primary نیست.
- **سبز = موفقیت · کهربایی = هشدار · قرمز = خطر.** هرکدام یک معنا.

چیزی به نام `--ran-color-error` وجود ندارد؛ توکن `--ran-color-danger` است. `var()`ی که ویژگی اعلام‌نشده‌ای را نام ببرد به هیچ حل نمی‌شود و کل اعلان بی‌صدا دور ریخته می‌شود؛ به همین دلیل ارزش دارد نام مشکوک را به‌جای حدس زدن با همین جدول بسنجید.

## فاصله {#spacing}

شکاف میان چیزها: `padding`، `margin`، `gap`. واحد پایه ۴ پیکسل با **نه مقدار**، نه بیشتر:

| توکن            | مقدار | توکن             | مقدار |
| --------------- | ----- | ---------------- | ----- |
| `--ran-space-1` | 4px   | `--ran-space-8`  | 32px  |
| `--ran-space-2` | 8px   | `--ran-space-10` | 40px  |
| `--ran-space-3` | 12px  | `--ran-space-16` | 64px  |
| `--ran-space-4` | 16px  | `--ran-space-24` | 96px  |
| `--ran-space-6` | 24px  |                  |       |

عدد، ضریب ۴ پیکسل است، پس مقیاس می‌پرد: `--ran-space-5` وجود ندارد. نکته همین است: مجموعه‌ای محدود همان چیزی است که ریتم یک صفحه را می‌سازد.

## اندازه

ابعاد خودِ عنصر: اندازه آیکن، ارتفاع کنترل، کنترل‌های کوچک مربعی یا مستطیلی.

| توکن           | مقدار | معمولاً                          |
| -------------- | ----- | -------------------------------- |
| `--ran-size-1` | 16px  | جعبه چک‌باکس، آیکن کوچک درون‌خطی |
| `--ran-size-2` | 18px  | —                                |
| `--ran-size-3` | 20px  | آیکن درون یک کنترل               |
| `--ran-size-4` | 24px  | دکمه آیکنی در نوار ابزار         |
| `--ran-size-5` | 28px  | ارتفاع کنترل فشرده               |
| `--ran-size-6` | 30px  | —                                |
| `--ran-size-7` | 32px  | ارتفاع پیش‌فرض کنترل             |

**این عمداً مقیاسی جدا از فاصله است** و قاطی کردنشان خطایی است که ماشین می‌گیرد (`sizing-scale`). این دو دامنه و پیشرَوی متفاوتی دارند (مقیاس فاصله‌ای که از ۴ پیکسل دوبرابر می‌شود، برای اندازه آیکن و کنترل مقدارهای ناجوری می‌دهد) و مصرف‌کننده باید بتواند یکی را کوک کند بی‌آنکه دیگری را به هم بزند: بزرگ‌تر شدن یک آیکن نباید هر شکافی را هم که اتفاقاً همان مقدار پیکسلی را دارد پهن کند. اگر پله‌ای عددی با پله‌ای از فاصله یکی درآید (`--ran-size-4` و `--ran-space-6` هر دو ۲۴ پیکسل‌اند) این تصادف است، نه هم‌نامی.

بُعدی که واقعاً یک‌باره است و هیچ کامپوننت دیگری در آن شریک نیست (مثلاً `min-width` یک منو) به‌جای اینکه به زور در یک پله جا داده شود، همان توکن سادهٔ کامپوننت با مقدار جایگزین ثابت خودش می‌ماند.

## تایپوگرافی {#typography}

| توکن                | مقدار                                                         |
| ------------------- | ------------------------------------------------------------- |
| `--ran-font-family` | Geist / Geist Sans، و سپس پشته رابط سیستم                     |
| `--ran-font-mono`   | Geist Mono، و سپس `ui-monospace`، SF Mono، Menlo، Consolas، … |
| `--ran-font-size`   | `14px` (اندازه پایه)                                          |
| `--ran-line-height` | `1.5715`                                                      |

متن بر پایه **نقش** سامان می‌یابد و نقش، قلم و اندازه و وزن و ارتفاع خط را با هم تعیین می‌کند:

| نقش         | کاربرد                 | توکن وزن                                                                       | توکن‌های اندازه                           |
| ----------- | ---------------------- | ------------------------------------------------------------------------------ | ----------------------------------------- |
| **heading** | عنوان‌ها               | `--ran-text-heading-weight` (600)                                              | `--ran-text-heading-1..4` (32/24/20/16px) |
| **label**   | تک‌خطی، برای مرور سریع | `--ran-text-label-weight` (500)                                                | `--ran-text-label-1..3` (14/13/12px)      |
| **copy**    | بدنه چندخطی            | `--ran-text-copy-weight` (400)                                                 | `--ran-text-copy-1..2` (16/14px)          |
| **button**  | متن دکمه               | `--ran-text-button-weight` (500)                                               | `--ran-text-button-size` (14px)           |
| **mono**    | کد، داده، پیش‌عنوان    | `--ran-text-mono-weight-regular` (400) / `--ran-text-mono-weight-medium` (500) | اندازه‌های label / copy را قرض می‌گیرد    |

دو توکن فقط برای اینکه یک نقش درست بنشیند وجود دارند:

| توکن                            | مقدار     | چرا                                                           |
| ------------------------------- | --------- | ------------------------------------------------------------- |
| `--ran-text-heading-tracking`   | `-0.03em` | عنوان‌ها در اندازه‌های بزرگ به فاصله حروفِ تنگ‌تر نیاز دارند. |
| `--ran-text-button-line-height` | `1`       | وسط‌چینی عمودیِ تمیز درون کنترلی با ارتفاع ثابت.              |

Geist سقف وزن را روی ۶۰۰ (سمی‌بولد) می‌گذارد. تأکید از اندازه و فاصله می‌آید نه از قلمی سنگین‌تر. `--ran-text-copy-3` وجود ندارد: پله ۱۲ پیکسل همان `--ran-text-label-3` است.

### قلم‌ها

ranui هر دو قلم را خودش میزبانی می‌کند (وزن متغیر ۱۰۰ تا ۹۰۰، SIL OFL 1.1)، پس یک import آن‌ها را بدون وابستگی به CDN بار می‌کند:

```js
import 'ranui/fonts'; // برای باندلرها
```

```html
<link rel="stylesheet" href="…/ranui/dist/fonts/fonts.css" />
```

بدون آن، توکن‌ها به پشته‌های قلم سیستم برمی‌گردند؛ همه‌چیز باز هم کار می‌کند، فقط بدون قلم‌های Geist.

## شعاع گوشه

| توکن                | مقدار    | کاربرد                          |
| ------------------- | -------- | ------------------------------- |
| `--ran-radius-sm`   | `6px`    | کنترل‌ها: دکمه، ورودی، انتخابگر |
| `--ran-radius-md`   | `12px`   | کارت‌ها، دیالوگ‌ها              |
| `--ran-radius-lg`   | `16px`   | سطح‌های بزرگ                    |
| `--ran-radius-full` | `9999px` | قرص‌ها، آواتارها                |

## ارتفاع سایه

سایه یک **نقش** است، نه تزئین. رده را بر پایه اینکه عنصر چیست انتخاب کنید. حالت تیره هر سه را جایگزین می‌کند، چون سایه‌ای که برای صفحه سفید کوک شده روی صفحه سیاه ناپدید می‌شود.

| توکن                    | کاربرد                                                               | روشن                                                            | تیره                                                                                        |
| ----------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `--ran-shadow-elevated` | سطح‌هایی که در جریان صفحه‌اند و کادر هم دارند: `r-card`، `r-section` | `0 1px 2px rgba(0,0,0,.04), 0 2px 4px -2px rgba(0,0,0,.05)`     | `0 1px 2px rgba(0,0,0,.16)`                                                                 |
| `--ran-shadow-menu`     | لایه‌های گذرا روی محتوا: منوی کشویی، انتخابگر، پاپ‌اور، اعلان        | `0 2px 4px rgba(0,0,0,.05), 0 8px 24px -6px rgba(0,0,0,.14)`    | `0 1px 1px rgba(0,0,0,.2), 0 4px 8px -4px rgba(0,0,0,.4), 0 16px 24px -8px rgba(0,0,0,.5)`  |
| `--ran-shadow-modal`    | دیالوگ‌هایی که راه را می‌بندند: `r-modal`                            | `0 4px 12px rgba(0,0,0,.08), 0 20px 48px -12px rgba(0,0,0,.22)` | `0 1px 1px rgba(0,0,0,.2), 0 8px 16px -4px rgba(0,0,0,.4), 0 24px 32px -8px rgba(0,0,0,.5)` |

لایه‌های بی‌کادر برای جدا شدن تنها به سایه تکیه می‌کنند، پس رده‌های لایه شناور وزن واقعی دارند؛ لایه‌ای که به رده برجسته سقوط کند تخت به نظر می‌رسد و انگار به صفحه سنجاق شده است.

## چیدمان لایه‌ها {#stacking}

لایه‌های شناور به `<body>` پرتال می‌شوند، پس به رده‌ای صریح نیاز دارند:

| توکن               | پیش‌فرض | کاربرد                                                                                 |
| ------------------ | ------- | -------------------------------------------------------------------------------------- |
| `--ran-z-modal`    | `1000`  | دیالوگ‌هایی که راه را می‌بندند و ماسکشان                                               |
| `--ran-z-dropdown` | `1100`  | منوی کشویی / انتخابگر / پاپ‌اور: **بالای** مودال، تا انتخابگرِ درون یک دیالوگ دیده شود |
| `--ran-z-message`  | `1200`  | اعلان‌ها و آگاهی‌ها: همیشه بالاتر از همه                                               |

نردبان از ۱۰۰۰ آغاز می‌شود تا از قاب معمول صفحه بگذرد (نوارهای ناوبری و پرده‌ها معمولاً در دهگان‌اند). یک رده را روی `:root` بازنویسی کنید، یا به تفکیک کامپوننت (`--ran-dropdown-host-z-index`، `--ran-modal-root-z-index`، `--ran-message-z-index`)، اما هرگز با `!important`.

## حرکت

| توکن                         | مقدار   | کاربرد                    |
| ---------------------------- | ------- | ------------------------- |
| `--ran-motion-duration-fast` | `0.15s` | گذارهای حالت هاور و فشرده |
| `--ran-motion-duration-base` | `0.2s`  | پاپ‌اورها، منوها          |
| `--ran-motion-duration-slow` | `0.35s` | نمایان‌شدن‌های بزرگ‌تر    |

| توکن شتاب                    | منحنی                               | خصلت                                   |
| ---------------------------- | ----------------------------------- | -------------------------------------- |
| `--ran-motion-ease-standard` | `cubic-bezier(0.645,0.045,0.355,1)` | رفت و برگشت، همه‌کاره                  |
| `--ran-motion-ease-snappy`   | `cubic-bezier(0.33,0,0.15,1)`       | سریع و بدون رد شدن از هدف: کلیدها      |
| `--ran-motion-ease-spring`   | `cubic-bezier(0.34,1.26,0.5,1)`     | رد شدن اندک از هدف: دکمه‌ها، کارت‌ها   |
| `--ran-motion-ease-bouncy`   | `cubic-bezier(0.34,1.56,0.64,1)`    | رد شدن بازیگوشانه: لایک، افزودن به سبد |
| `--ran-motion-ease-smooth`   | `cubic-bezier(0.4,0,0.2,1)`         | آرام و بدون رد شدن: نمایان‌شدن، چیدمان |

خانواده spring از فنرهای کوک‌شده SwiftUI تقطیر شده است (response/damping به یک بزیهٔ تک‌گذر از هدف فرو کاسته شده).

**این‌ها را تنها با ویژگی‌های حرکتی جفت کنید**: `transform`، `opacity`، هندسه جعبه. ویژگی‌های پالت (`background-color`، `color`، `border-color`، `box-shadow`، `fill`، `stroke`) عمداً هیچ گذار پیش‌فرضی ندارند، چون CSS نمی‌تواند تعامل را از چرخش پوسته تشخیص دهد: هر محوی که به یک رنگ بیفزایید، هنگام تعویض روشن↔تیره هم شلیک می‌شود. با این حال هر کامپوننت یک قلاب `--ran-*-transition` دارد، اگر خواستید دوباره روشنش کنید.

## فوکوس

| توکن                             | مقدار                                                                | برای                                            |
| -------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| `--ran-focus-ring`               | `0 0 0 2px var(--ran-background-100), 0 0 0 4px var(--ran-blue-700)` | حلقه استاندارد، به‌شکل `box-shadow`             |
| `--ran-focus-ring-inverse-color` | `#fff`                                                               | رنگ حلقه برای سطحی که در _هر دو_ پوسته تیره است |

حلقه دو لایه است: یک حلقه درونی به رنگ پس‌زمینه و یک حلقه بیرونی آبی؛ پس روی هر سطحی دیده می‌شود و به‌جای دنبال‌کردنِ primaryِ حالا تک‌رنگ، آبی می‌ماند.

`--ran-focus-ring-inverse-color` **عمداً در حالت تیره از نو تعریف نمی‌شود**: برای کامپوننتی هست که سطح خودش صرف‌نظر از پوسته صفحه همیشه تیره است (نوار کنترل `r-player` روی هر ویدیویی) و آن سطح با تغییر صفحه عوض نمی‌شود.

## ابتدایی‌های پوسته

همان چند مقدار ساختاری که کامپوننت‌ها مشترک دارند و رنگ و اندازه و متن نیستند. عمداً کمینه نگه داشته شده‌اند: این لایه زمانی خیلی بزرگ‌تر بود و بیشترش همراه بسته‌های پوسته برداشته شد.

| توکن                            | مقدار                        | برای                                                                               |
| ------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------- |
| `--ran-skin-border-width`       | `1px`                        | ضخامت کادری که کامپوننت‌ها می‌کشند                                                 |
| `--ran-skin-border-style`       | `solid`                      | سبک کادری که کامپوننت‌ها می‌کشند                                                   |
| `--ran-skin-border-image-width` | `4px`                        | تورفتگی `border-image-slice` که button/checkbox/input/modal/message در آن شریک‌اند |
| `--ran-skin-raised-shadow`      | `var(--ran-shadow-elevated)` | سایه سطح برجسته، با یک واسطه تا پوسته بتواند عوضش کند                              |
| `--ran-skin-font-family`        | `var(--ran-font-family)`     | قلمی که کامپوننت‌ها به کار می‌برند، با همان واسطه                                  |

## حالت تیره چه چیزی را از نو تعریف می‌کند

`data-ran-theme="dark"` روی `<html>` (یا روی هر زیردرختی، [پوسته‌بندی](/fa/src/ranui/theme/) را ببینید) **فقط پالت پایه** را از نو تعریف می‌کند، با سه استثنا که از راه یک مقیاس حل نمی‌شوند:

- تمام لایه ۱: هر پله خاکستری، خاکستری آلفا، آبی، قرمز، کهربایی و سبز، و هر دو پس‌زمینه؛
- `--ran-color-bg-elevated` که در تیره به `--ran-gray-100` اشاره می‌کند تا کارت از صفحه سیاه بالا بیاید نه اینکه در آن گم شود؛
- `--ran-color-primary-hover` / `-active` که مقدار ثابت‌اند نه ارجاع به مقیاس؛
- هر سه رده سایه، که برای زمینه تیره از نو کوک شده‌اند.

باقی همه‌چیز (هر توکن معنایی دیگر، هر اندازه، هر مدت) یک بار تعریف می‌شود.

## توکن‌های کامپوننت

پایین‌تر از لایه معنایی، هر کامپوننت قلاب‌های خودش را با این نام‌گذاری در اختیار می‌گذارد:

```
--ran-{component}-{element}[-{state}]-{property}
```

مثلاً `--ran-btn-hover-background`، `--ran-select-search-active-border-width`. این‌ها به‌طور پیش‌فرض به توکن‌های معنایی برمی‌گردند: `var(--ran-btn-background, var(--ran-color-primary, #171717))`؛ پس بازنویسی یک توکن معنایی به همه‌شان می‌رسد و بازنویسی یک توکن کامپوننت، تغییر را به یک عنصر محدود می‌کند.

فهرست کاملِ تولیدشده در [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md) در مخزن است؛ API به‌تفکیک عنصر [اینجاست](/fa/src/ranui/api). برای شیوه اعمالشان [پوسته‌بندی](/fa/src/ranui/theme/#customizing-tokens) را ببینید.

## به‌کارگیری توکن‌ها در CSS خودتان {#using-tokens-in-your-own-css}

```css
.panel {
  background: var(--ran-color-bg-elevated);
  color: var(--ran-color-text);
  border: var(--ran-skin-border-width) var(--ran-skin-border-style) var(--ran-color-border);
  border-radius: var(--ran-radius-md);
  padding: var(--ran-space-4);
  box-shadow: var(--ran-shadow-elevated);
}
```

سه قاعده آن را در حالت تیره امن نگه می‌دارد:

1. برای هرچه باید از پوسته پیروی کند **هیچ کد شانزده‌شانزدهی خامی ننویسید**.
2. **مقدار جایگزین باید توکنی را نام ببرد که می‌چرخد**: `var(--ran-color-text, var(--ran-gray-1000))`، نه `var(--ran-color-text, #171717)`.
3. **مقدار جایگزین باید توکنی موجود را نام ببرد**، وگرنه اعلان دور ریخته می‌شود و عنصر بی‌صدا همان چیزی را که به ارث برده نگه می‌دارد.

> هر توکن سراسری‌ای که کتابخانه اعلام می‌کند در همین صفحه فهرست شده، و اگر توکنی بدون مستندسازی در اینجا افزوده شود یک تست واحد شکست می‌خورد. توکن‌های محدود به کامپوننت جداگانه تولید می‌شوند، در [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md).
