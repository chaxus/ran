# retain

Override browser back event, used to intercept and handle browser back operation.

## API

### retain

#### Return

No return value (`void`)

#### Parameters

| Parameter  | Description                                   | Type       | Default |
| ---------- | --------------------------------------------- | ---------- | ------- |
| `callback` | Callback function when back button is clicked | `Function` | `noop`  |

## Example

### Basic Usage

```js
import { retain } from 'ranuts';

retain(() => {
  console.log('User clicked back button');
  // Execute custom logic, such as showing confirmation dialog
  if (confirm('Are you sure you want to leave?')) {
    window.history.back();
  }
});
```

### Prevent Back

```js
import { retain } from 'ranuts';

retain(() => {
  // Prevent default back behavior
  // Can show prompt or execute other operations
  alert('Please save data first');
});
```

### Custom Back Logic

```js
import { retain } from 'ranuts';

retain(() => {
  // Save data before going back
  saveData().then(() => {
    window.history.back();
  });
});
```

## Notes

1. **Implementation principle**: Pushes a history record to the history stack, then listens to `popstate` event to intercept back operation.
2. **Delayed listening**: Uses 500ms delay to ensure history record is properly pushed.
3. **Server-side safety**: In server-side environments (no `window` object), handles silently without throwing errors.
4. **Use case**: Commonly used in form pages to prompt saving data when user goes back, or prevent unsaved back operations.
