# Changelog

All notable changes to `ranui` will be documented in this file.

## [Unreleased]

### Added

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
