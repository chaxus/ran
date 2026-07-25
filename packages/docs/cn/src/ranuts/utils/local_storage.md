# localStorage 工具

不会抛错的 localStorage 访问，以及建立在它之上的带前缀 JSON 视图。

`localStorage` 不只是在 SSR 下不存在：在禁用 cookie 的三方 iframe 里连*访问*都会抛错，
Safari 隐私模式和配额用尽时*写入*也会抛错。这里每一次读写都有保护 —— 存储失败该降级的是一项
偏好设置，而不是整个页面。

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

### localStorageRemoveItem

删除某个键。

| 参数   | 说明 | 类型     | 默认值 |
| ------ | ---- | -------- | ------ |
| `name` | 键名 | `string` | 无     |

### createStore(prefix?)

建立在 localStorage 之上的、带前缀并自动 JSON 序列化的视图。

#### 返回值

| 方法                 | 说明                                                    |
| -------------------- | ------------------------------------------------------- |
| `get(key, fallback)` | 读取值；不存在、不可用或解析失败时返回 `fallback`       |
| `set(key, value)`    | 序列化后写入；未写成功时返回 `false`                    |
| `remove(key)`        | 删除该键                                                |
| `keyOf(key)`         | 完整存储键（`prefix + key`），监听 `storage` 事件时有用 |

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

### 带命名空间的 JSON 存储

```js
import { createStore } from 'ranuts';

const history = createStore('agent_history_');

history.set('default', messages); // 写入 agent_history_default
const restored = history.get('default', []); // 不存在或损坏时返回 []
history.remove('default');
```

### 同一个源下的多个功能

```js
import { createStore } from 'ranuts';

// 前缀让互不相关的功能不会撞键。
const keys = createStore('agent_api_key_');
const prefs = createStore('editor_prefs_');

keys.set('anthropic', token);
prefs.set('theme', 'dark');
```

## 注意事项

1. **这里没有任何一处会抛错**。存储不存在、三方 iframe 被禁、隐私模式、配额用尽 —— 全部静默
   降级：`localStorageGetItem` 返回 `''`，写入函数什么也不做，`createStore().set()` 返回
   `false`。

2. **在调用时判断，而不是模块加载时**。存储对象在每次调用内部才去取，因此 SSR 后再水合的流程
   同样正确，测试里也可以替换。

3. **`createStore` 不做校验**。存进去什么就按 `T` 取出来什么；跨版本时请自行检查。兜底值只覆盖
   「不存在」和「解析失败」—— 老版本代码写入的值不会把 `SyntaxError` 抛给调用方，但它的结构
   仍然可能是错的。

4. **`set` 返回 `false`** 的情况：循环引用、`BigInt`、以及写入没有真正落盘。它会把值读回来确认。

5. **类型限制**：底层两个函数只处理字符串。需要存对象时用 `createStore`，不要在每个调用点手写
   `JSON.stringify` / `JSON.parse` 加 try/catch。

6. **返回值**：`localStorageGetItem` 在值不存在时返回 `''` 而不是 `null`。
