# ran — کتابخانهٔ مؤلفه‌های وب (ranui) و ابزارهای TypeScript (ranuts)

<p align="center">
  <a href="https://ran.chaxus.com/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://ran.chaxus.com/icon.png" alt="ran logo">
  </a>
</p>

<p align="center">
  <strong>کتابخانه‌ای از مؤلفه‌های وب که بر custom elements بومی بنا شده و به هیچ فریم‌ورکی وابسته نیست (ranui)، به همراه کتابخانه‌ای از ابزارهای TypeScript که tree-shaking می‌پذیرد (ranuts) — و ابزارها و مستندات دوزبانهٔ (انگلیسی و چینی) پیرامون آن‌ها.</strong>
</p>

<p align="center">
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license">
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status">
  </a>
  <img src="https://badgen.net/npm/types/ranui" alt="Types Included">
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/forks/chaxus/ran" alt="forks">
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/stars/chaxus/ran" alt="stars">
  </a>
</p>

<p align="center">
  <a href="#-ویژگیها">ویژگی‌ها</a> •
  <a href="#-بستهها">بسته‌ها</a> •
  <a href="#-شروع-سریع">شروع سریع</a> •
  <a href="#-مستندات">مستندات</a> •
  <a href="#-مشارکت">مشارکت</a>
</p>

---

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | **فارسی**

## ✨ ویژگی‌ها

- 🎨 **کتابخانه‌های رابط کاربری**: مؤلفه‌های وب
- 🛠️ **کتابخانه‌های ابزار**: ابزارهای TypeScript
- 🤖 **یادگیری ماشین**: ابزارها و آزمایش‌های پایه‌ای
- 📱 **برنامه‌های وب**: برنامهٔ گفت‌وگوی IM (نمونهٔ اولیه)
- 🔧 **ابزارهای توسعه**: ابزارهای ساخت و اشکال‌زدایی
- 🌐 **Web3**: آزمایش با قراردادهای هوشمند
- 🎯 **ابزارهای دیداری**: آزمایش‌های تصویرسازی داده

## 📦 بسته‌ها

این تک‌مخزن بسته‌های آزمایشی گوناگونی را در خود دارد:

### کتابخانه‌های اصلی (مرحلهٔ آلفا)

