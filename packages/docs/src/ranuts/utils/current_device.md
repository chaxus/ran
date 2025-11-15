# currentDevice

Get the current device type.

## API

### currentDevice

#### Return

| Argument        | Description        | Type                                      |
| --------------- | ------------------ | ----------------------------------------- |
| `CurrentDevice` | Device type string | `'ipad' \| 'android' \| 'iphone' \| 'pc'` |

#### Parameters

No parameters

## Example

### Basic Usage

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
console.log(`Current device: ${device}`);
// May output: 'ipad', 'android', 'iphone', or 'pc'
```

### Execute Different Logic Based on Device Type

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
switch (device) {
  case 'iphone':
    // iPhone-specific logic
    break;
  case 'android':
    // Android-specific logic
    break;
  case 'ipad':
    // iPad-specific logic
    break;
  case 'pc':
    // PC-specific logic
    break;
}
```

### Device-Specific Styles

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
document.body.classList.add(`device-${device}`);
```

## Notes

1. **Detection order**: Detects in the following order:
   - iPad/iPod
   - Android
   - iPhone
   - Others (default returns 'pc')

2. **Server-side rendering**: Returns `'pc'` in server-side environments (no `window` object).

3. **Detection method**: Detects via User Agent string.

4. **Return value**: Return value is an enum type, can only be one of `'ipad'`, `'android'`, `'iphone'`, or `'pc'`.
