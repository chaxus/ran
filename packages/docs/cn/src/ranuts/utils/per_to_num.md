# perToNum

将百分比字符串转换为数字。

## API

### perToNum

#### Return

| 参数     | 说明         | 类型     |
| -------- | ------------ | -------- |
| `number` | 转换后的数字 | `number` |

#### Parameters

| 参数  | 说明         | 类型     | 默认值 |
| ----- | ------------ | -------- | ------ |
| `str` | 百分比字符串 | `string` | `''`   |

## Example

### 基础用法

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5
console.log(perToNum('100%')); // 1
console.log(perToNum('150%')); // 1.5
```

### 处理大于 1 的百分比

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5 (小于等于 1，直接返回)
console.log(perToNum('150%')); // 1.5 (大于 1，除以 100)
console.log(perToNum('200%')); // 2
```

### 处理普通数字字符串

```js
import { perToNum } from 'ranuts';

console.log(perToNum('0.5')); // 0.5
console.log(perToNum('100')); // 100
```

### 处理空字符串

```js
import { perToNum } from 'ranuts';

console.log(perToNum('')); // 0
console.log(perToNum()); // 0
```

## 注意事项

1. **百分比处理**：
   - 如果值大于 1，会除以 100（如 `150%` → `1.5`）
   - 如果值小于等于 1，直接返回（如 `50%` → `0.5`）

2. **非百分比字符串**：如果字符串不以 `%` 结尾，会直接转换为数字。

3. **空值处理**：空字符串返回 `0`。

4. **用途**：常用于处理 CSS 百分比值、进度值等场景。
