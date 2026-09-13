# ranui

کتابخانه‌ای آزمایشی از مؤلفه‌های رابط کاربری، بنا شده بر Web Components. هر مؤلفه در Shadow DOM پیچیده شده، با توکن‌های CSS پوشیده می‌شود و از SSR و Declarative Shadow DOM پشتیبانی می‌کند.

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | **فارسی**

## پیش از هر چیز بخوانید

این یک **کتابخانهٔ آزمایشی رابط کاربری** در گام‌های نخست کار است. می‌شود از آن استفاده کرد، اما پیش از هر چیز برای یادگیری و آزمودن ساخته شده است.

نکته‌های اصلی:

- **در گام‌های نخست**: امکانات هنوز در حال نوشته شدن و پرداخته شدن‌اند.
- **آزمایشی**: APIها ممکن است پی‌درپی عوض شوند.
- **یادگیری در درجهٔ اول**: بیشتر برای آموختن Web Components و کار روی رابط کاربری.

## چه چیزهایی دارد

۱. **مستقل از چارچوب:** با React، Vue، Preact، SolidJS، Svelte و هر پروژهٔ جاوااسکریپتی که استانداردهای W3C را پاس بدارد کار می‌کند.
۲. **حسی مثل عنصرهای بومی:** عنصرهای سفارشی مانند `<r-button>` و `<r-modal>` را همان‌طور می‌نویسی که عنصرهای معمول HTML را.
۳. **طراحی ماژولار:** هم وارد کردن کامل را می‌پذیرد و هم وارد کردن تک‌تک مؤلفه‌ها؛ نگهداری آسان‌تر می‌شود و اندازهٔ بسته در دست خودت می‌ماند.
۴. **پیچیده در Shadow DOM:** درون هر مؤلفه به‌طور پیش‌فرض از بیرون جدا است، در حالی که توکن‌های CSS و `::part()` و صفت `sheet` دریچه‌های تعیین‌شده‌ای برای آراستن در اختیار می‌گذارند.
۵. **پشتیبانی از TypeScript:** با TypeScript نوشته شده و تعریف نوع‌ها هم همراهش است.
۶. **سازگار با SSR:** رسم در سمت کارساز را از راه `defineSSR` و `renderToString` و Declarative Shadow DOM پشتیبانی می‌کند.
۷. **دسترس‌پذیر:** نقش‌ها و حالت‌های ARIA، پیمایش کامل با صفحه‌کلید، ورودی‌های وابسته به فرم (`<r-checkbox>`، `<r-input>` و `<r-select>` در `FormData` بومی می‌نشینند)، اعلان‌ها در ناحیه‌های زنده، و پاسداشت `prefers-reduced-motion`.

## نصب

با npm:

```console
npm install ranui --save
```

## مستندات و نمونه‌ها

