# ranui Theme & Style System

> Last updated: 2026-06-27

## Overview

ranui's theming is a **token-driven system based on the [Geist design system](https://vercel.com/design)**. It ships a single light/dark theme — there are no theme packs. Styling is layered:

```
Base palette (Geist scales)   --ran-gray-700, --ran-blue-700 …
        ↓ referenced by
Semantic tokens               --ran-color-primary, --ran-color-text …
        ↓ default values for
Component tokens              --ran-btn-content-background-color …
```

The system preserves ranui's Web Components boundaries:

- Component styles stay inside Shadow DOM.
- Consumers customize through CSS custom properties, `::part()`, the `sheet` attribute, slots, and exported CSS.
- CSS custom properties cross Shadow DOM; selectors do not.
- Server-side rendering and Declarative Shadow DOM stay compatible (the runtime API only touches attributes / CSS variables and is SSR-guarded).

## Design Principles

1. **Semantic tokens describe intent** — primary color, text, border, surface, radius, shadow, motion.
2. **Component tokens are public override points** that default to semantic tokens.
3. **Semantic tokens reference the base scale**, so dark mode only needs to redefine the scale (see below).
4. **Shadow DOM stays isolated; CSS variables cross it** via inheritance — no piercing.
5. **`sheet` is an escape hatch**, not the primary theming API.
6. **Public token docs are generated from source** (`npm run doc:style`).

## Token Layers

### Layer 1 — Base palette (Geist scales)

Defined in [`theme/tokens.less`](../theme/tokens.less) on `:root`. Rarely used directly by component styles; they are the raw material semantic tokens point at.

```css
:root {
  /* 10-step scales: 100 (lightest) → 1000 (darkest), in light mode */
  --ran-gray-100: #f2f2f2; /* … */
  --ran-gray-1000: #171717;
  --ran-gray-alpha-100: #0000000d; /* translucent, layer over any surface */
  --ran-blue-700: #006bff; /* + red / amber / green 100..1000 */
  --ran-background-100: #ffffff;
  --ran-background-200: #fafafa;
}
```

### Layer 2 — Semantic tokens

The primary theme contract. Defined once on `:root`; each references a base-scale step so it flips automatically in dark mode.

```css
:root {
  --ran-color-primary: var(--ran-blue-700);
  --ran-color-primary-hover: var(--ran-blue-800);
  --ran-color-primary-active: var(--ran-blue-900);
  --ran-color-success: var(--ran-green-700);
  --ran-color-warning: var(--ran-amber-700);
  --ran-color-danger: var(--ran-red-700);

  --ran-color-bg: var(--ran-background-100);
  --ran-color-bg-subtle: var(--ran-background-200);
  --ran-color-bg-elevated: var(--ran-background-100); /* dark: → --ran-gray-100 */
  --ran-color-bg-muted: var(--ran-gray-100);
  --ran-color-text: var(--ran-gray-1000);
  --ran-color-text-secondary: var(--ran-gray-900);
  --ran-color-text-disabled: var(--ran-gray-700);
  --ran-color-border: var(--ran-gray-400);
  --ran-color-border-secondary: var(--ran-gray-300);
  --ran-color-link: var(--ran-blue-700);

  --ran-font-family: 'Geist', 'Geist Sans', -apple-system, …;
  --ran-font-mono: 'Geist Mono', ui-monospace, …;
  --ran-font-size: 14px;
  --ran-line-height: 1.5715;

  --ran-radius-sm: 6px;
  --ran-radius-md: 12px;
  --ran-radius-lg: 16px;
  --ran-radius-full: 9999px;

  --ran-space-1: 4px; /* … 4px base unit … */
  --ran-space-24: 96px;

  --ran-shadow-elevated: 0 2px 2px rgba(0, 0, 0, 0.04);
  --ran-shadow-menu: …;
  --ran-shadow-modal: …;
  --ran-focus-ring: 0 0 0 2px var(--ran-background-100), 0 0 0 4px var(--ran-color-primary);

  --ran-motion-duration-fast: 0.15s;
  --ran-motion-duration-base: 0.2s;

  /* skin primitives — the minimal set components actually consume */
  --ran-skin-border-width: 1px;
  --ran-skin-border-style: solid;
  --ran-skin-raised-shadow: var(--ran-shadow-elevated);
  --ran-skin-font-family: var(--ran-font-family);
}
```

### Layer 3 — Component tokens

Stable public override points that fall back to semantic tokens, which fall back to a literal:

```css
.ran-btn-content {
  background-color: var(--ran-btn-content-background-color, var(--ran-color-primary, #006bff));
  color: var(--ran-btn-content-color, #fff);
  border-radius: var(--ran-btn-content-border-radius, var(--ran-radius-sm, 6px));
}
```

Component fallbacks should point at **tokens that flip with the theme** (e.g. `--ran-gray-alpha-100`, `--ran-blue-100`, `--ran-color-text`) rather than literal light-only colors, so dark mode is correct without per-component overrides.

### Layer 4 — Runtime/internal tokens

