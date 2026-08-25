---
description: 'The ranui Select (<r-select>) is a dropdown for choosing a value from options, with optional search and native form participation.'
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

| Property              | Type      | Default    | Description                                                                                                                       |
| --------------------- | --------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `label`               | `string`  | `''`       | Static caption above the field — same pattern as `r-input`'s `label`, so a labeled select lines up with a labeled input in a form |
| `value`               | `string`  | `''`       | Selected value. Setting it updates the closed-state label; ignored while `disabled`                                               |
| `defaultValue`        | `string`  | `''`       | Initial selected value, matched against option `value`                                                                            |
| `disabled`            | `boolean` | `false`    | Whether the select is disabled                                                                                                    |
| `type`                | `string`  | `''`       | `text` renders a borderless, transparent trigger with no arrow icon; otherwise bordered                                           |
| `open`                | `boolean` | `false`    | Whether the dropdown is showing. This _is_ the state — set it to open or close the panel                                          |
| `placement`           | `string`  | `'bottom'` | Which side the dropdown opens on, with an optional alignment: `bottom`, `bottom-end`, `top-center`, …                             |
| `showSearch`          | `boolean` | `false`    | Show an inline search box that filters options by label                                                                           |
| `getPopupContainerId` | `string`  | `''`       | Element `id` to mount the dropdown into (defaults to `document.body`)                                                             |
| `dropdownclass`       | `string`  | `''`       | Custom class applied to the dropdown panel                                                                                        |
| `trigger`             | `string`  | `'click'`  | How the dropdown opens: `click`, `hover`, or `click,hover` (hover is ignored on mobile)                                           |
| `required`            | `boolean` | `false`    | Whether a selection is required for the form to submit                                                                            |
| `sheet`               | `string`  | `''`       | CSS injected into the shadow DOM                                                                                                  |

> **Note:** `defaultValue` and `showSearch` are reactive — changing them after the element has connected is re-processed (alongside `value`, `disabled`, and `sheet`) in `attributeChangedCallback`. Updating `defaultValue` re-applies the matching selection; toggling `showSearch` wires or unwires the inline search box.

### Option Properties

Provide options via `<r-option>` child elements.

| Property   | Type      | Default | Description                                                                                   |
| ---------- | --------- | ------- | --------------------------------------------------------------------------------------------- |
| `value`    | `string`  | `''`    | Option value; emitted as the select's value when chosen                                       |
| `disabled` | `boolean` | `false` | Marks the option as non-selectable; the select skips it for both click and keyboard selection |
| `sheet`    | `string`  | `''`    | CSS injected into the option's shadow DOM                                                     |

Duplicate option labels or values log a `console.warn`.

### Label `label`

A static caption rendered above the field — always visible, never overlaps adjacent
content. Uses the same tokens and layout as `r-input`'s `label`, so a labeled select and a
labeled input placed side by side in a form line up (same height, same top edge).

<Demo>
  <r-select label="Country" style="width: 180px" defaultValue="185">
    <r-option value="185">United States</r-option>
    <r-option value="186">Canada</r-option>
    <r-option value="187">Mexico</r-option>
  </r-select>
</Demo>

```html
<r-select label="Country" defaultValue="185">
  <r-option value="185">United States</r-option>
  <r-option value="186">Canada</r-option>
  <r-option value="187">Mexico</r-option>
</r-select>
```

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

`placement` is a preference, not a guarantee: when the trigger is near a viewport edge and the preferred side lacks room, the dropdown automatically flips to the other side and shifts horizontally to stay on-screen. This only applies to the default body-level mount — with `getPopupContainerId` set, choose a `placement` that fits the container.

A side can carry an alignment suffix — `bottom-end`, `top-center`, and so on, the same grammar `r-popover` takes. A bare side means `-start`, which lines the panel's leading edge up with the trigger's.

The suffix only changes anything when the panel is a different width from its trigger, since the panel tracks the trigger's width by default. Widen it (`r-dropdown::part(dropdown)`, reached through `dropdownclass`, because the panel is portalled to `<body>` rather than living in the select's shadow root) and the alignment is computed against what is actually painted:

