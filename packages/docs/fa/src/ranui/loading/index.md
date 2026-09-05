---
description: 'کامپوننت Loading در ranui (<r-loading>) تا وقتی محتوا یا کاری در جریان است، نشانگری چرخان نمایش می‌دهد.'
---

<script setup>
import Loading from '../../../../vue/loading.vue'
</script>

# Loading

کامپوننت بارگذاری با مجموعه‌ای از نشانگرهای متحرک برای اعلام کاری که در جریان است.

> **کجا به کارش ببرید**: وقتی به نشانگری متحرک نیاز دارید که بگوید کاری در جریان است. `<r-loading>` حدود ۳۰ انیمیشن درون‌ساخت دارد که با `name` انتخاب می‌شوند و با متغیرهای CSS پوسته می‌گیرند.

## شروع سریع

### استفادهٔ پایه

<Demo>
  <r-loading name="circle"></r-loading>
</Demo>

```html
<r-loading name="circle"></r-loading>
```

## مرجع API

### خصیصه‌ها

| خصیصه   | نوع      | پیش‌فرض    | توضیح                                                                 |
| ------- | -------- | ---------- | --------------------------------------------------------------------- |
| `name`  | `string` | `'circle'` | نوع انیمیشن. اگر تعیین نشود یا ناشناخته باشد به `circle` برمی‌گردد    |
| `sheet` | `string` | `''`       | متن CSS که برای استایل‌دهی بیرونی به shadow DOM کامپوننت تزریق می‌شود |

### انواع بارگذاری `name`

`name` را روی یکی از انواع انیمیشن درون‌ساخت بگذارید. هر مقدار ناشناخته چیزی نمی‌کشد (تنها نام‌های فهرست زیر پردازش می‌شوند).

<Demo>
  <r-loading name="double-bounce"></r-loading>
  <r-loading name="rotate"></r-loading>
  <r-loading name="stretch"></r-loading>
  <r-loading name="cube"></r-loading>
</Demo>

```html
<r-loading name="double-bounce"></r-loading>
<r-loading name="rotate"></r-loading>
<r-loading name="stretch"></r-loading>
<r-loading name="cube"></r-loading>
```

مقدارهای موجود:

`double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`

### استایل بیرونی `sheet`

ویژگی `sheet` کد CSS خام را به shadow root کامپوننت تزریق می‌کند تا بدون هیچ مرحلهٔ ساخت، قاعده‌های درونی را از بیرون بازنویسی کنید.

```html
<r-loading name="circle" sheet=".circle { transform: scale(1.5); }"></r-loading>
```

## استایل دلخواه

پوستهٔ هر انیمیشن به‌تمامی با متغیرهای CSS تعیین می‌شود. برای مهار اندازه و رنگ، آن‌ها را روی عنصر `r-loading` (یا یکی از نیاکانش) بگذارید. واحد `px` مهار دقیق‌تری از اندازه‌گذاری پیش‌فرض بر پایهٔ `em` می‌دهد.

### تنظیم اندازه

```css
/* Circle */
r-loading {
  --loading-circle-width: 32px;
  --loading-circle-height: 32px;
}

/* Double-bounce */
r-loading {
  --loading-double-bounce-width: 40px;
  --loading-double-bounce-height: 40px;
}

/* Rotate */
r-loading {
  --loading-rotate-width: 48px;
  --loading-rotate-height: 48px;
}

/* Stretch */
r-loading {
  --loading-stretch-width: 60px;
  --loading-stretch-height: 72px;
}
```

### تنظیم رنگ

```css
/* Circle */
r-loading {
  --loading-circle-container-div-background: #1890ff;
}

/* Double-bounce */
r-loading {
  --loading-double-bounce1-background: #52c41a;
  --loading-double-bounce2-background: #52c41a;
}

/* Rotate */
r-loading {
  --loading-rotate-background: #faad14;
}

/* Stretch */
r-loading {
  --loading-stretch-div-background-color: #f5222d;
}
```

