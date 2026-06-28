# ranui — Component Library Reference

Web Components library built with TypeScript. All components use Shadow DOM encapsulation, CSS variable theming, and SSR support.

---

## Design Standards — read before building or changing any UI

**[docs/DESIGN.md](docs/DESIGN.md) is the authoritative, executable design standard.** Follow it whenever your work changes what a user sees. It is based on the Geist design system (light/dark only).

For each element's **attributes / properties / events / slots / `::part()`**, consult **[docs/COMPONENTS.md](docs/COMPONENTS.md)** (generated — run `npm run doc:api` after changing any component's API) and **[docs/style-tokens-public.md](docs/style-tokens-public.md)** for its CSS variables. The non-negotiables:

- **Color is a state ladder, not a palette.** Each scale step 100→1000 has one fixed job: 100 default bg · 200 hover bg · 300 active bg · 400 border · 500 hover border · 600 active border · 700 solid · 800 solid hover · 900 secondary text · 1000 primary text. Use the **semantic tokens** (`--ran-color-*`), never raw hex, in components.
- **Dark-safe fallbacks.** A component token's fallback must point at a token that _flips_ (`var(--ran-color-text, …)`, `var(--ran-gray-alpha-100, …)`, `var(--ran-blue-100, …)`) — never a light-only literal like `rgba(0,0,0,.06)` or `#e6f7ff`, which breaks in dark mode.
- **Spacing:** the `--ran-space-*` scale only (4px base, 9 values). 8 within a group, 16 between groups, 32–40 between sections.
- **Typography:** choose a role (heading / label / copy / button / mono), not a raw px size.
- **Elevation = role.** Pick the shadow by what the element _is_: in-flow surface (card/section) → `--ran-shadow-elevated`; floating overlay (dropdown, select, popover, toast/message) → `--ran-shadow-menu`; blocking dialog → `--ran-shadow-modal`. A floating overlay must never fall back to the card tier (`elevated`) — it looks flat.
- **Radius/motion:** use the tokens; prefer no motion (0ms) and keep what remains quick (150/200/300ms); respect `prefers-reduced-motion`.
- **Copy:** buttons = action + object ("Deploy project"); errors = what + how; toasts state the change ("Project deleted").
- **Accessibility:** WCAG AA contrast; never signal state by color alone (pair an icon/label); visible focus ring on every interactive element; icon-only controls need an `aria-label`; full keyboard nav.
- **Verify rendered output** in light _and_ dark, at narrow _and_ wide widths, across the materially changed states — code review alone is not enough.

---

## Project Layout

```
packages/ranui/
├── components/           # One component per directory
│   └── {name}/
│       ├── index.ts      # Component class + defineSSR()
│       └── index.less    # Shadow DOM styles (auto-imports base.less)
├── utils/
│   ├── component.ts      # ensureShadowRoot, ensureShadowElement, attribute helpers
│   ├── builder/          # ElementBuilder fluent DOM builder
│   ├── router/           # RouterCore, createRouter, useRouter, enableMpaViewTransitions
│   ├── i18n/             # I18nCore, createI18n, useI18n (framework-agnostic)
│   ├── ssr-registry.ts   # defineSSR, SSR support
│   ├── theme.ts          # setTheme, setThemeToken(s), initTheme (light/dark/system)
│   ├── style.ts          # adoptStyles, adoptSheetText
│   └── dom.ts            # falseList, isDisabled
├── theme/                # tokens.less (Geist base+semantic) + dark.less (dark mixin)
├── docs/DESIGN.md        # ⭐ AI-facing design standard — follow it for ANY UI work
├── docs/COMPONENTS.md    # ⭐ generated per-element API (attrs/props/events/slots/parts)
├── test/unit/            # *.contract.test.ts per component
├── demo/                 # Dev server entry (Vite); routed showcase (r-router)
├── index.ts              # Barrel exports + side-effect imports
├── vite.config.ts        # Build + dev server config
├── vitest.config.ts      # Test config (jsdom, 80%+ coverage)
└── base.less             # Shared LESS variables/mixins (auto-imported)
```

---

## Component Architecture

### Canonical pattern

Every component follows this exact structure:

