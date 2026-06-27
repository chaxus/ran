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

## Installation

Using npm:

```console
npm install ranui --save
```

## Documentation and Examples

[See components and use examples](https://chaxus.github.io/ran/cn/src/ranui/)

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

### Themes and Theme Packs

RanUI supports light, dark, and system themes, plus multiple CSS-only theme packs.

```ts
import { initTheme, setTheme, setThemePack, setThemeToken } from 'ranui';
import 'ranui/theme-packs/pixel-retro';

initTheme();
setTheme('system');
setThemePack('pixel-retro');
setThemeToken('--ran-color-primary', '#2563eb');
```

Available theme packs include `windows-98`, `windows-xp`, `system-6`, `wired`, `paper`, `pixel-retro`, and `neo-brutalism`. Use `setThemePack('default')` to restore the default theme pack.

## Imports

Use per-component imports to reduce bundle size:

```js
import 'ranui/button';
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
