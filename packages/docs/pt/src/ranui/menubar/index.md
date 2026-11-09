---
description: 'Hover handoff across sibling chrome selects — open on hover, morph the panel between peers.'
---

# Menubar

A thin bar that wires **hover open** and a **shared-layout hop** across sibling chrome
selects (`r-select`, `r-theme-switch`, `r-surface-switch`, or any host with `open`).

On a fine pointer, moving across triggers opens the next menu and morphs the portaled
panel from the previous box (Stripe / Floating UI FLIP). Touch keeps each control’s own
click. Soft enter from idle stays on the dropdown; hops skip enter/exit via
`html[data-ran-menubar-switch]`.

> **Use when** a row of chrome menus should feel like one surface (docs headers, settings
> toolbars). For a single select, use [`<r-select>`](/ranui/select/) alone.

## Quick Start

### Language + theme + surface

Hover across the three controls (desktop). The panel slides with the pointer instead of
blinking closed and open.

<ran-demo>
  <r-menubar style="gap: 8px">
    <r-select style="width: 7.5rem" defaultValue="en" dropdownclass="ran-chrome-menu" aria-label="Language">
      <r-option value="en">English</r-option>
      <r-option value="zh">简体中文</r-option>
      <r-option value="pt">Português</r-option>
    </r-select>
    <r-theme-switch></r-theme-switch>
    <r-surface-switch></r-surface-switch>
  </r-menubar>
</ran-demo>

```html
<r-menubar>
  <r-select dropdownclass="ran-chrome-menu" defaultValue="en" aria-label="Language">
    <r-option value="en">English</r-option>
    <r-option value="zh">简体中文</r-option>
    <r-option value="pt">Português</r-option>
  </r-select>
  <r-theme-switch></r-theme-switch>
  <r-surface-switch></r-surface-switch>
</r-menubar>
```

```js
import 'ranui/menubar';
import 'ranui/select';
import 'ranui/theme-switch';
import 'ranui/surface-switch';
```

Mark portaled panels with `dropdownclass="ran-chrome-menu"` (theme/surface switches already
do). That class is what the handoff measures and morphs.

### Imperative host (no custom element)

Hosts that already own the markup can call the same wiring:

```js
import { mountMenubarHandoff } from 'ranui/menubar';

const stop = mountMenubarHandoff({ root: document.querySelector('.chrome') });
// later: stop()
```

## API Reference

### Attributes

| Attribute        | Default                      | Description                                     |
| ---------------- | ---------------------------- | ----------------------------------------------- |
| `panel-selector` | `r-dropdown.ran-chrome-menu` | Portaled panels the hop morphs between.         |
| `leave-delay`    | `180`                        | ms before close after leaving the bar + panels. |
| `duration`       | `280`                        | FLIP morph duration in ms.                      |
| `sheet`          | `''`                         | CSS injected into the component's shadow DOM.   |

### CSS Parts

| Part   | Description                        |
| ------ | ---------------------------------- |
| `root` | Inner shell (`display: contents`). |

```css
r-menubar {
  --ran-menubar-gap: 8px;
}
```

## Notes

- Triggers are light-DOM descendants tagged `r-select`, `r-theme-switch`,
  `r-surface-switch`, or `[data-ran-menubar-item]` that expose `open`.
- Nested wrappers (e.g. an `.appearance` group) are fine — the bar finds the hosts.
- Reduced motion skips the morph; panels still open and close.
