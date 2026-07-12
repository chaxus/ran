# Changelog

All notable changes to `ranui` will be documented in this file.

## [Unreleased]

### Added

- **Dedicated `ranui/form`, `ranui/scratch`, `ranui/section` subpath entries** — these three components already shipped via the `ranui` barrel and were built as `dist/form.js` / `dist/scratch.js` / `dist/section.js`, but were missing from the package `exports` map, so `import 'ranui/form'` (etc.) failed to resolve. The per-component subpath imports now work, matching every other element entry.
- **Dedicated `ranui/theme` and `ranui/i18n` subpath entries** — the theming engine (`initTheme`/`setTheme`/`setThemeToken(s)`/`clearThemeToken`) and the i18n engine (`createI18n`/`useI18n`/`I18nCore`) are now importable on their own (`import { initTheme } from 'ranui/theme'`, `import { createI18n } from 'ranui/i18n'`). Neither entry registers any custom elements, so consumers that only want tokens/dark mode or translation keep components out of their bundle. The same APIs remain re-exported from the `ranui` barrel. Built as `dist/theme.js` / `dist/i18n.js`; documented at `docs/src/ranui/{theme,i18n}/`.
- **Contrast (monochrome) action tokens + `r-button type="contrast"`** (Geist contrast button): new semantic tokens `--ran-color-contrast-bg` / `-bg-hover` / `-bg-active` / `--ran-color-contrast-text` that invert with the theme (black-on-white in light, white-on-black in dark), and a first-class `type="contrast"` button variant consuming them (default/hover/active/ripple).
- **`<r-theme-switch>`** — a Vercel-style three-state (system / light / dark) segmented pill wired to the theme API (`setTheme`, localStorage `ran-theme`). Instances sync across the page and across tabs, `label`/`label-*` attributes localize aria-labels, a composed `change` event reports `{ theme }`, and `theme-color` metas are kept in step using the resolved `--ran-color-bg` (originals restored in `system`). Ships as `ranui/theme-switch` + `dist/iife/theme-switch.iife.js`.
- **Self-hosted Geist faces: `ranui/fonts`** — `dist/fonts/fonts.css` + variable-weight `Geist-Variable.woff2` / `GeistMono-Variable.woff2` (~138 KB total, SIL OFL 1.1, license shipped alongside). One import gives consumers the canonical faces behind `--ran-font-family` / `--ran-font-mono`, self-hosted and offline-friendly (no CDN).
- **`r-card hoverable` attribute** — opt-in Geist interactive-card hover (border 400 → 500 + elevated shadow; `--ran-card-hover-border-color` / `--ran-card-hover-shadow` overridable). Non-interactive cards stay inert.
- **Reactive ownership + `untrack` in `ranui/builder`** — the signal engine now exposes `createRoot` / `onCleanup` / `getOwner` / `runWithOwner` (plus the `Owner` type) and `untrack`, re-exported from both `ranui/builder` and `ranui`. Effects and memos form an owner tree: disposing a scope (`createRoot((dispose) => …)`) tears down every effect, memo, binding, and `onCleanup` it spawned in one call — the intended teardown unit per page/route in an MPA/SPA. A self-referential effect (reads and writes the same signal) now throws a "cyclic dependency" error instead of looping. Documented in the new `docs/BUILDER.md`.
- **Reactive `ElementBuilder` bindings** — `text` / `attr` / `class` / `boolAttr` / `style` / `part` / `data` / `aria` / `role` / `label` now accept a **getter** (a signal or `computed`) in addition to a plain value; the DOM updates itself on change via an effect owned by the current scope. Passing a plain value keeps the previous one-shot behavior. (Reactivity applies to the single-key `style(prop, getter)` form, not the object/`attrs` map forms.)

### Changed

- **`computed` is now lazy + value-memoized** — a memo no longer recomputes eagerly on every dependency write; it recomputes only when read after a dependency changed, and an unread memo never computes at all. It also re-notifies its observers **only when its derived value actually changes** (default `Object.is`, override via `computed(fn, { equals })`), so effects behind a value-stable memo no longer re-run. **Behavior change:** code that relied on a `computed`'s side effects running eagerly must move them into a `createEffect`; a memo whose body has side effects will not run until first read.

