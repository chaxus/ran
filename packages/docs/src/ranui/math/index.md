---
description: 'Render LaTeX math formulas as native MathML using Temml — no canvas, SVG, or KaTeX runtime.'
---

# Math

Render high-quality LaTeX math formulas in HTML pages using Temml, compiled straight to native MathML.

> **Use when** you need to render a LaTeX math formula as display math in an HTML page — `<r-math>` typesets the expression from its `latex` attribute with [Temml](https://temml.org/), which compiles LaTeX to MathML that the browser lays out itself (no canvas/SVG, no KaTeX runtime).

## Quick Start

### Basic Usage

<Demo>
  <r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
</Demo>

```html
<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
```

## API Reference

### Properties

| Property   | Type      | Default   | Description                                                                                           |
| ---------- | --------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `latex`    | `string`  | `''`      | The LaTeX formula to render. The formula is provided via this attribute, not slot text.               |
| `display`  | `string`  | `'block'` | `block` (display math) or `inline` (inline math).                                                     |
| `font`     | `string`  | `''`      | Set to `system` to skip the bundled Latin Modern Math face and use the reader's system math font.     |
| `macros`   | `string`  | `''`      | A JSON object of Temml macros. Invalid JSON is silently ignored.                                      |
| `wrap`     | `string`  | `''`      | Temml soft line-breaking: `none`, `tex`, or `=`.                                                      |
| `copy`     | `boolean` | `false`   | Shows a copy button. Bare `copy` copies the LaTeX source; `copy="mathml"` copies the rendered MathML. |
| `download` | `boolean` | `false`   | Shows a download button/menu for the source (`.tex`) and/or MathML (`.mml`).                          |
| `sheet`    | `string`  | `''`      | CSS injected into the component's shadow DOM.                                                         |

> 💡 **Note**: The `latex` property getter decodes its value with `decodeURIComponent`, so URI-encoded formulas are decoded before rendering. Providing the formula as slotted text content has no effect — only the `latex` attribute is rendered.

### Formula `latex`

<Demo>
  <r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
</Demo>

```html
<r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
```

### External Styles `sheet`

<Demo>
  <r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
</Demo>

```html
<r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
```

## Events

| Event      | detail                             | Fired when                                                    |
| ---------- | ---------------------------------- | ------------------------------------------------------------- |
| `render`   | `{ ok: true }`                     | The formula rendered successfully.                            |
| `error`    | `{ message: string }`              | Temml failed to parse the formula (e.g. invalid LaTeX).       |
| `copied`   | `{ kind: 'source' \| 'mathml' }`   | The copy button copied the source or MathML to the clipboard. |
| `download` | `{ format: 'source' \| 'mathml' }` | The download button saved a `.tex` or `.mml` file.            |

## Styling

`<r-math>` exposes **16 CSS custom properties** of its own, plus the semantic tokens it reads
from the theme. Set one anywhere it inherits from — `:root`, a wrapper, or the element:

```css
r-math {
  --ran-math-error-background: var(--ran-color-bg-subtle);
}
```

Parts: `button` · `error` · `math` · `menu` · `render` · `toolbar`

The full list is in [style tokens](/src/ranui/style-tokens#math); which token to reach for is the [design system](/src/ranui/design-system/).

## Best Practices

- **Provide formulas via `latex`**: Set the formula on the `latex` attribute; slotted text content is not rendered.
- **Escape backslashes in JavaScript**: When assigning `latex` from a JS string literal, remember that `\` must be escaped (e.g. `'\\frac{1}{2}'`).
- **Handle parse failures**: Listen for `error` (or check the rendered `::part(error)` box) rather than assuming every formula is valid LaTeX.
- **Custom layout via `sheet`**: Use the `sheet` attribute to override the internal `.ran-math` layout when needed.
