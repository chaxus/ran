---
description: 'ورودی ranui (<r-input>) کنترل پایه فرم برای تایپ با صفحه‌کلید است، با انواع، اندازه‌ها و اعتبارسنجی، ساخته‌شده به‌صورت وب‌کامپوننت بومی برای هر فریم‌ورکی.'
---

# Input

کامپوننت ورودی برای واردکردن محتوا با صفحه‌کلید؛ پایه‌ای‌ترین کنترل فرم.

> **کجا به کار می‌آید:** وقتی به یک فیلد متنی نیاز دارید با برچسب ثابتِ بالا، آیکن ابتدایی، وضعیت و پیام اعتبارسنجی، و مشارکت در فرم بومی. `<r-input>` ورودی متن، گذرواژه و عدد را پوشش می‌دهد.

## شروع سریع

### کاربرد پایه

<ran-demo column>
  <r-input placeholder="متنی وارد کنید"></r-input>
</ran-demo>

```html
<r-input placeholder="متنی وارد کنید"></r-input>
```

## مرجع API

### ویژگی‌ها

| ویژگی         | نوع       | پیش‌فرض | توضیح                                                                              |
| ------------- | --------- | ------- | ---------------------------------------------------------------------------------- |
| `label`       | `string`  | `''`    | نوشته ثابتی که بالای فیلد رسم می‌شود                                               |
| `placeholder` | `string`  | `''`    | متن جای‌نگهدار که به `<input>` بومی پاس داده می‌شود                                |
| `value`       | `string`  | `''`    | مقدار فیلد؛ به اتریبیوت بازتاب می‌یابد و به فرم هم می‌رسد                          |
| `disabled`    | `boolean` | `false` | اینکه ورودی غیرفعال باشد یا نه                                                     |
| `type`        | `string`  | `''`    | نوع ورودی بومی که به کنترل درونی پاس داده می‌شود (`text`، `password`، `number`، …) |
| `icon`        | `string`  | `''`    | نام آیکن ابتدای فیلد (به‌صورت `r-icon` رسم می‌شود)                                 |
| `name`        | `string`  | `''`    | نام فیلد هنگام مشارکت در فرم                                                       |
| `status`      | `string`  | `''`    | وضعیت اعتبارسنجی: `error`، `warning`                                               |
| `message`     | `string`  | `''`    | متن راهنما یا اعتبارسنجی که زیر فیلد رسم می‌شود                                    |
| `min`         | `string`  | `''`    | کمترین مقدار؛ وقتی `type="number"` باشد به `<input>` درونی پاس می‌رود              |
| `max`         | `string`  | `''`    | بیشترین مقدار؛ وقتی `type="number"` باشد به `<input>` درونی پاس می‌رود             |
| `step`        | `string`  | `''`    | گام مقدار؛ وقتی `type="number"` باشد به `<input>` درونی پاس می‌رود                 |
| `required`    | `boolean` | `false` | به `<input>` درونی پاس می‌رود تا اعتبارسنجی بومی اعمال شود                         |
| `sheet`       | `string`  | `''`    | CSSی که به shadow root تزریق می‌شود                                                |

### برچسب `label`