```typescript
import componentCss from './index.less?inline';
import { Div, EventManager, Slot } from '@/utils/builder';
import { RanElement } from '@/utils/index';
import {
  ensureShadowRoot,
  ensureShadowElement,
  getStringAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
import { defineSSR } from '@/utils/ssr-registry';

export class MyComponent extends RanElement {
  _events = new EventManager();
  _shadowDom!: ShadowRoot;
  _myEl!: HTMLElement; // store refs to queried elements

  static get observedAttributes(): string[] {
    return ['my-attr', 'sheet']; // always include 'sheet'
  }

  constructor() {
    super();
    this._shadowDom = ensureShadowRoot(this, componentCss);

    const root = ensureShadowElement(this._shadowDom, '.ran-mycomp', () =>
      Div().class('ran-mycomp').attr('part', 'mycomp').children(Slot()).build(),
    );
    this._myEl = root.querySelector<HTMLElement>('.ran-mycomp-inner')!;
  }

  // ── Accessors ──────────────────────────────────────────────────────────
  get myAttr(): string {
    return getStringAttribute(this, 'my-attr');
  }
  set myAttr(v: string) {
    setStringAttribute(this, 'my-attr', v);
  }

  get sheet(): string {
    return getStringAttribute(this, 'sheet');
  }
  set sheet(v: string) {
    setStringAttribute(this, 'sheet', v);
  }

  handlerExternalCss = (): void => {
    syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
  };

  // ── Lifecycle ──────────────────────────────────────────────────────────
  connectedCallback(): void {
    this.handlerExternalCss();
    this._events.on(this._myEl, 'click', this._handleClick);
    // add other lifecycle-bound listeners here via _events.on(...)
  }

  disconnectedCallback(): void {
    this._events.abort(); // removes ALL listeners registered via _events
  }

  attributeChangedCallback(name: string, old: string, next: string): void {
    if (old === next) return; // ALWAYS guard here
    if (name === 'my-attr') this._syncMyAttr();
    if (name === 'sheet') this.handlerExternalCss();
  }

  private _syncMyAttr(): void {
    this._myEl.textContent = this.getAttribute('my-attr') ?? '';
  }

  private _handleClick = (): void => {
    // handle click
  };
}

defineSSR('r-mycomp', MyComponent as unknown as new () => HTMLElement);
export default MyComponent;
```

**Rules:**

- Extend `RanElement` (= `HTMLElement` in browser, `HTMLElementMock` in SSR)
- Always use `ensureShadowRoot` — never call `attachShadow` directly
- Always use `ensureShadowElement` to build the Shadow DOM subtree (idempotent)
- Always guard `attributeChangedCallback` with `if (old === next) return;`
- Always include `sheet` in `observedAttributes` and wire `syncSheetAttribute`
- Always call `defineSSR` (not bare `customElements.define`)
- Export both named (`export class`) and default (`export default`)
- Use `EventManager` from `@/utils/builder` for lifecycle-bound listeners in `connectedCallback`; call `manager.abort()` in `disconnectedCallback` — never manually call `removeEventListener` per listener

### Registering in the package

After creating `components/mycomp/index.ts`:

1. **`index.ts`** — add both lines:

   ```ts
   export * from '@/components/mycomp'; // types
   import '@/components/mycomp'; // side-effect registration
   ```

2. **`vite.config.ts`** — add entry to `es.lib.entry`:

   ```ts
   mycomp: resolve(__dirname, 'components/mycomp/index.ts'),
   ```

3. **`package.json`** — add export:
   ```json
   "./mycomp": {
     "types": "./dist/index.d.ts",
     "import": "./dist/mycomp.js",
     "require": "./dist/index.cjs"
   }
   ```

---

## Utility Reference

### `utils/component.ts`

```typescript
// Create or reuse shadow root (cached via WeakMap, applies CSS)
ensureShadowRoot(host: HTMLElement, cssText?: string, options?: ShadowRootInit): ShadowRoot

// Query element from shadow root; if missing, run factory() and append
ensureShadowElement<T>(root: ShadowRoot, selector: string, factory: () => T): T

// getAttribute with fallback (null → fallback)
getStringAttribute(element: HTMLElement, name: string, fallback?: string): string

// setAttribute; removes attribute if value is null/undefined
// removeEmpty:true → also removes on falsy string ('')
setStringAttribute(element: HTMLElement, name: string, value: string | null | undefined, options?: { removeEmpty?: boolean }): void

// Sets/removes boolean attribute, optionally mirrors to aria-{aria}
setBooleanAttribute(element: HTMLElement, name: string, value: boolean, options?: { aria?: string }): void

// Calls adoptSheetText when sheet attribute changes; noop if name!='sheet' or old===new or sheet empty
syncSheetAttribute(host: HTMLElement, root: ShadowRoot, name: string, old: string | null, next: string | null): void
```

### `utils/builder/` — Fluent DOM builder

```typescript
// Factory functions (all return ElementBuilder<T>)
Div()      // → ElementBuilder<HTMLDivElement>
Span()     // → ElementBuilder<HTMLSpanElement>
Slot()     // → ElementBuilder<HTMLSlotElement>
ButtonBuilder()
InputBuilder()
Label(), Style(), Ul(), Li()
Section(), Article(), Nav(), Header(), Footer(), Main()

// ElementBuilder chainable API
.id(v)               .class(name)         .addClass(...names)
.attr(name, value)   .attrs(record)       .boolAttr(name, bool)
.part(value)         .data(key, value)    .style(key, value)
.cssVar(name, value)                      // sets --name
.aria(key, value)    .role(value)         .tabIndex(n)
.label(v)            .ariaHidden(bool)
.on(type, listener, options)              // permanent, build-time
.listen(manager, type, handler, options)  // lifecycle-managed via EventManager
.children(...items)  .text(value)         .ref(holder)
.build(): T          // returns the DOM element
```

**Example:**

```typescript
const header = Div()
  .class('ran-mycomp-header')
  .attr('part', 'header')
  .role('heading')
  .children(Div().class('ran-mycomp-title').attr('part', 'title'), Slot().attr('name', 'extra').attr('part', 'extra'))
  .build();
```

