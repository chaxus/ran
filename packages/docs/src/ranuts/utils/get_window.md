# getWindow

Get viewport window size across browsers.

## API

### getWindow

#### Return

| Argument      | Description        | Type          |
| ------------- | ------------------ | ------------- |
| `ClientRatio` | Window size object | `ClientRatio` |

#### ClientRatio

| Property | Description            | Type     |
| -------- | ---------------------- | -------- |
| `width`  | Window width (pixels)  | `number` |
| `height` | Window height (pixels) | `number` |

#### Parameters

No parameters

## Example

### Basic Usage

```js
import { getWindow } from 'ranuts';

const windowSize = getWindow();
console.log('Window width:', windowSize.width);
console.log('Window height:', windowSize.height);
```

### Responsive Layout

```js
import { getWindow } from 'ranuts';

function handleResize() {
  const { width, height } = getWindow();
  if (width < 768) {
    // Mobile layout
  } else {
    // Desktop layout
  }
}

window.addEventListener('resize', handleResize);
```

### Server-Side Safety

```js
import { getWindow } from 'ranuts';

// Won't throw error in server-side environment, returns { width: 0, height: 0 }
const size = getWindow();
console.log(size); // { width: 0, height: 0 }
```

### Calculate Aspect Ratio

```js
import { getWindow } from 'ranuts';

const { width, height } = getWindow();
const aspectRatio = width / height;
console.log('Aspect ratio:', aspectRatio);
```

## Notes

1. **Cross-browser compatibility**: Uses `window.innerWidth` and `window.innerHeight`, compatible with all modern browsers.

2. **Server-side safety**: Returns `{ width: 0, height: 0 }` in server-side environments (no `window` object), won't throw errors.

3. **Real-time**: Returns window size at call time, need to call again after window size changes.

4. **Use case**: Commonly used for responsive layouts, media queries, window size monitoring, etc.
