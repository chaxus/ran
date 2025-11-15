# getHost

Get host address based on environment configuration.

## API

### getHost

#### Return

| Argument              | Description         | Type                  |
| --------------------- | ------------------- | --------------------- |
| `string \| undefined` | Host address string | `string \| undefined` |

#### Parameters

| Parameter | Description                 | Type     | Default  |
| --------- | --------------------------- | -------- | -------- |
| `env`     | Environment name (optional) | `string` | Optional |

## Example

### Basic Usage

```js
import { getHost } from 'ranuts';

// Automatically detect environment from window.location.hostname
const host = getHost();
console.log(host); // Returns corresponding host address based on current environment
```

### Specify Environment

```js
import { getHost } from 'ranuts';

const trunkHost = getHost('trunk');
console.log(trunkHost); // '//log..trunk'

const testHost = getHost('test');
console.log(testHost); // '//log.test'

const prodHost = getHost('prod');
console.log(prodHost); // '//log.'
```

### Environment Detection Rules

```js
import { getHost } from 'ranuts';

// trunk/neibu/release environments
getHost('trunk'); // '//log..trunk'
getHost('neibu'); // '//log..neibu'
getHost('release'); // '//log..release'

// test environment
getHost('test'); // '//log.test'

// prod environment
getHost('prod'); // '//log.'
```

## Notes

1. **Environment detection**: If `env` parameter is not provided, automatically detects environment from `window.location.hostname`.
2. **Server-side environment**: Returns `undefined` in server-side environments (no `window` object).
3. **Environment mapping**:
   - `trunk`, `neibu`, `release` → `.${env}`
   - `test` → `test`
   - `prod` → empty string
4. **Return format**: Returns format as `//log.${host}`, where `host` varies based on environment.
