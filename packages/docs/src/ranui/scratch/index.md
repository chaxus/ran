# Scratch

An experimental scratch-ticket surface. It renders a full-size `<canvas>` scratch layer over an award layer inside its shadow DOM; touch-dragging across the canvas erases the covering with `destination-out` compositing, and clearing enough area reveals what is underneath. The host fills its own box (`display: block`), so give it an explicit width and height.

## Code demo

<r-scratch icon="gift" style="display: block; width: 240px; height: 120px;"></r-scratch>

```xml
<r-scratch icon="gift" style="width: 240px; height: 120px;"></r-scratch>
```

## Attributes

The component's `observedAttributes` are `disabled`, `icon`, `effect`, `iconSize`, and `sheet`. Any change to one of these triggers a redraw of the scratch layer.

### `disabled`

Observed attribute reserved for disabling interaction.

```xml
<r-scratch disabled style="width: 240px; height: 120px;"></r-scratch>
```

### `icon`

Observed attribute for the reveal icon shown beneath the scratch layer.

```xml
<r-scratch icon="gift" style="width: 240px; height: 120px;"></r-scratch>
```

### `effect`

Observed attribute for the scratch effect variant.

```xml
<r-scratch effect="spark" style="width: 240px; height: 120px;"></r-scratch>
```

### `iconSize`

Observed attribute for the reveal icon size.

```xml
<r-scratch icon="gift" iconSize="48" style="width: 240px; height: 120px;"></r-scratch>
```

### `sheet`

CSS injected into the component's shadow DOM — the same `sheet` convention used by every other ranui component.

```xml
<r-scratch sheet=".ran-scratch-ticket-award { background: #1f2937; }" style="width: 240px; height: 120px;"></r-scratch>
```

## Styling

This component exposes no `::part()` and no component-scoped `--ran-scratch-*` CSS variables. The internal layers use fixed shadow-DOM classes (`.ran-scratch-ticket`, `.ran-scratch-ticket-award`, `.ran-scratch-ticket-canvas`) that you can target through the `sheet` attribute. Size the host with plain `width` / `height`.

```xml
<r-scratch
  style="width: 240px; height: 120px;"
  sheet=".ran-scratch-ticket-award { background: linear-gradient(135deg, #f59e0b, #ef4444); }"
></r-scratch>
```
