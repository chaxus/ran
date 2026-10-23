---
description: 'An experimental scratch-ticket surface where dragging a canvas cover reveals content beneath, via the Pointer Events API.'
---

# Scratch

Experimental scratch-ticket surface that renders a `<canvas>` cover over a reveal layer, with a separate quiet action row above the surface inside its shadow DOM. Dragging across the canvas erases the covering with `destination-out` compositing along the actual path your pointer traces, and scratching away enough area reveals what sits underneath. The host is `display: block`, so give it an explicit width and height. Its height includes the action row (32px minimum, 44px on coarse pointers) and an 8px gap; the remaining height belongs to the canvas and reward. The completion button never overlays reward content.

> **Use when** you need an experimental scratch-ticket surface where dragging erases a cover canvas to reveal arbitrary content beneath. Works with mouse, touch, and pen alike via the Pointer Events API.

> ⚠️ **Experimental**: This component is a work in progress. Treat it as a fun interaction, not a hardened production widget.

## Quick Start

### Basic Usage

Whatever you put inside `<r-scratch>` is the reveal content (an amount, an image, an `<r-icon>`, several elements), projected through the default slot into the layer beneath the cover, exactly like content projection in any other ranui component.

<ran-demo>
  <r-scratch style="display: block; width: 240px; height: 120px;">You won 50 coins!</r-scratch>
</ran-demo>

```html
<r-scratch style="display: block; width: 240px; height: 120px;">You won 50 coins!</r-scratch>
```

## API Reference

### Properties

| Property         | Type      | Default    | Description                                                                                  |
| ---------------- | --------- | ---------- | -------------------------------------------------------------------------------------------- |
| `disabled`       | `boolean` | `false`    | Disables pointer scratching and the native Reveal action while preserving existing progress. |
| `sheet`          | `string`  | `''`       | CSS injected into the component's shadow DOM.                                                |
| `reveal-label`   | `string`  | `Reveal`   | Localized reveal action text.                                                                |
| `revealed-label` | `string`  | `Revealed` | Localized completion button and status text.                                                 |

Keyboard users can focus the native Reveal button and press Enter or Space for a complete reveal. Localize it with `reveal-label` (default `Reveal`) and `revealed-label` (default `Revealed`). Until revealed, the default slot is inert so covered links cannot receive early Tab focus. Completion restores content interaction and announces status; the same button retains its current focus while leaving subsequent Tab order, so the next Tab can enter the revealed content. Disabling, cancelling a gesture and reconnecting at the same dimensions preserve erased pixels; an actual resize still resets the cover. If revealed content owns focus during that reset, focus returns to Reveal without scrolling; focus outside this component stays unchanged.

### Disabled State `disabled`

<ran-demo>
  <r-scratch disabled style="display: block; width: 240px; height: 120px;">You won 50 coins!</r-scratch>
</ran-demo>

```html
<r-scratch disabled style="display: block; width: 240px; height: 120px;">You won 50 coins!</r-scratch>
```

### External Styles `sheet`

<ran-demo>
  <r-scratch sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }" style="display: block; width: 240px; height: 120px;">🎁</r-scratch>
</ran-demo>

```html
<r-scratch
  sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }"
  style="display: block; width: 240px; height: 120px;"
>
  🎁
</r-scratch>
```

## Interaction

The component does **not** dispatch any custom events: there is nothing to bind an event listener to. Instead, scratching is driven entirely by internal [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) listeners registered on the canvas, so mouse, touch, and pen all share the same code path:

- `pointerdown`: arms scratching and erases a small dab right where the pointer landed (so even a tap without a drag reveals something).
- `pointermove`: while armed, strokes a **connected line** (not isolated dabs) from the previous point to the current one with `globalCompositeOperation = 'destination-out'`, so a fast drag reveals a continuous trail instead of a dotted one, and accumulates the scratched area as it goes.
- `pointerup`: disarms scratching; once the accumulated area exceeds **35% of the canvas pixel area**, the whole cover is cleared with `clearRect`, fully revealing the layer beneath (a deliberately generous "scratch a bit, then it finishes itself" threshold, a common scratch-card UX rather than requiring the entire cover to be manually cleared).

Pointer coordinates are mapped through the canvas's actual drawing-buffer resolution (see below), so scratching tracks correctly under your finger/cursor regardless of the element's CSS size or the screen's device pixel ratio. All handlers no-op while `disabled` is set, and `touch-action: none` on the canvas keeps a touch drag from also scrolling the page.

A few device-specific edge cases are handled explicitly rather than left to whatever "unifying" mouse/touch/pen happens to do by default:

- **Mouse**: only the primary (left) button starts a scratch; a right-click-drag or middle-click doesn't.
- **Multi-touch**: the first finger down controls the stroke; a second finger touching mid-scratch is ignored until the first one lifts, instead of both fingers writing to the same drawing state at once.
- **Interrupted gestures**: if the OS reclaims pointer capture mid-drag without ever firing `pointerup` (seen on some Android WebViews when a system back-swipe gesture interrupts a scratch), a `lostpointercapture` listener resets the internal state anyway; otherwise the component's internal state would stay armed, and the next unrelated pointer movement would silently keep drawing.

### Canvas resolution

The canvas's internal resolution is synced to its actual rendered CSS size × `devicePixelRatio` (on connect, and again on window `resize`), not left at the browser's fixed 300×150 default. This keeps the cover crisp on HiDPI screens and keeps pointer-to-canvas coordinate mapping accurate at any element size; a resize resets any in-progress scratch (the buffer necessarily clears when its dimensions change).

## Slots

| Slot      | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| (default) | The reveal content, projected into the layer beneath the scratch cover. |

## Styling

This component exposes **no `::part()` hooks**, but its two layer colors are theme-token-driven CSS variables. Its shadow DOM is three fixed layers:

| Class                        | Role                                                                                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.ran-scratch-ticket`        | Full-size relative container (`width: 100%; height: 100%`)                                                                                                 |
| `.ran-scratch-ticket-award`  | The reveal layer, `z-index: 1`, `background: var(--ran-scratch-award-background, var(--ran-color-bg-elevated, #fff))`; holds the default slot              |
| `.ran-scratch-ticket-canvas` | The scratch cover canvas, `z-index: 2`; filled with `--ran-scratch-cover-background` (default `var(--ran-color-text-secondary, #6b6b6b)`), set on the host |

Both colors route through theme tokens with a literal fallback, so they adapt to light/dark mode by default and can be overridden with `--ran-scratch-award-background` / `--ran-scratch-cover-background`. Size the host with plain `width` / `height`.

## Best Practices

- **Always size the host**: it is `display: block` with no intrinsic size; give it an explicit `width` and `height`, or its `100%` inner layers collapse to zero.
- **Any reveal content works**: text, an image, an `<r-icon>`, several elements. Slot in whatever the prize actually is; there's no fixed icon+size API to work around.
- **Works with mouse, touch, and pen**: Pointer Events unify all three, so it responds the same way on desktop and mobile.
- **Treat as experimental**: still a work in progress; do not rely on it for production behavior.
