# handleConsole

Intercept and handle console method calls, can execute custom logic before/after console output.

## API

### handleConsole

#### Return

No return value (`void`)

#### Parameters

| Parameter | Description                 | Type       | Default |
| --------- | --------------------------- | ---------- | ------- |
| `hooks`   | Intercept callback function | `Function` | `noop`  |

#### hooks Parameters

Callback function receives the following parameters:

- `type`: Console method type ('log', 'info', 'warn', 'error', 'assert')
- `...args`: Arguments passed to console method

## Example

### Basic Usage

```js
import { handleConsole } from 'ranuts';

handleConsole((type, ...args) => {
  console.log(`[${type}]`, ...args);
  // Can log here, send to server, etc.
});
```

### Log Collection

```js
import { handleConsole } from 'ranuts';

const logs = [];

handleConsole((type, ...args) => {
  logs.push({
    type,
    args,
    timestamp: Date.now(),
  });
});

// Can send logs to server later
```

### Filter Sensitive Information

```js
import { handleConsole } from 'ranuts';

handleConsole((type, ...args) => {
  // Filter sensitive information
  const filtered = args.map((arg) => {
    if (typeof arg === 'string' && arg.includes('password')) {
      return '[FILTERED]';
    }
    return arg;
  });
  console[type](...filtered);
});
```

### Error Reporting

```js
import { handleConsole } from 'ranuts';

handleConsole((type, ...args) => {
  if (type === 'error') {
    // Report error to server
    reportError(args);
  }
});
```

## Notes

1. **Intercepted methods**: Intercepts five console methods: `log`, `info`, `warn`, `error`, `assert`.
2. **Original method preserved**: After interception, original console method still executes, just adds hooks.
3. **Parameter passing**: Callback function receives method type and all original parameters.
4. **Use case**: Commonly used for log collection, error monitoring, debugging tools, etc.