JS-controlled, not part of the design API: `--ran-x`, `--ran-y`, `--progress-percent`, popover/dropdown positioning vars.

## Dark Mode — a single source of truth

Dark mode lives in [`theme/dark.less`](../theme/dark.less) as one LESS mixin, `.ran-theme-dark()`, that **only redefines the base scale**. Because semantic tokens reference the scale, every semantic token flips automatically — only surfaces that don't track a single scale step (e.g. `--ran-color-bg-elevated`) and the literal shadows are overridden explicitly.

```less
.ran-theme-dark() {
  --ran-gray-1000: #ededed;
  --ran-blue-700: #006efe;
  /* … full scale … */
  --ran-color-bg-elevated: var(--ran-gray-100);
  --ran-shadow-elevated: 0 1px 2px rgba(0, 0, 0, 0.16);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-ran-theme='light']):not([theme='light']) {
    .ran-theme-dark();
  }
}
:root[data-ran-theme='dark'],
:root[theme='dark'] {
  .ran-theme-dark();
}
```

This covers both system preference (unless explicitly set to light) and an explicit `data-ran-theme="dark"` (or legacy `theme="dark"`) attribute, without duplicating the dark values.

## Public API

### CSS entry

```ts
import 'ranui/style';
```

Loads [`theme/index.less`](../theme/index.less) → `tokens.less` (base + light semantic) + `dark.less` (dark scale).

### Attribute switching

```html
<html data-ran-theme="dark">
  <!-- recommended, namespaced -->
  <html theme="dark">
    <!-- legacy, still supported -->
  </html>
</html>
```

### Runtime API ([`utils/theme.ts`](../utils/theme.ts))

```ts
type RanThemeName = 'light' | 'dark' | 'system';
type ThemeTarget = HTMLElement | Document;

initTheme(target?): void;                 // restore persisted choice on load
setTheme(name, target?): void;            // 'system' tracks prefers-color-scheme
getTheme(target?): RanThemeName | '';
setThemeToken(name, value, target?): void;
setThemeTokens(tokens, target?): void;
clearThemeToken(name, target?): void;
```

`setTheme` writes `data-ran-theme` + `theme` and persists to `localStorage('ran-theme')`. Default target is `document.documentElement`. All functions are no-ops when `document` / `localStorage` are unavailable (SSR-safe).

```ts
import { setTheme, setThemeTokens } from 'ranui';
setTheme('dark');
setThemeTokens({ '--ran-color-primary': '#6c47ff', '--ran-radius-md': '10px' });
```

### What happens when the theme switches

1. **One attribute write, no component JS.** `setTheme('dark')` only sets `data-ran-theme` / `theme` on `:root`.
2. **The CSS engine re-evaluates the cascade.** The `.ran-theme-dark()` block becomes active and the base scale takes dark values.
3. **CSS custom properties cross Shadow DOM.** Custom properties are inherited, so every component reading `var(--ran-color-*)` sees the new value with no JS inside the component.
4. **Render pipeline.** Light/dark only changes color-family properties → paint-only, no reflow, completes in one frame. (Avoid theme changes that alter `border-width` / `padding` / `font-family`, which force layout/reflow.)

### Component overrides

```css
r-button {
  --ran-btn-content-background-color: #6c47ff;
}
r-button::part(content) {
  border-radius: 999px;
}
```

```html
<r-button sheet=".ran-btn-content { background: rebeccapurple; }"></r-button>
```

## Files

- [`theme/tokens.less`](../theme/tokens.less) — base palette + light semantic + skin primitives.
- [`theme/dark.less`](../theme/dark.less) — `.ran-theme-dark()` mixin + selectors.
- [`theme/index.less`](../theme/index.less) — imports the two above; loaded by `style.ts`.
- [`theme/font.less`](../theme/font.less) — shared `@fontFamily` LESS var (checkbox).
- [`utils/theme.ts`](../utils/theme.ts) — runtime API, re-exported from `utils/index.ts` and the `ranui` barrel.

## Generated token docs

Public token / part documentation is generated from source:

```bash
npm run doc:style
```

- [`docs/style-tokens-public.md`](./style-tokens-public.md) — public component tokens.
- [`docs/style-tokens-parts.md`](./style-tokens-parts.md) — full token + `::part()` inventory.
- [`docs/style-token-filter.json`](./style-token-filter.json) — filtering rules.

## Testing

- [`test/unit/utils.theme.test.ts`](../test/unit/utils.theme.test.ts) — runtime API (set/get/initTheme, tokens, system mode).
- [`test/unit/theme.skin-tokens.test.ts`](../test/unit/theme.skin-tokens.test.ts) — base scale presence, semantic mapping, skin layer, dark source.
- [`test/ssr/theme.tokens.ssr.test.ts`](../test/ssr/theme.tokens.ssr.test.ts) — SSR-safe theme utilities.

## Compatibility rules

1. `--ran-[component]-*` overrides keep working.
2. `theme="dark"` keeps working; prefer `data-ran-theme`.
3. No component requires JavaScript to receive a CSS-variable theme.
4. The runtime API only writes attributes and CSS variables — it never imports component modules.
