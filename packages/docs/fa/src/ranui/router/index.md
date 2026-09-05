---
description: 'مسیریابی SPA سمت کلاینت با کامپوننت‌های اعلانی، یک API جاوااسکریپتی، نگهبان‌های ناوبری، View Transitions و پشتیبانی از گذار میان‌سندی (MPA).'
---

# Router

مسیریابی سمت کلاینت برای برنامه‌های تک‌صفحه‌ای. کامپوننت‌های HTML اعلانی و یک API جاوااسکریپتی با نگهبان‌های ناوبری، View Transitions و گذار میان‌سندی (MPA) در اختیار می‌گذارد.

> **کجا به کار می‌آید:** وقتی به مسیریابی SPA سمت کلاینت با نگهبان‌های ناوبری، View Transitions و گذار میان‌سندی (MPA) نیاز دارید. `createRouter` به‌همراه `<r-router>` / `<r-route>` / `<r-link>` ناوبری درون‌برنامه‌ای را سیم‌کشی می‌کند.

## شروع سریع

یک برنامه کوچک اما کامل، با نگهبان احراز هویت و گذار SPA:

```js
import { createRouter } from 'ranui';

// ۱. ساخت مسیریاب با مسیرهای محافظت‌شده و گذارهای SPA
const router = createRouter({
  mode: 'history',
  viewTransition: 'spa',
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/about', meta: { title: 'About' } },
    { path: '/dashboard', meta: { title: 'Dashboard', requiresAuth: true } },
    { path: '/login', meta: { title: 'Login' } },
  ],
});

// ۲. نگهبان احراز هویت — کاربر واردنشده را هدایت کن
router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !sessionStorage.getItem('token')) {
    next('/login');
  } else {
    next();
  }
});

// ۳. پس از هر ناوبری عنوان صفحه را به‌روز کن و آمار بفرست
router.afterEach((to) => {
  document.title = to.meta?.title ?? 'App';
});
router.onRouteChange((to) => {
  analytics.track(to.fullPath);
});
```

```html
<!-- مسیریاب را سوار کن، پیوندها را بگذار، مسیرها را اعلام کن -->
<r-router>
  <nav>
    <r-link href="/">خانه</r-link>
    <r-link href="/about">درباره</r-link>
    <r-link href="/dashboard">داشبورد</r-link>
  </nav>

  <r-route path="/" exact><h2>خانه</h2></r-route>
  <r-route path="/about"><h2>درباره</h2></r-route>
  <r-route path="/dashboard"><h2>داشبورد</h2></r-route>
  <r-route path="/login"><h2>ورود</h2></r-route>
</r-router>
```

```css
/* گذار SPA — محو متقابل میان مسیرها */
@keyframes fade-in {
  from {
    opacity: 0;
  }
}
@keyframes fade-out {
  to {
    opacity: 0;
  }
}

::view-transition-old(root) {
  animation: 200ms ease-out fade-out;
}
::view-transition-new(root) {
  animation: 200ms ease-in fade-in;
}
```

## کامپوننت‌ها

### `r-router`

کامپوننت ظرف. به `popstate` گوش می‌دهد و در هر ناوبری همه `r-route`های فرزند را هماهنگ می‌کند.

#### اتریبیوت‌ها

| اتریبیوت | نوع                   | پیش‌فرض     | توضیح                                             |
| -------- | --------------------- | ----------- | ------------------------------------------------- |
| `mode`   | `'history' \| 'hash'` | `'history'` | حالت History API                                  |
| `base`   | `string`              | `''`        | پیشوند نشانی پایه که از همه مسیرها برداشته می‌شود |
| `sheet`  | `string`              | `''`        | CSSی که به Shadow DOM تزریق می‌شود                |

#### رویدادها

| رویداد        | detail             | توضیح                                    |
| ------------- | ------------------ | ---------------------------------------- |
| `routechange` | `{ path: string }` | پس از هر به‌روزرسانی مسیر فرستاده می‌شود |

### `r-route`

اگر مسیر جاری با `path` بخواند، محتوای اسلاتش را نشان می‌دهد؛ وگرنه پنهانش می‌کند.

#### اتریبیوت‌ها

