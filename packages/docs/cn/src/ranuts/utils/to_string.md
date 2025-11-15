# toString

将值转换为字符串类型。

## API

### toString

#### Return

| 参数     | 说明           | 类型     |
| -------- | -------------- | -------- |
| `string` | 转换后的字符串 | `string` |

#### Parameters

| 参数    | 说明       | 类型               | 默认值 |
| ------- | ---------- | ------------------ | ------ |
| `value` | 要转换的值 | `string \| number` | 无     |

## Example

### 基础用法

```js
import { toString } from 'ranuts';

const str1 = toString(123);
console.log(str1); // '123'

const str2 = toString('hello');
console.log(str2); // 'hello'
```

### 类型转换

```js
import { toString } from 'ranuts';

const num = 42;
const str = toString(num);
console.log(typeof str); // 'string'
```

## 注意事项

1. **简单封装**：这是 `String()` 函数的简单封装。
2. **类型支持**：支持字符串和数字类型的转换。
3. **用途**：常用于类型转换、字符串处理等场景。
