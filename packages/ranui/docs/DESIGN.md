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

For observable behavior, read [INTERACTION.md](./INTERACTION.md). The short
[interface index](./INTERFACE_GUIDE.md) routes other decisions to their owner; optional task
recipes live separately in [WORKFLOW_PATTERNS.md](./WORKFLOW_PATTERNS.md).

Conflict resolution order: **user goals → verified evidence → this file → repo guidance (`CLAUDE.md`) → shipped patterns → general heuristics.**

## What is machine-checked

`pnpm -F ranui verify:design` enforces nine source rules: dark-safe and declared token
fallbacks, semantic colors, spacing/sizing scales, Pointer Events, working `hidden`,
held builder references and constructor-only shadow mounting. Repository CI also checks its
configured consumer surfaces. Its per-file baseline is a debt ratchet, never permission to
add violations. Static checks do not prove composition or interaction.
See [CODING](./CODING.md#what-is-machine-checked) for engineering checks and
[ACCEPTANCE](./ACCEPTANCE.md) for actual browser evidence and decision authority.

## Looking at the whole system at once

`pnpm -F ranui design:bundle` captures live documentation components and resolved light/dark
tokens into a browsable bundle. Start the docs preview first (`pnpm -F docs build` then
`pnpm -F docs preview`). Cards are rendered ranui output, not drawings of imagined APIs.
The command reports components missing a live demo. Use the matching installed version;
a reference bundle is not evidence that the host application passed acceptance.

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

**Light & dark:** same token name, different value. `gray-1000` is `#171717` in light and `#ededed` in dark. Components reference the _semantic name_. The dark mixin redefines the base scales plus explicit surface, primary hover/active and shadow overrides; read the theme declarations rather than assuming every semantic value follows one scale step.

**Rules**

- Never hard-code a hex/rgb in a component for a value that should follow the theme.
- A component token's fallback must point at a **token that flips** (`var(--ran-gray-alpha-100, …)`, `var(--ran-blue-100, …)`, `var(--ran-color-text, …)`), never a light-only literal — otherwise it breaks in dark mode.

## 2. Spacing — a limited, rhythmic scale

A **4px base unit** with **nine values** only: `--ran-space-1..24` → `4, 8, 12, 16, 24, 32, 40, 64, 96`px.

**Rhythm**

- `8px` between elements inside a group.
- `16px` between groups.
- `32–40px` between sections.

**Rule:** pick a value from the scale. Don't invent `20px`/`28px` — a limited set is what creates the page's rhythm.

## 3. Typography — choose a role, not a size

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

**Host stacking contexts:** a body-portaled overlay compares directly with root chrome;
it usually needs no wrapper elevation. A non-portaled fixed overlay remains trapped in its
ancestor stacking context (`isolation`, `transform`, `opacity`, `filter`, `will-change`).
Raise an enclosing wrapper only while that overlay actually paints, including its closing
transition. A blanket elevated wrapper promotes ordinary content above sticky chrome too.
Verify reflected open/closing attributes against the component API before using selectors.

## 5. Motion — prefer none

Durations: `--ran-motion-duration-fast` `0.15s`, `--ran-motion-duration-base` `0.2s`.

| Duration | Use                                                                     |
| -------- | ----------------------------------------------------------------------- |
| 0ms      | Frequent hover, focus and keyboard feedback; changes already understood |
| ~150ms   | Optional, purposeful small motion, not a mandatory hover delay          |
| ~200ms   | Menu/popover motion when it clarifies the layer change                  |
| ~300ms   | Dialog motion when orientation benefits from it                         |

**Principle:** purpose and frequency determine whether motion earns time. Repeated interaction defaults
to immediate feedback; a larger change is not automatically a reason to animate. Use existing tokens
for purposeful motion, keep it quick and interruptible, and respect `prefers-reduced-motion`.

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

## 6. Content — copy is part of the system

- **Buttons:** name the outcome. Include the object when context does not establish it: "Deploy project", "Delete member". In a clearly named object or dialog, "Save" or "Delete" is sufficient; avoid generic "OK". See [contextual wording](#words-are-part-of-the-interface).
- **Errors:** say **what happened**, then **how to fix it**. ✅ "Build failed: the bundle exceeds the size limit. Reduce it or raise the limit." ❌ "Operation failed, please try again."
- **Confirmations / toasts:** state the completed **change**. ✅ "Project deleted". ❌ "Operation successful". Show completion feedback only after the operation is confirmed.
- Be specific; every sentence should remove guesswork, not add it.

## 7. Accessibility — the system serves everyone

- Maintain sufficient text-to-background contrast (**WCAG AA**).
- **Never signal state with color alone** — pair it with an icon or text (e.g. ✓ / ✕ labels, not just green/red).
- Every interactive element has a **visible focus ring** — `--ran-focus-ring`, or `outline: 2px solid var(--ran-color-primary); outline-offset: 2px`. Never remove it for "cleanliness".
- **Full keyboard navigation** — nothing is mouse-only.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.

## 8. Input & viewport — mobile and desktop, both

- Support mouse, keyboard and touch at narrow and wide widths. Reflow controls instead of
  hiding the only route to an action. A hover affordance needs a click/tap alternative.
- Drags use Pointer Events including cancellation; scope `touch-action` to the actual drag
  surface and pair it with a real handler. Preserve ordinary scrolling elsewhere.
- Prefer content/viewport-relative bounds (`min()`, `max()`, `clamp()`) to arbitrary
  breakpoints. The foundation currently declares no shared breakpoint token; introduce
  a justified shared role if repeated library needs emerge.
- A measured position becomes stale after resize, container reflow or scroll. Exercise
  resizing into a narrow layout, not only loading there. Overlay placement must track its
  trigger while open. [CODING](./CODING.md#3-state-and-ownership) owns lifecycle mechanics.
- Test actual pointer/touch gestures, hover fallback and keyboard routes where affected;
  checking two color schemes does not establish input parity.

## 9. Components — how to apply the system

- Reuse existing semantic native controls or supported ranui primitives; do not rebuild them merely for styling. Choose a ranui component when its contract fits; preserve native form and keyboard semantics, including supported native controls in overlay slots ([INTERACTION §2](./INTERACTION.md#2-reachable-controls-and-predictable-focus)).
- Theme through **CSS variables**, **`::part()`**, or the **`sheet`** attribute (escape hatch). CSS variables cross Shadow DOM; selectors do not.
- Component tokens default to semantic tokens: `var(--ran-btn-background, var(--ran-color-primary, #171717))`.
- Map states to the color ladder: default → `bg`/`text`; hover → `bg-hover` / `border-hover` / `primary-hover`; active → `bg-active` / `primary-active`; disabled → appropriate disabled tokens, with opacity only when needed and still legible; focus → focus ring.
- **Interactive cards opt in**: `r-card` only reacts to hover with the `hoverable` attribute (border 400 → 500 + elevated shadow). Non-interactive cards must stay inert — never add hover feedback to something that isn't clickable.
- **When the host needs ranui theme switching UI**, use `<r-theme-switch>` (system / light / dark segmented pill, wired to `setTheme`/localStorage, syncs across instances and updates `theme-color` metas) instead of hand-rolling equivalent toggles. Preserve an existing host theme authority; this does not require adding a theme switch. Localize with `label` / `label-system` / `label-light` / `label-dark`.
- **Typography ships with the system**: `import 'ranui/fonts'` (or link `dist/fonts/fonts.css`) self-hosts Geist Sans + Geist Mono (variable, OFL-licensed) — the canonical faces behind `--ran-font-family` / `--ran-font-mono`. Without it the stacks fall back to system fonts.
- See [THEME_STYLE_SYSTEM_DESIGN.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/THEME_STYLE_SYSTEM_DESIGN.md) for the repository-only token architecture reference and [style-tokens-public.md](./style-tokens-public.md) for the generated per-component token list.

### A fallback must name a token that exists

Check declared tokens, including fallbacks, against the installed theme. For example,
`--ran-color-danger` exists; a plausible `--ran-color-error` does not. An undefined `var()`
can silently discard the entire declaration. [CODING §5](./CODING.md#5-styles) owns enforcement.

### `hidden` must keep working

An author `:host` display rule must preserve `:host([hidden]) { display: none; }`.
See [CODING §5](./CODING.md#5-styles); hiding optional content must also remove accidental gaps.

### Hold what you build

Build shadow structure once and retain its references; do not rediscover it through selectors.
[CODING §2](./CODING.md#2-the-component-skeleton) owns construction, runtime-child exceptions
and SSR implementation. These are engineering requirements, not extra visual recipes.

## 10. Component token naming

Use `--ran-{component}-{element}[-{state}]-{property}`. Keep the existing component prefix;
name the most specific distinct UI part, not its full DOM/BEM path. Keep track/fill as
separate parts; drop wrapper/position segments that add no identity. State is optional and
must correspond to an independently overridable interaction state. Property names retain
their CSS meaning. Aim for at most four semantic segments after `ran`, without collapsing
distinct override points merely to shorten a name.

For example, `--ran-progress-fill-background` names a part; `--ran-progress-wrap-value-background`
encodes implementation nesting. The generated [public catalog](./style-tokens-public.md)
owns available names. This section owns naming; do not hand-maintain another catalog.

## 11. Composition — the page, not the component

Choose the page structure in §12 first; then compose its components with these rules.

### Structure before containers

**Reach for spacing, alignment, weight and a hairline before a box.** A container is a
claim that its contents are a separate object. Most regions need a background, a hairline
and intentional spacing — nothing more.

**A box is for a genuinely separate object** — a live demo stage, an overlay, a panel that
floats. Not for a code block, a table, a list row, a previous/next link, or a cell in a
gallery.

**Avoid redundant nested containers and doubled padding.** A card inside a padded panel
does not need another decorative frame or inset. Keep functionally required nested controls or
surfaces, and coordinate their radii with the actual inset; containment alone is not a reason to add a box.

**Every persistent boundary needs a distinct job.** Start with headings, alignment and proximity
to group content. Add a border, surface fill or elevation only when that structure leaves a real
boundary unclear. Do not repeat the same grouping with a panel frame, a nested card, row rules
and another inset at the same time. Faint lines are still extra hierarchy; reducing their contrast
or shortening them does not justify a redundant enclosure.

| Boundary                | Keep when it communicates                                               | Remove when it only repeats                                           |
| ----------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Field/control frame     | Where values can be entered or a selection made                         | A decorative wrapper around already legible commands                  |
| Region frame or divider | An independent viewport, resize boundary or major change of task        | A title and gap that already make the same group clear                |
| Nested surface          | A distinct floating layer, preview, drop target or interaction boundary | Another container inside an established settings pane                 |
| Focus/selection outline | Keyboard focus or persistent selection state                            | Never remove this state cue merely to make the resting layout quieter |

Review the full pane or page, not only the cropped group. For every remaining stable outline,
fill or separator, name the relationship or interaction it communicates and check what becomes
ambiguous if it is removed. A frame is optional; a reachable, recognisable control is not.

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
| Related subsections            | `--ran-space-6` | compact content blocks            |
| Major region boundary          | `--ran-space-8` | empty-state breathing room, bands |

**Inside before outside:** a component's own padding is decided before the gap between
components. **Smaller gap means tighter relationship** — that is the only thing vertical
rhythm communicates, so do not undo it with a decorative divider.

### Vertical rhythm across sibling views

Repeat relationships, not fixed heights. In compact panes, title/description and field/hint
pairs can start at `--ran-space-2` (8px), separate groups at `--ran-space-4` (16px), related
subsections at `--ran-space-6` (24px), major regions at `--ran-space-8`/`--ran-space-10`
(32/40px). These are host choices, not component defaults; retain the table's 12px content-group
role where it fits. Translations grow naturally; missing descriptions leave no vacant row.

Give each gap one owner: parent stack or explicit child margin. Reset authored local heading/
paragraph margins rather than adding them to the parent's gap. Account for owned control padding,
collapsing margins and inline baseline space; do not compensate with transforms or smaller type.
Place hints with the field/action they explain. Hidden helpers leave no accidental gap; a reserved
async status line needs a stated purpose and bounds.

Measure both axes after content settles. `next.top - previous.bottom` measures frame separation,
not glyph/line-box space. Keep leading, padding and hairlines distinct: 16px padding plus a 1px
rule is not a 17px spacing token. Use independent expectations and exercise wrapping, resizing,
helper/error visibility and relevant density. [ACCEPTANCE](./ACCEPTANCE.md#browser-proof) owns
settling and mutation checks for doubled margins, phantom rows and text-only drift.

### The measure governs text, not the column

**Choose a readable measure for the actual script and font.** For Latin prose, 60–75
characters per line is a starting heuristic, not a universal range for every writing system.
Review realistic text at supported widths, zoom levels and font fallbacks; CJK and mixed-script
text need their own judgment. [WCAG visual presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
also distinguishes CJK in its Level AAA criterion; it is not a mandatory library default.
A table, code fence, demo stage or image should retain the width its content needs.
Cap the text elements, not the column that holds them.

**Declare the measure in `rem`, never `em`.** `em` resolves against the element's own
font-size, so the larger the type, the longer the line — exactly backwards.

**Build hierarchy out of type before reaching for a box.** One step of size and one step
down in colour turns a title and its first sentence into a title and a deck, with no new
container and no new border.

### If the layout says two things are one object, the spacing must agree

**A shared border, a shared radius and a gap between them are a contradiction.** Decide
whether the elements are one object or two, and make every property say the same thing.

**When a value must equal another value, name it.** A gap that a child has to subtract is
not a literal in two places; it is one custom property referenced twice.

### Reserve a column only when its content exists

**A column declared unconditionally is still a column, even on the pages that have nothing
to put in it.** Condition the track on the element actually being there (`:has()`), not on
a page type you assume implies it.

### Alignment is structure, not polish

**Name each alignment spine and the geometry it aligns.** A page content spine, navigation
column and nested form-label spine can differ intentionally. State which siblings share each one;
include headers, body copy, rows, actions and empty/loading/error content. A back button plus gap
may establish a separate title column: do not silently treat that title as aligned to body text.
A missing optional icon or badge must not move labels out of their declared column. A nested level
returns exactly to its parent's spine when it ends.

Compare the right boxes. These are separate measurements, even when they happen to coincide:

| Geometry      | What to measure                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Frame         | The wrapper/host border box from `getBoundingClientRect()`                                        |
| Content       | The inner edge after the actual border and padding, including nested wrappers                     |
| Text          | A DOM `Range` around the rendered label's text nodes; use first/last line rectangles for wrapping |
| Icon viewport | The SVG/viewbox or image box; painted glyph ink may be asymmetric inside it                       |
| Hit area      | The actual event target and its hover/focus surface; verify points near its edges                 |

A button frame aligned with a paragraph does not prove its text is aligned: internal padding can
move the label while the frame stays fixed. `Range` gives typographic geometry, not exact glyph ink;
inspect optical glyph corrections separately. For ranui, measure the host and relevant documented
shadow parts as well as slotted light-DOM text. Use the existing `ranui/testing` seam for closed roots
in browser tests; do not add production shadow queries or assume document CSS crosses the boundary.

**Keep a header command's hit zone separate from layout filler.** A title/menu trigger should hug
its content plus deliberate padding, bounded by the available width. Let a separate flex/grid track
absorb remaining space. Define truncation/wrapping and adjacent action behavior for long translations.
Do not make an entire unused header strip clickable merely by giving the title button `flex: 1`.
A row that intentionally selects its whole width is a different role; record that contract explicitly.
Coarse-pointer targets may grow without stretching the hover fill across unrelated content.

**Count every inset from the shared ancestor to the visible text.** Parent padding, nested panel
padding, a control's internal padding, borders and navigation columns all contribute. Remove a
redundant inset at its owner instead of cancelling it with an unexplained negative margin. Empty
states retain their region's content spine and width; extra breathing room must not introduce a
second left edge or make a compact action fill the region. Product-specific insets and target sizes
remain application aliases, not new foundation values or universal component defaults.

**When two layout edges or gaps are meant to be equal, a one-pixel difference is a defect.**
Optical correction for an asymmetric glyph is a separate, documented asset/component decision:
reuse the correction at supported sizes while preserving exact sibling gaps, baselines and alignment
spines. It is not permission to nudge page margins until a screenshot looks balanced.

### Selection, links and other semantic lies

**Selection is persistent state and must not look like hover.** Hover is transient; if the
current item is marked with the same fill hover uses, the interface has two names for one
appearance.

**`--ran-color-primary` is commitment; `--ran-color-link` is a link.** Primary is
near-black in this system, so prose links coloured with it are indistinguishable from the
text around them.

**A link leaves; a button acts.** Anything that changes application state is a button,
whatever it looks like. Do not style a command as a link to make it quiet, and do not let
a button-shaped link keep an underline.

### Command hierarchy in constrained panes

**Remove redundant group enclosures without erasing control affordance.** Headings,
alignment and proximity establish groups inside a settings pane; they do not automatically
make an icon and label look clickable. Do not require flat rows in every context. Use them
when a recognizable menu/list pattern already conveys action. Standalone commands may need
their own restrained button surface or functional stroke, visible before hover in every
supported theme. A button's own shape identifies its target; an enclosing card, muted group
fill and row rules must still pass the distinct-boundary test above.

Do not rely on hover, pointer cursors, verb labels or keyboard focus alone for initial
discovery. Inspect the resting full pane with the pointer away, including touch use. Keep
hover, press, disabled and keyboard focus distinguishable after the control is discovered.
Long translated labels may wrap inside a single command column rather than creating a
ragged horizontal button cloud. Do not add navigation chevrons to immediate commands.

Declare which visible columns are shared with adjacent checkboxes or controls: measure
icon/checkbox edges and text Ranges, not only button rectangles or alignment within the
command group. A hit target may extend into an owned gutter to preserve those columns;
name the extension, keep it inside its pane and verify non-overlap and focus visibility.

Separate destructive commands from recovery and transfer actions. A danger label and icon
can communicate intent without a large red outline on every resting command; reserve the
strongest danger fill for explicit confirmation. Keep confirmation, cancellation, focus
return and busy guards. Acceptance covers resting discoverability, declared shared columns,
full-pane boundary hierarchy, target bounds, label clipping, contrast and interaction states.
An automated surface-difference check catches invisible control fills but does not prove
that users recognize the action: inspect the actual render as well. Reuse foundation roles
and coarse-input target requirements; this guidance changes no component defaults.

### One product, one token set

**A surface built on this system reads `--ran-*`. It does not define a parallel palette.**
Two token sets in one product are two sources of truth that drift silently — the site keeps
its blue while the components on the same page move to another.

A consumer may alias for readability (`--fg: var(--ran-color-text, …)`) provided every
value resolves from a `--ran-*` token and the fallback is what the surface shows before
this stylesheet loads. It may not invent a second palette.

### Density follows control roles

Spacing, intrinsic dimensions and hit targets solve different problems. A small glyph can have
a larger native button target. Measure actual hit bounds, focus and adjacent gaps; derive repeated
host aliases from foundation tokens, not one application's dimensions copied across the library.

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

This illustrates a host's 32px starting target, not a universal minimum. Choose larger coarse-input
bounds where needed; do not enlarge every glyph or reserve space for hidden controls. Use generated
public variables/parts for ranui overrides. Name icon-only controls accessibly and document legitimate
viewport, hairline, artwork and optical geometry exceptions.

### Evaluate craft through evidence

Polish follows task clarity, not a preset of cards, blur or entrances. Evaluate the smallest
intervention against real content, language, device and repeated use. Primary references answer
specific questions: [Linear hierarchy](https://linear.app/now/behind-the-latest-design-refresh),
[Geist typography](https://vercel.com/geist/typography),
[optical alignment](https://craft.gustavofior.com/optical-alignment) and
[interruptibility](https://craft.gustavofior.com/interruptibility). Adapt their principles with
ran's tokens and actual capabilities; do not copy a product's pixel sizes or import recipes as rules.

When direction is unresolved, compare two small real-ran variants with the same content, width
and theme, changing one dimension at a time. Explain what each difference does for the task.
A clear direction or small correction proceeds directly; there is no mandatory approval ritual.

- Balance short headings progressively with `text-wrap: balance`, preserving normal wrapping.
  Do not insert locale-dependent manual breaks or clip text to preserve a screenshot. Check cost
  and support before using `pretty` on long live content.
- Tabular figures stabilize digit advances if the font supports them; reserve a meaningful
  column for digit-count changes such as 99 → 100 without truncating values.
- Correct asymmetric glyphs in a reusable asset/component, preserving exact layout spines.
  Derive nested corner geometry from actual inset; remove an unnecessary nested surface first.
- Motion needs a job: immediate frequent feedback, interruptible transitions, reduced motion and
  instant themes. Optional delight must not delay typing or obscure status. Pause offscreen
  decoration and profile realistic content before adopting costly effects. See §5.

### Words are part of the interface

Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.
A heading, grouping, proximity or obvious control should not need another sentence repeating
its purpose. Remove copy with no new decision, constraint or consequence; do not replace it
with a decorative badge or tooltip. Preserve accessible names, field labels, units, errors,
risk disclosures and useful first-use guidance. Test whether the task remains understandable.

Let context carry context: `Users` rather than `User Management`; do not repeat a dialog's
question in its body. Name results (`Save`, `Move`, `Delete`), not gestures (`Click to save`).
Include the object only when context does not establish it. `Cancel` leaves without committing.
Use sentence case, no period on short labels, and a period on explanatory sentences.
Use one `…` when an action needs more input before completing; reserve ALL CAPS for short
statuses, eyebrows and acronyms.

### Review checklist for a composed surface

Apply these questions to the affected surface and reachable changed states. Skip irrelevant variants;
a small patch does not require redesigning unrelated pages. A "no" within scope is a finding:

1. Can a new reader recognise the purpose and the primary action without guessing?
2. Does every control's label, state and result describe one consistent outcome?
3. Is emphasis scarce — does the core thing get the weight while colour, badges and
   primary buttons stay rare?
4. Could this do less: any entry point, option or state removable without weakening the task?
5. Are named spines exact at the visible text/content layer, including nested and empty states,
   with intentional navigation columns and no doubled padding? Do adjacent controls share their declared
   icon/text columns? Are title hit zones content-hugging? Do repeated vertical relationships use
   consistent gaps with one owner, including wrapped copy and hidden helper/error content?
6. Is running text comfortable in its actual scripts, fonts and zoom levels, and is
   everything that is **not** running text free of that measure cap?
7. Does every element that looks like part of one object agree — border, radius **and**
   spacing — and does every reserved column actually have content? Does each persistent frame,
   fill or divider communicate a distinct boundary instead of nesting the same group again?
8. Does it hold in relevant changed states: empty, loading, failure, long translations, narrow
   width, supported themes, reduced motion and **RTL**, where affected?
9. For layout or interaction changes, has the affected surface been checked in a real browser
   at the relevant widths and themes? Are standalone actions recognizable before hover, including
   touch use, without redundant group enclosures?

A happy-path screenshot does not prove keyboard behavior, focus, dynamic content,
resizing or failure recovery. Follow [ACCEPTANCE](./ACCEPTANCE.md) for independent expectations,
actual runtime/capture identity, browser measurements and separate automated, agent and human
results. The source-only [browser example](https://github.com/chaxus/ran/blob/main/packages/ranui/test/e2e/layout-contract.md)
contains setup commands and test utility details; they are not public package APIs.

## 12. Information architecture — the shape before the composition

Choose structure before composition for information-dense consoles, dashboards and workbenches.
Complete API data is not a page design: the reader still needs a clear order for understanding
objects, their state and relationships, then acting. Single-conversion and landing pages need
their own task structure rather than a dense-console template.

### Answer three questions before naming a component

1. **What must the reader see on arrival?** That is the primary information.
2. **What else has to be visible for it to make sense?** Related resources, related models,
   context.
3. **What do they do next?** Judge, act, or keep thinking.

**A page has exactly one primary model.** Supporting models may help the reader understand or
operate it; they may not compete for the first screen.

### The shape follows the task, not the payload

Choose a skeleton from the reader's question, not an API array or route ID:

| Task                                          | Useful shape                                             |
| --------------------------------------------- | -------------------------------------------------------- |
| Compare values/differences                    | Table or diff                                            |
| Recognize/open a resource                     | List; image grid only when images identify it            |
| Understand one object's current state         | Sectioned detail                                         |
| Understand ownership/dependencies             | Tree or adjacency list; graph only when the path matters |
| Plan the next step / move work through stages | Step flow / kanban when moving is the actual work        |
| Audit what happened, when and by whom         | Timeline or trace drill-down                             |
| Discuss or read continuous text               | Thread or document                                       |
| Judge health, trends or anomalies             | Status wall or dashboard                                 |
| Find occupancy/conflicts or location          | Calendar or map/canvas                                   |
| Work on the next item / change rules          | Master-detail workbench / configuration form             |

Do not confuse historical events with future steps, a filter with kanban, or ordered prose
with a field grid. A date alone does not justify a calendar. Ship multiple views only when
each serves a distinct task worth its filter/state/action maintenance.

### Each kind of information has a place

| Information   | Belongs                                                      | Must not end up                          |
| ------------- | ------------------------------------------------------------ | ---------------------------------------- |
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

**One contextual return per view.** Do not show an outer “Back to chat” and an inner
“Back to artifacts” together. The detail view returns to its immediate parent; ancestors remain
reachable through the route hierarchy or clearly named breadcrumbs. Verify the full journey,
including focus return and long translated destination names. If text does not fit, reflow or
use a meaningful shorter destination; an ellipsis or tooltip must not hide the only destination cue.
Choose one composition for the parent context. Do not add a breadcrumb merely to relabel a
redundant return shortcut, or repeat that parent as an inert crumb above its return command.
When returning through the parent already reaches the ancestor, that journey preserves access
without adding another detail-header row. Use breadcrumbs when the hierarchy itself helps the task.

**`r-modal` is not a navigation layer.** Anything needing a copyable link, history, a
side-by-side comparison, or work that survives a refresh gets a route. Reserve the modal for a
short confirmation or a single field, `r-popover` / `r-dropdown` for transient context, and
`r-disclosure-row` for progressive disclosure.

**`r-tabs` carries peer views of one object** — its conversation, its checks, its diff — never
unrelated modules; that is navigation's job.

**ranui ships no table, tree, calendar, kanban or timeline.** Build one out of the tokens and
the rules above, not out of a second visual system (§11, "One product, one token set").

## Verification checklist (before shipping UI)

Select checks for the affected surface, supported variants and changed behavior; do not create
unrelated flows merely to satisfy the list. Repository CI still runs its complete gates.

- [ ] Primary task and primary action are unmistakable.
- [ ] Affected layout/theme changes work at relevant **narrow and wide** widths and supported themes.
- [ ] Works with **mouse and touch** — any drag/gesture uses Pointer Events, not mouse-only; any
      `trigger="hover"` has a tap fallback.
- [ ] All changed **states** exercised (hover, active, focus, disabled, loading, empty, error).
- [ ] **Keyboard / focus** behavior verified; visible focus everywhere.
- [ ] Relevant edge cases: long text, large numbers and the host's supported scripts/locales.
- [ ] Spacing comes from the scale; type uses a role; color uses semantic tokens.
- [ ] Library contributors run `pnpm -F ranui verify:design` (nine mechanical rules); consumer applications run the host's applicable checks.
- [ ] Copy follows §6; nothing signals state by color alone (§7).
- [ ] For a dense surface: one primary model, the skeleton chosen from the question rather
      than the payload, and every fact with one authoritative location (§12).
