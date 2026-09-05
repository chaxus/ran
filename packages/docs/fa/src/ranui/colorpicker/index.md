---
description: 'نمونهٔ رنگ فشرده‌ای که پنلی با مهارهای اشباع/روشنایی، فام و شفافیت و نیز ورودی HEX/RGB باز می‌کند.'
---

# Color Picker

نمونهٔ رنگ فشرده‌ای که پنلی شناور با پالت اشباع و روشنایی، لغزندهٔ فام، لغزندهٔ شفافیت و ورودی مقدار HEX/RGB باز می‌کند. `value` آن رشته‌های رنگ استاندارد CSS را می‌پذیرد و همان‌ها را برمی‌گرداند.

> **کجا به کارش ببرید**: وقتی می‌خواهید کاربر با پنل اشباع/فام/شفافیت و ورودی HEX/RGB رنگی برگزیند. `<r-colorpicker>` رشته‌های رنگ استاندارد CSS را می‌گیرد و می‌دهد و در `change` همهٔ قالب‌ها را گزارش می‌کند.

## شروع سریع

### استفادهٔ پایه

<Demo align="start">
  <r-colorpicker value="#006bff"></r-colorpicker>
  <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
</Demo>

```html
<r-colorpicker value="#006bff"></r-colorpicker> <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
```

روی نمونه کلیک کنید (یا فوکوس بدهید و Enter/Space بزنید) تا پنل باز شود. لغزنده‌های فام و شفافیت با صفحه‌کلید هم کار می‌کنند: کلیدهای جهت‌دار یک واحد، Shift+جهت ده واحد، و Home/End به دو انتها می‌پرند.

## مرجع API

### خصیصه‌ها

| خصیصه      | نوع       | پیش‌فرض | توضیح                                                                            |
| ---------- | --------- | ------- | -------------------------------------------------------------------------------- |
| `value`    | `string`  | `''`    | رنگ کنونی به‌شکل رشتهٔ رنگ CSS (HEX، `rgb(...)`، `rgba(...)`)                    |
| `disabled` | `boolean` | `false` | با بودنش، نمونه باز نمی‌شود، از ترتیب tab بیرون می‌رود و `aria-disabled` می‌گیرد |
| `sheet`    | `string`  | `''`    | CSS تزریق‌شده به shadow DOM کامپوننت                                             |

### مقدار `value`

رنگ کنونی، به‌شکل رشتهٔ رنگ CSS. در ورودی HEX (`#1677FF`، `#fff`)، `rgb(...)` و `rgba(...)` را می‌پذیرد. در خروجی، مقدار متعارفی که بازخوانده می‌شود اگر رنگ کاملاً مات باشد رشتهٔ HEX شش‌رقمی است و اگر شفافیت کمتر از ۱ باشد رشتهٔ `rgba(...)`.

<Demo align="start">
  <r-colorpicker value="#00c853"></r-colorpicker>
  <r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
</Demo>

```html
<r-colorpicker value="#00c853"></r-colorpicker>
<r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
<r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
```

```js
const picker = document.createElement('r-colorpicker');
picker.value = '#00c853';
console.log(picker.value); // رنگ کنونی را بازمی‌خواند
toolbar.append(picker);
```

### غیرفعال `disabled`

ویژگی `disabled` را بگذارید تا انتخابگر بی‌اثر شود: نمونه دیگر پنل را باز نمی‌کند (نه با ماوس نه با صفحه‌کلید)، از ترتیب tab بیرون می‌رود و روی میزبان `aria-disabled="true"` گذاشته می‌شود. با برداشتن ویژگی، تعامل عادی برمی‌گردد.

<Demo align="start">
  <r-colorpicker value="#006bff" disabled></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)" disabled></r-colorpicker>
</Demo>

```html
<r-colorpicker value="#006bff" disabled></r-colorpicker>
```

```js
const picker = document.createElement('r-colorpicker');
picker.disabled = true; // بستن راه تعامل
picker.disabled = false; // فعال‌سازی دوباره
toolbar.append(picker);
```

### استایل بیرونی `sheet`

کد CSS که به shadow DOM کامپوننت تزریق می‌شود و از همان قرارداد `sheet` پیروی می‌کند که همهٔ کامپوننت‌های دیگر ranui دارند.

