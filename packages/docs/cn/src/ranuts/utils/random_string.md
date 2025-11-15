# randomString

生成随机字符串，包含时间戳前缀，确保唯一性。

## API

### randomString

#### Return

| 参数     | 说明                                | 类型     |
| -------- | ----------------------------------- | -------- |
| `string` | 随机字符串（格式：时间戳-随机字符） | `string` |

#### Parameters

| 参数  | 说明                             | 类型     | 默认值 |
| ----- | -------------------------------- | -------- | ------ |
| `len` | 随机字符串的长度（不包括时间戳） | `number` | `8`    |

## Example

### 基础用法

```js
import { randomString } from 'ranuts';

const str = randomString();
console.log(str); // 例如: '1703123456789-abc12345'
```

### 指定长度

```js
import { randomString } from 'ranuts';

const str = randomString(12);
console.log(str); // 例如: '1703123456789-abcdefghijkl'
```

### 生成唯一 ID

```js
import { randomString } from 'ranuts';

const uniqueId = randomString(16);
console.log('唯一ID:', uniqueId);
```

### 临时文件名

```js
import { randomString } from 'ranuts';

const tempFileName = `temp_${randomString(10)}.txt`;
console.log(tempFileName); // 例如: 'temp_1703123456789-xyz1234567.txt'
```

## 注意事项

1. **唯一性**：由于包含时间戳，生成的字符串具有很高的唯一性。
2. **字符集**：使用 `ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678` 字符集，排除了容易混淆的字符（如 0、O、1、I、l 等）。
3. **格式**：返回格式为 `{时间戳}-{随机字符}`。
4. **长度**：参数 `len` 只控制随机字符部分的长度，不包括时间戳和连字符。
