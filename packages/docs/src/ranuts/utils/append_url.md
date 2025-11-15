# appendUrl

Append query parameter object to the end of a URL.

## API

### appendUrl

#### Return

| Argument | Description                           | Type     |
| -------- | ------------------------------------- | -------- |
| `string` | Complete URL with appended parameters | `string` |

#### Parameters

| Parameter | Description             | Type                     | Default  |
| --------- | ----------------------- | ------------------------ | -------- |
| `url`     | Base URL                | `string`                 | Required |
| `params`  | Query parameters object | `Record<string, string>` | `{}`     |

## Example

### Basic Usage

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', limit: '10' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?page=1&limit=10'
```

### URL with Existing Query Parameters

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com?sort=name';
const params = { page: '1' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?sort=name&page=1'
```

### Handle Protocol-Relative URL

```js
import { appendUrl } from 'ranuts';

// URLs starting with // will automatically add https://
const url = '//example.com';
const params = { id: '123' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?id=123'
```

### Filter Empty Values

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', empty: '' };
const fullUrl = appendUrl(url, params);
// Empty string values will be filtered
console.log(fullUrl); // 'https://example.com?page=1'
```

## Notes

1. **Protocol handling**: If URL starts with `//`, it will automatically add `https://` protocol.

2. **Parameter merging**: If URL already has query parameters, new parameters will be appended.

3. **Empty value filtering**: Parameters with empty string values will be filtered and not added to the URL.

4. **URL encoding**: Parameter values are automatically URL encoded.

5. **Override behavior**: If parameter name already exists, new value will override old value (determined by URLSearchParams behavior).
