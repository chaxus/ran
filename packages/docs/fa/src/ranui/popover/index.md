---
description: 'پاپ‌اور ranui (<r-popover>) با هاور یا کلیک روی محرک، یک کارت شناور حبابی باز می‌کند؛ برای راهنماها، منوها و محتوای متناسب با زمینه.'
---

# Popover

کامپوننت پاپ‌اور که با هاور یا کلیک روی محرک، یک لایه کارت حبابی شناور را نمایان می‌کند.

> **کجا به کار می‌آید:** وقتی به یک پنل شناور نیاز دارید که با هاور یا کلیک روی یک محرک باز شود. `<r-popover>` پنل `<r-content>` را جانمایی و پرتال می‌کند و دسترس‌پذیری را هم برایتان سیم‌کشی می‌کند.

## شروع سریع

### کاربرد پایه

محرک در اسلات پیش‌فرض می‌نشیند؛ محتوای شناور در یک عنصر `<r-content>` تودرتو پیچیده می‌شود.

<Demo>
  <r-popover style="display: inline-block;">
    <r-button>popover</r-button>
    <r-content>
      <div>این محتوای پنل است</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover style="display: inline-block;">
  <r-button>popover</r-button>
  <r-content>
    <div>این محتوای پنل است</div>
  </r-content>
</r-popover>
```

## مرجع API

### ویژگی‌ها

| ویژگی                 | نوع      | پیش‌فرض   | توضیح                                                                                                                         |
| --------------------- | -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `placement`           | `string` | `'top'`   | جای پنل نسبت به محرک: `top`، `bottom`، `left`، `right`؛ هرکدام می‌توانند پسوند `-start` (پیش‌فرض)، `-center` یا `-end` بگیرند |
| `trigger`             | `string` | `'hover'` | شیوه باز شدن پنل: `hover` یا `click` (هندلر `click` همیشه متصل است)                                                           |
| `getPopupContainerId` | `string` | `''`      | `id` عنصری که پنل درون آن جانمایی شود (هنگام باز شدن خوانده می‌شود و به اتریبیوت بازتاب نمی‌یابد)                             |
| `sheet`               | `string` | `''`      | CSSی که به Shadow DOM کامپوننت تزریق می‌شود                                                                                   |

### شیوه باز شدن `trigger`

<Demo>
  <r-popover trigger="hover" style="display: inline-block;">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>
  <r-popover trigger="click" style="display: inline-block;">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover trigger="hover" style="display: inline-block;">
  <r-button>hover</r-button>
  <r-content>
    <div>hover</div>
  </r-content>
</r-popover>

<r-popover trigger="click" style="display: inline-block;">
  <r-button>click</r-button>
  <r-content>
    <div>click</div>
  </r-content>
</r-popover>
```

### جایگاه `placement`

<Demo column>
  <r-popover trigger="hover" placement="top" style="display: inline-block;">
    <r-button>top</r-button>
    <r-content>
      <div>top</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div>bottom</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="left" style="display: inline-block;">
    <r-button>left</r-button>
    <r-content>
      <div>left</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="right" style="display: inline-block;">
    <r-button>right</r-button>
    <r-content>
      <div>right</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover trigger="hover" placement="top" style="display: inline-block;">
  <r-button>top</r-button>
  <r-content>
    <div>top</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="bottom" style="display: inline-block;">
  <r-button>bottom</r-button>
  <r-content>
    <div>bottom</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="left" style="display: inline-block;">
  <r-button>left</r-button>
  <r-content>
    <div>left</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="right" style="display: inline-block;">
  <r-button>right</r-button>
  <r-content>
    <div>right</div>
  </r-content>
</r-popover>
```

### هم‌ترازی `placement="<سمت>-<هم‌ترازی>"`

اگر فقط سمت را بنویسید، لبه آغازین پنل با لبه آغازین محرک هم‌تراز می‌شود. وقتی باید روی محرک وسط‌چین باشد یا با لبه پایانی آن هم‌تراز شود، `-center` یا `-end` را اضافه کنید؛ منویی که به انتهای راست یک نوار بالایی چسبیده دقیقاً همین را می‌خواهد، تا رو به داخل باز شود نه اینکه اول از قاب بیرون بزند و بعد با جابه‌جایی به داخل رانده شود. این پسوند از چرخش خودکار جان سالم به در می‌برد: `bottom-end` می‌شود `top-end`، نه `top`.

<Demo column>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div style="width: 200px;">bottom — همان bottom-start</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-center" style="display: inline-block;">
    <r-button>bottom-center</r-button>
    <r-content>
      <div style="width: 200px;">bottom-center</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
    <r-button>bottom-end</r-button>
    <r-content>
      <div style="width: 200px;">bottom-end</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
  <r-button>bottom-end</r-button>
  <r-content>
    <div style="width: 200px;">bottom-end</div>
  </r-content>
</r-popover>
```

## اسلات‌ها

