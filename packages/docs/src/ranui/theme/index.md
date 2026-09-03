---
description: "ranui's runtime theme system: initTheme / setTheme / getTheme, light, dark and system mode, scoped targets, and runtime token overrides."
---

# Theming

The **runtime** half of ranui's styling: switching between light, dark and system mode,
persisting the choice, and overriding tokens on the fly.

The tokens themselves (what they are called and what each one is for) are the
[design system](/src/ranui/design-system/); the rules for choosing between them are the
[design guidelines](/src/ranui/design-guides/). This page is only about _applying_ them.

> **Use when** you need light/dark theming in a ranui app: call `initTheme` once on load,
> `setTheme` to switch, and `setThemeToken(s)` if you want to override individual tokens
> without shipping extra CSS.

There are exactly two themes: **light** and **dark**, plus a **system** mode that follows the
OS preference. (Earlier "theme pack" APIs were removed; `setThemePack` / `RanThemePackName` no
longer exist.)

## Quick start

```js
import { initTheme, setTheme, getTheme } from 'ranui/theme';

// Restore the persisted theme ('light' | 'dark' | 'system') from localStorage
initTheme();

// Switch theme — persisted automatically
setTheme('dark');
setTheme('system'); // tracks prefers-color-scheme and updates live

getTheme(); // → 'light' | 'dark' | 'system' | ''
```

The dedicated **`ranui/theme`** entry ships only the theming engine: importing it registers no
custom elements, so a page that just wants tokens and dark mode never pulls in the component
library. The same functions are also re-exported from the top-level `ranui` barrel.

`setTheme` writes a `data-ran-theme` (and a legacy `theme`) attribute onto `<html>`; all
component styles react to it. The choice is saved under the localStorage key `ran-theme`.

For ready-made switching UI, use [`<r-theme-switch>`](/src/ranui/theme-switch/): a
system / light / dark segmented control already wired to this API, synced across instances,
and updating the `theme-color` metas.

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

**`target`**: every function defaults to `<html>` (`document.documentElement`). Pass an element
to scope a theme or token override to a subtree instead of the whole page.

**SSR-safe**: all `document` / `localStorage` / `matchMedia` access is guarded, so these
functions are inert (not throwing) during server rendering.

## How dark mode works

`setTheme('dark')` sets `data-ran-theme="dark"` on `<html>`. The stylesheet then redefines
**only the base palette** for dark, from a single source of truth; every `--ran-color-*`
semantic token references that palette through `var()`, so it flips automatically and no
component carries a dark-mode override of its own.

Two consequences worth knowing:

- **Your own CSS gets dark mode for free** if it consumes semantic tokens, and gets it wrong
  if it hard-codes a color or writes a light-only fallback. See
  [Using tokens in your own CSS](/src/ranui/design-system/#using-tokens-in-your-own-css).
- **Nothing should transition on a theme flip.** CSS cannot tell why a color changed, so a
  `transition` on a palette property fades every element at its own pace when the theme
  switches. ranui's components deliberately don't; yours shouldn't either.

## Customizing tokens

### At runtime (JS)

```js
import { setThemeToken, setThemeTokens, clearThemeToken } from 'ranui/theme';

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

Override tokens under `:root`, or any scope you like:

```css
:root {
  --ran-color-primary: #7c3aed;
  --ran-radius-md: 8px;
}
```

### Which layer to override

Because dark mode redefines only the base palette:

- Override a **semantic** token (`--ran-color-primary`) for a change that should be the same in
  both themes.
- Override a **base** scale step (`--ran-blue-700`) when the change should flip with the theme:
  everything semantic that references it follows.
- Override a **component** token (`--ran-btn-hover-background`) to change exactly one element.

That layering is described in full on the [design system](/src/ranui/design-system/#two-layers)
page. Note that a runtime override is an inline style on the target: it wins over stylesheet
rules for that subtree, which is what makes per-panel theming work, and what makes an
override you forgot to clear hard to spot later.

## Scoping a theme to part of the page

Every function takes a target, so a preview pane can run a different theme from the page
around it:

```js
const preview = document.querySelector('#preview');

setTheme('dark', preview); // this subtree only
getTheme(preview); // → 'dark'
```

The attribute lands on that element instead of `<html>`, and the token cascade does the rest.
