# RanUI Utilities

This directory contains the shared utilities used by RanUI components: Shadow DOM setup, fluent DOM builders, SSR registration and serialization, theme helpers, style adoption, and small DOM helpers.

## Component Utilities (`component.ts`)

Use these helpers in every component constructor and attribute sync path.

```ts
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setBooleanAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
```

| API                                                        | Description                                                                                             |
| :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| `ensureShadowRoot(host, cssText?, options?)`               | Create or reuse a cached Shadow Root and apply component CSS. Prefer this over direct `attachShadow()`. |
| `ensureShadowElement(root, selector, factory)`             | Query an existing element from the Shadow Root, or append the factory result if it is missing.          |
| `getStringAttribute(element, name, fallback?)`             | Read an attribute with a string fallback.                                                               |
| `setStringAttribute(element, name, value, options?)`       | Set a string attribute; `removeEmpty: true` removes empty values.                                       |
| `setBooleanAttribute(element, name, value, options?)`      | Set or remove a boolean attribute, optionally mirroring to `aria-*`.                                    |
| `syncSheetAttribute(host, root, name, oldValue, newValue)` | Apply the `sheet` attribute through `adoptSheetText` when it changes.                                   |

Component conventions:

- Always include `sheet` in `observedAttributes`.
- Always call `syncSheetAttribute` from `connectedCallback` and from the `sheet` branch of `attributeChangedCallback`.
- Always guard `attributeChangedCallback` with `if (old === next) return;`.

## Element Builder (`builder/`)

`ElementBuilder` provides a fluent API for constructing DOM elements. It is SSR-safe and keeps component constructors concise.

The style is intentionally close to SwiftUI's "describe the view from state" model, but it stays on top of platform DOM APIs. Factory helpers such as `Div()` and `ButtonBuilder()` describe the element tree, modifier-like methods attach attributes, styles, text, children, refs, and events, and `build()` returns the real `HTMLElement` or an SSR mock.

### Basic Usage

```ts
import { ButtonBuilder, Div, Slot, Span } from '@/utils/builder';

const card = Div()
  .class('card')
  .part('card')
  .children(
    Span().text('Hello World'),
    ButtonBuilder()
      .label('Click Me')
      .on('click', () => console.log('Clicked')),
    Slot().attr('name', 'extra'),
  )
  .build();
```

### Declarative UI Shape

Builder chains are the preferred way to describe static DOM structure:

```ts
const toolbar = Div()
  .class('toolbar')
  .children(
    ButtonBuilder().part('button').text('Save').on('click', handleSave),
    ButtonBuilder().part('button').text('Cancel').on('click', handleCancel),
  )
  .build();
```

Use `createEffect` when state needs to update an existing node after construction:

```ts
import { ButtonBuilder, createEffect, Div, signal, Span } from '@/utils/builder';

const [count, setCount] = signal(0);
const label = Span().build();

createEffect(() => {
  label.textContent = `Count: ${count()}`;
});

const view = Div()
  .children(
    label,
    ButtonBuilder()
      .text('+')
      .on('click', () => setCount((n) => n + 1)),
  )
  .build();
```

### Factories

Factory helpers all return `ElementBuilder<T>`:

```ts
Div();
Span();
Slot();
ButtonBuilder();
InputBuilder();
Label();
Style();
Ul();
Li();
Section();
Article();
Nav();
Header();
Footer();
Main();
```

### API Reference

