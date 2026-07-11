# Theming

ranui ships a light/dark theme system built on **design tokens** (CSS custom properties).
Components never hard-code colors — they read semantic tokens, so switching theme or
overriding a token restyles the whole library at once. The token system is based on the
[Geist](https://vercel.com/geist) design language.

> **Use when** you need to add light/dark theming to a ranui app — call `initTheme` / `setTheme` and consume the semantic `--ran-color-*` design tokens so switching theme or overriding a token restyles the whole library at once.

There are exactly two themes — **light** and **dark** — plus a **system** mode that follows
the OS preference. (Earlier "theme pack" APIs were removed; `setThemePack` / `RanThemePackName`
no longer exist.)

## Quick start

Call `initTheme()` once on page load to restore the user's saved choice, then `setTheme()`
to switch:

```js
import { initTheme, setTheme, getTheme } from 'ranui';

// Restore the persisted theme ('light' | 'dark' | 'system') from localStorage
initTheme();

// Switch theme — persisted automatically
setTheme('dark');
setTheme('system'); // tracks prefers-color-scheme and updates live

getTheme(); // → 'light' | 'dark' | 'system' | ''
```

`setTheme` writes `data-ran-theme` (and a legacy `theme`) attribute onto `<html>`; all
component styles react to it. The choice is saved under the localStorage key `ran-theme`.

For ready-made theme-switching UI, use the [`<r-theme-switch>`](/src/ranui/theme-switch/)
component — a system / light / dark segmented control wired to this API.

## API

| Function          | Signature                                                               | Description                                                                                |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `initTheme`       | `(target?: ThemeTarget) => void`                                        | Restore the saved theme from `localStorage`. Call once on load. No-op in SSR.              |
| `setTheme`        | `(name: RanThemeName, target?: ThemeTarget) => void`                    | Apply `'light'` \| `'dark'` \| `'system'` and persist it. `'system'` tracks the OS live.   |
| `getTheme`        | `(target?: ThemeTarget) => RanThemeName \| ''`                          | Read the active theme. Returns `'system'` when system mode is active, `''` if none is set. |
| `setThemeToken`   | `(name: string, value: string \| number, target?: HTMLElement) => void` | Override a single token at runtime (inline style on the target).                           |
| `setThemeTokens`  | `(tokens: ThemeTokenMap, target?: HTMLElement) => void`                 | Override many tokens at once. A `null` / `undefined` value clears that token.              |
| `clearThemeToken` | `(name: string, target?: HTMLElement) => void`                          | Remove a runtime token override.                                                           |

**Types**

```ts
type RanThemeName = 'light' | 'dark' | 'system';
type ThemeTarget = HTMLElement | Document; // defaults to document.documentElement
type ThemeTokenMap = Record<string, string | number | null | undefined>;
```

**`target`** — every function defaults to `<html>` (`document.documentElement`). Pass an
element to scope a theme or token override to a subtree instead of the whole page.

**SSR-safe** — all `document` / `localStorage` / `matchMedia` access is guarded, so these
functions are inert (not throwing) during server rendering.

## Token layers

Tokens come in two layers. **Only consume the semantic layer** in your app — it flips
automatically between light and dark.

**Layer 1 — base palette** (raw scales, rarely used directly): each color runs `100 → 1000`
in 10 steps — `--ran-gray-100..1000`, `--ran-gray-alpha-100..1000`,
`--ran-blue/red/amber/green-100..1000`, plus `--ran-background-100/200`.

**Layer 2 — semantic tokens** (`--ran-color-*` and friends) map onto the base scale. Dark
mode redefines only the base scale, so every semantic token flips through `var()` with no
per-component dark overrides.

### Semantic color tokens

| Token                            | Role                      |
| -------------------------------- | ------------------------- |
| `--ran-color-primary`            | Primary action            |
| `--ran-color-primary-hover`      | Primary hover             |
| `--ran-color-primary-active`     | Primary active            |
| `--ran-color-success`            | Success                   |
| `--ran-color-warning`            | Warning                   |
| `--ran-color-danger`             | Danger / error            |
| `--ran-color-bg`                 | Page background           |
| `--ran-color-bg-subtle`          | Subtle background         |
| `--ran-color-bg-elevated`        | Card / surface background |
| `--ran-color-bg-muted`           | Muted surface             |
| `--ran-color-bg-hover`           | Hover surface             |
| `--ran-color-bg-active`          | Active surface            |
| `--ran-color-text`               | Primary text              |
| `--ran-color-text-secondary`     | Secondary text            |
| `--ran-color-text-disabled`      | Disabled text             |
| `--ran-color-border`             | Default border            |
| `--ran-color-border-secondary`   | Subtle border             |
| `--ran-color-border-hover`       | Hover border              |
| `--ran-color-border-active`      | Active border             |
| `--ran-color-link`               | Link color                |
| `--ran-color-contrast-bg`        | Contrast action surface   |
| `--ran-color-contrast-bg-hover`  | Contrast hover            |
| `--ran-color-contrast-bg-active` | Contrast active           |
| `--ran-color-contrast-text`      | Text on contrast surface  |

The **contrast** group backs the monochrome "highest-contrast" action (the Geist contrast
button, `<r-button type="contrast">`): black-on-white in light mode, white-on-black in dark.
Use it when the primary action should carry no hue.

**Color is a state ladder, not a palette.** Within a scale, each step has a fixed job:
`100` default bg · `200` hover bg · `300` active bg · `400` border · `500` hover border ·
`600` active border · `700` solid · `800` solid hover · `900` secondary text · `1000`
primary text.

### Non-color tokens

| Group      | Tokens                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| Radius     | `--ran-radius-sm` 6px · `--ran-radius-md` 12px · `--ran-radius-lg` 16px · `--ran-radius-full`             |
| Spacing    | `--ran-space-1..24` (4px base: 4 · 8 · 12 · 16 · 24 · 32 · 40 · 64 · 96)                                  |
| Elevation  | `--ran-shadow-elevated` (in-flow surface) · `--ran-shadow-menu` (overlay) · `--ran-shadow-modal` (dialog) |
| Z-index    | `--ran-z-modal` 1000 · `--ran-z-dropdown` 1100 · `--ran-z-message` 1200                                   |
| Motion     | `--ran-motion-duration-fast` 0.15s · `--ran-motion-duration-base` 0.2s                                    |
| Focus      | `--ran-focus-ring`                                                                                        |
| Typography | `--ran-font-family` (Geist Sans) · `--ran-font-mono` (Geist Mono)                                         |

## Fonts

ranui self-hosts the canonical faces behind `--ran-font-family` / `--ran-font-mono` — **Geist
Sans** and **Geist Mono** (variable weight 100–900, SIL OFL 1.1 licensed). They are shipped
with the package, so one import loads them with no CDN dependency:

```js
// bundlers
import 'ranui/fonts';
```

```html
<!-- static pages -->
<link rel="stylesheet" href="…/ranui/dist/fonts/fonts.css" />
```

Without this import the typography tokens fall back to system fonts — everything still works,
just without the Geist faces.

## Customizing tokens

### At runtime (JS)

```js
import { setThemeToken, setThemeTokens, clearThemeToken } from 'ranui';

// One token, on <html> (affects everything)
setThemeToken('--ran-color-primary', '#7c3aed');

// Many at once
setThemeTokens({
  '--ran-color-primary': '#7c3aed',
  '--ran-radius-md': '8px',
});

// Scope to a subtree
setThemeToken('--ran-color-primary', '#e11d48', document.querySelector('#panel'));

// Remove an override
clearThemeToken('--ran-color-primary');
```

### At build time (CSS)

Override the semantic tokens under `:root` (or any scope). Because dark mode only redefines
the base scale, override **semantic** tokens for theme-agnostic changes, or the **base
scale** if you want the change to flip too:

```css
:root {
  --ran-color-primary: #7c3aed;
  --ran-radius-md: 8px;
}
```

## How dark mode works

`setTheme('dark')` sets `data-ran-theme="dark"` on `<html>`. The stylesheet redefines only
the Layer 1 base scale for dark (via a single source of truth in `theme/dark.less`); every
`--ran-color-*` semantic token references the scale through `var()`, so it flips
automatically. This is why component-level tokens must use **dark-safe fallbacks** — a
fallback should point at a token that flips (`var(--ran-color-text, …)`), never a light-only
literal like `rgba(0,0,0,.06)`.
