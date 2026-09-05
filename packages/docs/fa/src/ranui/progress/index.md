---
description: 'کامپوننت Progress در ranui (<r-progress>) پیشرفت کار را به‌شکل نوار نشان می‌دهد و می‌تواند دستگیرهٔ کشیدنی هم داشته باشد.'
---

# Progress

نوار پیشرفت برای نشان‌دادن پیشرفت کار، با دستگیرهٔ کشیدنی اختیاری.

> **کجا به کارش ببرید**: وقتی نواری می‌خواهید که پیشرفت کاری را نشان دهد. برای پیشرفت فقط‌خواندنی `<r-progress>` را همان‌طور به کار ببرید و اگر کاربر باید مقدار را با دستگیرهٔ کشیدنی تعیین کند از `type="drag"` استفاده کنید.

## شروع سریع

<Demo>
  <r-progress percent="40%"></r-progress>
</Demo>

```html
<r-progress percent="40%"></r-progress>
```

> 💡 **نکته**: `r-progress` عنصری بلوکی و بدون عرض ذاتی است. داخل یک ردیف flex ممکن است تا عرض صفر جمع شود؛ عرض صریح بدهید (مثلاً `style="width:100%"`) یا آن را در بافتار بلوکی بگذارید.

## مرجع API

### خصیصه‌ها

| خصیصه     | نوع      | پیش‌فرض     | توضیح                                                       |
| --------- | -------- | ----------- | ----------------------------------------------------------- |
| `percent` | `string` | `'0'`       | پیشرفت کنونی؛ عدد یا درصد می‌پذیرد. سقف آن `total` است.     |
| `total`   | `string` | `'100'`     | کل پیشرفت؛ عدد یا درصد می‌پذیرد.                            |
| `type`    | `string` | `'primary'` | نوع نوار: `primary` (ایستا) یا `drag` (کلیک‌شدنی / کشیدنی). |
| `dot`     | `string` | `'true'`    | اینکه دستگیرهٔ کشیدن نشان داده شود: `true` یا `false`.      |
| `sheet`   | `string` | `''`        | CSS تزریق‌شده به shadow DOM کامپوننت.                       |

### مقدار پیشرفت `percent`

پیشرفت کنونی را تعیین می‌کند. عدد یا رشتهٔ درصد می‌پذیرد و نمی‌تواند از `total` بگذرد. اگر `total` تعیین نشده باشد پیش‌فرض آن `100` است، یعنی `percent` به‌عنوان درصدی از ۱۰۰ خوانده می‌شود.

<Demo column>
  <r-progress percent="30%"></r-progress>
  <r-progress percent="70%"></r-progress>
  <r-progress percent="100%"></r-progress>
</Demo>

```html
<r-progress percent="30%"></r-progress>
<r-progress percent="70%"></r-progress>
<r-progress percent="100%"></r-progress>
```

### کل پیشرفت `total`

مخرج `percent` را تعیین می‌کند. هم عدد و هم درصد مجاز است، پس `percent="30" total="1000"` نوار را ۳٪ پر می‌کند.

<Demo column>
  <r-progress percent="30" total="1000"></r-progress>
  <r-progress percent="70" total="100"></r-progress>
  <r-progress percent="10%" total="100%"></r-progress>
</Demo>

```html
<r-progress percent="30" total="1000"></r-progress>
<r-progress percent="70" total="100"></r-progress>
<r-progress percent="10%" total="100%"></r-progress>
```

### نوع نوار `type`

- `primary`: نوار پیشرفت ایستا. وقتی `type` تعیین نشده باشد همین پیش‌فرض است.
- `drag`: نوار کلیک‌شدنی و کشیدنی. کلیک روی ریل یا کشیدن دستگیره `percent` را به‌روز می‌کند و رویداد `change` می‌فرستد. کشیدن دستگیره به `dot="true"` نیاز دارد.

<Demo column>
  <r-progress type="drag" percent="30%"></r-progress>
  <r-progress type="primary" percent="40%"></r-progress>
</Demo>

```html
<r-progress type="drag" percent="30%"></r-progress> <r-progress type="primary" percent="40%"></r-progress>
```

### دستگیرهٔ کشیدن `dot`

نمایش دستگیره را روشن و خاموش می‌کند. دستگیره تنها وقتی ترسیم می‌شود که `dot="true"` **و** `type="drag"` باشد؛ روی نوار ایستای `primary` عمداً حذف می‌شود، پس آنجا `dot` اثر دیدنی ندارد.

<Demo column>
  <r-progress type="drag" percent="30%" dot="true"></r-progress>
  <r-progress type="drag" percent="30%" dot="false"></r-progress>
</Demo>

```html
<r-progress type="drag" percent="30%" dot="true"></r-progress>
<r-progress type="drag" percent="30%" dot="false"></r-progress>
```

## رویدادها

### `change`

در نوع `drag`، هر بار که کاربر روی ریل کلیک کند یا دستگیره را بکشد و `percent` عوض شود ارسال می‌شود. شیء `detail` این‌ها را حمل می‌کند:

| فیلد      | نوع      | توضیح        |
| --------- | -------- | ------------ |
| `value`   | `string` | پیشرفت کنونی |
| `percent` | `string` | پیشرفت کنونی |
| `total`   | `string` | کل پیشرفت    |

```html
<r-progress type="drag" percent="30%"></r-progress>

<script>
  const progress = document.createElement('r-progress');
  progress.type = 'drag';
  progress.percent = '30%';
  progress.addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.percent, e.detail.total);
  });
  container.append(progress);
</script>
```

## Part‌های CSS

| Part    | توضیح               |
| ------- | ------------------- |
| `track` | ریل پیشرفت (زمینه). |
| `fill`  | بخش پرشدهٔ ریل.     |
| `dot`   | دستگیرهٔ کشیدن.     |

```css
r-progress::part(fill) {
  background: var(--ran-color-primary);
}
```

## بهترین شیوه‌ها

- **نوارهای ایستا**: برای نمایش پیشرفت فقط‌خواندنی از پیش‌فرض `type="primary"` استفاده کنید.
- **نوارهای تعاملی**: اگر کاربر باید مقدار را تعیین کند از `type="drag"` استفاده کنید و به رویداد `change` گوش بدهید.
- **درصد یا عدد**: `percent` و `total` را آزادانه ترکیب کنید؛ وقتی به یک کل مشخص نگاشت می‌شوند عدد خام بدهید و برای مهار مستقیم، درصد.
- **عرض در چیدمان**: نوار را در نگه‌دارنده‌ای بلوکی بپیچید یا عرض صریح بدهید تا در چیدمان‌های flex جمع نشود.