### `utils/builder/events.ts` — EventManager

Centralises lifecycle-bound listeners with `AbortController`. Import from `@/utils/builder`.

```typescript
import { EventManager } from '@/utils/builder';

// In component class:
private _events = new EventManager();

connectedCallback(): void {
  this._events
    .on(this._input, 'input', this.handleInput)
    .on(this._slot, 'slotchange', this.handleSlotChange)
    .on(this, 'click', this.handleClick, { capture: true });
}

disconnectedCallback(): void {
  this._events.abort(); // removes every listener, resets for next connect
}
```

| API                                           | Description                                                                 |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| `manager.on(target, type, handler, options?)` | Register listener scoped to manager's signal. Fluent — returns `this`.      |
| `manager.abort()`                             | Remove all listeners, reset `AbortController`. Safe to call multiple times. |
| `manager.signal`                              | The raw `AbortSignal` — pass to `addEventListener` directly when needed.    |

**When to use `.on()` vs `.listen()` vs `EventManager.on()`:**

|               | `ElementBuilder.on()`                   | `EventManager.on()` / `.listen()`          |
| ------------- | --------------------------------------- | ------------------------------------------ |
| Registered at | Build time (constructor)                | Connect time (`connectedCallback`)         |
| Removed when  | Element GC'd                            | `manager.abort()`                          |
| Use for       | Permanent internal shadow DOM listeners | Any listener needing cleanup on disconnect |

### `utils/builder/signal.ts` — Reactive primitives

Fine-grained reactivity (SwiftUI `@Observable` / Solid.js signals). Auto-tracks dependencies — no manual subscription.

```typescript
import { signal, createEffect, computed, batch } from '@/utils/builder';

// signal — reactive value, [getter, setter] tuple
const [count, setCount] = signal(0);
const [name, setName] = signal('Jane', { equals: (a, b) => a === b });

count(); // read — auto-subscribes inside createEffect / computed
setCount(1); // write — notifies dependents; skips if unchanged
setCount((n) => n + 1); // updater form

// createEffect — runs immediately, re-runs when read signals change
// Before each re-run: removes itself from signals it no longer reads (stale-subscription cleanup)
// On dispose: removes from all signals (GC-safe)
const dispose = createEffect(() => {
  el.textContent = `${count()}`;
  return () => {
    /* optional cleanup before re-run */
  };
});
dispose(); // stop tracking, remove all subscriptions

// computed — derived read-only signal
const doubled = computed(() => count() * 2);

// batch — coalesce multiple writes into one effect flush
batch(() => {
  setCount(0);
  setName('reset');
}); // effects run once, not twice
```

**SwiftUI parallel:**
| JS | SwiftUI |
|----|---------|
| `signal()` | `@State` / `@Observable` property |
| `createEffect()` | `body` (auto-tracks; cleans stale deps before re-run) |
| `computed()` | Swift computed property |
| `batch()` | Automatic mutation coalescing in same event handler |

**Page section pattern** (signal + EventManager together):

```typescript
function initSection(container: HTMLElement) {
  const [value, setValue] = signal('');
  const scope = new EventManager();

  const output = Span().build();
  const input = InputBuilder()
    .listen(scope, 'input', (e) => setValue((e.target as HTMLInputElement).value))
    .build();

  const dispose = createEffect(() => {
    output.textContent = value();
  });
  container.append(input, output);
  return () => {
    dispose();
    scope.abort();
  };
}
```

### `utils/ssr-registry.ts`

```typescript
defineSSR(tagName: string, ctor: new () => HTMLElement): void
// Browser: customElements.define(tagName, ctor)
// SSR: stores in registry Map

getSSRConstructor(tagName: string): (new () => HTMLElement) | undefined
getSSRRegistry(): ReadonlyMap<string, new () => HTMLElement>
```

`RanElement` is exported from `utils/index.ts`:

```typescript
export const RanElement = HTMLElementSSR()!;
// Returns HTMLElement in browser, HTMLElementMock in SSR
```

### `utils/theme.ts`

Light/dark only — **there are no theme packs** (they were removed; `setThemePack`/`getThemePack`/`RanThemePackName` no longer exist). The token system is Geist-based; see [docs/DESIGN.md](docs/DESIGN.md) and [docs/THEME_STYLE_SYSTEM_DESIGN.md](docs/THEME_STYLE_SYSTEM_DESIGN.md).

```typescript
type RanThemeName = 'light' | 'dark' | 'system'
type ThemeTarget = HTMLElement | Document

initTheme(target?: ThemeTarget): void       // call once on page load; restores from localStorage
setTheme(name: RanThemeName, target?: ThemeTarget): void   // 'system' tracks prefers-color-scheme
getTheme(target?: ThemeTarget): RanThemeName | ''
setThemeToken(name: string, value: string | number, target?: HTMLElement): void
clearThemeToken(name: string, target?: HTMLElement): void
setThemeTokens(tokens: Record<string, string | number | null | undefined>, target?: HTMLElement): void
```

