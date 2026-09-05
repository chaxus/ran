---
description: 'رابط Message در ranui بازخورد سراسری (info، success، warning، error، toast) را به‌شکل دستوری نشان می‌دهد و آن را به‌صورت پوششی سبک رندر می‌کند.'
---

# Message

کامپوننت بازخورد سراسری برای نتیجهٔ عملیات که به‌شکل دستوری از راه رابط `message` صدا زده می‌شود و به‌صورت اعلانی بسته‌شدنی رندر می‌شود.

> **کجا به کارش ببرید**: وقتی به اعلانی گذرا و خودبسته‌شونده نیاز دارید تا نتیجهٔ یک عملیات را تأیید کند. به‌جای گذاشتن نشانه‌گذاری، رابط دستوری `message.info` / `success` / `warning` / `error` / `toast` را صدا بزنید.

## شروع سریع

<Demo>
  <r-button type="primary" onclick="message.info('این یک راهنماست')">نمایش پیام</r-button>
</Demo>

```html
<r-button type="primary" onclick="message.info('این یک راهنماست')">نمایش پیام</r-button>
```

Message را معمولاً از جاوااسکریپت صدا می‌زنند. شیء سراسری `message` به‌محض بارگذاری ماژول کامپوننت روی `window` ثبت می‌شود (از راه `window.ranui.message` هم در دسترس است).

```js
message.info('این یک راهنماست');
message.success('پروژه حذف شد');
```

## مرجع API

### متدهای سراسری

هر متد یک اعلان می‌افزاید و پس از `duration` میلی‌ثانیه (پیش‌فرض `3000`) خودش می‌بنددش. هر پنج متد امضای یکسانی دارند.

| متد                 | توضیح                                              |
| ------------------- | -------------------------------------------------- |
| `message.info()`    | اعلان اطلاعاتی خنثی (آیکون آبی اطلاعات)            |
| `message.success()` | اعلان موفقیت (آیکون سبز تیک)                       |
| `message.warning()` | اعلان هشدار (آیکون کهربایی)، با تأکید اعلام می‌شود |
| `message.error()`   | اعلان خطا (آیکون قرمز)، با تأکید اعلام می‌شود      |
| `message.toast()`   | اعلان تیرهٔ ساده و بدون آیکون                      |

### امضای متدها

هر متد یا یک `string` (محتوا) می‌پذیرد یا یک شیء گزینه‌ها.

```js
// ۱. رشته بدهید — فقط محتوا، پس از ۳۰۰۰ میلی‌ثانیه می‌رود
message.info('این یک راهنماست');

// ۲. شیء گزینه‌ها بدهید
message.info({
  content: 'این یک راهنماست',
  duration: 2000,
  close: () => console.log('closed'),
});
```

### گزینه‌ها

| گزینه          | نوع                         | پیش‌فرض         | توضیح                                                                    |
| -------------- | --------------------------- | --------------- | ------------------------------------------------------------------------ |
| `content`      | `string`                    | —               | متنی که نمایش می‌یابد (هنگام دادن شیء الزامی است)                        |
| `duration`     | `number`                    | `3000`          | تأخیر بسته‌شدن خودکار برحسب میلی‌ثانیه                                   |
| `close`        | `() => void`                | —               | فراخوانی پس از برداشته‌شدن اعلان                                         |
| `top`          | `number \| string`          | `8`             | فاصلهٔ پشتهٔ اعلان‌ها از بالای نگه‌دارنده (عدد به‌عنوان px گرفته می‌شود) |
| `zIndex`       | `number \| string`          | `1200`          | ترتیب لایهٔ نگه‌دارندهٔ اعلان‌ها                                         |
| `getContainer` | `() => HTMLElement \| null` | `document.body` | عنصری را برمی‌گرداند که پشتهٔ اعلان‌ها در آن سوار می‌شود                 |

> دادن `null`، `undefined` یا هیچ آرگومانی کاری نمی‌کند: چیزی نشان داده نمی‌شود.

### ویژگی‌های عنصر `r-message`

هر اعلان یک عنصر سفارشی `<r-message>` است. رابط سراسری این ویژگی‌ها را به‌جای شما تعیین می‌کند، اما می‌توان مستقیم هم به کارشان برد.

| ویژگی     | نوع      | پیش‌فرض | توضیح                                                                                                  |
| --------- | -------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `type`    | `string` | —       | یکی از `info`، `success`، `warning`، `error`، `toast`. آیکون/رنگ و نقش ناحیهٔ زندهٔ ARIA را برمی‌گزیند |
| `content` | `string` | —       | متنی که درون اعلان رندر می‌شود                                                                         |
| `sheet`   | `string` | `''`    | CSS تزریق‌شده به shadow DOM کامپوننت                                                                   |

## گونه‌های پیام `type`

