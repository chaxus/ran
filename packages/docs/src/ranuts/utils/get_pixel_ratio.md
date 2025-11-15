# getPixelRatio

Get the resolution ratio of Canvas context for handling high DPI screens.

## API

### getPixelRatio

#### Return

| Argument | Description | Type     |
| -------- | ----------- | -------- |
| `number` | Pixel ratio | `number` |

#### Parameters

| Parameter | Description                 | Type                       | Default  |
| --------- | --------------------------- | -------------------------- | -------- |
| `context` | Canvas 2D rendering context | `CanvasRenderingContext2D` | Required |

## Example

### Basic Usage

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);
console.log('Pixel ratio:', ratio);
```

### High DPI Screen Adaptation

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);

// Adjust Canvas size according to ratio
canvas.width = canvas.clientWidth * ratio;
canvas.height = canvas.clientHeight * ratio;

// Scale context to maintain correct drawing size
ctx.scale(ratio, ratio);
```

### Draw Clear Graphics

```js
import { getPixelRatio } from 'ranuts';

function drawHighDPI(canvas) {
  const ctx = canvas.getContext('2d');
  const ratio = getPixelRatio(ctx);

  // Set actual size
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;

  // Scale context
  ctx.scale(ratio, ratio);

  // Draw content (using logical pixels)
  ctx.fillRect(10, 10, 100, 100);
}
```

## Notes

1. **Cross-browser compatibility**: Supports `backingStorePixelRatio` property of different browsers.
2. **High DPI support**: Automatically handles high DPI (Retina) screens, ensuring clear graphics.
3. **Calculation method**: Returns `devicePixelRatio / backingStorePixelRatio`.
4. **Use case**: Commonly used for Canvas drawing, chart libraries, game development, etc., where high clarity is needed.
