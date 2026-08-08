# Scratch

Experimental scratch-ticket surface that renders a full-size `<canvas>` cover over a reveal layer inside its shadow DOM. Touch-dragging across the canvas erases the covering with `destination-out` compositing, and scratching away enough area reveals what sits underneath. The host is `display: block`, so give it an explicit width and height.

> **Use when** you need an experimental, touch-only scratch-ticket surface where dragging erases a cover canvas to reveal arbitrary content beneath — `<r-scratch>` is a work-in-progress with touch-only interaction and no mouse fallback.

> ⚠️ **Experimental**: This component is a work in progress. Interaction is **touch-only** (it wires `touchstart` / `touchmove` / `touchend`, with no mouse or pointer fallback), so it does not respond to a desktop mouse.

## Quick Start

### Basic Usage

Whatever you put inside `<r-scratch>` is the reveal content — an amount, an image, an `<r-icon>`, several elements — projected through the default slot into the layer beneath the cover, exactly like content projection in any other ranui component.

<Demo>
  <r-scratch style="display: block; width: 240px; height: 120px;">You won 50 coins!</r-scratch>
</Demo>

```html
<r-scratch style="display: block; width: 240px; height: 120px;">You won 50 coins!</r-scratch>
```

## API Reference

### Properties

| Property   | Type      | Default | Description                                                            |
| ---------- | --------- | ------- | -------------------------------------------------------------------------- |
| `disabled` | `boolean` | `false` | Disables scratch interaction (`pointer-events: none` on the cover canvas, plus a guard in the touch handlers). |
| `sheet`    | `string`  | `''`    | CSS injected into the component's shadow DOM.                              |

### Disabled State `disabled`

<Demo>
  <r-scratch disabled style="display: block; width: 240px; height: 120px;">You won 50 coins!</r-scratch>
</Demo>

```html
<r-scratch disabled style="display: block; width: 240px; height: 120px;">You won 50 coins!</r-scratch>
```

### External Styles `sheet`

<Demo>
  <r-scratch sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }" style="display: block; width: 240px; height: 120px;">🎁</r-scratch>
</Demo>

```html
<r-scratch sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }" style="display: block; width: 240px; height: 120px;">
  🎁
</r-scratch>
```

## Interaction

The component does **not** dispatch any custom events — there is nothing to bind an event listener to. Instead, scratching is driven entirely by internal touch listeners registered on the canvas:

- `touchstart` — arms scratching (sets an internal `touchStart` flag).
- `touchmove` — while armed, punches a circular hole into the cover with `globalCompositeOperation = 'destination-out'` and accumulates the scratched area.
- `touchend` — disarms scratching; once the accumulated area exceeds **3% of the canvas pixel area** (`width * height * 0.03`), the whole cover is cleared with `clearRect`, fully revealing the layer beneath.

All three handlers no-op while `disabled` is set.

## Slots

| Slot      | Description                                                                        |
| --------- | --------------------------------------------------------------------------------- |
| (default) | The reveal content, projected into the layer beneath the scratch cover.           |

## Styling

This component exposes **no `::part()` hooks**, but its two layer colors are theme-token-driven CSS variables. Its shadow DOM is three fixed layers:

| Class                         | Role                                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `.ran-scratch-ticket`         | Full-size relative container (`width: 100%; height: 100%`)                                                             |
| `.ran-scratch-ticket-award`   | The reveal layer, `z-index: 1`, `background: var(--ran-scratch-award-background, var(--ran-color-bg-elevated, #fff))`; holds the default slot |
| `.ran-scratch-ticket-canvas`  | The scratch cover canvas, `z-index: 2`; filled with `--ran-scratch-cover-background` (default `var(--ran-color-text-secondary, #6b6b6b)`), set on the host |

Both colors route through theme tokens with a literal fallback, so they adapt to light/dark mode by default and can be overridden with `--ran-scratch-award-background` / `--ran-scratch-cover-background`. Size the host with plain `width` / `height`.

## Best Practices

- **Always size the host**: it is `display: block` with no intrinsic size — give it an explicit `width` and `height`, or its `100%` inner layers collapse to zero.
- **Any reveal content works**: text, an image, an `<r-icon>`, several elements — slot in whatever the prize actually is; there's no fixed icon+size API to work around.
- **Touch devices only**: scratching is wired to `TouchEvent`s, so it will not respond to a mouse. Test on a touchscreen or a device-emulated touch surface.
- **Treat as experimental**: still a work in progress — do not rely on it for production behavior.
