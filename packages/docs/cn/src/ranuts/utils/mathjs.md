# mathjs

精确的数字运算函数，解决 JavaScript 浮点数精度问题，支持链式调用。

## API

### mathjs

#### Return

| 参数                  | 说明         | 类型                                 |
| --------------------- | ------------ | ------------------------------------ |
| `ComputeNumberResult` | 计算结果对象 | `{ result: number, next: Function }` |

#### Parameters

| 参数   | 说明                           | 类型     | 默认值 |
| ------ | ------------------------------ | -------- | ------ |
| `a`    | 第一个数字                     | `number` | 无     |
| `type` | 运算类型（`+`, `-`, `*`, `/`） | `string` | 无     |
| `b`    | 第二个数字                     | `number` | 无     |

#### ComputeNumberResult

| 属性     | 说明           | 类型       |
| -------- | -------------- | ---------- |
| `result` | 计算结果       | `number`   |
| `next`   | 继续计算的函数 | `Function` |

## Example

### 基础用法

```js
import { mathjs } from 'ranuts';

const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3 (精确结果，而不是 0.30000000000000004)
```

### 链式调用

```js
import { mathjs } from 'ranuts';

const result = mathjs(1.3, '-', 1.2).next('+', 1.5).next('*', 2.3).next('/', 0.2);
console.log(result.result); // 精确计算结果
```

### 解决精度问题

```js
import { mathjs } from 'ranuts';

// JavaScript 原生计算会有精度问题
console.log(0.1 + 0.2); // 0.30000000000000004

// 使用 mathjs 得到精确结果
const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3
```

### 复杂计算

```js
import { mathjs } from 'ranuts';

const total = mathjs(100, '*', 0.1).next('+', 50).next('-', 20).next('/', 2);
console.log(total.result); // 精确计算结果
```

## 注意事项

1. **精度处理**：自动处理浮点数精度问题，避免 `0.1 + 0.2 !== 0.3` 的问题。
2. **链式调用**：支持通过 `next` 方法进行链式计算。
3. **运算类型**：支持 `+`（加）、`-`（减）、`*`（乘）、`/`（除）四种运算。
4. **性能**：相比原生运算稍慢，但能保证精度。
