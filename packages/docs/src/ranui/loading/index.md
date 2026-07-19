---
description: "The ranui Loading (<r-loading>) shows a spinning indicator while content or an action is in progress."
---

<script setup>
import Loading from '../../../vue/loading.vue'
</script>

# Loading

Loading component providing a collection of animated indicators to signal in-progress work.

> **Use when** you need an animated spinner or loading indicator to signal in-progress work — `<r-loading>` offers ~30 built-in animation styles selected by `name` and themed through CSS variables.

## Quick Start

### Basic Usage

<Demo>
  <r-loading name="circle"></r-loading>
</Demo>

```html
<r-loading name="circle"></r-loading>
```

## API Reference

### Properties

| Property | Type     | Default    | Description                                                            |
| -------- | -------- | ---------- | ---------------------------------------------------------------------- |
| `name`   | `string` | `'circle'` | Animation type. Falls back to `circle` when unset or unrecognized      |
| `sheet`  | `string` | `''`       | CSS text injected into the component's shadow DOM for external styling |

### Loading Types `name`

Set `name` to one of the built-in animation types. Any unknown value renders nothing (only names in the list below are handled).

<Demo>
  <r-loading name="double-bounce"></r-loading>
  <r-loading name="rotate"></r-loading>
  <r-loading name="stretch"></r-loading>
  <r-loading name="cube"></r-loading>
</Demo>

```html
<r-loading name="double-bounce"></r-loading>
<r-loading name="rotate"></r-loading>
<r-loading name="stretch"></r-loading>
<r-loading name="cube"></r-loading>
```

Available values:

`double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`

### External Styles `sheet`

The `sheet` attribute injects raw CSS into the component's shadow root, letting you override internal rules from outside without a build step.

```html
<r-loading name="circle" sheet=".circle { transform: scale(1.5); }"></r-loading>
```

## Custom Styling

Each animation is themed entirely through CSS variables. Set them on the `r-loading` element (or an ancestor) to control size and color. Using `px` units gives more precise control than the default `em`-based sizing.

### Size Customization

```css
/* Circle type */
r-loading {
  --loading-circle-width: 32px;
  --loading-circle-height: 32px;
}

/* Double-bounce type */
r-loading {
  --loading-double-bounce-width: 40px;
  --loading-double-bounce-height: 40px;
}

/* Rotate type */
r-loading {
  --loading-rotate-width: 48px;
  --loading-rotate-height: 48px;
}

/* Stretch type */
r-loading {
  --loading-stretch-width: 60px;
  --loading-stretch-height: 72px;
}
```

### Color Customization

```css
/* Circle type */
r-loading {
  --loading-circle-container-div-background: #1890ff;
}

/* Double-bounce type */
r-loading {
  --loading-double-bounce1-background: #52c41a;
  --loading-double-bounce2-background: #52c41a;
}

/* Rotate type */
r-loading {
  --loading-rotate-background: #faad14;
}

/* Stretch type */
r-loading {
  --loading-stretch-div-background-color: #f5222d;
}
```

### Live Examples

<Demo>
  <r-loading name="circle" style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"></r-loading>
  <r-loading name="rotate" style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"></r-loading>
</Demo>

```html
<r-loading
  name="circle"
  style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"
></r-loading>
<r-loading
  name="rotate"
  style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"
></r-loading>
```

### Common CSS Variables

Each animation type has its own token namespace. The most common ones follow the pattern below:

| Variable                                | Default   | Description                                      |
| --------------------------------------- | --------- | ------------------------------------------------ |
| `--loading-{type}-width`                | `4em`     | Animation width (recommended to use `px` units)  |
| `--loading-{type}-height`               | `4em`     | Animation height (recommended to use `px` units) |
| `--loading-{type}-background`           | `#4096ff` | Main background color                            |
| `--loading-{type}-div-background-color` | `#4096ff` | Sub-element background color                     |

> Replace `{type}` with a specific animation name, e.g. `circle`, `double-bounce`, `rotate`. Base colors default through the theme tokens `--ran-color-primary`, `--ran-color-success`, and `--ran-color-text`.

## CSS Parts

Every animation exposes its root element as a `::part()` named after its `name` value, so you can target it from outside the shadow DOM:

```css
r-loading::part(rotate) {
  filter: drop-shadow(0 0 4px currentColor);
}
```

Part names: `double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`. The `solar` animation additionally exposes a `sun` part.

## Slots

None. The component renders its animation entirely from the shadow DOM and does not project light-DOM children.

## Events

None. The component dispatches no custom events.

## All Loading Animations

<Loading />

## Best Practices

- **Scene Selection**: Pick an animation that fits the context and pace of the task.
- **CSS Variables**: Customize size and color via the `--loading-{type}-*` tokens rather than wrapping elements.
- **Sizing**: Prefer `px` units over the default `em` sizing for predictable dimensions.
- **Performance**: Avoid rendering many simultaneous animations on one screen.
- **Theming**: The base colors follow `--ran-color-*` theme tokens, so animations adapt to light and dark modes automatically.
