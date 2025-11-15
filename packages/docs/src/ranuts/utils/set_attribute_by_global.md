# setAttributeByGlobal

Add property to global object (`window` or `global`).

## API

### setAttributeByGlobal

#### Return

No return value (`void`)

#### Parameters

| Parameter | Description    | Type     | Default  |
| --------- | -------------- | -------- | -------- |
| `name`    | Property name  | `string` | Required |
| `value`   | Property value | `any`    | Required |

## Example

### Basic Usage

```js
import { setAttributeByGlobal } from 'ranuts';

setAttributeByGlobal('myGlobalVar', 'hello');
console.log(window.myGlobalVar); // 'hello'
```

### Set Function

```js
import { setAttributeByGlobal } from 'ranuts';

setAttributeByGlobal('myFunction', () => {
  console.log('Global function called');
});

window.myFunction(); // 'Global function called'
```

### Cross-Environment Compatibility

```js
import { setAttributeByGlobal } from 'ranuts';

// Sets to window in browser environment
// Sets to global in Node.js environment
setAttributeByGlobal('appConfig', { apiUrl: 'https://api.example.com' });
```

## Notes

1. **Environment detection**: Automatically detects environment, sets to `window` in browser, `global` in Node.js.
2. **Global pollution**: Modifies global object, may cause naming conflicts, use with caution.
3. **Type safety**: In TypeScript, may need type declarations to correctly recognize.
4. **Use case**: Commonly used for setting global configuration, exposing APIs for global use, etc.
