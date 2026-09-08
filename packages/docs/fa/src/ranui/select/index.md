---
description: 'انتخابگر ranui (<r-select>) یک منوی کشویی برای برگزیدن یک مقدار از میان گزینه‌هاست، با جست‌وجوی اختیاری و مشارکت در فرم بومی.'
---

# Select

انتخابگر کشویی برای برگزیدن یک مقدار از فهرستی از گزینه‌ها، با جست‌وجوی اختیاری و مشارکت در فرم.

> **کجا به کار می‌آید:** وقتی به یک انتخابگر کشویی تک‌مقداری نیاز دارید که از فرزندان `<r-option>` ساخته می‌شود، با جست‌وجوی اختیاری و مشارکت در فرم بومی. `<r-select>` باز شدن، پالایش و رساندن مقدار به `FormData` را به عهده می‌گیرد.

## شروع سریع

### کاربرد پایه

گزینه‌ها به‌صورت فرزندان `<r-option>` در اسلات داده می‌شوند. اتریبیوت `value` هر گزینه مقدار آن است و متن آن، برچسبی که نمایش می‌یابد.

<ran-demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## مرجع API

### ویژگی‌ها

| ویژگی                 | نوع       | پیش‌فرض    | توضیح                                                                                                                      |
| --------------------- | --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `label`               | `string`  | `''`       | نوشته ثابت بالای فیلد (همان الگوی `label` در `r-input`)، تا یک select برچسب‌دار با یک input برچسب‌دار در فرم هم‌تراز بماند |
| `value`               | `string`  | `''`       | مقدار انتخاب‌شده. تعیین آن برچسب حالت بسته را به‌روز می‌کند؛ تا وقتی `disabled` باشد نادیده گرفته می‌شود                   |
| `defaultValue`        | `string`  | `''`       | مقداری که در آغاز انتخاب می‌شود، با `value` گزینه‌ها سنجیده می‌شود                                                         |
| `disabled`            | `boolean` | `false`    | اینکه select غیرفعال باشد یا نه                                                                                            |
| `type`                | `string`  | `''`       | با `text` یک محرکِ بی‌کادر و شفاف بدون آیکن پیکان رسم می‌شود؛ در غیر این صورت کادردار                                      |
| `open`                | `boolean` | `false`    | اینکه منو باز است یا نه. این خودِ وضعیت است: با تعیین آن پنل باز یا بسته می‌شود                                            |
| `placement`           | `string`  | `'bottom'` | اینکه منو از کدام سمت باز شود، با هم‌ترازی اختیاری: `bottom`، `bottom-end`، `top-center`، …                                |
| `showSearch`          | `boolean` | `false`    | یک جعبه جست‌وجوی درون‌ساخت نشان می‌دهد که گزینه‌ها را بر پایه برچسب می‌پالاید                                              |
| `getPopupContainerId` | `string`  | `''`       | `id` عنصری که منو در آن سوار شود (پیش‌فرض `document.body`)                                                                 |
| `dropdownclass`       | `string`  | `''`       | کلاس سفارشی که روی پنل کشویی گذاشته می‌شود                                                                                 |
| `trigger`             | `string`  | `'click'`  | شیوه باز شدن منو: `click`، `hover` یا `click,hover` (روی موبایل، hover نادیده گرفته می‌شود)                                |
| `required`            | `boolean` | `false`    | اینکه برای ارسال فرم، انتخاب الزامی است یا نه                                                                              |
| `sheet`               | `string`  | `''`       | CSSی که به Shadow DOM تزریق می‌شود                                                                                         |

> **نکته:** `defaultValue` و `showSearch` واکنشی‌اند: تغییرشان پس از اتصال عنصر، (همراه با `value`، `disabled` و `sheet`) در `attributeChangedCallback` دوباره پردازش می‌شود. به‌روزکردن `defaultValue` انتخاب متناظر را دوباره اعمال می‌کند؛ روشن و خاموش کردن `showSearch` جعبه جست‌وجوی درون‌ساخت را وصل یا قطع می‌کند.

