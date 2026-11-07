---
description: "ranui's runtime theme system: initTheme / setTheme / getTheme, light, dark and system mode, scoped targets, and runtime token overrides."
---

# Theming

The **runtime** half of ranui's styling: switching between light, dark and system mode,
persisting the choice, and overriding tokens on the fly.

The tokens themselves (what they are called and what each one is for) are the
[design system](/design/design-system/); the rules for choosing between them are the
[design guidelines](/design/design-guides/). This page is only about _applying_ them.

> **Use when** you need light/dark theming in a ranui app: call `initTheme` once on load,
> `setTheme` to switch, and `setThemeToken(s)` if you want to override individual tokens
> without shipping extra CSS.

There are exactly two colour themes: **light** and **dark**, plus a **system** mode that follows the
OS preference. The Apple-style **Liquid Glass look is not a third colour theme** — it is the
**surface language**: **solid** (default Graphite) or **glass** (frosted controls, tuned to the
macOS 27 Liquid Glass materials). Combine freely, e.g. `setTheme('dark')` + `setSurface('glass')`.
Glass is never the library default — enable it on purpose.

(Earlier "theme pack" APIs were removed; `setThemePack` / `RanThemePackName` no longer exist.)

## Quick start

```js
import { initTheme, setTheme, getTheme, initSurface, setSurface, getSurface } from 'ranui/theme';

// Restore the persisted theme ('light' | 'dark' | 'system') from localStorage
initTheme();
// Restore liquid glass / solid surface (localStorage key `ran-surface`)
initSurface();

// Switch theme — persisted automatically
setTheme('dark');
setTheme('system'); // tracks prefers-color-scheme and updates live

getTheme(); // → 'light' | 'dark' | 'system' | ''

// Surface language — persisted on <html> under `ran-surface`
setSurface('glass');
getSurface(); // → 'glass'
setSurface('solid');
```

The dedicated **`ranui/theme`** entry ships only the theming engine: importing it registers no
custom elements, so a page that just wants tokens and dark mode never pulls in the component
library. The same functions are also re-exported from the top-level `ranui` barrel.

`setTheme` writes a `data-ran-theme` (and a legacy `theme`) attribute onto `<html>`; all
component styles react to it. The choice is saved under the localStorage key `ran-theme`.

For ready-made switching UI, use two orthogonal selects: [`<r-theme-switch>`](/ranui/theme-switch/)
for system / light / dark, and [`<r-surface-switch>`](/ranui/surface-switch/) for Graphite / liquid glass. Theme never
forces a style, and glass still respects light and dark. Both stay in sync across instances;
the theme switch also updates `theme-color` metas. This documentation site puts both in the
header as one appearance pair.

## API

| Function          | Signature                                                               | Description                                                                                |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `initTheme`       | `(target?: ThemeTarget) => void`                                        | Restore the saved theme from `localStorage`. Call once on load. No-op in SSR.              |
| `setTheme`        | `(name: RanThemeName, target?: ThemeTarget) => void`                    | Apply `'light'` \| `'dark'` \| `'system'` and persist it. `'system'` tracks the OS live.   |
| `getTheme`        | `(target?: ThemeTarget) => RanThemeName \| ''`                          | Read the active theme. Returns `'system'` when system mode is active, `''` if none is set. |
| `setSurface`      | `(name: RanSurfaceName, target?: ThemeTarget) => void`                  | Apply `'solid'` \| `'glass'`. `solid` removes `data-ran-surface`. Persists when target is `<html>`. |
| `getSurface`      | `(target?: ThemeTarget) => RanSurfaceName`                              | Read the surface language; missing attribute means `'solid'`.                              |
| `initSurface`     | `(target?: ThemeTarget) => void`                                        | Restore the saved surface from `localStorage`. Call once on load. No-op in SSR.            |
| `setThemeToken`   | `(name: string, value: string \| number, target?: HTMLElement) => void` | Override a single token at runtime (inline style on the target).                           |
| `setThemeTokens`  | `(tokens: ThemeTokenMap, target?: HTMLElement) => void`                 | Override many tokens at once. A `null` / `undefined` value clears that token.              |
| `clearThemeToken` | `(name: string, target?: HTMLElement) => void`                          | Remove a runtime token override.                                                           |

**Types**

```ts
type RanThemeName = 'light' | 'dark' | 'system';
type RanSurfaceName = 'solid' | 'glass';
type ThemeTarget = HTMLElement | Document; // defaults to document.documentElement
type ThemeTokenMap = Record<string, string | number | null | undefined>;
```

