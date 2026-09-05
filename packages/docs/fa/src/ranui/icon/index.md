---
description: 'کامپوننت Icon در ranui (<r-icon>) گرافیک برداری معنادار (SVG) را با مهار اندازه و رنگ ترسیم می‌کند.'
---

# Icon

گرافیک برداری معنادار (SVG) را با مهار اندازه و رنگ ترسیم می‌کند.

> **کجا به کارش ببرید**: وقتی به آیکونی برداری، نام‌دار، تغییراندازه‌پذیر و رنگ‌پذیر (با انیمیشن چرخش اختیاری) درون رابط کاربری‌تان نیاز دارید. `<r-icon>` با `name` یک SVG ثبت‌شده را می‌کشد.

## استفاده از آیکون‌ها

### ساده‌ترین راه: همان نام‌های همراه (بدون هیچ پیکربندی)

ranui مجموعهٔ آیکون خود را **درون بسته جاسازی کرده** است. یک `name`ِ همراه **خودش را در زمان نیاز بار می‌کند**: نه ثبت لازم است، نه import، نه سیم‌کشی مسیر دارایی. تنها همان SVG‌ای که واقعاً به کار می‌برید گرفته می‌شود (هرکدام تکهٔ ناهمگام جداگانه‌اند)، پس ارجاع به یک آیکون هرگز کل مجموعه را نمی‌کشد.

```html
<r-icon name="lock"></r-icon> <r-icon name="eye"></r-icon>
```

