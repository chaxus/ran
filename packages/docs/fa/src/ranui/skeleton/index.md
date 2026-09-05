---
description: 'کامپوننت Skeleton در ranui (<r-skeleton>) یک جانگهدار درخشان است که تا وقتی محتوا بار می‌شود، جای آن را پر می‌کند.'
---

# Skeleton

نقشی جانگهدار که تا وقتی محتوا بار می‌شود جای آن را می‌گیرد و با یک انیمیشن درخشان انتظار را نشان می‌دهد.

> **کجا به کارش ببرید**: وقتی به میله‌ای درخشان نیاز دارید که تا بار شدن محتوا جای آن را نگه دارد. والدِ `<r-skeleton>` را هم‌اندازهٔ محتوای واقعی بگیرید و به‌محض رسیدن داده جایش را عوض کنید.

## شروع سریع

### استفادهٔ پایه

اسکلت تا عرض عنصر والدش کشیده می‌شود و ارتفاع پیش‌فرضش `16px` است.

<Demo>
  <r-skeleton></r-skeleton>
</Demo>

```html
<r-skeleton></r-skeleton>
```

### عرض از والد پیروی می‌کند

چون اسکلت `width: 100%` است، طول آن را با اندازهٔ نگه‌دارنده‌ای که در آن قرار دارد تعیین کنید.

<Demo column>
  <div style="width: 100px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 200px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 100%">
    <r-skeleton></r-skeleton>
  </div>
</Demo>

```html
<div style="width: 100px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 200px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 100%">
  <r-skeleton></r-skeleton>
</div>
```

### روی‌هم چیدن جانگهدارها

چند اسکلت را کنار هم بگذارید تا یک بند یا بلوکی از متن را تقلید کنند.

<Demo column>
  <div style="width: 100%; display: flex; flex-direction: column; gap: 12px">
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
  </div>
</Demo>

```html
<div style="display: flex; flex-direction: column; gap: 12px">
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
</div>
```

## مرجع API

### خصیصه‌ها

| خصیصه   | نوع      | پیش‌فرض | توضیح                                                             |
| ------- | -------- | ------- | ----------------------------------------------------------------- |
| `sheet` | `string` | `''`    | CSS تزریق‌شده به shadow DOM کامپوننت برای بازنویسی محدودهٔ استایل |

### استایل دلخواه `sheet`

رشته‌ای از CSS را به `sheet` بدهید تا ظاهر اسکلت را درون shadow DOM خودش بازنویسی کنید.

<Demo>
  <r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
</Demo>

```html
<r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
```

### متغیرهای CSS

اسکلت متغیرهای سفارشی CSS هم در اختیار می‌گذارد تا بدون `sheet` بتوانید پوسته بدهید:

| متغیر                                       | پیش‌فرض                        | توضیح                 |
| ------------------------------------------- | ------------------------------ | --------------------- |
| `--ran-skeleton-height`                     | `16px`                         | ارتفاع میلهٔ جانگهدار |
| `--ran-skeleton-background`                 | `var(--ran-gray-alpha-200, …)` | رنگ زمینه بدون درخشش  |
| `--ran-skeleton-border-radius`              | `var(--ran-radius-sm, 6px)`    | گردی گوشه‌ها          |
| `--ran-skeleton-shimmer-background`         | `linear-gradient(90deg, …)`    | گرادیان درخشش متحرک   |
| `--ran-skeleton-shimmer-animation-duration` | `1.4s`                         | مدت یک بار عبور درخشش |

<Demo>
  <r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
</Demo>

```html
<r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
```

## رویدادها

ندارد. اسکلت هیچ رویداد سفارشی‌ای ارسال نمی‌کند.

## اسلات‌ها

ندارد. اسکلت فقط میلهٔ خودش را می‌کشد و محتوای اسلات را بازتاب نمی‌دهد.

## بهترین شیوه‌ها

- **با چیدمان هماهنگ کنید**: اندازهٔ نگه‌دارندهٔ والد را طوری بگیرید که هر اسکلت هم‌عرض محتوای واقعی‌ای باشد که جایش ایستاده.
- **شکل را تقلید کنید**: چند اسکلت را با فاصله‌های یکنواخت روی هم بچینید تا متن چندسطری یا سطرهای یک فهرست را نشان دهند.
- **پوسته را با متغیرها بدهید**: برای تغییرهای ساده اول سراغ متغیرهای `--ran-skeleton-*` بروید؛ `sheet` را تنها وقتی به کار ببرید که به گزینشگری نیاز دارید که متغیرها پوشش نمی‌دهند.
- **پس از بارگذاری جایگزین کنید**: به‌محض رسیدن داده، اسکلت‌ها را با محتوای واقعی عوض کنید و نگذارید بی‌پایان انیمیشن بزنند.
