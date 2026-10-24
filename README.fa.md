<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">روش‌های طراحی، کامپوننت‌ها و ابزارهایی برای ساخت محصولات وب، برای توسعه‌دهندگان و عامل‌های برنامه‌نویسی.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="ranui در npm"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="ranuts در npm"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="وضعیت CI"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="مجوز MIT"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/fa/">مستندات</a> · <a href="https://ran.chaxus.com/fa/src/ranui/">کامپوننت‌ها</a> · <a href="https://ran.chaxus.com/fa/src/agents/">عامل‌ها</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <b>فارسی</b></p>

ran سه بخش دارد که هر کدام جداگانه قابل استفاده است: **ranui**، کامپوننت‌های رابط کاربری ساخته‌شده با عنصرهای سفارشی بومی؛ **ranuts**، ابزارهای TypeScript با تایپ؛ و **Ran Design**، روش‌هایی برای چیدمان، تعامل و بازبینی که انسان‌ها و عامل‌های برنامه‌نویسی در هر پشتهٔ فناوری می‌توانند به کار ببرند.

- **با هر فریم‌ورکی، یا بدون فریم‌ورک، کار می‌کند.** هر کامپوننت یک تگ `<r-*>` است، پس React، Vue، Svelte و یک فایل HTML ساده به یک شکل از آن استفاده می‌کنند. نه آداپتوری لازم است و نه زمان اجرای فریم‌ورک؛ یک تگ script کافی است.
- **قطعه‌هایی برای رابط‌های گفت‌وگوی هوش مصنوعی.** نمای گفت‌وگویی که خروجی جریانی را دنبال می‌کند، Markdown که متن نیمه‌کاره را هم نمایش می‌دهد، ردیف‌های استدلال و فراخوانی ابزار، پیوست‌ها و ورودی صوتی. تحلیل پاسخ جریانی با `ranuts/stream` است.
- **پوسته‌ها، رندر سمت سرور و تایپ‌ها همراه بسته‌اند.** پوستهٔ روشن و تیره با توکن‌های طراحی، ابزارهای SSR و اعلان‌های TypeScript در بسته وجود دارند.
- **فقط همان چیزی را که لازم دارید نصب کنید.** هر بسته و هر کامپوننت نقطهٔ ورود جداگانهٔ خودش را دارد.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/readme-home-dark.webp">
    <img width="800" src="./.github/assets/readme-home.webp" alt="صفحهٔ اصلی ran.chaxus.com: در سمت چپ نشانه‌گذاری ranui و در سمت راست پنلی زنده که همان دکمه‌ها، نوار پیشرفت، نشانگر بارگذاری و چک‌باکس را نمایش می‌دهد">
  </picture>
</p>

## بسته‌ها

| بسته                                     | کاربرد                                                                                                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [ranui](./packages/ranui/README.fa.md)   | فرم‌ها، پنجره‌های گفت‌وگو، جدول‌ها، Markdown، پخش‌کننده‌های رسانه و نماهای گفت‌وگوی هوش مصنوعی به‌صورت عنصرهای سفارشی، همراه با پوسته‌ها و ابزارهای رندر سمت سرور. |
| [ranuts](./packages/ranuts/README.fa.md) | ابزارهایی برای رشته، رنگ، زمان، فایل، ذخیره‌سازی و DOM، به‌علاوهٔ تحلیل SSE و وضعیت پاسخ‌های جریانی.                                                               |
| [Ran Design](./design/README.md)         | روش‌هایی برای ترکیب‌بندی، تعامل، حرکت و بازبینی مبتنی بر شواهد. به شکل افزونهٔ عامل منتشر می‌شود و به ranui نیازی ندارد.                                           |

لایهٔ سازنده و واکنش‌پذیری ranui جداگانه با نام [@alixex/ranview](./packages/ranview/README.md) منتشر می‌شود.

## شروع سریع

بدون مرحلهٔ بیلد، یک کامپوننت را از CDN بارگذاری کنید و تگ را بنویسید:

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">ذخیره</r-button>
```

با یک باندلر، بسته را نصب کنید و کامپوننت‌هایی را که لازم دارید وارد کنید:

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

ranui در مرحلهٔ آلفا است و نسخه‌های جدید ممکن است تغییرات ناسازگار داشته باشند؛ پس در محیط عملیاتی نسخهٔ دقیق را ثابت کنید. [مستندات کامپوننت‌ها](https://ran.chaxus.com/fa/src/ranui/) نمونه‌های زنده، رویدادها و سبک‌دهی هر عنصر را دارد.

## استفاده با عامل برنامه‌نویسی

افزونهٔ **ran** مهارت‌های design، ranui و ranuts را به Claude Code و Codex اضافه می‌کند. به سرور MCP یا حساب کاربری نیازی ندارد.

```sh
claude plugin marketplace add chaxus/ran && claude plugin install ran@ran
```

```sh
codex plugin marketplace add chaxus/ran && codex plugin add ran@ran
```

در یک نشست جدید، در Claude Code از `/ran:design`، `/ran:ranui` یا `/ran:ranuts` و در Codex از `$design`، `$ranui` یا `$ranuts` استفاده کنید. برای نصب از یک کپی محلی [راهنمای عامل‌ها](https://ran.chaxus.com/fa/src/agents/) را ببینید؛ خود مهارت‌ها در [plugins/ran](./plugins/ran/) هستند.

## مشارکت

از Node 24 یا بالاتر و نسخهٔ pnpm ثابت‌شده در `package.json` استفاده کنید.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

پیش از مشارکت [AGENTS.md](./AGENTS.md) و هنگام آماده‌سازی بسته‌ها [راهنمای انتشار](./docs/RELEASING.md) را بخوانید.

## مجوز

[MIT](./LICENSE)
