---
description: 'تب‌های ranui (<r-tabs>)، یک وب‌کامپوننت بومی که در هر فریم‌ورکی به کار می‌آید، محتوا را در پنل‌های قابل تعویض سامان می‌دهند.'
---

# Tab

ظرف زبانه‌داری که میان پنل‌ها جابه‌جا می‌شود. `<r-tabs>` را به‌عنوان ظرف بگذارید و یک یا چند پنل `<r-tab>` را درونش بچینید.

> **کجا به کار می‌آید:** وقتی به ظرفی زبانه‌دار نیاز دارید که میان پنل‌ها جابه‌جا شود. `<r-tabs>` را با فرزندان `<r-tab>` بسازید که هرکدام یک `label` برای سربرگ و بدنه پنل می‌آورند.

## شروع سریع

### کاربرد پایه

<Demo column>
  <r-tabs>
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs>
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

هر `<r-tab>` یک پنل می‌شود؛ `label` آن به‌شکل دکمه سربرگ رسم می‌شود و محتوایی که در اسلاتش می‌گذارید بدنه پنل است. با انتخاب یک سربرگ، پنل متناظر می‌لغزد و به دید می‌آید.

## مرجع API

### ویژگی‌های `r-tabs`

ظرف. ردیف سربرگ‌ها، نشانگر فعال و ناحیه محتوای پنل‌ها را در خود دارد.

| ویژگی    | نوع       | پیش‌فرض        | توضیح                                                              |
| -------- | --------- | -------------- | ------------------------------------------------------------------ |
| `active` | `string`  | نخستین تب فعال | مقدار `r-key` تبی که هم‌اکنون فعال است                             |
| `type`   | `string`  | `'flat'`       | سبک سربرگ: `flat`، `line`                                          |
| `align`  | `string`  | `'start'`      | هم‌ترازی سربرگ: `start`، `center`، `end`                           |
| `effect` | `boolean` | `false`        | موج کلیک روی دکمه‌های سربرگ را روشن و نشانگر لغزان را پنهان می‌کند |
| `sheet`  | `string`  | `''`           | متن CSSی که به Shadow DOM تزریق می‌شود                             |

> ستِرِ `active` یک رشته کلید می‌گیرد؛ دادن `null` اتریبیوت را برمی‌دارد. وقتی `active` تنظیم نشده باشد، هنگام سوارشدن نخستین تبِ غیرغیرفعال انتخاب می‌شود.

### ویژگی‌های `r-tab`

یک پنل تنها. اتریبیوت‌هایش را `<r-tabs>` والد می‌خواند تا دکمه سربرگ متناظر را بسازد.

| ویژگی      | نوع       | پیش‌فرض | توضیح                                                     |
| ---------- | --------- | ------- | --------------------------------------------------------- |
| `label`    | `string`  | `''`    | متنی که در سربرگ تب دیده می‌شود                           |
| `r-key`    | `string`  | اندیس   | شناسه یکتا درون یک `<r-tabs>`؛ با `active` سنجیده می‌شود  |
| `icon`     | `string`  | —       | نام `r-icon` که پیش از برچسب نمایش می‌یابد                |
| `iconSize` | `string`  | —       | اندازه آیکن سربرگ                                         |
| `disabled` | `boolean` | `false` | تب را غیرقابل انتخاب می‌کند                               |
| `effect`   | `boolean` | —       | جلوه موج روی سربرگ (معمولاً `effect` والد آن را می‌گذارد) |
| `sheet`    | `string`  | `''`    | متن CSSی که به Shadow DOM تزریق می‌شود                    |

> گتر و ستر ویژگی `key` اتریبیوت `r-key` را می‌خوانند و می‌نویسند (از نام ساده `key` پرهیز شده چون فیلدی رزروشده است). `label` و `r-key` را پیش از متصل‌شدن عنصر تنظیم کنید: پس از ساخته‌شدن سربرگ‌ها، تغییر این دو اتریبیوت دوباره پردازش نمی‌شود.

### سبک سربرگ `type`

`flat` (پیش‌فرض) یک زیرخط لغزان به‌عنوان نشانگر نشان می‌دهد؛ `line` سربرگ‌های کادردار رسم می‌کند.

<Demo column>
  <r-tabs type="flat">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs type="flat">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>

<r-tabs type="line">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### هم‌ترازی سربرگ `align`

ردیف سربرگ‌ها را هم‌تراز می‌کند. پیش‌فرض `start` است.

<Demo column>
  <r-tabs type="line" align="start">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="center">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="end">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs type="line" align="start"> ... </r-tabs>