**`target`**: every function defaults to `<html>` (`document.documentElement`). Pass an element
to scope a theme or token override to a subtree instead of the whole page.

**SSR-safe**: all `document` / `localStorage` / `matchMedia` access is guarded, so these
functions are inert (not throwing) during server rendering.

## Surface language (solid / glass)

This is how you ship a **glass theme** without adding another palette. Colour theme and
surface language are independent axes — see the [surface language](/design/surface) guide
(Apple Liquid Glass: functional layer vs content layer).

`setSurface('glass')` writes `data-ran-surface="glass"` on the target (usually `<html>`).

| Under document glass | Behaviour |
| -------------------- | --------- |
| Default `r-button` | Frosts (Apple `glass`) |
| `type="primary"` / `warning` | Stay **solid** (Apple `glassProminent`) |
| `r-modal`, non-toast `r-message` | Overlay frost |
| `r-card`, `r-input` | Stay **solid** (content layer); opt in with `surface="glass"` |
| Toast pills | Stay **solid** |

Set `surface="solid"` on a control to opt out of document glass. `prefers-reduced-transparency: reduce` falls back to elevated solid tokens, matching [`r-glass`](/ranui/glass/).

For a full liquid pane (lens refraction, materials, rim), keep using [`r-glass`](/ranui/glass/)
— the surface axis is the control-family frost, not a replacement for that component.

<ran-demo>
  <div style="display: grid; gap: 16px;">
    <div style="position: relative; padding: 24px; border-radius: 16px; overflow: hidden; background:
      radial-gradient(circle at 18% 22%, #7eb8ff 0%, transparent 42%),
      radial-gradient(circle at 82% 28%, #ff8fa3 0%, transparent 38%),
      radial-gradient(circle at 48% 78%, #7de89a 0%, transparent 42%),
      radial-gradient(circle at 70% 60%, #ffd27a 0%, transparent 35%),
      linear-gradient(135deg, #ececf2 0%, #e4e8f0 100%);">
      <p style="margin: 0 0 12px; font-size: 13px; color: #55555e;">solid (default)</p>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
        <r-card heading="Solid card" description="Graphite elevated surface." style="width: 220px;">
          <r-input label="Name" placeholder="Ada"></r-input>
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <r-button type="primary">Save</r-button>
            <r-button>Cancel</r-button>
          </div>
        </r-card>
      </div>
    </div>
    <div data-ran-surface="glass" style="position: relative; padding: 24px; border-radius: 16px; overflow: hidden; background:
      radial-gradient(circle at 18% 22%, #7eb8ff 0%, transparent 42%),
      radial-gradient(circle at 82% 28%, #ff8fa3 0%, transparent 38%),
      radial-gradient(circle at 48% 78%, #7de89a 0%, transparent 42%),
      radial-gradient(circle at 70% 60%, #ffd27a 0%, transparent 35%),
      linear-gradient(135deg, #ececf2 0%, #e4e8f0 100%);">
      <p style="margin: 0 0 12px; font-size: 13px; color: #55555e;">glass (`data-ran-surface`)</p>
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
        <r-card surface="glass" heading="Glass card" description="Opt-in frosted plate." style="width: 220px;">
          <r-input label="Name" placeholder="Ada"></r-input>
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <r-button type="primary">Save</r-button>
            <r-button>Cancel</r-button>
          </div>
        </r-card>
      </div>
    </div>
  </div>
</ran-demo>

## How dark mode works

`setTheme('dark')` sets `data-ran-theme="dark"` on `<html>`. The stylesheet then redefines
**only the base palette** for dark, from a single source of truth; every `--ran-color-*`
semantic token references that palette through `var()`, so it flips automatically and no
component carries a dark-mode override of its own.

Two consequences worth knowing:

- **Your own CSS gets dark mode for free** if it consumes semantic tokens, and gets it wrong
  if it hard-codes a color or writes a light-only fallback. See
  [Using tokens in your own CSS](/design/design-system/#using-tokens-in-your-own-css).
- **Nothing should transition on a theme flip.** CSS cannot tell why a color changed, so a
  `transition` on a palette property fades every element at its own pace when the theme
  switches. ranui's components deliberately don't; yours shouldn't either.

## Customizing tokens {#customizing-tokens}

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
- Override a **skin** primitive (`--ran-skin-font-family`, `--ran-skin-raised-shadow`, border
  width/style) when a host brand kit should restyle chrome without inventing a second token
  system. Keep Graphite/`--ran-*` as the product surface; load `ranui/fonts` if the stack still
  names Geist, or point `--ran-skin-font-family` at the host face.

That layering is described in full on the [design system](/design/design-system/#two-layers)
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