نوشته‌ای ثابت که بالای فیلد رسم می‌شود: همیشه دیده می‌شود، هرگز روی محتوای کناری نمی‌افتد و با فوکوس، چیدمان را جابه‌جا نمی‌کند (برچسب‌های بالاچین فرم را هم سریع‌تر از برچسب‌های درون‌خطی یا شناور به پایان می‌رسانند؛ [پژوهش ردیابی چشم لوک وروبلوسکی](https://www.lukew.com/ff/entry.asp?504=) را ببینید).

<ran-demo column>
  <r-input label="نام کاربری"></r-input>
</ran-demo>

```html
<r-input label="نام کاربری"></r-input>
```

### جای‌نگهدار `placeholder`

مثل اتریبیوت بومی `placeholder` رفتار می‌کند.

<ran-demo column>
  <r-input placeholder="نام کاربری را وارد کنید"></r-input>
</ran-demo>

```html
<r-input placeholder="نام کاربری را وارد کنید"></r-input>
```

### مقدار `value`

<ran-demo column>
  <r-input value="1234"></r-input>
</ran-demo>

```html
<r-input value="1234"></r-input>
```

### حالت غیرفعال `disabled`

<ran-demo column>
  <r-input label="نام کاربری" disabled></r-input>
</ran-demo>

```html
<r-input label="نام کاربری" disabled></r-input>
```

### آیکن `icon`

<ran-demo column>
  <r-input icon="user"></r-input>
</ran-demo>

```html
<r-input icon="user"></r-input>
```

### انواع ورودی `type`

<ran-demo column>
  <r-input icon="lock" type="password" placeholder="گذرواژه"></r-input>
  <r-input type="number" placeholder="عدد"></r-input>
</ran-demo>

```html
<r-input icon="lock" type="password" placeholder="گذرواژه"></r-input>
<r-input type="number" placeholder="عدد"></r-input>
```

### وضعیت `status`

`status` را همیشه با یک `message` همراه کنید تا وضعیت را متن برساند، نه تنها رنگ.

<ran-demo column>
  <r-input status="error" label="نام کاربری" message="این فیلد الزامی است"></r-input>
  <r-input status="warning" label="نام کاربری" message="این مقدار را بررسی کنید"></r-input>
</ran-demo>

```html
<r-input status="error" label="نام کاربری" message="این فیلد الزامی است"></r-input>
<r-input status="warning" label="نام کاربری" message="این مقدار را بررسی کنید"></r-input>
```

### پیام راهنما `message`

متن راهنما یا اعتبارسنجی را زیر فیلد رسم می‌کند.

<ran-demo column>
  <r-input label="ایمیل" message="ایمیل شما را هرگز با کسی در میان نمی‌گذاریم"></r-input>
</ran-demo>

```html
<r-input label="ایمیل" message="ایمیل شما را هرگز با کسی در میان نمی‌گذاریم"></r-input>
```

### نام فیلد فرم `name`

```html
<r-input name="username" label="نام کاربری"></r-input>
```

## رویدادها

هر دو رویداد به‌صورت `CustomEvent` فرستاده می‌شوند و مقدار جاری را در `detail` دارند.

| رویداد   | چه وقت رخ می‌دهد                                                 | `detail`            |
| -------- | ---------------------------------------------------------------- | ------------------- |
| `input`  | با هر ضربه کلید (هم‌رفتار با `input` بومی)                       | `{ value: string }` |
| `change` | هنگام نهایی‌شدن یا از دست دادن فوکوس (هم‌رفتار با `change` بومی) | `{ value: string }` |

### رویداد ورودی `input`

<ran-demo column>
  <r-input oninput="console.log(event.detail.value)" label="نام کاربری"></r-input>
</ran-demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'نام کاربری');
input.addEventListener('input', (event) => {
  console.log('در حال تایپ:', event.detail.value);
});
```

### رویداد تغییر `change`

<ran-demo column>
  <r-input onchange="console.log(event.detail.value)" label="نام کاربری"></r-input>
</ran-demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'نام کاربری');
input.addEventListener('change', (event) => {
  console.log('مقدار تغییر کرد:', event.detail.value);
});
```

## پیوند با فرم {#form-association}

`r-input` یک عنصر سفارشی پیوسته به فرم است (`static formAssociated = true`). `ElementInternals` را متصل می‌کند و مقدارش را با `setFormValue` می‌فرستد، پس اگر واقعاً از نوادگان یک `<form>` بومی باشد، `new FormData(form)` آن را جمع می‌کند؛ برای اینکه مقدار کلیدی داشته باشد `name` را تنظیم کنید. برای کمک‌کننده `serializeForm()` که یک ارسال را به شیء ساده تبدیل می‌کند، [فرم‌ها](/fa/src/ranui/form/) را ببینید.

```html
<form>
  <r-input name="username" label="نام کاربری"></r-input>
</form>
```

**بازنشانی**: یک `form.reset()` بومی (یا `<button type="reset">`) مقداری را برمی‌گرداند که فیلد هنگام نخستین اتصالش داشت. این کار با `formResetCallback()` انجام می‌شود، یکی از قلاب‌های چرخه عمر که مرورگر خودش روی عنصر سفارشی پیوسته به فرم صدا می‌زند.

**اعتبارسنجی**: تنظیم `required` باعث می‌شود فیلد خالی از راه `ElementInternals.setValidity()` نامعتبر شمرده شود؛ `form.checkValidity()` / `form.reportValidity()` آن را می‌بینند و هنگام ارسال، حباب اعتبارسنجی بومی مرورگر روی همان فیلد ظاهر می‌شود. فیلدهای `disabled` هرگز جلوی اعتبارسنجی را نمی‌گیرند، درست مثل `<input>` بومی. `r-input` متدها و ویژگی‌های همیشگی یک فیلد بومی را هم دارد: `checkValidity()`، `reportValidity()`، `validity`، `validationMessage`.

```html
<form>
  <r-input name="username" label="نام کاربری" required></r-input>
  <button type="submit">ارسال</button>
</form>
```

## Partهای CSS

از راه `::part()` برای استایل‌دهی بیرونی در دسترس‌اند.

| Part      | عنصر                                                     |
| --------- | -------------------------------------------------------- |
| `input`   | پوشش فیلد                                                |
| `content` | کنترل `<input>` بومیِ درونی                              |
| `label`   | برچسب ثابت بالای فیلد (وقتی `label` تنظیم شده باشد)      |
| `message` | متن راهنما یا اعتبارسنجی (وقتی `message` تنظیم شده باشد) |

```css
r-input::part(content) {
  font-size: 16px;
}
```

## استایل‌دهی

`<r-input>` **۶۱ ویژگی سفارشی CSS** از آنِ خود دارد، به‌علاوه توکن‌های معنایی که از پوسته می‌خواند. هر جا که ارث برسد می‌توانید یکی را تعیین کنید: `:root`، یک دربرگیرنده، یا خود عنصر:

```css
r-input {
  --ran-input-color: var(--ran-color-text-secondary);
}
```

Partها: `content` · `input` · `label` · `message`

فهرست کامل در [توکن‌های استایل](/fa/src/ranui/style-tokens#input) است؛ اینکه کدام توکن را به کار ببرید در [سیستم طراحی](/fa/src/ranui/design-system/) آمده.

## بهترین شیوه‌ها

- **برچسب‌ها**: یک `label` معنادار بگذارید تا فیلد نامی دسترس‌پذیر داشته باشد.
- **جای‌نگهدارها**: `placeholder` برای راهنمایی هنگام تایپ است، نه جایگزین برچسب.
- **وضعیت و پیام**: `status` را با `message` همراه کنید تا وضعیت تنها با رنگ اعلام نشود.
- **آیکن‌ها**: یک `icon` مرتبط بگذارید تا فیلد زودتر شناخته شود.
- **نوع‌ها**: `type` متناسب با محتوا را انتخاب کنید (`text`، `password`، `number`، …).
- **فرم‌ها**: وقتی مقدار را درون یک فرم جمع می‌کنید `name` را تنظیم کنید.
