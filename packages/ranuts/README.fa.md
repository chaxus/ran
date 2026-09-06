# ranuts

کتابخانه‌ای آزمایشی از ابزارها، با همان توابع و ابزارهایی که هر روز به کار می‌آیند

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranuts.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranuts.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranuts/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | **فارسی**

---

## ⚠️ پیش از هر چیز بخوانید

این یک **کتابخانهٔ آزمایشی از ابزارها** در گام‌های نخست کار است. کار می‌کند، اما پیش از هر چیز برای یادگیری و آزمودن ساخته شده است.

**نکته‌های اصلی:**

- 🚧 **در گام‌های نخست**: امکانات هنوز در حال نوشته شدن و پرداخته شدن‌اند
- 🧪 **آزمایشی**: APIها ممکن است پی‌درپی عوض شوند
- 📚 **یادگیری در درجهٔ اول**: بیشتر برای آموختن ابزارهای جاوااسکریپت و تایپ‌اسکریپت

## نصب

با npm:

```console
npm install ranuts@latest --save
```

## مستندات

[چند تابع و ابزار پرکاربرد](https://ran.chaxus.com/fa/src/ranuts/)

**برای عامل‌های هوش مصنوعی و LLMها:** از [CLAUDE.md](./CLAUDE.md) آغاز کنید (نقشهٔ کلی: نقطه‌های ورود، محدودیت‌های محیط اجرا، قراردادها) و سپس سراغ [docs/API.md](./docs/API.md) بروید (مرجعی ساخته‌شده از همهٔ نمادهای صادرشده، همراه با امضا و توضیح؛ برای ساختن دوباره‌اش `npm run doc:api` را اجرا کنید).

یا **مهارت آمادهٔ Claude Code** را از بازارچهٔ افزونه‌های `ran` نصب کنید؛ نقشهٔ وارد کردن‌ها، سیاههٔ `ranuts/utils`، نمونه‌های کاربرد و قراردادها را به دستیار می‌دهد و او را به مرجع API که درون بسته می‌آید راه می‌نماید:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranuts@ran
```

از آن پس Claude خودش از آن استفاده می‌کند (یا می‌توانید با `/ranuts:ranuts` صدایش بزنید).

## کاربرد

فقط آنچه لازم دارید را وارد کنید. از میان این‌ها می‌توانید برگزینید:

- `ranuts/utils` — DOM/BOM، رشته، شیء، عدد، رنگ، زمان، حافظه، داده‌های دودویی و zip، کارگر و IndexedDB، یاری‌رسان‌های چندزبانی
- `ranuts/node` — کارساز HTTP، مسیریاب، وب‌سوکت، fs، جریان‌ها، میان‌افزار (**فقط Node**)
- `ranuts/visual` — موتور رسم دوبعدی (Canvas / WebGL / WebGPU، **فقط مرورگر**)
- `ranuts/sw` — راهبردهای کش و نیمهٔ سرویس‌ورکرِ قرارداد پیش‌کش (**فقط سرویس‌ورکر**)
- `ranuts/vnode` — DOM مجازی به سبک Snabbdom
- `ranuts/stream` — خواندن Server-Sent Events، تا کردن پاسخ جاری‌شدهٔ مدل به شکلی مستقل از فراهم‌کننده، و بودجهٔ توکنی که تعیین می‌کند تاریخچه از چه جایی دیگر جا نمی‌شود
- `ranuts/conversation` — گزارش رویدادی را که فقط به آن افزوده می‌شود بر گره‌های گفت‌وگوی قابل رسم می‌نگارد
- `ranuts/i18n` — تنها موتور i18n، بی‌آنکه باقی `utils` بیاید

```js
import { debounce } from 'ranuts/utils';
import { readFile } from 'ranuts/node';
import { createI18n } from 'ranuts/i18n';
```

وارد کردن کامل (که ماژول‌های بی‌شماری را که لازم ندارید با خود می‌آورد؛ بهتر است تنها آنچه به کار می‌برید را وارد کنید)

- ESM

```js
import { debounce } from 'ranuts';

const onResize = debounce(() => {
  console.log('window resized');
}, 200);

window.addEventListener('resize', onResize);
```

- UMD, IIFE, CJS

```html
<script src="./ranuts/dist/umd/index.umd.cjs"></script>

<script>
    const { debounce } = require('ranuts')
    const onResize = debounce(() => {
      console.log('window resized');
    }, 200);

    window.addEventListener('resize', onResize);
<script>
```

## مشارکت

از مشارکت همه استقبال می‌کنیم، چه برای آموختن آمده باشید و چه برای برنامه‌نویسی. این پروژه آزمایشی است، پس با آهنگ کند پیشرفت آن مدارا کنید.

## مشارکت‌کنندگان

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## بازدیدها

![](http://profile-counter.glitch.me/chaxus-ranuts/count.svg)

## دیگر موارد

[پروانه (MIT)](/LICENSE)
