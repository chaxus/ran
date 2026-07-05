# Math

Render high-quality LaTeX math formulas in HTML pages using KaTeX.

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

| Property | Type     | Default | Description                                                                             |
| -------- | -------- | ------- | --------------------------------------------------------------------------------------- |
| `latex`  | `string` | `''`    | The LaTeX formula to render. The formula is provided via this attribute, not slot text. |
| `sheet`  | `string` | `''`    | CSS injected into the component's shadow DOM.                                           |

> 💡 **Note**: The `latex` property getter decodes its value with `decodeURIComponent`, so URI-encoded formulas are decoded before rendering. The formula is wrapped in `$$…$$` and rendered with KaTeX. Providing the formula as slotted text content has no effect — only the `latex` attribute is rendered.

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

This component does not emit any custom events.

## Best Practices

- **Provide formulas via `latex`**: Set the formula on the `latex` attribute; slotted text content is not rendered.
- **Escape backslashes in JavaScript**: When assigning `latex` from a JS string literal, remember that `\` must be escaped (e.g. `'\\frac{1}{2}'`).
- **Display math only**: Formulas are wrapped in `$$…$$` and rendered as display (block) math.
- **Custom layout via `sheet`**: Use the `sheet` attribute to override the internal `.ran-math` layout when needed.
