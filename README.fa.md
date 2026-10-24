<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">روش‌های طراحی، کامپوننت‌ها و ابزارهایی برای ساخت محصولات وب، برای توسعه‌دهندگان و عامل‌های برنامه‌نویسی.</p>
<p align="center"><a href="https://ran.chaxus.com/fa/">مستندات</a> · <a href="https://ran.chaxus.com/fa/src/ranui/">کامپوننت‌ها</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <b>فارسی</b></p>

ran سه بخش دارد که هر کدام جداگانه قابل استفاده است: **ranui**، کامپوننت‌های رابط کاربری ساخته‌شده با عنصرهای سفارشی بومی؛ **ranuts**، ابزارهای TypeScript با تایپ؛ و **Ran Design**، روش‌هایی برای چیدمان، تعامل و بازبینی که انسان‌ها و عامل‌های برنامه‌نویسی در هر پشتهٔ فناوری می‌توانند به کار ببرند. هر کامپوننت ranui یک تگ `<r-*>` است، پس در React، Vue، Svelte و HTML ساده یکسان کار می‌کند و قطعه‌هایی برای رابط‌های گفت‌وگوی هوش مصنوعی هم دارد.

## نصب

بدون مرحلهٔ بیلد، کامپوننت را از CDN بارگذاری کنید و تگ را بنویسید:

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">ذخیره</r-button>
```

با یک باندلر:

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

ranui در مرحلهٔ آلفا است و نسخه‌های جدید ممکن است تغییرات ناسازگار داشته باشند؛ در محیط عملیاتی نسخهٔ دقیق را ثابت کنید.

## اطلاعات بیشتر

برای توضیح هر بسته [ranui](./packages/ranui/README.fa.md) و [ranuts](./packages/ranuts/README.fa.md) و برای نمونه‌های زنده [سایت مستندات](https://ran.chaxus.com/fa/) را ببینید. افزونهٔ عامل‌های برنامه‌نویسی و راهنمای مشارکت در [README انگلیسی](./README.md) آمده است.

## مجوز

[MIT](./LICENSE)
