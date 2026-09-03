# filterObj

Filter an object's properties, removing any whose key appears in the `list` array, and return a new object. Commonly used to strip out empty strings and null values.

## API

### Return

| Argument | Description         | Type     |
| -------- | ------------------- | -------- |
| `Object` | The filtered object | `Object` |

### Options

| Argument | Description               | Type     | Default  |
| -------- | ------------------------- | -------- | -------- |
| `obj`    | Object to filter          | `object` | Required |
| `list`   | Keys to remove from `obj` | `array`  | Required |

## Example

```js
import { filterObj } from 'ranuts';

const obj = {
  name: 'chaxus',
  age: 10,
  address: 'spark',
};

const result = filterObj(obj, ['name', 'address']);

console.log(result);

// { age:10 }
```
