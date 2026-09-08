---
description: 'کامپوننت Button در ranui (<r-button>) یک وب‌کامپوننت مستقل از فریم‌ورک است که کنش‌های فوری را با انواع، اندازه‌ها و حالت‌های بارگذاری/غیرفعال اجرا می‌کند.'
---

# Button

کامپوننت دکمه برای اجرای کنش‌های فوری، با چند سبک و چند حالت.

> **کجا به کارش ببرید**: وقتی به یک کنترلِ کنشِ کلیک‌شدنی نیاز دارید که سبک‌های آمادهٔ primary/contrast/warning/text به‌همراه حالت غیرفعال و آیکون داشته باشد. به‌جای استایل‌دادن به `<button>` خام، سراغ `<r-button>` بروید.

## شروع سریع

### استفادهٔ پایه

<ran-demo>
  <r-button>Button</r-button>
</ran-demo>

```html
<r-button>Button</r-button>
```

## مرجع API

### خصیصه‌ها

| خصیصه      | نوع       | پیش‌فرض     | توضیح                                                         |
| ---------- | --------- | ----------- | ------------------------------------------------------------- |
| `type`     | `string`  | `'default'` | نوع دکمه: `default`، `primary`، `contrast`، `warning`، `text` |
| `disabled` | `boolean` | `false`     | اینکه دکمه غیرفعال باشد یا نه                                 |
| `icon`     | `string`  | `''`        | نام آیکون دکمه                                                |
| `effect`   | `boolean` | `true`      | اینکه جلوهٔ موجِ کلیک نمایش داده شود یا نه                    |

### انواع دکمه `type`

<ran-demo>
  <r-button type="primary">Primary Button</r-button>
  <r-button type="warning">Warning Button</r-button>
  <r-button type="text">Text Button</r-button>
  <r-button>Default Button</r-button>
</ran-demo>

```html
<r-button type="primary">Primary Button</r-button>
<r-button type="warning">Warning Button</r-button>
<r-button type="text">Text Button</r-button>
<r-button>Default Button</r-button>
```

`primary` کنشِ تک‌رنگ است (برگرفته از زبان طراحی Geist): در پوستهٔ روشن سیاه روی سفید و در پوستهٔ تیره سفید روی سیاه. آبی اینجا هیچ معنای برندی ندارد و برای پیوندها و حلقهٔ فوکوس کنار گذاشته شده است. این کنش روی توکن‌های `--ran-color-primary*` سوار است (`--ran-color-primary`، `-hover`، `-active` و `--ran-color-primary-text` برای جوهر وارونه)؛ [پوسته و توکن‌ها](/fa/src/ranui/theme/) را ببینید.

### حالت غیرفعال `disabled`

<ran-demo>
  <r-button type="primary" disabled>Primary Button</r-button>
  <r-button type="warning" disabled>Warning Button</r-button>
  <r-button type="text" disabled>Text Button</r-button>
  <r-button disabled>Default Button</r-button>
</ran-demo>

```html
<r-button type="primary" disabled>Primary Button</r-button>
<r-button type="warning" disabled>Warning Button</r-button>
<r-button type="text" disabled>Text Button</r-button>
<r-button disabled>Default Button</r-button>
```

### دکمهٔ آیکون‌دار `icon`

> 💡 **نکته**: اگر جای‌گذاری دقیق آیکون مهم است، مستقیم از کامپوننت Icon استفاده کنید.

<ran-demo>
  <r-button type="default" icon="user">Default Button</r-button>
  <r-button type="primary" icon="home">Primary Button</r-button>
</ran-demo>

```html
<r-button type="default" icon="user">Default Button</r-button>
<r-button type="primary" icon="home">Primary Button</r-button>
```

### مهار جلوه `effect`

موجِ کلیک به‌طور پیش‌فرض روشن است. برای دکمه‌ای ساده و بدون آن، `effect="false"` را بگذارید. دو دکمهٔ زیر فقط در همین ویژگی فرق دارند، پس با کلیک روی هرکدام می‌توانید مقایسه کنید. موج جلوه‌ای برای دستگاه‌های اشاره‌گر است و تنها از عرض ۱۰۲۴ پیکسل به بالا ترسیم می‌شود.

<ran-demo>
  <r-button type="primary" icon="home">با موج (پیش‌فرض)</r-button>
  <r-button type="primary" icon="home" effect="false">بدون موج</r-button>
</ran-demo>

```html
<r-button type="primary" icon="home">با موج (پیش‌فرض)</r-button>
<r-button type="primary" icon="home" effect="false">بدون موج</r-button>
```

تنها مقدار عینی `false` موج را خاموش می‌کند؛ `effect="true"` و هر مقدار دیگری آن را روشن می‌گذارند. از سمت کد، خصیصه را به‌صورت بولی تعیین کنید: `button.effect = false`.

## رویدادها

```html
<r-button onclick="handleClick()">Click Me</r-button>

<script>
  function handleClick() {
    console.log('Button clicked');
  }
</script>
```

## استایل

`<r-button>` **۴۳ ویژگی سفارشی CSS** از آنِ خود در اختیار می‌گذارد: `--ran-btn-background`، `--ran-btn-color`، `--ran-btn-border-color` و گونه‌های `hover` و `active` آن‌ها، سه توکن گونهٔ `warning`، و افزون بر این‌ها توکن‌های معنایی‌ای که از پوسته می‌خواند.

```css
/* یک دکمه، یا همهٔ دکمه‌های زیر یک محدوده */
r-button {
  --ran-btn-background: var(--ran-color-bg-subtle);
  --ran-btn-hover-background: var(--ran-color-bg-hover);
  --ran-btn-border-radius: var(--ran-radius-full);
}
```

اگر تغییری که می‌خواهید مخصوص دکمه نیست، به‌جایش سراغ یک توکن **معنایی** بروید: بازنویسی `--ran-color-primary` ظاهر کنش اصلی را همه‌جا عوض می‌کند، نه فقط اینجا.

Part‌ها: `button` · `content`

```css
r-button::part(content) {
  letter-spacing: 0.02em;
}
```

فهرست کامل در [توکن‌های استایل](/fa/src/ranui/style-tokens#button) است و اینکه کدام توکن را برگزینید در [سیستم طراحی](/fa/src/ranui/design-system/) آمده.

## بهترین شیوه‌ها

- **کنش‌های اصلی**: از `type="primary"` استفاده کنید (تک‌رنگ: سیاه روی سفید / سفید روی سیاه)
- **کنش‌های خطرناک**: از `type="warning"` استفاده کنید
- **کنش‌های فرعی**: از `type="text"` استفاده کنید
- **حالت غیرفعال**: وقتی کنش در دسترس نیست از `disabled` استفاده کنید
- **آیکون‌ها**: آیکون مرتبط بیفزایید تا کار کاربر ساده‌تر شود
