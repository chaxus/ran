---
description: 'The ranui Input (<r-input>) is a basic form control for keyboard entry, with types, sizes and validation — a native Web Component for any framework.'
---

# Input

Input component for entering content via keyboard, the most basic form control.

> **Use when** you need a text field with a floating label, leading icon, validation status/message, and native form participation — `<r-input>` covers text, password, and number entry.

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
| `label`       | `string`  | `''`    | Floating label for a Material Design style experience                              |
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

Provides a Material Design style floating label.

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

`r-input` is a form-associated custom element (`static formAssociated = true`). It attaches `ElementInternals` and relays its value via `setFormValue`, so the field is collected by `new FormData(form)` and works inside `<r-form>` and native `<form>` elements — set `name` to give the value a key.

```html
<form>
  <r-input name="username" label="Username"></r-input>
</form>
```

## CSS Parts

Exposed via `::part()` for external styling.

| Part      | Element                                                   |
| --------- | --------------------------------------------------------- |
| `input`   | The field wrapper                                         |
| `content` | The inner native `<input>` control                        |
| `label`   | The floating label (present when `label` set)             |
| `message` | The helper / validation text (present when `message` set) |

```css
r-input::part(content) {
  font-size: 16px;
}
```

## Best Practices

- **Labels**: Add a meaningful `label` so the field has an accessible name.
- **Placeholders**: Use `placeholder` for input hints, not as a replacement for a label.
- **Status + Message**: Pair `status` with `message` so state is not signalled by color alone.
- **Icons**: Add a relevant `icon` to enhance recognition.
- **Types**: Choose the appropriate `type` (`text`, `password`, `number`, …) for the content.
- **Forms**: Set `name` when collecting the value inside a form.
