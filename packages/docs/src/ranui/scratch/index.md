# Scratch

Experimental scratch-ticket surface that renders a full-size `<canvas>` cover over a reveal layer inside its shadow DOM. Dragging across the canvas erases the covering with `destination-out` compositing along the actual path your pointer traces, and scratching away enough area reveals what sits underneath. The host is `display: block`, so give it an explicit width and height.

> **Use when** you need an experimental scratch-ticket surface where dragging erases a cover canvas to reveal arbitrary content beneath — works with mouse, touch, and pen alike via the Pointer Events API.

> ⚠️ **Experimental**: This component is a work in progress — treat it as a fun interaction, not a hardened production widget.

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
| `disabled` | `boolean` | `false` | Disables scratch interaction (`pointer-events: none` on the cover canvas, plus a guard in the pointer handlers). |
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

The component does **not** dispatch any custom events — there is nothing to bind an event listener to. Instead, scratching is driven entirely by internal [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) listeners registered on the canvas, so mouse, touch, and pen all share the same code path:

- `pointerdown` — arms scratching and erases a small dab right where the pointer landed (so even a tap without a drag reveals something).
- `pointermove` — while armed, strokes a **connected line** (not isolated dabs) from the previous point to the current one with `globalCompositeOperation = 'destination-out'`, so a fast drag reveals a continuous trail instead of a dotted one — and accumulates the scratched area as it goes.
- `pointerup` / `pointercancel` — disarms scratching; once the accumulated area exceeds **35% of the canvas pixel area**, the whole cover is cleared with `clearRect`, fully revealing the layer beneath (a deliberately generous "scratch a bit, then it finishes itself" threshold — a common scratch-card UX rather than requiring the entire cover to be manually cleared).

Pointer coordinates are mapped through the canvas's actual drawing-buffer resolution (see below), so scratching tracks correctly under your finger/cursor regardless of the element's CSS size or the screen's device pixel ratio. All handlers no-op while `disabled` is set, and `touch-action: none` on the canvas keeps a touch drag from also scrolling the page.

### Canvas resolution

The canvas's internal resolution is synced to its actual rendered CSS size × `devicePixelRatio` (on connect, and again on window `resize`) — not left at the browser's fixed 300×150 default. This keeps the cover crisp on HiDPI screens and keeps pointer-to-canvas coordinate mapping accurate at any element size; a resize resets any in-progress scratch (the buffer necessarily clears when its dimensions change).

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
- **Works with mouse, touch, and pen**: Pointer Events unify all three, so it responds the same way on desktop and mobile.
- **Treat as experimental**: still a work in progress — do not rely on it for production behavior.
