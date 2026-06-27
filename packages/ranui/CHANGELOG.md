# Changelog

All notable changes to `ranui` will be documented in this file.

## [Unreleased]

### Added

- Rebuilt the demo page as a lightweight, token-driven Geist-style showcase (color scales, radius/elevation, buttons, forms, feedback, surfaces, radar) with a light/dark toggle. The top nav also includes GitHub/Issues links and an EN/中文 language switcher (persisted, auto-detected from `navigator.language`). See `changelogs/2026-06-27.md`.
- New Geist-based design tokens: full `--ran-gray/gray-alpha/blue/red/amber/green-100..1000` scales, `--ran-background-100/200`, `--ran-space-*` spacing scale, `--ran-radius-full`, `--ran-shadow-menu/modal`, `--ran-focus-ring`, and `--ran-color-primary-hover/active`.

### Changed

- **Theme system redesigned around the Geist design system.** Semantic tokens (`--ran-color-*`) now map onto Geist base scales; dark mode is a single source of truth (`theme/dark.less` mixin) that redefines the base scale so every semantic token flips automatically.
- Aligned components with Geist: control radius (`button`, `input`, `select`), primary button hover/active scale stepping, menu/modal radius + shadows, and Geist font/motion tokens.
- Added keyboard focus rings (`:focus-visible` / `:focus-within`) to `button`, `input`, `link`, `checkbox`, and `progress`.

### Removed

- **Removed all opt-in theme packs** (pixel-retro, windows-98, windows-xp, system-6, wired, paper, neo-brutalism), the `dark-overrides`/`transitions` stylesheets, the wired SVG pipeline, the `roughjs` dependency, and the `setThemePack`/`getThemePack`/`RanThemePackName` APIs. Only the base light/dark theme remains.
- Removed dead `theme/color.less` and `theme/compat.less` (legacy aliases with no consumers) and the pack-only `--ran-skin-*` primitives.

### Fixed

- Fixed dark-mode rendering bugs from hardcoded colors: `dropdown-item` text/hover/active, `skeleton` base + shimmer (previously invisible in dark), and `radar` canvas label color and grid lines now follow the theme tokens.

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
