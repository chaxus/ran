# getCookieByName

通过正则表达式获取指定名称的 Cookie 值。

## API

### getCookieByName

#### Return

| 参数     | 说明                              | 类型     |
| -------- | --------------------------------- | -------- |
| `string` | Cookie 值，如果不存在返回空字符串 | `string` |

#### Parameters

| 参数   | 说明        | 类型     | 默认值 |
| ------ | ----------- | -------- | ------ |
| `name` | Cookie 名称 | `string` | 无     |

## Example

### 基础用法

```js
import { getCookieByName } from 'ranuts';

const token = getCookieByName('token');
console.log(token); // Cookie 值或空字符串
```

### 与 getCookie 的区别

```js
import { getCookie, getCookieByName } from 'ranuts';

// getCookie 使用字符串分割方式
const value1 = getCookie('token');

// getCookieByName 使用正则表达式方式
const value2 = getCookieByName('token');

// 两种方式功能相同，但实现方式不同
```

### 检查 Cookie 是否存在

```js
import { getCookieByName } from 'ranuts';

const sessionId = getCookieByName('sessionId');
if (sessionId) {
  console.log('Session ID:', sessionId);
} else {
  console.log('Session ID 不存在');
}
```

## 注意事项

1. **正则匹配**：使用正则表达式匹配 Cookie，支持 Cookie 名称前后有空格的情况。
2. **服务端安全**：在服务端环境（无 `window` 对象）时返回空字符串，不会抛出错误。
3. **与 getCookie 的区别**：功能相同，但 `getCookieByName` 使用正则表达式，`getCookie` 使用字符串分割。
4. **返回值**：Cookie 不存在时返回空字符串，而不是 `null` 或 `undefined`。
