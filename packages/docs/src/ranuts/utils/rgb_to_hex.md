# rgbToHex

Convert RGB values to hexadecimal color value.

## API

### rgbToHex

#### Return

| Argument | Description             | Type     |
| -------- | ----------------------- | -------- |
| `string` | Hexadecimal color value | `string` |

#### Parameters

| Parameter | Description            | Type                        | Default  |
| --------- | ---------------------- | --------------------------- | -------- |
| `r`       | Red value or RGB array | `string \| number \| Array` | Required |
| `g`       | Green value (optional) | `string \| number`          | `0`      |
| `b`       | Blue value (optional)  | `string \| number`          | `0`      |

## Example

### Basic Usage

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex(255, 0, 0);
console.log(hex); // '#ff0000'

const hex2 = rgbToHex(0, 255, 0);
console.log(hex2); // '#00ff00'
```

### Use Array

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex([255, 87, 51]);
console.log(hex); // '#ff5733'
```

### Color Conversion

```js
import { rgbToHex, hexToRgb } from 'ranuts';

const rgb = [255, 87, 51];
const hex = rgbToHex(rgb);
console.log(hex); // '#ff5733'

// Convert back to RGB
const rgb2 = hexToRgb(hex);
console.log(rgb2); // [255, 87, 51]
```

### Dynamic Color Generation

```js
import { rgbToHex } from 'ranuts';

function generateColor(r, g, b) {
  return rgbToHex(r, g, b);
}

const color = generateColor(100, 150, 200);
console.log(color); // '#6496c8'
```

## Notes

1. **Parameter format**: Supports three formats:
   - Three separate parameters: `rgbToHex(r, g, b)`
   - Array parameter: `rgbToHex([r, g, b])`
   - String or number: Automatically converted

2. **Return value**: Always returns hexadecimal color value with `#` symbol.

3. **Value range**: RGB values are typically in 0-255 range, values outside range will be converted to hexadecimal.

4. **Use case**: Commonly used for color conversion, CSS color generation, color processing, etc.
