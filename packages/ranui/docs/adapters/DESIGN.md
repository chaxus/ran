# ranui implementation adapter

This file maps [the Ran Design guide](../DESIGN.md) and the
[surface language](https://ran.chaxus.com/design/surface) guide to ranui's tokens, tiers and
components. It is based on the [Geist design system](https://vercel.com/design). The guides own the
method; this file owns the values and the ranui-specific rules. How a component is built
(construction, state, events, SSR, tests) is [CODING.md](../CODING.md). The public
[design system](https://ran.chaxus.com/design/design-system/) page explains the same tokens to
readers; update it when a value here changes.

**MUST**, **SHOULD** and **MAY** mean what the guide says they mean. Every MUST below either is
checked or names the defect it prevents.

## Default visual direction

A quiet, content-first working interface: neutral semantic surfaces, restrained emphasis and compact
desktop controls with reachable touch targets. Distinction comes from clear typography, proportions
and complete states, not a decorative effect on every component.

- **SHOULD** Choose dimensions from the existing token roles; do not add a second "premium" scale.
- **SHOULD** Glass and other expressive effects are explicit surface choices (`r-glass`, a host's
  hero, or `data-ran-surface="glass"` / `surface="glass"` on the pilot control family), not
  default text or control backgrounds. The default surface language stays solid Graphite. Method:
  [Surface language](https://ran.chaxus.com/design/surface).
- **MUST** Colour theme (`setTheme` / `<r-theme-switch>`) and surface (`setSurface` /
  `<r-surface-switch>`) stay orthogonal: glass still follows light and dark.
- **MUST** A glass surface respects `prefers-reduced-transparency: reduce` by falling back to
  theme-aware solid elevated tokens (same contract as `r-glass`).
- **SHOULD** Under glass, keep solid fills for high-emphasis actions (primary / danger) and for
  inverse toast pills so contrast does not depend on the backdrop (Apple `glassProminent`).
- **SHOULD** Content-layer pilots (`r-card`, `r-input`) stay solid under document glass; opt in
  with `surface="glass"` only when that element is the frosted plate.
- **SHOULD** Host chrome (site headers, app shells) follows the same Regular-glass rules: frost
  chrome, keep reading content solid, no glass-on-glass, visible hover ≠ selected.
- **SHOULD** Under document glass, overlay menu rows (`r-dropdown-item` in select / theme /
  surface menus), the select trigger, and the `r-tabs` sliding header fill use
  `--ran-surface-glass-hover` by default — do not re-declare Graphite `--ran-color-bg-hover`
  washes in the host unless opting out with `surface="solid"`. Override via
  `--ran-dropdown-option-item-hover-background-color` /
  `--ran-select-hover-background-color` / `--ran-tab-hover-background` only when the product
  needs a different chip.
- **MUST** Reading contrast and interaction semantics are the same in both themes.
- **SHOULD** Prefer a semantic token to a raw scale step, and decide by role and state rather than by
  eye. Design every reachable state: default, hover, active, focus, disabled, loading, empty, error.
- **SHOULD** Verify the rendered result in the themes and widths the change affects; review a component
  family in a composed page beside its neighbours, not in isolation.

When sources disagree: the user's goal, then verified evidence, then the guide and this file, then
shipped patterns.

## Checks

`pnpm -F ranui verify:design` runs the static rules in
[`bin/verify-design-rules.ts`](https://github.com/chaxus/ran/blob/main/packages/ranui/bin/verify-design-rules.ts);
repository CI runs them over the website's stylesheets too. The visual rules are `bare-colour`,
`dark-unsafe-fallback`, `undefined-token-fallback`, `spacing-scale` and `sizing-scale`; the
engineering rules are listed in [CODING](../CODING.md#what-is-machine-checked).

CI fails on a new violation. The per-file baseline records existing debt to clear, not permission to
add more.

A rule broken on purpose says so where it happens: a comment on the line or the line above reading
`design-ok: <rule> <reason>` (for example `/* design-ok: bare-colour the ink follows the backdrop */`)
exempts that line. The reason is required, so a reviewer can judge it. Outside the library,
`spacing-scale` only asks for a step of the 4px scale; `8px` is as good as `var(--ran-space-2)`
there.

`pnpm -F ranui design:bundle` captures the live documentation components and the resolved light and
dark tokens into one browsable bundle (run `pnpm -F docs build` and `pnpm -F docs preview` first). Its
cards are rendered ranui output, and it reports components that have no live demo. A bundle shows the
library, not that a host application passed acceptance.

## ranui color

Each hue is a 10-step scale, `100`–`1000`, and every step has one job, so interaction states are
decided up front:

| Step | Role                        | Step | Role                     |
| ---- | --------------------------- | ---- | ------------------------ |
| 100  | Default background          | 600  | Active border            |
| 200  | Hover background            | 700  | Solid fill               |
| 300  | Active (pressed) background | 800  | Solid fill, hover        |
| 400  | Default border              | 900  | Secondary text and icons |
| 500  | Hover border                | 1000 | Primary text and icons   |

Scales: `--ran-gray-*`, `--ran-gray-alpha-*` (translucent, over any surface), `--ran-blue-*`,
`--ran-red-*`, `--ran-amber-*`, `--ran-green-*`, plus `--ran-background-100/200`. Components use the
semantic layer:

| Token                                           | Light                   | Dark                  | Use for                     |
| ----------------------------------------------- | ----------------------- | --------------------- | --------------------------- |
| `--ran-color-bg` / `-bg-subtle`                 | background-100 / -200   | same names            | Page and subtle zones       |
| `--ran-color-bg-elevated`                       | background-100          | `#18181b`             | Cards, surfaces             |
| `--ran-color-bg-muted` / `-hover` / `-active`   | gray-100 / 200 / 300    | same names            | Inset, hover, pressed fills |
| `--ran-color-text` / `-secondary` / `-disabled` | gray-1000 / 900 / 700   | same names            | Text                        |
| `--ran-color-border` / `-hover` / `-active`     | gray-400 / 500 / 600    | same names            | Borders                     |
| `--ran-color-primary`                           | gray-1000               | gray-1000             | Primary action (monochrome) |
| `--ran-color-primary-hover` / `-active`         | `#2a2a2e` / `#3f3f46`   | `#d4d4d8` / `#b4b4bb` | Primary action states       |
| `--ran-color-primary-text`                      | background-100          | background-100        | Ink on a primary surface    |
| `--ran-color-success` / `-warning` / `-danger`  | green / amber / red-700 | same names            | Status                      |
| `--ran-color-link`                              | blue-800                | `#5b9dff`             | Links                       |
| `--ran-color-focus`                             | blue-700                | blue-700              | The focus ring              |

"Same names" means the semantic token keeps its mapping and the scale underneath changes. The
theme files, `theme/tokens.less` and `theme/dark.less`, are the source; read them rather than
assuming a value follows one step.

The primary action is monochrome: black on white in light, white on black in dark. Blue is only for
links and the focus ring; green means success, amber warning, red danger.

- **MUST** A component writes no hex or rgb for a value that follows the theme. **(checked:
  `bare-colour`)**
- **MUST** A component token's colour fallback starts with a token that flips
  (`var(--ran-color-text, …)`, `var(--ran-gray-alpha-100, …)`), never a light-only literal, or it
  shows light colours in dark mode. A final literal behind that token, as in
  `var(--ran-btn-background, var(--ran-color-primary, #111113))`, is fine. **(checked:
  `dark-unsafe-fallback`)**
- **MUST** Every `var()`, fallbacks included, names a token the theme defines (`--ran-color-danger`,
  not a plausible `--ran-color-error`): the browser drops a declaration whose variable is undefined.
  **(checked: `undefined-token-fallback`)**

## ranui spacing

A 4px unit with nine values, `--ran-space-1..24`: 4, 8, 12, 16, 24, 32, 40, 64 and 96px. A smaller
gap means a closer relationship:

| Relationship             | Token           | Example             |
| ------------------------ | --------------- | ------------------- |
| Parts of one control     | `--ran-space-1` | Icon and label      |
| Closely related controls | `--ran-space-2` | Button row          |
| One content group        | `--ran-space-3` | A list item's lines |
| Separate groups          | `--ran-space-4` | Form groups         |
| Related subsections      | `--ran-space-6` | Compact blocks      |
| Major regions            | `--ran-space-8` | Region separation   |

- **MUST** Component spacing comes from the scale, so a consumer who retunes `--ran-space-*` moves
  every component with it. **(checked: `spacing-scale`)**
- **MUST** Intrinsic dimensions (`width`, `height` and their `min-`/`max-` forms, `font-size`,
  `line-height`, `border-radius`) use `--ran-size-*` or role tokens, never `--ran-space-*`, so either
  scale can be retuned without moving the other. **(checked: `sizing-scale`)**
- **MUST** An optional part that is absent (an empty description, an unassigned slot) takes no space:
  hide it together with the gap around it, so no empty row is left behind.

## ranui typography

`--ran-font-family` (Geist Sans) for interface and prose, `--ran-font-mono` (Geist Mono) for code and
data. Base `--ran-font-size: 14px`, `--ran-line-height: 1.5715`. `import 'ranui/fonts'` self-hosts
both faces; without it the stacks fall back to system fonts.

| Role    | Use                    | Weight                                  | Size tokens                               | Notes                                              |
| ------- | ---------------------- | --------------------------------------- | ----------------------------------------- | -------------------------------------------------- |
| heading | Titles                 | `--ran-text-heading-weight` (600)       | `--ran-text-heading-1..4` (32/24/20/16px) | Tracking `--ran-text-heading-tracking` (≈ -0.03em) |
| label   | Field and action names | `--ran-text-label-weight` (500)         | `--ran-text-label-1..3` (14/13/12px)      | Action labels stay on one line; field labels wrap  |
| copy    | Multi-line body        | `--ran-text-copy-weight` (400)          | `--ran-text-copy-1..2` (16/14px)          | Line height `--ran-line-height` (1.5715)           |
| button  | Button text            | `--ran-text-button-weight` (500)        | `--ran-text-button-size` (14px)           | Line height 1, for exact vertical centring         |
| mono    | Code and data          | `--ran-text-mono-weight-regular/medium` | the label and copy sizes                  | `--ran-font-mono`                                  |

- **SHOULD** Choose a text style by its role and reference the role tokens
  (`var(--ran-{component}-…, var(--ran-text-{role}…, fallback))`) rather than copying a size.
- **MAY** UI that maps to no role (an active link's weight, the player's gesture flash) keeps its own
  component token, as `--ran-link-active-font-weight` does.

## ranui radius, elevation and stacking

Radius: `--ran-radius-xs` 4 · `sm` 8 · `md` 12 · `lg` 16 · `xl` 24 · `full` 9999px.

- **SHOULD** Controls take `sm`, cards and dialogs `md`, large surfaces `lg`, pills and avatars
  `full`.

Elevation is chosen by what the element is:

| Tier    | Token                   | Use for                                                               |
| ------- | ----------------------- | --------------------------------------------------------------------- |
| Raised  | `--ran-shadow-elevated` | In-flow surfaces that also have a border: `r-card`, `r-section`       |
| Overlay | `--ran-shadow-menu`     | Layers over content: dropdown, select menu, popover, tooltip, message |
| Modal   | `--ran-shadow-modal`    | Blocking dialogs: `r-modal`                                           |

- **MUST** An overlay uses an overlay tier, never the card tier, and its shadow visibly lifts it off
  the page: a borderless dropdown or toast has nothing else separating it. **(checked in
  `test/unit/theme.semantic-tokens.test.ts` for dropdown, modal and message)**

Overlays portal to `<body>`, so they also need a stacking tier:

| Tier     | Token              | Default | Use for                                                                               |
| -------- | ------------------ | ------- | ------------------------------------------------------------------------------------- |
| Modal    | `--ran-z-modal`    | `1000`  | Blocking dialogs and their mask                                                       |
| Dropdown | `--ran-z-dropdown` | `1100`  | Dropdown, select menu, popover: above modal, so a select inside a modal stays visible |
| Message  | `--ran-z-message`  | `1200`  | Toasts and notifications, the top tier                                                |

- **MUST** The z-index sits on the element that is positioned and portaled, the host; on an inner
  shadow node it is trapped in the host's stacking context and the overlay renders behind the page.
  **(checked in `test/e2e/dropdown-layer.spec.ts`)**
- **MUST** A tier is overridden through its token, globally (`--ran-z-dropdown` on `:root`) or per
  component (`--ran-dropdown-host-z-index`, `--ran-modal-root-z-index`, `--ran-message-z-index`),
  never with `!important`.
- **MUST** An overlay that is open while the page scrolls or resizes follows its trigger.
  **(checked in `test/unit/utils.floating.test.ts`)**

A non-portaled fixed overlay stays inside its ancestors' stacking context (`isolation`, `transform`,
`opacity`, `filter`, `will-change` create one), so a host may have to raise a wrapper. Raising a
wrapper permanently lifts ordinary content above sticky chrome too.

- **MUST** Raise an enclosing wrapper only while the overlay paints, its closing transition included:
  `r-modal` reflects `closing` for that tail, so match `:has(r-modal[open]), :has(r-modal[closing])`.

## ranui motion

The guide's [Motion](../DESIGN.md#motion) rules apply. Two are tightened for a library, because a
component's transition runs inside every consumer's page:

- **MUST** Theme switches are not animated, and palette properties (`background`, `color`,
  `border-color`, `box-shadow`, `fill`, `stroke`) get no default transition. CSS cannot tell why a
  property changed, so a colour transition also fades when the theme flips its token: each component
  at its own speed, after the page has already switched. Hover feedback on colour snaps.
- **MUST** No `transition: all` and no bare duration (`transition: 0.2s` means `all`); they silently
  include palette properties.
- **MUST** Every removed default keeps its `--ran-*-transition` hook, so a consumer who wants colour
  fades can opt in per component.
- **MAY** Motion properties (`transform`, `opacity`) and box geometry animate.

```less
/* ✗ fades on a theme switch */
transition: all var(--ran-motion-duration-base, 0.2s);
transition:
  border-color 0.2s,
  color 0.2s;

/* ✓ motion only, with a hook for consumers */
transition: var(--ran-checkbox-tick-transition, transform 0.1s var(--ran-motion-ease-standard), opacity 0.1s);
transition: var(--ran-input-transition, none);
```

`--ran-motion-ease-standard` is the default curve. `--ran-motion-ease-spring` and
`--ran-motion-ease-bouncy` overshoot: they exist for one expressive moment on a page that persuades,
chosen by the host, and are never a component's default.

## ranui components

- **SHOULD** Reuse native controls and ranui primitives where their contract fits; do not rebuild one
  only to restyle it.
- **MUST** Native form and keyboard semantics survive, including native controls placed in overlay
  slots.
- **SHOULD** Theme through CSS variables, `::part()`, or the `sheet` attribute as an escape hatch.
  Variables cross the shadow boundary; selectors do not.
- **SHOULD** Map states to the ladder: default to `bg`/`text`; hover to `bg-hover`, `border-hover`,
  `primary-hover`; active to `bg-active`, `primary-active`; disabled to the disabled tokens, still
  legible; focus to the focus ring.
- **MUST** Only clickable cards react to hover: `r-card` does so only with `hoverable`.
- **SHOULD** For color theme, use `<r-theme-switch>` (select of system / light / dark, localised with
  `label`, `label-system`, `label-light`, `label-dark`). For style / surface language, use
  `<r-surface-switch>` (select of solid / liquid glass). Keep the axes separate so glass still
  respects light and dark, unless the host already owns appearance switching.
- **SHOULD** Header language, theme and surface share one `r-select` chrome recipe (ghost
  trigger, `dropdownclass` such as `ran-chrome-menu`, sliding wash under glass, weight for
  selected; chrome menus may hide the select check via
  `--ran-dropdown-option-selected-check-display`). Language options may be locale URLs the host
  navigates on `change`; theme/surface stay persisted values. Prefer one menu family in the
  header so hover open and shared-layout handoff stay consistent across Graphite and glass.
- **MUST** Under glass, the sliding wash is already on the selected option when the menu first
  paints. `FloatingController` keeps `data-ran-floating="placing"` until `afterPosition` writes
  that chrome, then flips to `open` (Floating UI `isPositioned`) — do not add a second opacity
  hold in the component. `r-menubar` viewport places wash on open. Travel between rows may ease;
  open / reopen snaps. The same contract applies to `r-tabs` header fill and host sidebar
  washes — one fill, not a delayed second paint.
- **SHOULD** Host sidebar / nav sliding washes span the **full row width**, not `fit-content`
  around the label — short copy (e.g. "i18n") still needs a hittable target.
- **SHOULD** See [Examples · Glass chrome motion](https://ran.chaxus.com/examples/glass-chrome)
  for a live composition of select wash, tabs fill and menubar hop under liquid glass.
- **SHOULD** Map the guide's navigation choices to ranui: `r-modal` for a short confirmation or one
  field, `r-popover` and `r-dropdown` for transient context, `r-disclosure-row` for progressive
  disclosure, `r-tabs` only for peer views of one object.
- **SHOULD** ranui ships no table, tree, calendar, kanban or timeline; build those as semantic host
  elements on the same foundation tokens.

A host may alias the foundation under its own names, as long as the values derive from `--ran-*`:

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

The 32px target there is one host's role, not a minimum; touch targets still follow the guide's 24px
rule.

## ranui component token naming

- **SHOULD** Name tokens `--ran-{component}-{element}[-{state}]-{property}`, keeping the component's
  existing prefix.
- **SHOULD** Name the most specific distinct part, not its DOM path:
  `--ran-progress-fill-background`, not `--ran-progress-wrap-value-background`. Keep track and fill
  as separate parts.
- **SHOULD** Include a state segment only for a state that can be overridden on its own, and keep
  property names to their CSS meaning.

The generated [public token catalog](../style-tokens-public.md) lists every name; do not keep another
by hand.
