---
description: 'Engineering rules for building with ranui: entry points, the attribute/property/event contract, styling across the shadow boundary, state ownership, SSR, testing and the antipatterns to avoid.'
---

# Coding guidelines

How to _build_ with ranui: what the component contract is, where the Shadow DOM boundary
changes the rules you are used to, and which mistakes are worth knowing about before you make
them.

The visual half of this is the [design guidelines](/src/ranui/design-guides/); the tokens are
the [design system](/src/ranui/design-system/).

> **Use when** you are wiring ranui components into an application — picking imports, binding
> events, styling something a selector cannot reach, rendering on a server, or writing tests.

## Principles

1. **The element is the API.** Attributes, properties, events, slots and `::part()` are the
   whole contract. Anything else you can see from the outside is an implementation detail that
   will move.
2. **Own state in exactly one place.** Either your app owns the value and pushes it in, or the
   component owns it and tells you when it changes. Mirroring both ways is how values drift.
3. **Style through the seams.** Custom properties, `::part()`, `sheet` and slots cross the
   Shadow DOM boundary. Ordinary selectors do not — no amount of specificity changes that.
4. **Import what you use.** Every component has its own entry; the barrel is a convenience, not
   a requirement.
5. **Prefer the platform.** These are custom elements: `addEventListener`, `setAttribute` and
   `hidden` all work as specified, and framework abstractions on top are optional.

## Entry points

Each entry registers exactly what its name says — nothing more, so a page that only wants
theming never pays for the component library.

| Import                          | Contains                                                             |
| ------------------------------- | -------------------------------------------------------------------- |
| `ranui`                         | Every component (registers all `<r-*>` elements as a side effect)    |
| `ranui/<component>`             | One component — `ranui/button`, `ranui/select`, `ranui/modal`, …     |
| `ranui/theme`                   | `initTheme` / `setTheme` / `getTheme` / token overrides; no elements |
| `ranui/i18n`                    | The translation engine; no elements                                  |
| `ranui/fonts`                   | Self-hosted Geist Sans + Geist Mono (`@font-face` CSS only)          |
| `ranui/style`                   | The stylesheet, if your setup does not pick it up automatically      |
| `ranui/builder`                 | The fluent DOM builder the components are written with               |
| `ranui/ssr`, `ranui/ssr-stream` | Server rendering                                                     |
| `ranui/testing`                 | Helpers for reaching into a closed shadow root from a test           |
| `ranui/typings`                 | Ambient types (JSX / TS element typings)                             |

```js
import 'ranui/button'; // one element
import 'ranui'; // all of them
```

**Import for the side effect.** `import 'ranui/button'` registers `<r-button>`; you rarely need
the exported class. The exception is server rendering, where you instantiate it yourself.

## The component contract

Every element's exact attributes, properties, events (with `detail` shapes), slots and parts
are generated from the source into
[`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md).
The rules below are what that table does _not_ say.

### Attributes are strings; properties are typed

HTML attributes are lowercase and stringly-typed; the matching property is camelCase and takes
a real value. They are the same state, reached two ways:

```html
<r-select showsearch dropdownclass="wide"></r-select>
```

```js
select.showSearch = true; // property — camelCase
select.setAttribute('showsearch', ''); // attribute — lowercase
```

- **Boolean attributes go by presence**, like `disabled` on a native `<button>`:
  `disabled=""` and `disabled="false"` are both _disabled_. Remove the attribute (or set the
  property to `false`) to turn it off.
- **Rich values go through properties.** Arrays, objects and `File`s cannot survive an
  attribute — `r-attachments`' `attachments`, for example, is a property.
- **Attribute names in markup are case-insensitive**, which is why the HTML above reads
  `showsearch` while the property is `showSearch`. In JSX, write the attribute form.

### Listen on the element itself

ranui components dispatch `CustomEvent`s, and the payload is always in `detail`:

```js
select.addEventListener('change', (event) => {
  const { value, label } = event.detail;
});
```

**Whether an event bubbles is a per-component decision, so bind to the element, not to a
container.** The form and overlay core — `r-input`, `r-checkbox`, `r-select`, `r-modal` —
dispatches non-bubbling events on itself, deliberately: a `change` from a select inside your
form should not look like a `change` from the form. Others do bubble (and are `composed`, so
they cross shadow boundaries): `r-theme-switch`, `r-voice-button`, `r-attachments`,
`r-conversation`, `r-tool-card`, `r-markdown`, `r-math`, `r-mermaid`, `r-router`, `r-route`,
`r-link`, `r-colorpicker`.

A listener on the element works in both cases; delegation on an ancestor works only for the
second group, and fails _silently_ for the first. Check the source or
[`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md)
before relying on delegation.

