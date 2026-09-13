# ranui DESIGN.md

> An executable design specification — written for humans **and** AI agents.
> When generating or editing ranui UI, follow these rules so output is consistent
> instead of drifting in style. Based on the [Geist design system](https://vercel.com/design)
> ([design.md](https://vercel.com/design.md) / [design.dark.md](https://vercel.com/design.dark.md)).

> Companion documents: [CODING.md](./CODING.md) is the engineering standard for the same code
> (architecture, state ownership, events, testing). The consumer-facing versions are published
> as [Design system](https://ran.chaxus.com/src/ranui/design-system/),
> [Design guidelines](https://ran.chaxus.com/src/ranui/design-guides/),
> [Information architecture](https://ran.chaxus.com/src/ranui/information-architecture/) and
> [Coding guidelines](https://ran.chaxus.com/src/ranui/coding-guides/) — update those when a
> rule here changes in a way consumers can see.

## How to use this file

- Prefer **semantic tokens** (`--ran-color-*`, `--ran-space-*`, …) over raw scales or hex.
- Decide by **role/state**, not by eyeballing a value. The value is chosen for you.
- When a choice is unresolved, mark it explicitly — don't bury a guess in code.
- Design **all reachable states** (default, hover, active, focus, disabled, loading, empty, error), not just the happy path.
- **Verify the rendered result**, in light and dark, at narrow and wide widths — code review alone is not enough.

Conflict resolution order: **user goals → verified evidence → this file → repo guidance (`CLAUDE.md`) → shipped patterns → general heuristics.**

## What is machine-checked

Nine of the rules below are enforced by `verify:design`, which CI runs on every pull
request — **for this library and for every surface built on it**. `packages/docs` and
`packages/site` run the same checker over their own stylesheets:

```sh
tsx ../ranui/bin/verify-design-rules.ts --roots styles --tokens ../ranui/theme/tokens.less --baseline design-baseline.json
```

A design system whose rules stop at the library boundary is a design system the product
does not actually follow. Pointing the checker at the sites found 298 violations that had
never been looked at — invented spacing values and raw colours in stylesheets written
against this very system. Vendored third-party CSS is excluded with `--ignore`: its
metrics are not our debt to clear. Everything else in this file is still binding — it is simply not
mechanically decidable, so it relies on review and on rendering the result.

| Rule                               | Enforces                                                                                   | Section |
| ---------------------------------- | ------------------------------------------------------------------------------------------ | ------- |
| `dark-unsafe-fallback`             | a component token's colour fallback points at a token that flips, not a light-only literal | §1      |
| `bare-colour`                      | raw colour literals do not appear outside a token fallback                                 | §1      |
| `spacing-scale`                    | `padding` / `margin` / `gap` come from `--ran-space-*`                                     | §2      |
| `sizing-scale`                     | intrinsic dimensions never borrow from the spacing scale                                   | §2      |
| `mouse-only-drag`                  | a drag loop has a Pointer Events path, so it works on touch                                | §8      |
| `hidden-inert`                     | a `:host` display rule does not silently disable the `hidden` attribute                    | §9      |
| `undefined-token-fallback`         | a component token's fallback names a token the theme actually declares                     | §1      |
| `built-then-queried`               | a component holds the elements it built, instead of searching its own shadow tree for them | §9      |
| `shadow-mount-outside-constructor` | a component's shadow tree is built in its constructor, once                                | §9      |

Existing violations are recorded per file in
[design-rule-baseline.json](./design-rule-baseline.json) and act as a **ratchet**: a count
that rises fails as a new violation, and a count that falls fails until it is lowered, so a
fix cannot silently regress later. The baseline is a record of debt, not permission — the
target for every entry is zero.

---

## Looking at the whole system at once

`pnpm -F ranui design:bundle` builds a browsable design-system bundle — one card per
component, plus colour, typography, spacing, radius/elevation and motion — for upload to
[Claude Design](https://claude.ai/design) with the `DesignSync` tool.

```sh
pnpm -F docs build && pnpm -F docs preview   # terminal 1 — supplies the rendered components
pnpm -F ranui design:bundle                  # terminal 2 — writes packages/ranui/design-bundle/
```

**Every card is real rendered output, never a drawing of one.** The docs site is opened in
Chromium, each component's shadow tree is serialized into a Declarative Shadow DOM
template, and the stylesheets that tree adopted are inlined beside it — so a card renders
with JavaScript disabled and without ranui on the page, and cannot claim an appearance the
component does not have. Token values are read back per theme with `getComputedStyle`
rather than copied out of the stylesheets, so a swatch cannot show a value the system no
longer resolves to.

A component whose docs page has no live `<ran-demo>` gets no card, and the script names
it. Seven currently qualify — `attachments`, `conversation`, `preview`, `reasoning`,
`router`, `tool-card`, `voice-button` — which is worth fixing in the docs, not in the
bundler: a component nobody can see rendered is a component nobody can review.

---

## 1. Color — a state ladder, not a palette

Each hue is a **10-step scale** (`100`–`1000`). Every step has **one fixed job**, so interaction states are decided up front:

| Step | Role                        |
| ---- | --------------------------- |
| 100  | Default background          |
| 200  | Hover background            |
| 300  | Active (pressed) background |
| 400  | Default border              |
| 500  | Hover border                |
| 600  | Active border               |
| 700  | Solid fill (button/badge)   |
| 800  | Solid fill — hover          |
| 900  | Secondary text & icons      |
| 1000 | Primary text & icons        |

Scales: `--ran-gray-100..1000`, `--ran-gray-alpha-100..1000` (translucent, layers over any surface), `--ran-blue-*`, `--ran-red-*`, `--ran-amber-*`, `--ran-green-*`, plus `--ran-background-100/200`.

**Use the semantic layer, not the scale, in components:**

| Token                                        | Maps to                               | Use for                          |
| -------------------------------------------- | ------------------------------------- | -------------------------------- |
| `--ran-color-bg`                             | background-100                        | Page background                  |
| `--ran-color-bg-subtle`                      | background-200                        | Subtle page zones                |
| `--ran-color-bg-elevated`                    | bg-100 / gray-100 (dark)              | Cards, surfaces                  |
| `--ran-color-bg-muted`                       | gray-100                              | Inset / muted fills              |
| `--ran-color-bg-hover`                       | gray-200                              | Hover background                 |
| `--ran-color-bg-active`                      | gray-300                              | Active background                |
| `--ran-color-text`                           | gray-1000                             | Primary text                     |
| `--ran-color-text-secondary`                 | gray-900                              | Secondary text                   |
| `--ran-color-text-disabled`                  | gray-700                              | Disabled text                    |
| `--ran-color-border`                         | gray-400                              | Default border                   |
| `--ran-color-border-hover`                   | gray-500                              | Hover border                     |
| `--ran-color-border-active`                  | gray-600                              | Active border                    |
| `--ran-color-primary` / `-hover` / `-active` | gray-1000 / #383838 / #4d4d4d (flips) | Primary action (monochrome)      |
| `--ran-color-primary-text`                   | background-100                        | Ink on a primary surface (flips) |
| `--ran-color-success` / `warning` / `danger` | green-700 / amber-700 / red-700       | Status                           |
| `--ran-color-link`                           | blue-700                              | Links                            |

**Accent meaning:** the **primary action is monochrome** — `--ran-color-primary` is black-on-white in light, white-on-black in dark (matching Vercel's brand tone), and text/icons on it use `--ran-color-primary-text` (the inverse, which flips too). **Blue** is reserved for **links (`--ran-color-link`) and the focus ring** only · green = success · amber = warning · red = danger/error. There is no separate "contrast" token — primary _is_ the highest-contrast monochrome action.

**Light & dark:** same token name, different value. `gray-1000` is `#171717` in light and `#ededed` in dark. Components reference the _semantic name_; dark mode only redefines the base scale (one mixin), and everything re-resolves.

**Rules**

- Never hard-code a hex/rgb in a component for a value that should follow the theme.
- A component token's fallback must point at a **token that flips** (`var(--ran-gray-alpha-100, …)`, `var(--ran-blue-100, …)`, `var(--ran-color-text, …)`), never a light-only literal — otherwise it breaks in dark mode.

---

## 2. Spacing — a limited, rhythmic scale

A **4px base unit** with **nine values** only: `--ran-space-1..24` → `4, 8, 12, 16, 24, 32, 40, 64, 96`px.

**Rhythm**

- `8px` between elements inside a group.
- `16px` between groups.
- `32–40px` between sections.

**Rule:** pick a value from the scale. Don't invent `20px`/`28px` — a limited set is what creates the page's rhythm.

---

## 3. Typography — choose a role, not a size

Fonts: `--ran-font-family` (Geist Sans, UI & prose), `--ran-font-mono` (Geist Mono, code, data, and eyebrow/labels). Base: `--ran-font-size: 14px`, `--ran-line-height: 1.5715`.

Decide by **role**; the role fixes font, size, weight, line-height. Each row is backed by real tokens in `theme/tokens.less` — reference them (`var(--ran-{component}-…, var(--ran-text-{role}…, fallback))`), don't hand-copy the px/weight number:

| Role    | Use                    | Weight                                            | Size tokens                               | Notes                                                           |
| ------- | ---------------------- | ------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| heading | Titles                 | `--ran-text-heading-weight` (600)                 | `--ran-text-heading-1..4` (32/24/20/16px) | Tight tracking `--ran-text-heading-tracking` (≈ -0.03em)        |
| label   | Single-line, scannable | `--ran-text-label-weight` (500)                   | `--ran-text-label-1..3` (14/13/12px)      | No wrapping                                                     |
| copy    | Multi-line body        | `--ran-text-copy-weight` (400)                    | `--ran-text-copy-1..2` (16/14px)          | line-height ~1.55 (`--ran-line-height`)                         |
| button  | Button text            | `--ran-text-button-weight` (500)                  | `--ran-text-button-size` (14px)           | `--ran-text-button-line-height: 1` for crisp vertical centering |
| mono    | Code, data, eyebrows   | `--ran-text-mono-weight-regular/medium` (400/500) | borrows label/copy size tiers             | `--ran-font-mono`                                               |

**Rule:** ask "what role is this text?" (heading / label / copy / button) — the style follows. Don't pick raw px per instance.

**A role is a tool, not a law.** Transient/decorative UI that doesn't map to any role (an active-link weight bump, a player gesture-flash overlay) keeps its own one-off component token instead of being forced into the nearest role — see `r-link`'s `--ran-link-active-font-weight` and `r-player`'s `--ran-player-gesture-flash-font-weight`.

---

## 4. Radius & elevation

Radius: `--ran-radius-sm` 6 · `--ran-radius-md` 12 · `--ran-radius-lg` 16 · `--ran-radius-full` 9999.

- Controls (button, input, select) → `sm`. Cards / dialogs → `md`. Large surfaces → `lg`. Pills / avatars → `full`.

**Elevation is a role, not decoration.** Pick the shadow by _what the element is_, and make sure the tier is actually perceptible — a shadow you can't see fails its job.

| Tier    | Token                   | Use for                                                                                                                                               |
| ------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Raised  | `--ran-shadow-elevated` | In-flow surfaces that also have a border — `r-card`, `r-section`. Subtle on purpose.                                                                  |
| Overlay | `--ran-shadow-menu`     | Transient layers floating **over** content — `r-dropdown`, `r-select` menu, `r-popover`, tooltips, `r-message`/toast. Must clearly lift off the page. |
| Modal   | `--ran-shadow-modal`    | Blocking dialogs — `r-modal`. Strongest.                                                                                                              |

A floating overlay must **never** fall back to `--ran-shadow-elevated` (the card tier) — it will look flat. Borderless overlays (dropdown, toast) rely on the shadow alone for separation, so the overlay tiers carry real weight.

**Stacking follows the same roles (z-index ladder).** Floating overlays portal to `<body>`, so they need an explicit stacking tier. The z-index must sit on the element that is **positioned and portaled** (the host) — a z-index on an inner shadow node is trapped in the host's stacking context and does nothing against page content.

| Tier     | Token              | Default | Use for                                                                                             |
| -------- | ------------------ | ------- | --------------------------------------------------------------------------------------------------- |
| Modal    | `--ran-z-modal`    | `1000`  | Blocking dialogs (`r-modal`) and their mask.                                                        |
| Dropdown | `--ran-z-dropdown` | `1100`  | Dropdown / select menu / popover. **Above** modal, so a select opened inside a modal stays visible. |
| Message  | `--ran-z-message`  | `1200`  | Toasts / notifications. Always on top.                                                              |

Override a tier globally (set `--ran-z-dropdown` on `:root`) or per component (`--ran-dropdown-host-z-index`, `--ran-modal-root-z-index`, `--ran-message-z-index`) — never reach for `!important`. An overlay open while the page scrolls must re-run its placement on `scroll`/`resize` so it tracks its trigger (e.g. inside a sticky header).

**Consuming a ranui overlay inside your own page chrome.** The ladder (1000–1200) is deliberately chosen to sit far above any realistic host-page chrome (nav bars, sidebars, backdrops are typically in the tens — VitePress's own is nav:30/backdrop:50/sidebar:60). Two component-side facts follow from that gap, and change what a host page needs to do:

- **A portaled overlay never needs the host's help.** `r-message` and any panel that moves itself to `document.body` (`r-select`, `r-popover` — see the portaling pitfall above) compares its own z-index directly against the host's root-level chrome. Since 1000+ already beats anything in the tens, it wins with zero extra CSS on the host's side.
- **A non-portaled fixed overlay (`r-modal`'s dialog stays inside its own shadow DOM) only escapes as far as its nearest ancestor stacking context.** If a host wraps embedded content in anything that creates one — `isolation: isolate`, `opacity < 1`, `transform`, `filter`, `will-change` — a `position: fixed` descendant is trapped inside it for stacking purposes (its _layout_ still escapes to the viewport; only _paint order_ is trapped). The wrapper then needs its own elevated `z-index` for the trapped content to climb back out.

The mistake to avoid: **don't promote the wrapper unconditionally to fix that.** Giving a wrapper `position: relative; z-index: <high>` at all times elevates _everything in it_ — including static, non-overlay content — above the host's own chrome for its entire scroll lifetime, not just while an overlay is actually open. On a scrollable page that reliably paints ordinary content over a sticky nav/header the moment their boxes happen to overlap (ranui's own docs site shipped exactly this: every `<Demo>` wrapper carried a blanket `z-index: 100` "just in case," so a 100%-static example — no overlay in it at all — painted over the sticky nav on ordinary scroll). Scope the elevation to exactly when it's needed instead:

```css
/* Isolate unconditionally (cheap — no z-index/position means no promotion
   of its own, so it costs nothing while nothing inside is elevated) */
.host-wrapper {
  isolation: isolate;
}
/* Escalate only while a real overlay is actually open, via a live selector
   on its reflected attribute — never a blanket rule "in case" one might open */
.host-wrapper:has(r-modal[open]) {
  position: relative;
  z-index: 100; /* comfortably above the host's own chrome range */
}
```

`:has()` works here specifically because `open` is a real reflected HTML attribute (`hasAttribute`/`setAttribute`, not just a JS property) — check the same for any other component before relying on it in a selector.

---

## 5. Motion — prefer none

Durations: `--ran-motion-duration-fast` `0.15s`, `--ran-motion-duration-base` `0.2s`.

| Duration | Use                                                |
| -------- | -------------------------------------------------- |
| 0ms      | A change that is already obvious — apply instantly |
| ~150ms   | Hover / active state transitions                   |
| ~200ms   | Popovers & menus appearing                         |
| ~300ms   | Modals & dialogs                                   |

**Principle:** the bigger the change, the more time it earns. Otherwise: don't animate. Keep motion quick, light, and restrained. Respect `prefers-reduced-motion`.

**Never animate a theme switch.** Transitions are for _interaction_ (hover / focus / press), not for flipping light↔dark. CSS cannot tell _why_ a property changed: any palette prop listed in a `transition` will also fade when the theme flips its token — each component at its own duration, while the host page has already switched. A general-purpose library must not impose that on its consumers. Rules:

- **Palette props never get a default transition.** `background` / `background-color`, `color`, `border-color`, `box-shadow`, `fill`, `stroke` — none of them, on any element that carries a theme-driven color. Hover/focus feedback on these props snaps.
- **Motion props may transition.** `transform`, `opacity`, and box-geometry props (`left` / `top` / `width` / `height` / `font-size`) don't follow the theme — checkbox pops, tab ink-bars, ripples all stay animated.
- `transition: all` and bare-duration shorthands (`transition: 0.2s` — which means `all`) are banned; they silently include palette props.
- Every removed default keeps its `--ran-*-transition` hook var, so a consumer who wants palette fades can opt in per component.

```less
/* ✗ fades on theme switch (palette props; `all`; bare duration = all) */
transition: all var(--ran-motion-duration-base, 0.2s);
transition: 0.2s;
transition:
  border-color 0.2s,
  color 0.2s;

/* ✓ motion props only — theme flip is instant, interaction still animates */
transition: var(--ran-checkbox-tick-transition, transform 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6), opacity 0.1s);

/* ✓ no motion at all, with an opt-in hook for consumers */
transition: var(--ran-input-transition, none);
```

---

## 6. Content — copy is part of the system

- **Buttons:** an action **plus** an object. ✅ "Deploy project", "Delete member". ❌ "Deploy", "OK", "Delete".
- **Errors:** say **what happened**, then **how to fix it**. ✅ "Build failed: the bundle exceeds the size limit. Reduce it or raise the limit." ❌ "Operation failed, please try again."
- **Confirmations / toasts:** state the **change**, not "success". ✅ "Project deleted". ❌ "Successfully deleted" (the toast appearing already implies success).
- Be specific; every sentence should remove guesswork, not add it.

---

## 7. Accessibility — the system serves everyone

- Maintain sufficient text-to-background contrast (**WCAG AA**).
- **Never signal state with color alone** — pair it with an icon or text (e.g. ✓ / ✕ labels, not just green/red).
- Every interactive element has a **visible focus ring** — `--ran-focus-ring`, or `outline: 2px solid var(--ran-color-primary); outline-offset: 2px`. Never remove it for "cleanliness".
- **Full keyboard navigation** — nothing is mouse-only.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.

---

## 8. Input & viewport — mobile and desktop, both

Every interactive component must work with a mouse **and** with touch, at a narrow phone
width **and** a wide desktop width. Neither is a secondary target — do not ship a component
that only works on one.

- **Drag/slider/gesture interaction uses Pointer Events, never mouse-only.** Bind
  `pointerdown`/`pointermove`/`pointerup`(`/pointercancel`) — never `mousedown`/`mousemove`/`mouseup`
  alone — so the same handler drives mouse, touch, and pen. Pair it with `touch-action: none` in
  CSS on the exact drag surface (not a larger wrapper) so the browser doesn't also try to scroll
  the page underneath the drag. If the CSS sets `touch-action: none` on an element, that element
  **must** have a pointer/touch handler wired to it — CSS signaling touch support with no JS behind
  it is a broken component, not a harmless no-op (this was shipped and fixed once already, see
  `changelogs/` around `r-colorpicker`/`r-progress`). Canonical references: `components/player/core/gestures.ts`
  (touch-only gestures scoped via `pointerType === 'touch'`), `components/mermaid/index.ts` (pan/zoom),
  `components/scratch/index.ts`, `components/colorpicker/index.ts`, `components/progress/index.ts`.
- **A hover-only affordance needs a tap fallback.** `trigger="hover"` on an overlay must degrade to
  click/tap on a touch device — see `r-select` / `r-popover`'s `.includes('hover') && !isMobile()`
  gate (`isMobile()` from `ranuts/utils`). Never ship an interaction that is reachable only via
  `:hover` or `mouseenter` with no click/tap equivalent.
- **Prefer viewport-relative sizing over inventing a breakpoint.** `%`, `min()`, `max()`, `clamp()`,
  `vw`/`vh` (e.g. `r-modal`'s `min(560px, calc(100vw - 32px))`) let a component self-adapt to a
  narrow screen without a `@media` query at all — reach for these first. There is currently **no
  shared breakpoint token** in `theme/tokens.less`; the one existing viewport `@media` query
  (`components/button/index.less`, gating the sticky `:hover` state behind `min-width: 1024px` so
  touch devices don't get a stuck hover) is a local, hardcoded literal. If a component genuinely
  needs a hard breakpoint, don't silently invent another one-off px value — flag it so a shared
  token can be introduced instead of every component picking its own number.
- **Never hide the only way to do something on mobile** — see the "Hiding navigation/affordances
  on mobile" pitfall below; reflow instead of `display:none`.
- **A measured position/size is only correct until the next reflow.** Anything computed from
  `getBoundingClientRect()` — a portaled panel's coordinates, a sliding indicator's offset — goes
  stale on a resize, a container reflow, or (for a portaled panel) a scroll, none of which are the
  interaction that originally triggered the measurement. A body-portaled panel needs `scroll`
  (capture phase, for nested scroll containers) + `resize` listeners while open (both `r-select`
  and `r-popover` get them from `FloatingController`, which is where that lives now); an in-flow
  element needs a
  `ResizeObserver` on the container that actually drives the measurement, not a plain `window`
  `resize` (`r-tabs`'s `_navResizeObserver` on `_nav`, re-running `setTabLine`). Narrow-viewport
  testing (see the checklist) exercises the _initial_ layout at that width — it does not exercise
  _resizing into_ it, which is where this class of bug actually shows up.
- **Verify on both inputs before shipping**, not just both color schemes: click-drag with a mouse
  _and_ touch-drag (or the Chrome DevTools device toolbar's touch emulation) on anything with
  `touch-action` in its CSS; tab/click through anything with `trigger="hover"`; drag the browser
  window narrower/wider (not just load at a fixed width) on anything with a measured position.

---

## 9. Components — how to apply the system

- Use the semantic ranui components (`r-button`, `r-input`, `r-select`, `r-card`, `r-modal`, …) rather than re-building primitives.
- Theme through **CSS variables**, **`::part()`**, or the **`sheet`** attribute (escape hatch). CSS variables cross Shadow DOM; selectors do not.
- Component tokens default to semantic tokens: `var(--ran-btn-background, var(--ran-color-primary, #171717))`.
- Map states to the color ladder: default → `bg`/`text`; hover → `bg-hover` / `border-hover` / `primary-hover`; active → `bg-active` / `primary-active`; disabled → `text-disabled` + reduced opacity; focus → focus ring.
- **Interactive cards opt in**: `r-card` only reacts to hover with the `hoverable` attribute (border 400 → 500 + elevated shadow). Non-interactive cards must stay inert — never add hover feedback to something that isn't clickable.
- **Theme switching UI is a component**: use `<r-theme-switch>` (system / light / dark segmented pill, wired to `setTheme`/localStorage, syncs across instances and updates `theme-color` metas) instead of hand-rolling toggles. Localize with `label` / `label-system` / `label-light` / `label-dark`.
- **Typography ships with the system**: `import 'ranui/fonts'` (or link `dist/fonts/fonts.css`) self-hosts Geist Sans + Geist Mono (variable, OFL-licensed) — the canonical faces behind `--ran-font-family` / `--ran-font-mono`. Without it the stacks fall back to system fonts.
- See [THEME_STYLE_SYSTEM_DESIGN.md](./THEME_STYLE_SYSTEM_DESIGN.md) for the token architecture and [style-tokens-public.md](./style-tokens-public.md) for the generated per-component token list.

---

### A fallback must name a token that exists

`var(--ran-component-thing, var(--ran-color-error))` looks correct and does nothing:
`--ran-color-error` was never declared — the danger colour is `--ran-color-danger`. A `var()`
naming an undeclared property resolves to _nothing_, the whole declaration is dropped, and
the element silently keeps whatever it inherited. For a colour that is usually the body text
colour, which looks almost right, so nothing ever looks broken enough to investigate.

Four error states shipped invisible this way before `verify:design` grew the rule, and it
immediately found three more (`--ran-text-copy-3`, which does not exist either — the 12px
step is `--ran-text-label-3`).

The rule reads the declared names out of `theme/tokens.less`, so adding a token needs no
edit here.

### `hidden` must keep working

A component that sets `display` on `:host` **must** also carry:

```less
:host([hidden]) {
  display: none;
}
```

`[hidden] { display: none }` is a **user-agent** rule, and any author `display` on `:host`
outranks it. Without the guard, `element.hidden = true` leaves the element on screen and
nothing reports an error — which is how nineteen components in this library shipped with
`hidden` doing nothing at all. `verify:design` enforces it because the failure is silent.

### Hold what you build

A component builds its shadow tree once, in the constructor. Every element in it comes back
from the builder, so capture it there:

```ts
const body = createRef<HTMLDivElement>();
this._shadowDom.appendChild(Div().class('ran-thing').children(Div().class('ran-thing-body').ref(body)).build());
this._body = shadowPart(body, 'body');
```

Not `root.querySelector('.ran-thing-body')!`. The query re-derives what the builder already
returned, and it re-derives it through a **string**: rename the class in `index.less` and the
builder and the query drift apart with nothing to catch it. `querySelector` then returns
`null`, the `!` waves it through, and the failure surfaces later as a property read on
nothing — far from the rename that caused it. `shadowPart` throws at construction instead,
naming the field.

This holds because the tree is built **once, in the constructor**, which `verify:design`
also enforces. `appendChild` is unconditional: a second mount from `connectedCallback` would
add a second copy on every reconnect, and its refs would replace the ones the component is
already driving.

It is fair to ask why the tree is not reused from the server-rendered markup instead. It
cannot be. Server rendering does emit a declarative shadow root — the `im` demo page ships
nine of them — but every component attaches a **closed** one, so `host.shadowRoot` is `null`,
`ensureShadowRoot` reaches `attachShadow`, and attaching to an element that already has a
declarative shadow root **removes that root's children**. Measured in a browser:

| `shadowrootmode` | `host.shadowRoot` | children after `attachShadow` |
| ---------------- | ----------------- | ----------------------------- |
| `open`           | the root          | kept                          |
| `closed`         | `null`            | **cleared**                   |

So the server-rendered tree paints the first frame and is then replaced by an identical
client-built one. Reuse would require `mode: 'open'`, and with it the queries this section
exists to remove — refs cannot capture markup the component did not build. Closed shadow
roots are the deliberate choice here, so the factory always runs and the refs are always
filled.

The exception is a container whose children arrive **after** the build — options rendered
from data, nodes a third-party library injects. No ref could have captured those, so the live
query is the only source. Mark it on the line above and say what puts them there:

```ts
// runtime children: r-dropdown-item elements are appended from `options` as it changes.
return Array.from(this._dropdown.querySelectorAll('r-dropdown-item'));
```

The marker needs a reason after the colon; an empty one does not silence the rule.

---

## 10. Component token naming

Component-scoped CSS custom properties (the `var(--ran-{component}-…, fallback)` hooks in each
`index.less`) must follow:

```
--ran-{component}-{element}[-{state}]-{property}
```

- `component` — the existing prefix (`btn`, `select`, `player`, …), unchanged.
- `element` — the single most specific **named UI part** (`progress`, `volume`, `tip`, `dot`,
  `speed`). Drop segments that only describe **position/layout inside an already-named parent**
  and add no new identity (`bottom`, `left`, `right`, `align`, `content` as a bare wrapper). Keep
  a segment when it names a genuinely distinct visual layer — e.g. progress's track vs fill are
  two different things, so they keep two different element names (`track` / `fill`), just short
  ones instead of `wrap` / `wrap-value`.
- `state` — optional, only for a real, independently-toggleable interaction state (`hover`,
  `active`, `focus`, `disabled`, `warning`). Don't invent a state segment that doesn't already
  exist as a distinct override point.
- `property` — the CSS property family being overridden (`background`, `color`, `border-color`,
  `font-size`, `width`, …), as-is.

**Soft ceiling: aim for ≤4 hyphenated segments after `ran`** (component, element, optional state,
property). This is a principle applied by reading the component's structure, not a mechanical
truncation — two genuinely different override points must never collapse into the same name. Do
not encode the full DOM/BEM nesting path into the token name (e.g.
`--ran-player-controller-bottom-right-align-volume-icon-mute-background` is wrong — the position
inside `.controller` isn't part of the token's identity).

| Avoid (full DOM path)                                           | Prefer                                    |
| --------------------------------------------------------------- | ----------------------------------------- |
| `--ran-select-selection-search-input-active-border-right-width` | `--ran-select-search-active-border-width` |
| `--ran-btn-content-hover-background-color`                      | `--ran-btn-hover-background`              |
| `--ran-progress-wrap-value-background`                          | `--ran-progress-fill-background`          |

This applies to **new** component tokens going forward. See `changelogs/2026-08-08.md` for the
pass that brought existing components in line with it (0.5.0-alpha.0).

---

## 11. Composition — the page, not the component

Sections 1–10 govern a component. This one governs what happens when many correct
components are assembled into a surface, which is where this system's most expensive
mistakes have actually occurred. Every rule below is followed by the failure it prevents,
and every failure listed is one that shipped.

### Structure before containers

**Reach for spacing, alignment, weight and a hairline before a box.** A container is a
claim that its contents are a separate object. Most regions need a background, a hairline
and intentional spacing — nothing more.

> A documentation page alternated a bordered demo, a bordered code block, a bordered demo
> down its whole length: 16 boxed surfaces on a component page and 37 on the icon page.
> Nothing was wrong with any single box. The page was exhausting to read because every
> element claimed to be a separate object.

**A box is for a genuinely separate object** — a live demo stage, an overlay, a panel that
floats. Not for a code block, a table, a list row, a previous/next link, or a cell in a
gallery.

**Never nest a box in a box, and never double the padding.** A card inside a padded panel
does not add another inset.

> Three containers each contributed their own top padding — the page column, the landing
> wrapper, and the hero — and the first line of content sat 280px below the header. Each
> value was defensible on its own.

### Emphasis is a budget

**Colour, weight, badges, fills and elevation are scarce.** If everything is emphasised,
nothing reads as important. Establish priority with structure and proximity first, and
spend emphasis on the one thing that deserves it.

**Elevation explains stacking, not importance.** Shadows belong to surfaces that genuinely
float above content — popovers, menus, dialogs, notifications. Do not shadow every card.

### Spacing carries meaning

The scale in §2 is not only a rhythm; each step states a relationship. Choose the step by
what the gap _means_:

| Relationship                   | Step            | Example                           |
| ------------------------------ | --------------- | --------------------------------- |
| Parts of one control           | `--ran-space-1` | an icon and its label             |
| Closely related controls       | `--ran-space-2` | a button row, dialog actions      |
| One content group              | `--ran-space-3` | a form row, a list item's lines   |
| Separate groups in one section | `--ran-space-4` | panel padding, form groups        |
| Separate sections              | `--ran-space-5` | major blocks on a page            |
| Major region boundary          | `--ran-space-6` | empty-state breathing room, bands |

**Inside before outside:** a component's own padding is decided before the gap between
components. **Smaller gap means tighter relationship** — that is the only thing vertical
rhythm communicates, so do not undo it with a decorative divider.

### The measure governs text, not the column

**Running text sits at 60–75 characters per line; everything that is not running text does
not.** A table, a code fence, a demo stage or an image has nothing to gain from a
comfortable line length and everything to lose from being narrowed to one. Cap the text
elements, not the column that holds them.

> A documentation column was capped at the measure, so the cap applied to everything
> inside it. The Properties table wanted 762px inside a 736px cap, silently became a
> scroll container, and lost 26px off its last column — a sentence ending mid-word, which
> reads as a rendering bug rather than as a width.

**Declare the measure in `rem`, never `em`.** `em` resolves against the element's own
font-size, so the larger the type, the longer the line — exactly backwards.

> A deck set one step up from body size inherited a `46em` measure and rendered at 851px
> against body text's 736px: the biggest type on the page got the longest line to read.

**Build hierarchy out of type before reaching for a box.** One step of size and one step
down in colour turns a title and its first sentence into a title and a deck, with no new
container and no new border.

### If the layout says two things are one object, the spacing must agree

**A shared border, a shared radius and a gap between them are a contradiction.** Decide
whether the elements are one object or two, and make every property say the same thing.

> A demo and the fence documenting it were given joined radii (`8px 8px 0 0` above,
> `0 0 8px 8px` below) and a hairline between — and then an 18px channel ran between them
> anyway, because the parent laid its children out with `gap`, which no margin on a child
> can cancel. The shape claimed one object, the spacing claimed two.

**When a value must equal another value, name it.** A gap that a child has to subtract is
not a literal in two places; it is one custom property referenced twice.

### Reserve a column only when its content exists

**A column declared unconditionally is still a column, even on the pages that have nothing
to put in it.** Condition the track on the element actually being there (`:has()`), not on
a page type you assume implies it.

> The outline column was reserved for every page without a sidebar. The landing page has
> no outline, so it laid out as `1144px 224px` and carried 280px of dead space down its
> entire right edge — which read as the whole site being off-centre.

### Alignment is structure, not polish

**Establish alignment spines and hold them.** Sibling regions share a content inset;
repeated rows share column geometry; a nested level returns exactly to its parent's spine
when it ends. A missing optional icon or badge must not move the labels beside it.

**When two edges or gaps are meant to be equal, a one-pixel difference is a defect, not an
optical approximation.**

### Selection, links and other semantic lies

**Selection is persistent state and must not look like hover.** Hover is transient; if the
current item is marked with the same fill hover uses, the interface has two names for one
appearance.

> The current sidebar page was marked with `--ran-color-bg-hover`. It read as "the pointer
> is here", not "you are here".

**`--ran-color-primary` is commitment; `--ran-color-link` is a link.** Primary is
near-black in this system, so prose links coloured with it are indistinguishable from the
text around them.

**A link leaves; a button acts.** Anything that changes application state is a button,
whatever it looks like. Do not style a command as a link to make it quiet, and do not let
a button-shaped link keep an underline.

> Every call-to-action on the home page shipped underlined, because the stylesheet assumed
> a base rule it had never written.

### One product, one token set

**A surface built on this system reads `--ran-*`. It does not define a parallel palette.**
Two token sets in one product are two sources of truth that drift silently — the site keeps
its blue while the components on the same page move to another.

A consumer may alias for readability (`--fg: var(--ran-color-text, …)`) provided every
value resolves from a `--ran-*` token and the fallback is what the surface shows before
this stylesheet loads. It may not invent a second palette.

### Words are part of the interface

**Let context carry context.** Do not repeat what the surrounding surface already
establishes — a sidebar destination is `Users`, not `User Management`; a dialog titled
`Delete "Roadmap"?` does not ask the question again in its body.

**Name the result, not the gesture.** `Save`, `Move`, `Delete` — not `Click to save` or
`Confirm deletion`. `Cancel` is always the action that leaves without committing.

**Sentence case for English UI.** Reserve ALL CAPS for very short eyebrows, statuses and
acronyms; never on a button, a heading or a sentence. Labels, buttons and short states take
no final period; complete explanatory sentences do. Use a single `…` character, and append
it to any control that opens a dialog or needs more input before it can complete.

### Review checklist for a composed surface

Ask in order. A "no" is a finding, not a preference:

1. Can a new reader recognise the purpose and the primary action without guessing?
2. Does every control's label, state and result describe one consistent outcome?
3. Is emphasis scarce — does the core thing get the weight while colour, badges and
   primary buttons stay rare?
4. Could this do less: any entry point, option or state removable without weakening the task?
5. Is the structure exact — shared spines, equal gaps equal to the pixel, no doubled padding?
6. Is running text between 60 and 75 characters per line, and is everything that is **not**
   running text free of that cap?
7. Does every element that looks like part of one object agree — border, radius **and**
   spacing — and does every reserved column actually have content?
8. Does it hold in every state: empty, loading, failure, longest translation, narrow width,
   dark theme, reduced motion, **RTL**?
9. Has it been looked at in a real browser, at more than one width, in both themes?

**A screenshot of the happy path is not proof.** Keyboard behaviour, focus, dynamic
content, themes, resizing and failure states are part of the design.

**Measure it; do not look at it.** Every finding in this section was invisible to the eye
and obvious to `getBoundingClientRect()` — a 26px clip inside a scroll container, an 18px
channel between two elements drawn as one, 280px of dead column, a deck rendering 115px
wider than the body text it sits above. Read the numbers out of a real browser:

```js
// line length in characters, the number this section is actually about
const cs = getComputedStyle(el);
const probe = Object.assign(document.createElement('span'), { textContent: '0123456789' });
probe.style.cssText = `font:${cs.font};visibility:hidden;position:absolute;white-space:pre`;
document.body.append(probe);
const ch = el.getBoundingClientRect().width / (probe.getBoundingClientRect().width / 10);
probe.remove();

// content clipped inside a scroll container — silent by construction
wrap.scrollWidth - wrap.clientWidth;

// the page is wider than the window (an RTL off-screen offset, a stray fixed element)
document.documentElement.scrollWidth > innerWidth;
```

## 12. Information architecture — the shape before the composition

§11 arranges a page whose shape is already settled. This section settles it, so in practice
it runs first. It applies to **information-dense surfaces**: a console, a dashboard, an admin
screen, a workbench, a monitoring page — anywhere the reader has to understand several
objects, several states and the relations between them and then judge and act. It does not
apply to landing pages or single-conversion forms.

Complete data is not a designed page. Every field the endpoint returns can be on screen, with
filters, status tags and bulk actions, and the reader still not know what to look at first.
Nothing is missing; the order is.

### Answer three questions before naming a component

1. **What must the reader see on arrival?** That is the primary information.
2. **What else has to be visible for it to make sense?** Related resources, related models,
   context.
3. **What do they do next?** Judge, act, or keep thinking.

**A page has exactly one primary model.** Supporting models may help the reader understand or
operate it; they may not compete for the first screen.

### The shape follows the task, not the payload

**Do not pick a table because the endpoint returned an array, or a detail page because the
route carries an ID.** The same object takes a different shape under a different task: an
issue is a collection while searching, a status flow while working it, a discussion thread
while collaborating, an event sequence while auditing. A date field in the record means the
data has a date; it does not mean the page is a calendar.

Choose the skeleton that answers the primary question with the fewest mental conversions:

| The reader's question                                    | Skeleton                        |
| -------------------------------------------------------- | -------------------------------- |
| Which of these differs, and how                          | Comparison table                |
| Which one is it, so I can open it                        | List / resource catalog         |
| Which one is it, and the image tells me                  | Card grid                       |
| What is this object, and how is it now                   | Sectioned detail                |
| What does it belong to                                   | Hierarchy tree                  |
| What depends on it, what breaks if it changes            | Adjacency list                  |
| Which step am I on, what follows                         | Step flow                       |
| Which stage is each item in, and moving it _is_ the work  | Kanban                          |
| Why did it stall                                         | Trace drill-down                |
| Is it healthy, how far does the damage reach             | Status wall                     |
| What happened, in what order, by whom                    | Event timeline                  |
| Who said what, how was it answered                       | Discussion thread               |
| What changed, before versus after                        | Diff view                       |
| What is the trend, where is the anomaly                  | Dashboard                       |
| When is it occupied, does it clash                       | Calendar / scheduling           |
| What do I work on next                                   | Master-detail workbench         |
| Which rules apply, what do they affect                   | Configuration form              |
| What does this text say                                  | Continuous document             |
| Where is it                                              | Map / canvas                    |

Six pairs get swapped, and each swap is a real bug: **timeline vs. steps** (what happened vs.
what comes next), **kanban vs. filter** (moving the card must be the action, or the columns are
a filter that costs a drag), **calendar vs. timeline** (occupancy and collision vs. order),
**card grid vs. table** (the image is the recognition anchor, or the numbers are), **graph vs.
adjacency list** (draw the graph only when the path itself is the judgement), **document vs.
field grid** (prose read in order stays prose).

**Do not ship three views because you can.** Each one is another filter set, another status
mapping and another set of actions to keep in sync.

### Each kind of information has a place

| Information   | Belongs                                                      | Must not end up                          |
| ------------- | ------------------------------------------------------------ | ----------------------------------------- |
| Identity      | Title, object summary                                        | The last column, or behind a tab         |
| Status        | Title or summary region                                      | Findable only in a detail field          |
| Attributes    | Detail body, grouped as people think about it                | Flattened in API field order             |
| Relationships | Own region or tab; ownership, dependency, reference distinct | Mixed into the attribute table           |
| Changes       | Diff region, timeline                                        | Shown as the new value only              |
| Evidence      | Beside the judgement, expandable                             | A log page elsewhere                     |
| Actions       | Primary in the title region, the rest beside their object    | Buried under "more"                      |
| Feedback      | Beside the action, keeping task context                      | A global toast detached from its subject |

**Every fact has exactly one authoritative location.** Elsewhere shows a summary or an entry
point that links back to it.

Default reading order — page identity → current status or exception → primary task and primary
action → the information the judgement needs → relationships, changes, evidence → secondary
information and low-frequency actions. **One primary action per task region**, and it is the
most likely next step, not the most destructive one (§11, "Emphasis is a budget", governs how
much weight it may take).

### Density is effective information, not controls per inch

Tightening spacing raises visual density and leaves effective density where it was. Removing
irrelevant fields and putting the comparison in one place raises the real thing.

**Use at most two adjacent density levels on one page** — spacious for first use and risky
confirmation, standard for most lists and details, compact for expert workbenches. Container
padding and line height may tighten; readable body text, a visible focus ring and pointer
target size may not (§8).

### Containers do not fix structure

**`r-modal` is not a navigation layer.** Anything needing a copyable link, history, a
side-by-side comparison, or work that survives a refresh gets a route. Reserve the modal for a
short confirmation or a single field, `r-popover` / `r-dropdown` for transient context, and
`r-disclosure-row` for progressive disclosure.

**`r-tabs` carries peer views of one object** — its conversation, its checks, its diff — never
unrelated modules; that is navigation's job.

**ranui ships no table, tree, calendar, kanban or timeline.** Build one out of the tokens and
the rules above, not out of a second visual system (§11, "One product, one token set").

---

## Verification checklist (before shipping UI)

- [ ] Primary task and primary action are unmistakable.
- [ ] Works in **light and dark**, at **narrow and wide** widths.
- [ ] Works with **mouse and touch** — any drag/gesture uses Pointer Events, not mouse-only; any
      `trigger="hover"` has a tap fallback.
- [ ] All changed **states** exercised (hover, active, focus, disabled, loading, empty, error).
- [ ] **Keyboard / focus** behavior verified; visible focus everywhere.
- [ ] Edge cases: long text, large numbers, both locales (en / zh).
- [ ] Spacing comes from the scale; type uses a role; color uses semantic tokens.
- [ ] `pnpm -F ranui verify:design` passes — it checks the nine mechanical rules above.
- [ ] Copy follows §6; nothing signals state by color alone (§7).
- [ ] For a dense surface: one primary model, the skeleton chosen from the question rather
      than the payload, and every fact with one authoritative location (§12).