[مؤلفه‌ها و نمونه‌های کاربردشان را ببینید](https://ran.chaxus.com/fa/src/ranui/)

### مؤلفه‌ها و مرجع API

برای هر عنصر، صفت‌ها، ویژگی‌ها، **رویدادها (به‌همراه شکل `detail` آن‌ها)**، شکاف‌ها و نام‌های `::part()` از دل کد ساخته می‌شوند؛ لازم نیست خودت دنبال صادرات‌ها بگردی:

- API هر عنصر: [docs/COMPONENTS.md](./docs/COMPONENTS.md)
- معیار طراحی (رنگ، فاصله، حروف‌چینی، حرکت، دسترس‌پذیری): [docs/DESIGN.md](./docs/DESIGN.md)

پس از تغییر API یک مؤلفه، با این دستور از نو بساز:

```bash
pnpm doc:api
```

CI از ریشهٔ مخزن `pnpm run verify:docs` را اجرا می‌کند و به‌محض آنکه مرجعی ساخته‌شده با کدش جور درنیاید شکست می‌خورد.

### مهارت برای هوش مصنوعی و Claude Code

مهارتی آماده هست تا دستیارهای هوش مصنوعی (Claude Code) بتوانند ranui را بخوانند و به کار ببرند، بی‌آنکه در کد کاوش کنند. از بازارچهٔ افزونه‌های `ran` منتشر می‌شود:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
```

پس از نصب، هر وقت با ranui کار کنی Claude خودش از آن استفاده می‌کند (یا می‌توانی با `/ranui:ranui` صریح صدایش بزنی). این مهارت نقشهٔ وارد کردن‌ها، سیاههٔ عنصرها، API سازنده و واکنش‌پذیری، دسترس‌پذیری و نمونه‌های کاربرد را در بر می‌گیرد و به مرجع API که درون بسته می‌آید ([docs/COMPONENTS.md](./docs/COMPONENTS.md)) راه می‌نماید.

### مستندات آراستن

سامانهٔ آراستن، همه‌اش گرد توکن‌های CSS و `::part()` یکدست شده است.

- راهنمای بازنویسی سبک‌ها: [docs/style-override.md](./docs/style-override.md)
- سیاههٔ کامل توکن‌ها و partها، که خودکار ساخته می‌شود: [docs/style-tokens-parts.md](./docs/style-tokens-parts.md)
- API عمومی آراستن برای مصرف‌کننده، که خودکار ساخته می‌شود: [docs/style-tokens-public.md](./docs/style-tokens-public.md)
- پیکربندی پالایهٔ توکن‌های عمومی: [docs/style-token-filter.json](./docs/style-token-filter.json)

مستندات آراستن را با این دستور تازه کن:

```bash
pnpm doc:style
```

### پوسته‌ها

ranui تنها یک سامانهٔ توکن دارد که بر [سامانهٔ طراحی Geist](https://vercel.com/geist) بنا شده است؛ همان زبان طراحی متن‌باز Vercel که در آن رنگ یک **نردبان حالت‌ها** است: هر پله از ۱۰۰ تا ۱۰۰۰ بالا می‌رود و هر پله تنها یک کار دارد (پس‌زمینه، سپس گذر نشانگر، سپس حاشیه، سپس پُرکن یکدست، سپس متن). ranui همان نردبان را به‌همراه **Geist Sans و Geist Mono** برگرفته است، پس حالت تیره تنها پله‌های پایه را از نو تعریف می‌کند و همهٔ توکن‌های معنایی خودبه‌خود می‌چرخند. سه حالت هست — `light`، `dark`، `system` — و هیچ بستهٔ پوسته‌ای در کار نیست. می‌توانی در زمان اجرا حالت را عوض کنی یا هر توکنی را بازنویسی کنی (در SSR هم امن است):

```ts
import { initTheme, setTheme, setThemeToken, setThemeTokens } from 'ranui/theme';
import 'ranui/style';

initTheme(); // هنگام بارگذاری، گزینش ذخیره‌شده را بازمی‌گرداند
setTheme('system'); // 'light' | 'dark' | 'system'
setThemeToken('--ran-color-primary', '#6c47ff');
setThemeTokens({ '--ran-radius-md': '10px' });
```

نقطهٔ ورود `ranui/theme` تنها موتور پوسته را دارد؛ هیچ عنصر سفارشی ثبت نمی‌شود، پس اگر فقط توکن‌ها و حالت تیره را می‌خواهی، بستهٔ تو سنگین نمی‌شود. همین APIها از بشکهٔ `ranui` هم دوباره صادر می‌شوند.

حالت تیره تنها پله‌های پایهٔ رنگ را از نو تعریف می‌کند؛ توکن‌های معنایی (`--ran-color-*`) به همان‌ها اشاره دارند و خودبه‌خود می‌چرخند. [docs/THEME_STYLE_SYSTEM_DESIGN.md](./docs/THEME_STYLE_SYSTEM_DESIGN.md) و [docs/DESIGN.md](./docs/DESIGN.md) را ببین.

### بومی‌سازی

موتور i18n که به هیچ چارچوبی وابسته نیست، با نقطهٔ ورود جداگانهٔ `ranui/i18n` می‌آید؛ مانند `ranui/theme` هیچ عنصر سفارشی ثبت نمی‌کند:

```ts
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // هر زبان یک واژه‌نامهٔ تخت است؛ کلیدها عیناً به کار می‌روند و تودرتو نمی‌شوند
  messages: { en: { 'hero.title': 'Hi {name}' }, zh: { 'hero.title': '你好 {name}' } },
  fallbackLocale: 'en',
  persist: true, // گزینش را در localStorage به یاد می‌سپارد
  detectNavigatیا: true, // زبان نخستین را از مرورگر برمی‌گزیند
});