localStorage key: `'ran-theme'`. SSR-safe (all `document`/`localStorage` access guarded).

Dark mode is a single source of truth: `theme/dark.less` redefines only the base scale via the `.ran-theme-dark()` mixin; semantic tokens reference the scale and flip automatically.

### `utils/i18n/index.ts` — framework-agnostic i18n

Same core/singleton shape as the router. Exported from the `ranui` barrel.

```typescript
const i18n = createI18n({ messages: { en, zh }, fallbackLocale: 'en', persist: true, detectNavigator: true });
useI18n()!.t('hero.title', { name }); // fallback locale → key; {param} interpolation
useI18n()!.setLocale('zh'); // persists; notifies onChange subscribers
```

`I18nCore`: `t` / `setLocale` / `getLocale` / `onChange(fn)→unsub` / `addMessages` / `getMessages` / `availableLocales` / `destroy`. SSR-safe.

### `utils/dom.ts`

```typescript
const falseList = [false, 'false', null, undefined]
isDisabled(element: Element): boolean   // getAttribute('disabled') not in falseList
```

### `utils/router/index.ts` — Client-side Router

JS routing engine. Exported from the public `ranui` barrel as `createRouter`, `useRouter`, `RouterCore`, `enableMpaViewTransitions`.

```typescript
import { createRouter, useRouter, enableMpaViewTransitions } from 'ranui';
import type { RouterConfig, RouteLocation, NavigationGuard, RouteChangeHandler, ViewTransitionMode } from 'ranui';
```

**`createRouter(config?)`** — creates and registers a global `RouterCore` singleton. Call once, before any `r-router` element connects.

```typescript
const router = createRouter({
  mode: 'history', // 'history' (default) | 'hash'
  base: '/app', // strip prefix from all paths
  routes: [
    // optional metadata; does not create DOM outlets
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'both', // false (default) | true/'spa' | 'mpa' | 'both'
});
```

**`useRouter()`** — returns the active `RouterCore` or `null`.

**`RouterCore` public API:**

| Method / Property                       | Description                                 |
| --------------------------------------- | ------------------------------------------- |
| `push(path)` → `Promise<void>`          | Navigate, add history entry                 |
| `replace(path)` → `Promise<void>`       | Navigate, replace entry                     |
| `back() / forward() / go(delta)`        | Delegate to `window.history`                |
| `beforeEach(guard)` → `() => void`      | Add navigation guard; returns unsubscribe   |
| `afterEach(handler)` → `() => void`     | Post-nav hook; returns unsubscribe          |
| `onRouteChange(handler)` → `() => void` | Subscribe to every route change             |
| `onPageSwap(handler)` → `() => void`    | MPA `pageswap` event (MPA/both mode only)   |
| `onPageReveal(handler)` → `() => void`  | MPA `pagereveal` event (MPA/both mode only) |
| `currentRoute`                          | `RouteLocation \| null`                     |
| `destroy()`                             | Remove listeners and injected CSS           |

**`_bind(component)` / `_unbind(component)`** — called by `r-router` in `connectedCallback` / `disconnectedCallback`. Registers the DOM element so `RouterCore._notify()` can call `_syncRoutes()` on it directly without an event bus.

**View Transitions:**

| `viewTransition`  | Behavior                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| `false` (default) | No transition                                                                                         |
| `true` / `'spa'`  | Wraps `syncDOM()` in `document.startViewTransition()` (Chrome 111+)                                   |
| `'mpa'`           | Injects `@view-transition { navigation: auto }` into `<head>`; adds `pageswap`/`pagereveal` listeners |
| `'both'`          | Both spa + mpa                                                                                        |

**SSR / SSG compatibility:**

- `RouterCore` constructor: safe — no browser API access in constructor body.
- `_getCurrentPath()`: returns `'/'` when `typeof window === 'undefined'`.
- `push()` / `replace()`: skip `history.pushState` / `replaceState` in SSR but still run guards and `_notify()`.
- `back()` / `forward()` / `go()`: no-op in SSR.
- `injectMpaTransitionStyle()`: guarded with `typeof document === 'undefined'`.
- `_enableMpa()`: `window.addEventListener` is guarded.
- `r-router`, `r-route`, `r-link` components: SSR-safe via `RanElement` + `defineSSR` (same as all other components). `connectedCallback` is not called during SSR serialization, so `window` access inside it is not a concern.

**`enableMpaViewTransitions()`** — standalone helper; injects the `@view-transition` style without a router. Returns a cleanup function that removes the style element.

---

## LESS Conventions

Every component's `index.less` automatically receives `@import "base.less"` via Vite preprocessor config. **Never import base.less manually.**

### CSS variable naming tiers

