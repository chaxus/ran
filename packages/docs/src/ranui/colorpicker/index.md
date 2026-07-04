# Color Picker

A compact color swatch that opens a popover panel with a saturation/lightness palette, a
hue slider, an alpha slider, and a HEX/RGB value input. Its `value` accepts and emits
standard CSS color strings.

## Code demo

<r-colorpicker value="#006bff"></r-colorpicker>
<r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>

```xml
<r-colorpicker value="#006bff"></r-colorpicker>
<r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
```

Click the swatch (or focus it and press Enter/Space) to open the panel. The hue and alpha
sliders are keyboard-operable: arrow keys step by 1, Shift+arrow by 10, and Home/End jump
to the ends.

## Attributes

### `value`

The current color, as a CSS color string. Accepts HEX (`#1677FF`, `#fff`), `rgb(...)`, and
`rgba(...)` on the way in. On the way out, the canonical value is a 6-digit HEX string when
the color is fully opaque, or an `rgba(...)` string when alpha is below 1.

```js
const picker = document.querySelector('r-colorpicker');
picker.value = '#00c853';
console.log(picker.value); // reads back the current color
```

### `sheet`

CSS injected into the component's shadow DOM — the same `sheet` convention used by every
other ranui component.

## Events

### `change`

Fires whenever the color changes — dragging the palette, moving a slider, editing the value
input, or setting the `value` attribute. It **bubbles** and is **composed** (crosses shadow
boundaries). `event.detail` carries the color in every format:

| Field   | Type     | Example                                   |
| ------- | -------- | ----------------------------------------- |
| `value` | `string` | `"#1677ff"` / `"rgba(22, 119, 255, 0.5)"` |
| `hex`   | `string` | `"#1677ff"`                               |
| `rgb`   | `string` | `"rgb(22, 119, 255)"`                     |
| `rgba`  | `string` | `"rgba(22, 119, 255, 0.5)"`               |
| `alpha` | `number` | `0.5`                                     |

```js
picker.addEventListener('change', (e) => {
  console.log(e.detail.hex, e.detail.alpha);
});
```

## Styling

- **`::part(block)`** — the swatch container (the checkerboard-backed trigger box).
- **`::part(swatch)`** — the inner fill that shows the current color.
- **CSS variables** — the trigger swatch reads these tokens:

| Variable                                | Purpose                   |
| --------------------------------------- | ------------------------- |
| `--ran-colorpicker-background`          | Swatch background         |
| `--ran-colorpicker-border`              | Swatch border             |
| `--ran-colorpicker-border-hover`        | Border color on hover     |
| `--ran-colorpicker-border-radius`       | Swatch corner radius      |
| `--ran-colorpicker-block-border-radius` | Inner block corner radius |
| `--ran-colorpicker-transition`          | Hover transition          |

```css
r-colorpicker {
  --ran-colorpicker-border-radius: 6px;
}
r-colorpicker::part(block) {
  box-shadow: 0 0 0 1px var(--line);
}
```

The popover panel is portaled into `document.body`, so its styles are namespaced
(`.ran-color-picker-*`) and travel with the panel rather than living on the host.

Import it via `import 'ranui'` (registers every component) or the standalone
`import 'ranui/colorpicker'`.