**`before*` events are cancelable.** `r-modal` dispatches `beforeopen` / `beforeclose` before
acting; `event.preventDefault()` vetoes the transition. The `open` / `close` /
`afteropen` / `afterclose` pairs report what already happened and cannot be cancelled.

```js
modal.addEventListener('beforeclose', (event) => {
  if (hasUnsavedChanges) event.preventDefault();
});
```

### Slots and parts

Content goes in through slots — default and named — and stays in your document, so **your**
page CSS styles it normally. Only what the component builds internally is out of reach, and
that is what `::part()` is for.

## Styling across the shadow boundary

Every ranui component renders into a **closed** shadow root. Page CSS cannot leak in, and
selectors cannot reach through. There are exactly four ways in, in order of preference:

| Mechanism             | Use for                                    | Example                                               |
| --------------------- | ------------------------------------------ | ----------------------------------------------------- |
| **Custom properties** | Anything the component exposes as a token  | `r-button { --ran-btn-background: #7c3aed; }`         |
| **`::part()`**        | A structural tweak the tokens do not cover | `r-card::part(footer) { justify-content: flex-end; }` |
| **`sheet` attribute** | Programmatic / dynamic CSS injected inside | `el.sheet = '.ran-btn { letter-spacing: .02em }'`     |
| **Slot content**      | Markup you own anyway                      | `<span slot="extra">…</span>`                         |

Custom properties are the preferred one because they **inherit through** the boundary: setting
a token on `:root`, on a wrapper, or on the element all work, and they are the same tokens the
theme uses. Parts and `sheet` bind you to internal structure, so prefer them for genuine gaps
and expect to revisit them on upgrades.

What does not work, at any specificity: `r-select .some-inner-class { … }`, `!important`, or
`querySelector` into the component. A closed root means `element.shadowRoot` is `null` — for
your CSS, your scripts, and your test runner's locators alike.

## Owning state

Decide, per value, who owns it:

- **The component owns it** (uncontrolled): set an initial value, then read the value out of
  the event `detail` when it changes. Simplest, and the default for forms.
- **Your app owns it** (controlled): set the property on every render, and treat the event as a
  _request_ to change your state — not as a change that already happened to your model.

What breaks is doing both: keeping a copy of the component's value in your state, writing it
back on every event, and re-setting the property from that state. The two drift under fast
input, and a write-during-event can loop. Pick one direction.

```js
// Controlled: state is the source of truth, the event is a request
input.value = state.query;
input.addEventListener('input', (event) => {
  state.query = event.detail.value;
  render(); // which sets input.value again — but from one owner
});
```

## Framework integration

These are standard custom elements, so nothing framework-specific is required — but three
details bite:

- **React** (< 19) sets every JSX prop as an **attribute**, so rich values do not arrive and
  `onChange`-style props do not bind to custom events. Use a `ref` and set properties /
  `addEventListener` in an effect. React 19 sets properties when one exists and still does not
  bind custom events by name, so keep the `ref` for listeners.
- **Vue** compiles unknown tags to components unless told otherwise; add `r-` to
  `compilerOptions.isCustomElement` in your build config. After that, `:prop` binds a property
  and `@change` binds a real event listener, both correctly.
- **Angular** needs `CUSTOM_ELEMENTS_SCHEMA`; Svelte and Solid pass attributes and
  `on:`/`on` listeners straight through and need nothing.

