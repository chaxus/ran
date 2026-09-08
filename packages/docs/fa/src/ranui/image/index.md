---
description: 'کامپوننت Image در ranui (<r-image>) تصویری را نشان می‌دهد و اگر منبع بارگذاری نشود، به تصویر جایگزین درون‌ساخت سوئیچ می‌کند.'
---

# Image

کامپوننت تصویر که اگر منبع بارگذاری نشود، به یک تصویر جایگزین درون‌ساخت سوئیچ می‌کند.

> **کجا به کارش ببرید**: وقتی تصویری می‌خواهید که در صورت شکست منبع، به‌آرامی به یک جانگهدار برگردد. `<r-img>` تصویر «خرابِ» درون‌ساخت یا `fallback` خودتان را جایگزین می‌کند.

## شروع سریع

### استفادهٔ پایه

<ran-demo>
  <r-img src="https://picsum.photos/id/1015/240/160"></r-img>
</ran-demo>

```html
<r-img src="https://picsum.photos/id/1015/240/160"></r-img>
```

## مرجع API

### خصیصه‌ها

| خصیصه      | نوع      | پیش‌فرض                       | توضیح                                                                     |
| ---------- | -------- | ----------------------------- | ------------------------------------------------------------------------- |
| `src`      | `string` | `''`                          | نشانی تصویر. واکنشی است: تغییر آن پس از mount تصویر را دوباره بار می‌کند. |
| `alt`      | `string` | `''`                          | متن جایگزین که به `<img>` درونی می‌رسد. خالی یعنی تزئینی.                 |
| `fallback` | `string` | data URI درون‌ساخت تصویر خراب | تصویری که وقتی `src` بار نشود نمایش می‌یابد.                              |
| `sheet`    | `string` | `''`                          | CSS تزریق‌شده به shadow DOM کامپوننت.                                     |

هر چهار مورد `src`، `alt`، `fallback` و `sheet` پایش می‌شوند و واکنشی به‌روز می‌شوند: تغییر هرکدام روی عنصری که mount شده، بی‌درنگ اثر می‌گذارد.

### منبع تصویر `src`

<ran-demo>
  <r-img src="https://picsum.photos/id/1025/240/160"></r-img>
</ran-demo>

```html
<r-img src="https://picsum.photos/id/1025/240/160"></r-img>
```

### متن جایگزین `alt`

`alt` به `<img>` درونی می‌رسد. برای تصویرهای تزئینی همان مقدار پیش‌فرض خالی را نگه دارید تا صفحه‌خوان‌ها از آن بگذرند، و برای تصویرهای معنادار توضیح بنویسید.

<ran-demo>
  <r-img src="https://picsum.photos/id/1035/240/160" alt="دریاچه‌ای کوهستانی در غروب"></r-img>
</ran-demo>

```html
<r-img src="https://picsum.photos/id/1035/240/160" alt="دریاچه‌ای کوهستانی در غروب"></r-img>
```

### شکست در بارگذاری `fallback`

وقتی `src` بار نشود، کامپوننت `fallback` را جایگزین می‌کند. اگر `fallback` تعیین نشده باشد، از جانگهدار تصویر خرابِ درون‌ساخت استفاده می‌شود. در نمونهٔ زیر `src` نشانی نامعتبری است، پس تصویر جایگزین دیده می‌شود.

<ran-demo>
  <r-img src="https://example.invalid/does-not-exist.png" fallback="data:image/png;base64,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"></r-img>
</ran-demo>

```html
<r-img
  src="https://example.invalid/does-not-exist.png"
  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...(جانگهدار تصویر خراب)..."
></r-img>
```

### استایل بیرونی `sheet`

`sheet` کد CSS خام را به shadow DOM کامپوننت تزریق می‌کند. از آن برای استایل دادن به نگه‌دارندهٔ درونی `.ran-image` یا به `<img>` داخلی استفاده کنید.

<ran-demo>
  <r-img
    src="https://picsum.photos/id/1043/240/160"
    sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
  ></r-img>
</ran-demo>

```html
<r-img
  src="https://picsum.photos/id/1043/240/160"
  sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
></r-img>
```

## رویدادها

ندارد. `r-img` هیچ رویداد سفارشی‌ای ارسال نمی‌کند.

## بهترین شیوه‌ها

- **`src` را هر وقت خواستید عوض کنید**: واکنشی است، پس به‌روزرسانی آن روی عنصری که mount شده تصویر را دوباره بار می‌کند؛ اگر نشانی تازه هم شکست بخورد، جایگزین همچنان کار می‌کند.
- **به تصویرهای معنادار `alt` بدهید**: محتوا را برای صفحه‌خوان توصیف کنید؛ `alt` را فقط برای تصویرهای کاملاً تزئینی خالی بگذارید.
- **به جایگزین درون‌ساخت تکیه کنید**: جانگهدار پیش‌فرض خودکار به کار می‌رود؛ تنها وقتی `fallback` خودتان را بدهید که جانگهداری متناسب با برند یا بافتار بخواهید.
- **استایل را با `sheet` بدهید**: چون تصویر داخل shadow DOM است، حاشیه، گردی گوشه و اندازه را با ویژگی `sheet` (یا متغیرهای CSS کامپوننت) تعیین کنید.