| اتریبیوت | نوع       | پیش‌فرض | توضیح                                                                |
| -------- | --------- | ------- | -------------------------------------------------------------------- |
| `path`   | `string`  | `'/'`   | الگوی تطبیق. از بخش‌های `:param` و جانشین `*` پشتیبانی می‌کند        |
| `exact`  | `boolean` | `false` | تطبیق دقیق را لازم می‌کند (بدون تطبیق پیشوندی)                       |
| `src`    | `string`  | `''`    | شناسه ماژول برای سوار و پیاده کردن صفحه به‌صورت تنبل و با جداسازی کد |
| `sheet`  | `string`  | `''`    | CSSی که به Shadow DOM تزریق می‌شود                                   |

#### رویدادها

| رویداد       | detail             | توضیح                                    |
| ------------ | ------------------ | ---------------------------------------- |
| `routematch` | `{ path, params }` | وقتی این مسیر فعال می‌شود فرستاده می‌شود |

#### نمونه‌های الگوی مسیر

```
/users            با /users، /users/42، /users/42/profile می‌خواند
/users (exact)    فقط با /users می‌خواند
/users/:id        مقدار :id را می‌گیرد → params.id
/*                با همه‌چیز می‌خواند
```

#### سوار و پیاده کردن تنبل `src`

در برنامه‌ای بزرگ‌تر و چندصفحه‌ای، `r-route` می‌تواند به‌جای اینکه محتوای اسلاتش را همیشه از پیش بفرستد، کد هر صفحه را جدا کند. `src` را روی یک شناسه ماژول بگذارید؛ هنگام تطبیق، `r-route` آن را پویا `import()` می‌کند و خروجی پیش‌فرضش را — تابعی از نوع `(host: HTMLElement) => void | (() => void)` — درون یک دامنه واکنشی صدا می‌زند و عنصر میزبانی برای رسم به آن می‌دهد. ترک مسیر، آن دامنه را یکجا دور می‌ریزد (هر اثر، هر پیوند و هر `onCleanup`ی که صفحه ثبت کرده) و سپس محتوای رسم‌شده را برمی‌دارد؛ بازگشت به همان مسیر، از ماژول کش‌شده دوباره سوار می‌شود بدون آنکه دوباره واکشی شود.

```html
<r-route path="/settings" src="/pages/settings.js"></r-route>
```

```js
// pages/settings.js
export default function renderSettings(host) {
  host.textContent = 'Settings page';
  return () => {
    /* پاک‌سازی اختیاری، هنگام ترک مسیر اجرا می‌شود */
  };
}
```

این حالت فقط سمت کلاینت است: در SSR/SSG، یک مسیر تنبل تنها وضعیت نمایش/پنهانش را حل می‌کند، نه خودِ ماژول صفحه را.

### `r-link`

یک پیوند ناوبری. برای مسیرهای هم‌مبدأ از بارگذاری دوباره کل صفحه جلوگیری می‌کند، اگر مسیریابی فعال باشد `RouterCore.push/replace` را صدا می‌زند، و در غیر این صورت رویداد `ran-navigate` را در درخت DOM به بالا می‌فرستد.

نشانی‌های بیرونی (`http://`، `//`، `mailto:`، `tel:`) مثل پیوند `<a>` معمولی رد می‌شوند.

#### اتریبیوت‌ها

| اتریبیوت  | نوع       | پیش‌فرض | توضیح                                               |
| --------- | --------- | ------- | --------------------------------------------------- |
| `href`    | `string`  | `''`    | مسیر مقصد                                           |
| `replace` | `boolean` | `false` | به‌جای افزودن، ورودی جاری تاریخچه را جایگزین می‌کند |
| `sheet`   | `string`  | `''`    | CSSی که به Shadow DOM تزریق می‌شود                  |

```html
<r-link href="/about">درباره</r-link>
<r-link href="/settings" replace>تنظیمات</r-link>
<r-link href="https://github.com">GitHub ↗</r-link>
```

#### اسلات‌ها

هیچ‌یک از `r-router`، `r-route` و `r-link` اسلات نام‌دار ندارند. هرکدام تنها `<slot>` پیش‌فرض (بی‌نام) را رسم می‌کنند: `r-router` و `r-route` مسیرهای فرزند یا محتوای مسیر را همان‌گونه نمایش می‌دهند و `r-link` هرچه درونش بگذارید را به‌عنوان محتوای دیدنیِ پیوند نشان می‌دهد. هیچ‌کدام `::part()` هم تعریف نمی‌کنند، پس این گروه کامپوننت بخش Partهای CSS ندارد.