```less
/* Global semantic tokens (provided by theme + theme packs) */
--ran-color-primary        /* #2563eb default */
--ran-color-success
--ran-color-warning
--ran-color-danger
--ran-color-bg             /* page background */
--ran-color-bg-elevated    /* card/surface */
--ran-color-bg-muted       /* subtle surface */
--ran-color-text
--ran-color-text-secondary
--ran-color-text-disabled
--ran-color-border
--ran-color-border-secondary
--ran-color-link

--ran-radius-sm 6 | --ran-radius-md 12 | --ran-radius-lg 16 | --ran-radius-full
--ran-space-1..24          /* 4 8 12 16 24 32 40 64 96 */
--ran-shadow-elevated | --ran-shadow-menu | --ran-shadow-modal | --ran-focus-ring

/* Geist base scales (rarely used directly; semantic tokens map onto them) */
--ran-gray-100..1000 | --ran-gray-alpha-100..1000
--ran-blue/red/amber/green-100..1000 | --ran-background-100/200

/* Skin layer — only these four remain (pack-only ones were removed) */
--ran-skin-font-family
--ran-skin-border-width
--ran-skin-border-style
--ran-skin-raised-shadow

--ran-motion-duration-fast | --ran-motion-duration-base

/* Component-scoped tokens (always provide fallback) */
--ran-card-gap, 14px
--ran-card-padding, 16px
--ran-card-radius, var(--ran-radius-md)
--ran-card-background, var(--ran-color-bg-muted)
--ran-card-shadow, none
--ran-card-min-height, 0
--ran-card-title-color, var(--ran-color-text)
--ran-card-title-font-size, 16px
--ran-card-title-font-weight, 600
--ran-card-description-color, var(--ran-color-text-secondary)
--ran-card-description-font-size, 14px

/* Button example */
--ran-btn-content-background-color, var(--ran-color-primary, #1890ff)
--ran-btn-content-color, #fff
```

### LESS template for a new component

```less
:host {
  display: var(--ran-mycomp-display, block);
  box-sizing: border-box;
}

.ran-mycomp {
  padding: var(--ran-mycomp-padding, 16px);
  border-width: var(--ran-skin-border-width, 1px);
  border-style: var(--ran-skin-border-style, solid);
  border-color: var(--ran-color-border);
  border-radius: var(--ran-mycomp-radius, var(--ran-radius-md));
  background: var(--ran-mycomp-background, var(--ran-color-bg-elevated));
  box-sizing: border-box;

  &-title {
    color: var(--ran-mycomp-title-color, var(--ran-color-text));
    font-size: var(--ran-mycomp-title-font-size, 16px);

    &:empty {
      display: none;
    } /* hide empty text nodes */
  }
}
```

---

## Component Reference

### r-card

A structured content container with header, body, and footer zones.

```html
<r-card title="Card Title" description="Optional subtitle" sheet=".ran-card { background: red; }">
  <!-- Default slot: body content -->
  <p>Body content goes here</p>

  <!-- extra slot: right side of header (badges, links, actions) -->
  <span slot="extra" class="badge">tag</span>

  <!-- footer slot: shown only when this slot has assigned elements -->
  <a slot="footer" href="#docs">View notes</a>
</r-card>
```

**Attributes / Properties:**

| Name          | Type     | Default | Description                                   |
| ------------- | -------- | ------- | --------------------------------------------- |
| `title`       | `string` | `''`    | Card heading (hidden when empty via `:empty`) |
| `description` | `string` | `''`    | Subtitle below title (hidden when empty)      |
| `sheet`       | `string` | `''`    | CSS injected into shadow DOM                  |

**Header visibility:** Controlled by `:host(:not([title]):not([description])) .ran-card-header { display: none }` — header is invisible when neither attribute is set.

**Footer visibility:** Controlled by `slotchange` on `slot[name="footer"]` — footer `div` starts with `style.display='none'`, shown when `slot.assignedElements().length > 0`.

**`::part()` exports:** `card`, `header`, `title`, `description`, `extra`, `body`, `footer`

**CSS variables exposed:** `--ran-card-display`, `--ran-card-min-height`, `--ran-card-gap`, `--ran-card-padding`, `--ran-card-radius`, `--ran-card-background`, `--ran-card-shadow`, `--ran-card-title-color`, `--ran-card-title-font-size`, `--ran-card-title-font-weight`, `--ran-card-description-color`, `--ran-card-description-font-size`

**Styling override example:**

```css
/* Via CSS variables */
.my-section r-card {
  --ran-card-background: var(--surface-2);
  --ran-color-border: var(--line);
  --ran-card-min-height: 148px;
}

/* Via ::part() */
r-card::part(header) {
  border-bottom: 1px solid var(--line);
}
```

---

## Testing

### Setup

- **Runner:** Vitest + jsdom
- **Config:** `vitest.config.ts` — include `test/unit/**/*.test.ts`
- **Setup file:** `test/setup.ts` — polyfills for `localStorage`, `matchMedia`, `ResizeObserver`
- **Coverage thresholds:** statements 80%, branches 70%, functions 85%, lines 80%

```bash
npm run test:unit          # run all unit tests once
npm run test:unit:watch    # watch mode
npm run test:unit:coverage # with coverage report
```

### Test file naming

`test/unit/{component}.contract.test.ts` for component tests.
`test/unit/utils.{name}.test.ts` for utility tests.

### Canonical test structure

