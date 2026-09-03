---
description: 'The ranui Input (<r-input>) is a basic form control for keyboard entry, with types, sizes and validation, implemented as a native Web Component for any framework.'
---

# Input

Input component for entering content via keyboard, the most basic form control.

> **Use when** you need a text field with a static top-aligned label, leading icon, validation status/message, and native form participation: `<r-input>` covers text, password, and number entry.

## Quick Start

### Basic Usage

<Demo column>
  <r-input placeholder="Enter text"></r-input>
</Demo>

```html
<r-input placeholder="Enter text"></r-input>
```

## API Reference

### Properties

| Property      | Type      | Default | Description                                                                        |
| ------------- | --------- | ------- | ---------------------------------------------------------------------------------- |
| `label`       | `string`  | `''`    | Static caption rendered above the field                                            |
| `placeholder` | `string`  | `''`    | Placeholder text, forwarded to the native `<input>`                                |
| `value`       | `string`  | `''`    | Field value; reflected as an attribute and relayed to the form                     |
| `disabled`    | `boolean` | `false` | Whether the input is disabled                                                      |
| `type`        | `string`  | `''`    | Native input type forwarded to the inner control (`text`, `password`, `number`, …) |
| `icon`        | `string`  | `''`    | Leading icon name (rendered as `r-icon`) inside the field                          |
| `name`        | `string`  | `''`    | Form field name used when the input participates in a form                         |
| `status`      | `string`  | `''`    | Validation status: `error`, `warning`                                              |
| `message`     | `string`  | `''`    | Helper / validation text rendered below the field                                  |
| `min`         | `string`  | `''`    | Minimum value; forwarded to the inner `<input>` when `type="number"`               |
| `max`         | `string`  | `''`    | Maximum value; forwarded to the inner `<input>` when `type="number"`               |
| `step`        | `string`  | `''`    | Value step; forwarded to the inner `<input>` when `type="number"`                  |
| `required`    | `boolean` | `false` | Forwarded to the inner `<input>` so native constraint validation applies           |
| `sheet`       | `string`  | `''`    | CSS injected into the shadow root                                                  |

### Label `label`

A static caption rendered above the field: always visible, never overlaps adjacent
content, and doesn't shift the layout on focus (top-aligned labels also complete forms
faster than inline/floating ones; see [Luke Wroblewski's eye-tracking research](https://www.lukew.com/ff/entry.asp?504=)).

<Demo column>
  <r-input label="Username"></r-input>
</Demo>

```html
<r-input label="Username"></r-input>
```

### Placeholder `placeholder`

Consistent with the native `placeholder` attribute.

<Demo column>
  <r-input placeholder="Enter username"></r-input>
</Demo>

```html
<r-input placeholder="Enter username"></r-input>
```

### Value `value`

<Demo column>
  <r-input value="1234"></r-input>
</Demo>

```html
<r-input value="1234"></r-input>
```

### Disabled State `disabled`

<Demo column>
  <r-input label="Username" disabled></r-input>
</Demo>

```html
<r-input label="Username" disabled></r-input>
```

### Icon `icon`

<Demo column>
  <r-input icon="user"></r-input>
</Demo>

```html
<r-input icon="user"></r-input>
```

### Input Types `type`

<Demo column>
  <r-input icon="lock" type="password" placeholder="Password"></r-input>
  <r-input type="number" placeholder="Number"></r-input>
</Demo>

```html
<r-input icon="lock" type="password" placeholder="Password"></r-input>
<r-input type="number" placeholder="Number"></r-input>
```

### Status `status`

Pair `status` with a `message` so the state is conveyed by text, not color alone.

<Demo column>
  <r-input status="error" label="Username" message="This field is required"></r-input>
  <r-input status="warning" label="Username" message="Check this value"></r-input>
</Demo>

```html
<r-input status="error" label="Username" message="This field is required"></r-input>
<r-input status="warning" label="Username" message="Check this value"></r-input>
```

### Helper Message `message`

Renders helper / validation text below the field.

<Demo column>
  <r-input label="Email" message="We will never share your email"></r-input>
</Demo>

```html
<r-input label="Email" message="We will never share your email"></r-input>
```

### Form Field Name `name`

```html
<r-input name="username" label="Username"></r-input>
```

## Events

Both events are dispatched as `CustomEvent`s carrying the current value in `detail`.

| Event    | When it fires                                   | `detail`            |
| -------- | ----------------------------------------------- | ------------------- |
| `input`  | On every keystroke (mirrors the native `input`) | `{ value: string }` |
| `change` | On commit / blur (mirrors the native `change`)  | `{ value: string }` |

### Input Event `input`

<Demo column>
  <r-input oninput="console.log(event.detail.value)" label="Username"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'Username');
input.addEventListener('input', (event) => {
  console.log('Typing:', event.detail.value);
});
```

### Change Event `change`

<Demo column>
  <r-input onchange="console.log(event.detail.value)" label="Username"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'Username');
input.addEventListener('change', (event) => {
  console.log('Value changed:', event.detail.value);
});
```

## Form Association

`r-input` is a form-associated custom element (`static formAssociated = true`). It attaches `ElementInternals` and relays its value via `setFormValue`, so the field is collected by `new FormData(form)` when it's a real descendant of a native `<form>`; set `name` to give the value a key. See [Forms](/src/ranui/form/) for the `serializeForm()` helper that turns a submit into a plain object.

```html
<form>
  <r-input name="username" label="Username"></r-input>
</form>
```

**Reset**: a native `form.reset()` (or `<button type="reset">`) restores the value the field had when it first connected, implemented via `formResetCallback()`, one of the lifecycle hooks the browser calls automatically on a form-associated custom element.

**Validation**: setting `required` makes an empty field invalid via `ElementInternals.setValidity()`; `form.checkValidity()`/`form.reportValidity()` see it, and submitting shows the browser's native validation bubble anchored on the field. `disabled` fields never block validation, matching native `<input>`. `r-input` also exposes the usual native-field methods/properties: `checkValidity()`, `reportValidity()`, `validity`, `validationMessage`.

```html
<form>
  <r-input name="username" label="Username" required></r-input>
  <button type="submit">Submit</button>
</form>
```

## CSS Parts

Exposed via `::part()` for external styling.

| Part      | Element                                                     |
| --------- | ----------------------------------------------------------- |
| `input`   | The field wrapper                                           |
| `content` | The inner native `<input>` control                          |
| `label`   | The static label above the field (present when `label` set) |
| `message` | The helper / validation text (present when `message` set)   |

```css
r-input::part(content) {
  font-size: 16px;
}
```

## Styling

`<r-input>` exposes **61 CSS custom properties** of its own, plus the semantic tokens it reads
from the theme. Set one anywhere it inherits from, such as `:root`, a wrapper, or the element:

```css
r-input {
  --ran-input-color: var(--ran-color-text-secondary);
}
```

Parts: `content` · `input` · `label` · `message`

The full list is in [style tokens](/src/ranui/style-tokens#input); which token to reach for is the [design system](/src/ranui/design-system/).

## Best Practices

- **Labels**: Add a meaningful `label` so the field has an accessible name.
- **Placeholders**: Use `placeholder` for input hints, not as a replacement for a label.
- **Status + Message**: Pair `status` with `message` so state is not signalled by color alone.
- **Icons**: Add a relevant `icon` to enhance recognition.
- **Types**: Choose the appropriate `type` (`text`, `password`, `number`, …) for the content.
- **Forms**: Set `name` when collecting the value inside a form.
