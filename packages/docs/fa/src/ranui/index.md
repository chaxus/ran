---
description: 'ranui کتابخانهٔ رابط کاربری Web Components است که روی custom elements بومی (<r-*>) ساخته شده و تایپ‌های TypeScript، پوستهٔ روشن/تیره، Shadow DOM، SSR و PWA را پشتیبانی می‌کند.'
---

# ranui

کتابخانه‌ای از رابط کاربری که روی **custom elements بومی** ساخته شده است. هر کامپوننت یک تگ `<r-*>`
است، پس در React، Vue، Svelte، Solid، Astro یا حتی یک فایل ساده‌ی HTML به یک شکل کار می‌کند. نه
آداپتوری در کار است و نه نسخه‌ای از فریم‌ورک که باید با آن جور دربیاید. تایپ‌های TypeScript، پوستهٔ
روشن و تیره بر پایهٔ design token، کپسوله‌سازی با Shadow DOM و رندر سمت سرور از همان ابتدا هستند.

<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://unpkg.com/ranui/dist/index.js"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran/tree/main/packages/ranui"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

- **npm**: <a href="https://www.npmjs.com/package/ranui">`ranui`</a> ·
  **کد منبع**: <a href="https://github.com/chaxus/ran/tree/main/packages/ranui">`packages/ranui`</a>
- ranui در مرحلهٔ **alpha** است: نسخه‌ها تغییرات ناسازگار دارند. نسخهٔ دقیق را قفل کنید و پیش از ارتقا
  [فهرست تغییرات](/fa/src/ranui/changelog) را بخوانید.

## نصب

```bash
npm install ranui
```

```html
<!-- یا از یک CDN، بدون هیچ مرحلهٔ ساخت -->
<script src="https://unpkg.com/ranui/dist/umd/index.umd.cjs"></script>
```

## استفاده

import کردن، عناصر را ثبت می‌کند؛ از آن پس فقط تگ می‌نویسید.

```js
import 'ranui'; // همهٔ کامپوننت‌ها
import 'ranui/button'; // یا فقط یکی
```

```html
<r-button type="primary">استقرار پروژه</r-button>
```