نام‌های همراهِ معتبر همان اجتماع `RanIconName` / تاپل `RAN_ICON_NAMES` هستند (پایین‌تر). نام **سفارشی**ای که هرگز ثبت نشده باشد باز هم **چیزی نمی‌کشد** (فضایی خالی)؛ این تنها به SVG‌های خودتان مربوط است و در [آیکون‌های سفارشی](#custom-icons) آمده.

### اختیاری: ثبت یک‌جای کل مجموعه

اگر ترجیح می‌دهید همهٔ آیکون‌های همراه **همگام** در دسترس باشند (بدون بارگذاری ناهمگام برای هر آیکون؛ مثلاً برای پرهیز از جهش در نماهای پرآیکون، یا در محیطی بدون تقسیم کد)، هرچه زودتر یک بار `registerBuiltinIcons()` را صدا بزنید:

```ts
import { registerBuiltinIcons } from 'ranui'; // یا 'ranui/icons'

registerBuiltinIcons(); // همهٔ نام‌های RAN_ICON_NAMES را از پیش ثبت می‌کند (حدود ۱۵ کیلوبایت)
```

نام‌های معتبر به‌شکل تایپ اجتماع `RanIconName` و تاپل `RAN_ICON_NAMES` صادر می‌شوند (پس ویرایشگرتان تکمیلشان می‌کند و غلط‌های تایپی گرفته می‌شوند):

`add-user`، `arrow-down`، `book`، `check-circle`، `check-circle-fill`، `close`، `close-circle`، `close-circle-fill`، `drop`، `eye`، `eye-close`، `github`، `globe`، `home`، `info-circle`، `info-circle-fill`، `issue`، `loading`، `loading-scene`، `lock`، `menu`، `message`، `more`، `plus`، `power-off`، `preview`، `search`، `setting`، `sort`، `team`، `unlock`، `user`، `warning-circle`، `warning-circle-fill`، `without-content`

### آیکون‌های سفارشی {#custom-icons}

برای ثبت SVG‌های خودتان (از هر کتابخانهٔ آیکون یا از خط دارایی‌های ساخت‌تان)، رشته‌های خام SVG را به `registerIcons` / `registerIcon` بدهید:

```ts
import { registerIcon, registerIcons } from 'ranui';
import lock from './icons/lock.svg?raw'; // هرطور که باندلر شما SVG را به‌شکل رشتهٔ خام می‌دهد

registerIcons({
  lock,
  logo: '<svg viewBox="0 0 24 24"><path d="…" /></svg>', // رشتهٔ درون‌خطی — به فایل دارایی نیازی نیست
});
registerIcon('star', '<svg viewBox="0 0 24 24">…</svg>');
```

می‌توانید فهرست ثبت را یکسره کنار بگذارید و نشانه‌گذاری خام SVG را مستقیم به `name` بدهید (اگر با `<svg` آغاز شود همان‌طور رندر می‌شود):

```html
<r-icon name='<svg viewBox="0 0 24 24">…</svg>'></r-icon>
```

> **توجه:** فایل‌های خام `assets/icons/*.svg` بخشی از بستهٔ منتشرشدهٔ npm **نیستند** (تنها `dist/` منتشر می‌شود)، پس `import '…/lock.svg?raw'` از `ranui` حل نمی‌شود؛ برای مجموعهٔ همراه از `registerBuiltinIcons()` استفاده کنید یا رشته‌های SVG خودتان را ثبت کنید.

> **SSR و زمان‌بندی.** ثبت باید در مرورگر اجرا شود. اگر یک `<r-icon>` پیش از ثبت آیکونش وصل شود، خالی می‌ماند و پس از پایان ثبت خودبه‌خود پر می‌شود (عنصر به رویداد `ranui-icon-registered` گوش می‌دهد). برای پرهیز از جهشِ آیکون‌های خالی، در بالاترین نقطهٔ ماژول ورودی‌تان ثبت کنید تا فهرست پیش از رندر نخستین کامپوننت پر شده باشد. در حالت توسعه، نام ثبت‌نشده این را می‌نویسد: `[ranui-icon] icon not registered: <name>`.

## نمونهٔ کد

<Demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</Demo>

```xml
 <r-icon name="lock"  ></r-icon>
 <r-icon name="eye"  ></r-icon>
 <r-icon name="user"  ></r-icon>
```

## ویژگی‌ها

### `name`

بر پایهٔ نام، آیکون دیگری برمی‌گزیند.

<Demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</Demo>

```html
<r-icon name="lock"></r-icon>
<r-icon name="eye"></r-icon>
<r-icon name="user"></r-icon>
```

### `size`

<Demo align="end">
  <r-icon name="lock" size="30"></r-icon>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="lock" size="70"></r-icon>
</Demo>

```html
<r-icon name="lock" size="30"></r-icon>
<r-icon name="lock" size="50"></r-icon>
<r-icon name="lock" size="70"></r-icon>
```

### `color`

<Demo>
  <r-icon name="lock" size="50" color="red"></r-icon>
  <r-icon name="lock" size="50" color="#1E90FF"></r-icon>
  <r-icon name="lock" size="50" color="#F44336"></r-icon>
  <r-icon name="lock" size="50" color="#3F51B5"></r-icon>
</Demo>

```html
<r-icon name="lock" size="50" color="red"></r-icon>
<r-icon name="lock" size="50" color="#1E90FF"></r-icon>
<r-icon name="lock" size="50" color="#F44336"></r-icon>
<r-icon name="lock" size="50" color="#3F51B5"></r-icon>
```

### `spin`

با گذاشتن spin چرخش روشن می‌شود و با دادن یک عدد سرعت چرخش را تعیین می‌کنید. هرچه عدد کوچک‌تر، چرخش تندتر.

<Demo>
  <r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
</Demo>

```html
<r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
```

## فهرست آیکون‌ها

روی هر آیکونی کلیک کنید تا نشانه‌گذاری‌اش رونوشت شود.

<IconGallery />

## استایل

`<r-icon>` **۶ ویژگی سفارشی CSS** از آنِ خود و افزون بر آن توکن‌های معنایی‌ای که از پوسته می‌خواند در
اختیار می‌گذارد. آن را هرجا که ارث می‌رسد تعیین کنید: `:root`، یک نگه‌دارنده، یا خود عنصر.

```css
r-icon {
  --ran-icon-color: var(--ran-color-text-secondary);
}
```

Part‌ها: `ran-icon`

فهرست کامل در [توکن‌های استایل](/fa/src/ranui/style-tokens#icon) است و اینکه کدام توکن را برگزینید در [سیستم طراحی](/fa/src/ranui/design-system/) آمده.
