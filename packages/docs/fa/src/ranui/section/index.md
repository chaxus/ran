---
description: 'سطحی برای یک بخش از صفحه، با عنوان دسترس‌پذیر و زیرعنوانِ اختیاری بالای بدنه‌ای که از اسلات می‌آید.'
---

# Section

سطحی برای یک بخش از صفحه، با عنوان و زیرعنوانِ اختیاری بالای بدنه‌ای که از اسلات می‌آید.

> **کجا به کارش ببرید**: وقتی می‌خواهید ناحیه‌ای مهم از صفحه را با عنوان دسترس‌پذیر سطح ۲ و در صورت نیاز یک زیرعنوان، بالای محتوایش نام‌گذاری کنید. `<r-section>` ردیف عنوان و سطح بدنه را فراهم می‌کند.

## شروع سریع

### استفادهٔ پایه

<Demo align="stretch">
  <r-section heading="عنوان بخش" subtitle="یک سطر کوتاه در توصیف این بخش.">
    <p style="margin: 0;">محتوای بدنه در اسلات پیش‌فرض قرار می‌گیرد.</p>
  </r-section>
</Demo>

```html
<r-section heading="عنوان بخش" subtitle="یک سطر کوتاه در توصیف این بخش.">
  <p>محتوای بدنه در اسلات پیش‌فرض قرار می‌گیرد.</p>
</r-section>
```

## مرجع API

### خصیصه‌ها

| خصیصه      | نوع      | پیش‌فرض | توضیح                                              |
| ---------- | -------- | ------- | -------------------------------------------------- |
| `heading`  | `string` | `''`    | عنوان بخش، که به‌صورت عنوان ARIA سطح ۲ رندر می‌شود |
| `subtitle` | `string` | `''`    | سطر پشتیبان زیر عنوان                              |
| `sheet`    | `string` | `''`    | CSS تزریق‌شده به shadow DOM بخش                    |

وقتی هر دوی `heading` و `subtitle` خالی باشند، کل ردیف عنوان پنهان می‌شود.

### عنوان `heading`

عنوان بخش که به‌صورت عنوان ARIA سطح ۲ (`role="heading"`، `aria-level="2"`) رندر می‌شود. خالی که باشد پنهان است.

<Demo align="stretch">
  <r-section heading="فقط یک عنوان">
    <p style="margin: 0;">محتوای بدنه.</p>
  </r-section>
</Demo>

```html
<r-section heading="فقط یک عنوان">
  <p>محتوای بدنه.</p>
</r-section>
```

### زیرعنوان `subtitle`

سطری پشتیبان زیر عنوان. خالی که باشد پنهان است.

<Demo align="stretch">
  <r-section heading="عنوان" subtitle="متن زیرعنوان پشتیبان.">
    <p style="margin: 0;">محتوای بدنه.</p>
  </r-section>
</Demo>

```html
<r-section heading="عنوان" subtitle="متن زیرعنوان پشتیبان.">
  <p>محتوای بدنه.</p>
</r-section>
```

### CSS در shadow با `sheet`

کد CSS که به shadow DOM بخش تزریق می‌شود؛ همان قرارداد `sheet` که همهٔ کامپوننت‌های دیگر ranui هم دارند.

<Demo align="stretch">
  <r-section heading="بخشِ پوسته‌دار" subtitle="رنگ عنوان با sheet عوض شده." sheet=".ran-section-heading { color: #006bff; }">
    <p style="margin: 0;">محتوای بدنه.</p>
  </r-section>
</Demo>

```html
<r-section heading="بخشِ پوسته‌دار" sheet=".ran-section-heading { color: #006bff; }">
  <p>محتوای بدنه.</p>
</r-section>
```

## اسلات‌ها

| اسلات       | توضیح                                       |
| ----------- | ------------------------------------------- |
| _(پیش‌فرض)_ | محتوای بدنه، که زیر ردیف عنوان رندر می‌شود. |

## Part‌های CSS

| Part       | توضیح                                          |
| ---------- | ---------------------------------------------- |
| `header`   | ردیف عنوان که عنوان و زیرعنوان را دربر می‌گیرد |
| `heading`  | عنصر عنوان ARIA سطح ۲                          |
| `subtitle` | سطر زیرعنوان پشتیبان                           |
| `body`     | پوششِ بدنه پیرامون اسلات پیش‌فرض               |

متغیرهای CSS در دسترس: `--ran-section-border-color`، `--ran-section-radius`، `--ran-section-background`، `--ran-section-shadow`، `--ran-section-padding`، `--ran-section-heading-color`، `--ran-section-heading-font-size`، `--ran-section-heading-font-weight`، `--ran-section-subtitle-color`.

```css
r-section {
  --ran-section-background: var(--surface-1);
  --ran-section-padding: 32px;
  --ran-section-heading-color: var(--text-strong);
}
r-section::part(subtitle) {
  max-width: 48ch;
}
```

## بهترین شیوه‌ها

- **عنوان بخش‌ها**: برای نام‌گذاری هر ناحیهٔ مهم صفحه `heading` را تعیین کنید.
- **بافتار**: برای یک سطر کوتاه پشتیبان از `subtitle` استفاده کنید؛ اگر هر دو را حذف کنید، سطحی ساده بدون ردیف عنوان می‌ماند.
- **دسترس‌پذیری**: عنوان به‌عنوان عنوان ARIA سطح ۲ عرضه می‌شود و در ساختار سند شرکت می‌کند؛ عنوان‌ها را معنادار نگه دارید.
- **پوسته‌دهی**: برای استایل قابل استفادهٔ مجدد، متغیرهای `--ran-section-*` یا گزینشگرهای `()::part` را به ویژگی `sheet` ترجیح دهید.
