# Form

Form container that wraps a native `<form>` in the shadow DOM and serializes its fields into a JSON string on submit.

> **Use when** you need to collect a set of named fields and read them back as a serialized JSON string on submit — `<r-form>` wraps a native `<form>` and gathers its projected fields for you.

## Quick Start

### Basic Usage

<Demo column>
  <r-form>
    <r-input name="username" label="Username" placeholder="Enter username"></r-input>
    <r-checkbox name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
  </r-form>
</Demo>

```html
<r-form>
  <r-input name="username" label="Username" placeholder="Enter username"></r-input>
  <r-checkbox name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
  <button type="submit">Submit</button>
</r-form>
```

Any child placed directly inside `<r-form>` is projected into the internal `<form>` — there is no named slot to remember, and no wrapper element required. `.ran-form` also ships a sensible default layout (vertical stack, 16px gap), so a plain `<r-form>` like the one above already looks right with zero configuration. See [Layout and Styling](#layout-and-styling-sheet) below to change it.

## API Reference

### Properties

| Property | Type             | Default | Description                                                                                |
| -------- | ---------------- | ------- | ------------------------------------------------------------------------------------------ |
| `value`  | `string \| null` | `null`  | Serialized form state as a JSON string, (re)written fresh every time the form is submitted |
| `sheet`  | `string`         | `''`    | CSS injected into the component's shadow DOM (the internal form has class `.ran-form`)     |

### Serialized Value `value`

On submit, the component collects the form's named fields via `FormData` into a plain object and writes `JSON.stringify(...)` of that object to `value` — recomputed fresh on every submit, so it always reflects what was actually in the fields at that moment, not whatever they held when the form first connected. Setting `value` reflects to the `value` attribute; a `null` value is ignored. A native `reset` (e.g. `<button type="reset">` or `form.reset()`) clears `value` back to `null`.

<Demo column>
  <r-form>
    <r-input name="email" label="Email" placeholder="you@example.com"></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Save</button></r-button>
  </r-form>
</Demo>

```html
<r-form id="signup">
  <r-input name="email" label="Email" placeholder="you@example.com"></r-input>
  <button type="submit">Save</button>
</r-form>

<script>
  const form = document.querySelector('#signup');
  // Read the serialized JSON string after the internal form submits
  console.log(form.value); // e.g. '{"email":"you@example.com"}'
</script>
```

### Layout and Styling `sheet`

`.ran-form` lays out its own direct children — every field placed straight inside `<r-form>` becomes one of those children — using a default vertical flex layout (`flex-direction: column`, `align-items: stretch`, `gap: 16px`). Three ways to customize it, in order of how much you're changing:

- **CSS variables** — for value-only tweaks, set them directly on the host, no `sheet` needed: `--ran-form-gap`, `--ran-form-flex-direction`, `--ran-form-align-items`, `--ran-form-content-display`, and `--ran-form-display` (the host itself, default `contents`).
- **`::part(form)`** — targets the internal `<form>` from an ordinary stylesheet, same as any other ranui component.
- **`sheet`** — for structural changes (like switching to a grid), injects CSS straight into the shadow DOM, following the same convention as every other ranui component.

<Demo column>
  <r-form sheet=".ran-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }">
    <r-input name="first" label="First name"></r-input>
    <r-input name="last" label="Last name"></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Continue</button></r-button>
  </r-form>
</Demo>

```html
<r-form sheet=".ran-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }">
  <r-input name="first" label="First name"></r-input>
  <r-input name="last" label="Last name"></r-input>
  <button type="submit">Continue</button>
</r-form>
```

```css
/* Equivalent value-only tweak, no sheet: */
r-form {
  --ran-form-gap: 24px;
}
```

## Events

`r-form` does not dispatch any custom events. It listens to the internal `<form>`'s native `submit` and `reset` events: `submit` (re)computes and writes `value`; `reset` clears `value` back to `null`. Read the result back from `value` after a submit occurs.

```html
<r-form id="profile">
  <r-input name="name" label="Name"></r-input>
  <button type="submit">Submit</button>
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

### Default slot

The single (unnamed) slot that projects your fields into the internal `<form>`. Every child of `<r-form>` lands here and is serialized if it has a `name`.

## Why no dedicated slot name?

`r-input`, `r-checkbox`, and `r-select` are themselves [Form-Associated Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_form-associated_custom_elements) — each calls `attachInternals()` and relays its value with `ElementInternals.setFormValue()`. That means they already work inside a **plain native `<form>`**, with no `<r-form>` involved at all: `new FormData(form)` collects them, `form.reset()` restores their pre-interaction state, and a `required` field blocks submission and shows the browser's native validation UI, anchored on the field. `<r-form>` is optional convenience on top of that — a default layout plus a `value` property that saves you writing the `FormData` → JSON boilerplate yourself.

## Best Practices

- **No slot attribute needed**: place fields directly inside `<r-form>`; a wrapper element works too, but then only the wrapper (not the fields inside it) participates in `.ran-form`'s layout.
- **Name your fields**: only fields with a `name` are captured into the serialized `value`.
- **Read the result from `value`**: the serialized JSON string lives on the `value` property/attribute after submit, and clears on reset.
- **Prefer CSS variables for spacing, `sheet` for structure**: see [Layout and Styling](#layout-and-styling-sheet).
- **Reach for `required` on the fields themselves**: `r-input`, `r-checkbox`, and `r-select` all support `required` plus `checkValidity()`/`reportValidity()` — native browser validation blocks submission without any code in `<r-form>`.
