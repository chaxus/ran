# range

限制数字在指定的最小值和最大值范围内。

## API

### range

#### Return

| 参数     | 说明         | 类型     |
| -------- | ------------ | -------- |
| `number` | 限制后的数字 | `number` |

#### Parameters

| 参数  | 说明         | 类型     | 默认值 |
| ----- | ------------ | -------- | ------ |
| `num` | 要限制的数字 | `number` | 无     |
| `min` | 最小值       | `number` | `0`    |
| `max` | 最大值       | `number` | `1`    |

## Example

### 基础用法

```js
import { range } from 'ranuts';

console.log(range(5, 0, 10)); // 5
console.log(range(15, 0, 10)); // 10 (被限制到最大值)
console.log(range(-5, 0, 10)); // 0 (被限制到最小值)
```

### 百分比限制

```js
import { range } from 'ranuts';

const progress = 150; // 150%
const clamped = range(progress, 0, 100);
console.log(clamped); // 100
```

### 自定义范围

```js
import { range } from 'ranuts';

const value = 25;
const clamped = range(value, 10, 20);
console.log(clamped); // 20 (超出范围被限制)
```

### 颜色值限制

```js
import { range } from 'ranuts';

const red = 300; // RGB 值应该在 0-255
const clamped = range(red, 0, 255);
console.log(clamped); // 255
```

## 注意事项

1. **限制逻辑**：如果数字小于最小值，返回最小值；如果大于最大值，返回最大值；否则返回原值。
2. **默认范围**：默认范围是 0 到 1，适合处理百分比或比例值。
3. **用途**：常用于限制用户输入、计算进度值、颜色值等场景。
