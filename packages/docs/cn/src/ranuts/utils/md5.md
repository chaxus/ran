# md5

MD5 哈希函数，用于将字符串转换为 MD5 哈希值（十六进制字符串）。

## API

### md5

#### Return

| 参数     | 说明                         | 类型     |
| -------- | ---------------------------- | -------- |
| `string` | MD5 哈希值（十六进制字符串） | `string` |

#### Parameters

| 参数  | 说明             | 类型     | 默认值 |
| ----- | ---------------- | -------- | ------ |
| `str` | 需要哈希的字符串 | `string` | 无     |

## Example

### 基础用法

```js
import { md5 } from 'ranuts';

const hash = md5('hello world');
console.log(hash); // '5eb63bbbe01eeed093cb22bb8f5acdc3'
```

### 密码哈希

```js
import { md5 } from 'ranuts';

const password = 'myPassword123';
const hashedPassword = md5(password);
console.log(hashedPassword);
```

### 文件内容哈希

```js
import { md5 } from 'ranuts';

const fileContent = 'file content here';
const fileHash = md5(fileContent);
console.log('文件哈希:', fileHash);
```

### 非字符串处理

```js
import { md5 } from 'ranuts';

// 如果传入非字符串，会返回随机字符串
const result = md5(123);
console.log(result); // 随机字符串
```

## 注意事项

1. **安全性**：MD5 已被认为不安全，不应用于密码存储或安全敏感的场景。建议使用更安全的哈希算法如 SHA-256。
2. **输入类型**：如果输入不是字符串，函数会返回一个随机字符串。
3. **输出格式**：返回的是 32 位十六进制字符串（小写）。
4. **性能**：对于大量数据，MD5 计算可能较慢，建议在异步环境中使用。
