---
description: 'یک عنصر پایهٔ سطح‌پایین برای پنل شناور که جای‌گذاری و ترتیب لایه را فراهم می‌کند؛ همان بنایی که r-popover و r-select روی آن ساخته شده‌اند.'
---

# Dropdown

عنصری پایه و سطح‌پایین برای پنل شناور: سطحی گرد و برجسته با پیکانی جهت‌دار و اختیاری. ترتیب لایهٔ پوشش را با خود دارد و همان بنایی است که `r-popover` و `r-select` جای‌گذاری‌اش می‌کنند و به `<body>` می‌برند.

> **کجا به کارش ببرید**: وقتی برای ساختن پوشش‌هایی مثل popover یا منوی انتخاب، به پنلی شناور و سطح‌پایین نیاز دارید. `<r-dropdown>` ترتیب لایه و پیکان را با خود دارد، پس لازم نیست جای‌گذاری را دستی بنویسید.

## شروع سریع

### استفادهٔ پایه

<Demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">محتوای پنل شناور</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">محتوای پنل شناور</div>
</r-dropdown>
```

## مرجع API

### خصیصه‌ها

| خصیصه     | نوع      | پیش‌فرض | توضیح                                                               |
| --------- | -------- | ------- | ------------------------------------------------------------------- |
| `arrow`   | `string` | `''`    | سمت پیکان: `top`، `bottom`، `left`، `right`. اگر ندهید پیکانی نیست. |
| `transit` | `string` | `''`    | کلاس انیمیشن که تا وقتی ویژگی گذاشته شده روی پنل بازتاب می‌یابد     |
| `sheet`   | `string` | `''`    | CSS تزریق‌شده به shadow DOM کامپوننت                                |

### جهت پیکان `arrow`

روی یکی از ضلع‌های پنل پیکانی اشاره‌گر می‌کشد. اگر ویژگی را ندهید پیکانی نمایش نمی‌یابد.

<Demo column>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="top"</div>
  </r-dropdown>
  <r-dropdown arrow="bottom" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="bottom"</div>
  </r-dropdown>
  <r-dropdown arrow="left" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="left"</div>
  </r-dropdown>
  <r-dropdown arrow="right" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="right"</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">arrow="top"</div>
</r-dropdown>
<r-dropdown arrow="bottom">
  <div style="padding: 12px;">arrow="bottom"</div>
</r-dropdown>
<r-dropdown arrow="left">
  <div style="padding: 12px;">arrow="left"</div>
</r-dropdown>
<r-dropdown arrow="right">
  <div style="padding: 12px;">arrow="right"</div>
</r-dropdown>
```

### انیمیشن ورود `transit`

نام کلاسی از CSS که برای پخش انیمیشن ورود یا خروج روی پنل بازتاب می‌یابد. کامپوننت این‌ها را همراه دارد: `ran-dropdown-down-in` / `-down-out` / `-up-in` / `-up-out` / `-left-in` / `-left-out` / `-right-in` / `-right-out`.

کلاس دقیقاً به‌اندازهٔ ویژگی زنده می‌ماند: هرکس آن را می‌گذارد تصمیم می‌گیرد انیمیشن کی تمام شده، و برداشتن ویژگی کلاس را هم برمی‌دارد. (پیش‌تر خودش پس از حدود ۳۰۰ میلی‌ثانیه منقضی می‌شد؛ مدتی که کنار مقدار داخل شیوه‌نامه، در JS هم نگه داشته می‌شد. آن زمان‌سنج هرچه را که `transit` در لحظهٔ شلیک می‌گفت برمی‌داشت، نه کلاسی را که خودش افزوده بود؛ پس اگر در همان بازه جهت را برمی‌گرداندید، کلاس نخست برای همیشه روی پنل می‌ماند و `-in` و `-out` هر دو اعمال می‌شدند.)

`getAnimationTarget()` عنصری را برمی‌گرداند که انیمیشن واقعاً روی آن اجرا می‌شود. آن عنصر درون shadow root است، پس `getAnimations()` روی میزبان چیزی گزارش نمی‌کند و `{ subtree: true }` هم از مرز نمی‌گذرد. کدی که منتظر پایان گذار پنل است باید `getAnimationTarget()` را صدا بزند، نه اینکه در درخت shadow دنبال نام کلاس بگردد.

<Demo>
  <r-dropdown transit="ran-dropdown-down-in" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">هنگام اتصال با انیمیشن وارد می‌شود</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown transit="ran-dropdown-down-in">
  <div style="padding: 12px;">هنگام اتصال با انیمیشن وارد می‌شود</div>
