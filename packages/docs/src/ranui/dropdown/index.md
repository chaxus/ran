# Dropdown

A low-level floating-panel primitive: a rounded, elevated surface with an optional directional arrow. It carries the overlay z-index and is the building block that `r-popover` and `r-select` position and portal to `<body>`.

> **Use when** you need a low-level floating panel to build overlays like popovers or select menus — `<r-dropdown>` carries the z-index and arrow so you don't hand-roll positioning.

## Quick Start

### Basic Usage

<Demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">Floating panel content</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">Floating panel content</div>
</r-dropdown>
```

## API Reference

### Properties

| Property  | Type     | Default | Description                                                             |
| --------- | -------- | ------- | ----------------------------------------------------------------------- |
| `arrow`   | `string` | `''`    | Arrow side: `top`, `bottom`, `left`, `right`. Omit for no arrow.        |
| `transit` | `string` | `''`    | CSS class applied to the panel for ~300ms to play an entrance animation |
| `sheet`   | `string` | `''`    | CSS injected into the component's shadow DOM                            |

### Arrow Direction `arrow`

Renders a pointing arrow on one side of the panel. Omit the attribute for no arrow.

<Demo column>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="top"</div>
  </r-dropdown>
  <r-dropdown arrow="bottom" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="bottom"</div>
  </r-dropdown>
  <r-dropdown arrow="left" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="left"</div>
  </r-dropdown>
  <r-dropdown arrow="right" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="right"</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">arrow="top"</div>
</r-dropdown>
<r-dropdown arrow="bottom">
  <div style="padding: 12px;">arrow="bottom"</div>
</r-dropdown>
<r-dropdown arrow="left">
  <div style="padding: 12px;">arrow="left"</div>
</r-dropdown>
<r-dropdown arrow="right">
  <div style="padding: 12px;">arrow="right"</div>
</r-dropdown>
```

### Entrance Animation `transit`

A CSS class name applied to the panel briefly (~300ms) to play an entrance/exit animation, then removed automatically. The component ships these animation classes: `ran-dropdown-down-in` / `-down-out` / `-up-in` / `-up-out` / `-left-in` / `-left-out` / `-right-in` / `-right-out`.

<Demo>
  <r-dropdown transit="ran-dropdown-down-in" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">Animates in on connect</div>
  </r-dropdown>
</Demo>

```html
<r-dropdown transit="ran-dropdown-down-in">
  <div style="padding: 12px;">Animates in on connect</div>
</r-dropdown>
```

### External Styles `sheet`

CSS injected into the panel's shadow DOM — the same `sheet` convention used by every other ranui component.

```html
<r-dropdown arrow="top" sheet=".ranui-dropdown { border: 1px solid #999; }">
  <div style="padding: 12px;">Custom-styled panel</div>
</r-dropdown>
```

## Events

`r-dropdown` is a passive surface and dispatches no custom events. It is positioned, shown, and hidden by the consumer (for example `r-popover` or `r-select`).

## Slots

| Slot      | Description                         |
| --------- | ----------------------------------- |
| (default) | The panel's content, rendered as-is |

## CSS Parts

| Part       | Description                                   |
| ---------- | --------------------------------------------- |
| `dropdown` | The panel surface, for outside-shadow styling |

```css
r-dropdown {
  --ran-dropdown-background: var(--ran-color-bg-muted);
  --ran-dropdown-border-radius: 8px;
}
r-dropdown::part(dropdown) {
  border: 1px solid var(--ran-color-border);
}
```

Every visual property is overridable via `--ran-dropdown-*` tokens, for example `--ran-dropdown-background`, `--ran-dropdown-border-radius`, `--ran-dropdown-box-shadow`, `--ran-dropdown-padding`, `--ran-dropdown-arrow-width`, and `--ran-dropdown-host-z-index`.

## Best Practices

- **Low-level primitive**: Use `r-dropdown` directly only when you need a custom floating panel; prefer `r-popover` or `r-select` for common cases.
- **Size the host**: The panel defaults to `width` / `height: 100%` of the host, so give the host an explicit size and position, then portal it.
- **Stacking**: The host carries `--ran-z-dropdown` (`1100`) so it stacks above dialogs; override with `--ran-dropdown-host-z-index` if needed.
- **Arrow, self-centered by default**: `r-dropdown` has no concept of a "trigger" — it only knows its own panel. With no positioning consumer wired up, `arrow="top"`/`"bottom"` centers on the panel's own width; that's the correct default for using `r-dropdown` bare (as in the demos above). `r-popover` sits on top of `r-dropdown` specifically to add trigger-awareness: it measures the real trigger element and feeds a pixel offset back in via `--ran-dropdown-arrow-anchor-offset`, nudging the arrow to point at the trigger's center even when the panel is wider and edge-aligned rather than centered on it — the same relationship as Radix UI's arrow-less `DropdownMenu` versus its Floating-UI-computed `Popover.Arrow`/`Tooltip.Arrow`. A consumer building its own trigger-aware panel on `r-dropdown` can set that variable directly instead of re-deriving `r-popover`'s positioning logic.
- **Import**: Load via `import 'ranui'` (registers every component) or the standalone `import 'ranui/dropdown'`.
