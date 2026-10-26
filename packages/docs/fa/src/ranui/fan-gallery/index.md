---
description: 'کامپوننت FanGallery در ranui (<r-fan-gallery>) فرزندانش را مثل دستی ورق بادبزنی باز می‌کند؛ نخستین بار که به دید می‌آید با حرکتی فنری باز می‌شود و فرزندِ زیر اشاره‌گر یا دارای فوکوس را بالا می‌آورد.'
---

# FanGallery

فرزندانش را مثل دستی ورق بادبزنی باز می‌کند. هر فرزند حول نقطه‌ای زیر ردیف می‌چرخد، برای همین
گروه مثل یک شیء واحد دیده می‌شود، نه یک نوار.

> **وقتی استفاده کنید که** چند جلد، اسکرین‌شات یا کارت باید یک مجموعه دیده شوند و نشان دادن اینکه
> چندتا هستند مهم‌تر از نشان دادن کامل هرکدام است. برای محتوایی که خواننده باید کنار هم مقایسه
> کند، از شبکه (grid) استفاده کنید.

## شروع سریع

### استفادهٔ پایه

<ran-demo>
  <r-fan-gallery>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8d5b7;color:#333">1</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#b7d0e8;color:#333">2</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#c8e8b7;color:#333">3</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8b7c8;color:#333">4</button>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery>
  <a href="/one">1</a>
  <a href="/two">2</a>
  <a href="/three">3</a>
  <a href="/four">4</a>
</r-fan-gallery>
```

فرزندان عناصر خود شما هستند. پیوندها، دکمه‌ها و تصاویر نقش، نام و جایگاهشان در ترتیب Tab را
حفظ می‌کنند؛ گالری فقط آن‌ها را جابه‌جا می‌کند.

### گستردگی

`spread` زاویه بر حسب درجه بین نخستین و آخرین فرزند است. با `0` همه روی هم قرار می‌گیرند.

<ran-demo>
  <r-fan-gallery spread="48">
    <div style="width:96px;height:128px;border-radius:12px;background:#d2b7e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#b7d0e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#c8e8b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8d5b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8b7c8"></div>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery spread="48">…</r-fan-gallery>
```

## حرکت

- **باز شدن.** تا وقتی گالری نخستین بار به دید نیامده، فرزندانش روی هم چیده شده‌اند، پس فرزند
  جلویی از همان ابتدا خواناست. وقتی به دید می‌آید، بادبزن با حرکتی فنری یکی پس از دیگری باز
  می‌شود. در هر صفحه فقط یک بار باز می‌شود؛ دور شدن و برگشتن با اسکرول آن را تکرار نمی‌کند.
- **اشاره‌گر و فوکوس.** فرزندِ زیر اشاره‌گر یا دارای فوکوس بالا می‌آید و به جلو می‌رود و
  همسایه‌هایش کمی کنار می‌چرخند. واکنش فوری است و هر حرکت تازه از همان جایی ادامه می‌یابد که
  حرکت قبلی رسیده بود.
- **کاهش حرکت.** با `prefers-reduced-motion: reduce` بادبزن از ابتدا باز است و هر تغییر بدون
  گذار اعمال می‌شود.

## مرجع API

### خصیصه‌ها

| خصیصه    | ویژگی    | نوع      | پیش‌فرض | توضیح                                                   |
| -------- | -------- | -------- | ------- | ------------------------------------------------------- |
| `spread` | `spread` | `string` | `'24'`  | زاویه بر حسب درجه بین نخستین و آخرین فرزند در حالت باز. |
| `sheet`  | `sheet`  | `string` | `''`    | CSS تزریق‌شده در shadow root.                           |

### Part‌ها

| Part    | عنصر                                               |
| ------- | -------------------------------------------------- |
| `stage` | شبکه‌ای که همهٔ فرزندان در آن روی هم چیده می‌شوند. |

### استایل

| توکن                        | پیش‌فرض          | کارکرد                                                        |
| --------------------------- | ---------------- | ------------------------------------------------------------- |
| `--ran-fan-gallery-padding` | `--ran-space-10` | فضای دور stage که گوشه‌های چرخیده در آن جا می‌گیرند.          |
| `--ran-fan-gallery-pivot`   | `320px`          | فرزندان چقدر پایین‌تر از ردیف می‌چرخند. کوتاه‌تر یعنی بازتر.  |
| `--ran-fan-gallery-lift`    | `--ran-space-4`  | فرزندِ زیر اشاره‌گر یا دارای فوکوس چقدر به بیرون حرکت می‌کند. |

ارتفاع گالری برابر بلندترین فرزند آن است. گوشه‌های چرخیده از stage بیرون می‌زنند، پس دور آن
فضا بگذارید یا `--ran-fan-gallery-padding` را بیشتر کنید.