## API جاوااسکریپت

### `createRouter(config?)`

یک نمونه سراسری `RouterCore` می‌سازد و ثبت می‌کند. در آغاز برنامه یک بار و پیش از سوار کردن هر عنصر `r-router` صدایش بزنید.

```js
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history', // 'history' (پیش‌فرض) | 'hash'
  base: '/app', // پیشوند '/app' را از همه مسیرهای درونی بردار
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both' | false
});
```

#### گزینه‌ها

| گزینه            | نوع                             | پیش‌فرض     | توضیح                                                  |
| ---------------- | ------------------------------- | ----------- | ------------------------------------------------------ |
| `mode`           | `'history' \| 'hash'`           | `'history'` | راهبرد نشانی                                           |
| `base`           | `string`                        | `''`        | پیشوند مسیر پایه                                       |
| `routes`         | `RouteConfig[]`                 | `[]`        | تعریف مسیرها با path و exact و meta                    |
| `viewTransition` | `boolean \| ViewTransitionMode` | `false`     | View Transitions را روشن می‌کند (`true` برابر `'spa'`) |

### `RouterCore`

همه متدهای قلاب یک **تابع لغو اشتراک** برمی‌گردانند.

| نام                      | امضا / نوع                                              | توضیح                                                           |
| ------------------------ | ------------------------------------------------------- | --------------------------------------------------------------- |
| `push(path)`             | `(path: string) => Promise<void>`                       | ناوبری می‌کند و ورودی تازه‌ای به تاریخچه می‌افزاید              |
| `replace(path)`          | `(path: string) => Promise<void>`                       | ناوبری می‌کند و ورودی جاری را جایگزین می‌کند                    |
| `back()`                 | `() => void`                                            | `history.back()`                                                |
| `forward()`              | `() => void`                                            | `history.forward()`                                             |
| `go(delta)`              | `(delta: number) => void`                               | `history.go(delta)`                                             |
| `beforeEach(guard)`      | `(guard: NavigationGuard) => () => void`                | نگهبان ناوبری را ثبت می‌کند؛ پیش از قطعی‌شدن ناوبری اجرا می‌شود |
| `afterEach(handler)`     | `(handler: RouteChangeHandler) => () => void`           | قلاب پس از ناوبری؛ پس از به‌روزشدن DOM اجرا می‌شود              |
| `onRouteChange(handler)` | `(handler: RouteChangeHandler) => () => void`           | هر تغییر مسیر را مشترک می‌شود                                   |
| `onPageSwap(handler)`    | `(handler: (e: PageSwapEvent) => void) => () => void`   | رویداد میان‌سندی `pageswap` (فقط در حالت MPA)                   |
| `onPageReveal(handler)`  | `(handler: (e: PageRevealEvent) => void) => () => void` | رویداد میان‌سندی `pagereveal` (فقط در حالت MPA)                 |
| `destroy()`              | `() => void`                                            | همه شنونده‌ها و CSS تزریق‌شده را برمی‌دارد                      |
| `currentRoute`           | `RouteLocation \| null`                                 | شیء موقعیت مسیر جاری                                            |
| `mode`                   | `'history' \| 'hash'`                                   | حالت تاریخچه                                                    |
| `base`                   | `string`                                                | پیشوند نشانی پایه                                               |
| `routes`                 | `RouteConfig[]`                                         | پیکربندی‌های مسیرِ ثبت‌شده                                      |

```js
router.push('/users/42');
router.replace('/login');
router.back();
router.go(-2);
```

### `useRouter()`

نمونه فعال `RouterCore` را برمی‌گرداند، یا `null` اگر `createRouter` هنوز صدا زده نشده باشد.

```js
import { useRouter } from 'ranui';

const router = useRouter();
router?.push('/about');
```

## نگهبان‌های ناوبری

نگهبان‌ها به ترتیب ثبت و پیش از قطعی‌شدن ناوبری اجرا می‌شوند. برای اجازه `next()`، برای لغو `next(false)` و برای هدایت `next('/path')` را صدا بزنید.

```js
const unsubscribe = router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});

// برداشتن نگهبان در آینده:
unsubscribe();
```

### قلاب‌های پس از ناوبری

