---
description: 'کامپوننت StateDot در ranui (<r-state-dot>) یک نشانگر ۸ پیکسلی چرخهٔ عمر (idle، running، success، warning، error) است که هاله و مغزهٔ آن در یک عنصر ترسیم می‌شود.'
---

# StateDot

نشانگر ۸ پیکسلی چرخهٔ عمر: هاله و مغزه در یک عنصر و هر دو با `currentColor`، پس هر وضعیت یک قاعدهٔ
رنگ است نه دو توکن.

> **کجا به کارش ببرید**: وقتی یک ردیف باید نشان دهد کاری در چه مرحله‌ای است (در صف، در حال اجرا،
> تمام‌شده، ناموفق) بدون اینکه یک سطر کامل صرف آن شود. همان نقطه‌ای که `<r-tool-card>` و نشانهٔ
> فشرده‌سازی هم از آن استفاده می‌کنند.

## شروع سریع

### استفادهٔ پایه

<ran-demo>
  <r-state-dot state="idle"></r-state-dot>
  <r-state-dot state="running"></r-state-dot>
  <r-state-dot state="success"></r-state-dot>
  <r-state-dot state="warning"></r-state-dot>
  <r-state-dot state="error"></r-state-dot>
</ran-demo>

```html
<r-state-dot state="idle"></r-state-dot>
<r-state-dot state="running"></r-state-dot>
<r-state-dot state="success"></r-state-dot>
<r-state-dot state="warning"></r-state-dot>
<r-state-dot state="error"></r-state-dot>
```

فقط `running` می‌تپد و بقیه ساکن‌اند. مقدار ناشناخته به‌جای ناپدید شدن مثل `idle` ترسیم می‌شود، پس
وضعیتی که سمت تولیدکننده اضافه شده و صفحه هنوز آن را نمی‌شناسد، همچنان جای خودش را در ردیف نگه می‌دارد.

### کنار یک برچسب

این نقطه وضعیت را فقط با رنگ می‌رساند و توضیح نمی‌دهد آن رنگ یعنی چه. هرگز نگذارید رنگ تنها چیزی
باشد که دو ردیف را از هم جدا می‌کند. [راهنمای طراحی](/fa/src/ranui/design-guides/#accessibility)
را ببینید.

<ran-demo column>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="running"></r-state-dot>
    <span>اجرای آزمون‌ها</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="error"></r-state-dot>
    <span>۲ آزمون ناموفق</span>
  </div>
</ran-demo>

## مرجع API

### خصیصه‌ها

| خصیصه   | ویژگی   | نوع                                                        | پیش‌فرض  | توضیح                                              |
| ------- | ------- | ---------------------------------------------------------- | -------- | -------------------------------------------------- |
| `state` | `state` | `'idle' \| 'running' \| 'success' \| 'warning' \| 'error'` | `'idle'` | کدام مرحله نشان داده شود. مقدار ناشناخته → `idle`. |
| `label` | `label` | `string`                                                   | `''`     | نام دسترس‌پذیر. پایین‌تر را ببینید.                |
| `sheet` | `sheet` | `string`                                                   | `''`     | CSS تزریق‌شده به shadow root.                      |

### دسترس‌پذیری

**تا وقتی `label` ندهید، این نقطه `aria-hidden` است.** نقطه‌ای کنار ردیفی که نتیجه را همان‌جا با
متن گفته، برای صفحه‌خوان فقط نوفه است؛ دو بار گفتن «در حال اجرا» به کسی کمک نمی‌کند. `label` را
تنها وقتی تعیین کنید که نقطه _تنها_ حامل وضعیت باشد:

```html
<!-- متن خودش گفته است: نقطه را ساکت بگذارید -->
<r-state-dot state="error"></r-state-dot> <span>ساخت ناموفق بود</span>

<!-- در این خانه فقط نقطه هست: نامش بدهید -->
<r-state-dot state="error" label="ساخت ناموفق بود"></r-state-dot>
```

### Part‌ها

| Part  | عنصر      |
| ----- | --------- |
| `dot` | خودِ نقطه |

### استایل

هر وضعیت **یک** رنگ است: هاله همان رنگ با ۱۶٪ و مغزه نسخهٔ ۶۰٪ تودررفتهٔ آن، و هر دو از
`currentColor` کشیده می‌شوند. پس هر وضعیت یک توکن است، نه دو تا:

| توکن                            | پیش‌فرض                            |
| ------------------------------- | ---------------------------------- |
| `--ran-state-dot-size`          | `8px`                              |
| `--ran-state-dot-color`         | `--ran-color-text-disabled` (idle) |
| `--ran-state-dot-running-color` | `--ran-color-primary`              |
| `--ran-state-dot-success-color` | `--ran-color-success`              |
| `--ran-state-dot-warning-color` | `--ran-color-warning`              |
| `--ran-state-dot-error-color`   | `--ran-color-danger`               |
| `--ran-state-dot-halo-opacity`  | `0.16`                             |

`running` به‌جای چرخیدن، مغزه را می‌تپاند (در ۸ پیکسل، آیکون چرخان آن‌قدر کوچک است که چرخش‌اش
خوانده نمی‌شود) و این تپش زیر `prefers-reduced-motion` متوقف می‌شود.
