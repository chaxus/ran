# getAllQueryString

Extract all query parameters from a URL and convert them to an object.

## API

### getAllQueryString

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
import { getAllQueryString } from 'ranuts';

// Assuming current URL is: https://example.com?name=John&age=30
const params = getAllQueryString();
console.log(params); // { name: 'John', age: '30' }
```

### Parse Specified URL

```js
import { getAllQueryString } from 'ranuts';

const url = 'https://example.com?page=1&limit=10&sort=name';
const params = getAllQueryString(url);
console.log(params); // { page: '1', limit: '10', sort: 'name' }
```

### Get Specific Parameter

```js
import { getAllQueryString } from 'ranuts';

const params = getAllQueryString();
const page = params.page || '1';
const limit = params.limit || '10';
console.log(`Page: ${page}, Limit: ${limit}`);
```

### Handle Encoded Parameters

```js
import { getAllQueryString } from 'ranuts';

// URL: https://example.com?search=hello%20world
const params = getAllQueryString();
console.log(params.search); // 'hello world' (automatically decoded)
```

## Notes

1. **URL decoding**: Parameter values are automatically URL decoded.

2. **Server-side environment**: Returns empty object `{}` in server-side environments (no `window` object).

3. **Default URL**: If `url` parameter is not provided, defaults to `window.location.href`.

4. **Empty value handling**: Returns empty object if URL has no query parameters.

5. **Duplicate parameters**: If URL has duplicate parameter names, only the last value is kept.
