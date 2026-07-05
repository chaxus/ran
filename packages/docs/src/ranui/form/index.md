# Form

Form container that wraps a native `<form>` in the shadow DOM and serializes its fields into a JSON string on submit.

## Quick Start

### Basic Usage

<Demo column>
  <r-form>
    <div slot="r-form_content">
      <r-input name="username" label="Username" placeholder="Enter username"></r-input>
      <r-checkbox name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
      <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
    </div>
  </r-form>
</Demo>

```html
<r-form>
  <div slot="r-form_content">
    <r-input name="username" label="Username" placeholder="Enter username"></r-input>
    <r-checkbox name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
    <button type="submit">Submit</button>
  </div>
</r-form>
```

Fields must be projected through the named slot `r-form_content` (directly or via a wrapper carrying `slot="r-form_content"`) so they land inside the internal `<form>`.

## API Reference

### Properties

| Property | Type             | Default | Description                                                                          |
| -------- | ---------------- | ------- | ------------------------------------------------------------------------------------ |
| `value`  | `string \| null` | `null`  | Serialized form state as a JSON string, written when the internal form submits       |
| `sheet`  | `string`         | `''`    | CSS injected into the component's shadow DOM (the internal form has class `.r-form`) |

### Serialized Value `value`

On submit, the component collects its named fields via `FormData` into a plain object and writes `JSON.stringify(...)` of that object to `value`. Setting `value` reflects to the `value` attribute; a `null` value is ignored.

<Demo column>
  <r-form>
    <div slot="r-form_content">
      <r-input name="email" label="Email" placeholder="you@example.com"></r-input>
      <button type="submit">Save</button>
    </div>
  </r-form>
</Demo>

```html
<r-form id="signup">
  <div slot="r-form_content">
    <r-input name="email" label="Email" placeholder="you@example.com"></r-input>
    <button type="submit">Save</button>
  </div>
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
  <r-form sheet=".r-form { display: grid; gap: 12px; }">
    <div slot="r-form_content">
      <r-input name="first" label="First name"></r-input>
      <r-input name="last" label="Last name"></r-input>
      <button type="submit">Continue</button>
    </div>
  </r-form>
</Demo>

```html
<r-form sheet=".r-form { display: grid; gap: 12px; }">
  <div slot="r-form_content">
    <r-input name="first" label="First name"></r-input>
    <r-input name="last" label="Last name"></r-input>
    <button type="submit">Continue</button>
  </div>
</r-form>
```

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
