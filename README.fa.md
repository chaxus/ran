<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">وب‌کامپوننت‌ها، سازنده‌های DOM و ابزارهای TypeScript.</p>
<p align="center"><a href="https://ran.chaxus.com/fa/">مستندات</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <b>فارسی</b></p>

## بسته‌ها

| بسته                                            | کاربرد                                   |
| ----------------------------------------------- | ---------------------------------------- |
| [ranui](https://ran.chaxus.com/fa/src/ranui/)   | مؤلفه‌های رابط کاربری مستقل از فریم‌ورک. |
| [ranuts](https://ran.chaxus.com/fa/src/ranuts/) | ابزارهای مرورگر و پردازش داده.           |
| [@alixex/ranview](packages/ranview/README.md)   | سازنده‌های DOM و سیگنال‌های واکنشی.      |

## شروع سریع

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

```html
<r-button type="primary">Hello</r-button>
```

## توسعه

Node 24+ · pnpm 11.6.0

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm -F docs dev
pnpm test
```

[مشارکت](./AGENTS.md) · [MIT](./LICENSE)
