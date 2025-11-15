# escapeHtml

转义 HTML 特殊字符，防止 XSS 攻击。

## API

### escapeHtml

#### Return

| 参数     | 说明           | 类型     |
| -------- | -------------- | -------- |
| `string` | 转义后的字符串 | `string` |

#### Parameters

| 参数     | 说明           | 类型                       | 默认值 |
| -------- | -------------- | -------------------------- | ------ |
| `string` | 要转义的字符串 | `string \| number \| null` | 无     |

## Example

### 基础用法

```js
import { escapeHtml } from 'ranuts';

const html = '<script>alert("XSS")</script>';
const escaped = escapeHtml(html);
console.log(escaped); // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

### 转义特殊字符

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml('"hello"')); // '&quot;hello&quot;'
console.log(escapeHtml("'world'")); // '&#39;world&#39;'
console.log(escapeHtml('a & b')); // 'a &amp; b'
console.log(escapeHtml('<div>')); // '&lt;div&gt;'
```

### 处理数字和 null

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml(123)); // '123'
console.log(escapeHtml(null)); // 'null'
```

### 防止 XSS 攻击

```js
import { escapeHtml } from 'ranuts';

const userInput = '<img src=x onerror=alert(1)>';
const safe = escapeHtml(userInput);
document.getElementById('content').textContent = safe;
// 安全显示，不会执行脚本
```

## 注意事项

1. **转义字符**：转义以下字符：
   - `"` → `&quot;`
   - `'` → `&#39;`
   - `&` → `&amp;`
   - `<` → `&lt;`
   - `>` → `&gt;`

2. **类型转换**：非字符串类型会先转换为字符串再转义。

3. **安全性**：用于防止 XSS 攻击，在显示用户输入内容时应该使用此函数。

4. **性能**：对于不包含特殊字符的字符串，会直接返回原字符串。
