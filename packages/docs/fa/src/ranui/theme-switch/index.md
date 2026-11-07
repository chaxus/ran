---
description: 'انتخابگر تم رنگی (system / light / dark) متصل به API تم ranui.'
---

# ThemeSwitch

یک **select** فشرده برای تم‌های رنگی (**system / light / dark**) متصل به
[API تم](/fa/ranui/theme/) ران‌یوآی. انتخاب یک گزینه `setTheme()` را صدا می‌زند، در `ran-theme`
ذخیره می‌کند و نمونه‌ها را همگام نگه می‌دارد. سبک / شیشه مایع محور جداست: از
`<r-surface-switch>` استفاده کنید.

> **زمان استفاده**: وقتی کنترل آمادهٔ تم رنگی می‌خواهید.

## شروع سریع

### استفاده پایه

<ran-demo>
  <r-theme-switch></r-theme-switch>
</ran-demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui';
import 'ranui/theme-switch';
```

یک‌بار هنگام بارگذاری `initTheme()` را صدا بزنید.

```js
import { initTheme } from 'ranui';
initTheme();
```

## مرجع API

### ویژگی‌ها

| ویژگی   | نوع                             | پیش‌فرض    | توضیح                                                       |
| ------- | ------------------------------- | ---------- | ----------------------------------------------------------- |
| `value` | `'system' \| 'light' \| 'dark'` | `'system'` | تم فعلی از `getTheme()`. مقداردهی اعمال و ذخیره می‌کند.    |
| `sheet` | `string`                        | `''`       | CSS تزریق‌شده به Shadow DOM.                                |

### ویژگی‌های بومی‌سازی

| ویژگی          | پیش‌فرض    | توضیح                       |
| -------------- | ---------- | --------------------------- |
| `label`        | `'Theme'`  | `aria-label` مربوط به select. |
| `label-system` | `'System'` | متن گزینه system.           |
| `label-light`  | `'Light'`  | متن گزینه light.            |
| `label-dark`   | `'Dark'`   | متن گزینه dark.             |

## رویدادها

| رویداد   | Detail                                     | توضیح                                          |
| -------- | ------------------------------------------ | ---------------------------------------------- |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | هنگام انتخاب تم. حباب می‌زند و از Shadow DOM می‌گذرد. |

## CSS Parts

| Part                        | توضیح                 |
| --------------------------- | --------------------- |
| `select`                    | `r-select` داخلی.     |
| `option`                    | هر `r-option`.        |
| `system` / `light` / `dark` | گزینه‌های جداگانه.    |

```css
r-theme-switch {
  --ran-theme-switch-width: 9rem;
}
```
