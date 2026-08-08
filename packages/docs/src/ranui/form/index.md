# Form

Form container that wraps a native `<form>` in the shadow DOM and serializes its fields into a JSON string on submit.

> **Use when** you need to collect a set of named fields and read them back as a serialized JSON string on submit — `<r-form>` wraps a native `<form>` and gathers its projected fields for you.

## Quick Start

### Basic Usage

<Demo column>
  <r-form sheet=".r-form { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }">
    <r-input slot="r-form_content" name="username" label="Username" placeholder="Enter username"></r-input>
    <r-checkbox slot="r-form_content" name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
    <r-button slot="r-form_content" type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
  </r-form>
</Demo>

```html
<r-form sheet=".r-form { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }">
  <r-input slot="r-form_content" name="username" label="Username" placeholder="Enter username"></r-input>
  <r-checkbox slot="r-form_content" name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
  <button slot="r-form_content" type="submit">Submit</button>
</r-form>
```

Fields must be projected through the named slot `r-form_content` (directly, or via a wrapper carrying `slot="r-form_content"`). Slotting them directly — as above — is what lets a `sheet` rule on `.r-form` (see [Injected Styles](#injected-styles-sheet)) lay the fields themselves out with spacing; a single wrapper `<div>` would give `.r-form` only one child to lay out.

## API Reference

### Properties

| Property | Type             | Default | Description                                                                          |
| -------- | ---------------- | ------- | ------------------------------------------------------------------------------------ |
| `value`  | `string \| null` | `null`  | Serialized form state as a JSON string, written when the internal form submits       |
| `sheet`  | `string`         | `''`    | CSS injected into the component's shadow DOM (the internal form has class `.r-form`) |

### Serialized Value `value`

On submit, the component collects its named fields via `FormData` into a plain object and writes `JSON.stringify(...)` of that object to `value`. Setting `value` reflects to the `value` attribute; a `null` value is ignored.

<Demo column>
  <r-form sheet=".r-form { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }">
    <r-input slot="r-form_content" name="email" label="Email" placeholder="you@example.com"></r-input>
    <r-button slot="r-form_content" type="primary"><button type="submit" style="all: unset; cursor: pointer">Save</button></r-button>
  </r-form>
</Demo>

```html
<r-form id="signup" sheet=".r-form { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }">
  <r-input slot="r-form_content" name="email" label="Email" placeholder="you@example.com"></r-input>
  <button slot="r-form_content" type="submit">Save</button>
</r-form>

<script>
  const form = document.querySelector('#signup');
  // Read the serialized JSON string after the internal form submits
  console.log(form.value); // e.g. '{"email":"you@example.com"}'
</script>
```

### Injected Styles `sheet`

`sheet` follows the same convention as every other ranui component: its CSS is injected into the shadow DOM. Target the internal form through its `.r-form` class — for example to lay the fields out as a grid.

<Demo column>
  <r-form sheet=".r-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }">
    <r-input slot="r-form_content" name="first" label="First name"></r-input>
    <r-input slot="r-form_content" name="last" label="Last name"></r-input>
    <r-button slot="r-form_content" type="primary"><button type="submit" style="all: unset; cursor: pointer">Continue</button></r-button>
  </r-form>
</Demo>

```html
<r-form sheet=".r-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }">
  <r-input slot="r-form_content" name="first" label="First name"></r-input>
  <r-input slot="r-form_content" name="last" label="Last name"></r-input>
  <button slot="r-form_content" type="submit">Continue</button>
</r-form>
```

This works because `.r-form` lays out its own direct children — each field slotted straight into `r-form_content` (not wrapped in a `<div>`) becomes one of those children, so `display: grid` on `.r-form` places the fields themselves, not just a single wrapper.

## Events

`r-form` does not dispatch any custom events. Its only event behavior is a listener on the internal `<form>`'s native `submit` event, which updates the `value` property with the serialized JSON string. Read the result back from `value` after a submit occurs.

```html
<r-form id="profile">
  <div slot="r-form_content">
    <r-input name="name" label="Name"></r-input>
    <button type="submit">Submit</button>
  </div>
</r-form>

<script>
  const form = document.querySelector('#profile');
  document.querySelector('#profile button[type="submit"]').addEventListener('click', () => {
    // value is set from the internal form's submit
    console.log(form.value);
  });
</script>
```

## Slots

### `r-form_content`

The single named slot that projects your fields into the internal `<form>`. Content without `slot="r-form_content"` is not placed inside the form and will not be serialized.

## Best Practices

- **Project through the slot**: Always give fields `slot="r-form_content"` (or wrap them in an element that carries it).
- **Name your fields**: Only fields with a `name` are captured into the serialized `value`.
- **Read the result from `value`**: The serialized JSON string lives on the `value` property/attribute after submit.
- **Layout via `sheet`**: The shadow tree exposes no `::part()` handles or CSS variables — style the internal `<form class="r-form">` by injecting rules through the `sheet` attribute, or style your own fields in the light DOM.
