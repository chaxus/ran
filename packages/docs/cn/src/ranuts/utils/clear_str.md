# clearStr

去除字符串首尾的空格、URL 编码和引号。

## API

### clearStr

#### Return

| 参数     | 说明           | 类型     |
| -------- | -------------- | -------- |
| `string` | 清理后的字符串 | `string` |

#### Parameters

| 参数      | 说明           | 类型             | 默认值 |
| --------- | -------------- | ---------------- | ------ |
| `str`     | 要清理的字符串 | `string`         | 无     |
| `options` | 配置选项       | `ClearStrOption` | `{}`   |

#### Options

| 参数         | 说明              | 类型      | 默认值 |
| ------------ | ----------------- | --------- | ------ |
| `urlencoded` | 是否进行 URL 解码 | `boolean` | `true` |

## Example

### 基础用法

```js
import { clearStr } from 'ranuts';

const str = '  "hello world"  ';
const cleaned = clearStr(str);
console.log(cleaned); // 'hello world'
```

### URL 编码字符串

```js
import { clearStr } from 'ranuts';

const encoded = '  "hello%20world"  ';
const cleaned = clearStr(encoded);
console.log(cleaned); // 'hello world' (自动解码)
```

### 禁用 URL 解码

```js
import { clearStr } from 'ranuts';

const str = '  "hello%20world"  ';
const cleaned = clearStr(str, { urlencoded: false });
console.log(cleaned); // 'hello%20world' (不解码)
```

### 处理引号

```js
import { clearStr } from 'ranuts';

const str1 = "'test'";
const str2 = '"test"';
console.log(clearStr(str1)); // 'test'
console.log(clearStr(str2)); // 'test'
```

## 注意事项

1. **清理内容**：会移除首尾空格、单引号和双引号。
2. **URL 解码**：默认会进行 URL 解码，可通过 `urlencoded: false` 禁用。
3. **用途**：常用于清理用户输入或从 URL 参数中提取的值。
