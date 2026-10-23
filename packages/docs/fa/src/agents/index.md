---
title: عامل‌ها
---

# عامل‌ها

افزونهٔ ran سه مهارت دارد: design برای تصمیم‌های محصول، ranui برای مؤلفه‌ها و ranuts برای ابزارها.

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

از ریشهٔ مخزن، این نسخهٔ کاری را ثبت و افزونه را نصب کنید.

## Codex

```sh
codex plugin marketplace add .
codex plugin add ran@ran
```

## Claude Code

```sh
claude plugin marketplace add .
claude plugin install ran@ran
```

در نشست جدید Codex از `$design`، `$ranui` یا `$ranuts` و در Claude Code از `/ran:design`، `/ran:ranui` یا `/ran:ranuts` استفاده کنید.

پس از انتشار، `.` را در فرمان بازار با `chaxus/ran` جایگزین کنید. پیوندهای مخزن به جایگاه رسمی در main پس از ادغام اشاره دارند.

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