</r-dropdown>
```

### استایل بیرونی `sheet`

کد CSS که به shadow DOM پنل تزریق می‌شود و از همان قرارداد `sheet` پیروی می‌کند که همهٔ کامپوننت‌های دیگر ranui دارند.

```html
<r-dropdown arrow="top" sheet=".ranui-dropdown { border: 1px solid #999; }">
  <div style="padding: 12px;">پنل با استایل دلخواه</div>
</r-dropdown>
```

## رویدادها

`r-dropdown` سطحی منفعل است و هیچ رویداد سفارشی‌ای ارسال نمی‌کند. جای‌گذاری، نمایش و پنهان‌کردنش را مصرف‌کننده انجام می‌دهد (مثلاً `r-popover` یا `r-select`).

## اسلات‌ها

| اسلات     | توضیح                               |
| --------- | ----------------------------------- |
| (پیش‌فرض) | محتوای پنل، که همان‌طور رندر می‌شود |

## Part‌های CSS

| Part       | توضیح                                    |
| ---------- | ---------------------------------------- |
| `dropdown` | سطح پنل، برای استایل‌دهی از بیرون shadow |

```css
r-dropdown {
  --ran-dropdown-background: var(--ran-color-bg-muted);
  --ran-dropdown-border-radius: 8px;
}
r-dropdown::part(dropdown) {
  border: 1px solid var(--ran-color-border);
}
```

هر ویژگی دیداری را می‌توان با توکن‌های `--ran-dropdown-*` بازنویسی کرد؛ برای نمونه `--ran-dropdown-background`، `--ran-dropdown-border-radius`، `--ran-dropdown-box-shadow`، `--ran-dropdown-padding`، `--ran-dropdown-arrow-width` و `--ran-dropdown-host-z-index`. پیکان یک SVG درون‌خطی است که با `viewBox` خودش مقیاس می‌گیرد، پس `--ran-dropdown-arrow-width`/`-height` اندازهٔ خودِ مثلث را عوض می‌کنند، نه جعبهٔ خالی پیرامونش را:

<Demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px; --ran-dropdown-arrow-width: 28px; --ran-dropdown-arrow-height: 28px;">
    <div style="padding: 12px;">--ran-dropdown-arrow-width: 28px</div>
  </r-dropdown>
</Demo>

```css
r-dropdown {
  --ran-dropdown-arrow-width: 28px;
  --ran-dropdown-arrow-height: 28px;
}
```

## بهترین شیوه‌ها

- **عنصر پایهٔ سطح‌پایین**: `r-dropdown` را تنها وقتی مستقیم به کار ببرید که پنل شناور سفارشی می‌خواهید؛ برای حالت‌های رایج `r-popover` یا `r-select` بهترند.
- **به میزبان اندازه بدهید**: پنل به‌طور پیش‌فرض `width` و `height: 100%` میزبان را می‌گیرد، پس نخست به میزبان اندازه و موقعیت صریح بدهید و سپس آن را منتقل کنید.
- **ترتیب لایه**: میزبان `--ran-z-dropdown` (`1100`) دارد و بنابراین بالای دیالوگ‌ها می‌نشیند؛ در صورت نیاز با `--ran-dropdown-host-z-index` بازنویسی کنید.
- **پیکان به‌طور پیش‌فرض بر پایهٔ خودش وسط‌چین می‌شود**: `r-dropdown` هیچ عنصر «ماشه»ٔ بیرونی را دنبال نمی‌کند؛ تنها ابعاد پنل خودش را در اختیار دارد. اگر هیچ مصرف‌کننده‌ای جای‌گذاری نکند، `arrow="top"`/`"bottom"` روی عرض خود پنل وسط می‌نشیند؛ و همین برای به‌کاربردن `r-dropdown` به‌تنهایی (مثل نمونه‌های بالا) پیش‌فرض درستی است. `r-popover` دقیقاً برای افزودن دنبال‌کردن ماشه روی `r-dropdown` سوار شده است: عنصر ماشهٔ واقعی را اندازه می‌گیرد و از راه `--ran-dropdown-arrow-anchor-offset` یک آفست پیکسلی برمی‌گرداند تا پیکان حتی وقتی پنل پهن‌تر است و به‌جای وسط‌چینی از لبه تراز شده، به مرکز ماشه اشاره کند. اگر خودتان روی `r-dropdown` پنلی با دنبال‌کردن ماشه می‌سازید، می‌توانید همان متغیر را مستقیم تعیین کنید به‌جای بازسازی منطق جای‌گذاری `r-popover`.
- **بارگذاری**: با `import 'ranui'` (که همهٔ کامپوننت‌ها را ثبت می‌کند) یا با `import 'ranui/dropdown'`ِ مستقل بار کنید.
