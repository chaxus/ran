---
name: ranui
description: Use when building UI with the ranui web-component library (elements like `<r-button>`, `<r-modal>`, `<r-select>`, `<r-input>`, `<r-message>`) or its fluent DOM builder (`ranui/builder` — Div/View/Span/signal/createEffect/EventManager). Covers the import map, the full element inventory, conventions, accessibility, and where the authoritative API reference lives.
---

# ranui — web component library

Framework-agnostic Web Components (Custom Elements + Shadow DOM). Works in React,
Vue, Svelte, Solid, or plain JS. Each element is `<r-*>` and is used like native HTML.
Styling crosses the shadow boundary via **CSS variables**, **`::part()`**, or the
per-instance **`sheet`** attribute (escape hatch).

## Authoritative reference (read these for exact APIs — don't guess)

When `ranui` is installed in a project, its docs ship inside the package:

- **`node_modules/ranui/docs/COMPONENTS.md`** — generated per-element API: every
  element's attributes, typed properties, events (with `detail` shape), slots, and
  `::part()` names. This is the source of truth for props/events. Regenerated in the
  source repo via `npm run doc:api`.
- **`node_modules/ranui/docs/DESIGN.md`** — design system rules (color states,
  spacing, motion, accessibility §7, pre-ship checklist).
- **`node_modules/ranui/docs/style-tokens-public.md`** — the CSS variable (theming
  token) catalog.

In the source repo (`packages/ranui`) there is also a deep `CLAUDE.md` (architecture,
builder internals, LESS conventions, testing) — not shipped in the npm package.

## Import map

Per-component, tree-shakeable side-effect imports register the custom element:

```ts
import 'ranui/button';   // then use <r-button>
import 'ranui/modal';
import 'ranui/select';
import 'ranui/input';
import 'ranui/message';  // also exposes an imperative message API
import 'ranui/checkbox';
```

Available element subpaths: `button icon image input message skeleton tab tabpane
radar modal select progress player popover dropdown content loading colorpicker math
checkbox card router route link`.

The fluent DOM builder + reactivity (no custom-element registration):

```ts
import { Div, View, Span, Label, ButtonBuilder, signal, createEffect, EventManager, Style } from 'ranui/builder';
```

SSR helpers: `import { defineSSR } from 'ranui/ssr-registry'` (source) / `ranui/ssr`,
`ranui/ssr-stream`. Types: `ranui/typings`.

## Elements at a glance

- **Forms**: `r-input`, `r-checkbox`, `r-select` (+ `r-option`, `r-dropdown-item`),
  `r-colorpicker`, `r-form`. These are **form-associated** — their values are
  collected by `<r-form>`'s native `FormData`.
- **Feedback/overlay**: `r-message` (toasts), `r-modal`, `r-popover`, `r-loading`,
  `r-skeleton`, `r-progress`.
- **Layout/content**: `r-card`, `r-section`, `r-tab`/`r-tabs`, `r-icon`, `r-img`,
  `r-link`, `r-math`, `r-player`, `r-radar`.
- **Routing**: `r-router`, `r-route`, `r-link` (history/hash SPA routing).

## Builder + reactivity (from `ranui/builder`)

- `Div()/View('r-x')/Span()/...` — chainable: `.class()`, `.attr()`, `.part()`,
  `.role()`, `.text()`, `.children(...)`, `.on(event, handler)`, `.build()`.
- `signal(initial)` → `[getter, setter]`; `createEffect(fn)` re-runs `fn` when the
  signals it reads change (returns a disposer).
- `EventManager` — `.on(target, type, handler)` with `.abort()` to remove all
  listeners at once (use in `disconnectedCallback`).

## Usage example

Declarative — use elements like native HTML (after importing the subpath):

```html
<r-select value="a">
  <r-option value="a">Apple</r-option>
  <r-option value="b">Banana</r-option>
</r-select>
<r-input label="Email" name="email"></r-input>
```

Imperative — create, configure, and wire events (event `detail` shapes are in
COMPONENTS.md, e.g. `r-select change → { value, label }`):

```ts
import 'ranui/select';
import message from 'ranui/message';

const sel = document.createElement('r-select');
sel.setAttribute('value', 'a');
sel.addEventListener('change', (e) => console.log((e as CustomEvent).detail.value));
document.body.append(sel);

message.success('Saved'); // imperative toast API: info | success | warning | error | toast
```

Builder + reactivity — compose DOM with signals (great for framework-free views):

```ts
import { Div, ButtonBuilder, signal, createEffect } from 'ranui/builder';

const [count, setCount] = signal(0);
const label = Div().build();
createEffect(() => { label.textContent = `Count: ${count()}`; }); // re-runs on change
const btn = ButtonBuilder().text('inc').on('click', () => setCount(count() + 1)).build();
document.body.append(label, btn);
```

## Accessibility (already built in — rely on it, don't re-implement)

- `r-message` toasts announce via an `aria-live` region (errors = assertive `alert`).
- `r-checkbox`/`r-input`/`r-select` are form-associated and labelled; checkbox is
  keyboard-toggleable (Space/Enter) with `role=checkbox`/`aria-checked`.
- `r-tabs` follows the WAI-ARIA tabs pattern (roles + roving tabindex + arrow keys).
- `r-colorpicker` sliders are `role=slider` with arrow-key adjustment; the swatch
  opens via Enter/Space.
- All components honour `prefers-reduced-motion`.

For custom UI you build, follow DESIGN.md §7 (keyboard nav, visible focus, ARIA).

## Conventions & gotchas

- Register elements with `defineSSR('r-name', Component)`, not
  `customElements.define` directly (keeps SSR working).
- Shadow DOM isolates styles: external `<label for>` / `aria-labelledby` do NOT cross
  into a component's shadow root — use the component's own `label` attribute/slot.
- Component CSS uses CSS variables with dark-safe fallbacks; theme via tokens, not by
  reaching into shadow internals.
- Prefer subpath imports (`ranui/button`), never `ranui/dist/...` or internal `@/...`.