| Method                                                 | Description                                                                                                                               |
| :----------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `id(value)`                                            | Set the element ID.                                                                                                                       |
| `class(value)`                                         | Set the full class string.                                                                                                                |
| `addClass(...names)` / `removeClass(...names)`         | Add or remove classes incrementally.                                                                                                      |
| `attr(name, value)` / `attrs(record)`                  | Set attributes. `attrs` skips `null` and `undefined` values.                                                                              |
| `boolAttr(name, value, enabledValue?)`                 | Toggle a boolean attribute.                                                                                                               |
| `part(value)`                                          | Set the `part` attribute for `::part()` styling.                                                                                          |
| `data(key, value)`                                     | Set a `data-*` attribute.                                                                                                                 |
| `style(key, value)` / `style(map)`                     | Set inline styles.                                                                                                                        |
| `cssVar(name, value)`                                  | Set a CSS custom property; `--` is added when omitted.                                                                                    |
| `aria(key, value)` / `role(value)`                     | Set accessibility attributes.                                                                                                             |
| `tabIndex(value)`                                      | Set `tabindex`.                                                                                                                           |
| `label(value)` / `labelledBy(id)` / `describedBy(id)`  | Set common ARIA naming attributes.                                                                                                        |
| `ariaHidden(hidden?)`                                  | Set `aria-hidden`.                                                                                                                        |
| `on(type, listener, options?)`                         | Attach a permanent build-time listener — tied to the element's lifetime. Use in the constructor for internal shadow DOM elements.         |
| `listen(manager, type, handler, options?)`             | Register a lifecycle-managed listener into an `EventManager`. Use in `connectedCallback` when the listener must be removed on disconnect. |
| `delegate(manager, selector, type, handler, options?)` | Register a lifecycle-managed delegated listener on this element. The handler receives the event and the matched descendant.               |
| `children(...items)` / `replaceChildren(...items)`     | Append or replace child builders, elements, strings, arrays, or empty values.                                                             |
| `text(value)`                                          | Set text content.                                                                                                                         |
| `ref(holder)`                                          | Capture the built element in a `createRef()` holder.                                                                                      |
| `shadow(options?)`                                     | Attach a Shadow Root and return a `ShadowBuilder`.                                                                                        |
| `build()`                                              | Return the `HTMLElement` or SSR mock.                                                                                                     |
| `serialize()`                                          | Serialize the element for SSR or browser diagnostics.                                                                                     |

## Event Management (`builder/events.ts`)

`EventManager` centralises lifecycle-bound event listeners using `AbortController`. Call `abort()` once in `disconnectedCallback` instead of tracking every `removeEventListener` call individually.

```ts
import { EventManager } from '@/utils/builder';
```

### Usage in a Web Component

```ts
class MyComponent extends RanElement {
  private _events = new EventManager();

  connectedCallback(): void {
    this._events
      .on(this._input, 'input', this.handleInput)
      .on(this._slot, 'slotchange', this.handleSlotChange)
      .on(this, 'click', this.handleClick, { capture: true });
  }

  disconnectedCallback(): void {
    this._events.abort(); // removes every listener registered above
  }
}
```

You can also wire into an `EventManager` directly from a builder chain (useful when building elements inside `connectedCallback`):

```ts
connectedCallback(): void {
  this._events = new EventManager();
  this._icon = View('r-icon')
    .class('ran-icon')
    .listen(this._events, 'click', this.handleIconClick)
    .build();
}
```

For dynamic lists or action menus, use `delegate()` so one listener handles matching descendants:

```ts
const actions = Div()
  .class('actions')
  .children(
    ButtonBuilder().attr('data-action', 'edit').text('Edit'),
    ButtonBuilder().attr('data-action', 'delete').text('Delete'),
  )
  .delegate(this._events, '[data-action]', 'click', (_event, target) => {
    const action = target.getAttribute('data-action');
    this.handleAction(action);
  })
  .build();
```

### API Reference

| API                                                           | Description                                                                                                                            |
| :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------- |
| `new EventManager()`                                          | Create a fresh manager backed by an internal `AbortController`.                                                                        |
| `manager.on(target, type, handler, options?)`                 | Register a listener on `target`; automatically scoped to the manager's signal. Fluent — returns `this`.                                |
| `manager.delegate(parent, selector, type, handler, options?)` | Register one listener on `parent` and invoke `handler` when the event target or one of its ancestors matches `selector`.               |
| `manager.abort()`                                             | Remove all registered listeners and reset the internal `AbortController` so the manager can be reused on the next `connectedCallback`. |
| `manager.signal`                                              | The underlying `AbortSignal` — pass directly to `addEventListener` when bypassing the fluent API.                                      |

### When to use `.on()` vs `.listen()`

|                   | `ElementBuilder.on()`                   | `EventManager.on()` / `.listen()`                  |
| ----------------- | --------------------------------------- | -------------------------------------------------- |
| **Registered at** | Build time (constructor)                | Connect time (`connectedCallback`)                 |
| **Removed when**  | Element is garbage-collected            | `manager.abort()` is called                        |
| **Use for**       | Permanent internal shadow DOM listeners | Any listener that must be cleaned up on disconnect |