<Demo>
  <r-button onclick="message.info('این یک راهنماست')">اعلان اطلاعاتی</r-button>
  <r-button onclick="message.success('این یک راهنماست')">اعلان موفقیت</r-button>
  <r-button onclick="message.warning('این یک راهنماست')">اعلان هشدار</r-button>
  <r-button onclick="message.error('این یک راهنماست')">اعلان خطا</r-button>
  <r-button onclick="message.toast('این یک راهنماست')">اعلان toast</r-button>
</Demo>

```html
<r-button onclick="message.info('این یک راهنماست')">اعلان اطلاعاتی</r-button>
<r-button onclick="message.success('این یک راهنماست')">اعلان موفقیت</r-button>
<r-button onclick="message.warning('این یک راهنماست')">اعلان هشدار</r-button>
<r-button onclick="message.error('این یک راهنماست')">اعلان خطا</r-button>
<r-button onclick="message.toast('این یک راهنماست')">اعلان toast</r-button>
```

## مدت دلخواه `duration`

<Demo>
  <r-button onclick="message.info({ content: '۶ ثانیه می‌ماند', duration: 6000 })">اعلان ۶ ثانیه‌ای</r-button>
  <r-button onclick="message.info({ content: '۱ ثانیه می‌ماند', duration: 1000 })">اعلان ۱ ثانیه‌ای</r-button>
</Demo>

```html
<r-button onclick="message.info({ content: '۶ ثانیه می‌ماند', duration: 6000 })">اعلان ۶ ثانیه‌ای</r-button>
<r-button onclick="message.info({ content: '۱ ثانیه می‌ماند', duration: 1000 })">اعلان ۱ ثانیه‌ای</r-button>
```

## فراخوانی هنگام بسته‌شدن `close`

فراخوانی `close` پس از برداشته‌شدن اعلان از DOM اجرا می‌شود.

<Demo>
  <r-button onclick="message.success({ content: 'ذخیره شد', close: () => message.info('اعلان بسته شد') })">پیام زنجیره‌ای</r-button>
</Demo>

```html
<r-button onclick="message.success({ content: 'ذخیره شد', close: () => message.info('اعلان بسته شد') })"
  >پیام زنجیره‌ای</r-button
>
```

```js
message.success({
  content: 'ذخیره شد',
  close: () => {
    // به‌محض کنار رفتن اعلان یک بار اجرا می‌شود
    console.log('toast closed');
  },
});
```

## جای‌گذاری دلخواه `top` / `zIndex` / `getContainer`

<Demo>
  <r-button onclick="message.info({ content: 'به پایین رانده شد', top: 120 })">فاصله از بالا</r-button>
</Demo>

```js
message.info({
  content: 'به پایین رانده شد',
  top: 120, // فاصله از بالای نگه‌دارنده
  zIndex: 1300, // ترتیب لایه
  getContainer: () => document.querySelector('#app'), // نقطهٔ سوارشدن دلخواه
});
```

## استایل

پشتهٔ اعلان‌ها در نگه‌دارنده‌ای است که به body منتقل شده؛ هر `<r-message>` محتوایش را درون shadow DOM رندر می‌کند و سطح آن با متغیرهای CSS پوسته می‌گیرد (همه با مقدارهای پشتیبان معقول).

| متغیر CSS                             | پیش‌فرض                        | توضیح               |
| ------------------------------------- | ------------------------------ | ------------------- |
| `--ran-message-content-background`    | `var(--ran-color-bg-elevated)` | زمینهٔ سطح اعلان    |
| `--ran-message-content-border-radius` | `var(--ran-radius-md)`         | گردی گوشهٔ اعلان    |
| `--ran-message-content-box-shadow`    | `var(--ran-shadow-menu)`       | برجستگی اعلان       |
| `--ran-message-text-color`            | `var(--ran-color-text)`        | رنگ متن اعلان       |
| `--ran-message-z-index`               | `var(--ran-z-message, 1200)`   | z-index پشته        |
| `--ran-message-top`                   | `8px`                          | فاصلهٔ پشته از بالا |

## بهترین شیوه‌ها

- **بگویید چه چیزی عوض شد**: متن اعلان را به‌شکل نتیجه بنویسید، مثل «پروژه حذف شد» یا «تغییرها ذخیره شد»، نه «موفق» مبهم.
- **موفقیت / اطلاع**: برای تأییدهایی که کار را متوقف نمی‌کنند از `message.success` / `message.info` استفاده کنید.
- **خطا / هشدار**: از `message.error` / `message.warning` استفاده کنید؛ این‌ها به ناحیهٔ زندهٔ قاطع ARIA ارتقا می‌یابند تا صفحه‌خوان میان حرف بیاید.
- **کوتاه نگه دارید**: اعلان خودش می‌رود، پس محتوای بلند یا نیازمند کنش را به دیالوگ بسپارید.
- **مدت را کم دست بزنید**: برای پیام‌های بلندتر `duration` را بالا ببرید، اما بازخورد گذرا را ماندگار نکنید.
