---
description: 'کنترل بخش‌بندی‌شدهٔ سه‌حالته (سیستم/روشن/تیره) که به API پوستهٔ ranui وصل است و میان زبانه‌ها همگام می‌ماند.'
---

# ThemeSwitch

کنترلی بخش‌بندی‌شده با سه حالت (**سیستم / روشن / تیره**) که به
[API پوستهٔ](/fa/src/ranui/theme/) ranui وصل است. کلیک روی هر بخش `setTheme()` را صدا می‌زند،
انتخاب را زیر کلید localStorage با نام `ran-theme` نگه می‌دارد و همهٔ نمونه‌های روی صفحه (و در
زبانه‌های دیگر) را همگام نگه می‌دارد.

> **کجا به کارش ببرید**: وقتی کنترلی آمادهٔ سیستم/روشن/تیره می‌خواهید که به API پوستهٔ ranui وصل باشد. `<r-theme-switch>` ماندگاری، دنبال‌کردن سیستم و همگام‌سازی میان زبانه‌ها را برعهده می‌گیرد تا خودتان کلید ساز‌ودست نکنید.

## شروع سریع

### استفادهٔ پایه

<ran-demo>
  <r-theme-switch></r-theme-switch>
</ran-demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui'; // یا نقطهٔ ورود مستقل:
import 'ranui/theme-switch';
```

> 💡 **در همین سایت مستندات** پوسته را کلید سراسری داخل سربرگ تعیین می‌کند و خودش `data-ran-theme`
> را بازنویسی می‌کند، پس ممکن است نمونهٔ بالا را سایت بازنشانی کند. در برنامهٔ خودتان
> `<r-theme-switch>` مرجع نهایی است.

هنگام بارگذاری صفحه یک بار `initTheme()` را صدا بزنید تا انتخاب ذخیره‌شده پیش از رندر کلید بازیابی شود:

```js
import { initTheme } from 'ranui';
initTheme();
```

## مرجع API

### خصیصه‌ها

| خصیصه   | نوع                             | پیش‌فرض    | توضیح                                                                                              |
| ------- | ------------------------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| `value` | `'system' \| 'light' \| 'dark'` | `'system'` | انتخاب کنونی که از API پوسته (`getTheme()`) خوانده می‌شود. تعیین آن پوسته را اعمال و ذخیره می‌کند. |
| `sheet` | `string`                        | `''`       | CSS تزریق‌شده به shadow DOM کامپوننت.                                                              |

### ویژگی‌های بومی‌سازی

هر سه دکمه فقط آیکون دارند، پس هرکدام یک `aria-label` هم دارند. برای بومی‌سازی آن‌ها را بازنویسی کنید:

| ویژگی          | پیش‌فرض          | توضیح                     |
| -------------- | ---------------- | ------------------------- |
| `label`        | `'Theme'`        | `aria-label` گروه کنترل.  |
| `label-system` | `'System theme'` | `aria-label` دکمهٔ سیستم. |
| `label-light`  | `'Light theme'`  | `aria-label` دکمهٔ روشن.  |
| `label-dark`   | `'Dark theme'`   | `aria-label` دکمهٔ تیره.  |

```html
<r-theme-switch
  label="پوسته"
  label-system="پوستهٔ سیستم"
  label-light="پوستهٔ روشن"
  label-dark="پوستهٔ تیره"
></r-theme-switch>
```

## رویدادها

| رویداد   | Detail                                     | توضیح                                                                   |
| -------- | ------------------------------------------ | ----------------------------------------------------------------------- |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | وقتی کاربر پوسته‌ای را برمی‌گزیند. حباب می‌کند و از shadow DOM می‌گذرد. |

```js
const themeSwitch = document.createElement('r-theme-switch');
themeSwitch.addEventListener('change', (e) => {
  console.log('theme is now', e.detail.theme);
});
toolbar.append(themeSwitch);
```

## رفتار

- **ماندگاری**: انتخاب‌ها از `setTheme()` می‌گذرند، پس در localStorage (`ran-theme`) ذخیره و در
  بازدید بعدی با `initTheme()` بازیابی می‌شوند.
- **همگامی چند نمونه**: یک کلید در سربرگ و یکی در پاورقی بگذارید؛ انتخاب پوسته در هرکدام هر دو را
  به‌روز می‌کند.
- **همگامی میان زبانه‌ها**: پوسته‌ای که در زبانهٔ دیگری عوض شود، از راه رویداد `storage` این کنترل را
  هم به‌روز می‌کند.
- **پوستهٔ مرورگر**: تعیین صریح روشن یا تیره، `<meta name="theme-color">` را به زمینهٔ نهایی صفحه
  به‌روز می‌کند تا نوارهای مرورگر یا PWA هماهنگ شوند؛ انتخاب `system` محتوای اصلی هر meta را (که
  ممکن است شرط مدیا داشته باشد) برمی‌گرداند.

## Part‌های CSS

| Part                        | توضیح                                                                          |
| --------------------------- | ------------------------------------------------------------------------------ |
| `switch`                    | قرصِ بخش‌بندی‌شدهٔ بیرونی.                                                     |
| `button`                    | هر دکمهٔ انتخاب (هرکدام نام انتخاب خود را هم به‌عنوان part دیگری عرضه می‌کند). |
| `system` / `light` / `dark` | تک‌تک دکمه‌های انتخاب.                                                         |

```css
r-theme-switch::part(switch) {
  border-color: var(--line);
}
r-theme-switch::part(dark) {
  color: rebeccapurple;
}
```

این متغیرهای CSS را می‌توان بازنویسی کرد: `--ran-theme-switch-display`،
`--ran-theme-switch-gap`، `--ran-theme-switch-padding`، `--ran-theme-switch-border-color`،
`--ran-theme-switch-radius`، `--ran-theme-switch-background`، `--ran-theme-switch-button-size`،
`--ran-theme-switch-icon-size`، `--ran-theme-switch-button-color`، `--ran-theme-switch-button-hover-color`،
`--ran-theme-switch-button-active-background`، `--ran-theme-switch-button-active-color`،
`--ran-theme-switch-button-focus-outline`.

```css
r-theme-switch {
  --ran-theme-switch-button-size: 32px;
  --ran-theme-switch-icon-size: 18px;
}
```

## بهترین شیوه‌ها

- **یک مرجع یگانه**: به‌جای ساختن کلید دستی از `<r-theme-switch>` استفاده کنید؛ ماندگاری،
  دنبال‌کردن سیستم، همگامی نمونه‌ها و متاهای `theme-color` را از پیش انجام می‌دهد.
- **زود بازیابی کنید**: برای پرهیز از جهش روشن به تیره، `initTheme()` را هرچه زودتر صدا بزنید
  (ترجیحاً به‌صورت درون‌خطی پیش از نخستین ترسیم).
- **بومی‌سازی کنید**: دکمه‌ها فقط آیکون دارند؛ برای رابط‌های غیرانگلیسی `label` و `label-*` را تعیین کنید.
