---
description: "A select of color themes (system / light / dark) wired to ranui's theme API."
---

# ThemeSwitch

A compact **select** of color themes (**system / light / dark**) wired to ranui's
[theme API](/ranui/theme/). Picking an option calls `setTheme()`, persists under `ran-theme`,
and keeps every instance on the page (and in other tabs) in sync. Style / liquid glass is a
separate axis: use [`<r-surface-switch>`](/ranui/surface-switch/) for that.

> **Use when** you need a ready-made color-theme control. `<r-theme-switch>` handles persistence,
> system tracking, and cross-tab sync so you don't hand-roll a menu.

## Quick Start

### Basic Usage

<ran-demo>
  <r-theme-switch></r-theme-switch>
</ran-demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui'; // or the standalone entry:
import 'ranui/theme-switch';
```

Call `initTheme()` once on page load so the saved choice restores before paint:

```js
import { initTheme } from 'ranui';
initTheme();
```

## API Reference

### Properties

| Property | Type                            | Default    | Description                                                                 |
| -------- | ------------------------------- | ---------- | --------------------------------------------------------------------------- |
| `value`  | `'system' \| 'light' \| 'dark'` | `'system'` | Current theme from `getTheme()`. Setting it applies and persists the theme. |
| `sheet`  | `string`                        | `''`       | CSS injected into the component's shadow DOM.                               |

### Localization Attributes

| Attribute      | Default    | Description                 |
| -------------- | ---------- | --------------------------- |
| `label`        | `'Theme'`  | `aria-label` of the select. |
| `label-system` | `'System'` | Option text for system.     |
| `label-light`  | `'Light'`  | Option text for light.      |
| `label-dark`   | `'Dark'`   | Option text for dark.       |

## Events

| Event    | Detail                                     | Description                                                        |
| -------- | ------------------------------------------ | ------------------------------------------------------------------ |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | Fired when the user picks a theme. Bubbles and crosses shadow DOM. |

## CSS Parts

| Part                          | Description             |
| ----------------------------- | ----------------------- |
| `select`                      | The inner `r-select`.   |
| `option`                      | Every `r-option`.       |
| `system` / `light` / `dark`   | The individual options. |

```css
r-theme-switch {
  --ran-theme-switch-width: 9rem;
}
```
