---
name: ranui
description: Use when building UI with the ranui web-component library (elements like `<r-button>`, `<r-modal>`, `<r-select>`, `<r-input>`, `<r-message>`) or its fluent DOM builder (`ranui/builder` — Div/View/Span/signal/createEffect/EventManager). Covers common import examples, conventions, accessibility, and where the authoritative API and export references live.
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
- **`node_modules/ranui/docs/INTERFACE_GUIDE.md`** — short decision-to-owner index.
- **`node_modules/ranui/docs/INTERACTION.md`** — observable input, focus, keyboard,
  drafts, feedback, progress and recovery; read for behavior changes.
- **`node_modules/ranui/docs/WORKFLOW_PATTERNS.md`** — optional batch/queue, settings,
  account/data and revision recipes. Load only for a relevant task; these are host
  responsibilities, not additional library APIs. Visual craft remains in DESIGN.
- **`node_modules/ranui/docs/style-tokens-public.md`** — the CSS variable (theming
  token) catalog.

**`node_modules/ranui/docs/CODING.md`** and **`node_modules/ranui/CLAUDE.md`** also
ship with the package: engineering rules and the detailed implementation reference
(architecture, builder, LESS conventions, testing). Source copies live in `packages/ranui`.

## Import map

Per-component, tree-shakeable side-effect imports register the custom element:

```ts
import 'ranui/button'; // then use <r-button>
import 'ranui/modal';
import 'ranui/select';
import 'ranui/input';
import 'ranui/message'; // also exposes an imperative message API
import 'ranui/checkbox';
```

Common element subpaths (examples, not a complete inventory): `button icon image input message skeleton tab tabpane
radar modal select progress player popover dropdown content loading colorpicker math
checkbox card router route link`. For all supported subpaths, read `exports` in the
installed `node_modules/ranui/package.json`; use COMPONENTS.md for element contracts.

The fluent DOM builder + reactivity (no custom-element registration):

```ts
import { Div, View, Span, Label, ButtonBuilder, signal, createEffect, EventManager, Style } from 'ranui/builder';
```

Consumer SSR rendering helpers are public exports:

```ts
import { HTMLElementSSR, RanElement, h, renderToString } from 'ranui/ssr';
```

Streaming rendering uses `ranui/ssr-stream`; types use `ranui/typings`. `defineSSR`
is an internal registration helper at `@/utils/ssr-registry` in the ranui source
checkout. It is not exported from `ranui/ssr` or a consumer registration subpath.

## Elements at a glance

- **Forms**: `r-input`, `r-checkbox`, `r-select` (+ `r-option`, `r-dropdown-item` as
  options). The three field elements are **form-associated custom elements**
  (`attachInternals()` + `ElementInternals.setFormValue()`) — their values are
  collected by `new FormData(form)` when they're real descendants of a native
  `<form>`, same as any native field — no wrapper component required. Use
  `serializeForm(form)` (from `ranui`) to turn a submit into a plain object.
  `r-colorpicker` is not form-associated: read its `value` / `change` event
  (`detail.value`) and explicitly include it in the host's submitted data when needed.
- **Feedback/overlay**: `r-message` (toasts), `r-modal`, `r-popover`, `r-loading`,
  `r-skeleton`, `r-progress`.
- **Layout/content**: `r-card`, `r-section`, `r-tab`/`r-tabs`, `r-icon`, `r-img`,
  `r-link`, `r-math`, `r-player`, `r-radar`.
- **Routing**: `r-router`, `r-route`, `r-link` (history/hash SPA routing).
- **Streaming transcript**: `r-conversation` — renders an append-only event log. Register
  each kind of content as a view (`match`/`start`/`update` fold state, `mount`/`patch`
  render it) **before the first `push`**; it throws afterwards. Bottom-follow is on by
  default and does not fight the reader; `pinnedchange` drives a "jump to latest" button.
  Use `<r-markdown>` as the prose row — its `mode="streaming"` already closes half-streamed
  markdown. Projection and cadence: `ranuts/conversation`.
- **Tool calls**: `r-tool-card` — set `call` / `result` / `status` from a **declared
  intent** (`generic` / `terminal` / `diff`), never markup. Views must be pure functions
  of the call's arguments, because they are recomputed on replay; an unrecognised card
  degrades to `generic` instead of throwing.
- **Chain of thought**: `r-reasoning` — expands while `streaming` is set, collapses when
  it clears, and **stops following once the reader opens or closes it themselves**
  (setting `open` from script counts). Feed `content` from `ranuts/stream`'s
  `reasoning-delta` blocks.
- **Attachments**: `r-attachments` — holds the files staged with a message, previews them,
  validates, and owns its object URLs (revoked on detach/clear/disconnect). It does not
  collect files: call `add(files)` from paste, drop or a picker. Removal is `detach(id)`,
  because `remove()` already means "take yourself out of the document". Rejections are
  reported, never silent.
- **Dictation**: `r-voice-button` — a microphone button over `ranuts`' `createSpeechRecognizer`.
  It reports the **whole capture so far** on each `voiceresult` (interim results are
  revised), so remember the text already in the box at `voicestart` and concatenate once.
  It never sends, hides itself where the API is absent, and only `denied`/`failed` are
  worth surfacing — `noSpeech`/`aborted` are routine.

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
createEffect(() => {
  label.textContent = `Count: ${count()}`;
}); // re-runs on change
const btn = ButtonBuilder()
  .text('inc')
  .on('click', () => setCount(count() + 1))
  .build();
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

- In the ranui source checkout, component authors register with the internal
  `defineSSR('r-name', Component)` helper (keeps SSR working). Consumers register
  shipped elements through their public side-effect imports; the internal helper is
  not an installed-package API.
- Shadow DOM isolates styles: external `<label for>` / `aria-labelledby` do NOT cross
  into a component's shadow root — use the component's own `label` attribute/slot.
- Component CSS uses CSS variables with dark-safe fallbacks; theme via tokens, not by
  reaching into shadow internals.
- Prefer subpath imports (`ranui/button`), never `ranui/dist/...` or internal `@/...`.
