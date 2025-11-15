# querystring

Convert an object to a URL query string.

## API

### querystring

#### Return

| Argument | Description      | Type     |
| -------- | ---------------- | -------- |
| `string` | URL query string | `string` |

#### Parameters

| Parameter | Description       | Type     | Default |
| --------- | ----------------- | -------- | ------- |
| `data`    | Object to convert | `Object` | `{}`    |

## Example

### Basic Usage

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: 30,
  city: 'New York',
};

const query = querystring(params);
console.log(query); // 'name=John&age=30&city=New%20York'
```

### Build URL

```js
import { querystring } from 'ranuts';

const baseUrl = 'https://api.example.com/users';
const params = {
  page: 1,
  limit: 10,
  sort: 'name',
};

const url = `${baseUrl}?${querystring(params)}`;
console.log(url);
// 'https://api.example.com/users?page=1&limit=10&sort=name'
```

### Handle Special Characters

```js
import { querystring } from 'ranuts';

const params = {
  search: 'hello world',
  category: 'web development',
};

const query = querystring(params);
console.log(query); // 'search=hello%20world&category=web%20development'
```

### Filter undefined and null

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: undefined,
  city: null,
  active: true,
};

const query = querystring(params);
console.log(query); // 'name=John&active=true'
// Values that are undefined and null will be filtered out
```

## Notes

1. **URL encoding**: Values are automatically URL encoded.
2. **Empty value filtering**: Values that are `undefined` and `null` are automatically filtered and won't appear in the query string.
3. **Object type**: If a non-object is passed, a `TypeError` will be thrown.
4. **Encoding handling**: Both keys and values are processed with `decodeURIComponent` before encoding.