```typescript
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Card } from '@/components/card';
import '@/components/card'; // ensure customElements.define runs

describe('r-card contract', () => {
  beforeEach(() => {
    document.body.innerHTML = ''; // clean DOM between tests
  });

  it('renders shadow DOM structure', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    const shadow = (card as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('.ran-card')).not.toBeNull();
  });

  it('reflects attribute to internal element', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    card.setAttribute('title', 'Hello');
    expect((card as any)._titleEl.textContent).toBe('Hello');
  });

  it('skips attributeChangedCallback when old === new', () => {
    const card = document.createElement('r-card') as Card;
    document.body.appendChild(card);

    const spy = vi.spyOn(card as any, '_syncTitle');
    card.attributeChangedCallback('title', 'same', 'same');
    expect(spy).not.toHaveBeenCalled();
  });

  it('injects external CSS via sheet attribute (fallback path)', () => {
    const origCSS = window.CSSStyleSheet;
    try {
      class MockSheet {
        replaceSync() {
          throw new Error('force fallback');
        }
      }
      (window as any).CSSStyleSheet = MockSheet;

      const card = document.createElement('r-card') as Card;
      document.body.appendChild(card);
      card.setAttribute('sheet', '.ran-card { color: red; }');

      const shadow = (card as any)._shadowDom as ShadowRoot;
      expect(shadow.innerHTML).toContain('.ran-card { color: red; }');
    } finally {
      window.CSSStyleSheet = origCSS;
    }
  });
});
```

### Key patterns

| Task                       | How                                                                      |
| -------------------------- | ------------------------------------------------------------------------ |
| Access shadow DOM          | `(el as any)._shadowDom as ShadowRoot`                                   |
| Access private field       | `(el as any)._fieldName`                                                 |
| Spy on private method      | `vi.spyOn(el as any, '_methodName')`                                     |
| Simulate async slot update | `await new Promise(r => setTimeout(r, 50))`                              |
| Test sheet CSS injection   | Mock `CSSStyleSheet.replaceSync` to throw, then check `shadow.innerHTML` |
| Clean DOM between tests    | `document.body.innerHTML = ''` in `beforeEach`                           |

### jsdom limitations

- `slot.assignedElements()` always returns `[]` — cannot test slotchange-driven display logic end-to-end; test the initial `style.display` state instead
- `window.getComputedStyle` returns empty for shadow DOM CSS rules — test attribute and style values directly, not computed CSS
- `adoptedStyleSheets` is frozen — sheet injection tests require the mock pattern above

### Testing philosophy — why unit coverage alone is not enough

High unit-test coverage guarantees each component's **own API** is correct, but it does not guarantee the **assembled page** is correct. The gap lives at the integration layer.

| Layer                               | What it catches                                                                                             | What it misses                                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Unit (`test/unit/`)                 | Attribute reflection, event dispatch, shadow DOM structure, CSS injection                                   | Layout interactions between components, slot projection into host, height/width in real parent context |
| Integration (`test/integration/`)   | Component-in-component layout, slot content rendering, CSS variable inheritance across component boundaries | Full user flows                                                                                        |
| Visual regression (screenshot diff) | Any unintended pixel change after a refactor                                                                | —                                                                                                      |

**Rule:** every time a bug is found on the demo page or in a composition scenario, the fix must be accompanied by an integration test that would have caught it. Do not rely on raising the unit coverage number to prevent that class of bug.

### Integration test patterns

File naming: `test/integration/{scenario}.test.ts`

```typescript
import { describe, expect, it, beforeEach } from 'vitest';
import '@/components/card';
import '@/components/progress';
import '@/components/checkbox';
import '@/components/select/option';

describe('component composition', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // ── Layout: percentage-height component inside a card ────────────────
  it('r-progress inside r-card has bounded height', () => {
    const card = document.createElement('r-card');
    const progress = document.createElement('r-progress');
    progress.setAttribute('percent', '72');
    card.appendChild(progress);
    document.body.appendChild(card);

    // host height must be a fixed token value, not unbounded
    const hostHeight = (progress as HTMLElement).style.getPropertyValue('--ran-progress-height');
    // or verify offsetHeight is not larger than a sane threshold
    expect(progress.clientHeight).toBeLessThan(50);
  });

  // ── Slot projection: label text inside r-checkbox ────────────────────
  it('r-checkbox projects label text via slot', () => {
    const cb = document.createElement('r-checkbox') as HTMLElement;
    cb.textContent = 'Accept terms';
    document.body.appendChild(cb);

    // shadow DOM must contain a slot element so light DOM is projected
    const shadow = (cb as any)._shadowDom as ShadowRoot;
    expect(shadow.querySelector('slot')).not.toBeNull();
  });

  // ── Custom element constructor rule ──────────────────────────────────
  it('document.createElement does not throw for any registered element', () => {
    // If a constructor calls this.setAttribute(), Chrome throws NotSupportedError.
    const tags = [
      'r-button',
      'r-input',
      'r-select',
      'r-option',
      'r-checkbox',
      'r-progress',
      'r-card',
      'r-tabs',
      'r-tab',
    ];
    for (const tag of tags) {
      expect(() => document.createElement(tag)).not.toThrow();
    }
  });
});
```

### Three integration bugs and their test signatures

These bugs slipped through unit tests. Each has a regression test pattern to prevent recurrence.