<r-tabs type="line" align="center"> ... </r-tabs>
<r-tabs type="line" align="end"> ... </r-tabs>
```

### تب فعال: `active` و `r-key`

- `r-key` اتریبیوتی روی `<r-tab>` است که به هر پنل، درون همان `<r-tabs>`، هویتی پایدار می‌دهد. اگر نوشته نشود، اندیس پنل جای آن را می‌گیرد.
- `active` اتریبیوتی روی `<r-tabs>` است که تب فعالِ آغازین را برمی‌گزیند: پنلی دیده می‌شود که `r-key` آن با `active` برابر باشد.

بدون کلیدهای صریح، `active` با اندیسِ از صفر شروع‌شونده تطبیق می‌یابد:

<Demo column>
  <r-tabs active="1">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="1">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

با مقدارهای صریح `r-key` (پنل‌های بدون کلید به اندیس خود برمی‌گردند):

<Demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a">11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a">11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

> هر `r-key` درون یک `<r-tabs>` باید یکتا باشد: کلید تکراری یا جاافتاده روی بعضی پنل‌ها، هنگام ساخته‌شدن سربرگ‌ها خطا می‌دهد.

### پنل غیرفعال `disabled`

یک `<r-tab>` غیرفعال انتخاب نمی‌شود و هنگام برگزیدن تب فعالِ پیش‌فرض هم از قلم می‌افتد.

<Demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

### آیکن سربرگ: `icon` و `iconSize`

`<r-tab>` یک اتریبیوت `icon` (نام یک `r-icon`) می‌گیرد که پیش از برچسب رسم می‌شود؛ `iconSize` اندازه‌اش را تعیین می‌کند.

<Demo column>
  <r-tabs>
    <r-tab label="tab1" icon="edit">11111</r-tab>
    <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs>
  <r-tab label="tab1" icon="edit">11111</r-tab>
  <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### جلوه موج `effect`

روی `<r-tabs>` مقدار `effect` بگذارید تا موج کلیک روی دکمه‌های سربرگ فعال شود. تا وقتی `effect` روشن است، زیرخط لغزان پنهان می‌ماند.

<Demo column>
  <r-tabs effect="true">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs effect="true">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

## اسلات‌ها

| عنصر     | اسلات     | توضیح                                       |
| -------- | --------- | ------------------------------------------- |
| `r-tabs` | (پیش‌فرض) | پنل‌های `<r-tab>` را می‌پذیرد               |
| `r-tab`  | (پیش‌فرض) | بدنه پنل، که هنگام فعال بودن تب دیده می‌شود |

## Partهای CSS

`r-tabs` این‌ها را در اختیار می‌گذارد:

| Part           | توضیح                                    |
| -------------- | ---------------------------------------- |
| `tabs`         | پوشش ریشه                                |
| `header`       | پوشش ردیف سربرگ                          |
| `nav`          | tablistی که آیتم‌های سربرگ را در بر دارد |
| `indicator`    | خط زیرخط لغزان                           |
| `content`      | دریچه محتوای پنل                         |
| `content-wrap` | ریل لغزانی که همه پنل‌ها را نگه می‌دارد  |

`r-tab` این را در اختیار می‌گذارد:

| Part      | توضیح            |
| --------- | ---------------- |
| `content` | اسلات محتوای پنل |

## رویدادها

### `change`

`<r-tabs>` هرگاه یکی از اتریبیوت‌های زیر نظرش تغییر کند یک `CustomEvent` با نام `change` می‌فرستد؛ شاخص‌ترین مورد، تعویض تب فعال است. `event.detail.active` کلید فعال کنونی است (`r-key` همان `<r-tab>` انتخاب‌شده، یا اندیسش وقتی `r-key` تنظیم نشده باشد).

```js
const tabs = document.createElement('r-tabs');
tabs.addEventListener('change', (e) => {
  console.log('تب فعال:', e.detail.active);
});
tabbar.append(tabs);
```

`<r-tab>` هیچ رویداد سفارشی نمی‌فرستد.

## استایل‌دهی

`<r-tabs>` **۱۰ ویژگی سفارشی CSS** از آنِ خود دارد، به‌علاوه توکن‌های معنایی که از پوسته می‌خواند. هر جا که ارث برسد می‌توانید یکی را تعیین کنید: `:root`، یک دربرگیرنده، یا خود عنصر:

```css
r-tabs {
  --ran-tab-content-background: var(--ran-color-bg-subtle);
}
```

Partها: `content` · `content-wrap` · `header` · `indicator` · `nav` · `tabs`

فهرست کامل در [توکن‌های استایل](/fa/src/ranui/style-tokens#tab) است؛ اینکه سراغ کدام توکن بروید کار [سیستم طراحی](/fa/src/ranui/design-system/) است.

## بهترین شیوه‌ها

- **هویت پایدار**: به هر `<r-tab>` یک `r-key` یکتا بدهید و انتخاب را با `active` روی `<r-tabs>` بگردانید، نه با تکیه بر اندیس‌های موقعیتی.
- **انتخاب سبک**: برای نوار زبانه‌های کادردار و سندگونه از `type="line"` و برای زیرخط لغزانِ کمینه از `type="flat"` (پیش‌فرض) استفاده کنید.
- **هم‌ترازی**: برای جابه‌جا کردن ردیف سربرگ در ظرف‌های پهن از `align="center"` یا `align="end"` استفاده کنید.
- **پنل‌های غیرفعال**: پنل‌های در دسترس‌نبودن را با `disabled` علامت بزنید؛ هم در کلیک و هم در انتخاب پیش‌فرض نادیده گرفته می‌شوند.
- **پیمایش با صفحه‌کلید**: ردیف سربرگ یک tablist مطابق WAI-ARIA است: کلیدهای جهت میان تب‌ها حرکت می‌کنند (به‌همراه `Home`/`End`) و تنها تب فعال در ترتیب Tab قرار دارد.