TypeScript users can `import 'ranui/typings'` for the JSX intrinsic-element declarations.

## Server rendering

ranui components serialize to **declarative shadow DOM**, so a server can emit the real markup
and the first paint is correct before any JavaScript runs:

```js
import 'ranui'; // populates the SSR registry
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

`renderToStream(html)` is the same thing as an async generator, for streaming responses;
`renderToString(instance)` in `ranui/ssr` serializes one component instance you constructed
yourself. Unknown tags pass through untouched, so it is safe to run over a whole page.

Two things to know:

- **The client rebuilds, it does not reuse.** Because the roots are closed, the browser cannot
  hand the server-rendered tree back to the component, so on upgrade each element constructs
  an identical one. You get first paint from the server; you do not get hydration reuse, and
  you must not put state in the server-rendered shadow markup expecting the client to read it.
- **Nothing measured is available on the server.** Anything that depends on
  `getBoundingClientRect` or `offsetWidth` resolves after mount, in the browser.

## Performance

- **Import per component** on pages that use a handful; the barrel is for apps that use most of
  the library.
- **Variants load lazily.** `r-icon` and `r-loading` fetch a variant by name at runtime, so the
  base cost does not scale with the number of icons you don't use.
- **Set properties, don't rebuild elements.** Replacing a custom element runs its constructor
  again; setting a property updates in place.
- **Batch attribute writes.** Each write can trigger `attributeChangedCallback`; assemble state
  before insertion where you can.

## Testing

**Closed shadow roots stop test locators too.** Playwright's `getByRole`, `getByText` and
`querySelector` all stop at the boundary and find _nothing_ — a spec written against them
passes while asserting on elements it never saw. Two suites in this repository were written
that way before anyone noticed. `ranui/testing` is the seam, named and documented:

```js
import { insideShadow, settlePainted } from 'ranui/testing';

const label = await insideShadow(page, 'r-button', (root) => root.querySelector('[part=content]')?.textContent);
```

Otherwise test the contract, not the internals: set an attribute or property, assert on the
event and on what the user can perceive. Assertions against internal class names break on every
refactor and tell you nothing about whether the component works.

## Antipatterns

| Antipattern                                                   | Why it fails                                                                     |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Delegating `change` on a container for `r-input` / `r-select` | Those events don't bubble; the listener never fires. Bind to the element.        |
| `document.querySelector('r-select').shadowRoot`               | Closed root — always `null`. Use the public API, parts, or `ranui/testing`.      |
| Styling internals with `r-card .inner { … }`                  | Selectors don't cross the boundary at any specificity. Use tokens or `::part()`. |
| `!important` to win against a component                       | There is no cascade conflict to win — the rule never applies. Same fix as above. |
| Mirroring a component's value into your state and back        | Two owners, one value; they drift and can loop.                                  |
| Re-creating elements to update them                           | Runs the constructor again, drops focus and internal state. Set properties.      |
| Hard-coding a color next to a themed component                | Breaks the moment the theme flips. Use semantic tokens.                          |
| Blanket `z-index` on a wrapper "in case" an overlay opens     | Elevates static content over your own chrome forever. Scope it with `:has()`.    |
| Waiting on `shadowRoot` in a test                             | See above — assert through `ranui/testing` or on observable behaviour.           |

## Contributing to ranui

The repository carries its own, stricter standards for library code:

- [`docs/DESIGN.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md) —
  the executable design standard; nine rules are enforced by `pnpm -F ranui verify:design`.
- [`docs/CODING.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md) —
  the component architecture, state ownership and testing rules for library code.
- [`docs/BUILDER.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md) —
  the fluent DOM builder and its reactive primitives.
- `CLAUDE.md` in the package root — the orientation file, shipped in the npm tarball, that both
  humans and coding agents read first.

Before opening a pull request: `pnpm -F ranui test:all`, `pnpm -F ranui verify:design`, and
`pnpm verify:docs` (the API and token tables are generated — CI fails if they are stale).
