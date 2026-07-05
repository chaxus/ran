# Scratch

Experimental scratch-ticket surface that renders a full-size `<canvas>` cover over an award layer inside its shadow DOM. Touch-dragging across the canvas erases the covering with `destination-out` compositing, and scratching away enough area reveals what sits underneath. The host is `display: block`, so give it an explicit width and height.

> ⚠️ **Experimental**: This component is a work in progress. Interaction is **touch-only** (it wires `touchstart` / `touchmove` / `touchend`, with no mouse or pointer fallback), so it does not respond on a desktop pointer. Its observed attributes are declared but not yet mapped to visual output — see the notes below.

## Quick Start

### Basic Usage

<Demo>
  <r-scratch icon="gift" style="display: block; width: 240px; height: 120px;"></r-scratch>
</Demo>

```html
<r-scratch style="display: block; width: 240px; height: 120px;"></r-scratch>
```

## API Reference

### Properties

The component's `observedAttributes` are the five below. There are **no property getters/setters** on the element — these exist purely as observed attributes. Changing any one of them triggers `attributeChangedCallback`, which re-appends the scratch container and redraws the scratch layer. The current implementation does **not** read the attribute values, so setting them has no visual effect yet.

| Property   | Type      | Default | Description                                                              |
| ---------- | --------- | ------- | ------------------------------------------------------------------------ |
| `disabled` | `boolean` | —       | Observed attribute reserved for disabling interaction (not yet applied)  |
| `icon`     | `string`  | —       | Observed attribute reserved for the reveal icon (not yet rendered)       |
| `effect`   | `string`  | —       | Observed attribute reserved for the scratch effect variant (not applied) |
| `iconSize` | `string`  | —       | Observed attribute reserved for the reveal icon size (not applied)       |
| `sheet`    | `string`  | —       | Observed attribute; a change triggers a redraw but no CSS is injected    |

### Disabled State `disabled`

Reserved for disabling interaction. Currently only triggers a redraw.

<Demo>
  <r-scratch disabled style="display: block; width: 240px; height: 120px;"></r-scratch>
</Demo>

```html
<r-scratch disabled style="display: block; width: 240px; height: 120px;"></r-scratch>
```

### Icon `icon`

Reserved for the reveal icon shown beneath the scratch layer.

<Demo>
  <r-scratch icon="gift" style="display: block; width: 240px; height: 120px;"></r-scratch>
</Demo>

```html
<r-scratch icon="gift" style="display: block; width: 240px; height: 120px;"></r-scratch>
```

### Effect `effect`

Reserved for the scratch effect variant.

<Demo>
  <r-scratch effect="spark" style="display: block; width: 240px; height: 120px;"></r-scratch>
</Demo>

```html
<r-scratch effect="spark" style="display: block; width: 240px; height: 120px;"></r-scratch>
```

### Icon Size `iconSize`

Reserved for the reveal icon size.

<Demo>
  <r-scratch icon="gift" iconSize="48" style="display: block; width: 240px; height: 120px;"></r-scratch>
</Demo>

```html
<r-scratch icon="gift" iconSize="48" style="display: block; width: 240px; height: 120px;"></r-scratch>
```

## Interaction

The component does **not** dispatch any custom events — there is nothing to bind an event listener to. Instead, scratching is driven entirely by internal touch listeners registered on the canvas:

- `touchstart` — arms scratching (sets an internal `touchStart` flag).
- `touchmove` — while armed, punches a circular hole into the cover with `globalCompositeOperation = 'destination-out'` and accumulates the scratched area.
- `touchend` — disarms scratching; once the accumulated area exceeds **3% of the canvas pixel area** (`width * height * 0.03`), the whole cover is cleared with `clearRect`, fully revealing the layer beneath.

## Styling

This component exposes **no `::part()` hooks and no `--ran-scratch-*` CSS variables**. Its shadow DOM is three fixed layers:

| Class                        | Role                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| `.ran-scratch-ticket`        | Full-size relative container (`width: 100%; height: 100%`)   |
| `.ran-scratch-ticket-award`  | The reveal layer, `z-index: 1`, hardcoded `background: #000` |
| `.ran-scratch-ticket-canvas` | The scratch cover canvas, `z-index: 2`                       |

Because the award background is a hardcoded `#000` (not a theme token), it does not adapt to light/dark mode. Size the host with plain `width` / `height`. Note: the `sheet` attribute is observed but is **not** wired to inject CSS in the current implementation.

## Best Practices

- **Always size the host**: it is `display: block` with no intrinsic size — give it an explicit `width` and `height`, or its `100%` inner layers collapse to zero.
- **Touch devices only**: scratching is wired to `TouchEvent`s, so it will not respond to a mouse. Test on a touchscreen or a device-emulated touch surface.
- **Treat as experimental**: the observed attributes and the `sheet` hook are declared but not yet functional; do not rely on them for production behavior.
