# Math

Modern mathematical formula component using KaTeX to render high-quality LaTeX expressions in HTML pages, with async loading, error handling, and event notifications.

## Code Demo

### Basic Usage

Set LaTeX mathematical expressions using the `latex` property.

<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>

```html
<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
```

### Inline Formulas

By default, mathematical formulas are displayed inline.

```html
<p>
  The quadratic formula is
  <r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
</p>
```

### Block Formulas

Add the `display` attribute to center formulas in block mode.

<r-math display latex="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}"></r-math>

```html
<r-math display latex="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}"></r-math>
```

### Complex Formulas

Supports rendering complex mathematical formulas.

<r-math display latex="\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}"></r-math>

<r-math display latex="\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}"></r-math>

```html
<r-math display latex="\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}"></r-math>

<r-math display latex="\begin{pmatrix} a & b \\ c & d \end{pmatrix}"></r-math>
```

### Event Handling

Listen to render success and error events.

```html
<r-math id="mathFormula" latex="E = mc^2"></r-math>

<script>
  const math = document.getElementById('mathFormula');

  // Listen to render success event
  math.addEventListener('render', (e) => {
    console.log('Render successful:', e.detail);
    // { latex: "E = mc^2", success: true }
  });

  // Listen to render error event
  math.addEventListener('error', (e) => {
    console.error('Render failed:', e.detail);
    // { latex: "...", error: Error }
  });
</script>
```

### Dynamic Updates

Dynamically modify the `latex` property to automatically re-render the formula.

```html
<r-math id="dynamicMath" latex="x^2"></r-math>
<button onclick="updateFormula()">Update Formula</button>

<script>
  function updateFormula() {
    const math = document.getElementById('dynamicMath');
    math.latex = 'x^3 + y^3 = z^3';
  }
</script>
```

## API

### Math Properties

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| latex | LaTeX mathematical expression | `string` | - |
| display | Block display mode | `boolean` | `false` |
| loading | Loading state (read-only) | `boolean` | `false` |
| error | Error state (read-only) | `boolean` | `false` |

### Math Methods

| Method | Description | Parameters | Return Value |
| --- | --- | --- | --- |
| refresh | Force re-render formula | - | `Promise<void>` |
| clear | Clear rendered formula | - | `void` |

### Math Events

| Event | Description | Callback Parameter |
| --- | --- | --- |
| render | Triggered when formula renders successfully | `CustomEvent<MathRenderEventDetail>` |
| error | Triggered when formula rendering fails | `CustomEvent<MathErrorEventDetail>` |

### MathRenderEventDetail Interface

```typescript
interface MathRenderEventDetail {
  latex: string;    // LaTeX expression
  success: true;    // Success status
}
```

### MathErrorEventDetail Interface

```typescript
interface MathErrorEventDetail {
  latex: string;  // LaTeX expression
  error: Error;   // Error object
}
```

### CSS Custom Properties

| Property | Description | Default |
| --- | --- | --- |
| --math-display | Display mode | `inline-block` |
| --math-justify-content | Horizontal alignment | `flex-start` |
| --math-align-items | Vertical alignment | `center` |

### CSS Parts

| Part | Description |
| --- | --- |
| container | Formula container |

## Common LaTeX Syntax

### Fractions

```latex
\frac{a}{b}
```

### Radicals

```latex
\sqrt{x} \quad \sqrt[n]{x}
```

### Superscripts and Subscripts

```latex
x^2 \quad x_i \quad x^{2y} \quad x_{i+1}
```

### Summation and Integration

```latex
\sum_{i=1}^{n} \quad \int_{a}^{b} \quad \prod_{i=1}^{n}
```

### Matrices

```latex
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
```

### Greek Letters

```latex
\alpha \beta \gamma \delta \theta \pi \sigma
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Math Example</title>
</head>
<body>
  <h2>Euler's Formula</h2>
  <r-math id="euler" display latex="e^{i\pi} + 1 = 0"></r-math>

  <h2>Maxwell's Equations</h2>
  <r-math display latex="\nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_0}"></r-math>
  <r-math display latex="\nabla \cdot \mathbf{B} = 0"></r-math>
  <r-math display latex="\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}"></r-math>
  <r-math display latex="\nabla \times \mathbf{B} = \mu_0 \mathbf{J} + \mu_0 \epsilon_0 \frac{\partial \mathbf{E}}{\partial t}"></r-math>

  <script>
    const euler = document.getElementById('euler');

    euler.addEventListener('render', (e) => {
      console.log('Euler formula rendered successfully!');
    });

    euler.addEventListener('error', (e) => {
      console.error('Render failed:', e.detail.error.message);
    });
  </script>
</body>
</html>
```

## Accessibility

- Formula container has `role="math"` attribute
- Loading state is indicated via `aria-busy` attribute for screen readers
- Clear error messages displayed when rendering fails

## Notes

- **LaTeX Syntax**: Ensure correct LaTeX syntax is used
- **Escape Characters**: Backslashes in HTML attributes may need URL encoding
- **Performance**: First load asynchronously loads KaTeX library, subsequent renders are faster
- **Error Handling**: Listen to `error` event to handle rendering failures
- **Dynamic Updates**: Modifying `latex` property automatically triggers re-rendering

## Best Practices

- **Block Formulas**: Use `display` attribute for complex formulas in block mode
- **Error Listening**: Monitor `error` event in production to provide friendly error messages
- **Lazy Loading**: KaTeX library uses async loading, expect brief delay on first render
- **Formula Caching**: Identical formulas are cached, repeated use doesn't affect performance