## Reactive Primitives (`builder/signal.ts`)

Fine-grained reactivity inspired by SwiftUI's `@Observable` and Solid.js signals. Reading a signal inside `createEffect` or `computed` automatically establishes a dependency — no manual subscription needed. See [`docs/BUILDER.md`](../docs/BUILDER.md) for the full guide (ownership, reactive `ElementBuilder` bindings, MPA/SPA teardown).

```ts
import {
  signal,
  createEffect,
  computed,
  batch,
  untrack,
  createRoot,
  onCleanup,
  getOwner,
  runWithOwner,
} from '@/utils/builder';
```

**Core model — same idea as SwiftUI's `View = f(State)`, Solid.js-style ownership and lazy memos:**

```
signal()       ≈  @State / @Observable property
createEffect() ≈  SwiftUI body  (auto-tracks reads; cleans stale deps before each re-run)
computed()     ≈  Swift computed property  (derived, LAZY + value-memoized)
batch()        ≈  SwiftUI's automatic mutation coalescing  (one flush per event handler)
createRoot()   ≈  a disposable scope that owns everything created inside it
```

### Usage

```ts
const [count, setCount] = signal(0);
const doubled = computed(() => count() * 2);

// Build DOM once
const countEl = Span().build();
const doubleEl = Span().build();

// Effects drive updates — re-run automatically when signals change
const disposeA = createEffect(() => {
  countEl.textContent = `${count()}`;
});
const disposeB = createEffect(() => {
  doubleEl.textContent = `${doubled()}`;
});

// Tear down when section is removed
return () => {
  disposeA();
  disposeB();
};
```

### API Reference

| API                                      | Description                                                                                                                                                                                                                                                                                                                               |
| :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `signal(initial, options?)`              | Create a reactive value. Returns `[getter, setter]`. Reading the getter inside an effect auto-tracks the dependency.                                                                                                                                                                                                                      |
| `getter()`                               | Read the current value. Auto-subscribes the running effect.                                                                                                                                                                                                                                                                               |
| `setter(value)`                          | Write a new value; notifies all dependent effects. Skips update when value is unchanged (`Object.is`).                                                                                                                                                                                                                                    |
| `setter(fn)`                             | Updater form: receives previous value, returns next.                                                                                                                                                                                                                                                                                      |
| `createEffect(fn)`                       | Run `fn` immediately; re-run whenever any signal read inside it changes. Before each re-run, removes itself from signals it no longer reads (stale-subscription cleanup). Returns a `dispose` function that stops tracking and removes all subscriptions for GC. `fn` may return a cleanup called before each re-run and on dispose.      |
| `computed(fn, options?)`                 | Derived read-only signal — **lazy + value-memoized**. Recomputes only when read after a dependency changed (an unread memo never computes) and re-notifies its observers only when the derived value actually changes (`Object.is`, override via `options.equals`) — so effects behind a value-stable memo stay asleep. Returns a getter. |
| `batch(fn)`                              | Run multiple signal writes as one atomic update. All dependent effects are deferred and flushed once (deduplicated) after `fn` returns. Nested `batch()` calls are absorbed by the outermost one.                                                                                                                                         |
| `untrack(fn)`                            | Read signals inside `fn` without subscribing the current computation to them.                                                                                                                                                                                                                                                             |
| `createRoot(fn)`                         | Create a disposable reactive scope. `fn` receives a `dispose`; effects/memos/bindings created inside are owned by the scope and torn down (with their `onCleanup`s) when `dispose` runs. One per page/route in an MPA/SPA.                                                                                                                |
| `onCleanup(fn)`                          | Register a cleanup on the current scope; runs when the scope re-runs or is disposed.                                                                                                                                                                                                                                                      |
| `getOwner()` / `runWithOwner(owner, fn)` | Capture the current owner scope and later run `fn` under it — for restoring reactive scope across async boundaries (e.g. a router).                                                                                                                                                                                                       |

### `signal` options

| Option   | Type                            | Description                                                                   |
| :------- | :------------------------------ | :---------------------------------------------------------------------------- |
| `equals` | `(prev: T, next: T) => boolean` | Custom equality check. Return `true` to skip update. Defaults to `Object.is`. |

### Page development pattern

