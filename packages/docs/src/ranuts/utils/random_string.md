# randomString

Generate a random string with a timestamp prefix to ensure uniqueness.

## API

### randomString

#### Return

| Argument | Description                                    | Type     |
| -------- | ---------------------------------------------- | -------- |
| `string` | Random string (format: timestamp-random chars) | `string` |

#### Parameters

| Parameter | Description                                   | Type     | Default |
| --------- | --------------------------------------------- | -------- | ------- |
| `len`     | Length of random string (excluding timestamp) | `number` | `8`     |

## Example

### Basic Usage

```js
import { randomString } from 'ranuts';

const str = randomString();
console.log(str); // e.g.: '1703123456789-abc12345'
```

### Specify Length

```js
import { randomString } from 'ranuts';

const str = randomString(12);
console.log(str); // e.g.: '1703123456789-abcdefghijkl'
```

### Generate Unique ID

```js
import { randomString } from 'ranuts';

const uniqueId = randomString(16);
console.log('Unique ID:', uniqueId);
```

### Temporary File Name

```js
import { randomString } from 'ranuts';

const tempFileName = `temp_${randomString(10)}.txt`;
console.log(tempFileName); // e.g.: 'temp_1703123456789-xyz1234567.txt'
```

## Notes

1. **Uniqueness**: Due to the timestamp inclusion, the generated string has high uniqueness.
2. **Character set**: Uses the character set `ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678`, excluding easily confused characters (such as 0, O, 1, I, l, etc.).
3. **Format**: Returns format as `{timestamp}-{random chars}`.
4. **Length**: The parameter `len` only controls the length of the random character part, excluding the timestamp and hyphen.

## getRandomString

A lighter alternative: no timestamp prefix, no restricted character set, just
`Math.random().toString(36)` sliced to `len` characters (base-36, so `0-9a-z`). Not
collision-resistant the way `randomString` is; use it for things like a one-off DOM id or a
cache-busting query param where uniqueness doesn't need to survive a timestamp collision.

```js
import { getRandomString } from 'ranuts/utils';

getRandomString(); // e.g. 'k3j9x2p1' (8 chars)
getRandomString(4); // e.g. 'a1b2'
```