useI18n()!.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
useI18n()!.setLocale('zh'); // ذخیره می‌کند و به مشترکان خبر می‌دهد
```

`t()` نخست به زبان پشتیبان و سپس به خودِ کلید پس می‌نشیند؛ جای‌نگهدارهای `{param}` هم پر می‌شوند. هستهٔ آن در SSR امن است.

## وارد کردن

برای سبک‌تر شدن بسته، مؤلفه‌ها را تک‌تک وارد کن:

```js
import 'ranui/button';
```

زیرمسیرهایی که مؤلفه نیستند، ابزارها را جداگانه عرضه می‌کنند، پس می‌توانی تنها همان موتوری را که لازم داری برداری، بی‌آنکه همهٔ عنصرها ثبت شوند:

```js
import { initTheme } from 'ranui/theme'; // فقط پوسته
import { createI18n } from 'ranui/i18n'; // فقط بومی‌سازی
```

اگر سبک‌ها نیامدند، شیوه‌نامه را دستی وارد کن:

```js
import 'ranui/style';
```

اگر تشخیص نوع‌ها شکست خورد، یکی از نقطه‌های ورود نوع را دستی وارد کن:

```ts
import 'ranui/typings';
// or
import 'ranui/dist/index.d.ts';
// or
import 'ranui/type';
// or
import 'ranui/dist/typings';
```

همین که یکی از آن‌ها کار کند بس است.

وارد کردن کامل هم پشتیبانی می‌شود:

```ts
import 'ranui';
```

ماژول ES:

```js
import 'ranui';
```

یا:

```js
import 'ranui/button';
```

UMD، IIFE، CJS:

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>
```

### بدون بسته‌ساز (صفحه‌های ایستا یا CDN)

بسته به اینکه صفحه چند مؤلفه به کار می‌برد، شکل توزیع را برگزین:

| وضعیت                         | بهترین گزینه                              | چرا                                                              |
| ----------------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| یکی دو مؤلفه، یک برچسب script | IIFE هر مؤلفه: `dist/iife/<name>.iife.js` | خودبسنده است و به نحو ماژول نیاز ندارد                           |
| چند مؤلفه                     | ماژول‌های ES هر مؤلفه: `dist/<name>.js`   | گراف ماژول مرورگر، تکه‌های تکراری زمان اجرای مشترک را حذف می‌کند |
| همه چیز                       | بستهٔ کامل: `dist/index.iife.js`          | یک فایل، که همهٔ مؤلفه‌ها در آن ثبت می‌شوند                      |
| پروژه‌ای با بسته‌ساز          | وارد کردن از npm: `import 'ranui/<name>'` | شاخه‌های بی‌مصرف تکانده می‌شوند و زمان اجرا تنها یکی است         |

IIFE هر مؤلفه؛ یک برچسب، بدون هیچ گام ساخت:

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/select.iife.js" defer></script>
```

هر IIFE وابستگی‌های درونی‌اش را در خود جای می‌دهد (مثلاً `select` شامل `icon` است)؛ ثبت عنصرها نگهبان دارد، پس بار کردن چند فایل که وابستگی مشترک دارند بی‌خطر است، اما هر فایل رونوشت خودش از زمان اجرای مشترک را با خود می‌آورد. وقتی صفحه‌ای چند مؤلفه لازم دارد، ماژول‌های ES را ترجیح بده که همان را میان خود قسمت می‌کنند:

```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/button.js';
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/select.js';
</script>
```

## کاربرد

مؤلفه‌های RanUI از جنس Web Components‌اند، پس بی‌نیاز از پوشش‌های ویژهٔ هر چارچوب به کار می‌روند.

در بیشتر موارد، همان‌گونه به کارشان ببر که عنصرهای معمول HTML را.

نمونه‌ها:

- html
- js
- jsx
- vue
- tsx

### html

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>

<body>
  <r-button>Button</r-button>
</body>
```

### js

```js
import 'ranui';

const Button = document.createElement('r-button');
Button.textContent = 'this is button text';
document.body.appendChild(Button);
```

### jsx

```jsx
import 'ranui';

const App = () => {
  return (
    <>
      <r-button>Button</r-button>
    </>
  );
};
```

