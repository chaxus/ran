# Dropdown

A low-level floating-panel primitive: a rounded, elevated surface with an optional
directional arrow. It carries the overlay z-index and is the building block that
`r-popover` and `r-select` position and portal to `<body>`. Use it directly when you
need a custom floating panel.

## Code demo

<div style="position: relative; width: 180px; height: 72px;">
  <r-dropdown arrow="top" style="position: absolute; width: 180px;">
    <div style="padding: 12px;">Floating panel content</div>
  </r-dropdown>
</div>

```xml
<r-dropdown arrow="top">
  <div style="padding: 12px;">Floating panel content</div>
</r-dropdown>
```

## Attributes

### `arrow`

Renders a pointing arrow on one side of the panel. One of `top` · `bottom` · `left` · `right`. Omit the attribute for no arrow.

| Value    | Arrow points from |
| -------- | ----------------- |
| `top`    | top edge          |
| `bottom` | bottom edge       |
| `left`   | left edge         |
| `right`  | right edge        |

### `transit`

A CSS class name applied to the panel briefly (~300ms) to play an entrance/exit
animation, then removed automatically. The component ships these animation classes:
`ran-dropdown-down-in` / `-down-out` / `-up-in` / `-up-out` / `-left-in` / `-left-out` /
`-right-in` / `-right-out`.

### `sheet`

CSS injected into the panel's shadow DOM — the same `sheet` convention used by every
other ranui component.

## Styling

- **`::part(dropdown)`** — the panel surface, for outside-shadow styling.
- **CSS variables** — every visual property is overridable via `--ran-dropdown-*` tokens,
  for example `--ran-dropdown-background`, `--ran-dropdown-border-radius`,
  `--ran-dropdown-box-shadow`, `--ran-dropdown-padding`, `--ran-dropdown-arrow-width`,
  `--ran-dropdown-host-z-index`.

```css
r-dropdown {
  --ran-dropdown-background: var(--surface-2);
  --ran-dropdown-border-radius: 8px;
}
r-dropdown::part(dropdown) {
  border: 1px solid var(--line);
}
```

## Notes

The panel defaults to `width` / `height: 100%` of the host, and the host carries
`--ran-z-dropdown` (`1100`) so it stacks above dialogs. Consumers size and position the
host, then portal it. `r-popover` and `r-select` are both built on top of this element.

Import it via `import 'ranui'` (registers every component) or the standalone
`import 'ranui/dropdown'`.
