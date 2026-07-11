# Skeleton

Placeholder graphic that fills the space of content while it loads, using a shimmering animation.

> **Use when** you need a shimmering placeholder bar to hold a content's space while it loads — size `<r-skeleton>`'s parent to match the real content, then swap it out when data arrives.

## Quick Start

### Basic Usage

The skeleton stretches to fill the width of its parent element and is `16px` tall by default.

<Demo>
  <r-skeleton></r-skeleton>
</Demo>

```html
<r-skeleton></r-skeleton>
```

### Width Follows the Parent

Because the skeleton is `width: 100%`, control its length by sizing the container it lives in.

<Demo column>
  <div style="width: 100px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 200px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 100%">
    <r-skeleton></r-skeleton>
  </div>
</Demo>

```html
<div style="width: 100px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 200px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 100%">
  <r-skeleton></r-skeleton>
</div>
```

### Stacking Placeholders

Compose several skeletons to mimic a block of text or a paragraph.

<Demo column>
  <div style="width: 100%; display: flex; flex-direction: column; gap: 12px">
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
  </div>
</Demo>

```html
<div style="display: flex; flex-direction: column; gap: 12px">
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
</div>
```

## API Reference

### Properties

| Property | Type     | Default | Description                                                             |
| -------- | -------- | ------- | ----------------------------------------------------------------------- |
| `sheet`  | `string` | `''`    | CSS injected into the component's shadow DOM for scoped style overrides |

### Custom Styling `sheet`

Pass a CSS string through `sheet` to override the skeleton's look inside its shadow DOM.

<Demo>
  <r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
</Demo>

```html
<r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
```

### CSS Variables

The skeleton also exposes CSS custom properties for theming without `sheet`:

| Variable                            | Default                        | Description                   |
| ----------------------------------- | ------------------------------ | ----------------------------- |
| `--ran-skeleton-height`             | `16px`                         | Height of the placeholder bar |
| `--ran-skeleton-background`         | `var(--ran-gray-alpha-200, …)` | Base (non-shimmer) fill color |
| `--ran-skeleton-border-radius`      | `var(--ran-radius-sm, 6px)`    | Corner radius                 |
| `--ran-skeleton-shimmer`            | `linear-gradient(90deg, …)`    | The moving highlight gradient |
| `--ran-skeleton-animation-duration` | `1.4s`                         | Duration of one shimmer sweep |

<Demo>
  <r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
</Demo>

```html
<r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
```

## Events

None. The skeleton does not dispatch any custom events.

## Slots

None. The skeleton renders only its own placeholder bar and does not project slotted content.

## Best Practices

- **Match the layout**: Size the parent container so each skeleton matches the width of the real content it stands in for.
- **Mimic the shape**: Stack multiple skeletons with consistent gaps to represent multi-line text or list rows.
- **Theme via variables**: Prefer the `--ran-skeleton-*` CSS variables for simple tweaks; reach for `sheet` only when you need selectors the variables don't cover.
- **Swap on load**: Replace skeletons with real content once data arrives, rather than leaving them animating indefinitely.
