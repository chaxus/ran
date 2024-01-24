# formatJson

Pass in a JSON or JSON string, add Spaces and newlines to return a formatted JSON string

## API

### Return

| argument     | Instructions           | type     |
| -------- | -------------- | -------- |
| `string` | Return an object | `Object` |

### Options

| argument     | Instructions                   | type              | Default value |
| -------- | ---------------------- | ----------------- | ------ |
| json     | JSON objects that need to be formatted | `object`,`string` | null     |
| callback | Error callback, optional         | `function`        | null     |

## Example

```js
import { formatJson } from 'ranuts';

const json = {
  name: 'chaxus',
  age: 3,
};

const result = formatJson(json);

console.log(result);
```
