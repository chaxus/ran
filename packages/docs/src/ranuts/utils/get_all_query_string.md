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

1. **A bare flag keeps its place.** `?embed` and `?embed=` both yield `{ embed: '' }`. Before
   0.3 any parameter without a value was dropped, which made `?readonly` and `?embed` (the
   usual way to write a boolean flag) indistinguishable from the parameter being absent. Read
   such a flag with [`queryFlag`](/src/ranuts/utils/query_flag).

2. **A fragment never leaks into the last value.** `?lang=en#section` yields `{ lang: 'en' }`.

3. **Only the first `=` splits**, so a value may contain one: `?next=/a?b=1` yields
   `{ next: '/a?b=1' }`.

4. **URL decoding**: keys and values are percent-decoded, and `+` becomes a space, matching
   `URLSearchParams`. A malformed escape such as `%zz` is kept verbatim rather than dropping
   the parameter, so one bad value cannot hide the others.

5. **Server-side environment**: returns `{}` when there is no `window` and no `url` was
   passed. Pass a URL to use it in a build-time script.

6. **Default URL**: without `url`, defaults to `window.location.href`.

7. **Duplicate parameters**: only the last value is kept.
