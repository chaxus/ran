# Radar

Radar chart for comparing several metrics of one dataset on a two-dimensional canvas.

## Quick Start

### Basic Usage

Data is supplied through the `abilitys` attribute as a **JSON string** (an array of objects). Because HTML attributes can only hold strings, the value must be valid JSON; it is parsed internally with `JSON.parse`. The `<r-radar>` host has no intrinsic size, so give it an explicit width/height.

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'
></r-radar>
```

You can also set the data imperatively via the `abilitys` JS property, which accepts an array (it is stringified back onto the attribute) or a JSON string:

```js
const radar = document.querySelector('r-radar');
radar.abilitys = [
  { abilityName: 'HP', scoreRate: 10 },
  { abilityName: 'Attack', scoreRate: 90 },
  { abilityName: 'DEF', scoreRate: 20 },
];
```

## API Reference

### Properties

| Property       | Type               | Default                                      | Description                                                   |
| -------------- | ------------------ | -------------------------------------------- | ------------------------------------------------------------- |
| `abilitys`     | `string` / `Array` | `''`                                         | Chart data as a JSON string (or an array via the JS property) |
| `colorPolygon` | `string`           | `var(--ran-radar-polygon-color)` / `#e6e6e6` | Color of the concentric grid polygons                         |
| `colorLine`    | `string`           | `var(--ran-radar-line-color)` / `#e6e6e6`    | Color of the axis lines and outer edge                        |
| `fillColor`    | `string`           | `rgba(255,121,35,0.60)`                      | Fill color of the data region                                 |
| `strokeColor`  | `string`           | `rgba(255,121,35,0.60)`                      | Stroke color of the data region outline and vertex dots       |
| `sheet`        | `string`           | `''`                                         | CSS injected into the component's shadow DOM                  |

Each entry of the `abilitys` array accepts the following keys:

| Key               | Type     | Required | Description                                                     |
| ----------------- | -------- | -------- | --------------------------------------------------------------- |
| `abilityName`     | `string` | Yes      | Axis label text                                                 |
| `scoreRate`       | `number` | Yes      | Value on that axis; the grid maxes out at `100`                 |
| `backgroundColor` | `string` | No       | Background color of the label pill (default transparent)        |
| `fontSize`        | `number` | No       | Font size of the label (defaults to a size scaled to the chart) |
| `fontColor`       | `string` | No       | Label text color (defaults to `--ran-color-text`)               |
| `fontFamily`      | `string` | No       | Label font family (default `黑体`)                              |

> Note: `colorPolygon`, `colorLine`, `fillColor`, and `strokeColor` are read case-insensitively, so they render correctly whether the attribute is present up front or changed after mount — updating any of them re-renders the chart. For theme-aware styling, prefer the CSS variables below.

### Chart Data `abilitys`

Per-axis label styling (`backgroundColor`, `fontSize`, `fontColor`) can be set on individual entries:

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"HP","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"HP","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'
></r-radar>
```

### Grid Polygon Color `colorPolygon`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" colorPolygon="green" abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorPolygon="green"
  abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'
></r-radar>
```

### Axis Line Color `colorLine`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" colorLine="blue" abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorLine="blue"
  abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'
></r-radar>
```

### Region Fill Color `fillColor`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" fillColor="red" abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  fillColor="red"
  abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'
></r-radar>
```

### Region Stroke Color `strokeColor`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" strokeColor="blue" abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  strokeColor="blue"
  abilitys='[{"abilityName":"HP","scoreRate":"10"},{"abilityName":"Attack","scoreRate":"90"},{"abilityName":"DEF","scoreRate":"20"},{"abilityName":"Element mastery","scoreRate":"50"},{"abilityName":"Critical Hit Chance","scoreRate":"80"},{"abilityName":"Critical hit damage","scoreRate":"50"}]'
></r-radar>
```

### CSS Variables

The chart colors can also be set (theme-reactively) through CSS custom properties on the host:

| Variable                    | Default                               | Description                        |
| --------------------------- | ------------------------------------- | ---------------------------------- |
| `--ran-radar-polygon-color` | `var(--ran-color-border)` / `#e6e6e6` | Grid polygon color                 |
| `--ran-radar-line-color`    | `var(--ran-color-border)` / `#e6e6e6` | Axis line color                    |
| `--ran-radar-fill-color`    | `rgba(255,121,35,0.60)`               | Data region fill color             |
| `--ran-radar-stroke-color`  | `rgba(255,121,35,0.60)`               | Data region stroke color           |
| `--ran-radar-width`         | `100%`                                | Canvas container width             |
| `--ran-radar-height`        | `100%`                                | Canvas container height            |
| `--ran-radar-display`       | `block`                               | `display` of the canvas container  |
| `--ran-radar-position`      | `relative`                            | `position` of the canvas container |

The label text color also falls back to the `--ran-color-text` theme token, so labels stay legible in light and dark mode.

## Events

None. `<r-radar>` does not dispatch any custom events.

## Best Practices

- **Sizing**: The host has no intrinsic size — always set an explicit `width`/`height` (via `style` or the `--ran-radar-width`/`--ran-radar-height` variables). The chart auto-redraws on container resize via a `ResizeObserver`.
- **Data format**: Pass valid JSON in `abilitys`; malformed JSON is logged and cannot be parsed. Use the `abilitys` JS property when working with real arrays in script.
- **Scale**: `scoreRate` is measured against a fixed maximum of `100`; normalize your values to that range.
- **Theming**: The color attributes (`colorPolygon`, `colorLine`, `fillColor`, `strokeColor`) are reactive and re-render the chart when changed after mount. Prefer the `--ran-radar-*` CSS variables when you want colors to follow the light/dark theme automatically.
