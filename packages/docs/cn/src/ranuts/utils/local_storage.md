# localStorageGetItem / localStorageSetItem

安全地操作 localStorage，支持服务端渲染环境。

## API

### localStorageSetItem

设置 localStorage 中的值。

#### Parameters

| 参数    | 说明 | 类型     | 默认值 |
| ------- | ---- | -------- | ------ |
| `name`  | 键名 | `string` | 无     |
| `value` | 值   | `string` | 无     |

#### Return

无返回值（`void`）

### localStorageGetItem

获取 localStorage 中的值。

#### Parameters

| 参数   | 说明 | 类型     | 默认值 |
| ------ | ---- | -------- | ------ |
| `name` | 键名 | `string` | 无     |

#### Return

| 参数     | 说明                             | 类型     |
| -------- | -------------------------------- | -------- |
| `string` | 存储的值，如果不存在返回空字符串 | `string` |

## Example

### 基础用法

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// 设置值
localStorageSetItem('username', 'john');

// 获取值
const username = localStorageGetItem('username');
console.log(username); // 'john'
```

### 存储对象

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

const user = { name: 'John', age: 30 };
localStorageSetItem('user', JSON.stringify(user));

const storedUser = JSON.parse(localStorageGetItem('user'));
console.log(storedUser); // { name: 'John', age: 30 }
```

### 服务端安全

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// 在服务端环境中不会报错，会静默失败
localStorageSetItem('key', 'value'); // 服务端环境：无操作
const value = localStorageGetItem('key'); // 服务端环境：返回 ''
```

### 检查是否存在

```js
import { localStorageGetItem } from 'ranuts';

const value = localStorageGetItem('myKey');
if (value) {
  console.log('值存在:', value);
} else {
  console.log('值不存在');
}
```

## 注意事项

1. **服务端安全**：在服务端环境（无 `window` 对象）时会静默处理，不会抛出错误。

2. **类型限制**：localStorage 只能存储字符串，存储对象需要先使用 `JSON.stringify()`。

3. **返回值**：`localStorageGetItem` 在值不存在时返回空字符串，而不是 `null`。

4. **浏览器支持**：需要浏览器支持 localStorage API。