### نمونه‌های زنده

<Demo>
  <r-loading name="circle" style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"></r-loading>
  <r-loading name="rotate" style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"></r-loading>
</Demo>

```html
<r-loading
  name="circle"
  style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"
></r-loading>
<r-loading
  name="rotate"
  style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"
></r-loading>
```

### متغیرهای پرکاربرد CSS

هر نوع انیمیشن فضای نام توکن خودش را دارد. پرکاربردترین‌ها از این الگو پیروی می‌کنند:

| متغیر                                   | پیش‌فرض   | توضیح                                   |
| --------------------------------------- | --------- | --------------------------------------- |
| `--loading-{type}-width`                | `4em`     | عرض انیمیشن (واحد `px` توصیه می‌شود)    |
| `--loading-{type}-height`               | `4em`     | ارتفاع انیمیشن (واحد `px` توصیه می‌شود) |
| `--loading-{type}-background`           | `#4096ff` | رنگ زمینهٔ اصلی                         |
| `--loading-{type}-div-background-color` | `#4096ff` | رنگ زمینهٔ عنصرهای فرزند                |

> `{type}` را با نام مشخص انیمیشن جایگزین کنید، مثلاً `circle`، `double-bounce` یا `rotate`. رنگ‌های پایه به‌طور پیش‌فرض از توکن‌های پوستهٔ `--ran-color-primary`، `--ran-color-success` و `--ran-color-text` می‌آیند.

## Part‌های CSS

هر انیمیشن عنصر ریشهٔ خود را به‌شکل یک `()::part` هم‌نام با مقدار `name` در اختیار می‌گذارد، پس می‌توانید از بیرون shadow DOM هدفش بگیرید:

```css
r-loading::part(rotate) {
  filter: drop-shadow(0 0 4px currentColor);
}
```

نام Part‌ها: `double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`. انیمیشن `solar` افزون بر این، Part‌ای به نام `sun` هم دارد.

## اسلات‌ها

ندارد. کامپوننت انیمیشنش را تماماً از shadow DOM می‌کشد و فرزندان light DOM را بازتاب نمی‌دهد.

## رویدادها

ندارد. کامپوننت هیچ رویداد سفارشی‌ای ارسال نمی‌کند.

## همهٔ انیمیشن‌های بارگذاری

<Loading />

## بهترین شیوه‌ها

- **متناسب با صحنه انتخاب کنید**: انیمیشنی برگزینید که با بافتار و شتاب کار جور باشد.
- **متغیرهای CSS**: به‌جای پیچیدن عنصر دور آن، اندازه و رنگ را با توکن‌های `--loading-{type}-*` تنظیم کنید.
- **اندازه‌گذاری**: برای ابعاد پیش‌بینی‌پذیر، واحد `px` را به `em`ِ پیش‌فرض ترجیح دهید.
- **کارایی**: از ترسیم انیمیشن‌های همزمانِ پرشمار در یک صفحه بپرهیزید.
- **بارگذاری در زمان نیاز**: هر انیمیشن تکه‌ای تنبل و جداگانه است (با JS و CSS خودش)، پس یک `name` تنها همان گونه‌ای را بار می‌کند که به کار می‌برد؛ ارجاع به یک انیمیشن هرگز ۲۸ تای دیگر را همراه نمی‌آورد. `circle`ِ پیش‌فرض و `dot`ِ پرکاربرد برای نخستین ترسیمِ بی‌درنگ و بدون جهش درون‌ساخت‌اند؛ بقیه در نخستین استفاده ناهمگام بار می‌شوند. شیوهٔ استفاده تغییری نمی‌کند: کافی است `name` را بگذارید.
- **پوسته‌دهی**: رنگ‌های پایه از توکن‌های `--ran-color-*` پیروی می‌کنند، پس انیمیشن‌ها خودبه‌خود با حالت روشن و تیره جور می‌شوند.