```ts
import { signal, createEffect, computed, batch, EventManager, Div, ButtonBuilder } from '@/utils/builder';

function initCounter(container: HTMLElement) {
  const [count, setCount] = signal(0);
  const [step, setStep] = signal(1);
  const doubled = computed(() => count() * 2);
  const scope = new EventManager();

  const label = Div().class('label').build();
  const view = Div()
    .class('counter')
    .children(
      label,
      ButtonBuilder()
        .text('+')
        .listen(scope, 'click', () => setCount((n) => n + step())),
      ButtonBuilder()
        .text('reset')
        .listen(scope, 'click', () =>
          // Two writes → one effect flush
          batch(() => {
            setCount(0);
            setStep(1);
          }),
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
  };
}
```

## SSR & Declarative Shadow DOM

RanUI supports SSR through `HTMLElementMock`, `defineSSR`, and Declarative Shadow DOM serialization.

### `ssr-registry.ts`

```ts
import { defineSSR, getSSRConstructor, getSSRRegistry } from '@/utils/ssr-registry';

defineSSR('r-button', Button as unknown as new () => HTMLElement);
```

| API                          | Description                                                                                 |
| :--------------------------- | :------------------------------------------------------------------------------------------ |
| `defineSSR(tagName, ctor)`   | Browser: defines a custom element when needed. SSR: stores the constructor in the registry. |
| `getSSRConstructor(tagName)` | Return a registered SSR constructor.                                                        |
| `getSSRRegistry()`           | Return the SSR constructor map.                                                             |

### `ssr.ts`

Renders a RanUI component instance to an HTML string including its shadow tree.

```ts
import { Button } from '@/components/button';
import { renderToString } from '@/utils/ssr';

const btn = new Button();
btn.setAttribute('effect', 'true');
const html = renderToString(btn);
// Output: <r-button effect="true"><template shadowrootmode="closed">...</template></r-button>
```

Components should use `ensureShadowRoot` in the constructor so browser initialization can reuse an existing Declarative Shadow DOM root when one is present.

`RanElement` is exported from `utils/index.ts`:

```ts
export const RanElement = HTMLElementSSR()!;
```

It resolves to the native `HTMLElement` in the browser and `HTMLElementMock` in SSR.

## Theme Utilities (`theme.ts`)

```ts
import { clearThemeToken, getTheme, initTheme, setTheme, setThemeToken, setThemeTokens } from '@/utils/theme';
```

The same APIs are the public `ranui/theme` entry, so consumers can
`import { initTheme } from 'ranui/theme'` without registering any components.
There are no theme packs — the token system is Geist-based, `light`/`dark` only.

| API                                   | Description                                                    |
| :------------------------------------ | :------------------------------------------------------------- |
| `initTheme(target?)`                  | Restore the theme from localStorage.                           |
| `setTheme(name, target?)`             | Set `light`, `dark`, or `system`.                              |
| `getTheme(target?)`                   | Read the current theme; returns `system` when stored that way. |
| `setThemeToken(name, value, target?)` | Set one CSS token on the target element.                       |
| `clearThemeToken(name, target?)`      | Remove one CSS token.                                          |
| `setThemeTokens(tokens, target?)`     | Set or clear multiple CSS tokens.                              |

Theme names:

```ts
type RanThemeName = 'light' | 'dark' | 'system';
```

localStorage key:

```ts
'ran-theme';
```

## i18n (`i18n/index.ts`)

Framework-agnostic i18n engine, same core/singleton shape as the router. Also
exposed as the public `ranui/i18n` entry (registers no components).

```ts
import { createI18n, useI18n } from 'ranui/i18n';
import type { I18nConfig, MessageDict, TranslateParams } from 'ranui/i18n';

createI18n({ messages: { en, zh }, fallbackLocale: 'en', persist: true, detectNavigator: true });
useI18n()!.t('hero.title', { name }); // fallback locale → key; {param} interpolation
useI18n()!.setLocale('zh'); // persists; notifies onChange subscribers
```

| API                      | Description                                                    |
| :----------------------- | :------------------------------------------------------------- |
| `t(key, params?)`        | Translate; falls back to fallback locale, then the key itself. |
| `setLocale(locale)`      | Switch locale; persists and notifies subscribers.              |
| `getLocale()`            | Read the active locale.                                        |
| `onChange(fn)`           | Subscribe to locale changes; returns an unsubscribe function.  |
| `addMessages(locale, m)` | Merge more messages into a locale.                             |
| `getMessages(locale?)`   | Read the message dictionary.                                   |
| `availableLocales`       | List the registered locales.                                   |
| `destroy()`              | Tear down subscriptions.                                       |

