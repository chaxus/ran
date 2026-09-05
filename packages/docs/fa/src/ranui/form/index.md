---
description: 'ساختن فرم با ranui: عناصر r-input، r-checkbox و r-select مستقیم داخل یک <form> بومی کار می‌کنند و به کامپوننت پوششی نیاز ندارند.'
---

# Forms

ranui هیچ کامپوننتی برای دربرگرفتن `<form>` ندارد. `r-input`، `r-checkbox` و `r-select` خودشان [Form-Associated Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_form-associated_custom_elements) هستند (هرکدام `attachInternals()` را صدا می‌زند و مقدارش را با `ElementInternals.setFormValue()` منتقل می‌کند)، پس همین حالا داخل یک `<form>` بومیِ ساده کار می‌کنند: `new FormData(form)` آن‌ها را جمع می‌کند، `form.reset()` وضعیت پیش از تعامل را برمی‌گرداند، و فیلد `required` جلوی ارسال را می‌گیرد و رابط اعتبارسنجی بومی مرورگر را چسبیده به همان فیلد نشان می‌دهد. هیچ‌کدام به نشانه‌گذاری ویژهٔ ranui نیاز ندارند.

> **کجا به کارش ببرید**: وقتی دارید فرمی از `r-input`/`r-checkbox`/`r-select` می‌سازید. کافی است یک `<form>` واقعی به کار ببرید، و اگر مقدارهای ارسالی را به‌جای نوشتن دستی پیمایش `FormData` به‌شکل یک شیء ساده می‌خواهید، سراغ `serializeForm()` (پایین‌تر) بروید.

## شروع سریع

هر سه نوع فیلد، ارسال‌شده با یک `<form>` ساده. فیلدی را تغییر دهید و ارسال کنید تا نتیجه را پایین ببینید. این نمونه شیء را با `FormData`/`Object.fromEntries` خودِ مرورگر می‌سازد (بدون هیچ import). تابع `serializeForm()` که در ادامه معرفی می‌شود همین کار را می‌کند، به‌علاوهٔ کاری که `Object.fromEntries` نمی‌تواند: نامِ فیلدی که تکرار شده باشد به‌جای اینکه بی‌صدا فقط آخرین مقدار را نگه دارد، به‌صورت آرایه برمی‌گردد.

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.info(JSON.stringify(Object.fromEntries(new FormData(this))))">
    <r-input name="username" label="نام کاربری" placeholder="نام کاربری را وارد کنید"></r-input>
    <r-select name="role" label="نقش" style="width: 100%" defaultValue="member">
      <r-option value="member">عضو</r-option>
      <r-option value="admin">مدیر</r-option>
    </r-select>
    <r-checkbox name="subscribe">اشتراک خبرنامه</r-checkbox>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">ارسال</button></r-button>
  </form>
</Demo>

> همان‌طور که بخش [چیدمان](#layout) در پایین می‌گوید: فیلدها چیدمانی در سطح فرم از آنِ خود ندارند،
> پس هر نمونه در این صفحه (از جمله همین یکی) CSS `<form>` خودش را تعیین می‌کند
> (`display: flex; flex-direction: column; gap: …`). اگر آن را نگذارید، فیلدها در جریان عادی و بدون
> فاصله روی هم می‌نشینند و به‌جای فرم، شکسته یا روی‌هم‌افتاده دیده می‌شوند.

```html
<form id="signup" style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="نام کاربری" placeholder="نام کاربری را وارد کنید"></r-input>
  <r-select name="role" label="نقش" defaultValue="member">
    <r-option value="member">عضو</r-option>
    <r-option value="admin">مدیر</r-option>
  </r-select>
  <r-checkbox name="subscribe">اشتراک خبرنامه</r-checkbox>
  <button type="submit">ارسال</button>
</form>

<script type="module">
  import { serializeForm } from 'ranui';

  document.getElementById('signup').addEventListener('submit', (event) => {
    event.preventDefault(); // یک <form> واقعی وگرنه صفحه را جابه‌جا می‌کند
    console.log(serializeForm(event.target)); // { username: '...', role: 'member', subscribe: 'true' }
  });
</script>
```

## `serializeForm(form)`

فیلدهای نام‌دار یک `<form>` را از راه `FormData` در یک شیء ساده جمع می‌کند: همان کد تکراری‌ای که هر کسی برای تبدیل یک ارسال به چیزی که بتواند `JSON.stringify` کند یا به‌عنوان بدنهٔ fetch بفرستد، خودش می‌نویسد. تابعی معمولی است و به فیلدهای ranui وابسته نیست؛ با هر `<form>` واقعی کار می‌کند.

```ts
function serializeForm(form: HTMLFormElement): Record<string, unknown>;
```

فیلدی که زیر یک `name` بیش از یک مقدار داشته باشد (مثلاً چند چک‌باکس با نام مشترک) به‌صورت آرایه برمی‌گردد؛ باقی همه تک‌مقدار برمی‌گردند.

```ts
import { serializeForm } from 'ranui';

const data = serializeForm(document.querySelector('form'));
// { username: 'alice', tags: ['a', 'b'] }
fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) });
```

## چیدمان {#layout}

فیلدها چیدمان پیش‌فرضی در سطح فرم ندارند: `<form>` خودتان را با CSS معمولی استایل بدهید:

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px;">
    <r-input name="first" label="نام"></r-input>
    <r-input name="last" label="نام خانوادگی"></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">ادامه</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="first" label="نام"></r-input>
  <r-input name="last" label="نام خانوادگی"></r-input>
  <button type="submit">ادامه</button>
</form>
```

## اعتبارسنجی و بازنشانی

`r-input`، `r-checkbox` و `r-select` هر سه `required` را پشتیبانی می‌کنند (که دقیقاً مثل فیلد بومی جلوی ارسال را می‌گیرد و حباب اعتبارسنجی بومی مرورگر را می‌آورد) و افزون بر آن `checkValidity()`، `reportValidity()`، `validity` و `validationMessage` را دارند. `form.reset()` بومی (یا `<button type="reset">`) هر فیلد را از راه `formResetCallback()` به وضعیت پیش از تعامل برمی‌گرداند. برای جزئیات، مستندات خود هر فیلد را ببینید: [Input](/fa/src/ranui/input/#form-association)، [Checkbox](/fa/src/ranui/checkbox/#form-association)، [Select](/fa/src/ranui/select/#form-association).

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.success('Valid — submitted')">
    <r-input name="username" label="نام کاربری" required></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">ارسال</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="نام کاربری" required></r-input>
  <button type="submit">ارسال</button>
</form>
```

## چرا پوششی به نام `<r-form>` وجود ندارد؟

چون یک `<form>` بومیِ ساده از پیش کافی است: کامپوننت‌های فیلد ranui مستقیم درون آن کار می‌کنند و به پوشش نیازی نیست. `serializeForm()` تنها شکاف واقعی باقی‌مانده را پر می‌کند: تبدیل یک ارسال به شیئی ساده.
