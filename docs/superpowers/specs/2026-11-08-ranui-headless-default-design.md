# ranui 1.0: headless default, official skins

## Authorized direction

| Decision | Evidence | Status |
| -------- | -------- | ------ |
| True headless is the default install surface | User, 2026-11-08 | Authorized |
| Geist (Graphite solid) and liquid glass are official skins, not the library core | User, 2026-11-08 | Authorized |
| Ship as **ranui@1.0.0** (breaking major) | User, 2026-11-08 | Authorized |
| One official skin entry with solid/glass as a surface axis (not two competing skin packages) | Design recommendation accepted with“可以的” | Authorized unless revised in review |
| Painted custom elements keep the `r-*` tag names; they register only when a skin is imported | Design recommendation accepted with“可以的” | Authorized unless revised in review |

## Goal

Reposition ranui so that:

1. **Default** consumers get accessible **behavior** (state, keyboard, focus, floating, form association, ARIA props) with **no visual opinion**.
2. **Optional** consumers import an official skin to restore today’s painted `<r-*>` elements, including the existing **Geist / Graphite** look and the **liquid glass** surface language.
3. The break is explicit: **1.0.0**, with a documented migration from 0.5.x.

This matches PRODUCT’s three pillars only after PRODUCT.md is updated: ranui becomes “behavior core + optional official skins”, while Ran Design remains the method for composing and verifying any skin (official or host-owned).

## Non-goals (1.0)

