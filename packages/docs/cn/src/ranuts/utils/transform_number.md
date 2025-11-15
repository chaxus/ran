# transformNumber

将数字转换为带单位的格式化字符串，支持中英文单位。

## API

### transformNumber

#### Return

| 参数     | 说明             | 类型     |
| -------- | ---------------- | -------- |
| `string` | 格式化后的字符串 | `string` |

#### Parameters

| 参数        | 说明                 | 类型     | 默认值    |
| ----------- | -------------------- | -------- | --------- |
| `value`     | 要转换的数字字符串   | `string` | 无        |
| `locale`    | 语言环境             | `string` | `'zh-CN'` |
| `precision` | 精度（用于计算）     | `number` | `2`       |
| `fixed`     | 小数位数（用于显示） | `number` | `2`       |

## Example

### 基础用法

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000')); // '1.00 万'
console.log(transformNumber('1000000')); // '100.00 万'
console.log(transformNumber('100000000')); // '1.00 亿'
```

### 英文单位

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000', 'en')); // '1.00K'
console.log(transformNumber('1000000', 'en')); // '1.00M'
console.log(transformNumber('1000000000', 'en')); // '1.00B'
```

### 自定义精度

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1234', 'zh-CN', 2, 1)); // '0.1 万'
console.log(transformNumber('12345', 'zh-CN', 2, 0)); // '1 万'
```

### 处理无效输入

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('abc')); // '--'
console.log(transformNumber('')); // '--'
```

## 注意事项

1. **单位系统**：
   - `zh-CN`: 万、亿、万亿（每 4 位）
   - `zh-HK`: 萬、億、萬億（每 4 位）
   - `en`: K、M、B、T（每 3 位）

2. **精度处理**：使用 `Mathjs` 进行精确计算，避免浮点数精度问题。

3. **无效输入**：如果输入不是有效数字，返回 `'--'`。

4. **用途**：常用于显示大数字，如金额、浏览量、粉丝数等。
