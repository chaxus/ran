# getCookie

传入字符串，获取指定名字的 cookie 的值

## API

### Return

| 参数    | 说明                             | 类型     |
| ------- | -------------------------------- | -------- |
| `sting` | 返回的一个指定名称的 cookie 的值 | `string` |

### Options

| 参数 | 说明                       | 类型     | 默认值 |
| ---- | -------------------------- | -------- | ------ |
| name | 指定获取 cookie 的名称的值 | `object` | 无     |

## Example

```js
import { getCookie } from 'ranuts';

const result = getCookie('name');

console.log(result);

// ''
```