تگ در همهٔ فریم‌ورک‌ها یکی است؛ تفاوت فقط در شیوهٔ پاس‌دادن مقدار و بستن رویداد است که
[راهنمای کدنویسی](/fa/src/ranui/coding-guides/#framework-integration) به‌تمامی پوشش می‌دهد:

::: code-group

```html [HTML]
<script src="https://unpkg.com/ranui/dist/umd/index.umd.cjs"></script>

<body>
  <r-button>Button</r-button>
</body>
```

```jsx [React]
import 'ranui';

export const App = () => <r-button type="primary">Deploy</r-button>;
// مقدارهای پیچیده و شنونده‌های رویداد از راه ref می‌روند — راهنمای کدنویسی را ببینید.
```

```vue [Vue]
<template>
  <r-button type="primary" @click="deploy">Deploy</r-button>
</template>

<script setup>
import 'ranui';
</script>
<!-- در پیکربندی ساخت، `r-` را به compilerOptions.isCustomElement بیفزایید. -->
```

```js [Plain JS]
import 'ranui';

const button = document.createElement('r-button');
button.textContent = 'Deploy';
document.body.appendChild(button);
```

:::

## نقاط ورود

هر نقطهٔ ورود دقیقاً همان چیزی را ثبت می‌کند که نامش می‌گوید، پس صفحه‌ای که فقط پوسته می‌خواهد
هرگز بهای کتابخانهٔ کامپوننت‌ها را نمی‌پردازد.

| import                                                | شامل                                                    |
| ----------------------------------------------------- | ------------------------------------------------------- |
| `ranui`                                               | همهٔ کامپوننت‌ها                                        |
| `ranui/<component>`                                   | یک کامپوننت: `ranui/button`، `ranui/select`، …          |
| [`ranui/theme`](/fa/src/ranui/theme/)                 | پوستهٔ روشن/تیره و بازنویسی توکن‌ها؛ بدون عنصر          |
| [`ranui/i18n`](/fa/src/ranui/i18n/)                   | موتور ترجمه؛ بدون عنصر                                  |
| `ranui/fonts`                                         | قلم‌های میزبانی‌شدهٔ Geist Sans و Geist Mono            |
| `ranui/style`                                         | شیوه‌نامه، اگر پیکربندی شما خودش برنمی‌داردش            |
| [`ranui/builder`](/fa/src/ranui/builder/)             | سازندهٔ روان DOM با واکنش‌پذیری ریزدانه                 |
| [`ranui/ssr`](/fa/src/ranui/ssr/)، `ranui/ssr-stream` | رندر سمت سرور                                           |
| `ranui/testing`                                       | ابزارهایی برای رسیدن به shadow root بسته از دل یک آزمون |
| `ranui/typings`                                       | تایپ‌های محیطی عناصر برای JSX / TS                      |

## کامپوننت‌ها

۴۰ عنصر. همهٔ آن‌ها همراه با ویژگی‌ها، خصیصه‌ها، رویدادها، اسلات‌ها و نام‌های `()::part` در
[مرجع API عناصر](/fa/src/ranui/api) آمده‌اند.

**عمومی**: [Button](/fa/src/ranui/button/) · [Icon](/fa/src/ranui/icon/) ·
[Loading](/fa/src/ranui/loading/)

**ورود داده**: [Input](/fa/src/ranui/input/) · [CheckBox](/fa/src/ranui/checkbox/) ·
[Select](/fa/src/ranui/select/) · [ColorPicker](/fa/src/ranui/colorpicker/) ·
[Attachments](/fa/src/ranui/attachments/) · [VoiceButton](/fa/src/ranui/voice-button/) ·
[Forms](/fa/src/ranui/form/)

**نمایش داده**: [Card](/fa/src/ranui/card/) · [Section](/fa/src/ranui/section/) ·
[Tabs](/fa/src/ranui/tab/) · [Image](/fa/src/ranui/image/) · [Progress](/fa/src/ranui/progress/) ·
[Radar](/fa/src/ranui/radar/) · [Player](/fa/src/ranui/player/) · [Preview](/fa/src/ranui/preview/) ·
[Glass](/fa/src/ranui/glass/) · [Scratch](/fa/src/ranui/scratch/) ·
[StateDot](/fa/src/ranui/state-dot/) · [DisclosureRow](/fa/src/ranui/disclosure-row/)

**رندر محتوا**: [Markdown](/fa/src/ranui/markdown/) · [Math](/fa/src/ranui/math/) ·
[Mermaid](/fa/src/ranui/mermaid/)

**هوش مصنوعی و گفت‌وگو**: [Conversation](/fa/src/ranui/conversation/) ·
[Reasoning](/fa/src/ranui/reasoning/) · [ToolCard](/fa/src/ranui/tool-card/) ·
[TokenMeter](/fa/src/ranui/token-meter/)

**لایه‌ها و بازخورد**: [Modal](/fa/src/ranui/modal/) · [Popover](/fa/src/ranui/popover/) ·
[Dropdown](/fa/src/ranui/dropdown/) · [Message](/fa/src/ranui/message/) ·
[Skeleton](/fa/src/ranui/skeleton/)

**ناوبری**: [Router](/fa/src/ranui/router/) · [Route](/fa/src/ranui/route/) ·
[Link](/fa/src/ranui/link/)

**پایه‌ها**: [پوسته](/fa/src/ranui/theme/) · [ThemeSwitch](/fa/src/ranui/theme-switch/) ·
[i18n](/fa/src/ranui/i18n/)

پنج عنصر صفحهٔ جداگانه ندارند، چون تنها درون عنصر دیگری وجود دارند: `<r-option>` (Select)،
`<r-tabs>` (Tabs)، `<r-img>` (Image)، `<r-dropdown-item>` (Dropdown) و `<r-content>` (Popover).
مثل بقیه در مرجع API آمده‌اند.

### زنده

<div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-bottom:12px">
  <r-button type="primary">Primary</r-button>
  <r-button type="warning">Warning</r-button>
  <r-button type="text">Text</r-button>
  <r-button>Default</r-button>
  <r-icon name="lock" size="28"></r-icon>
  <r-icon name="user" size="28"></r-icon>
  <r-icon name="loading" size="28" color="#1E90FF" spin></r-icon>
</div>

<div style="width:100%;margin-bottom:12px">
  <r-progress percent="0.7" type="drag"></r-progress>
</div>

<r-markdown copy content="**Streaming** Markdown with `code`, tables, mermaid and math."></r-markdown>

## استایل

کامپوننت‌ها در یک shadow root **بسته** رندر می‌شوند: CSS صفحه به درون نشت نمی‌کند و گزینشگرها هم به
درون نمی‌رسند. چهار راه ورود هست، به‌ترتیب ترجیح.

**۱. توکن‌های طراحی (ویژگی‌های سفارشی CSS)**: از مرز ارث می‌رسند، پس تعیین آن‌ها روی `:root`، روی یک
نگه‌دارنده، یا روی خود عنصر همگی کار می‌کنند:

```html
<r-progress
  percent="0.7"
  type="drag"
  style="--ran-progress-track-background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f)"
></r-progress>
```

<div style="width:100%;margin:12px 0">
  <r-progress percent="0.7" type="drag" style="--ran-progress-track-background:linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);"></r-progress>
</div>

**۲. `()::part`** برای تنظیم‌های ساختاری که توکن‌ها پوشش نمی‌دهند ·
**۳. ویژگی `sheet`** برای تزریق CSS به shadow root ·
**۴. محتوای اسلات**، که در سند خودتان می‌ماند و CSS صفحهٔ شما را می‌گیرد.

نام توکن‌ها همان [سیستم طراحی](/fa/src/ranui/design-system/) است؛ قاعدهٔ انتخاب میان آن‌ها
[راهنمای طراحی](/fa/src/ranui/design-guides/) است؛ و سازوکارش در
[راهنمای کدنویسی](/fa/src/ranui/coding-guides/#styling-across-the-shadow-boundary) آمده.

## رویدادها

کامپوننت‌ها `CustomEvent` می‌فرستند و بار داده در `detail` است. شنونده را روی خود عنصر ببندید: اینکه
رویدادی حباب می‌کند یا نه تصمیمی است در سطح هر کامپوننت، و مرجع API برای هرکدام آن را می‌گوید:

```html
<r-select id="env"></r-select>

<script>
  document.getElementById('env').addEventListener('change', (event) => {
    console.log(event.detail.value);
  });
</script>
```

شکل ویژگی `onchange="…"` و شکل خصیصه `el.onchange = …` هم کار می‌کنند، چون این‌ها عناصر عادی DOM
هستند؛ اما تنها یک هندلر می‌پذیرند و فاز capture ندارند، پس آنچه باید نخست سراغش بروید
`addEventListener` است.

## بعد کجا برویم

| اگر می‌خواهید…                                   | بخوانید                                         |
| ------------------------------------------------ | ----------------------------------------------- |
| API دقیق یک عنصر را ببینید                       | [API عناصر](/fa/src/ranui/api)                  |
| بدانید کدام توکن و چرا                           | [سیستم طراحی](/fa/src/ranui/design-system/)     |
| صفحه‌ای بسازید که یکدست دیده شود                 | [راهنمای طراحی](/fa/src/ranui/design-guides/)   |
| ranui را درست به یک برنامه وصل کنید              | [راهنمای کدنویسی](/fa/src/ranui/coding-guides/) |
| روشن/تیره اضافه کنید یا همه‌چیز را بازطراحی کنید | [پوسته](/fa/src/ranui/theme/)                   |
| رابط را ترجمه کنید                               | [i18n](/fa/src/ranui/i18n/)                     |
| روی سرور رندر کنید                               | [رندر سمت سرور](/fa/src/ranui/ssr/)             |
| بدون فریم‌ورک نمای واکنشی بسازید                 | [سازنده](/fa/src/ranui/builder/)                |
| پیش از ارتقا ببینید چه تغییر کرده                | [فهرست تغییرات](/fa/src/ranui/changelog)        |

## پشتیبانی مرورگرها

این کتابخانه در همهٔ مرورگرهای امروزی کار می‌کند: بر پایهٔ Custom Elements v1، Shadow DOM v1 و
ویژگی‌های سفارشی CSS ساخته شده است. **از Internet Explorer پشتیبانی نمی‌شود.**

![](../../../assets/ranui/customElements.png)

## مشارکت‌کنندگان

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## خواندنی‌های بیشتر

استانداردهایی که این کتابخانه بر آن‌ها ایستاده است: [W3C](https://www.w3.org/) ·
[ECMA](https://www.ecma-international.org/) · [RFC](https://www.rfc-editor.org/) ·
[Can I use](https://caniuse.com/)

منابع طراحی که ارزش باز نگه‌داشتن دارند: [Checklist Design](https://www.checklist.design/) ·
[Laws of UX](https://lawsofux.com/) · [Geist](https://vercel.com/geist) ·
[Ant Design](https://ant.design/index-cn) · [Element UI](https://element.eleme.cn/#/zh-CN) ·
[Animista](https://animista.net/) · [WebGradients](https://webgradients.com/)
