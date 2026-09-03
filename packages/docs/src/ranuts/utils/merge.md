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

## mergeExports

A different tool despite the name: builds a **lazily-evaluated, frozen** exports object from a
map of getters, instead of copying plain values. Each getter runs at most once, on first
access, and the result is cached from then on, via the same `once` wrapper `ranuts/utils`
exports separately. Nested plain objects are merged (and frozen) recursively; anything that
isn't a getter or a nested object throws.

```js
import { mergeExports } from 'ranuts/utils';

const lazyModule = mergeExports(
  {},
  {
    get expensive() {
      console.log('computing...');
      return heavyComputation();
    },
    nested: {
      get value() {
        return 42;
      },
    },
  },
);

lazyModule.expensive; // logs 'computing...', then returns the result
lazyModule.expensive; // returns the cached result, does not log again
```

#### Notes

1. **Not a general-purpose merge.** Use `merge` for plain values; `mergeExports` is for
   building a module-shaped object where some properties are expensive to compute and should
   only run if actually read.
2. **The result is frozen** (`Object.freeze`), and every defined property is
   `configurable: false`, so the returned object cannot be reassigned or have properties added.
3. **Throws on anything else.** A value that is neither a getter nor a plain nested object
   (an array, a function, a primitive assigned directly) throws `Exposed values must be either
a getter or a nested object`.