`afterEach` و `onRouteChange` هر دو پس از به‌روزشدن DOM فرستاده می‌شوند. برای اثرهای جانبی‌ای که به ناوبریِ کامل‌شده وابسته‌اند از `afterEach` و برای اشتراک‌های سبک از `onRouteChange` استفاده کنید.

```js
router.afterEach((to, from) => {
  document.title = to.meta?.title ?? 'App';
});

router.onRouteChange((to, from) => {
  analytics.track(to.fullPath);
});
```

## View Transitions

با [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) مرورگر، گذار میان مسیرها را متحرک کنید.

### مقایسه

پیش از نوشتن هر CSSی، حالت را انتخاب کنید:

| حالت     | Chrome      | چه چیزی آن را راه می‌اندازد                | JS لازم است |
| -------- | ----------- | ------------------------------------------ | ----------- |
| `'spa'`  | 111+        | `router.push()` یا کلیک روی `r-link`       | بله         |
| `'mpa'`  | 126+        | هر پیوند `<a>`، ارسال فرم، `location.href` | خیر         |
| `'both'` | 111+ / 126+ | همه موارد بالا                             | اختیاری     |

### SPA — گذار درون یک سند

```js
const router = createRouter({ viewTransition: 'spa' }); // یا true
```

هر فراخوانی `router.push()` / `router.replace()` به‌روزرسانی DOM را در `document.startViewTransition()` می‌پیچد. جایی که این API نباشد، با متانت به یک به‌روزرسانی همگام افت می‌کند (Chrome 111 به بالا).

CSSی برای تعریف انیمیشن بیفزایید:

```css
/* محو متقابل پیش‌فرض */
@keyframes fade-in {
  from {
    opacity: 0;
  }
}
@keyframes fade-out {
  to {
    opacity: 0;
  }
}

::view-transition-old(root) {
  animation: 200ms ease-out fade-out;
}
::view-transition-new(root) {
  animation: 200ms ease-in fade-in;
}
```

### MPA — گذار میان سندها

```js
const router = createRouter({ viewTransition: 'mpa' });
```

قاعده `@view-transition { navigation: auto }` را در `<head>` تزریق می‌کند و گذار خودکار را در هر ناوبری تمام‌صفحه هم‌مبدأ روشن می‌کند (Chrome 126 به بالا). در هر صفحه به جاوااسکریپت نیازی نیست.

برای برنامه‌هایی که اصلاً از مسیریاب استفاده نمی‌کنند:

```js
import { enableMpaViewTransitions } from 'ranui';

const cleanup = enableMpaViewTransitions();
// در صورت نیاز cleanup() تگ <style> تزریق‌شده را برمی‌دارد
```

**رویدادهای چرخه عمر MPA:**

```js
// pageswap روی سندی که دارد می‌رود، پیش از unload فرستاده می‌شود
router.onPageSwap((e) => {
  const type = e.activation?.navigationType; // 'push' | 'replace' | 'traverse'
  if (type === 'traverse') e.viewTransition?.skipTransition();
});

// pagereveal روی سندی که وارد می‌شود، پیش از نخستین رسم فرستاده می‌شود
router.onPageReveal((e) => {
  console.log('new page ready');
});
```

### SPA و MPA با هم

```js
const router = createRouter({ viewTransition: 'both' });
```

ناوبری‌های SPA از `startViewTransition()` استفاده می‌کنند و ناوبری‌های تمام‌صفحه از قاعده CSSی `@view-transition`. هرجا شد گذار را با JS برانید، وگرنه CSS جایگزین می‌شود.

## `view-transition-name` — گذار عنصر مشترک

