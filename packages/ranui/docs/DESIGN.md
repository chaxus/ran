# ranui DESIGN.md

> An executable design specification — written for humans **and** AI agents.
> When generating or editing ranui UI, follow these rules so output is consistent
> instead of drifting in style. Based on the [Geist design system](https://vercel.com/design)
> ([design.md](https://vercel.com/design.md) / [design.dark.md](https://vercel.com/design.dark.md)).

## How to use this file

- Prefer **semantic tokens** (`--ran-color-*`, `--ran-space-*`, …) over raw scales or hex.
- Decide by **role/state**, not by eyeballing a value. The value is chosen for you.
- When a choice is unresolved, mark it explicitly — don't bury a guess in code.
- Design **all reachable states** (default, hover, active, focus, disabled, loading, empty, error), not just the happy path.
- **Verify the rendered result**, in light and dark, at narrow and wide widths — code review alone is not enough.

Conflict resolution order: **user goals → verified evidence → this file → repo guidance (`CLAUDE.md`) → shipped patterns → general heuristics.**

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

| Role    | Use                    | Weight                                       | Size tokens                                                              | Notes                                                        |
| ------- | ---------------------- | --------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- |
| heading | Titles                 | `--ran-text-heading-weight` (600)             | `--ran-text-heading-1..4` (32/24/20/16px)                                 | Tight tracking `--ran-text-heading-tracking` (≈ -0.03em)     |
| label   | Single-line, scannable | `--ran-text-label-weight` (500)               | `--ran-text-label-1..3` (14/13/12px)                                      | No wrapping                                                  |
| copy    | Multi-line body        | `--ran-text-copy-weight` (400)                | `--ran-text-copy-1..2` (16/14px)                                          | line-height ~1.55 (`--ran-line-height`)                      |
| button  | Button text            | `--ran-text-button-weight` (500)              | `--ran-text-button-size` (14px)                                           | `--ran-text-button-line-height: 1` for crisp vertical centering |
| mono    | Code, data, eyebrows   | `--ran-text-mono-weight-regular/medium` (400/500) | borrows label/copy size tiers                                          | `--ran-font-mono`                                            |

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
- **A non-portaled fixed overlay (`r-modal`'s dialog stays inside its own shadow DOM) only escapes as far as its nearest ancestor stacking context.** If a host wraps embedded content in anything that creates one — `isolation: isolate`, `opacity < 1`, `transform`, `filter`, `will-change` — a `position: fixed` descendant is trapped inside it for stacking purposes (its *layout* still escapes to the viewport; only *paint order* is trapped). The wrapper then needs its own elevated `z-index` for the trapped content to climb back out.

The mistake to avoid: **don't promote the wrapper unconditionally to fix that.** Giving a wrapper `position: relative; z-index: <high>` at all times elevates *everything in it* — including static, non-overlay content — above the host's own chrome for its entire scroll lifetime, not just while an overlay is actually open. On a scrollable page that reliably paints ordinary content over a sticky nav/header the moment their boxes happen to overlap (ranui's own docs site shipped exactly this: every `<Demo>` wrapper carried a blanket `z-index: 100` "just in case," so a 100%-static example — no overlay in it at all — painted over the sticky nav on ordinary scroll). Scope the elevation to exactly when it's needed instead:

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
- **Motion props may transition.** `transform`, `opacity`, and box-geometry props (`left` / `top` / `width` / `height` / `font-size`) don't follow the theme — checkbox pops, floating labels, tab ink-bars, ripples all stay animated.
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
transition: var(
  --ran-checkbox-tick-transition,
  transform 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6),
  opacity 0.1s
);

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

## 8. Components — how to apply the system

- Use the semantic ranui components (`r-button`, `r-input`, `r-select`, `r-card`, `r-modal`, …) rather than re-building primitives.
- Theme through **CSS variables**, **`::part()`**, or the **`sheet`** attribute (escape hatch). CSS variables cross Shadow DOM; selectors do not.
- Component tokens default to semantic tokens: `var(--ran-btn-background, var(--ran-color-primary, #171717))`.
- Map states to the color ladder: default → `bg`/`text`; hover → `bg-hover` / `border-hover` / `primary-hover`; active → `bg-active` / `primary-active`; disabled → `text-disabled` + reduced opacity; focus → focus ring.
- **Interactive cards opt in**: `r-card` only reacts to hover with the `hoverable` attribute (border 400 → 500 + elevated shadow). Non-interactive cards must stay inert — never add hover feedback to something that isn't clickable.
- **Theme switching UI is a component**: use `<r-theme-switch>` (system / light / dark segmented pill, wired to `setTheme`/localStorage, syncs across instances and updates `theme-color` metas) instead of hand-rolling toggles. Localize with `label` / `label-system` / `label-light` / `label-dark`.
- **Typography ships with the system**: `import 'ranui/fonts'` (or link `dist/fonts/fonts.css`) self-hosts Geist Sans + Geist Mono (variable, OFL-licensed) — the canonical faces behind `--ran-font-family` / `--ran-font-mono`. Without it the stacks fall back to system fonts.
- See [THEME_STYLE_SYSTEM_DESIGN.md](./THEME_STYLE_SYSTEM_DESIGN.md) for the token architecture and [style-tokens-public.md](./style-tokens-public.md) for the generated per-component token list.

---

## 9. Component token naming

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

| Avoid (full DOM path) | Prefer |
| --- | --- |
| `--ran-select-selection-search-input-active-border-right-width` | `--ran-select-search-active-border-width` |
| `--ran-btn-content-hover-background-color` | `--ran-btn-hover-background` |
| `--ran-progress-wrap-value-background` | `--ran-progress-fill-background` |

This applies to **new** component tokens going forward. See `changelogs/2026-08-08.md` for the
pass that brought existing components in line with it (0.5.0-alpha.0).

---

## Verification checklist (before shipping UI)

- [ ] Primary task and primary action are unmistakable.
- [ ] Works in **light and dark**, at **narrow and wide** widths.
- [ ] All changed **states** exercised (hover, active, focus, disabled, loading, empty, error).
- [ ] **Keyboard / focus** behavior verified; visible focus everywhere.
- [ ] Edge cases: long text, large numbers, both locales (en / zh).
- [ ] Spacing comes from the scale; type uses a role; color uses semantic tokens.
- [ ] Copy follows §6; nothing signals state by color alone (§7).
