# Mermaid

Render [Mermaid](https://mermaid.js.org/) diagrams (flowcharts, sequence, class, state,
gantt…) as a framework-agnostic web component. `<r-mermaid>` lazy-loads the mermaid library
on first render — apps that never use it pay nothing — and draws the diagram into its shadow
root, so it's isolated from page styles.

> **Use when** you want to drop a diagram from text into any page without wiring up mermaid
> yourself, optionally with a copy / download / fullscreen toolbar and pan-zoom viewer.

## Quick Start

<Demo>
  <r-mermaid>graph LR; A[Request] --> B[Validate]; B --> C[Store]; C --> D[Respond]</r-mermaid>
</Demo>

```html
<r-mermaid>graph LR; A[Request] --> B[Validate]; B --> C[Store]</r-mermaid>
```

```js
import 'ranui'; // or the standalone entry:
import 'ranui/mermaid';
```

The diagram source is read from the element's **text content**, or from a URI-encoded
`code` attribute (use `code` when the syntax contains `<` — e.g. `classDiagram` `<|--` —
so it survives HTML parsing):

```js
el.code = 'classDiagram\n  Dog --|> Animal'; // property setter URI-encodes for you
```

## Controls

Every control is **opt-in** via a boolean attribute; a bare `<r-mermaid>` is a clean static
diagram. The toolbar appears on hover (top-right).

<Demo>
  <r-mermaid copy download fullscreen>graph TD; A[Start] --> B[Do work]; B --> C[End]</r-mermaid>
</Demo>

```html
<r-mermaid copy download fullscreen>graph TD; A --> B; B --> C</r-mermaid>
```

- **copy** — copies the diagram source to the clipboard.
- **download** — SVG / PNG / source (`.mmd`); a single format downloads directly, multiple
  show a menu. Restrict with `download="svg"` or `download="svg png"`.
- **fullscreen** — opens a headerless lightbox (r-modal) with **pan & zoom** (wheel to zoom,
  drag to pan, reset); close via the ✕, backdrop click, or `Esc`.

## API Reference

### Attributes

| Attribute    | Type                          | Default  | Description                                                                                                                                                              |
| ------------ | ----------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `code`       | `string` (URI-encoded)        | —        | Diagram source. Falls back to the element's text content when absent.                                                                                                    |
| `theme`      | `'auto' \| 'light' \| 'dark'` | `'auto'` | Mermaid theme. `auto` follows the page (`.dark` / `[data-ran-theme]`) and re-renders on toggle.                                                                          |
| `copy`       | boolean                       | off      | Show the copy-source button.                                                                                                                                             |
| `download`   | boolean / `"svg png source"`  | off      | Show the download button; value restricts the offered formats.                                                                                                           |
| `fullscreen` | boolean                       | off      | Show the fullscreen button.                                                                                                                                              |
| `sheet`      | `string`                      | —        | Extra CSS injected into the shadow root.                                                                                                                                 |
| `label-*`    | `string`                      | English  | Override control labels: `label-copy`, `label-download`, `label-fullscreen`, `label-zoom-in`, `label-zoom-out`, `label-reset`, `label-diagram` (fullscreen dialog name). |

## Events

All events bubble and cross the shadow boundary (`composed`).

| Event              | `detail`                                 | Fired when                            |
| ------------------ | ---------------------------------------- | ------------------------------------- |
| `render`           | `{ ok: true }`                           | a diagram finished rendering          |
| `copied`           | `{ kind: 'source' }`                     | the source was copied                 |
| `download`         | `{ format: 'svg' \| 'png' \| 'source' }` | a file was downloaded                 |
| `error`            | `{ message: string }`                    | the diagram failed to parse/render    |
| `fullscreenchange` | `{ open: boolean }`                      | the fullscreen lightbox opened/closed |

## CSS Parts

| Part      | Description                                |
| --------- | ------------------------------------------ |
| `mermaid` | The outer wrapper.                         |
| `diagram` | The rendered-diagram container.            |
| `toolbar` | The hover control bar.                     |
| `button`  | Each toolbar icon button.                  |
| `error`   | The error message box (on render failure). |

```css
r-mermaid::part(toolbar) {
  background: var(--surface);
}
```

## CSS Variables

Override on the element (each falls back to a semantic token, then a literal):
`--ran-mermaid-padding`, `--ran-mermaid-toolbar-background`, `--ran-mermaid-toolbar-gap`,
`--ran-mermaid-button-size`, `--ran-mermaid-button-color`, `--ran-mermaid-button-hover-background`,
`--ran-mermaid-error-color`.

## Notes

- **Lazy-loaded**: mermaid (and the r-modal used for fullscreen) are dynamic imports, so
  they arrive as separate async chunks only when a diagram renders / fullscreen opens.
- **Rendering fidelity**: `<r-mermaid>` uses mermaid's own render, so all diagram types and
  themes are supported.
- **PNG export**: diagrams that use HTML labels (mermaid `htmlLabels`) render via
  `<foreignObject>`, which can taint the canvas and make PNG export fail — an `error` event
  is dispatched in that case. SVG and source export always work.
