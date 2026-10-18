# ranuts

ابزارهای TypeScript برای API مرورگر، پردازش داده، جریان‌ها و ترسیم دوبعدی.

[![npm](https://img.shields.io/npm/v/ranuts.svg)](https://www.npmjs.com/package/ranuts) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | **فارسی**

## شروع سریع

```sh
npm install ranuts
```

```ts
import { rgbToHex } from 'ranuts/utils';

console.log(rgbToHex(1, 2, 3)); // #010203
```

## ESM

ورودی را بر اساس محیط اجرا و کار انتخاب کنید. بعضی ابزارها به متغیرهای سراسری مرورگر نیاز دارند و همه توابع روی سرور قابل اجرا نیستند.

| بسته                  | کاربرد                                                |
| --------------------- | ----------------------------------------------------- |
| `ranuts/utils`        | DOM/BOM، رنگ، داده دودویی، ذخیره‌سازی و ابزارهای دیگر |
| `ranuts/i18n`         | بین‌المللی‌سازی مستقل                                 |
| `ranuts/stream`       | تجزیه SSE و وضعیت پاسخ جریانی                         |
| `ranuts/conversation` | نگاشت رویدادهای گفتگو                                 |
| `ranuts/visual`       | ترسیم دوبعدی؛ مرورگر                                  |
| `ranuts/vnode`        | DOM مجازی؛ مرورگر                                     |
| `ranuts/sw`           | راهبردهای کش Service Worker                           |

## IIFE / CDN

برای تگ script معمولی از IIFE مستقل استفاده کنید. VERSION را با نسخه منتشرشده جایگزین کنید؛ نیازی به ابزار ساخت یا بارگذار ماژول نیست.

```html
<script src="https://cdn.jsdelivr.net/npm/ranuts@VERSION/dist/iife/utils.iife.js"></script>
<script>
  console.log(ranuts_utils.rgbToHex(1, 2, 3));
</script>
```

IIFE ابزارها `ranuts_utils` و بسته کامل `dist/iife/index.iife.js` نام `ranuts` را ارائه می‌کند. VERSION را با نسخه منتشرشده جایگزین کنید.

## مستندات

- [ranuts](https://ran.chaxus.com/fa/src/ranuts/)
- [API](./docs/API.md)
- [مرجع نگهدارندگان و Agentها](./CLAUDE.md)

## مشارکت

[مرجع نگهدارندگان و Agentها](./CLAUDE.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## مجوز

[MIT](./LICENSE)