| بسته                      | نسخه                                                                                                 | دریافت‌ها                                                                                  | توضیح                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------- |
| [ranui](packages/ranui)   | [![ranui version](https://img.shields.io/npm/v/ranui.svg?label=%20)](packages/ranui/README.fa.md)    | [![npm-d](https://img.shields.io/npm/dt/ranui.svg)](https://www.npmjs.com/package/ranui)   | کتابخانهٔ مؤلفه‌های وب |
| [ranuts](packages/ranuts) | [![ranuts version](https://img.shields.io/npm/v/ranuts.svg?label=%20)](packages/ranuts/README.fa.md) | [![npm-d](https://img.shields.io/npm/dt/ranuts.svg)](https://www.npmjs.com/package/ranuts) | کتابخانهٔ ابزارها      |

### پروژه‌های آزمایشی

| بسته                                    | توضیح                         |
| --------------------------------------- | ----------------------------- |
| [im](packages/im)                       | نمونهٔ اولیهٔ برنامهٔ گفت‌وگو |
| [visual](packages/visual)               | آزمایش‌های تصویرسازی داده     |
| [ranite](packages/ranite)               | آزمایش با ابزارهای توسعه      |
| [debug](packages/debug)                 | ابزارهای اشکال‌زدایی          |
| [image-process](packages/image-process) | آزمایش‌های پردازش تصویر       |
| [cpro](packages/cpro)                   | یادگیری و آزمودن C/C++        |
| [rust](packages/rust)                   | یادگیری و آزمودن Rust         |

اینکه CI کدام‌یک از این‌ها را وارسی می‌کند، در [packages/manifest.json](packages/manifest.json) اعلام شده است، و آن پرونده به‌جای آنکه توصیف کند، اجرا می‌شود: `bin/run-checks.mjs` هر وارسی را روی بسته‌هایی می‌دواند که آن را اعلام کرده‌اند، پس بسته‌ای که آنجا وارسی‌شده آمده، به‌راستی وارسی می‌شود و آنکه نیامده، دلیلش نوشته شده است. اگر زیر `packages/` پوشه‌ای پیدا شود که در فهرست نیست، `pnpm run verify:packages` شکست می‌خورد — بنابراین بستهٔ تازه نمی‌تواند بی‌آنکه کسی دربارهٔ وارسی‌اش تصمیم بگیرد وارد شود.

## 🚀 شروع سریع

### نصب

```bash
# کلون کردن مخزن
git clone https://github.com/chaxus/ran.git
cd ran

# نصب وابستگی‌ها
pnpm install

# ساخت همهٔ بسته‌ها
pnpm build
```

### به‌کار بردن بسته‌های اصلی

```bash
# نصب ranui (مؤلفه‌های وب)
npm install ranui

# نصب ابزارها
npm install ranuts
```

### توسعه

```bash
# راه‌اندازی سرور توسعه
pnpm dev

# اجرای آزمون‌ها
pnpm test

# ساخت یک بستهٔ مشخص
pnpm --filter ranui build
```

## 📚 مستندات

- **📖 وبلاگ و نوشته‌ها**: [پیش‌نمایش سند وب](https://ran.chaxus.com/src/article/doc_preview)
- **🎨 مستندات RanUI**: [راهنمای کتابخانهٔ رابط کاربری](https://ran.chaxus.com/src/ranui/)
- **🛠️ مستندات RanUTS**: [راهنمای کتابخانهٔ ابزارها](https://ran.chaxus.com/src/ranuts/)
- **📝 مستندات پروژه**: [docs](packages/docs)

## 🤖 هوش مصنوعی / Claude Code

این مخزن یک marketplace از افزونه‌های Claude Code همراه دارد تا دستیارهای هوش مصنوعی بتوانند بی‌آنکه در کد منبع کندوکاو کنند، کتابخانه‌ها را بخوانند و به کار ببرند. نخست marketplace را بیفزا، سپس کتابخانه‌ای را که به کار می‌بری نصب کن:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran      # ranui — مؤلفه‌های وب
/plugin install ranuts@ran     # ranuts — ابزارها
```

هر skill نقشهٔ import، فهرست، نمونه‌های کاربرد و قراردادها را پوشش می‌دهد و به مرجع API که همراه همان بسته منتشر می‌شود راه می‌برد. جزئیات در بخش هر کتابخانه آمده است: [ranui](packages/ranui/README.fa.md) و [ranuts](packages/ranuts/README.fa.md).

## ⚠️ نکتهٔ مهم

این **پروژه‌ای برای کاوش فنی و یادگیری** است و در گام‌های نخست کار به سر می‌برد. بیشتر بسته‌ها در مرحلهٔ آلفا یا آزمایشی‌اند.

**نکته‌های اصلی:**

- 🚧 **توسعهٔ آغازین**: بیشتر قابلیت‌ها هنوز در دست ساخت‌اند
- 🧪 **آزمایشی**: API‌ها ممکن است پیوسته دگرگون شوند
- 📚 **با هدف یادگیری**: بیش از هر چیز برای آموختن و آزمودن ساخته شده است

## 🤝 مشارکت

از مشارکت آموزندگان و برنامه‌نویسان استقبال می‌کنیم. این‌گونه می‌توانی کمک کنی:

1. مخزن را **fork** کن
2. شاخه‌ای برای قابلیت تازه **بساز** (`git checkout -b feature/amazing-feature`)
3. دگرگونی‌هایت را **commit** کن (`git commit -m 'Add amazing feature'`)
4. شاخه را **push** کن (`git push origin feature/amazing-feature`)
5. یک Pull Request **بگشا**

### راهنمای توسعه

- سبک کد موجود را پی بگیر
- تا جایی که می‌شود برای قابلیت‌های تازه آزمون بنویس
- هر جا لازم بود مستندات را به‌روز کن
- با آنچه هنوز آزمایشی است شکیبا باش

## 🌟 چرا متن‌باز؟

باور دارم که متن‌باز بودن، یادگیری و نوآوری را شتاب می‌بخشد. در راهی که به عنوان برنامه‌نویس پیموده‌ام، شمار بی‌شماری از پروژه‌های متن‌باز بر من اثر گذاشته‌اند. با گشودن این کد آزمایشی امید دارم:

- تجربهٔ آموختن را با جامعه در میان بگذارم
- دیگران بتوانند از این کد بیاموزند و با آن بیازمایند
- همکاری و هم‌رسانی دانش را برانگیزم
- جایی برای یادگیری و بهتر شدن پیوسته بسازم

## 📊 آمار پروژه

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" alt="Contributors" />
</a>

![](http://profile-counter.glitch.me/chaxus-ran/count.svg)

## 📄 پروانه

این پروژه زیر پروانهٔ MIT منتشر شده است — جزئیات در پروندهٔ [LICENSE](LICENSE) آمده است.

---

<div align="center">
  <p>ساختهٔ جامعهٔ Ran با ❤️</p>
  <p>اگر این پروژه به یادگیری‌ات کمک کرد، یک ⭐️ بده</p>
</div>
