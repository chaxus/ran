---
description: "The ranui Checkbox (<r-checkbox>) toggles a single on/off choice, with an optional label and native form support."
---

# Checkbox

Checkbox component for toggling a single on/off choice, with an optional label and native form support.

> **Use when** you need a single on/off toggle with a label that participates in native forms — `<r-checkbox>` reports its checked state to `FormData` and `<r-form>` and is keyboard-operable.

## Quick Start

### Basic Usage

<Demo>
  <r-checkbox>Remember me</r-checkbox>
</Demo>

```html
<r-checkbox>Remember me</r-checkbox>
```

The default slot content becomes the checkbox label.

## API Reference

### Properties

| Property   | Type      | Default   | Description                                                     |
| ---------- | --------- | --------- | --------------------------------------------------------------- |
| `checked`  | `boolean` | `false`   | Whether the checkbox is checked                                 |
| `value`    | `string`  | `'false'` | Form value; mirrors the checked state as `'true'` / `'false'`   |
| `disabled` | `boolean` | `false`   | Whether the checkbox is disabled                                |
| `sheet`    | `string`  | `''`      | CSS injected into the component's shadow DOM for custom styling |

> The `checked` and `value` attributes are kept in sync: setting one updates the other. When checked, `value` is `'true'`; when unchecked, `value` is `'false'`.

### Checked State `checked`

<Demo>
  <r-checkbox checked="true">Checked</r-checkbox>
  <r-checkbox checked="false">Unchecked</r-checkbox>
</Demo>

```html
<r-checkbox checked="true">Checked</r-checkbox> <r-checkbox checked="false">Unchecked</r-checkbox>
```

### Value `value`

<Demo>
  <r-checkbox value="true">Value true</r-checkbox>
  <r-checkbox value="false">Value false</r-checkbox>
</Demo>

```html
<r-checkbox value="true">Value true</r-checkbox> <r-checkbox value="false">Value false</r-checkbox>
```

### Disabled State `disabled`

<Demo>
  <r-checkbox checked="true" disabled>Checked</r-checkbox>
  <r-checkbox checked="false" disabled>Unchecked</r-checkbox>
</Demo>

```html
<r-checkbox checked="true" disabled>Checked</r-checkbox> <r-checkbox checked="false" disabled>Unchecked</r-checkbox>
```

### Custom Styling `sheet`

The `sheet` attribute injects CSS into the shadow DOM, letting you target internal parts by their class names.

<Demo>
  <r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">Themed label</r-checkbox>
</Demo>

```html
<r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">Themed label</r-checkbox>
```

## Events

### `change`

Fired when the checkbox is toggled (by click or by pressing Space/Enter). The event is a `CustomEvent` whose `detail` carries the new checked state:

```ts
detail: {
  checked: boolean; // the checkbox's checked state after the toggle
}
```

A disabled checkbox does not fire `change`.

<Demo>
  <r-checkbox onchange="message.info(this)">Toggle me</r-checkbox>
</Demo>

```html
<r-checkbox onchange="handleChange(event)">Toggle me</r-checkbox>

<script>
  function handleChange(event) {
    console.log('checked:', event.detail.checked);
  }
</script>
```

## Slots

| Slot      | Description                                  |
| --------- | -------------------------------------------- |
| (default) | The checkbox label, rendered next to the box |

## Form Association

`r-checkbox` is a form-associated custom element (`formAssociated = true`). It relays its checked state through `ElementInternals.setFormValue`, so it participates in native forms and is collected by `new FormData(form)` — including inside `<r-form>`. Following native checkbox semantics, it contributes its `value` only when checked.

The host itself carries the accessible checkbox semantics: `role="checkbox"`, `aria-checked`, `aria-disabled`, and keyboard operability (toggle on Space or Enter).

## CSS Parts

Style the internal structure with the `::part()` selector:

| Part       | Element                                        |
| ---------- | ---------------------------------------------- |
| `wrapper`  | The outer flex container holding box and label |
| `checkbox` | The box container                              |
| `input`    | The visually hidden `<input type="checkbox">`  |
| `inner`    | The rendered box (border, fill, check mark)    |
| `label`    | The label wrapping the default slot            |

```css
r-checkbox::part(inner) {
  border-radius: 50%;
}
r-checkbox::part(label) {
  font-weight: 600;
}
```

## Best Practices

- **Label your checkboxes**: Provide slotted text so the control has an accessible name.
- **Checked vs. value**: Use `checked` for boolean state; read `value` (`'true'` / `'false'`) when collecting form data.
- **Disabled State**: Use `disabled` when the choice is unavailable.
- **Listen to `change`**: Read `event.detail.checked` rather than re-querying the DOM.
- **Forms**: Drop `r-checkbox` inside a `<form>` or `<r-form>` — its value is collected automatically when checked.
