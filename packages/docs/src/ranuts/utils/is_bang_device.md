# isBangDevice

Determine if the current device is an iPhone with notch (bang screen).

## API

### isBangDevice

#### Return

| Argument  | Description                  | Type      |
| --------- | ---------------------------- | --------- |
| `boolean` | Whether it is a notch device | `boolean` |

#### Parameters

No parameters

## Example

### Basic Usage

```js
import { isBangDevice } from 'ranuts';

if (isBangDevice()) {
  console.log('Current device is iPhone with notch');
  // Adjust layout for notch screen
  adjustLayoutForNotch();
}
```

### Adapt to Notch Screen

```js
import { isBangDevice } from 'ranuts';

if (isBangDevice()) {
  // Add safe area padding
  document.body.style.paddingTop = 'env(safe-area-inset-top)';
  document.body.style.paddingBottom = 'env(safe-area-inset-bottom)';
}
```

### Server-Side Safety

```js
import { isBangDevice } from 'ranuts';

// Returns false in server-side environment
const isBang = isBangDevice();
console.log(isBang); // false (server-side environment)
```

## Notes

1. **Device detection**: Supports detection of the following iPhone models:
   - iPhone 12 mini
   - iPhone X, Xs, 11 Pro
   - iPhone 12, 12 Pro
   - iPhone XR, 11, 11 Pro Max
   - iPhone Xs Max
   - iPhone 12 Pro Max

2. **Detection conditions**:
   - Must be iPhone device
   - Pixel ratio must be 2 or 3
   - Screen size must match specific model

3. **Server-side environment**: Returns `false` in server-side environments (no `window` object).

4. **Use case**: Commonly used to adapt to iPhone notch screen, adjust layout to avoid content being blocked by notch.