### vue

```vue
<template>
  <r-button></r-button>
</template>
<script>
import 'ranui';
</script>
```

### tsx

```tsx
import 'ranui/button';

const Button = () => {
  return (
    <div>
      <r-button type="primary">button</r-button>
    </div>
  );
};
```

### جای پیام و ظرف آن

`window.message` می‌گذارد فاصله از بالا، ترتیب روی‌هم‌قرارگیری، و ظرفی که پیام در آن می‌نشیند را خودت تعیین کنی:

```ts
import 'ranui/message';

const customRoot = document.getElementById('custom-message-root');

window.message?.success({
  content: 'Saved',
  duration: 2000,
  top: 24,
  zIndex: 3000,
  getContainer: () => customRoot,
});
```

`top` هم `number` می‌پذیرد و هم `string`؛ `24` به `24px` بدل می‌شود، حال آنکه `'2rem'` یکای خود را نگه می‌دارد.

`zIndex` نیز `number` و `string` را می‌پذیرد.

`getContainer` باید یک `HTMLElement` برگرداند؛ اگر نیاید، پیام‌ها روی `document.body` می‌نشینند.

### قطعه‌های واکنشی

`signal`، `createEffect`، `computed`، `batch`، `untrack` و لایه‌ای برای مالکیت (`createRoot`، `onCleanup`، `getOwner`، `runWithOwner`) در کنار سازندهٔ DOM می‌آیند تا بتوانی بخش‌های واکنشی صفحه را بی‌نیاز از چارچوب بسازی. طرح کار به `@Observable` در SwiftUI می‌ماند، با تضمین‌هایی به سبک Solid.js: اثرها پیش از هر اجرای دوباره، اشتراک‌های کهنهٔ خود را خودکار پاک می‌کنند؛ `batch()` چند نوشتن را در یک بازتاب جمع می‌کند؛ `computed` **تنبل است و بر پایهٔ مقدار به خاطر می‌سپارد** (یادداشتی که کسی نخواندش هرگز محاسبه نمی‌شود و تنها وقتی وابستگانش را بیدار می‌کند که مقدارش واقعاً عوض شده باشد)؛ و هر اثر و یادداشت و اتصال، از آنِ دامنهٔ خودش است، پس دور انداختن یک `createRoot` هرچه را در آن زاده شده با یک فراخوان برمی‌چیند — همان یکایی که با آن یک صفحه یا یک مسیر را جمع می‌کنی. متدهای زنجیره‌پذیر `ElementBuilder` (`text`، `attr`، `class` و…) گیرندهٔ سیگنال را هم می‌پذیرند و اتصال خودبه‌خود به‌روز می‌شود. راهنمای کامل: [`ranview`](../ranview/README.md).

```ts
import { signal, createEffect, computed, batch, EventManager, Div, ButtonBuilder } from 'ranui/builder';

function initCounter(container: HTMLElement) {
  const [count, setCount] = signal(0);
  const [step, setStep] = signal(1);
  const doubled = computed(() => count() * 2);
  const scope = new EventManager();

  const label = Div().build();
  const view = Div()
    .children(
      label,
      ButtonBuilder()
        .text('+')
        .listen(scope, 'click', () => setCount((n) => n + step())),
      ButtonBuilder()
        .text('reset')
        .listen(
          scope,
          'click',
          () =>
            batch(() => {
              setCount(0);
              setStep(1);
            }), // دو نوشتن، و تنها یک بازتاب
        ),
    )
    .build();

  const dispose = createEffect(() => {
    label.textContent = `${count()} (×2 = ${doubled()})`;
  });

  container.appendChild(view);
  return () => {
    dispose();
    scope.abort();
  }; // برچیدن
}
```

API کامل را در [مستندات ابزارها](./utils/README.md) ببین.

### مسیریابی

RanUI مسیریابی سمت کاربر را در خود دارد؛ هم با مؤلفه‌های اعلانی و هم با یک API جاوااسکریپتی.

**مؤلفه‌های اعلانی:**

```html
<r-router>
  <nav>
    <r-link href="/">Home</r-link>
    <r-link href="/about">About</r-link>
  </nav>

  <r-route path="/" exact><h2>Home</h2></r-route>
  <r-route path="/about"><h2>About</h2></r-route>
  <r-route path="/users/:id"><h2>User detail</h2></r-route>
</r-router>
```

