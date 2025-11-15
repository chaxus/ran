# isString

判断一个值是否为字符串类型。

## API

### isString

#### Return

| 参数      | 说明         | 类型      |
| --------- | ------------ | --------- |
| `boolean` | 是否为字符串 | `boolean` |

#### Parameters

| 参数  | 说明       | 类型      | 默认值 |
| ----- | ---------- | --------- | ------ |
| `obj` | 要判断的值 | `unknown` | 无     |

## Example

### 基础用法

```js
import { isString } from 'ranuts';

console.log(isString('hello')); // true
console.log(isString(123)); // false
console.log(isString(null)); // false
console.log(isString(undefined)); // false
```

### 类型检查

```js
import { isString } from 'ranuts';

function processValue(value) {
  if (isString(value)) {
    console.log('是字符串:', value.toUpperCase());
  } else {
    console.log('不是字符串');
  }
}

processValue('hello'); // '是字符串: HELLO'
processValue(123); // '不是字符串'
```

### 参数验证

```js
import { isString } from 'ranuts';

function validateInput(input) {
  if (!isString(input)) {
    throw new Error('输入必须是字符串');
  }
  return input.trim();
}
```

## 注意事项

1. **类型检测**：使用 `Object.prototype.toString.call()` 进行精确的类型检测。
2. **严格性**：只返回 `true` 当值为真正的字符串类型，其他类型（包括字符串对象）返回 `false`。
3. **用途**：常用于类型检查、参数验证等场景。
