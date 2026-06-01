# Design

## Overview

The ranui demo uses a workbench-style brand surface: product introduction, live component preview, theme-pack controls, component directory, and lightweight same-page documentation. The visual system should demonstrate that ranui can be precise, themeable, and framework-neutral.

## Color

The page chrome is driven by ranui theme tokens:

- `--page`: `--ran-page-background`
- `--surface`: `--ran-surface-background`
- `--surface-2`: `--ran-surface-background-muted`
- `--ink`: `--ran-page-text`
- `--muted`: `--ran-page-text-muted`
- `--line`: `--ran-surface-border`
- `--accent`: `--ran-accent-color`
- `--accent-2`: `--ran-accent-color-secondary`

Theme packs should visibly affect the demo. Do not override page-level theme tokens per pack except for pack-specific typography, radius, and preview affordances.

## Typography

Use `--ran-font-family` as the default. Pack-specific families may override page chrome when the pack is active. Headlines should stay compact and technical, with balanced wrapping and no negative letter-spacing.

## Layout

The primary page width is `min(1180px, calc(100% - 40px))`, tightening to `calc(100% - 28px)` on small screens. The page uses a sticky top navigation, a two-column hero on desktop, and single-column mobile layout.

## Components

Prefer real ranui custom elements in the demo surface:

- `r-section` for major content bands.
- `r-card` for repeated feature, component, and docs entries.
- `r-select` for theme controls.
- `r-button`, `r-input`, `r-progress`, `r-checkbox`, and related components for live examples.

Plain HTML is acceptable for page-level chrome, code blocks, and non-component scaffolding.

## Motion

Motion should be restrained and useful: hover feedback, active pack indication, and subtle page-load polish. All animations need reduced-motion alternatives.

## Responsive Rules

Desktop should expose navigation, theme controls, hero preview, and grouped component cards. Tablet should use two-column grids where content remains readable. Mobile should prioritize vertical scanning, full-width controls, touch-size links/buttons, and no horizontal overflow.
