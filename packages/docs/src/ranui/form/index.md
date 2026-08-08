---
description: 'How to build forms with ranui — r-input, r-checkbox, and r-select work directly inside a plain native <form>, no wrapper component required.'
---

# Forms

ranui does not ship a `<form>`-wrapping component. `r-input`, `r-checkbox`, and `r-select` are themselves [Form-Associated Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_form-associated_custom_elements) — each calls `attachInternals()` and relays its value via `ElementInternals.setFormValue()` — so they already work inside a plain native `<form>`: `new FormData(form)` collects them, `form.reset()` restores their pre-interaction state, and a `required` field blocks submission and shows the browser's native validation UI, anchored on the field. None of that needs any ranui-specific markup.

> **Use when** you're assembling a form out of `r-input`/`r-checkbox`/`r-select` — just use a real `<form>`, and reach for `serializeForm()` (below) if you want the submitted values as a plain object instead of hand-rolling `FormData` iteration.

## Quick Start

<Demo column>
  <form onsubmit="event.preventDefault(); message.info(new FormData(this).get('username'))">
    <r-input name="username" label="Username" placeholder="Enter username"></r-input>
    <r-checkbox name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
  </form>
</Demo>

```html
<form id="signup">
  <r-input name="username" label="Username" placeholder="Enter username"></r-input>
  <r-checkbox name="subscribe" value="yes">Subscribe to newsletter</r-checkbox>
  <button type="submit">Submit</button>
</form>

<script type="module">
  import { serializeForm } from 'ranui';

  document.getElementById('signup').addEventListener('submit', (event) => {
    event.preventDefault(); // a real <form> otherwise navigates the page
    console.log(serializeForm(event.target)); // { username: '...', subscribe: 'yes' }
  });
</script>
```

## `serializeForm(form)`

Collects a `<form>`'s named fields into a plain object via `FormData` — the boilerplate every consumer otherwise hand-rolls to turn a submit into something they can `JSON.stringify` or send as a fetch body. It's a plain function with no dependency on ranui fields specifically; it works with any real `<form>`.

```ts
function serializeForm(form: HTMLFormElement): Record<string, unknown>;
```

A field with more than one value under the same `name` (e.g. multiple checkboxes sharing a name) comes back as an array; everything else comes back as a single value.

```ts
import { serializeForm } from 'ranui';

const data = serializeForm(document.querySelector('form'));
// { username: 'alice', tags: ['a', 'b'] }
fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) });
```

## Layout

Fields have no default form-level layout — style your own `<form>` with plain CSS:

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px;">
    <r-input name="first" label="First name"></r-input>
    <r-input name="last" label="Last name"></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Continue</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="first" label="First name"></r-input>
  <r-input name="last" label="Last name"></r-input>
  <button type="submit">Continue</button>
</form>
```

## Validation and reset

`r-input`, `r-checkbox`, and `r-select` all support `required` (which blocks submission and triggers the browser's native validation bubble, exactly like a native field) plus `checkValidity()`, `reportValidity()`, `validity`, and `validationMessage`. A native `form.reset()` — or `<button type="reset">` — restores each field to its pre-interaction state via `formResetCallback()`. See each field's own docs ([Input](/src/ranui/input/#form-association), [Checkbox](/src/ranui/checkbox/#form-association), [Select](/src/ranui/select/#form-association)) for details.

<Demo column>
  <form onsubmit="event.preventDefault(); message.success('Valid — submitted')">
    <r-input name="username" label="Username" required></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
  </form>
</Demo>

```html
<form>
  <r-input name="username" label="Username" required></r-input>
  <button type="submit">Submit</button>
</form>
```

## Why no `<r-form>` wrapper?

An earlier version of ranui had one — it built its own internal `<form>` inside shadow DOM and slotted fields into it. That does not work: a form owner is resolved by walking the real (light) DOM ancestor chain, and that walk never crosses into a shadow root. A `<form>` hidden inside shadow DOM can never become the form owner of light-DOM children, even ones rendered through a `<slot>` — this was verified directly (a plain `<input>` slotted that way has `.form === null` and is invisible to `new FormData(...)`, in a real browser, not just a theoretical spec reading). So the `<form>` always had to be real and in the light DOM regardless — which meant the wrapper added an extra element around your own `<form>` without adding any capability a plain `<form>` didn't already have. Removed in favor of `serializeForm()`, which gives you the one genuinely useful piece (submit → plain object) without the wrapper.