`view-transition-name` به‌جای کل قاب دید، یک عنصر مشخص را میان دو صفحه متحرک می‌کند. مرورگر جا و اندازه آن عنصر را در هر دو سو می‌گیرد و میانشان انیمیشن می‌سازد. این همان جلوه بازشدن کارت در [نمونه پروفایل‌های Chrome](https://view-transitions.chrome.dev/profiles/mpa/) است.

### کاربرد پایه

به عنصر «یکسان» در صفحه مبدأ و مقصد نام یکسانی بدهید:

```html
<!-- صفحه فهرست -->
<div class="card" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <span>Jane Doe</span>
</div>
```

```html
<!-- صفحه جزئیات -->
<div class="profile-header" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <h1>Jane Doe</h1>
</div>
```

مرورگر خودش کارت را از جای فهرستی‌اش تا جای جزئیاتش، با تغییر شکل، متحرک می‌کند.

### نام‌های پویا در یک فهرست

`view-transition-name` باید در هر صفحه یکتا باشد. شناسه آیتم را بخشی از نام کنید:

```css
/* رویکرد CSS — یک قاعده برای هر کارت */
.card[data-id='1'] {
  view-transition-name: card-1;
}
.card[data-id='42'] {
  view-transition-name: card-42;
}
```

```js
// رویکرد JS — نام را درست پیش از ناوبری تعیین کن
function navigateToProfile(id) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  card.style.viewTransitionName = `profile-${id}`;
  router.push(`/profiles/${id}`);
}
```

در صفحه مقصد، نام متناظر را پیش از نخستین رسم تعیین کنید:

```js
// بی‌درنگ (و همگام) تعیین کنید تا مرورگر آن را بگیرد
const id = router.currentRoute?.params.id;
document.querySelector('.profile-header').style.viewTransitionName = `profile-${id}`;
```

### گذارهای لغزشیِ جهت‌دار

یک نگهبان `beforeEach` را با یک ویژگی سفارشی CSS ترکیب کنید تا برای هر جهت ناوبری انیمیشن متفاوتی بسازید:

```js
const pages = ['/', '/step-1', '/step-2', '/step-3'];

router.beforeEach((to, from, next) => {
  const toIdx = pages.indexOf(to.path);
  const fromIdx = pages.indexOf(from?.path ?? '');
  document.documentElement.dataset.navDir = toIdx >= fromIdx ? 'forward' : 'back';
  next();
});
```

```css
@keyframes slide-from-right {
  from {
    translate: 100% 0;
  }
}
@keyframes slide-from-left {
  from {
    translate: -100% 0;
  }
}
@keyframes slide-to-right {
  to {
    translate: 100% 0;
  }
}
@keyframes slide-to-left {
  to {
    translate: -100% 0;
  }
}

[data-nav-dir='forward']::view-transition-old(root) {
  animation: 300ms ease slide-to-left;
}
[data-nav-dir='forward']::view-transition-new(root) {
  animation: 300ms ease slide-from-right;
}
[data-nav-dir='back']::view-transition-old(root) {
  animation: 300ms ease slide-to-right;
}
[data-nav-dir='back']::view-transition-new(root) {
  animation: 300ms ease slide-from-left;
}
```

برای بیرون گذاشتن یک عنصر از گذار، `view-transition-name: none` را به کار ببرید. برای متحرک‌کردن مستقلِ چند بخش، به هرکدام نامی یکتا بدهید؛ هرچه نام نداشته باشد با گذار ریشه محو می‌شود.

## SSR / SSG

همه APIهای مرورگر (`window`، `history`، `document`) با بررسی `typeof` محافظت شده‌اند، پس صدا زدن `createRouter` در محیط SSR روی Node یا Deno امن است. در بستر SSR، `push` و `replace` نگهبان‌ها را اجرا می‌کنند و `currentRoute` را به‌روز می‌کنند اما `history.pushState` / `history.replaceState` را رد می‌کنند. شنونده‌های `popstate` هرگز سمت سرور ثبت نمی‌شوند. روی کلاینت مثل همیشه هیدریت کنید: `createRouter` را دوباره با همان پیکربندی صدا بزنید.

## مرجع تایپ‌ها

```ts
interface RouteLocation {
  path: string; // مثلاً '/users/42'
  params: Record<string, string>; // مثلاً { id: '42' }
  query: Record<string, string>; // مثلاً { tab: 'profile' }
  fullPath: string; // مثلاً '/users/42?tab=profile'
}

type ViewTransitionMode = 'spa' | 'mpa' | 'both';

interface RouterConfig {
  mode?: 'history' | 'hash';
  base?: string;
  routes?: RouteConfig[];
  viewTransition?: boolean | ViewTransitionMode;
}

interface RouteConfig {
  path: string;
  exact?: boolean;
  meta?: Record<string, unknown>;
  children?: RouteConfig[];
}

type NavigationGuard = (
  to: RouteLocation,
  from: RouteLocation | null,
  next: (redirect?: string | false) => void,
) => void;

type RouteChangeHandler = (to: RouteLocation, from: RouteLocation | null) => void;
```
