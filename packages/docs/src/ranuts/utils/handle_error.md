# handleError

Global error handling, capture unhandled Promise rejections and runtime errors.

## API

### handleError

#### Return

No return value (`void`)

#### Parameters

| Parameter | Description                      | Type       | Default |
| --------- | -------------------------------- | ---------- | ------- |
| `hooks`   | Error handling callback function | `Function` | `noop`  |

#### hooks Parameters

Callback function receives error object:

- `Error`: Runtime error
- `PromiseRejectionEvent`: Promise rejection event
- `ErrorEvent`: Error event

## Example

### Basic Usage

```js
import { handleError } from 'ranuts';

handleError((error) => {
  console.error('Error caught:', error);
  // Can report error to server
});
```

### Error Reporting

```js
import { handleError } from 'ranuts';

handleError((error) => {
  // Report error to server
  fetch('/api/error', {
    method: 'POST',
    body: JSON.stringify({
      message: error.message || error.reason,
      stack: error.stack,
      timestamp: Date.now(),
    }),
  });
});
```

### Distinguish Error Types

```js
import { handleError } from 'ranuts';

handleError((error) => {
  if (error instanceof Error) {
    console.error('Runtime error:', error);
  } else if (error.type === 'unhandledrejection') {
    console.error('Unhandled Promise rejection:', error.reason);
  } else {
    console.error('Other error:', error);
  }
});
```

### Error Logging

```js
import { handleError } from 'ranuts';

const errorLog = [];

handleError((error) => {
  errorLog.push({
    error: error.message || error.reason,
    stack: error.stack,
    time: new Date().toISOString(),
  });
});
```

## Notes

1. **Capture types**: Captures two types of errors:
   - `unhandledrejection`: Unhandled Promise rejection
   - `error`: Runtime error

2. **Capture phase**: Uses capture phase (`true`) to listen, can capture more errors.

3. **Server-side safety**: In server-side environments (no `window` object), handles silently without throwing errors.

4. **Use case**: Commonly used for error monitoring, error reporting, debugging, etc.
