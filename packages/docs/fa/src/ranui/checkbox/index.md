---
description: 'کامپوننت Checkbox در ranui (<r-checkbox>) یک انتخاب روشن/خاموش را جابه‌جا می‌کند، با برچسب اختیاری و پشتیبانی از فرم بومی.'
---

# Checkbox

کامپوننت چک‌باکس برای جابه‌جا کردن یک انتخاب روشن/خاموش، با برچسب اختیاری و پشتیبانی از فرم بومی.

> **کجا به کارش ببرید**: وقتی به یک کلید روشن/خاموش با برچسب نیاز دارید که در فرم‌های بومی شرکت کند. `<r-checkbox>` وضعیت تیک‌خورده‌اش را به `FormData` می‌رساند و با صفحه‌کلید هم کار می‌کند.

## شروع سریع

### استفادهٔ پایه

<Demo>
  <r-checkbox>مرا به خاطر بسپار</r-checkbox>
</Demo>

```html
<r-checkbox>مرا به خاطر بسپار</r-checkbox>
```

محتوای اسلات پیش‌فرض همان برچسب چک‌باکس می‌شود.

## مرجع API

### خصیصه‌ها

| خصیصه      | نوع       | پیش‌فرض   | توضیح                                                          |
| ---------- | --------- | --------- | -------------------------------------------------------------- |
| `checked`  | `boolean` | `false`   | اینکه چک‌باکس تیک خورده است یا نه                              |
| `value`    | `string`  | `'false'` | مقدار فرم؛ وضعیت تیک را به‌شکل `'true'` / `'false'` می‌نمایاند |
| `disabled` | `boolean` | `false`   | اینکه چک‌باکس غیرفعال است یا نه                                |
| `required` | `boolean` | `false`   | اینکه برای ارسال فرم باید تیک خورده باشد یا نه                 |
| `sheet`    | `string`  | `''`      | CSS تزریق‌شده به shadow DOM کامپوننت برای استایل دلخواه        |

> ویژگی‌های `checked` و `value` همگام نگه داشته می‌شوند: تعیین یکی دیگری را به‌روز می‌کند. وقتی تیک خورده باشد `value` برابر `'true'` و در غیر این صورت `'false'` است.

### وضعیت تیک `checked`

<Demo>
  <r-checkbox checked="true">تیک‌خورده</r-checkbox>
  <r-checkbox checked="false">بدون تیک</r-checkbox>
</Demo>

```html
<r-checkbox checked="true">تیک‌خورده</r-checkbox> <r-checkbox checked="false">بدون تیک</r-checkbox>
```

### مقدار `value`

<Demo>
  <r-checkbox value="true">مقدار true</r-checkbox>
  <r-checkbox value="false">مقدار false</r-checkbox>
</Demo>

```html
<r-checkbox value="true">مقدار true</r-checkbox> <r-checkbox value="false">مقدار false</r-checkbox>
```

### حالت غیرفعال `disabled`

<Demo>
  <r-checkbox checked="true" disabled>تیک‌خورده</r-checkbox>
  <r-checkbox checked="false" disabled>بدون تیک</r-checkbox>
</Demo>

```html
<r-checkbox checked="true" disabled>تیک‌خورده</r-checkbox> <r-checkbox checked="false" disabled>بدون تیک</r-checkbox>
```

### استایل دلخواه `sheet`

ویژگی `sheet` کد CSS را به shadow DOM تزریق می‌کند تا بتوانید بخش‌های درونی را با نام کلاسشان هدف بگیرید.

<Demo>
  <r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">برچسب پوسته‌دار</r-checkbox>
</Demo>

```html
<r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">برچسب پوسته‌دار</r-checkbox>
```

## رویدادها

### `change`

هنگام جابه‌جا شدن چک‌باکس (با کلیک یا فشردن Space/Enter) رخ می‌دهد. رویداد یک `CustomEvent` است که `detail` آن وضعیت تازه را حمل می‌کند:

```ts
detail: {
  checked: boolean; // وضعیت تیک چک‌باکس پس از جابه‌جایی
}
```

چک‌باکس غیرفعال رویداد `change` نمی‌فرستد.

<Demo>
  <r-checkbox onchange="message.info(this)">مرا جابه‌جا کن</r-checkbox>
</Demo>

```html
<r-checkbox onchange="handleChange(event)">مرا جابه‌جا کن</r-checkbox>

<script>
  function handleChange(event) {
    console.log('checked:', event.detail.checked);
  }
</script>
```