**API جاوااسکریپتی با نگهبان ناوبری:**

```ts
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history',
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both'
});

router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) next('/login');
  else next();
});

router.push('/users/42');
```

برای سایت‌های کاملاً MPA که به مسیریاب جاوااسکریپتی نیاز ندارند، `enableMpaViewTransitions()` را صدا بزن تا `@view-transition { navigation: auto }` تزریق شود. پویانمایی‌هایی که در آن‌ها یک عنصر از صفحه‌ای به صفحهٔ دیگر شکل عوض می‌کند، با ویژگی استاندارد CSS یعنی `view-transition-name` نوشته می‌شوند.

```ts
import { enableMpaViewTransitions } from 'ranui';
enableMpaViewTransitions();
```

API کامل — نگهبان‌ها، `onPageSwap` و `onPageReveal`، و نام‌های گذار برای هر عنصر — در [مستندات مسیریاب](https://ran.chaxus.com/fa/src/ranui/router/) آمده است.

### SSR و سازنده

برای SSR یا ساختن اعلانی رابط کاربری، RanUI در درون خود از `builder`، دفتر ثبت SSR و Declarative Shadow DOM بهره می‌برد. مؤلفه‌ها با `ensureShadowRoot` از Shadow Root موجود دوباره استفاده می‌کنند و درخت خود را در سازنده می‌سازند. درختی که کارساز کشیده، نخستین فریم را رسم می‌کند و سپس جایگزین می‌شود: مؤلفه‌ها یک shadow root **بسته** می‌چسبانند و `attachShadow` فرزندان نمونهٔ اعلانی را پاک می‌کند، پس سمت کاربر همیشه از نو ساخته می‌شود.

نمونهٔ رسم SSR در سطح کد:

```ts
import { Button } from '@/components/button';
import { renderToString } from '@/utils/ssr';

const button = new Button();
button.setAttribute('effect', 'true');

// رشته‌ای HTML برمی‌گرداند که Declarative Shadow DOM در آن هست.
const html = renderToString(button);
```

جزئیات در [مستندات ابزارها](./utils/README.md) آمده است.

## قراردادهای نوشتن مؤلفه

هنگام افزودن یا نگهداری مؤلفه‌ها، قراردادهای این بسته را پاس بدار:

- از `RanElement` ارث ببر؛ `HTMLElement` مرورگر را یکراست گسترش نده.
- Shadow Root را با `ensureShadowRoot` بساز یا دوباره به کار بگیر؛ `attachShadow` را مستقیم صدا نزن.
- زیردرخت Shadow DOM را در سازنده بساز و جای دیگری نه.
- عنصرها را همان‌طور که می‌سازی با `.ref()` بگیر و با `shadowPart` بازخوان؛ هرگز برای چیزی که خودِ مؤلفه ساخته `querySelector` نزن.
- `sheet` را در `observedAttributes` بگنجان و بازنویسی سبک در سطح مؤلفه را از راه `syncSheetAttribute` اعمال کن.
- `attributeChangedCallback` را با `if (old === next) return;` پاس بدار.
- مؤلفه‌ها را با `defineSSR('r-name', Component)` ثبت کن، نه با فراخوان مستقیم `customElements.define`.
- در `index.ts` هم صادرات نوع‌ها را بیفزا و هم وارد کردن‌های دارای اثر جانبی؛ همچنین ورودی‌های مستقل را در `vite.config.ts` و `package.json` اضافه کن.
- برای شنونده‌های وابسته به چرخهٔ عمر در `connectedCallback` از `EventManager` در `@/utils/builder` استفاده کن؛ در `disconnectedCallback` به‌جای دنبال کردن تک‌تک `removeEventListener`ها، `manager.abort()` را صدا بزن.

## مشارکت

از مشارکت همه استقبال می‌کنیم، چه برای آموختن آمده باشید و چه برای برنامه‌نویسی. این پروژه آزمایشی است، پس چشم‌به‌راه تغییرهای پیاپی باشید.

## مشارکت‌کنندگان

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## دیگر موارد

[پروانه (MIT)](/LICENSE)