- **i18n `t()` now escapes literal braces via doubling** (`{{` → `{`, `}}` → `}`), matching the Rust/Python/.NET format-string convention, so a message can show a literal `{token}` (write `{{token}}`) while still interpolating real `{param}` placeholders. Escaping and interpolation run in one left-to-right pass and apply with or without params. A lone or spaced brace (`{ ... }`) is still passed through untouched, so CSS/JSON/code in a message stays safe. **Behavior change:** any existing message containing a literal `{{` or `}}` that was _not_ meant as an escape will now collapse to a single brace.
- **`r-card` default surface is now Geist-style bordered** — page background (`--ran-color-bg`) + 1px `--ran-color-border`, replacing the muted gray fill (`--ran-color-bg-muted`). Consumers that want the old inset look can set `--ran-card-background: var(--ran-color-bg-muted)`. Also added a dedicated `--ran-card-border-color` component token so hover border-darkening can be driven from outside the (closed) shadow root.
- **Default (secondary) `r-button` hover no longer flips to the accent color** — it darkens the border (gray 400 → 500) and keeps primary text, per the Geist state ladder; the default ripple is now a translucent gray (`--ran-gray-alpha-400`) instead of primary blue.

### Fixed

- Replaced legacy antd-era hardcoded fallbacks (`#1890ff`, `#40a9ff`, `#d9d9d9`) in button/card/section/input/checkbox/colorpicker/select/message with current Geist token values (`#006bff`, `#eaeaea`, `#f2f2f2`) so a missing token layer degrades to the correct palette.

### Added

- **Accessibility pass across components (DESIGN.md §7):**
  - `r-message` toasts are now announced by screen readers: the stack is a persistent `aria-live="polite"` region, each toast is `aria-atomic`, and `error`/`warning` escalate to an assertive `role="alert"` (others `role="status"`).
  - `r-img` gains an `alt` attribute/property forwarded to the inner `<img>`; when unset it defaults to an empty `alt` (decorative) so screen readers skip it instead of announcing the URL.
  - `r-checkbox`, `r-input`, and `r-select` are now **form-associated** (`ElementInternals` + `setFormValue`), so their values are collected by `<r-form>`'s native `FormData`. `r-checkbox` also exposes the host as the single `role="checkbox"` (with `aria-checked`, roving `tabindex`, Space/Enter toggle, `aria-disabled`) and hides the decorative inner input; `r-input` associates its rendered `<label>` with the control via `for`/`id`.
  - `r-tabs` implements the WAI-ARIA tabs pattern: `role="tablist"`/`tab`/`tabpanel`, `aria-selected`, `aria-controls`/`aria-labelledby`, a roving `tabindex`, and Arrow/Home/End keyboard navigation.
  - `r-colorpicker` is keyboard-operable: the hue/alpha sliders are `role="slider"` with `aria-valuemin/max/now` and Arrow/Home/End adjustment, and the swatch trigger (`role="button"`, `aria-haspopup="dialog"`) opens the panel via Enter/Space.
  - Every component honours `prefers-reduced-motion: reduce` — a reduced-motion override is adopted into each shadow root via `ensureShadowRoot`.
- `r-button` `type` (`''` | `primary` | `warning` | `text`) is now a real observed attribute + property, so it appears in the generated API docs and works as `button.type = …`.
- `docs/COMPONENTS.md` now includes **typed properties** (e.g. `checked: boolean`, `value: string`) and **event `detail` shapes** (e.g. `r-select change → { value, label }`, `r-checkbox change → { checked }`, `r-input input/change → { value }`), extracted from source.
- `docs/COMPONENTS.md` — a generated per-element API reference (attributes, properties, events, slots, `::part()`) for all 29 custom elements, via `npm run doc:api` (`bin/generate-component-api.ts`). Published with the package and referenced from CLAUDE.md so agents can use components without reading source.
- `r-input` now signals `status="error"`/`"warning"` with more than color (DESIGN.md §7): an automatic status icon, plus an optional `message` attribute that renders helper/validation text below the field.

- Rebuilt the demo as a token-driven, Geist-style multi-page app routed with ranui's own `r-router`/`r-route`/`r-link` (Overview, Design, Components, Guide) in history mode, with a Cloudflare Pages `_redirects` SPA fallback. Top nav has route links, GitHub/Issues, an EN/中文 `r-select` language switcher (persisted, `navigator.language`-detected), and a light/dark toggle. See `changelogs/2026-06-27.md`.
- New Geist-based design tokens: full `--ran-gray/gray-alpha/blue/red/amber/green-100..1000` scales, `--ran-background-100/200`, `--ran-space-*` spacing scale, `--ran-radius-full`, `--ran-shadow-menu/modal`, `--ran-focus-ring`, and `--ran-color-primary-hover/active`.
- New framework-agnostic i18n utility (`utils/i18n`, exported from `ranui` as `createI18n` / `useI18n` / `I18nCore`): `t(key, params)` with locale fallback + `{param}` interpolation, `setLocale`/`onChange` subscription, `addMessages`, localStorage persistence, and `navigator` locale detection. SSR-safe. Mirrors the router core/singleton design.
- Interaction-state semantic tokens following Geist's 100–1000 state model: `--ran-color-bg-hover` / `-bg-active` / `-border-hover` / `-border-active`.
- The demo's Design route is now a methodology page (color state ladder, spacing rhythm, typography roles, motion durations, copy do/don't, accessibility), modeled on the Vercel/Geist design spec.
- `docs/DESIGN.md` — an AI-facing, executable design specification (color states, spacing, typography roles, radius/elevation, motion, copy, accessibility, component application, and a pre-ship checklist).

