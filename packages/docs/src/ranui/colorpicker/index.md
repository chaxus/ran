# Color Picker

A compact color swatch that opens a popover panel with a saturation/lightness palette, a hue slider, an alpha slider, and a HEX/RGB value input. Its `value` accepts and emits standard CSS color strings.

> **Use when** you need to let users pick a color with a saturation/hue/alpha panel and HEX/RGB input — `<r-colorpicker>` accepts and emits standard CSS color strings and reports every format on `change`.

## Quick Start

### Basic Usage

<Demo align="start">
  <r-colorpicker value="#006bff"></r-colorpicker>
  <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
</Demo>

```html
<r-colorpicker value="#006bff"></r-colorpicker> <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
```

Click the swatch (or focus it and press Enter/Space) to open the panel. The hue and alpha sliders are keyboard-operable: arrow keys step by 1, Shift+arrow by 10, and Home/End jump to the ends.

## API Reference

### Properties

| Property   | Type      | Default | Description                                                                                            |
| ---------- | --------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `value`    | `string`  | `''`    | The current color as a CSS color string (HEX, `rgb(...)`, `rgba(...)`)                                 |
| `disabled` | `boolean` | `false` | When present, the swatch can't be opened, is removed from the tab order, and is marked `aria-disabled` |
| `sheet`    | `string`  | `''`    | CSS injected into the component's shadow DOM                                                           |

### Value `value`

The current color, as a CSS color string. Accepts HEX (`#1677FF`, `#fff`), `rgb(...)`, and `rgba(...)` on the way in. On the way out, the canonical value read back is a 6-digit HEX string when the color is fully opaque, or an `rgba(...)` string when alpha is below 1.

<Demo align="start">
  <r-colorpicker value="#00c853"></r-colorpicker>
  <r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
</Demo>

```html
<r-colorpicker value="#00c853"></r-colorpicker>
<r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
<r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
```

```js
const picker = document.querySelector('r-colorpicker');
picker.value = '#00c853';
console.log(picker.value); // reads back the current color
```

### Disabled `disabled`

Add the `disabled` attribute to make the picker inert: the swatch no longer opens the panel (via mouse or keyboard), it is taken out of the tab order, and the host is marked `aria-disabled="true"`. Removing the attribute restores normal interaction.

<Demo align="start">
  <r-colorpicker value="#006bff" disabled></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)" disabled></r-colorpicker>
</Demo>

```html
<r-colorpicker value="#006bff" disabled></r-colorpicker>
```

```js
const picker = document.querySelector('r-colorpicker');
picker.disabled = true; // block interaction
picker.disabled = false; // re-enable
```

### External Styles `sheet`

CSS injected into the component's shadow DOM — the same `sheet` convention used by every other ranui component.

```html
<r-colorpicker value="#006bff" sheet=".ran-colorpicker { border-radius: 6px; }"></r-colorpicker>
```

## Events

### `change`

Fires whenever the color changes — dragging the palette, moving a slider, editing the value input, or setting the `value` attribute. It **bubbles** and is **composed** (crosses shadow boundaries). `event.detail` carries the color in every format:

| Field   | Type     | Example                                   |
| ------- | -------- | ----------------------------------------- |
| `value` | `string` | `"#1677ff"` / `"rgba(22, 119, 255, 0.5)"` |
| `hex`   | `string` | `"#1677ff"`                               |
| `rgb`   | `string` | `"rgb(22, 119, 255)"`                     |
| `rgba`  | `string` | `"rgba(22, 119, 255, 0.5)"`               |
| `alpha` | `number` | `0.5`                                     |

```html
<r-colorpicker value="#1677ff"></r-colorpicker>

<script>
  const picker = document.querySelector('r-colorpicker');
  picker.addEventListener('change', (e) => {
    console.log(e.detail.hex, e.detail.alpha);
  });
</script>
```

## CSS Parts

The trigger swatch exposes two parts for styling from outside the shadow DOM:

| Part     | Description                                            |
| -------- | ------------------------------------------------------ |
| `block`  | The swatch container (checkerboard-backed trigger box) |
| `swatch` | The inner fill that shows the current color            |

```css
r-colorpicker::part(block) {
  box-shadow: 0 0 0 1px var(--line);
}
```

The popover panel is portaled into `document.body`, so its styles are namespaced (`.ran-color-picker-*`) and travel with the panel rather than living on the host.

### CSS Variables

The trigger swatch reads these tokens:

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
```

## Best Practices

- **Input formats**: Feed `value` any CSS color string — HEX, `rgb(...)`, or `rgba(...)`; the picker normalizes it internally.
- **Reading the result**: Listen for `change` and read `event.detail` for the exact format you need (`hex`, `rgb`, `rgba`, `alpha`).
- **Alpha**: Use `rgba(...)` input or the alpha slider when you need transparency; the read-back `value` becomes an `rgba(...)` string whenever alpha drops below 1.
- **Keyboard**: The swatch and both sliders are focusable and keyboard-operable — no mouse required.
- **Importing**: Load via `import 'ranui'` (registers every component) or the standalone `import 'ranui/colorpicker'`.
