# performanceTime

获取高精度时间戳，支持浏览器和 Node.js 环境。

## API

### performanceTime

#### Return

| 参数     | 说明                 | 类型     |
| -------- | -------------------- | -------- |
| `number` | 高精度时间戳（毫秒） | `number` |

#### Parameters

无参数

## Example

### 基础用法

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// 执行一些操作
const end = performanceTime();
console.log(`耗时: ${end - start} 毫秒`);
```

### 性能测量

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// 执行耗时操作
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}
const end = performanceTime();
console.log(`操作耗时: ${end - start} 毫秒`);
```

### 函数执行时间

```js
import { performanceTime } from 'ranuts';

function expensiveFunction() {
  // 复杂计算
  return Math.random() * 1000;
}

const start = performanceTime();
const result = expensiveFunction();
const end = performanceTime();
console.log(`结果: ${result}, 耗时: ${end - start} 毫秒`);
```

## 注意事项

1. **环境支持**：
   - 浏览器环境：使用 `performance.now()`
   - Node.js 环境：使用 `process.hrtime()`
   - 其他环境：回退到 `Date.now()`

2. **精度**：`performance.now()` 和 `process.hrtime()` 提供微秒级精度，比 `Date.now()` 更精确。

3. **相对时间**：返回的时间戳是相对时间，适合测量时间差，不适合作为绝对时间使用。

4. **单位**：返回值单位为毫秒。
