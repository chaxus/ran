# addNumSym

给数字添加正负号（+ 或 -）。

## API

### addNumSym

#### Return

| 参数     | 说明               | 类型     |
| -------- | ------------------ | -------- |
| `string` | 带符号的数字字符串 | `string` |

#### Parameters

| 参数    | 说明                               | 类型               | 默认值 |
| ------- | ---------------------------------- | ------------------ | ------ |
| `value` | 要处理的数字或字符串               | `string \| number` | 无     |
| `flag`  | 符号标志（可选，用于强制指定符号） | `string \| number` | 无     |

## Example

### 基础用法

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100)); // '+100'
console.log(addNumSym(-50)); // '-50'
console.log(addNumSym(0)); // '0'
```

### 字符串输入

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('100')); // '+100'
console.log(addNumSym('-50')); // '-50' (已有符号，保持不变)
```

### 强制指定符号

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100, 1)); // '+100' (flag > 0)
console.log(addNumSym(100, -1)); // '100' (flag <= 0，不添加 +)
console.log(addNumSym(100, 0)); // '100'
```

### 已有符号处理

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('+100')); // '+100' (已有符号，保持不变)
console.log(addNumSym('-50')); // '-50' (已有符号，保持不变)
```

## 注意事项

1. **符号规则**：
   - 正数自动添加 `+` 号
   - 负数保持 `-` 号
   - 零不添加符号

2. **已有符号**：如果字符串已以 `+` 或 `-` 开头，不会重复添加。

3. **强制标志**：通过 `flag` 参数可以强制控制是否添加 `+` 号（`flag > 0` 时添加）。

4. **用途**：常用于显示涨跌幅、变化量等需要明确显示正负的场景。