### ویژگی‌های گزینه

گزینه‌ها را با عناصر فرزند `<r-option>` بدهید.

| ویژگی      | نوع       | پیش‌فرض | توضیح                                                                      |
| ---------- | --------- | ------- | -------------------------------------------------------------------------- |
| `value`    | `string`  | `''`    | مقدار گزینه؛ هنگام انتخاب به‌عنوان مقدار select فرستاده می‌شود             |
| `disabled` | `boolean` | `false` | گزینه را غیرقابل انتخاب می‌کند؛ select آن را در کلیک و صفحه‌کلید رد می‌کند |
| `sheet`    | `string`  | `''`    | CSSی که به Shadow DOM گزینه تزریق می‌شود                                   |

گزینه‌هایی با برچسب یا مقدار تکراری یک `console.warn` ثبت می‌کنند.

### برچسب `label`

نوشته‌ای ثابت که بالای فیلد رسم می‌شود: همیشه دیده می‌شود و هرگز روی محتوای کناری نمی‌افتد. همان توکن‌ها و چیدمان `label` در `r-input` را به کار می‌برد، پس یک select برچسب‌دار و یک input برچسب‌دار که کنار هم در فرم گذاشته شوند هم‌تراز درمی‌آیند (هم‌ارتفاع، با لبه بالایی یکسان).

<ran-demo>
  <r-select label="کشور" style="width: 180px" defaultValue="185">
    <r-option value="185">ایالات متحده</r-option>
    <r-option value="186">کانادا</r-option>
    <r-option value="187">مکزیک</r-option>
  </r-select>
</ran-demo>

```html
<r-select label="کشور" defaultValue="185">
  <r-option value="185">ایالات متحده</r-option>
  <r-option value="186">کانادا</r-option>
  <r-option value="187">مکزیک</r-option>
</r-select>
```

### مقدار آغازین `defaultValue`

<ran-demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### حالت غیرفعال `disabled`

<ran-demo>
  <r-select style="width: 120px; height: 40px" disabled defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### گونه متنی `type`

<ran-demo>
  <r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### جهت باز شدن `placement`

`placement` یک ترجیح است نه یک تضمین: وقتی محرک نزدیک لبه قاب دید باشد و سمت دلخواه جا نداشته باشد، منو خودبه‌خود به سمت دیگر می‌چرخد و افقی جابه‌جا می‌شود تا در صفحه بماند. این فقط برای سوارشدن پیش‌فرض در سطح `body` است؛ با تعیین `getPopupContainerId`، `placement`ی را برگزینید که در آن ظرف جا شود.

هر سمت می‌تواند پسوند هم‌ترازی بگیرد: `bottom-end`، `top-center` و مانند آن، همان دستوری که `r-popover` می‌پذیرد. نوشتن تنهای سمت یعنی `-start`، که لبه آغازین پنل را با لبه آغازین محرک هم‌تراز می‌کند.

این پسوند تنها وقتی اثر دارد که پهنای پنل با پهنای محرکش فرق کند، چون پنل به‌طور پیش‌فرض پهنای محرک را دنبال می‌کند. اگر پنل را پهن‌تر کنید (`r-dropdown::part(dropdown)`، که از راه `dropdownclass` به آن می‌رسید، چون پنل به‌جای ماندن در shadow root انتخابگر به `<body>` پرتال می‌شود)، هم‌ترازی بر پایه چیزی که واقعاً رسم شده حساب می‌شود:

```html
<style>
  r-dropdown.wide::part(dropdown) {
    min-width: 220px;
  }
</style>

<!-- لبه راست پنل روی لبه راست محرک -->
<r-select placement="bottom-end" dropdownclass="wide" style="width: 80px">
  <r-option value="a">یک برچسب گزینه بسیار بلند</r-option>
</r-select>
```

