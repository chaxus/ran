# Select

Dropdown selector component with support for single selection, search, and custom styling.

## Quick Start

### Basic Usage

<r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
</r-select>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## API Reference

### Select Properties

| Property              | Type      | Default     | Description                                             |
| --------------------- | --------- | ----------- | ------------------------------------------------------- |
| `defaultValue`        | `string`  | `''`        | Default selected value                                  |
| `disabled`            | `boolean` | `false`     | Whether the select is disabled                          |
| `type`                | `string`  | `'default'` | Select type: `default`, `text`                          |
| `placement`           | `string`  | `'bottom'`  | Dropdown direction: `top`, `bottom`                     |
| `showSearch`          | `boolean` | `false`     | Whether to show search box                              |
| `getPopupContainerId` | `string`  | `''`        | Container element id for dropdown                       |
| `dropdownclass`       | `string`  | `''`        | Custom class name for dropdown                          |
| `trigger`             | `string`  | `'click'`   | Trigger method: `click`, `hover`, `click,hover`, `none` |

### Option Properties

| Property   | Type      | Default | Description                    |
| ---------- | --------- | ------- | ------------------------------ |
| `value`    | `string`  | `''`    | Option value                   |
| `disabled` | `boolean` | `false` | Whether the option is disabled |

### Default Value `defaultValue`

<r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
</r-select>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Disabled State `disabled`

<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
</r-select>

```html
<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Text Type `type`

<r-select
      style="width: 120px; height: 40px"
      type="text"
      defaultValue="185"
    >
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```html
<r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Dropdown Direction `placement`

<r-select
      style="width: 120px; height: 40px"
      type="text"
      defaultValue="185"
      placement="top"
    >
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```html
<r-select style="width: 120px; height: 40px" type="text" defaultValue="185" placement="top">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Search Function `showSearch`

<r-select style="width: 120px; height: 40px" showSearch>
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```html
<r-select style="width: 120px; height: 40px" showSearch>
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Container Mount `getPopupContainerId`

```html
<r-select getPopupContainerId="elementid">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Custom Styling `dropdownclass`

```html
<r-select dropdownclass="custom-dropdown">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Trigger Method `trigger`

<r-select style="width: 120px; height: 40px" trigger="click,hover">
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```html
<!-- Click trigger (default) -->
<r-select trigger="click">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- Hover trigger -->
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

<!-- No trigger -->
<r-select trigger="none">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## Events

### Change Event

```html
<r-select onchange="handleChange">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  function handleChange(value) {
    console.log('Selected value:', value);
  }
</script>
```

## Best Practices

- **Option Count**: Enable search when there are many options
- **Trigger Method**: Choose appropriate trigger based on user habits
- **Mount Position**: Pay attention to dropdown mount position in complex layouts
- **Custom Styling**: Use `dropdownclass` for style customization
- **Disabled Options**: Use `disabled` attribute for unavailable options
