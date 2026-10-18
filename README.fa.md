<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">کامپوننت‌های رابط کاربری و ابزارهای TypeScript برای برنامه‌های وب.</p>
<p align="center"><a href="https://ran.chaxus.com/fa/">مستندات</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <b>فارسی</b></p>

ran مجموعه‌ای از کتابخانه‌ها برای ساخت رابط‌های وب است. با کامپوننت‌های آمادهٔ HTML فرم، داشبورد و صفحه‌های محتوا بسازید، از توابع مرورگر و پردازش داده استفاده کنید یا نماهای واکنشی DOM را مستقیماً با TypeScript بنویسید.

هر بسته را می‌توان جداگانه نصب کرد. [سایت مستندات](./packages/docs/) و [نمونهٔ IM](./packages/im/) استفادهٔ ترکیبی از این کتابخانه‌ها را در برنامه‌های کامل نشان می‌دهند.

## انتخاب بسته

| بسته                                            | کاربرد                                                                                                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.fa.md)          | ساخت رابط با عناصر سفارشی HTML: ورودی، انتخابگر، پنجرهٔ گفتگو، جدول، Markdown و پخش‌کنندهٔ رسانه. شامل پوسته‌ها و ابزارهای رندر سمت سرور است. |
| [ranuts](./packages/ranuts/README.fa.md)        | کار با مرورگر و داده: تبدیل رنگ و دادهٔ دودویی، ذخیره‌سازی، تجزیهٔ SSE و وضعیت پاسخ‌های جریانی.                                               |
| [@alixex/ranview](./packages/ranview/README.md) | ساخت نماهای DOM با سازنده‌های زنجیره‌ای و سیگنال‌های واکنشی؛ تولید HTML ایستا برای رندر سمت سرور.                                             |

## آزمایش ranui

در یک برنامهٔ مرورگر با ابزار ساخت سازگار با ESM نصب کنید:

```sh
npm install ranui
```

کد زیر را به ورودی JavaScript برنامه اضافه کنید. یک دکمه می‌سازد که به کلیک پاسخ می‌دهد:

```js
import 'ranui/button';
import 'ranui/style';

const button = document.createElement('r-button');
button.setAttribute('type', 'primary');
button.textContent = 'ذخیره';
button.addEventListener('click', () => {
  button.textContent = 'ذخیره شد';
});
document.body.append(button);
```

کامپوننت‌ها از عناصر سفارشی و رویدادهای استاندارد مرورگر استفاده می‌کنند و به محیط اجرای React یا Vue نیاز ندارند. کامپوننت‌های دیگر را از ورودی مخصوص خود، مانند `ranui/input`، وارد کنید. برای برچسب‌ها، رویدادها و سفارشی‌سازی، [نمونه‌های کامپوننت](https://ran.chaxus.com/fa/src/ranui/) را ببینید. برای استفاده بدون ابزار ساخت، [نمونهٔ اسکریپت مستقل](./packages/ranui/README.fa.md#iife--cdn) را دنبال کنید.

## توسعهٔ مخزن

از Node 24+ و pnpm 11.6.0 استفاده کنید.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

هر پوشهٔ بسته راهنما و نمونه‌های خودش را دارد. پیش از مشارکت [قواعد مخزن](./AGENTS.md) و هنگام آماده‌سازی بسته‌ها [راهنمای انتشار](./docs/RELEASING.md) را بخوانید.

## مجوز

[MIT](./LICENSE)
