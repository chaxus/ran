# ran

<p align="center">
  <a href="https://ran.chaxus.com/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
      <img width="120" src="./packages/docs/public/icon.png" alt="ran">
    </picture>
  </a>
</p>

Web Components، سازنده‌های DOM و ابزارهای TypeScript در یک فضای کاری.

[![CI](https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml)](https://github.com/chaxus/ran/actions/workflows/ci.yml) · [MIT](./LICENSE)

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | **فارسی**

> مرحله alpha است؛ API و قالب بسته ممکن است تغییر کند. نسخه دقیق را ثابت کنید و پیش از ارتقا راهنمای مهاجرت را بخوانید.

## بسته‌ها

| بسته                                          | کاربرد                                                                      |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| [ranui](packages/ranui/README.fa.md)          | Web Components مستقل از فریم‌ورک با Shadow DOM، توکن‌های تم و ابزارهای SSR. |
| [ranuts](packages/ranuts/README.fa.md)        | ابزارهای TypeScript برای API مرورگر، پردازش داده، جریان‌ها و ترسیم دوبعدی.  |
| [@alixex/ranview](packages/ranview/README.md) | سازنده DOM، سیگنال‌ها و تصویر HTML ایستا بدون نیاز به کتابخانه مؤلفه‌ها.    |

## شروع سریع

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

عنصر سفارشی را در HTML قرار دهید:

```html
<r-button type="primary">Hello</r-button>
```

## مستندات

- [ranui](https://ran.chaxus.com/fa/src/ranui/)
- [ranuts](https://ran.chaxus.com/fa/src/ranuts/)
- [@alixex/ranview](packages/ranview/README.md)
- [راهنمای مهاجرت](https://ran.chaxus.com/fa/src/ranuts/migration/)

## توسعه مخزن

از Node 24+ و pnpm استفاده کنید و در ریشه مخزن اجرا کنید:

```sh
git clone https://github.com/chaxus/ran.git
cd ran
pnpm install --frozen-lockfile
pnpm build
pnpm --filter ranui dev
```

فرمان‌های دیگر توسعه:

```sh
pnpm --filter docs dev
pnpm test
pnpm lint
pnpm verify:docs
pnpm clean
```

`pnpm clean` فقط خروجی تولیدشده را حذف می‌کند و کد، وابستگی‌های نصب‌شده و فایل قفل را نگه می‌دارد.

## پروژه‌های دیگر و یادداشت‌های آموزشی

ابزارهای مستندات: [docs](packages/docs)، [ranpress](packages/ranpress) و [site](packages/site). [im](packages/im) برنامه گفتگوی آزمایشی است.

نمونه‌های بومی: [C/C++](packages/cpro)، [پردازش تصویر](packages/image-process) و [Rust](packages/rust). یادداشت‌های حفظ‌شده: [Shader](docs/learning/visual/README.md) و [Koa/Nginx](docs/learning/debug/README.md).

وضعیت فضای کاری و بررسی‌های CI در [packages/manifest.json](packages/manifest.json) تعریف شده است.

## AI / Claude Code

[مرجع نگهدارندگان و Agentها](packages/ranui/CLAUDE.md) · [ranuts](packages/ranuts/CLAUDE.md)

```text
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
/plugin install ranuts@ran
```

## مشارکت

برای مسئولیت‌ها و بررسی‌ها [AGENTS.md](AGENTS.md) را بخوانید. نمونه‌ها و مستندات را با خروجی‌های عمومی هماهنگ و بررسی‌های مربوط به تغییر را اجرا کنید.

## مجوز

[MIT](./LICENSE)
