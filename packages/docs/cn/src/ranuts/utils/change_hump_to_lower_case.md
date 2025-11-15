# changeHumpToLowerCase

将驼峰命名转换为下划线命名（小写）。

## API

### changeHumpToLowerCase

#### Return

| 参数     | 说明           | 类型     |
| -------- | -------------- | -------- |
| `string` | 转换后的字符串 | `string` |

#### Parameters

| 参数  | 说明           | 类型     | 默认值 |
| ----- | -------------- | -------- | ------ |
| `str` | 要转换的字符串 | `string` | 无     |

## Example

### 基础用法

```js
import { changeHumpToLowerCase } from 'ranuts';

console.log(changeHumpToLowerCase('userName')); // 'user_name'
console.log(changeHumpToLowerCase('getUserInfo')); // 'get_user_info'
console.log(changeHumpToLowerCase('XMLHttpRequest')); // '_x_m_l_http_request'
```

### 处理连续大写字母

```js
import { changeHumpToLowerCase } from 'ranuts';

console.log(changeHumpToLowerCase('XMLParser')); // '_x_m_l_parser'
console.log(changeHumpToLowerCase('HTTPSRequest')); // '_h_t_t_p_s_request'
```

### API 命名转换

```js
import { changeHumpToLowerCase } from 'ranuts';

const apiName = 'getUserProfile';
const dbField = changeHumpToLowerCase(apiName);
console.log(dbField); // 'get_user_profile'
```

## 注意事项

1. **转换规则**：将大写字母前添加下划线并转为小写。
2. **首字母处理**：如果首字母是大写，会在前面添加下划线。
3. **连续大写**：连续的大写字母会分别处理，每个大写字母前都会添加下划线。
4. **用途**：常用于将 JavaScript 的驼峰命名转换为数据库字段名或 API 参数名。
