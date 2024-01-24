# filterObj

Filter the properties of the object, remove the properties of the object in the list array, return a new object, usually used to remove null characters and null

## API

### Return

| argument     | Instructions           | type     |
| -------- | -------------- | -------- |
| `Object` | Return an object | `Object` |

### Options

| argument | Instructions               | type     | Default value |
| ---- | ------------------ | -------- | ------ |
| obj  | Objects to be filtered     | `object` | 无     |
| list | Familiar array to filter | `array`  | 无     |

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
