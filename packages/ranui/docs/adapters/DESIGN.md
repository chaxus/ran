# ranui implementation adapter

> An executable design specification — written for humans **and** AI agents.
> When generating or editing ranui UI, follow these rules so output is consistent
> instead of drifting in style. Based on the [Geist design system](https://vercel.com/design)
> ([design.md](https://vercel.com/design.md) / [design.dark.md](https://vercel.com/design.dark.md)).

> Companion documents: [CODING.md](../CODING.md) is the engineering standard for the same code
> (architecture, state ownership, events, testing). The consumer-facing versions are published
> as [Design system](https://ran.chaxus.com/src/ranui/design-system/),
> [Design guidelines](https://ran.chaxus.com/src/ranui/design-guides/),
> [Information architecture](https://ran.chaxus.com/src/ranui/information-architecture/) and
> [Coding guidelines](https://ran.chaxus.com/src/ranui/coding-guides/) — update those when a
> rule here changes in a way consumers can see.

## ranui default visual direction

The default is a quiet, content-first working interface: neutral semantic surfaces, restrained
emphasis and compact desktop controls with reachable touch targets. Distinction comes from
clear typography, proportions and complete states, not a decorative effect on every component.
Use existing token roles to choose exact dimensions; do not introduce a second "premium" scale.
Glass and expressive demonstrations are explicit surface/theme choices, not default text/control
backgrounds. Preserve reading contrast and the same interaction semantics across themes.

Apply the shared [style brief](../DESIGN.md#style-coherence-across-components-and-pages) before
changing a family. Review it in a realistic composed page with neighboring controls; a polished
isolated component does not establish a coherent product.

## How to use this file

- Prefer **semantic tokens** (`--ran-color-*`, `--ran-space-*`, …) over raw scales or hex.
- Decide by **role/state**, not by eyeballing a value. The value is chosen for you.
- When a choice is unresolved, mark it explicitly — don't bury a guess in code.
- Design **all reachable states** (default, hover, active, focus, disabled, loading, empty, error), not just the happy path.
- **Verify the rendered result**, in light and dark, at narrow and wide widths — code review alone is not enough.

For observable behavior, read [INTERACTION.md](../INTERACTION.md). The short
[interface index](../INTERFACE_GUIDE.md) routes other decisions to their owner; optional task
recipes live separately in [WORKFLOW_PATTERNS.md](../WORKFLOW_PATTERNS.md).

Conflict resolution order: **user goals → verified evidence → this file → repo guidance (`CLAUDE.md`) → shipped patterns → general heuristics.**

## What is machine-checked

`pnpm -F ranui verify:design` enforces nine source rules: dark-safe and declared token
fallbacks, semantic colors, spacing/sizing scales, Pointer Events, working `hidden`,
held builder references and constructor-only shadow mounting. Repository CI also checks its
configured consumer surfaces. Its per-file baseline is a debt ratchet, never permission to
add violations. Static checks do not prove composition or interaction.
See [CODING](../CODING.md#what-is-machine-checked) for engineering checks and
[ACCEPTANCE](../ACCEPTANCE.md) for actual browser evidence and decision authority.

## Looking at the whole system at once

`pnpm -F ranui design:bundle` captures live documentation components and resolved light/dark
tokens into a browsable bundle. Start the docs preview first (`pnpm -F docs build` then
`pnpm -F docs preview`). Cards are rendered ranui output, not drawings of imagined APIs.
The command reports components missing a live demo. Use the matching installed version;
a reference bundle is not evidence that the host application passed acceptance.

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

**Light & dark:** same token name, different value. `gray-1000` is `#171717` in light and `#ededed` in dark. Components reference the _semantic name_. The dark mixin redefines the base scales plus explicit surface, primary hover/active and shadow overrides; read the theme declarations rather than assuming every semantic value follows one scale step.

**Rules**

- Never hard-code a hex/rgb in a component for a value that should follow the theme.
- A component token's fallback must point at a **token that flips** (`var(--ran-gray-alpha-100, …)`, `var(--ran-blue-100, …)`, `var(--ran-color-text, …)`), never a light-only literal — otherwise it breaks in dark mode.

## ranui spacing — a limited, rhythmic scale

A **4px base unit** with **nine values** only: `--ran-space-1..24` → `4, 8, 12, 16, 24, 32, 40, 64, 96`px.

**Rhythm**

- `8px` between elements inside a group.
- `16px` between groups.
- `32–40px` between sections.

**Rule:** pick a value from the scale. Don't invent `20px`/`28px` — a limited set is what creates the page's rhythm.

## ranui typography — choose a role, not a size

Fonts: `--ran-font-family` (Geist Sans, UI & prose), `--ran-font-mono` (Geist Mono, code, data, and eyebrow/labels). Base: `--ran-font-size: 14px`, `--ran-line-height: 1.5715`.

Decide by **role**; the role fixes font, size, weight, line-height. Each row is backed by real tokens in `theme/tokens.less` — reference them (`var(--ran-{component}-…, var(--ran-text-{role}…, fallback))`), don't hand-copy the px/weight number:

| Role    | Use                           | Weight                                            | Size tokens                               | Notes                                                           |
| ------- | ----------------------------- | ------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| heading | Titles                        | `--ran-text-heading-weight` (600)                 | `--ran-text-heading-1..4` (32/24/20/16px) | Tight tracking `--ran-text-heading-tracking` (≈ -0.03em)        |
| label   | Scannable field/action labels | `--ran-text-label-weight` (500)                   | `--ran-text-label-1..3` (14/13/12px)      | Compact action labels stay on one line; field labels may wrap   |
| copy    | Multi-line body               | `--ran-text-copy-weight` (400)                    | `--ran-text-copy-1..2` (16/14px)          | line-height ~1.55 (`--ran-line-height`)                         |
| button  | Button text                   | `--ran-text-button-weight` (500)                  | `--ran-text-button-size` (14px)           | `--ran-text-button-line-height: 1` for crisp vertical centering |
| mono    | Code, data, eyebrows          | `--ran-text-mono-weight-regular/medium` (400/500) | borrows label/copy size tiers             | `--ran-font-mono`                                               |

**Rule:** ask "what role is this text?" (heading / label / copy / button) — the style follows. Don't pick raw px per instance.

**A role is a tool, not a law.** Transient/decorative UI that doesn't map to any role (an active-link weight bump, a player gesture-flash overlay) keeps its own one-off component token instead of being forced into the nearest role — see `r-link`'s `--ran-link-active-font-weight` and `r-player`'s `--ran-player-gesture-flash-font-weight`.

## ranui radius & elevation

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

**Host stacking contexts:** a body-portaled overlay compares directly with root chrome;
it usually needs no wrapper elevation. A non-portaled fixed overlay remains trapped in its
ancestor stacking context (`isolation`, `transform`, `opacity`, `filter`, `will-change`).
Raise an enclosing wrapper only while that overlay actually paints, including its closing
transition. A blanket elevated wrapper promotes ordinary content above sticky chrome too.
Verify reflected open/closing attributes against the component API before using selectors.

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

## 9. Components — how to apply the system

- Reuse existing semantic native controls or supported ranui primitives; do not rebuild them merely for styling. Choose a ranui component when its contract fits; preserve native form and keyboard semantics, including supported native controls in overlay slots ([INTERACTION §2](../INTERACTION.md#2-reachable-controls-and-predictable-focus)).
- Theme through **CSS variables**, **`::part()`**, or the **`sheet`** attribute (escape hatch). CSS variables cross Shadow DOM; selectors do not.
- Component tokens default to semantic tokens: `var(--ran-btn-background, var(--ran-color-primary, #171717))`.
- Map states to the color ladder: default → `bg`/`text`; hover → `bg-hover` / `border-hover` / `primary-hover`; active → `bg-active` / `primary-active`; disabled → appropriate disabled tokens, with opacity only when needed and still legible; focus → focus ring.
- **Interactive cards opt in**: `r-card` only reacts to hover with the `hoverable` attribute (border 400 → 500 + elevated shadow). Non-interactive cards must stay inert — never add hover feedback to something that isn't clickable.
- **When the host needs ranui theme switching UI**, use `<r-theme-switch>` (system / light / dark segmented pill, wired to `setTheme`/localStorage, syncs across instances and updates `theme-color` metas) instead of hand-rolling equivalent toggles. Preserve an existing host theme authority; this does not require adding a theme switch. Localize with `label` / `label-system` / `label-light` / `label-dark`.
- **Typography ships with the system**: `import 'ranui/fonts'` (or link `dist/fonts/fonts.css`) self-hosts Geist Sans + Geist Mono (variable, OFL-licensed) — the canonical faces behind `--ran-font-family` / `--ran-font-mono`. Without it the stacks fall back to system fonts.
- See [THEME_STYLE_SYSTEM_DESIGN.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/THEME_STYLE_SYSTEM_DESIGN.md) for the repository-only token architecture reference and [style-tokens-public.md](../style-tokens-public.md) for the generated per-component token list.

### A fallback must name a token that exists

Check declared tokens, including fallbacks, against the installed theme. For example,
`--ran-color-danger` exists; a plausible `--ran-color-error` does not. An undefined `var()`
can silently discard the entire declaration. [CODING §5](../CODING.md#5-styles) owns enforcement.

### `hidden` must keep working

An author `:host` display rule must preserve `:host([hidden]) { display: none; }`.
See [CODING §5](../CODING.md#5-styles); hiding optional content must also remove accidental gaps.

### Hold what you build

Build shadow structure once and retain its references; do not rediscover it through selectors.
[CODING §2](../CODING.md#2-the-component-skeleton) owns construction, runtime-child exceptions
and SSR implementation. These are engineering requirements, not extra visual recipes.

## 10. Component token naming

Use `--ran-{component}-{element}[-{state}]-{property}`. Keep the existing component prefix;
name the most specific distinct UI part, not its full DOM/BEM path. Keep track/fill as
separate parts; drop wrapper/position segments that add no identity. State is optional and
must correspond to an independently overridable interaction state. Property names retain
their CSS meaning. Aim for at most four semantic segments after `ran`, without collapsing
distinct override points merely to shorten a name.

For example, `--ran-progress-fill-background` names a part; `--ran-progress-wrap-value-background`
encodes implementation nesting. The generated [public catalog](../style-tokens-public.md)
owns available names. This section owns naming; do not hand-maintain another catalog.

## Applying generic composition to ranui

### ranui spacing relationships

| Relationship             | Token           | Example             |
| ------------------------ | --------------- | ------------------- |
| Parts of one control     | `--ran-space-1` | Icon and label      |
| Closely related controls | `--ran-space-2` | Button row          |
| One content group        | `--ran-space-3` | A list item's lines |
| Separate groups          | `--ran-space-4` | Form groups         |
| Related subsections      | `--ran-space-6` | Compact blocks      |
| Major region boundary    | `--ran-space-8` | Region separation   |

**Inside before outside:** these are host composition choices, not fixed component heights.
Major regions can use `--ran-space-10` when their relationship warrants it. Absent descriptions
leave no vacant row. The generic composition contract owns the relationship; this adapter owns
its mapping to the installed ranui scale.

For geometry proofs, measure the host, documented shadow parts and slotted text. Use
`ranui/testing` for closed-root browser tests; do not introduce production shadow queries.
Use generated public variables and parts for overrides. Consumer aliases may improve naming
while deriving their values from the existing `--ran-*` foundation.

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

The 32px target illustrates one host role, not a universal minimum. Verify coarse-input
bounds independently. ranui ships no table, tree, calendar, kanban or timeline; use semantic
host implementations with these same foundation roles where those views are needed.
