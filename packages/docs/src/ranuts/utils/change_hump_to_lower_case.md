# changeHumpToLowerCase

Convert camelCase naming to snake_case naming (lowercase).

## API

### changeHumpToLowerCase

#### Return

| Argument | Description      | Type     |
| -------- | ---------------- | -------- |
| `string` | Converted string | `string` |

#### Parameters

| Parameter | Description       | Type     | Default  |
| --------- | ----------------- | -------- | -------- |
| `str`     | String to convert | `string` | Required |

## Example

### Basic Usage

```js
import { changeHumpToLowerCase } from 'ranuts';

console.log(changeHumpToLowerCase('userName')); // 'user_name'
console.log(changeHumpToLowerCase('getUserInfo')); // 'get_user_info'
console.log(changeHumpToLowerCase('XMLHttpRequest')); // '_x_m_l_http_request'
```

### Handle Consecutive Uppercase Letters

```js
import { changeHumpToLowerCase } from 'ranuts';

console.log(changeHumpToLowerCase('XMLParser')); // '_x_m_l_parser'
console.log(changeHumpToLowerCase('HTTPSRequest')); // '_h_t_t_p_s_request'
```

### API Naming Conversion

```js
import { changeHumpToLowerCase } from 'ranuts';

const apiName = 'getUserProfile';
const dbField = changeHumpToLowerCase(apiName);
console.log(dbField); // 'get_user_profile'
```

## Notes

1. **Conversion rules**: Adds underscore before uppercase letters and converts to lowercase.
2. **First letter handling**: If first letter is uppercase, adds underscore before it.
3. **Consecutive uppercase**: Consecutive uppercase letters are handled separately, each uppercase letter gets an underscore before it.
4. **Use case**: Commonly used to convert JavaScript camelCase naming to database field names or API parameter names.
