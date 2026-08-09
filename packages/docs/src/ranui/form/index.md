---
description: 'How to build forms with ranui — r-input, r-checkbox, and r-select work directly inside a plain native <form>, no wrapper component required.'
---

# Forms

ranui does not ship a `<form>`-wrapping component. `r-input`, `r-checkbox`, and `r-select` are themselves [Form-Associated Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_form-associated_custom_elements) — each calls `attachInternals()` and relays its value via `ElementInternals.setFormValue()` — so they already work inside a plain native `<form>`: `new FormData(form)` collects them, `form.reset()` restores their pre-interaction state, and a `required` field blocks submission and shows the browser's native validation UI, anchored on the field. None of that needs any ranui-specific markup.

> **Use when** you're assembling a form out of `r-input`/`r-checkbox`/`r-select` — just use a real `<form>`, and reach for `serializeForm()` (below) if you want the submitted values as a plain object instead of hand-rolling `FormData` iteration.

## Quick Start

All three field types, submitted with a plain `<form>` — try changing a field and submitting to see the live result below. This demo builds the object with the browser's own `FormData`/`Object.fromEntries` (no import needed); `serializeForm()`, introduced next, does the same thing plus one thing `Object.fromEntries` can't: a repeated field name comes back as an array instead of silently keeping only the last value.

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.info(JSON.stringify(Object.fromEntries(new FormData(this))))">
    <r-input name="username" label="Username" placeholder="Enter username"></r-input>
    <r-select name="role" label="Role" style="width: 100%" defaultValue="member">
      <r-option value="member">Member</r-option>
      <r-option value="admin">Admin</r-option>
    </r-select>
    <r-checkbox name="subscribe">Subscribe to newsletter</r-checkbox>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
  </form>
</Demo>

> As the [Layout](#layout) section below covers: fields have no default form-level layout of
> their own, so every example on this page — including this one — sets its own `<form>` CSS
> (`display: flex; flex-direction: column; gap: …`). Omitting it stacks fields in plain
> in-flow order with no spacing between them, which reads as broken/overlapping rather than
> a form.

```html
<form id="signup" style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="Username" placeholder="Enter username"></r-input>
  <r-select name="role" label="Role" defaultValue="member">
    <r-option value="member">Member</r-option>
    <r-option value="admin">Admin</r-option>
  </r-select>
  <r-checkbox name="subscribe">Subscribe to newsletter</r-checkbox>
  <button type="submit">Submit</button>
</form>

<script type="module">
  import { serializeForm } from 'ranui';

  document.getElementById('signup').addEventListener('submit', (event) => {
    event.preventDefault(); // a real <form> otherwise navigates the page
    console.log(serializeForm(event.target)); // { username: '...', role: 'member', subscribe: 'true' }
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
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.success('Valid — submitted')">
    <r-input name="username" label="Username" required></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Submit</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="Username" required></r-input>
  <button type="submit">Submit</button>
</form>
```

## Why no `<r-form>` wrapper?

ranui doesn't ship a `<form>` wrapper: a `<form>` hidden inside shadow DOM can never become the form owner of light-DOM children, even ones rendered through a `<slot>` — that's a limitation of the browser's own form-owner algorithm, not something ranui failed to implement. So any wrapper component would only add an extra element around your own `<form>`, without adding any capability a plain `<form>` didn't already have. `serializeForm()` gives you the one genuinely useful piece (submit → plain object).