| کامپوننت      | اسلات     | توضیح                                                                                         |
| ------------- | --------- | --------------------------------------------------------------------------------------------- |
| `<r-popover>` | (پیش‌فرض) | عنصر محرک به‌علاوه پوشش `<r-content>`                                                         |
| `<r-content>` | (پیش‌فرض) | محتوای پنل شناور؛ این فرزندها به `document.body` پرتال می‌شوند و هنگام باز شدن نمایش می‌یابند |

هر دو کامپوننت تنها یک اسلات پیش‌فرض بی‌نام دارند؛ اسلات نام‌دار وجود ندارد.

## وضعیت باز `open`

`open` خودِ وضعیت پنل است و مثل `<details open>` و `<dialog open>` به اتریبیوت بازتاب می‌یابد. هیچ‌جا این وضعیت از روی `display` پنل حدس زده نمی‌شود، چون `display` به اندازه کل انیمیشن خروج از وضعیت عقب می‌ماند؛ بنابراین اتریبیوت، `aria-expanded` و آنچه روی صفحه است هرگز با هم نمی‌خوانند مگر اینکه یکی باشند.

```html
<r-popover id="pop" trigger="click">
  <r-button>محرک</r-button>
  <r-content><div>محتوا</div></r-content>
</r-popover>

<script>
  const pop = document.getElementById('pop');
  pop.open = true; // یا pop.show()
  pop.open = false; // یا pop.hide()
  pop.toggle();
</script>
```

`show()`، `hide()` و `toggle()` پوشش‌های نازکی روی همین هستند. `closePopover()` به‌عنوان نام مستعار `hide()` باقی مانده است.

## رویدادها

`<r-popover>` پیرامون گذارهای پنل چهار رویداد می‌فرستد که هیچ‌کدام `detail` ندارند:

| رویداد       | چه زمانی                                         |
| ------------ | ------------------------------------------------ |
| `show`       | پنل در آستانه ظاهر شدن است.                      |
| `after-show` | ظاهر شده و انیمیشن ورود (اگر بوده) تمام شده است. |
| `hide`       | پنل در آستانه بسته شدن است.                      |
| `after-hide` | بسته شده و انیمیشن خروج (اگر بوده) تمام شده است. |

آنچه انتظارش را می‌کشیم خودِ انیمیشن استایل‌شیت است، نه مدت‌زمانی که در اسکریپت رونویسی شده باشد. پس زیر `prefers-reduced-motion` (که اصلاً انیمیشنی برای پخش نیست) `after-hide` بی‌درنگ پس از `hide` می‌آید، نه پس از یک تأخیر ثابت.

جز این، کار را تعامل استاندارد DOM پیش می‌برد:

- **باز شدن**: `mouseenter` (وقتی `trigger` شامل `hover` است)، `click`، یا فشردن `Enter` / `Space` هنگام فوکوس.
- **بسته شدن**: `mouseleave` (حالت hover)، فشردن `Escape`، یا `click` در جای دیگری از سند.

در داخل، عنصر همراهِ `<r-content>` زیردرخت خودش را با یک `MutationObserver` می‌پاید و یک `CustomEvent` با نام `change` می‌فرستد (`detail: { type, value: { content, mutation } }`) که پاپ‌اور آن را می‌خورد تا پنل هماهنگ بماند. این یک جزئیات پیاده‌سازی است، نه API عمومی.

دسترس‌پذیری خودکار سیم‌کشی می‌شود: میزبان `tabindex="0"`، `aria-haspopup="dialog"` و یک `aria-expanded` می‌گیرد که با باز و بسته شدن پنل میان `"false"` و `"true"` جابه‌جا می‌شود.

## بهترین شیوه‌ها

- **عنصر محرک**: یک کنترل فوکوس‌پذیر (مثلاً `<r-button>`) را محرک قرار دهید تا باز و بسته کردن با صفحه‌کلید کار کند.
- **پوشش محتوا**: محتوای پنل را همیشه در `<r-content>` بپیچید؛ فرزندان معمولی که داخل `<r-content>` نباشند به‌عنوان پنل شناور نمایش داده نمی‌شوند.
- **اندازه درون‌خطی**: میزبان `display: block` است؛ با افزودن `style="display: inline-block;"` (یا قرار دادن آن در یک زمینه درون‌خطی) تا اندازه محرک جمع می‌شود.
- **جایگاه**: `placement` یک ترجیح است نه یک تضمین: وقتی محرک نزدیک لبه قاب دید باشد و سمت دلخواه جا نداشته باشد، پنل خودبه‌خود به سمت مقابل می‌چرخد و در راستای محور عرضی جابه‌جا می‌شود تا در صفحه بماند. این چرخش خودکار فقط برای جانمایی پیش‌فرض در سطح `body` اعمال می‌شود.
- **ظرف محدود**: وقتی جانمایی پیش‌فرض در سطح `body` مطلوب نیست، با `getPopupContainerId` پنل را درون یک ظرف اسکرول/جانمایی مشخص لنگر بیندازید. در این حالت چرخش و جابه‌جایی اعمال نمی‌شود، پس `placement`ی را انتخاب کنید که در آن ظرف جا شود. پسوند هم‌ترازی اما همان‌جا هم دقیقاً مثل پرتال `body` کار می‌کند.
