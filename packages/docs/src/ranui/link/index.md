# Link

A router-aware anchor. It renders an `<a>` around its slotted content and intercepts in-app navigation: an internal `href` is handed to the active ranui router (`push`, or `replace` when `replace` is set); external links (`https://`, `//`, `mailto:`, `tel:`) and modified clicks (middle/ctrl/cmd/shift/alt) fall through to the browser as usual. When no router is registered, it dispatches a bubbling, composed `ran-navigate` `CustomEvent` with `{ path, replace }` in its `detail`.

## Code demo

<r-link href="/getting-started">Getting started</r-link>

```xml
<r-link href="/getting-started">Getting started</r-link>
```

## Attributes

### `href`

The navigation target. Internal paths are routed in-app; absolute URLs and `mailto:` / `tel:` links navigate normally.

<r-link href="https://example.com">External link</r-link>

```xml
<r-link href="/docs">Internal link</r-link>
<r-link href="https://example.com">External link</r-link>
```

### `replace`

Boolean attribute. When present, in-app navigation replaces the current history entry (`router.replace`) instead of pushing a new one.

<r-link href="/settings" replace>Replace entry</r-link>

```xml
<r-link href="/settings" replace>Replace entry</r-link>
```

### `sheet`

CSS injected into the link's shadow DOM — the same `sheet` convention used by every other ranui component. Because the clickable `<a>` lives inside the (closed) shadow root, use `sheet` to give it a box model (`display`, `padding`, `width`) when you want to style the host as a button or card.

```xml
<r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; }">Padded link</r-link>
```

## Events

| Event          | Detail                      | When                                                                                |
| -------------- | --------------------------- | ----------------------------------------------------------------------------------- |
| `ran-navigate` | `{ path: string, replace }` | An internal link is clicked and no ranui router is active. Bubbles and is composed. |

## Styling

The clickable `<a>` lives in the closed shadow root and exposes no `::part()`. It reads the global `--ran-color-link`, `--ran-color-primary` (focus ring), and `--ran-radius-sm` tokens — there are no component-scoped `--ran-link-*` variables. Style the host directly, override those tokens, or inject anchor styles through `sheet`. The host also styles an active state via `:host([active]) a` (bold + underline), so you can set the `active` attribute to mark the current link.

```css
r-link {
  --ran-color-link: var(--brand);
}
```
