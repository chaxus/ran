# getQuery

Extract query parameters from a URL and convert them to an object (same functionality as getAllQueryString).

## API

### getQuery

#### Return

| Argument | Description             | Type                     |
| -------- | ----------------------- | ------------------------ |
| `Object` | Query parameters object | `Record<string, string>` |

#### Parameters

| Parameter | Description                                           | Type     | Default  |
| --------- | ----------------------------------------------------- | -------- | -------- |
| `url`     | URL to parse (optional, defaults to current page URL) | `string` | Optional |

## Example

### Basic Usage

```js
import { getQuery } from 'ranuts';

// Assuming current URL is: https://example.com?name=John&age=30
const params = getQuery();
console.log(params); // { name: 'John', age: '30' }
```

### Parse Specified URL

```js
import { getQuery } from 'ranuts';

const url = 'https://example.com?page=1&limit=10&sort=name';
const params = getQuery(url);
console.log(params); // { page: '1', limit: '10', sort: 'name' }
```

### Get Specific Parameter

```js
import { getQuery } from 'ranuts';

const params = getQuery();
const page = params.page || '1';
const limit = params.limit || '10';
console.log(`Page: ${page}, Limit: ${limit}`);
```

## Notes

1. **Same functionality**: `getQuery` has the same functionality as `getAllQueryString`, can be used interchangeably.
2. **URL decoding**: Parameter values are automatically URL decoded.
3. **Server-side environment**: Returns empty object `{}` in server-side environments (no `window` object).
4. **Default URL**: If `url` parameter is not provided, defaults to `window.location.href`.