## اسلات‌ها

| اسلات     | توضیح                                  |
| --------- | -------------------------------------- |
| (پیش‌فرض) | برچسب چک‌باکس که کنار مربع رندر می‌شود |

## پیوند با فرم {#form-association}

`r-checkbox` یک عنصر سفارشی پیوندخورده با فرم است (`formAssociated = true`). وضعیت تیکش را از راه `ElementInternals.setFormValue` منتقل می‌کند، پس در فرم‌های بومی شرکت می‌کند و وقتی فرزند واقعی یک `<form>` بومی باشد، `new FormData(form)` آن را جمع می‌کند. هم‌سو با معنای چک‌باکس بومی، تنها وقتی تیک خورده باشد `value` خود را می‌دهد.

خود میزبان معنای دسترس‌پذیر چک‌باکس را دارد: `role="checkbox"`، `aria-checked`، `aria-disabled` و کار با صفحه‌کلید (جابه‌جایی با Space یا Enter).

**بازنشانی**: `form.reset()` بومی از راه `formResetCallback()` وضعیت تیکی را برمی‌گرداند که مربع هنگام نخستین اتصال داشت.

**اعتبارسنجی**: `required` مربعِ بدون تیک را با `ElementInternals.setValidity()` نامعتبر می‌کند و این برای `form.checkValidity()`/`form.reportValidity()` دیدنی است؛ مربع `disabled` هرگز جلوی اعتبارسنجی را نمی‌گیرد. `checkValidity()`، `reportValidity()`، `validity` و `validationMessage` مانند یک فیلد بومی روی عنصر در دسترس‌اند.

```html
<form>
  <r-checkbox name="terms" required>با شرایط موافقم</r-checkbox>
  <button type="submit">ارسال</button>
</form>
```

## Part‌های CSS

با گزینشگر `()::part` به ساختار درونی استایل بدهید:

| Part       | عنصر                                            |
| ---------- | ----------------------------------------------- |
| `wrapper`  | نگه‌دارندهٔ بیرونی flex که مربع و برچسب را دارد |
| `checkbox` | نگه‌دارندهٔ مربع                                |
| `input`    | عنصر `<input type="checkbox">`ِ پنهان از دید    |
| `inner`    | مربع ترسیم‌شده (حاشیه، پرشدگی، علامت تیک)       |
| `label`    | برچسبی که اسلات پیش‌فرض را دربر می‌گیرد         |

```css
r-checkbox::part(inner) {
  border-radius: 50%;
}
r-checkbox::part(label) {
  font-weight: 600;
}
```

## استایل

`<r-checkbox>` **۳۲ ویژگی سفارشی CSS** از آنِ خود و افزون بر آن توکن‌های معنایی‌ای که از پوسته
می‌خواند در اختیار می‌گذارد. آن را هرجا که ارث می‌رسد تعیین کنید: `:root`، یک نگه‌دارنده، یا خود عنصر.

```css
r-checkbox {
  --ran-checkbox-color: var(--ran-color-text-secondary);
}
```

Part‌ها: `checkbox` · `inner` · `input` · `label` · `wrapper`

فهرست کامل در [توکن‌های استایل](/fa/src/ranui/style-tokens#checkbox) است و اینکه کدام توکن را برگزینید در [سیستم طراحی](/fa/src/ranui/design-system/) آمده.

## بهترین شیوه‌ها

- **به چک‌باکس‌ها برچسب بدهید**: متنی در اسلات بگذارید تا کنترل نامی دسترس‌پذیر داشته باشد.
- **`checked` در برابر `value`**: برای وضعیت بولی از `checked` استفاده کنید و هنگام جمع‌کردن دادهٔ فرم `value` را بخوانید (`'true'` / `'false'`).
- **حالت غیرفعال**: وقتی آن انتخاب در دسترس نیست از `disabled` استفاده کنید.
- **به `change` گوش بدهید**: به‌جای پرس‌وجوی دوبارهٔ DOM، `event.detail.checked` را بخوانید.
- **فرم‌ها**: `r-checkbox` را داخل یک `<form>` بگذارید؛ وقتی تیک خورده باشد مقدارش خودکار جمع می‌شود. دربارهٔ `serializeForm()` که یک ارسال را به شیئی ساده تبدیل می‌کند، [Forms](/fa/src/ranui/form/) را ببینید.
