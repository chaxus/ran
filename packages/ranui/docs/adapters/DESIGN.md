# ranui implementation adapter

> An executable design specification — written for humans **and** AI agents.
> When generating or editing ranui UI, follow these rules so output is consistent
> instead of drifting in style. Based on the [Geist design system](https://vercel.com/design)
> ([design.md](https://vercel.com/design.md) / [design.dark.md](https://vercel.com/design.dark.md)).

> Companion documents: [CODING.md](../CODING.md) is the engineering standard for the same code
> (architecture, state ownership, events, testing). The consumer-facing versions are published
> as [Design system](https://ran.chaxus.com/ranui/design-system/),
> [Design guidelines](https://ran.chaxus.com/ranui/design-guides/),
> [Information architecture](https://ran.chaxus.com/ranui/information-architecture/) and
> [Coding guidelines](https://ran.chaxus.com/ranui/coding-guides/) — update those when a
> rule here changes in a way consumers can see.

**MUST**, **SHOULD** and **MAY** mean what [the Ran Design guide](../DESIGN.md) says they mean.

## ranui default visual direction

The default is a quiet, content-first working interface: neutral semantic surfaces, restrained
emphasis and compact desktop controls with reachable touch targets. Distinction comes from
clear typography, proportions and complete states, not a decorative effect on every component.

- **SHOULD** Use existing token roles to choose exact dimensions; do not introduce a second
  "premium" scale.
- **SHOULD** Treat glass and expressive demonstrations as explicit surface or theme choices,
  not as default text or control backgrounds.
- **MUST** Preserve reading contrast and the same interaction semantics across themes.
- **SHOULD** Apply the shared [style brief](../DESIGN.md#components-and-composition)
  before changing a family.
- **SHOULD** Review a family change in a realistic composed page with neighboring controls; a
  polished isolated component does not establish a coherent product.

## How to use this file

- **SHOULD** Prefer **semantic tokens** (`--ran-color-*`, `--ran-space-*`, …) over raw scales or hex.
- **SHOULD** Decide by **role/state**, not by eyeballing a value. The value is chosen for you.
- **SHOULD** When a choice is unresolved, mark it explicitly instead of burying a guess in code.
- **SHOULD** Design **all reachable states** (default, hover, active, focus, disabled, loading,
  empty, error), not just the happy path.
- **MUST** **Verify the rendered result** in the themes and widths the change affects; code review
  alone is not enough.
- **SHOULD** Resolve conflicts in this order: **user goals → verified evidence → this file →
  repo guidance (`CLAUDE.md`) → shipped patterns → general heuristics.**

The guide's [interaction](../DESIGN.md#interaction) section owns observable behavior, and its optional
[product patterns](../DESIGN.md#product-patterns) cover multi-step workflows.

## What is machine-checked

`pnpm -F ranui verify:design` enforces nine source rules: dark-safe and declared token
fallbacks, semantic colors, spacing/sizing scales, Pointer Events, working `hidden`,
held builder references and constructor-only shadow mounting. Repository CI also checks its
configured consumer surfaces. Static checks cannot prove composition or interaction.
See [CODING](../CODING.md#what-is-machine-checked) for engineering checks and
[verifying a change](../DESIGN.md#verifying-a-change) for actual browser evidence and decision authority.

- **MUST** A change adds no new `verify:design` violations; the per-file baseline is a debt
  ratchet, not permission to add violations.
- **MUST** A component that implements a drag drives it with Pointer Events
  (`pointerdown`/`pointermove`/`pointerup`/`pointercancel`), not a `mousemove`-only loop, so touch can drive
  it. (checked by `verify:design` (`mouse-only-drag`))

## Looking at the whole system at once

`pnpm -F ranui design:bundle` captures live documentation components and resolved light/dark
tokens into a browsable bundle. It needs the docs preview running first (`pnpm -F docs build`
then `pnpm -F docs preview`). Cards are rendered ranui output, not drawings of imagined APIs.
The command reports components missing a live demo.

- **SHOULD** Use the bundle from the matching installed version; a reference bundle is not
  evidence that the host application passed acceptance.

## ranui color — a state ladder, not a palette

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

- **SHOULD** **Use the semantic layer in the table below, not the scale, in components.**

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

**Accent meaning:** the **primary action is monochrome** — `--ran-color-primary` is black-on-white in light, white-on-black in dark (matching Vercel's brand tone). There is no separate "contrast" token — primary _is_ the highest-contrast monochrome action.

- **SHOULD** Text and icons on a primary surface use `--ran-color-primary-text` (the inverse,
  which flips too).
- **SHOULD** Reserve **blue** for **links (`--ran-color-link`) and the focus ring** only; green
  means success, amber warning, red danger/error.

**Light & dark:** same token name, different value. `gray-1000` is `#111113` in light and `#ededef` in dark. Components reference the _semantic name_. The dark mixin redefines the base scales plus explicit surface, primary hover/active and shadow overrides.

- **SHOULD** Read the theme declarations rather than assuming every semantic value follows one
  scale step.

**Rules**

- **MUST** Do not hard-code a hex/rgb in a component for a value that follows the theme.
  (checked by `verify:design` (`bare-colour`))
- **MUST** A component token's colour fallback starts with a **token that flips**
  (`var(--ran-gray-alpha-100, …)`, `var(--ran-blue-100, …)`, `var(--ran-color-text, …)`), never a bare
  light-only literal — otherwise it breaks in dark mode. A final literal behind that token, as in
  `var(--ran-btn-background, var(--ran-color-primary, #111113))`, is allowed.
  (checked by `verify:design` (`dark-unsafe-fallback`))

## ranui spacing — a limited, rhythmic scale

A **4px base unit** with **nine values** only: `--ran-space-1..24` → `4, 8, 12, 16, 24, 32, 40, 64, 96`px.

[ranui spacing relationships](#ranui-spacing-relationships) map each relationship to a step.

- **MUST** Pick spacing from the scale; do not invent `20px`/`28px` — a limited set is what
  creates the page's rhythm. (checked by `verify:design` (`spacing-scale`))
- **MUST** Intrinsic dimensions (`width`, `height`, their `min-`/`max-` forms, `font-size`,
  `line-height`, `border-radius`) take `--ran-size-*` or role tokens, never `--ran-space-*`, so consumers can
  retune either scale without perturbing the other. (checked by `verify:design` (`sizing-scale`))

## ranui typography — choose a role, not a size

Fonts: `--ran-font-family` (Geist Sans, UI & prose), `--ran-font-mono` (Geist Mono, code, data, and eyebrow/labels). Base: `--ran-font-size: 14px`, `--ran-line-height: 1.5715`.

The role fixes font, size, weight and line-height. Each row is backed by real tokens in `theme/tokens.less`:

| Role    | Use                           | Weight                                            | Size tokens                               | Notes                                                           |
| ------- | ----------------------------- | ------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| heading | Titles                        | `--ran-text-heading-weight` (600)                 | `--ran-text-heading-1..4` (32/24/20/16px) | Tight tracking `--ran-text-heading-tracking` (≈ -0.03em)        |
| label   | Scannable field/action labels | `--ran-text-label-weight` (500)                   | `--ran-text-label-1..3` (14/13/12px)      | Compact action labels stay on one line; field labels may wrap   |
| copy    | Multi-line body               | `--ran-text-copy-weight` (400)                    | `--ran-text-copy-1..2` (16/14px)          | line-height ~1.55 (`--ran-line-height`)                         |
| button  | Button text                   | `--ran-text-button-weight` (500)                  | `--ran-text-button-size` (14px)           | `--ran-text-button-line-height: 1` for crisp vertical centering |
| mono    | Code, data, eyebrows          | `--ran-text-mono-weight-regular/medium` (400/500) | borrows label/copy size tiers             | `--ran-font-mono`                                               |

- **SHOULD** Decide text style by **role**: ask "what role is this text?" (heading / label /
  copy / button) and the style follows. Do not pick raw px per instance.
- **SHOULD** Reference the role tokens
  (`var(--ran-{component}-…, var(--ran-text-{role}…, fallback))`) instead of hand-copying the px/weight
  number.
- **SHOULD** Follow the Notes column of the role table; for example, compact action labels stay
  on one line while field labels may wrap.

**A role is a tool, not a law.**

- **MAY** Transient/decorative UI that maps to no role (an active-link weight bump, a player
  gesture-flash overlay) keeps its own one-off component token instead of being forced into the nearest
  role — see `r-link`'s `--ran-link-active-font-weight` and `r-player`'s
  `--ran-player-gesture-flash-font-weight`.

## ranui radius & elevation

Radius: `--ran-radius-sm` 6 · `--ran-radius-md` 12 · `--ran-radius-lg` 16 · `--ran-radius-full` 9999.

- **SHOULD** Controls (button, input, select) → `sm`. Cards / dialogs → `md`. Large surfaces →
  `lg`. Pills / avatars → `full`.

**Elevation is a role, not decoration.**

- **SHOULD** Pick the shadow tier from the table below by _what the element is_.
- **SHOULD** Make sure each tier is actually perceptible — a shadow you can't see fails its job.

| Tier    | Token                   | Use for                                                                                                                                           |
| ------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Raised  | `--ran-shadow-elevated` | In-flow surfaces that also have a border — `r-card`, `r-section`. Subtle on purpose.                                                              |
| Overlay | `--ran-shadow-menu`     | Transient layers floating **over** content — `r-dropdown`, `r-select` menu, `r-popover`, tooltips, `r-message`/toast. Clearly lifts off the page. |
| Modal   | `--ran-shadow-modal`    | Blocking dialogs — `r-modal`. Strongest.                                                                                                          |

- **MUST** A floating overlay does not fall back to `--ran-shadow-elevated` (the card tier) — it
  would look flat. (tested in `packages/ranui/test/unit/theme.semantic-tokens.test.ts`)
- **MUST** An overlay's shadow clearly lifts it off the page.

Borderless overlays (dropdown, toast) rely on the shadow alone for separation, so the overlay tiers carry real weight.

**Stacking follows the same roles (z-index ladder).** Floating overlays portal to `<body>`, so they need an explicit stacking tier.

- **MUST** The z-index sits on the element that is **positioned and portaled** (the host); a
  z-index on an inner shadow node is trapped in the host's stacking context and does nothing against page
  content. (tested in `packages/ranui/test/e2e/dropdown-layer.spec.ts`)
- **MUST** Overlays use the stacking tiers in the table below, so a select opened inside a modal
  stays visible. (tested in `packages/ranui/test/e2e/dropdown-layer.spec.ts`)
- **MUST** Toasts and notifications sit on the top tier (`--ran-z-message`), above modals and
  dropdowns.

| Tier     | Token              | Default | Use for                                                                                             |
| -------- | ------------------ | ------- | --------------------------------------------------------------------------------------------------- |
| Modal    | `--ran-z-modal`    | `1000`  | Blocking dialogs (`r-modal`) and their mask.                                                        |
| Dropdown | `--ran-z-dropdown` | `1100`  | Dropdown / select menu / popover. **Above** modal, so a select opened inside a modal stays visible. |
| Message  | `--ran-z-message`  | `1200`  | Toasts / notifications. The top tier.                                                               |

- **MUST** Override a tier globally (set `--ran-z-dropdown` on `:root`) or per component
  (`--ran-dropdown-host-z-index`, `--ran-modal-root-z-index`, `--ran-message-z-index`), never with
  `!important`. (tested in `packages/ranui/test/e2e/dropdown-layer.spec.ts`)
- **MUST** An overlay open while the page scrolls re-runs its placement on `scroll`/`resize` so it
  tracks its trigger (e.g. inside a sticky header). (tested in `packages/ranui/test/unit/utils.floating.test.ts`)

**Host stacking contexts:** a body-portaled overlay compares directly with root chrome;
it usually needs no wrapper elevation. A non-portaled fixed overlay remains trapped in its
ancestor stacking context (`isolation`, `transform`, `opacity`, `filter`, `will-change`).
A blanket elevated wrapper promotes ordinary content above sticky chrome too.

- **MUST** Raise an enclosing wrapper only while that overlay actually paints, including its
  closing transition.
- **SHOULD** Verify reflected open/closing attributes against the component API before using
  selectors.

**Theme switches are not animated.** Transitions are for _interaction_ (hover / focus / press), not for flipping light↔dark. CSS cannot tell _why_ a property changed: any palette prop listed in a `transition` will also fade when the theme flips its token — each component at its own duration, while the host page has already switched. A general-purpose library that did this would impose it on every consumer. For ranui components this adapter deliberately tightens the guide's advice on theme transitions to MUST.

- **MUST** Do not animate a theme switch.
- **MUST** **Palette props get no default transition.** `background` / `background-color`,
  `color`, `border-color`, `box-shadow`, `fill`, `stroke` — none of them, on any element that carries a
  theme-driven color. Hover/focus feedback on these props snaps.
- **MAY** **Motion props may transition.** `transform`, `opacity`, and box-geometry props
  (`left` / `top` / `width` / `height` / `font-size`) do not follow the theme — checkbox pops, tab
  ink-bars, ripples all stay animated.
- **MUST** Do not use `transition: all` or bare-duration shorthands (`transition: 0.2s` —
  which means `all`); they silently include palette props.
- **MUST** Every removed default keeps its `--ran-*-transition` hook var, so a consumer who
  wants palette fades can opt in per component.

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

## ranui components — how to apply the system

- **SHOULD** Reuse existing semantic native controls or supported ranui primitives; do not
  rebuild them merely for styling.
- **SHOULD** Choose a ranui component when its contract fits.
- **MUST** Preserve native form and keyboard semantics, including supported native controls in
  overlay slots ([the guide's focus rules](../DESIGN.md#focus)).
- **SHOULD** Theme through **CSS variables**, **`::part()`**, or the **`sheet`** attribute
  (escape hatch). CSS variables cross Shadow DOM; selectors do not.
- **SHOULD** Component tokens default to semantic tokens:
  `var(--ran-btn-background, var(--ran-color-primary, #111113))`.
- **SHOULD** Map states to the color ladder: default → `bg`/`text`; hover → `bg-hover` /
  `border-hover` / `primary-hover`; active → `bg-active` / `primary-active`; disabled → appropriate
  disabled tokens, with opacity only when needed and still legible; focus → focus ring.
- **MUST** **Interactive cards opt in**: `r-card` only reacts to hover with the `hoverable`
  attribute (border 400 → 500 + elevated shadow). Non-interactive cards stay inert — no hover feedback on
  something that isn't clickable.
- **SHOULD** **When the host needs ranui theme switching UI**, use `<r-theme-switch>` (system /
  light / dark segmented pill, wired to `setTheme`/localStorage, syncs across instances and updates
  `theme-color` metas) instead of hand-rolling equivalent toggles.
- **SHOULD** Preserve an existing host theme authority; the theme-switch recommendation above does not require adding a theme
  switch.
- **SHOULD** Localize `<r-theme-switch>` with `label` / `label-system` / `label-light` /
  `label-dark`.
- **MAY** **Typography ships with the system**: `import 'ranui/fonts'` (or link
  `dist/fonts/fonts.css`) self-hosts Geist Sans + Geist Mono (variable, OFL-licensed) — the canonical
  faces behind `--ran-font-family` / `--ran-font-mono`. Without it the stacks fall back to system fonts.

See [THEME_STYLE_SYSTEM_DESIGN.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/THEME_STYLE_SYSTEM_DESIGN.md) for the repository-only token architecture reference and [style-tokens-public.md](../style-tokens-public.md) for the generated per-component token list.

### A fallback must name a token that exists

For example, `--ran-color-danger` exists; a plausible `--ran-color-error` does not.
[CODING §5](../CODING.md#5-styles) owns enforcement.

- **MUST** Declared tokens, including fallbacks, name tokens that exist in the installed theme;
  an undefined `var()` can silently discard the entire declaration. (checked by `verify:design` (`undefined-token-fallback`))

### `hidden` must keep working

See [CODING §5](../CODING.md#5-styles).

- **MUST** An author `:host` display rule preserves `:host([hidden]) { display: none; }`.
  (checked by `verify:design` (`hidden-inert`))
- **MUST** Hiding optional content also removes accidental gaps.

### Hold what you build

[CODING §2](../CODING.md#2-the-component-skeleton) owns construction, runtime-child exceptions
and SSR implementation. These are engineering requirements, not extra visual recipes.

- **MUST** Append shadow structure in the constructor; content that genuinely cannot exist yet
  is mounted later only with the documented `// deferred mount: <why>` marker on the line above, which also
  says how a second append is prevented. (checked by `verify:design` (`shadow-mount-outside-constructor`))
- **MUST** Retain the references to what you built; do not rediscover them through selectors.
  (checked by `verify:design` (`built-then-queried`))

## ranui component token naming

- **SHOULD** Use `--ran-{component}-{element}[-{state}]-{property}`, keeping the existing
  component prefix.
- **SHOULD** Name the most specific distinct UI part, not its full DOM/BEM path; drop
  wrapper/position segments that add no identity.
- **SHOULD** Keep track/fill as separate parts.
- **MUST** The state segment is optional, and when present corresponds to an independently
  overridable interaction state.
- **SHOULD** Property names retain their CSS meaning.
- **SHOULD** Aim for at most four semantic segments after `ran`, without collapsing distinct
  override points merely to shorten a name.

For example, `--ran-progress-fill-background` names a part; `--ran-progress-wrap-value-background`
encodes implementation nesting. The generated [public catalog](../style-tokens-public.md)
owns available names. This section owns naming.

- **SHOULD** Do not hand-maintain another token catalog.

## Applying generic composition to ranui

- **SHOULD** Map the [navigation-layer rules](../DESIGN.md#shells)
  to ranui as follows: `r-modal` for a short confirmation or a single field, `r-popover` / `r-dropdown`
  for transient context, `r-disclosure-row` for progressive disclosure, and `r-tabs` only for peer views
  of one object.

### ranui spacing relationships

| Relationship             | Token           | Example             |
| ------------------------ | --------------- | ------------------- |
| Parts of one control     | `--ran-space-1` | Icon and label      |
| Closely related controls | `--ran-space-2` | Button row          |
| One content group        | `--ran-space-3` | A list item's lines |
| Separate groups          | `--ran-space-4` | Form groups         |
| Related subsections      | `--ran-space-6` | Compact blocks      |
| Major region boundary    | `--ran-space-8` | Region separation   |

- **SHOULD** Space each relationship with the token the table above maps it to.

**Inside before outside:** these are host composition choices, not fixed component heights. The
generic composition contract owns the relationship; this adapter owns its mapping to the installed
ranui scale.

- **MAY** Major regions use `--ran-space-10` when their relationship warrants it.
- **MUST** Absent descriptions leave no vacant row.
- **SHOULD** For geometry proofs, measure the host, documented shadow parts and slotted text.
- **SHOULD** Use `ranui/testing` for closed-root browser tests.
- **MUST** Do not introduce production shadow queries.
- **SHOULD** Use generated public variables and parts for overrides.
- **MAY** Consumer aliases may improve naming while deriving their values from the existing
  `--ran-*` foundation.

```css
.workspace {
  --app-command-target: var(--ran-size-7);
  --app-command-gap: var(--ran-space-2);
  color: var(--ran-color-text);
  background: var(--ran-color-bg);
  font-family: var(--ran-font-family);
}
.workspace-command {
  min-block-size: var(--app-command-target);
  border-radius: var(--ran-radius-sm);
}
```

The 32px target illustrates one host role, not a universal minimum. ranui ships no table, tree,
calendar, kanban or timeline.

- **MUST** Verify coarse-input bounds independently.
- **SHOULD** Where table, tree, calendar, kanban or timeline views are needed, use semantic
  host implementations with these same foundation roles.

## ranui reading integration

`r-conversation` exposes `pinned` and `pinnedchange`; consult
[the generated contract](../COMPONENTS.md). It does not own jobs or persistence.
Use it only when an append-only log fits the task. Host state remains authoritative.