| Bug                                   | Root cause                                                                                                    | Regression test signal                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `r-progress` height 126px inside card | `:host` had no height; `.ran-progress { height: 100% }` resolved to container height                          | `progress.clientHeight < 50` when placed inside `r-card`         |
| `r-checkbox` label invisible          | Shadow DOM had no `<slot>`, so light DOM children were not projected                                          | `shadow.querySelector('slot') !== null`                          |
| `r-option` `NotSupportedError` (×11)  | Constructor called `this.setAttribute('class', …)` — forbidden by Custom Elements spec during `createElement` | `expect(() => document.createElement('r-option')).not.toThrow()` |

---

## Build & Config

### Path aliases (vite + vitest)

```
@/components → components/
@/utils      → utils/
@/assets     → assets/
@/public     → public/
```

### LESS auto-import

`base.less` is injected by Vite into every LESS file:

```typescript
// vite.config.ts
less: {
  additionalData: `@import "${resolve(__dirname, 'base.less')}";`;
}
```

### ES build output

Each component gets its own `dist/{name}.js` ES module. The barrel `dist/index.js` includes all components. CJS + IIFE bundle at `dist/index.cjs`.

---

## Common Pitfalls

| Pitfall                                                                                                                                                                                              | Fix                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attributeChangedCallback` fires when attribute set to same value                                                                                                                                    | Add `if (old === next) return;` as first line                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Shadow DOM re-attached on reconnect                                                                                                                                                                  | Use `ensureShadowRoot` (WeakMap cache), never bare `attachShadow`                                                                                                                                                                                                                                                                                                                                                                                                                |
| Styles not applied in SSR                                                                                                                                                                            | Use `RanElement` base class and `defineSSR`                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `adoptedStyleSheets` frozen in jsdom                                                                                                                                                                 | `syncSheetAttribute` / `adoptSheetText` already handles `<style>` fallback                                                                                                                                                                                                                                                                                                                                                                                                       |
| Event listeners leak on disconnect                                                                                                                                                                   | Use `EventManager` — call `manager.abort()` in `disconnectedCallback`; never track individual `removeEventListener` calls                                                                                                                                                                                                                                                                                                                                                        |
| `import '@/components/mycomp'` not in index.ts                                                                                                                                                       | Components won't register for users who `import 'ranui'`                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Missing `card` entry in vite.config.ts                                                                                                                                                               | `dist/card.js` won't be built; per-component imports break                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Factory function wrapper pattern (`function Custom() { defineSSR(...); return Class; } export default Custom()`)                                                                                     | Anti-pattern — `defineSSR` handles registration; use `defineSSR(...); export default ClassName;` directly                                                                                                                                                                                                                                                                                                                                                                        |
| `border-color: var(--token)` without hex fallback                                                                                                                                                    | Add hex fallback: `var(--ran-color-border, #d9d9d9)` so borders show without theme tokens                                                                                                                                                                                                                                                                                                                                                                                        |
| Shadow root `mode: 'open'`                                                                                                                                                                           | Always use default closed mode via `ensureShadowRoot(this, css)` — never pass `{ mode: 'open' }`                                                                                                                                                                                                                                                                                                                                                                                 |
| `this.setAttribute(…)` called in constructor                                                                                                                                                         | Forbidden by Custom Elements spec — Chrome throws `NotSupportedError: The result must not have attributes` on `document.createElement`. Move all `this.setAttribute` / `this.classList` calls to `connectedCallback`                                                                                                                                                                                                                                                             |
| Component `:host` has no height + inner div uses `height: 100%`                                                                                                                                      | `100%` resolves to the parent container height when `:host` has no explicit size, expanding the component unexpectedly. Always set `display: block; height: var(--token, <default>)` on `:host` for height-aware components (e.g. `r-progress`)                                                                                                                                                                                                                                  |
| Shadow DOM has no `<slot>` for label/child content                                                                                                                                                   | Light DOM children are silently not rendered; the component appears broken when used with text content. Always add a `Slot()` to the shadow DOM when the component is designed to accept slotted content                                                                                                                                                                                                                                                                         |
| Accessing `window` / `document` in `RouterCore` utility code                                                                                                                                         | `RouterCore` is imported at the module level and can be instantiated in SSR. All `window.*` / `document.*` calls must be guarded with `typeof window !== 'undefined'` / `typeof document !== 'undefined'`. The existing utility guards are in `_getCurrentPath`, `_navigate`, `back/forward/go`, `injectMpaTransitionStyle`, and `_enableMpa/_disableMpa`. Add the same guard to any new code that touches browser globals.                                                      |
| Calling `createRouter()` after `r-router` elements have already connected                                                                                                                            | `r-router` calls `useRouter()?._bind(this)` in `connectedCallback`. If `createRouter` is called after the component is already in the DOM, the component will not be registered. Always call `createRouter()` before mounting `r-router`, or trigger reconnection manually.                                                                                                                                                                                                      |
| `viewTransition: 'mpa'` with SPA navigation                                                                                                                                                          | MPA mode only injects `@view-transition { navigation: auto }` for full-page navigations. `push()` / `replace()` will NOT trigger this CSS-based transition — they bypass the browser's navigation pipeline. Use `'both'` when you need transitions for both SPA navigation and full-page links.                                                                                                                                                                                  |
| Hard-coded color that should follow the theme (e.g. `rgba(0,0,0,.06)`, `#e6f7ff`, black canvas text)                                                                                                 | Breaks in dark mode. Point the fallback at a token that flips: `var(--ran-color-text, …)`, `var(--ran-gray-alpha-100, …)`, `var(--ran-blue-100, …)`. For canvas/JS-drawn colors, read the CSS var via `getComputedStyle(this).getPropertyValue('--ran-color-text')`. See DESIGN.md §1.                                                                                                                                                                                           |
| Text not vertically centered in a pill/button                                                                                                                                                        | Don't rely on `height: 100%` against an auto-height host (it collapses to `auto`) plus an inherited `line-height`. Give the host a fixed height and the inner element `display:flex; align-items:center; line-height:1; box-sizing:border-box`.                                                                                                                                                                                                                                  |
| Icon-only control (icon link/button) with no text                                                                                                                                                    | Add an `aria-label` — an `aria-hidden` icon alone has no accessible name. Watch responsive rules that hide a text label on mobile (the control becomes icon-only).                                                                                                                                                                                                                                                                                                               |
| Animations/transitions without a reduced-motion escape                                                                                                                                               | Add `@media (prefers-reduced-motion: reduce)` that zeroes transition/animation durations, disables smooth scroll, and removes hover transforms. DESIGN.md §5.                                                                                                                                                                                                                                                                                                                    |
| Signalling state with color alone (red/green only)                                                                                                                                                   | Pair color with an icon or text (e.g. ✓/✕ labels, an error message + icon). DESIGN.md §7.                                                                                                                                                                                                                                                                                                                                                                                        |
| Hiding navigation/affordances on mobile to save space                                                                                                                                                | Don't remove the only way to do something. Reflow it (e.g. drop nav to its own row) instead of `display:none`.                                                                                                                                                                                                                                                                                                                                                                   |
| Styling an `r-link` host as a button/card                                                                                                                                                            | The clickable `<a>` lives in the link's (closed) shadow. Put the surface (bg/border/radius) on the host and inject the `<a>` box model (`display`, `padding`, `width/height`, `line-height`) via the `sheet` attribute so the whole area is clickable and centered.                                                                                                                                                                                                              |
| Demo deploy target                                                                                                                                                                                   | The demo routes with `r-router` in **history mode**; static hosts need an SPA fallback. Cloudflare Pages: `demo/public/_redirects` → `/* /index.html 200`. (GitHub Pages can't rewrite → would need hash mode.)                                                                                                                                                                                                                                                                  |
| Floating overlay looks flat / has no visible shadow                                                                                                                                                  | Elevation is a **role**: an overlay (dropdown, select, popover, toast/message) must use `--ran-shadow-menu`; a dialog uses `--ran-shadow-modal`; only in-flow surfaces (card/section) use `--ran-shadow-elevated`. Never let an overlay fall back to the card tier, and make sure each tier is actually _perceptible_ (an invisible shadow is a failed shadow). See DESIGN.md §4.                                                                                                |
| Content moved out of the shadow root (e.g. `r-popover` / `r-select` dropdowns portal panel content into `document.body`) loses **all** shadow-scoped CSS — widths/heights collapse, gradients vanish | Don't rely on the host's shadow stylesheet for portaled content. Ship the panel's styles in a `<style>` injected into the portaled subtree (uniquely-namespaced selectors + theme tokens, so it travels and stays dark-safe because tokens inherit from `:root` in light DOM), or inline the critical layout. Prefer percent-based positioning so it doesn't depend on measuring the relocated element. See `components/colorpicker/panel.less`.                                 |
| A component renders `<r-icon name="…">` for its own chrome but never registers that icon                                                                                                             | Register it in the component module (`registerIcon('…', svg)`) so the component is self-contained; never depend on the consumer having registered your internal icons. Use a theme token (not a hardcoded hex) for the icon `color` so it adapts to dark mode. See r-select's `arrow-down`.                                                                                                                                                                                      |
| A portaled overlay (dropdown/popover/select) renders behind page content                                                                                                                             | The element the consumer positions and portals to `<body>` must carry the overlay z-index itself — a z-index on an inner shadow element is trapped in the host's stacking context. Use the ladder tokens (`--ran-z-modal: 1000` < `--ran-z-dropdown: 1100` < `--ran-z-message: 1200`; dropdowns sit above modals so in-modal selects stay visible, toasts on top) and expose a `--ran-[component]-z-index` override so consumers needn't `!important`. See `r-dropdown` `:host`. |
| A floating overlay open while the page scrolls drifts away from its trigger                                                                                                                          | A body-portaled overlay positioned once on open uses document coords; in a sticky/scroll context the trigger and overlay desync. Re-run placement on `scroll` (capture, to catch nested scroll containers) + `resize` while open, and remove the listeners on close/disconnect. See r-select's `_attachReposition`.                                                                                                                                                              |
