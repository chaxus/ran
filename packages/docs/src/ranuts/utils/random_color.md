# randomColor

Generate a random color object.

## API

### randomColor

#### Return

| Argument | Description         | Type    |
| -------- | ------------------- | ------- |
| `Color`  | Random color object | `Color` |

#### Parameters

No parameters

## Example

### Basic Usage

```js
import { randomColor } from 'ranuts';

const color = randomColor();
console.log(color.hex); // '#a3f5c2' (random)
console.log(color.rgb); // Rgb { r: 163, g: 245, b: 194 }
console.log(color.hsl); // Hsl { h: 150, s: 80, l: 80 }
```

### Get Random Color Values

```js
import { randomColor } from 'ranuts';

const color = randomColor();
const hexColor = color.hex;
const rgbColor = color.rgb.toString();
const hslColor = color.hsl.toString();

console.log(hexColor); // '#a3f5c2'
console.log(rgbColor); // 'rgb(163,245,194)'
console.log(hslColor); // 'hsl(150,80%,80%)'
```

### Generate Multiple Random Colors

```js
import { randomColor } from 'ranuts';

const colors = Array.from({ length: 5 }, () => randomColor());
colors.forEach((color, index) => {
  console.log(`Color ${index + 1}:`, color.hex);
});
```

### Set Random Color

```js
import { randomColor } from 'ranuts';

const color = randomColor();
document.body.style.backgroundColor = color.hex;
```

## Notes

1. **Random generation**: Each call generates a random hexadecimal color value.
2. **Complete object**: Returns complete `Color` object, includes all properties like hex, rgb, hsl, etc.
3. **Color format**: Generated color value includes `#` symbol, can be directly used in CSS.
4. **Use case**: Commonly used for random color generation, color picker, data visualization, etc.
