# Image

Image component that renders an image with a built-in fallback shown when the source fails to load.

## Quick Start

### Basic Usage

<Demo>
  <r-img src="https://picsum.photos/id/1015/240/160"></r-img>
</Demo>

```html
<r-img src="https://picsum.photos/id/1015/240/160"></r-img>
```

## API Reference

### Properties

| Property   | Type     | Default                        | Description                                                                    |
| ---------- | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `src`      | `string` | `''`                           | Image source URL. Read once when the element mounts (see note below).          |
| `alt`      | `string` | `''`                           | Alternative text forwarded to the inner `<img>`. Empty marks it as decorative. |
| `fallback` | `string` | built-in broken-image data URI | Image shown when `src` fails to load.                                          |
| `sheet`    | `string` | `''`                           | CSS injected into the component's shadow DOM.                                  |

> ⚠️ **Note on `src`**: `src` is **not** in `observedAttributes`; it is read only once during `connectedCallback`. Changing `src` after the element is mounted does **not** reload the image. Set `src` before insertion, or re-create the element to change the source. `alt`, `fallback`, and `sheet` are observed and update reactively.

### Image Source `src`

<Demo>
  <r-img src="https://picsum.photos/id/1025/240/160"></r-img>
</Demo>

```html
<r-img src="https://picsum.photos/id/1025/240/160"></r-img>
```

### Alternative Text `alt`

`alt` is forwarded to the inner `<img>`. Leave it empty (the default) for decorative images so screen readers skip them; provide a description for meaningful images.

<Demo>
  <r-img src="https://picsum.photos/id/1035/240/160" alt="A mountain lake at dusk"></r-img>
</Demo>

```html
<r-img src="https://picsum.photos/id/1035/240/160" alt="A mountain lake at dusk"></r-img>
```

### Load Failure `fallback`

When `src` fails to load, the component swaps in `fallback`. If `fallback` is not set, a built-in broken-image placeholder is used. Below, `src` is an invalid URL, so the fallback image is shown instead.

<Demo>
  <r-img src="https://example.invalid/does-not-exist.png" fallback="data:image/png;base64,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"></r-img>
</Demo>

```html
<r-img
  src="https://example.invalid/does-not-exist.png"
  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...(broken image placeholder)..."
></r-img>
```

### External Styles `sheet`

`sheet` injects raw CSS into the component's shadow DOM. Use it to style the internal `.ran-image` container or the inner `<img>`.

<Demo>
  <r-img
    src="https://picsum.photos/id/1043/240/160"
    sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
  ></r-img>
</Demo>

```html
<r-img
  src="https://picsum.photos/id/1043/240/160"
  sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
></r-img>
```

## Events

None. `r-img` does not dispatch any custom events.

## Best Practices

- **Set `src` before mounting**: Because `src` is read only once on connect, assign it before inserting the element; do not expect a later `src` change to reload the image.
- **Provide `alt` for meaningful images**: Describe the content for screen readers; leave `alt` empty only for purely decorative images.
- **Rely on the built-in fallback**: A default broken-image placeholder is used automatically, but supply your own `fallback` when you want a branded or context-appropriate placeholder.
- **Style with `sheet`**: Since the image lives in shadow DOM, use the `sheet` attribute (or component CSS variables) to apply borders, radius, or sizing.
