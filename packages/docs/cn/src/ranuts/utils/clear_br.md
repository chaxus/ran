# clearBr

清除字符串中的空格、HTML 标签和换行符。

## API

### clearBr

#### Return

| 参数     | 说明           | 类型     |
| -------- | -------------- | -------- |
| `string` | 清理后的字符串 | `string` |

#### Parameters

| 参数  | 说明           | 类型     | 默认值 |
| ----- | -------------- | -------- | ------ |
| `str` | 要清理的字符串 | `string` | `''`   |

## Example

### 基础用法

```js
import { clearBr } from 'ranuts';

const text = '  <p>Hello\nWorld</p>  ';
const cleaned = clearBr(text);
console.log(cleaned); // 'HelloWorld'
```

### 清理 HTML 内容

```js
import { clearBr } from 'ranuts';

const html = '<div>这是<strong>测试</strong>内容</div>\n换行';
const cleaned = clearBr(html);
console.log(cleaned); // '这是测试内容换行'
```

### 处理空字符串

```js
import { clearBr } from 'ranuts';

console.log(clearBr('')); // '' (空字符串)
console.log(clearBr()); // '' (空字符串)
```

## 注意事项

1. **清理内容**：会移除所有空格、HTML 标签和换行符（`\r\n`）。
2. **空字符串处理**：如果输入为空字符串，直接返回空字符串。
3. **用途**：常用于提取纯文本内容，去除格式标记。
