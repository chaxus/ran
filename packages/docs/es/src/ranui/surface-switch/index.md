---
description: "A select of surface languages (solid / liquid glass) wired to ranui's surface API."
---

# SurfaceSwitch

A compact **select** of surface languages (**solid / liquid glass**) wired to ranui's
[theme API](/ranui/theme/) (`setSurface` / `getSurface`). Picking an option calls `setSurface()`,
persists under `ran-surface`, and keeps every instance on the page (and in other tabs) in sync.
Colour theme is a separate axis: use [`<r-theme-switch>`](/ranui/theme-switch/) for that.

The method behind solid versus glass is the [surface language](/design/surface) guide.

> **Use when** you need a ready-made style control beside the colour theme. `<r-surface-switch>`
> handles persistence and cross-tab sync so you don't hand-roll a menu.

## Quick Start

### Basic Usage

<ran-demo>
  <r-surface-switch></r-surface-switch>
</ran-demo>

```html
<r-surface-switch></r-surface-switch>
```

```js
import 'ranui'; // or the standalone entry:
import 'ranui/surface-switch';
```

Call `initSurface()` once on page load (with `initTheme()`) so the saved choice restores before
paint:

```js
import { initTheme, initSurface } from 'ranui';
initTheme();
initSurface();
```

## API Reference

### Properties

| Property | Type                 | Default   | Description                                                                       |
| -------- | -------------------- | --------- | --------------------------------------------------------------------------------- |
| `value`  | `'solid' \| 'glass'` | `'solid'` | Current surface from `getSurface()`. Setting it applies and persists the surface. |
| `sheet`  | `string`             | `''`      | CSS injected into the component's shadow DOM.                                     |

### Localization Attributes

| Attribute     | Default          | Description                     |
| ------------- | ---------------- | ------------------------------- |
| `label`       | `'Style'`        | `aria-label` of the select.     |
| `label-solid` | `'Graphite'`     | Option text for solid Graphite. |
| `label-glass` | `'Liquid glass'` | Option text for liquid glass.   |

## Events

| Event    | Detail                            | Description                                                          |
| -------- | --------------------------------- | -------------------------------------------------------------------- |
| `change` | `{ surface: 'solid' \| 'glass' }` | Fired when the user picks a surface. Bubbles and crosses shadow DOM. |

## CSS Parts

| Part              | Description             |
| ----------------- | ----------------------- |
| `select`          | The inner `r-select`.   |
| `option`          | Every `r-option`.       |
| `solid` / `glass` | The individual options. |

```css
r-surface-switch {
  --ran-surface-switch-width: 10.5rem;
}
```
