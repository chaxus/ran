# Form

A thin custom-element wrapper around a native `<form>` living in the shadow DOM. It
projects your fields through a named slot and, on submit, serializes the form's
named fields into a JSON string exposed on the `value` property.

## Code demo

<r-form>
  <div slot="r-form_content">
    <input name="username" placeholder="Username" />
    <button type="submit">Submit</button>
  </div>
</r-form>

```xml
<r-form>
  <div slot="r-form_content">
    <input name="username" placeholder="Username" />
    <button type="submit">Submit</button>
  </div>
</r-form>
```

Fields projected into the form must carry `slot="r-form_content"` (or be wrapped in an
element that does) so they land in the internal `<form>`'s named slot.

## Attributes

### `value`

The serialized form state. When the internal form submits, the component collects its
named fields into a JSON object and stores `JSON.stringify(...)` of that object on this
attribute/property. Read it back via the `value` getter:

```js
const form = document.querySelector('r-form');
form.addEventListener('submit', () => {
  console.log(form.value); // e.g. '{"username":"jane"}'
});
```

Setting `value` reflects to the `value` attribute (a `null` value is ignored).

### `sheet`

CSS injected into the component's shadow DOM — the same `sheet` convention used by every
other ranui component. The internal form element carries the class `.r-form`, so you can
target it from the injected sheet.

## Slots

### `r-form_content`

The single named slot that projects your fields into the internal `<form>`. Content
without `slot="r-form_content"` is not placed inside the form.

## Styling

`r-form` exposes no `::part()` handles and no dedicated `--ran-form-*` CSS variables — its
shadow tree is just a native `<form class="r-form">`. Style it either through the light DOM
(your own fields) or by injecting rules via the `sheet` attribute.

```xml
<r-form sheet=".r-form { display: grid; gap: 12px; }">
  <div slot="r-form_content">
    <input name="email" />
    <button type="submit">Save</button>
  </div>
</r-form>
```

Import it via `import 'ranui'` (registers every component) or the standalone
`import 'ranui/form'`.
