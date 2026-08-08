# Form

Lightweight wrapper around a native `<form>` that serializes it into a JSON string on submit.

> **Use when** you need to collect a set of named fields and read them back as a serialized JSON string on submit — `<r-form>` wraps your own native `<form>`, stops its default page-navigating submit, and serializes it for you.

## Quick Start

### Basic Usage

<Demo column>
  <r-form>
    <form>
      <r-input name="username" label="Username" placeholder="Enter username"></r-input>
      <r-checkbox name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
      <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
    </form>
  </r-form>
</Demo>

```html
<r-form>
  <form>
    <r-input name="username" label="Username" placeholder="Enter username"></r-input>
    <r-checkbox name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
    <button type="submit">Submit</button>
  </form>
</r-form>
```

`<r-form>` requires a real `<form>` as its child — it does not create one for you. That is deliberate: a `<form>` hidden inside shadow DOM can never become the form owner of anything outside it (verified — not just theoretical; see [Why a real `<form>`?](#why-a-real-form) below), so there is no shadow-DOM trick that could stand in for your own `<form>`. `<r-form>` just gives that `<form>` a sensible default layout (vertical stack, 16px gap — zero configuration needed, as above) and listens for its `submit`/`reset`.

## API Reference

### Properties

| Property | Type             | Default | Description                                                                                    |
| -------- | ---------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `value`  | `string \| null` | `null`  | Serialized form state as a JSON string, (re)written fresh every time the `<form>` is submitted |
| `sheet`  | `string`         | `''`    | CSS injected into the component's shadow DOM, targeting the slotted `<form>` via `::slotted()` |

### Serialized Value `value`

On submit, `<r-form>` calls `preventDefault()` (stopping the native page-navigating submit), collects the form's named fields via `FormData` into a plain object, and writes `JSON.stringify(...)` of that object to `value` — recomputed fresh on every submit, so it always reflects what was actually in the fields at that moment. Setting `value` reflects to the `value` attribute; a `null` value is ignored. A native `reset` (e.g. `<button type="reset">` or `form.reset()`) clears `value` back to `null`.

<Demo column>
  <r-form>
    <form>
      <r-input name="email" label="Email" placeholder="you@example.com"></r-input>
      <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Save</button></r-button>
    </form>
  </r-form>
</Demo>

```html
<r-form id="signup">
  <form>
    <r-input name="email" label="Email" placeholder="you@example.com"></r-input>
    <button type="submit">Save</button>
  </form>
</r-form>

<script>
  const form = document.querySelector('#signup');
  // Read the serialized JSON string after the internal form submits
  console.log(form.value); // e.g. '{"email":"you@example.com"}'
</script>
```

### Layout and Styling `sheet`

The slotted `<form>` gets a default vertical flex layout (`flex-direction: column`, `align-items: stretch`, `gap: 16px`). Three ways to customize it, in order of how much you're changing:

- **CSS variables** — for value-only tweaks, set them directly on the host, no `sheet` needed: `--ran-form-gap`, `--ran-form-flex-direction`, `--ran-form-align-items`, `--ran-form-content-display`, and `--ran-form-display` (the host itself, default `contents`).
- **Plain CSS on your own `<form>`** — it's a real light-DOM element, so an ordinary rule (a class, an id, `r-form form { ... }`) works with no ranui-specific mechanism at all.
- **`sheet`** — for structural changes (like switching to a grid) using the same convention as every other ranui component, injected as `::slotted(form) { ... }`.

<Demo column>
  <r-form sheet="::slotted(form) { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }">
    <form>
      <r-input name="first" label="First name"></r-input>
      <r-input name="last" label="Last name"></r-input>
      <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Continue</button></r-button>
    </form>
  </r-form>
</Demo>

```html
<r-form sheet="::slotted(form) { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }">
  <form>
    <r-input name="first" label="First name"></r-input>
    <r-input name="last" label="Last name"></r-input>
    <button type="submit">Continue</button>
  </form>
</r-form>
```

```css
/* Equivalent value-only tweak, no sheet: */
r-form {
  --ran-form-gap: 24px;
}
```

## Events

`r-form` does not dispatch any custom events. It listens for `submit` and `reset` bubbling up from its slotted `<form>`: `submit` is prevented (no page navigation) and (re)computes `value`; `reset` clears `value` back to `null`.

```html
<r-form id="profile">
  <form>
    <r-input name="name" label="Name"></r-input>
    <button type="submit">Submit</button>
  </form>
</r-form>

<script>
  const form = document.querySelector('#profile');
  document.querySelector('#profile button[type="submit"]').addEventListener('click', () => {
    // value is set from the submit that just bubbled through
    console.log(form.value);
  });
</script>
```

## Slots

### Default slot

The single (unnamed) slot — put your own `<form>` (and only that) inside `<r-form>`.

## Why a real `<form>`?

It would be simpler on the surface for `<r-form>` to build its own internal `<form>` in shadow DOM and slot your fields into it — earlier versions of this component did exactly that. It does not work: a form owner is resolved by walking the real (light) DOM ancestor chain, and that walk never crosses into a shadow root. A `<form>` hidden inside shadow DOM can never become the form owner of light-DOM children, even ones rendered through a `<slot>` — this was verified directly (a plain `<input>` slotted that way has `.form === null` and is invisible to `new FormData(...)`, in a real browser, not just a theoretical spec reading).

So the `<form>` has to be real, authored by you, in the light DOM. The upside: `r-input`, `r-checkbox`, and `r-select` are themselves [Form-Associated Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_form-associated_custom_elements) (`attachInternals()` + `ElementInternals.setFormValue()`), so once they're real descendants of a real `<form>`, everything native just works: `new FormData(form)` collects them, `form.reset()` restores their pre-interaction state, and a `required` field blocks submission and shows the browser's native validation UI, anchored on the field — none of that needs a single line of code in `<r-form>`. `<r-form>` itself is optional convenience on top: a default layout plus a `value` property that saves you writing the `FormData` → JSON boilerplate yourself. You can skip it entirely and use a plain `<form>` if you don't need either.

## Best Practices

- **Always nest a real `<form>`**: `<r-form>` does not create one — see [Why a real `<form>`?](#why-a-real-form).
- **Name your fields**: only fields with a `name` are captured into the serialized `value`.
- **Read the result from `value`**: the serialized JSON string lives on the `value` property/attribute after submit, and clears on reset.
- **Prefer CSS variables or plain CSS for layout**: reach for `sheet` only for structural changes — see [Layout and Styling](#layout-and-styling-sheet).
- **Reach for `required` on the fields themselves**: `r-input`, `r-checkbox`, and `r-select` all support `required` plus `checkValidity()`/`reportValidity()` — native browser validation blocks submission without any code in `<r-form>`.
