# handleFetchHook

Intercept and handle `fetch` requests, can execute custom logic before/after requests.

## API

### handleFetchHook

#### Return

No return value (`void`)

#### Parameters

| Parameter | Description           | Type               | Default |
| --------- | --------------------- | ------------------ | ------- |
| `options` | Configuration options | `Partial<Options>` | `{}`    |

#### Options

| Parameter      | Description             | Type       | Default |
| -------------- | ----------------------- | ---------- | ------- |
| `requestHook`  | Callback before request | `Function` | `noop`  |
| `responseHook` | Callback after response | `Function` | `noop`  |
| `errorHook`    | Callback on error       | `Function` | `noop`  |

#### Callback Function Parameters

- `requestHook(url, config)`: Receives request URL and config
- `responseHook(url, config, response)`: Receives request URL, config, and response object
- `errorHook(url, error)`: Receives request URL and error object

## Example

### Basic Usage

```js
import { handleFetchHook } from 'ranuts';

handleFetchHook({
  requestHook: (url, config) => {
    console.log('Request initiated:', url);
  },
  responseHook: (url, config, response) => {
    console.log('Response received:', response.status);
  },
  errorHook: (url, error) => {
    console.error('Request failed:', url, error);
  },
});
```

### Request Logging

```js
import { handleFetchHook } from 'ranuts';

const requestLog = [];

handleFetchHook({
  requestHook: (url, config) => {
    requestLog.push({
      url,
      method: config?.method || 'GET',
      timestamp: Date.now(),
    });
  },
});
```

### Error Reporting

```js
import { handleFetchHook } from 'ranuts';

handleFetchHook({
  errorHook: (url, error) => {
    // Report error to server
    reportError({
      url,
      error: error.message,
      timestamp: Date.now(),
    });
  },
});
```

### Request Statistics

```js
import { handleFetchHook } from 'ranuts';

let requestCount = 0;
let successCount = 0;
let errorCount = 0;

handleFetchHook({
  requestHook: () => requestCount++,
  responseHook: () => successCount++,
  errorHook: () => errorCount++,
});
```

## Notes

1. **Global interception**: Intercepts all `fetch` requests, including third-party library requests.
2. **Original method preserved**: After interception, original `fetch` method still executes, just adds hooks.
3. **Server-side safety**: In server-side environments (no `window` object), handles silently without throwing errors.
4. **Use case**: Commonly used for request monitoring, logging, error reporting, performance analysis, etc.