### Changed

- **Theme system redesigned around the Geist design system.** Semantic tokens (`--ran-color-*`) now map onto Geist base scales; dark mode is a single source of truth (`theme/dark.less` mixin) that redefines the base scale so every semantic token flips automatically.
- Aligned components with Geist: control radius (`button`, `input`, `select`), primary button hover/active scale stepping, menu/modal radius + shadows, and Geist font/motion tokens.
- Added keyboard focus rings (`:focus-visible` / `:focus-within`) to `button`, `input`, `link`, `checkbox`, and `progress`.

### Removed

- **Removed all opt-in theme packs** (pixel-retro, windows-98, windows-xp, system-6, wired, paper, neo-brutalism), the `dark-overrides`/`transitions` stylesheets, the wired SVG pipeline, the `roughjs` dependency, and the `setThemePack`/`getThemePack`/`RanThemePackName` APIs. Only the base light/dark theme remains.
- Removed dead `theme/color.less` and `theme/compat.less` (legacy aliases with no consumers) and the pack-only `--ran-skin-*` primitives.

### Fixed

- `r-input` no longer balloons in height when a `message` is set: the field box now defaults to content height (`--ran-input-height: auto`, min-height still 32px) instead of `100%`, which mis-resolved against the taller host once a message stacked below.
- `r-input` `change` now fires on commit/blur (native semantics) instead of on every keystroke — `input` still fires per keystroke. Previously every keypress dispatched `change`.
- `r-select` listbox items now expose `role="option"` (they already had `aria-selected`), so screen readers announce them.
- `r-select` long selected text now ellipsizes (the selection item is width-bounded so `text-overflow: ellipsis` can trigger) instead of being hard-clipped.
- Lowered `engines.node` from `>=24.0.0` to `>=20.19.0` so consumers on Node 20–23 don't get an engine warning.
- Fixed dark-mode rendering bugs from hardcoded colors: `dropdown-item` text/hover/active, `skeleton` base + shimmer (previously invisible in dark), and `radar` canvas label color and grid lines now follow the theme tokens.
- **Boolean-semantic properties now return real booleans** instead of strings (the string form made `if (el.prop)` always truthy): `r-checkbox.checked`, `r-checkbox.disabled`, `r-input.disabled`, `r-input.required`. Setters still accept boolean or string; boolean attributes now reflect as `disabled=""` (HTML convention). (Breaking — pre-1.0 beta.)
- Demo hero CTA text is now vertically centered (the inner anchor's `height:100%` collapsed against an auto-height host; fixed with a fixed host height + `line-height:1`).
- Demo route navigation is now reachable on mobile (it was hidden under 820px); it drops to its own full-width row instead.
- Demo accessibility: GitHub/Issues links now have `aria-label`s (they become icon-only on mobile), the primary `<nav>` is labelled, and the demo honors `prefers-reduced-motion`.
- Elevation: recalibrated the overlay shadow tiers (`--ran-shadow-menu`, `--ran-shadow-modal`) so floating layers (dropdown, select, modal, message) actually read as elevated — the earlier Geist-literal values were imperceptible. `message` now uses the menu tier instead of the flat card tier. Documented "elevation = role" in DESIGN.md §4 / CLAUDE.md.

### Tests

- Improved `r-player` unit coverage by adding controls, media event handler, fullscreen compatibility, interaction, and manifest level tests.
- Increased `player/index.ts` line coverage to 87.97% and overall ranui line coverage to 93.08%.
- Added coverage for player lifecycle cleanup, Hls teardown, media listener cleanup, attribute synchronization, clarity switching, seeking, volume, fullscreen, and controller interactions.
- Added shared unit test helpers for mounting components, waiting for async DOM work, and mocking element geometry.
- Added keyboard and accessibility contract coverage for `r-popover` and `r-select`.

### Fixed

- Restored the remembered volume when unmuting `r-player`.
- Guarded player controller hover and progress leave handlers against events without an element target.
- Made player fullscreen helpers fall back to prefixed browser APIs when standard fullscreen APIs are unavailable.
- Made `r-popover` keyboard-focusable, track `aria-expanded`, support Enter/Space/Escape keyboard interactions, and remove the same listeners it registers.

### Changed

- Extracted player fullscreen API selection and HLS manifest level normalization into focused core helpers for easier testing.
