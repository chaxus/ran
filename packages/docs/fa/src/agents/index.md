---
title: عامل‌ها
---

# عامل‌ها

افزونهٔ ran سه مهارت دارد: design برای تصمیم‌های محصول، ranui برای مؤلفه‌ها و ranuts برای ابزارها.

مهارت را بر اساس تصمیمی که پیش رو دارید انتخاب کنید:

- **design** — چیدمان، تعامل، حرکت، یا اینکه صفحه از پذیرش عبور می‌کند یا نه
- **ranui** — کدام عنصر `<r-*>`، ویژگی‌هایش، یا توکن‌های تم
- **ranuts** — کدام ابزار را import کنید، یا مشکل به کدام نقطهٔ ورود مربوط است

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

افزونه را از GitHub نصب کنید.

## Codex

```sh
codex plugin marketplace add chaxus/ran
codex plugin add ran@ran
```

## Claude Code

```sh
claude plugin marketplace add chaxus/ran
claude plugin install ran@ran
```

در یک نشست تازه، در Codex از `$design`، `$ranui` یا `$ranuts` استفاده کنید؛ در Claude Code از `/ran:design`، `/ran:ranui` یا `/ran:ranuts`.

برای آزمودن یک checkout محلی، فرمان marketplace را از ریشهٔ مخزن با `.` به‌جای `chaxus/ran` اجرا کنید.

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