توجه کنید که جابه‌جایی برای ماندن در مرز، بر هم‌ترازی می‌چربد: محرکی که به‌قدر کافی به لبه قاب دید نزدیک باشد، پنلش را هر هم‌ترازی که خواسته باشید دوباره به درون صفحه هل می‌دهند.

<ran-demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### وضعیت باز `open`

`open` خودِ وضعیت منوست و مثل `<details open>` و `<dialog open>` به اتریبیوت بازتاب می‌یابد. هیچ‌جا وضعیت از روی `display` پنل حدس زده نمی‌شود (که به اندازه انیمیشن خروج از وضعیت عقب می‌ماند)، پس اتریبیوت، `aria-expanded` و آنچه روی صفحه است نمی‌توانند با هم ناسازگار باشند.

همین باعث می‌شود این یک راه پشتیبانی‌شده برای گرداندن کامپوننت باشد، و چیزی که می‌توان بر آن استایل بست و در آزمون‌ها بر آن ادعا کرد:

```html
<r-select id="picker" open>
  <r-option value="185">Mike</r-option>
</r-select>

<script>
  const picker = document.getElementById('picker');
  picker.open = true; // یا picker.show()
  picker.open = false; // یا picker.hide()
  picker.toggle();
</script>

<style>
  /* محرک، تا وقتی پنلش باز است */
  r-select[open]::part(selection) {
    border-color: var(--ran-color-primary);
  }
</style>
```

`show()`، `hide()` و `toggle()` پوشش‌های نازکی روی همین هستند، برای جایی که یک متد بهتر از یک انتساب خوانده می‌شود.

### قابلیت جست‌وجو `showSearch`

<ran-demo>
  <r-select style="width: 120px; height: 40px" showSearch="true">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" showSearch="true">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### شیوه باز کردن `trigger`

<ran-demo>
  <r-select style="width: 120px; height: 40px" trigger="click,hover">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<!-- باز شدن با کلیک (پیش‌فرض) -->
<r-select trigger="click">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- باز شدن با هاور (روی موبایل نادیده گرفته می‌شود) -->
<r-select trigger="hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- هم کلیک هم هاور -->
<r-select trigger="click,hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### ظرف سوارشدن `getPopupContainerId`

منو به‌طور پیش‌فرض به `document.body` پرتال می‌شود. `id` عنصر دیگری را بدهید تا به‌جایش آنجا سوار شود.

```html
<r-select getPopupContainerId="my-container">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### کلاس سفارشی منو `dropdownclass`

```html
<r-select dropdownclass="custom-dropdown">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## رویدادها

### `change`

هنگام انتخاب یک گزینه فرستاده می‌شود. `event.detail` برابر `{ value, label }` است که در آن `value` مقدار گزینه برگزیده و `label` متن نمایشی آن است. انتخاب `defaultValue` آغازین رویداد `change` نمی‌فرستد.

```html
<r-select id="picker">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('picker').addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.label); // مثلاً "186" "Tom"
  });
</script>
```

### `search`

تنها وقتی `showSearch` روشن باشد فرستاده می‌شود، همان‌طور که کاربر در جعبه جست‌وجو تایپ می‌کند (با محدودسازی نرخ). `event.detail` برابر `{ value }` است، یعنی متن جست‌وجوی کنونی. کامپوننت در درون خود هم گزینه‌های دیده‌شده را بر پایه برچسب می‌پالاید.

```html
<r-select showSearch="true" id="searchable">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('searchable').addEventListener('search', (e) => {
    console.log(e.detail.value);
  });
</script>
```

### `show` / `after-show` / `hide` / `after-hide`

پیرامون گذارهای پنل فرستاده می‌شوند. `show` و `hide` هنگام آغاز گذار قصد را اعلام می‌کنند؛ `after-show` و `after-hide` وقتی می‌آیند که پنل واقعاً رسیده و هر انیمیشنی تمام شده باشد. اگر کاری فقط پس از رفتنِ واقعی پنل باید انجام شود، همین جفت دوم را گوش کنید.

این‌ها `detail` ندارند.