localStorage key: `'ran-locale'`. The core is SSR-safe.

## Router (`router/index.ts`)

Client-side routing engine. Provides history management, navigation guards, route-change subscriptions, and View Transitions support for both SPA and MPA scenarios.

```ts
import { createRouter, useRouter, enableMpaViewTransitions } from 'ranui';
import type { RouterConfig, RouteLocation, NavigationGuard } from 'ranui';
```

### `createRouter(config?)`

Creates and registers a global `RouterCore` singleton. Call once at app startup.

```ts
const router = createRouter({
  mode: 'history', // 'history' (default) | 'hash'
  base: '/app', // strip prefix from all paths
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both' | false
});
```

### `useRouter()`

Returns the active `RouterCore`, or `null` if `createRouter` has not been called.

```ts
const router = useRouter();
router?.push('/about');
```

### `RouterCore` API

| API                      | Type / Returns          | Description                                         |
| :----------------------- | :---------------------- | :-------------------------------------------------- |
| `push(path)`             | `Promise<void>`         | Navigate and add a history entry                    |
| `replace(path)`          | `Promise<void>`         | Navigate and replace the current entry              |
| `back()`                 | `void`                  | `history.back()`                                    |
| `forward()`              | `void`                  | `history.forward()`                                 |
| `go(delta)`              | `void`                  | `history.go(delta)`                                 |
| `beforeEach(guard)`      | `() => void`            | Register navigation guard; returns unsubscribe      |
| `afterEach(handler)`     | `() => void`            | Post-navigation hook; returns unsubscribe           |
| `onRouteChange(handler)` | `() => void`            | Subscribe to route changes; returns unsubscribe     |
| `onPageSwap(handler)`    | `() => void`            | Cross-document `pageswap` event (MPA mode only)     |
| `onPageReveal(handler)`  | `() => void`            | Cross-document `pagereveal` event (MPA mode only)   |
| `currentRoute`           | `RouteLocation \| null` | Current route — `{ path, params, query, fullPath }` |
| `destroy()`              | `void`                  | Remove all listeners and injected CSS               |

### Navigation guards

Guards run in registration order before navigation commits. Call `next()` to allow, `next(false)` to cancel, or `next('/path')` to redirect.

```ts
const unsubscribe = router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) next('/login');
  else next();
});
unsubscribe(); // remove when no longer needed
```

### View Transitions

| `viewTransition` value | Effect                                                                                                                              |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `'spa'` / `true`       | Wraps same-document DOM updates in `document.startViewTransition()` (Chrome 111+)                                                   |
| `'mpa'`                | Injects `@view-transition { navigation: auto }` for cross-document transitions (Chrome 126+); exposes `onPageSwap` / `onPageReveal` |
| `'both'`               | Both of the above                                                                                                                   |
| `false` (default)      | No transitions                                                                                                                      |

Gracefully degrades when the API is not supported.

### `enableMpaViewTransitions()`

Standalone helper — injects `@view-transition { navigation: auto }` once without needing a router instance. Returns a cleanup function.

```ts
import { enableMpaViewTransitions } from 'ranui';

const cleanup = enableMpaViewTransitions();
// cleanup() removes the <style> element if needed
```

## Style Utilities (`style.ts`)

| API                             | Description                                                                    |
| :------------------------------ | :----------------------------------------------------------------------------- |
| `adoptStyles(root, cssText)`    | Adopt component CSS into a Shadow Root with constructable stylesheet fallback. |
| `adoptSheetText(root, cssText)` | Adopt raw CSS text supplied by the `sheet` attribute.                          |

## DOM Utilities (`dom.ts`)

```ts
import { falseList, isDisabled } from '@/utils/dom';
```

| API                   | Description                                                                                   |
| :-------------------- | :-------------------------------------------------------------------------------------------- |
| `falseList`           | Values treated as false for boolean-like attributes: `false`, `'false'`, `null`, `undefined`. |
| `isDisabled(element)` | Read `disabled` using RanUI's boolean-like attribute semantics.                               |
