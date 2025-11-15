# merge

Merge objects, copying properties from the second object to the first object.

## API

### merge

#### Return

| Argument | Description                              | Type     |
| -------- | ---------------------------------------- | -------- |
| `Object` | Merged object (returns the first object) | `Object` |

#### Parameters

| Parameter | Description                                    | Type     | Default  |
| --------- | ---------------------------------------------- | -------- | -------- |
| `a`       | Target object (will be modified)               | `Object` | Required |
| `b`       | Source object (properties will be copied to a) | `Object` | Optional |

## Example

### Basic Usage

```js
import { merge } from 'ranuts';

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

const result = merge(obj1, obj2);
console.log(result); // { a: 1, b: 3, c: 4 }
console.log(obj1); // { a: 1, b: 3, c: 4 } (original object modified)
console.log(result === obj1); // true (returns the original object)
```

### Merge Configuration Objects

```js
import { merge } from 'ranuts';

const defaultConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
};

const userConfig = {
  port: 8080,
  ssl: true,
};

const config = merge(defaultConfig, userConfig);
console.log(config);
// { host: 'localhost', port: 8080, timeout: 5000, ssl: true }
```

### Pass Only One Parameter

```js
import { merge } from 'ranuts';

const obj = { a: 1 };
const result = merge(obj);
console.log(result); // { a: 1 } (returns as is)
```

## Notes

1. **Modifies original object**: This function directly modifies the first object instead of creating a new one.
2. **Shallow merge**: Only performs one-level merging, does not deep merge nested objects.
3. **Property override**: If both objects have the same key, the second object's value will override the first object's value.
4. **Return value**: Returns the first object (which has been modified).
