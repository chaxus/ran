# ranui

An experimental UI component library based on Web Components. Components use Shadow DOM encapsulation, CSS Token theming, and SSR / Declarative Shadow DOM support.

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/umd/shadowless/shadowless.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[中文](./README.zh-CN.md) | **English**

## Important Notice

This is an **experimental UI library** in early development. It is usable, but primarily intended for learning and experimentation.

Key points:

- **Early development**: features are still being developed and refined.
- **Experimental**: APIs may change frequently.
- **Learning-oriented**: mainly intended for learning Web Components and UI development.

## Features

1. **Cross-framework compatibility:** works with React, Vue, Preact, SolidJS, Svelte, and any JavaScript project that follows W3C standards.
2. **Native experience:** use custom elements such as `<r-button>` and `<r-modal>` like native HTML elements.
3. **Modular design:** supports both full imports and per-component imports for better maintainability and bundle control.
4. **Shadow DOM encapsulation:** component internals are isolated by default, while CSS Tokens, `::part()`, and the `sheet` attribute provide controlled styling hooks.
5. **TypeScript support:** built with TypeScript and type definitions.
6. **SSR friendly:** supports server rendering through `defineSSR`, `renderToString`, and Declarative Shadow DOM.
7. **Accessible:** ARIA roles/states, full keyboard navigation, form-associated inputs (`<r-checkbox>`/`<r-input>`/`<r-select>` participate in native `FormData`), live-region toasts, and `prefers-reduced-motion` support.

## Installation

Using npm:

```console
npm install ranui --save
```

## Documentation and Examples

[See components and use examples](https://chaxus.github.io/ran/src/ranui/)

### Components & API reference

Every element's attributes, properties, **events (with `detail` shapes)**, slots, and `::part()` names are generated from source — no need to grep the exports:

- Per-element API: [docs/COMPONENTS.md](./docs/COMPONENTS.md)
- Design standard (color/spacing/typography/motion/a11y): [docs/DESIGN.md](./docs/DESIGN.md)

Regenerate after changing a component's API with:

```bash
pnpm doc:api
```

### AI / Claude Code skill

A ready-to-use skill lets AI assistants (Claude Code) read and use ranui without
spelunking the source. It's published from the `ran` plugin marketplace:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
```

Once installed, Claude uses it automatically when you work with ranui (or invoke it
explicitly as `/ranui:ranui`). The skill covers the import map, element inventory, the
builder/reactivity API, accessibility, and usage examples, and points to the API
reference shipped in the package ([docs/COMPONENTS.md](./docs/COMPONENTS.md)).

### Styling Documentation

The styling system is unified around CSS Tokens and `::part()`.

- Style override guide: [docs/style-override.md](./docs/style-override.md)
- Complete Token/Part list, generated automatically: [docs/style-tokens-parts.md](./docs/style-tokens-parts.md)
- Public styling API for consumers, generated automatically: [docs/style-tokens-public.md](./docs/style-tokens-public.md)
- Public token filter config: [docs/style-token-filter.json](./docs/style-token-filter.json)

Refresh the styling docs with:

```bash
pnpm doc:style
```

### Theming

ranui ships a single token system based on the [Geist design system](https://vercel.com/geist) — Vercel's open-source design language, where color is a **state ladder** (each scale runs 100→1000, one job per step: background → hover → border → solid fill → text). ranui adopts that ladder plus **Geist Sans / Geist Mono**, so dark mode just redefines the base scale and every semantic token flips automatically. Three modes — `light`, `dark`, `system` — and no theme packs. Switch the mode or override any token at runtime (SSR-safe):

```ts
import { initTheme, setTheme, setThemeToken, setThemeTokens } from 'ranui/theme';
import 'ranui/style';

initTheme(); // restore the persisted choice on load
setTheme('system'); // 'light' | 'dark' | 'system'
setThemeToken('--ran-color-primary', '#6c47ff');
setThemeTokens({ '--ran-radius-md': '10px' });
```

The `ranui/theme` entry ships only the theming engine — no custom elements are
registered, so it stays out of your bundle if you just want tokens/dark mode.
The same APIs are also re-exported from the `ranui` barrel.

Dark mode redefines only the base color scale; semantic tokens (`--ran-color-*`) reference it and flip automatically. See [docs/THEME_STYLE_SYSTEM_DESIGN.md](./docs/THEME_STYLE_SYSTEM_DESIGN.md) and [docs/DESIGN.md](./docs/DESIGN.md).

### Internationalization

A framework-agnostic i18n engine ships as its own `ranui/i18n` entry — like
`ranui/theme`, it registers no custom elements:

```ts
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // each locale is a flat dictionary — keys are used verbatim (no nesting)
  messages: { en: { 'hero.title': 'Hi {name}' }, zh: { 'hero.title': '你好 {name}' } },
  fallbackLocale: 'en',
  persist: true, // remember the choice in localStorage
  detectNavigator: true, // pick the initial locale from the browser
});

