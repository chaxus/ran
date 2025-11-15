# md5

MD5 hash function used to convert a string to an MD5 hash value (hexadecimal string).

## API

### md5

#### Return

| Argument | Description                         | Type     |
| -------- | ----------------------------------- | -------- |
| `string` | MD5 hash value (hexadecimal string) | `string` |

#### Parameters

| Parameter | Description    | Type     | Default  |
| --------- | -------------- | -------- | -------- |
| `str`     | String to hash | `string` | Required |

## Example

### Basic Usage

```js
import { md5 } from 'ranuts';

const hash = md5('hello world');
console.log(hash); // '5eb63bbbe01eeed093cb22bb8f5acdc3'
```

### Password Hashing

```js
import { md5 } from 'ranuts';

const password = 'myPassword123';
const hashedPassword = md5(password);
console.log(hashedPassword);
```

### File Content Hashing

```js
import { md5 } from 'ranuts';

const fileContent = 'file content here';
const fileHash = md5(fileContent);
console.log('File hash:', fileHash);
```

### Non-String Handling

```js
import { md5 } from 'ranuts';

// If non-string is passed, returns a random string
const result = md5(123);
console.log(result); // Random string
```

## Notes

1. **Security**: MD5 is considered insecure and should not be used for password storage or security-sensitive scenarios. It is recommended to use more secure hash algorithms such as SHA-256.
2. **Input type**: If the input is not a string, the function returns a random string.
3. **Output format**: Returns a 32-character hexadecimal string (lowercase).
4. **Performance**: For large amounts of data, MD5 computation may be slow, so it is recommended to use it in an async environment.
