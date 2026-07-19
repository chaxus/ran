---
description: "The ranui Progress (<r-progress>) shows task completion as a bar, with an optional draggable handle."
---

# Progress

Progress bar for showing task completion, with an optional draggable handle.

> **Use when** you need a progress bar to show task completion — use `<r-progress>` static for read-only progress, or `type="drag"` when the user should set the value via a draggable handle.

## Quick Start

<Demo>
  <r-progress percent="40%"></r-progress>
</Demo>

```html
<r-progress percent="40%"></r-progress>
```

> 💡 **Tip**: `r-progress` is a block-level element with no intrinsic width. Inside a flex row it can collapse to zero width — give it an explicit width (e.g. `style="width:100%"`) or place it in a block context.

## API Reference

### Properties

| Property  | Type     | Default     | Description                                                            |
| --------- | -------- | ----------- | ---------------------------------------------------------------------- |
| `percent` | `string` | `'0'`       | Current progress; accepts a number or a percentage. Capped at `total`. |
| `total`   | `string` | `'100'`     | Total progress; accepts a number or a percentage.                      |
| `type`    | `string` | `'primary'` | Bar type: `primary` (static) or `drag` (clickable / draggable).        |
| `dot`     | `string` | `'true'`    | Whether to show the drag handle: `true` or `false`.                    |
| `sheet`   | `string` | `''`        | CSS injected into the component's shadow DOM.                          |

### Progress Value `percent`

Sets the current progress. Accepts a number or a percentage string, and cannot exceed `total`. When `total` is not set it defaults to `100` (i.e. `percent` is read as a percentage of 100).

<Demo column>
  <r-progress percent="30%"></r-progress>
  <r-progress percent="70%"></r-progress>
  <r-progress percent="100%"></r-progress>
</Demo>

```html
<r-progress percent="30%"></r-progress>
<r-progress percent="70%"></r-progress>
<r-progress percent="100%"></r-progress>
```

### Total Progress `total`

Sets the denominator for `percent`. Both numbers and percentages are allowed, so `percent="30" total="1000"` fills the bar 3%.

<Demo column>
  <r-progress percent="30" total="1000"></r-progress>
  <r-progress percent="70" total="100"></r-progress>
  <r-progress percent="10%" total="100%"></r-progress>
</Demo>

```html
<r-progress percent="30" total="1000"></r-progress>
<r-progress percent="70" total="100"></r-progress>
<r-progress percent="10%" total="100%"></r-progress>
```

### Bar Type `type`

- `primary`: a static progress bar. This is the default when `type` is not set.
- `drag`: a clickable and draggable progress bar. Clicking the track or dragging the handle updates `percent` and fires a `change` event. Dragging the handle requires `dot="true"`.

<Demo column>
  <r-progress type="drag" percent="30%"></r-progress>
  <r-progress type="primary" percent="40%"></r-progress>
</Demo>

```html
<r-progress type="drag" percent="30%"></r-progress> <r-progress type="primary" percent="40%"></r-progress>
```

### Drag Handle `dot`

Toggles the drag handle. The handle is only rendered when `dot="true"` **and** `type="drag"` — on a static `primary` bar it is intentionally omitted, so `dot` has no visible effect there.

<Demo column>
  <r-progress type="drag" percent="30%" dot="true"></r-progress>
  <r-progress type="drag" percent="30%" dot="false"></r-progress>
</Demo>

```html
<r-progress type="drag" percent="30%" dot="true"></r-progress>
<r-progress type="drag" percent="30%" dot="false"></r-progress>
```

## Events

### `change`

Dispatched on the `drag` type whenever the user clicks the track or drags the handle, updating `percent`. The `detail` object carries:

| Field     | Type     | Description      |
| --------- | -------- | ---------------- |
| `value`   | `string` | Current progress |
| `percent` | `string` | Current progress |
| `total`   | `string` | Total progress   |

```html
<r-progress type="drag" percent="30%"></r-progress>

<script>
  const progress = document.querySelector('r-progress');
  progress.addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.percent, e.detail.total);
  });
</script>
```

## CSS Parts

| Part    | Description                      |
| ------- | -------------------------------- |
| `track` | The progress track (background). |
| `fill`  | The filled portion of the track. |
| `dot`   | The drag handle.                 |

```css
r-progress::part(fill) {
  background: var(--ran-color-primary);
}
```

## Best Practices

- **Static bars**: use the default `type="primary"` to display read-only progress.
- **Interactive bars**: use `type="drag"` when the user should be able to set the value, and listen for the `change` event.
- **Percent vs. number**: mix `percent` and `total` freely — pass raw numbers when they map to a known total, or percentages for direct control.
- **Layout width**: wrap the bar in a block container or set an explicit width so it does not collapse in flex layouts.
