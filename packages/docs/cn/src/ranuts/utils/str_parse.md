# strParse

将字符串解析为对象，支持自定义分隔符和等号。

## API

### strParse

#### Return

| 参数     | 说明         | 类型                     |
| -------- | ------------ | ------------------------ |
| `Object` | 解析后的对象 | `Record<string, string>` |

#### Parameters

| 参数  | 说明               | 类型               | 默认值 |
| ----- | ------------------ | ------------------ | ------ |
| `str` | 要解析的字符串     | `string`           | `''`   |
| `sep` | 键值对之间的分隔符 | `string \| RegExp` | `''`   |
| `eq`  | 键和值之间的等号   | `string \| RegExp` | `''`   |

## Example

### 基础用法（URL 查询字符串）

```js
import { strParse } from 'ranuts';

const query = 'a=1&b=2&c=3';
const result = strParse(query, '&', '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### 自定义分隔符

```js
import { strParse } from 'ranuts';

const str = 'name:John,age:30,city:NY';
const result = strParse(str, ',', ':');
console.log(result); // { name: 'John', age: '30', city: 'NY' }
```

### 使用正则表达式

```js
import { strParse } from 'ranuts';

const str = 'a=1|b=2|c=3';
const result = strParse(str, /\|/, '=');
console.log(result); // { a: '1', b: '2', c: '3' }
```

### 处理空值

```js
import { strParse } from 'ranuts';

const str = 'a=1&b=&c=3';
const result = strParse(str, '&', '=');
console.log(result); // { a: '1', c: '3' } (空值会被过滤)
```

## 注意事项

1. **分隔符**：第一个参数是键值对之间的分隔符（如 `&`），第二个参数是键值之间的等号（如 `=`）。
2. **空值过滤**：键或值为空时会被自动过滤，不会出现在结果对象中。
3. **自动清理**：键和值会自动调用 `clearStr` 进行清理（去除空格、引号等）。
4. **正则支持**：支持字符串和正则表达式作为分隔符。
