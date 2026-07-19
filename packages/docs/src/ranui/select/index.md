---
description: "The ranui Select (<r-select>) is a dropdown for choosing a value from options, with optional search and native form participation."
---

# Select

Dropdown selector for choosing a single value from a list of options, with optional search and form participation.

> **Use when** you need a single-value dropdown selector built from `<r-option>` children, with optional search and native form participation — `<r-select>` handles opening, filtering, and `FormData` reporting.

## Quick Start

### Basic Usage

Options are supplied as slotted `<r-option>` children. Each option's `value` attribute is its value and its text content is the displayed label.

<Demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## API Reference

### Properties

| Property              | Type      | Default    | Description                                                                             |
| --------------------- | --------- | ---------- | --------------------------------------------------------------------------------------- |
| `value`               | `string`  | `''`       | Selected value. Setting it updates the closed-state label; ignored while `disabled`     |
| `defaultValue`        | `string`  | `''`       | Initial selected value, matched against option `value`                                  |
| `disabled`            | `boolean` | `false`    | Whether the select is disabled                                                          |
| `type`                | `string`  | `''`       | `text` renders a borderless, transparent trigger with no arrow icon; otherwise bordered |
| `placement`           | `string`  | `'bottom'` | Dropdown direction: `top`, `bottom`                                                     |
| `showSearch`          | `boolean` | `false`    | Show an inline search box that filters options by label                                 |
| `getPopupContainerId` | `string`  | `''`       | Element `id` to mount the dropdown into (defaults to `document.body`)                   |
| `dropdownclass`       | `string`  | `''`       | Custom class applied to the dropdown panel                                              |
| `trigger`             | `string`  | `'click'`  | How the dropdown opens: `click`, `hover`, or `click,hover` (hover is ignored on mobile) |
| `sheet`               | `string`  | `''`       | CSS injected into the shadow DOM                                                        |

> **Note:** `defaultValue` and `showSearch` are reactive — changing them after the element has connected is re-processed (alongside `value`, `disabled`, and `sheet`) in `attributeChangedCallback`. Updating `defaultValue` re-applies the matching selection; toggling `showSearch` wires or unwires the inline search box.

### Option Properties

Provide options via `<r-option>` child elements.

| Property   | Type      | Default | Description                                                                                   |
| ---------- | --------- | ------- | --------------------------------------------------------------------------------------------- |
| `value`    | `string`  | `''`    | Option value; emitted as the select's value when chosen                                       |
| `disabled` | `boolean` | `false` | Marks the option as non-selectable; the select skips it for both click and keyboard selection |
| `sheet`    | `string`  | `''`    | CSS injected into the option's shadow DOM                                                     |

Duplicate option labels or values log a `console.warn`.

### Default Value `defaultValue`

<Demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Disabled State `disabled`

<Demo>
  <r-select style="width: 120px; height: 40px" disabled defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Text Type `type`

<Demo>
  <r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Dropdown Direction `placement`

<Demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Search Function `showSearch`

<Demo>
  <r-select style="width: 120px; height: 40px" showSearch="true">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" showSearch="true">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Trigger Method `trigger`

<Demo>
  <r-select style="width: 120px; height: 40px" trigger="click,hover">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<!-- Click trigger (default) -->
<r-select trigger="click">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- Hover trigger (ignored on mobile) -->
<r-select trigger="hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- Both click and hover -->
<r-select trigger="click,hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Container Mount `getPopupContainerId`

The dropdown is portaled to `document.body` by default. Pass the `id` of another element to mount it there instead.

```html
<r-select getPopupContainerId="my-container">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Custom Dropdown Class `dropdownclass`

```html
<r-select dropdownclass="custom-dropdown">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## Events

### `change`

Fired when an option is selected. `event.detail` is `{ value, label }`, where `value` is the chosen option's value and `label` is its displayed text. Selecting the initial `defaultValue` does not fire `change`.

```html
<r-select id="picker">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('picker').addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.label); // e.g. "186" "Tom"
  });
</script>
```

### `search`

Fired only when `showSearch` is enabled, as the user types in the search box (throttled). `event.detail` is `{ value }`, the current search text. The component also filters the visible options by label internally.

```html
<r-select showSearch="true" id="searchable">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('searchable').addEventListener('search', (e) => {
    console.log(e.detail.value);
  });
</script>
```

## Form Association

`r-select` is a form-associated custom element (`static formAssociated = true`). It relays its selected `value` through `ElementInternals`, so it is collected by `new FormData(form)` and by `<r-form>` under the select's `name`. The form value is seeded from any initial selection on connect and kept in sync as the value changes.

## Slots

| Slot      | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| (default) | Accepts `<r-option>` elements that define the selectable options |

## CSS Parts

| Part             | Description                                         |
| ---------------- | --------------------------------------------------- |
| `select`         | Root wrapper of the select                          |
| `selection`      | The trigger box (border, background, layout)        |
| `icon`           | Dropdown arrow icon                                 |
| `selection-item` | Element showing the selected option's label         |
| `search`         | The inline search input (visible with `showSearch`) |

## Best Practices

- **Many options**: Enable `showSearch` so users can filter by label.
- **Trigger method**: Match `trigger` to user expectations; `hover` is ignored on mobile, so keep `click` available.
- **Mount position**: In scroll or overflow-clipped layouts, use `getPopupContainerId` to control where the dropdown mounts.
- **Custom styling**: Use `dropdownclass` or the exposed `::part()` names to restyle the trigger and dropdown.
- **Forms**: Give the select a `name` so its value is captured by `FormData` / `<r-form>`.
