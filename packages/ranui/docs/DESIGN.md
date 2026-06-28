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

| Token                                        | Maps to                         | Use for             |
| -------------------------------------------- | ------------------------------- | ------------------- |
| `--ran-color-bg`                             | background-100                  | Page background     |
| `--ran-color-bg-subtle`                      | background-200                  | Subtle page zones   |
| `--ran-color-bg-elevated`                    | bg-100 / gray-100 (dark)        | Cards, surfaces     |
| `--ran-color-bg-muted`                       | gray-100                        | Inset / muted fills |
| `--ran-color-bg-hover`                       | gray-200                        | Hover background    |
| `--ran-color-bg-active`                      | gray-300                        | Active background   |
| `--ran-color-text`                           | gray-1000                       | Primary text        |
| `--ran-color-text-secondary`                 | gray-900                        | Secondary text      |
| `--ran-color-text-disabled`                  | gray-700                        | Disabled text       |
| `--ran-color-border`                         | gray-400                        | Default border      |
| `--ran-color-border-hover`                   | gray-500                        | Hover border        |
| `--ran-color-border-active`                  | gray-600                        | Active border       |
| `--ran-color-primary` / `-hover` / `-active` | blue-700 / 800 / 900            | Primary action      |
| `--ran-color-success` / `warning` / `danger` | green-700 / amber-700 / red-700 | Status              |
| `--ran-color-link`                           | blue-700                        | Links               |

**Accent meaning:** blue = primary & links · green = success · amber = warning · red = danger/error.

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

Decide by **role**; the role fixes font, size, weight, line-height:

| Role    | Use                    | Weight  | Notes                                                 |
| ------- | ---------------------- | ------- | ----------------------------------------------------- |
| heading | Titles                 | 600     | Tight letter-spacing (≈ -0.03em); 32 / 24 / 20 / 16px |
| label   | Single-line, scannable | 500     | 14 / 13 / 12px; no wrapping                           |
| copy    | Multi-line body        | 400     | line-height ~1.55; 16 / 14px                          |
| button  | Button text            | 500     | 14px; `line-height: 1` for crisp vertical centering   |
| mono    | Code, data, eyebrows   | 400/500 | `--ran-font-mono`                                     |

**Rule:** ask "what role is this text?" (heading / label / copy / button) — the style follows. Don't pick raw px per instance.

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
- Component tokens default to semantic tokens: `var(--ran-btn-content-background-color, var(--ran-color-primary, #006bff))`.
- Map states to the color ladder: default → `bg`/`text`; hover → `bg-hover` / `border-hover` / `primary-hover`; active → `bg-active` / `primary-active`; disabled → `text-disabled` + reduced opacity; focus → focus ring.
- See [THEME_STYLE_SYSTEM_DESIGN.md](./THEME_STYLE_SYSTEM_DESIGN.md) for the token architecture and [style-tokens-public.md](./style-tokens-public.md) for the generated per-component token list.

---

## Verification checklist (before shipping UI)

- [ ] Primary task and primary action are unmistakable.
- [ ] Works in **light and dark**, at **narrow and wide** widths.
- [ ] All changed **states** exercised (hover, active, focus, disabled, loading, empty, error).
- [ ] **Keyboard / focus** behavior verified; visible focus everywhere.
- [ ] Edge cases: long text, large numbers, both locales (en / zh).
- [ ] Spacing comes from the scale; type uses a role; color uses semantic tokens.
- [ ] Copy follows §6; nothing signals state by color alone (§7).