```html
<style>
  r-dropdown.wide::part(dropdown) {
    min-width: 220px;
  }
</style>

<!-- panel's right edge on the trigger's right edge -->
<r-select placement="bottom-end" dropdownclass="wide" style="width: 80px">
  <r-option value="a">A long option label</r-option>
</r-select>
```

Note that the boundary shift outranks the alignment: a trigger close enough to a viewport edge gets its panel nudged back on-screen whatever alignment was asked for.

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

### Open State `open`

`open` is the dropdown's state, reflected as an attribute the way `<details open>` and `<dialog open>` are. Nothing infers the state from the panel's `display` — that trails the state by the length of the exit animation — so the attribute, `aria-expanded` and what is on screen cannot disagree.

That makes it a supported way to drive the component, and something to style and to assert against:

```html
<r-select id="picker" open>
  <r-option value="185">Mike</r-option>
</r-select>

<script>
  const picker = document.getElementById('picker');
  picker.open = true; // or picker.show()
  picker.open = false; // or picker.hide()
  picker.toggle();
</script>

<style>
  /* the trigger, while its panel is open */
  r-select[open]::part(selection) {
    border-color: var(--ran-color-primary);
  }
</style>
```

`show()`, `hide()` and `toggle()` are thin wrappers over it, for when a method reads better than an assignment.

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

### `show` / `after-show` / `hide` / `after-hide`

Fired around the panel's transitions. `show` and `hide` announce the intent, as the transition begins; `after-show` and `after-hide` fire once the panel has actually arrived and any animation has finished — that is the pair to listen to when something has to happen only after the panel is really gone.

They carry no `detail`.

```html
<script>
  const picker = document.getElementById('picker');
  picker.addEventListener('show', () => console.log('opening'));
  picker.addEventListener('after-hide', () => console.log('closed, and done animating'));
</script>
```

The wait is the stylesheet's own animation rather than a duration copied into script, so under `prefers-reduced-motion` — where the panel has no animation to play — `after-hide` follows `hide` immediately instead of after a fixed delay.

## Form Association

`r-select` is a form-associated custom element (`static formAssociated = true`). It relays its selected `value` through `ElementInternals`, so it is collected by `new FormData(form)` under the select's `name`, when it's a real descendant of a native `<form>`. The form value is seeded from any initial selection on connect and kept in sync as the value changes.

**Reset**: a native `form.reset()` restores `defaultValue`'s selection if one is set, otherwise clears the selection entirely — via `formResetCallback()`.

**Validation**: `required` makes an empty selection invalid via `ElementInternals.setValidity()`, visible to `form.checkValidity()`/`form.reportValidity()`; a `disabled` select never blocks validation. `checkValidity()`, `reportValidity()`, `validity`, and `validationMessage` are exposed on the element, same as a native field.

```html
<form>
  <r-select name="country" required>
    <r-option value="us">United States</r-option>
    <r-option value="ca">Canada</r-option>
  </r-select>
  <button type="submit">Submit</button>
</form>
```

## Slots

| Slot      | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| (default) | Accepts `<r-option>` elements that define the selectable options |

## CSS Parts

| Part             | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `select`         | Root wrapper of the select                                  |
| `selection`      | The trigger box (border, background, layout)                |
| `icon`           | Dropdown arrow icon                                         |
| `selection-item` | Element showing the selected option's label                 |
| `search`         | The inline search input (visible with `showSearch`)         |
| `label`          | The static label above the field (present when `label` set) |

## Best Practices

- **Many options**: Enable `showSearch` so users can filter by label.
- **Trigger method**: Match `trigger` to user expectations; `hover` is ignored on mobile, so keep `click` available.
- **Mount position**: In scroll or overflow-clipped layouts, use `getPopupContainerId` to control where the dropdown mounts.
- **Custom styling**: Use `dropdownclass` or the exposed `::part()` names to restyle the trigger and dropdown.
- **Forms**: Give the select a `name` so its value is captured by `FormData` inside a native `<form>`.