```html
<r-colorpicker value="#006bff" sheet=".ran-colorpicker { border-radius: 6px; }"></r-colorpicker>
```

## رویدادها

### `change`

هر بار که رنگ عوض شود رخ می‌دهد: کشیدن روی پالت، حرکت‌دادن لغزنده، ویرایش ورودی مقدار، یا تعیین ویژگی `value`. این رویداد **حباب می‌کند** و **composed** است (از مرزهای shadow می‌گذرد). `event.detail` رنگ را در همهٔ قالب‌ها حمل می‌کند:

| فیلد    | نوع      | نمونه                                     |
| ------- | -------- | ----------------------------------------- |
| `value` | `string` | `"#1677ff"` / `"rgba(22, 119, 255, 0.5)"` |
| `hex`   | `string` | `"#1677ff"`                               |
| `rgb`   | `string` | `"rgb(22, 119, 255)"`                     |
| `rgba`  | `string` | `"rgba(22, 119, 255, 0.5)"`               |
| `alpha` | `number` | `0.5`                                     |

```html
<r-colorpicker value="#1677ff"></r-colorpicker>

<script>
  const picker = document.createElement('r-colorpicker');
  picker.addEventListener('change', (e) => {
    console.log(e.detail.hex, e.detail.alpha);
  });
  toolbar.append(picker);
</script>
```

## Part‌های CSS

نمونه‌ای که پنل را باز می‌کند دو Part برای استایل‌دهی از بیرون shadow DOM در اختیار می‌گذارد:

| Part     | توضیح                                           |
| -------- | ----------------------------------------------- |
| `block`  | نگه‌دارندهٔ نمونه (جعبهٔ ماشه با زمینهٔ شطرنجی) |
| `swatch` | پرشدگی درونی که رنگ کنونی را نشان می‌دهد        |

```css
r-colorpicker::part(block) {
  box-shadow: 0 0 0 1px var(--line);
}
```

پنل شناور به `document.body` منتقل می‌شود، پس استایل‌هایش فضای نام دارند (`.ran-color-picker-*`) و به‌جای ماندن روی میزبان، همراه خود پنل می‌روند.

### متغیرهای CSS

نمونهٔ ماشه این توکن‌ها را می‌خواند:

| متغیر                                   | کاربرد                           |
| --------------------------------------- | -------------------------------- |
| `--ran-colorpicker-background`          | زمینهٔ نمونه                     |
| `--ran-colorpicker-border`              | حاشیهٔ نمونه                     |
| `--ran-colorpicker-hover-border-color`  | رنگ حاشیه هنگام نگه‌داشتن نشانگر |
| `--ran-colorpicker-border-radius`       | گردی گوشهٔ نمونه                 |
| `--ran-colorpicker-block-border-radius` | گردی گوشهٔ بلوک درونی            |
| `--ran-colorpicker-transition`          | گذارِ hover                      |

```css
r-colorpicker {
  --ran-colorpicker-border-radius: 6px;
}
```

## بهترین شیوه‌ها

- **قالب‌های ورودی**: به `value` هر رشتهٔ رنگ CSS‌ای بدهید: HEX، `rgb(...)` یا `rgba(...)`؛ انتخابگر درون خودش آن را متعارف می‌کند.
- **خواندن نتیجه**: به `change` گوش بدهید و همان قالبی را که لازم دارید از `event.detail` بخوانید (`hex`، `rgb`، `rgba`، `alpha`).
- **شفافیت**: هرجا شفافیت لازم شد ورودی `rgba(...)` یا لغزندهٔ شفافیت را به کار ببرید؛ به‌محض اینکه شفافیت زیر ۱ بیفتد، `value`ِ بازخوانده به رشتهٔ `rgba(...)` تبدیل می‌شود.
- **صفحه‌کلید**: نمونه و هر دو لغزنده فوکوس‌پذیر و با صفحه‌کلید قابل استفاده‌اند؛ نیازی به ماوس نیست.
- **بارگذاری**: با `import 'ranui'` (که همهٔ کامپوننت‌ها را ثبت می‌کند) یا با `import 'ranui/colorpicker'`ِ مستقل بار کنید.