```html
<script>
  const picker = document.getElementById('picker');
  picker.addEventListener('show', () => console.log('در حال باز شدن'));
  picker.addEventListener('after-hide', () => console.log('بسته شد و انیمیشن هم تمام شد'));
</script>
```

آنچه انتظارش را می‌کشیم خودِ انیمیشن استایل‌شیت است، نه مدت‌زمانی که در اسکریپت رونویسی شده باشد. پس زیر `prefers-reduced-motion` (که پنل انیمیشنی برای پخش ندارد) `after-hide` بی‌درنگ پس از `hide` می‌آید، نه پس از یک تأخیر ثابت.

## پیوند با فرم {#form-association}

`r-select` یک عنصر سفارشی پیوسته به فرم است (`static formAssociated = true`). مقدار `value` برگزیده را از راه `ElementInternals` می‌فرستد، پس اگر واقعاً از نوادگان یک `<form>` بومی باشد، `new FormData(form)` آن را زیر `name` انتخابگر جمع می‌کند. مقدار فرم هنگام اتصال از هر انتخاب آغازینی ساخته می‌شود و با تغییر مقدار هماهنگ می‌ماند.

**بازنشانی**: یک `form.reset()` بومی، اگر `defaultValue` تعیین شده باشد انتخابِ آن را برمی‌گرداند و در غیر این صورت انتخاب را یکسره پاک می‌کند؛ این کار با `formResetCallback()` انجام می‌شود.

**اعتبارسنجی**: `required` نبودِ انتخاب را از راه `ElementInternals.setValidity()` نامعتبر می‌کند و این برای `form.checkValidity()` / `form.reportValidity()` دیدنی است؛ یک انتخابگر `disabled` هرگز جلوی اعتبارسنجی را نمی‌گیرد. `checkValidity()`، `reportValidity()`، `validity` و `validationMessage` روی عنصر در دسترس‌اند، درست مانند یک فیلد بومی.

```html
<form>
  <r-select name="country" required>
    <r-option value="us">ایالات متحده</r-option>
    <r-option value="ca">کانادا</r-option>
  </r-select>
  <button type="submit">ارسال</button>
</form>
```

## اسلات‌ها

| اسلات     | توضیح                                                                |
| --------- | -------------------------------------------------------------------- |
| (پیش‌فرض) | عناصر `<r-option>` را می‌پذیرد که گزینه‌های انتخابی را تعریف می‌کنند |

## Partهای CSS

| Part             | توضیح                                                  |
| ---------------- | ------------------------------------------------------ |
| `select`         | پوشش ریشه انتخابگر                                     |
| `selection`      | جعبه محرک (کادر، پس‌زمینه، چیدمان)                     |
| `icon`           | آیکن پیکان منو                                         |
| `selection-item` | عنصری که برچسب گزینه برگزیده را نشان می‌دهد            |
| `search`         | ورودی جست‌وجوی درون‌ساخت (با `showSearch` دیده می‌شود) |
| `label`          | برچسب ثابت بالای فیلد (وقتی `label` تنظیم شده باشد)    |

## بهترین شیوه‌ها

- **گزینه‌های زیاد**: `showSearch` را روشن کنید تا بشود بر پایه برچسب پالایش کرد.
- **شیوه باز کردن**: `trigger` را با انتظار کاربران هماهنگ کنید؛ روی موبایل `hover` نادیده گرفته می‌شود، پس `click` را در دسترس نگه دارید.
- **جای سوارشدن**: در چیدمان‌هایی که اسکرول دارند یا سرریز را می‌برند، با `getPopupContainerId` تعیین کنید منو کجا سوار شود.
- **استایل سفارشی**: با `dropdownclass` یا نام‌های `::part()`ی که در اختیارتان است، ظاهر محرک و منو را تغییر دهید.
- **فرم‌ها**: به انتخابگر یک `name` بدهید تا مقدارش درون یک `<form>` بومی توسط `FormData` گرفته شود.
