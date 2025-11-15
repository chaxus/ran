# hexToRgb

Convert hexadecimal color value to RGB array.

## API

### hexToRgb

#### Return

| Argument                | Description                 | Type                    |
| ----------------------- | --------------------------- | ----------------------- |
| `Array<number> \| null` | RGB array [r, g, b] or null | `Array<number> \| null` |

#### Parameters

| Parameter | Description             | Type     | Default  |
| --------- | ----------------------- | -------- | -------- |
| `hex`     | Hexadecimal color value | `string` | Required |

## Example

### Basic Usage

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#ff0000');
console.log(rgb); // [255, 0, 0]

const rgb2 = hexToRgb('#00ff00');
console.log(rgb2); // [0, 255, 0]
```

### Handle Invalid Values

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#invalid');
console.log(rgb); // null
```

### Support With or Without # Symbol

```js
import { hexToRgb } from 'ranuts';

const rgb1 = hexToRgb('#ff0000');
const rgb2 = hexToRgb('ff0000');
console.log(rgb1); // [255, 0, 0]
console.log(rgb2); // [255, 0, 0]
```

### Color Conversion

```js
import { hexToRgb, rgbToHex } from 'ranuts';

const hex = '#ff5733';
const rgb = hexToRgb(hex);
console.log(rgb); // [255, 87, 51]

// Convert back to hex
const hex2 = rgbToHex(rgb[0], rgb[1], rgb[2]);
console.log(hex2); // '#ff5733'
```

## Notes

1. **Format requirement**: Supports 6-digit hexadecimal color values (e.g., `#ff0000` or `ff0000`).
2. **Return value**: Returns `[r, g, b]` array on success, `null` on failure.
3. **Case insensitive**: Case insensitive, both `#FF0000` and `#ff0000` work.
4. **Use case**: Commonly used for color conversion, color processing, CSS color handling, etc.
