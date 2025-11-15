# checkEncoding

检测 Uint8Array 数据的字符编码。

## API

### checkEncoding

#### Return

| 参数     | 说明             | 类型     |
| -------- | ---------------- | -------- |
| `string` | 检测到的编码类型 | `string` |

#### Parameters

| 参数         | 说明         | 类型         | 默认值 |
| ------------ | ------------ | ------------ | ------ |
| `uint8Array` | 要检测的数据 | `Uint8Array` | 无     |

## Example

### 基础用法

```js
import { checkEncoding } from 'ranuts';

const data = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
const encoding = checkEncoding(data);
console.log(encoding); // 'UTF-8' 或其他检测到的编码
```

### 检测文件编码

```js
import { checkEncoding } from 'ranuts';

async function detectFileEncoding(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const encoding = checkEncoding(uint8Array);
  return encoding;
}
```

### 文本解码

```js
import { checkEncoding } from 'ranuts';

function decodeText(uint8Array) {
  const encoding = checkEncoding(uint8Array);
  const decoder = new TextDecoder(encoding);
  return decoder.decode(uint8Array);
}
```

## 注意事项

1. **依赖库**：使用 `jschardet` 库进行编码检测。
2. **默认编码**：如果检测失败，默认返回 `'utf-8'`。
3. **准确性**：编码检测不是 100% 准确，特别是对于短文本。
4. **用途**：常用于文件处理、文本解码、字符编码转换等场景。
