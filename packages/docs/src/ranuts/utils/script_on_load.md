# scriptOnLoad

Dynamically insert script or link tags and wait for all resources to load.

## API

### scriptOnLoad

#### Return

| Argument        | Description                                         | Type      |
| --------------- | --------------------------------------------------- | --------- |
| `Promise<void>` | Promise that resolves when all resources are loaded | `Promise` |

#### Parameters

| Parameter  | Description                                       | Type          | Default  |
| ---------- | ------------------------------------------------- | ------------- | -------- |
| `urls`     | Array of resource URLs                            | `string[]`    | Required |
| `append`   | Parent element to insert into (optional)          | `HTMLElement` | `body`   |
| `callback` | Callback when all resources are loaded (optional) | `Function`    | Optional |

## Example

### Basic Usage

```js
import { scriptOnLoad } from 'ranuts';

// Load single script
await scriptOnLoad(['https://example.com/script.js']);
console.log('Script loaded');
```

### Load Multiple Resources

```js
import { scriptOnLoad } from 'ranuts';

// Load multiple scripts and styles simultaneously
await scriptOnLoad([
  'https://example.com/script1.js',
  'https://example.com/script2.js',
  'https://example.com/style.css',
]);
console.log('All resources loaded');
```

### Use Callback

```js
import { scriptOnLoad } from 'ranuts';

scriptOnLoad(['https://example.com/library.js'], document.body, () => {
  console.log('Resources loaded, can start using');
});
```

### Dynamically Load Third-Party Library

```js
import { scriptOnLoad } from 'ranuts';

async function loadLibrary() {
  await scriptOnLoad(['https://cdn.example.com/library.js']);
  // Library loaded, can use
  window.Library.init();
}
```

## Notes

1. **Auto type detection**: Automatically identifies whether it's a style file or script file based on URL suffix (`.css`).
2. **Parallel loading**: All resources load in parallel, waits for all resources to complete before resolving.
3. **Insertion location**: Defaults to `body` element, can specify other parent element.
4. **Promise and callback**: Supports both Promise and callback function, can be used together.
