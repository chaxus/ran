---
description: 'The ranui FanGallery (<r-fan-gallery>) fans its children out like a hand of cards, opening with a spring the first time it scrolls into view and lifting the child under the pointer or focus.'
---

# FanGallery

Fans its children out like a hand of cards. Each child turns about a point below the row, so
the group reads as one object rather than a strip.

> **Use when** a handful of covers, screenshots or cards should read as one set, and showing the
> whole of each one matters less than showing that there are several. For content a reader must
> compare side by side, use a grid instead.

## Quick Start

### Basic Usage

<ran-demo>
  <r-fan-gallery>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8d5b7;color:#333">1</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#b7d0e8;color:#333">2</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#c8e8b7;color:#333">3</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8b7c8;color:#333">4</button>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery>
  <a href="/one">1</a>
  <a href="/two">2</a>
  <a href="/three">3</a>
  <a href="/four">4</a>
</r-fan-gallery>
```

The children are your own elements. Links, buttons and images keep their roles, their names
and their place in the tab order; the gallery only moves them.

### Spread

`spread` is the angle in degrees between the first and last child. `0` lines them up on top of
one another.

<ran-demo>
  <r-fan-gallery spread="48">
    <div style="width:96px;height:128px;border-radius:12px;background:#d2b7e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#b7d0e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#c8e8b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8d5b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8b7c8"></div>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery spread="48">…</r-fan-gallery>
```

## Motion

- **Opening.** Until the gallery first scrolls into view its children lie stacked, so the front
  one is readable from the start. When it arrives the fan opens with a spring, one child after
  another. It opens once per page; scrolling away and back does not replay it.
- **Pointer and focus.** The child under the pointer, or holding focus, lifts and comes to the
  front, and its neighbours turn a little aside. The response is immediate and a new gesture
  takes over from wherever the last one had got to.
- **Reduced motion.** With `prefers-reduced-motion: reduce` the fan is open from the start and
  every change is applied without a transition.

## API Reference

### Properties

| Property | Attribute | Type     | Default | Description                                                  |
| -------- | --------- | -------- | ------- | ------------------------------------------------------------ |
| `spread` | `spread`  | `string` | `'24'`  | Angle in degrees between the first and last child once open. |
| `sheet`  | `sheet`   | `string` | `''`    | CSS injected into the shadow root.                           |

### Parts

| Part    | Element                               |
| ------- | ------------------------------------- |
| `stage` | The grid every child is stacked into. |

### Styling

| Token                       | Default          | What it does                                                     |
| --------------------------- | ---------------- | ---------------------------------------------------------------- |
| `--ran-fan-gallery-padding` | `--ran-space-10` | Room around the stage that the turned corners swing into.        |
| `--ran-fan-gallery-pivot`   | `320px`          | How far below the row the children turn. Shorter fans out wider. |
| `--ran-fan-gallery-lift`    | `--ran-space-4`  | How far the child under the pointer or focus moves out.          |

The gallery is as tall as its tallest child. Turned corners overflow the stage, so leave room
around it or raise `--ran-fan-gallery-padding`.
