# memoize

记忆化函数，用于缓存函数执行结果。函数执行一次后，后续调用会直接返回缓存的结果，无需重新执行。

## API

### memoize

#### Return

| 参数       | 说明           | 类型       |
| ---------- | -------------- | ---------- |
| `Function` | 记忆化后的函数 | `Function` |

#### Parameters

| 参数 | 说明                 | 类型              | 默认值 |
| ---- | -------------------- | ----------------- | ------ |
| `fn` | 需要记忆化的函数或值 | `Function \| any` | 无     |

## Example

### 基础用法

```js
import { memoize } from 'ranuts';

const expensiveFunction = () => {
  console.log('执行计算');
  return Math.random() * 100;
};

const memoizedFn = memoize(expensiveFunction);

console.log(memoizedFn()); // 执行计算，返回随机值
console.log(memoizedFn()); // 直接返回缓存的结果，不执行计算
console.log(memoizedFn()); // 直接返回缓存的结果，不执行计算
```

### 缓存值

```js
import { memoize } from 'ranuts';

const value = { data: 'test' };
const memoizedValue = memoize(value);

console.log(memoizedValue()); // 返回 { data: 'test' }
console.log(memoizedValue()); // 返回相同的值
```

### 复杂计算缓存

```js
import { memoize } from 'ranuts';

const calculateSum = (numbers) => {
  console.log('计算中...');
  return numbers.reduce((sum, num) => sum + num, 0);
};

const memoizedCalculate = memoize(calculateSum);

// 注意：由于参数处理方式，这种方式可能不会按预期工作
// 建议用于无参数或固定参数的函数
```

## 注意事项

1. **单次缓存**：函数只执行一次，后续调用都返回第一次的结果。
2. **参数处理**：当前实现会传递参数，但缓存机制基于单次执行，参数变化不会触发重新计算。
3. **内存清理**：执行后会清理原始函数引用，释放内存。
4. **适用场景**：适用于初始化函数、单例模式、或只需要执行一次的昂贵计算。
