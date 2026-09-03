---
description: 'The ranui Icon (<r-icon>) renders semantic vector graphics (SVG) with sizing and color control.'
---

# Icon

Renders semantic vector graphics (SVG) with sizing and color control.

> **Use when** you need a named, resizable, recolorable vector icon (with an optional spin animation) inline in your UI: `<r-icon>` renders a registered SVG by `name`.

## Using icons

### Easiest: just use a bundled name (zero config)

ranui ships its icon set **inlined into the package**. A bundled `name` **loads itself on demand**: no registration, no imports, no asset-path wiring. Only the SVG you actually use is fetched (each is a separate async chunk), so referencing one icon never pulls the whole set:

```html
<r-icon name="lock"></r-icon> <r-icon name="eye"></r-icon>
```

The valid bundled names are the `RanIconName` union / `RAN_ICON_NAMES` tuple (see below). A **custom** name that was never registered still renders **nothing** (a blank space); that only applies to your own SVGs, covered under [Custom icons](#custom-icons).

### Optional: eager-register the whole set

If you'd rather have every bundled icon available **synchronously** (no per-icon async load, e.g. to avoid a first-paint flash on icon-dense views, or in an environment without code-splitting), call `registerBuiltinIcons()` once, as early as possible:

```ts
import { registerBuiltinIcons } from 'ranui'; // or 'ranui/icons'

registerBuiltinIcons(); // registers every name in RAN_ICON_NAMES upfront (~15 KB)
```

The valid names are exported as the `RanIconName` union type and the `RAN_ICON_NAMES` tuple (so your editor autocompletes them and typos are caught):

`add-user`, `arrow-down`, `book`, `check-circle`, `check-circle-fill`, `close`, `close-circle`, `close-circle-fill`, `drop`, `eye`, `eye-close`, `github`, `globe`, `home`, `info-circle`, `info-circle-fill`, `issue`, `loading`, `loading-scene`, `lock`, `menu`, `message`, `more`, `plus`, `power-off`, `preview`, `search`, `setting`, `sort`, `team`, `unlock`, `user`, `warning-circle`, `warning-circle-fill`, `without-content`

### Custom icons

To register your own SVGs (from any icon library or your build's asset pipeline), pass raw SVG strings to `registerIcons` / `registerIcon`:

```ts
import { registerIcon, registerIcons } from 'ranui';
import lock from './icons/lock.svg?raw'; // however your bundler exposes SVG as a raw string

registerIcons({
  lock,
  logo: '<svg viewBox="0 0 24 24"><path d="…" /></svg>', // inline string — no asset file needed
});
registerIcon('star', '<svg viewBox="0 0 24 24">…</svg>');
```

You can also skip the registry entirely by passing raw SVG markup straight to `name` (rendered as-is when it starts with `<svg`):

```html
<r-icon name='<svg viewBox="0 0 24 24">…</svg>'></r-icon>
```

> **Note:** the raw `assets/icons/*.svg` files are **not** part of the published npm package (it ships only `dist/`), so `import '…/lock.svg?raw'` from `ranui` won't resolve; use `registerBuiltinIcons()` for the bundled set, or register your own SVG strings.

> **SSR / timing.** Registration must run in the browser. If an `<r-icon>` connects before its icon is registered it stays blank, then fills in automatically when registration completes (the element listens for the `ranui-icon-registered` event). To avoid a flash of empty icons, register at the very top of your entry module so the registry is populated before the first component renders. In dev, an unregistered name logs `[ranui-icon] icon not registered: <name>`.

## Code demo

<Demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</Demo>

```xml
 <r-icon name="lock"  ></r-icon>
 <r-icon name="eye"  ></r-icon>
 <r-icon name="user"  ></r-icon>
```

## Attribute

### `name`

Select a different icon based on the name.

<Demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</Demo>

```html
<r-icon name="lock"></r-icon>
<r-icon name="eye"></r-icon>
<r-icon name="user"></r-icon>
```

### `size`

<Demo align="end">
  <r-icon name="lock" size="30"></r-icon>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="lock" size="70"></r-icon>
</Demo>

```html
<r-icon name="lock" size="30"></r-icon>
<r-icon name="lock" size="50"></r-icon>
<r-icon name="lock" size="70"></r-icon>
```

### `color`

<Demo>
  <r-icon name="lock" size="50" color="red"></r-icon>
  <r-icon name="lock" size="50" color="#1E90FF"></r-icon>
  <r-icon name="lock" size="50" color="#F44336"></r-icon>
  <r-icon name="lock" size="50" color="#3F51B5"></r-icon>
</Demo>

```html
<r-icon name="lock" size="50" color="red"></r-icon>
<r-icon name="lock" size="50" color="#1E90FF"></r-icon>
<r-icon name="lock" size="50" color="#F44336"></r-icon>
<r-icon name="lock" size="50" color="#3F51B5"></r-icon>
```

### `spin`

Set spin to turn on the rotation, and pass in a number to control the rotation speed. The smaller the number, the faster the rotation.

<Demo>
  <r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
</Demo>

```html
<r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
```

## Icon list

Click any icon to copy its markup.

<IconGallery />

## Styling

`<r-icon>` exposes **6 CSS custom properties** of its own, plus the semantic tokens it reads
from the theme. Set one anywhere it inherits from, such as `:root`, a wrapper, or the element:

```css
r-icon {
  --ran-icon-color: var(--ran-color-text-secondary);
}
```

Parts: `ran-icon`

The full list is in [style tokens](/src/ranui/style-tokens#icon); which token to reach for is the [design system](/src/ranui/design-system/).
