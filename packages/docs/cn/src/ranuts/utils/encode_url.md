# encodeUrl

安全地编码 URL，排除已编码的序列，处理未匹配的代理对。

## API

### encodeUrl

#### Return

| 参数     | 说明         | 类型     |
| -------- | ------------ | -------- |
| `string` | 编码后的 URL | `string` |

#### Parameters

| 参数  | 说明         | 类型     | 默认值 |
| ----- | ------------ | -------- | ------ |
| `url` | 要编码的 URL | `string` | 无     |

## Example

### 基础用法

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/path with spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### 处理已编码的 URL

```js
import { encodeUrl } from 'ranuts';

// 已编码的部分不会被重复编码
const url = 'https://example.com/path%20with%20spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### 处理特殊字符

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/search?q=hello world&lang=zh-CN';
const encoded = encodeUrl(url);
console.log(encoded); // 编码后的 URL
```

### 处理无效编码

```js
import { encodeUrl } from 'ranuts';

// 无效的编码序列（如 %foo）会被重新编码
const url = 'https://example.com/path%foo';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%25foo'
```

## 注意事项

1. **智能编码**：只编码未编码的部分，已编码的序列（如 `%20`）保持不变。
2. **代理对处理**：自动处理未匹配的代理对，替换为 Unicode 替换字符。
3. **安全性**：不会抛出错误，会尽可能正确地编码 URL。
4. **用途**：常用于处理用户输入的 URL、构建安全的 URL 等场景。
