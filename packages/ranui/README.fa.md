# ranui

Web Components مستقل از فریم‌ورک با Shadow DOM، توکن‌های تم و ابزارهای SSR.

[![npm](https://img.shields.io/npm/v/ranui.svg)](https://www.npmjs.com/package/ranui) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | **فارسی**

## شروع سریع

```sh
npm install ranui
```

واردکردن بسته‌ها با ESM است. در ابزار ساخت، هر مؤلفه را جداگانه وارد کنید و CSS مشترک را یک بار در ورودی برنامه بارگذاری کنید.

```js
import 'ranui/button';
import 'ranui/input';
import 'ranui/style';
```

عنصر سفارشی را در HTML قرار دهید:

```html
<r-input name="email" type="email" label="Email"></r-input> <r-button type="primary">Save</r-button>
```

## IIFE / CDN

برای تگ script معمولی از IIFE مستقل استفاده کنید. VERSION را با نسخه منتشرشده جایگزین کنید؛ نیازی به ابزار ساخت یا بارگذار ماژول نیست.

```html
<script src="https://cdn.jsdelivr.net/npm/ranui@VERSION/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Save</r-button>
```

IIFE کامل در `dist/index.iife.js` است. در هر صفحه بسته کامل یا بسته‌های مؤلفه‌ای را انتخاب کنید و هر دو را با هم بارگذاری نکنید.

## TypeScript

هر ورودی شامل نوع‌هاست. برای اعلان‌های اختیاری سراسری مرورگر و JSX، فقط نوع را وارد کنید:

```ts
import type {} from 'ranui/typings';
```

اگر TypeScript واردکردن CSS برای اثر جانبی را بررسی می‌کند، ورودی CSS را در `assets.d.ts` برنامه اعلان کنید:

```ts
declare module 'ranui/style';
```

## SSR

برای این نمونه سرور از Node 24+ استفاده کنید. واردکردن مؤلفه، سریال‌ساز SSR را ثبت می‌کند و نتیجه شامل Declarative Shadow DOM است.

```ts
import { Button } from 'ranui/button';
import { renderToString } from 'ranui/ssr';

const html = renderToString(new Button());
console.log(html);
```

## Theme

حالت تم باید صریح فعال شود. از توکن‌ها و partهای عمومی برای تنظیم ظاهر استفاده کنید؛ پیوند قوانین و API کامل در پایین است.

```ts
import { initTheme, setTheme } from 'ranui/theme';

initTheme();
setTheme('system');
```

## مستندات

[ranui](https://ran.chaxus.com/fa/src/ranui/)

- [API مؤلفه‌ها](./docs/COMPONENTS.md)
- [سبک و توکن‌ها](./docs/style-tokens-public.md)
- [طراحی و تعامل](./docs/DESIGN.md) · [Interaction](./docs/INTERACTION.md)
- [سازنده DOM و سیگنال‌ها](https://github.com/chaxus/ran/blob/main/packages/ranview/README.md)
- [مرجع نگهدارندگان و Agentها](./CLAUDE.md)

## مشارکت

[مرجع نگهدارندگان و Agentها](./CLAUDE.md) · [CODING](./docs/CODING.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## مجوز

[MIT](./LICENSE)