useI18n()!.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
useI18n()!.setLocale('zh'); // persists and notifies subscribers
```

`t()` falls back to the fallback locale, then to the key itself; `{param}`
placeholders are interpolated. The core is SSR-safe.

## Imports

Use per-component imports to reduce bundle size:

```js
import 'ranui/button';
```

Non-component subpaths ship the utilities on their own, so you can pull in just
the engine you need without registering every element:

```js
import { initTheme } from 'ranui/theme'; // theming only
import { createI18n } from 'ranui/i18n'; // i18n only
```

If styles are missing, import the stylesheet manually:

```js
import 'ranui/style';
```

If type resolution fails, import one of the type entry points manually:

```ts
import 'ranui/typings';
// or
import 'ranui/dist/index.d.ts';
// or
import 'ranui/type';
// or
import 'ranui/dist/typings';
```

Only one working type entry is needed.

Full import is also supported:

```ts
import 'ranui';
```

ES module:

```js
import 'ranui';
```

or:

```js
import 'ranui/button';
```

UMD, IIFE, CJS:

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>
```

### Without a bundler (static pages / CDN)

Pick the distribution that matches how many components the page uses:

| Scenario                       | Best option                                    | Why                                                                  |
| ------------------------------ | ---------------------------------------------- | -------------------------------------------------------------------- |
| 1–2 components, one script tag | Per-component IIFE: `dist/iife/<name>.iife.js` | Self-contained, no module syntax needed                              |
| Several components             | Per-component ES modules: `dist/<name>.js`     | Shared runtime chunks are deduplicated by the browser's module graph |
| Everything                     | Full bundle: `dist/index.iife.js`              | One file, every component registered                                 |
| Project with a bundler         | npm imports: `import 'ranui/<name>'`           | Tree-shaking and a single shared runtime                             |

Per-component IIFE — one tag, no build step:

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/select.iife.js" defer></script>
```

Each IIFE inlines its internal dependencies (e.g. `select` includes `icon`); element registration is guarded, so loading several files that share dependencies is safe — but each file carries its own copy of the shared runtime. When a page needs several components, prefer the ES modules instead, which deduplicate it:

```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/button.js';
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/select.js';
</script>
```

## Usage

RanUI components are Web Components, so they can be used without framework-specific wrappers.

In most cases, use them like native HTML elements.

Examples:

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

### Message Position and Container

`window.message` supports custom top offset, z-index, and mount container:

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

`top` supports `number | string`; `24` becomes `24px`, while `'2rem'` keeps its unit.

`zIndex` supports `number | string`.

`getContainer` must return an `HTMLElement`; when omitted, messages mount to `document.body`.

### Reactive Primitives

`signal`, `createEffect`, `computed`, and `batch` ship alongside the DOM builder for building reactive page sections without a framework. The design mirrors SwiftUI's `@Observable` with two correctness improvements from Solid.js: effects automatically clean up stale subscriptions before each re-run, and `batch()` coalesces multiple signal writes into a single effect flush — the same guarantee SwiftUI gives for free.

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
            }), // two writes → one effect flush
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
  }; // teardown
}
```

See [Utility Documentation](./utils/README.md) for the full API.

### Routing

RanUI includes client-side routing via declarative components and a JavaScript API.

**Declarative components:**

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

**JavaScript API with navigation guard:**

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

For pure MPA sites (no JS router needed), use `enableMpaViewTransitions()` to inject `@view-transition { navigation: auto }`. Shared-element morph animations are supported via the standard `view-transition-name` CSS property.

```ts
import { enableMpaViewTransitions } from 'ranui';
enableMpaViewTransitions();
```

See the [Router documentation](https://chaxus.github.io/ran/src/ranui/router/) for the full API including guards, `onPageSwap`/`onPageReveal`, and per-element transition names.

### SSR & Builder

For SSR or declarative UI construction, RanUI internally uses `builder`, the SSR registry, and Declarative Shadow DOM. Components reuse existing Shadow Roots through `ensureShadowRoot` and keep initialization idempotent through `ensureShadowElement`.

Source-level SSR rendering example:

```ts
import { Button } from '@/components/button';
import { renderToString } from '@/utils/ssr';

const button = new Button();
button.setAttribute('effect', 'true');

// Outputs an HTML string containing Declarative Shadow DOM.
const html = renderToString(button);
```

See [Utility Documentation](./utils/README.md) for details.

## Component Development Conventions

When adding or maintaining components, follow the package conventions:

- Extend `RanElement`; do not directly extend the browser `HTMLElement`.
- Use `ensureShadowRoot` to create or reuse Shadow Roots; do not call `attachShadow` directly.
- Use `ensureShadowElement` to build Shadow DOM subtrees idempotently.
- Include `sheet` in `observedAttributes` and sync component-level style overrides through `syncSheetAttribute`.
- Guard `attributeChangedCallback` with `if (old === next) return;`.
- Register components with `defineSSR('r-name', Component)`, not direct `customElements.define`.
- Add both type exports and side-effect imports in `index.ts`; also add standalone entries in `vite.config.ts` and `package.json`.
- Use `EventManager` from `@/utils/builder` for lifecycle-bound listeners in `connectedCallback`; call `manager.abort()` in `disconnectedCallback` instead of tracking individual `removeEventListener` calls.

## Contributing

Contributions from learners and developers are welcome. This is an experimental project, so please expect active iteration.

## Contributors

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Meta

[LICENSE (MIT)](/LICENSE)
