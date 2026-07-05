# Link

Router-aware anchor that renders an `<a>` around its slotted content and intercepts in-app navigation.

## Quick Start

### Basic Usage

<Demo>
  <r-link href="/getting-started">Getting started</r-link>
</Demo>

```html
<r-link href="/getting-started">Getting started</r-link>
```

When an internal `href` is clicked, the link hands the path to the active ranui router (`push`, or `replace` when the `replace` attribute is set). External links (`https://`, `//`, `mailto:`, `tel:`) and modified clicks (middle button, Ctrl/Cmd/Shift/Alt) fall through to the browser as usual. When no router is registered, it dispatches a bubbling, composed `ran-navigate` event instead.

## API Reference

### Properties

| Property  | Type      | Default | Description                                                                                            |
| --------- | --------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `href`    | `string`  | `''`    | Navigation target. Internal paths are routed in-app; external URLs navigate normally                   |
| `replace` | `boolean` | `false` | When present, in-app navigation replaces the current history entry (read-only, reflects the attribute) |
| `sheet`   | `string`  | `''`    | CSS injected into the link's shadow DOM                                                                |

### Navigation Target `href`

Internal paths are routed in-app; absolute URLs and `mailto:` / `tel:` links navigate normally.

<Demo>
  <r-link href="/docs">Internal link</r-link>
  <r-link href="https://example.com">External link</r-link>
</Demo>

```html
<r-link href="/docs">Internal link</r-link> <r-link href="https://example.com">External link</r-link>
```

### Replace History `replace`

Boolean attribute. When present, in-app navigation replaces the current history entry (`router.replace`) instead of pushing a new one.

<Demo>
  <r-link href="/settings" replace>Replace entry</r-link>
</Demo>

```html
<r-link href="/settings" replace>Replace entry</r-link>
```

### External Styles `sheet`

CSS injected into the link's shadow DOM — the same `sheet` convention used by every other ranui component. Because the clickable `<a>` lives inside the shadow root, use `sheet` to give it a box model (`display`, `padding`, `width`) when you want the host to read as a button or card.

<Demo>
  <r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; background: var(--ran-color-bg-muted); }">Padded link</r-link>
</Demo>

```html
<r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; }">Padded link</r-link>
```

## Slots

| Slot      | Description                                                   |
| --------- | ------------------------------------------------------------- |
| (default) | Link content, projected into the shadow `<a>` (text or nodes) |

## Events

| Event          | Detail                               | When                                                                             |
| -------------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| `ran-navigate` | `{ path: string, replace: boolean }` | An internal link is clicked and no ranui router is active. Bubbles and composed. |

```html
<r-link href="/docs">Docs</r-link>

<script>
  document.querySelector('r-link').addEventListener('ran-navigate', (e) => {
    console.log(e.detail.path, e.detail.replace);
  });
</script>
```

## Best Practices

- **Internal navigation**: Use a root-relative `href` (e.g. `/docs`) so the router handles it in-app.
- **External links**: Absolute URLs and `mailto:` / `tel:` fall through to the browser — no extra config needed.
- **Replacing history**: Add `replace` for links that shouldn't create a back-button entry (e.g. redirects, tab switches).
- **Active state**: The host styles `:host([active]) a` (bold + underline), so set the `active` attribute to mark the current link.
- **Styling as a button/card**: Put the surface (background, border, radius) on the host, and inject the `<a>` box model (`display`, `padding`, `width`) through `sheet` so the whole area is clickable.
- **Theming**: The `<a>` reads the global `--ran-color-link`, `--ran-color-primary` (focus ring), and `--ran-radius-sm` tokens — override those tokens rather than expecting component-scoped `--ran-link-*` variables (there are none).