- Do not rewrite every component before the first 1.0 tag. 1.0 may ship with a **headless-complete vertical slice** plus a clear “remaining components still skin-coupled” inventory, **or** require full coverage — see [Ship bar](#ship-bar-for-100). The default recommendation is **slice-gated 1.0** with the rest on a short follow-up minor, unless review demands full coverage.
- Do not introduce a React/Vue-only API. Headless is DOM / framework-agnostic (`create*` + `connect*`).
- Do not open closed shadow on skin components as the override story; hosts who need full chrome ownership use headless + their own DOM.
- Do not put Geist tokens or glass materials inside headless machines.
- Do not change ranuts or `@alixex/ranview` public contracts except where ranui’s new peer/dependency wiring requires a coordinated bump (prefer leaving them on their current majors unless blocked).

## Current state (source facts)

- `ranui@0.5.5` ships painted custom elements: closed shadow, per-component LESS, tokens based on Geist, orthogonal **theme** (`data-ran-theme`) and **surface** (`data-ran-surface` solid|glass).
- Public imports look like `import 'ranui/button'` and register `<r-button>` with appearance.
- Override today is tokens, `::part`, `sheet`, theme/surface switches — not structural replacement.
- Shared behavior already exists in places (`utils/floating.ts`, form helpers, `EventManager`) but is not a published headless layer.

## Architecture

### Layers

```text
ranui (1.0)
├── headless/          createX + connectX (+ types). No CSS. No defineSSR of painted tags.
├── skin/ran/          Official skin: registers <r-*>, Geist tokens, solid|glass surface.
├── theme/, i18n/, ssr/, builder/, …   Keep as infrastructure; theme tokens are consumed by skin, not by headless machines.
└── (compat)           Optional 1.0.x shims only if migration evidence demands them; prefer none.
```

### Package entry matrix

| Import | 1.0 meaning |
| ------ | ----------- |
| `ranui` / `ranui/<name>` for interactive widgets | **Headless only**: factories + connect helpers + types. Does **not** register painted `<r-*>`. |
| `ranui/skin/ran` | Side-effect import: load tokens + register all (or tree-shakeable per-widget) painted `<r-*>`. |
| `ranui/skin/ran/<name>` | Optional granular skin entry (e.g. `ranui/skin/ran/select`) so apps can register one painted element. |
| `ranui/theme`, `ranui/ssr`, `ranui/builder`, … | Remain; document that visual theme packs apply when a skin (or host CSS) is present. |
| `ranui/style` | Belongs to the skin (or becomes `ranui/skin/ran/style`). Root `ranui/style` either re-exports the skin stylesheet or is removed in 1.0 with a migration note. |

**Naming lock:** official skin path is `ranui/skin/ran` (product skin), not `skin/geist` + `skin/glass`. Glass stays the **surface language** on that skin (`setSurface` / `data-ran-surface` / `surface` attributes), orthogonal to colour theme.

### Headless API shape (normative sketch)

Per widget (example: select):

```ts
import { createSelect, connectSelect } from 'ranui/select';
// or from 'ranui/headless/select' if the root subpath stays reserved — pick one scheme in implementation and keep it consistent.

const service = createSelect({
  value,
  open,
  disabled,
  onValueChange,
  onOpenChange,
  // …controlled / uncontrolled rules documented per widget
});

const api = connectSelect(service, { getTriggerEl, getListEl, getOptionEls });
// api yields prop bags: triggerProps, listProps, optionProps(index), etc.
// Host applies props to its own elements. No shadow, no CSS.
```

Rules:

- Machines are pure enough to unit-test without layout (jsdom or node).
- `connect*` may touch DOM measurement only behind explicit “positioning” adapters (reuse `utils/floating.ts`).
- Accessibility: connect output **must** include the roles/ARIA the skin relies on today; hosts who omit applying props own the footgun — document that clearly.
- Events: prefer the same semantic names the painted components expose today where possible (`change`, `open`, …), documented in COMPONENTS for both headless and skin.

### Skin API shape

- Importing `ranui/skin/ran` (or granular entries) calls `defineSSR` for painted classes that **compose** headless services inside closed shadow + LESS, same visual language as 0.5.x.
- `<r-select>`, `<r-button>`, … tag names **unchanged** for skin users.
- Surface glass behavior remains as in [design/SURFACE.md](../../../design/SURFACE.md); headless has no `surface` concept.

### Dependency direction

```text
skin/ran  -->  headless  -->  (ranuts / ranview as needed)
skin/ran  -->  theme tokens / LESS
headless  -x->  theme visuals, LESS, define painted CE
```

## Ship bar for 1.0.0

**Recommended (default for this spec):** 1.0.0 may ship when:

1. Public entry matrix above is live and 0.5-style root widget imports no longer paint by default.
2. At least one **full vertical slice** is done end-to-end: **select** (machine + connect + skin rewire + docs example of host-drawn listbox + tests).
3. A second slice in the floating family is done or explicitly scheduled as 1.0.1 with no API thrash: **popover** or **dropdown** (shared dismiss/focus primitives extracted).
4. Migration guide + PRODUCT.md + RELEASING notes for 1.0 are published.
5. Remaining painted components that are not yet on headless are listed as **skin-legacy** (still registered via `skin/ran`, implementation may still inline behavior) with a published order to extract — no silent dual API.

**Stricter alternative (opt-in at spec review):** every public widget must be headless-backed before 1.0. Higher cost; cleaner story.

## Migration (0.5.x → 1.0.0)

| 0.5.x | 1.0.0 |
| ----- | ----- |
| `import 'ranui/button'` (painted) | `import 'ranui/skin/ran/button'` or `import 'ranui/skin/ran'` |
| Want behavior only | `import { createButton, connectButton } from 'ranui/button'` (final names per matrix) |
| Geist look | Official skin default (solid) |
| Liquid glass | `setSurface('glass')` / attributes on skin components — unchanged idea |
| npm | `ranui@1.0.0`; ranuts / ranview unchanged unless required |

Codemods are optional; a checklist in the changelog is required.

## Documentation and product surfaces

- Update [PRODUCT.md](../../../PRODUCT.md) ranui pillar sentence.
- Docs site: primary path “Headless”; “Official skin (Geist / Glass)” as the painted track; migration page from 0.5.
- Agent plugin `authoredAgainst` → `1.0.0`; skill text must distinguish headless vs skin.
- Generated COMPONENTS.md gains a column or section: headless API vs skin element.

## Testing

- Machine unit tests (no browser) for open/value/disabled/keyboard contracts.
- Connect integration tests (jsdom or Playwright) asserting ARIA props and key handlers on host elements.
- Skin regression: existing ranui unit/SSR/e2e for select (and later widgets) stay green on `skin/ran`.
- Consumer verify: packed `ranui` root import does not inject component CSS; skin import does.
- Visual baselines apply to **skin** only.

## Release

- Coordinated ranui **1.0.0** on `latest` via existing Release libraries workflow (subset publish allowed).
- Do not publish half-migrated public entries that still paint under old paths.
- Provenance and RELEASING.md digest updated for the 1.0 line.

## Vertical slice order

1. **select** — highest interaction density; already tied to floating and glass menu chrome.
2. **popover** or **dropdown** — shared overlay/dismiss.
3. **modal** / **message**
4. Form controls: **input**, **checkbox**, **button**
5. Remainder per COMPONENTS inventory

## Success criteria

- A new consumer can build a branded select using only headless + their DOM/CSS, with keyboard and ARIA matching the skin’s behavior tests.
- A 0.5 consumer restores appearance with a skin import and minor path changes, without rewriting app markup tags (`<r-select>` stays).
- Glass and Geist remain one official visual product, not a second npm major.
- Security/design gates (`verify:design`, consumer bundle checks) still apply to the skin; headless has its own size/behavior budgets.

## Spec self-review

- No unresolved “TBD” on package naming: `ranui/skin/ran`, headless on widget subpaths, 1.0.0 major.
- Ship bar allows slice-gated 1.0; stricter full coverage is an explicit review fork.
- Does not authorize implementing all widgets in one PR.
- Does not change Design guide ownership; skins still obey Ran Design when painted.
