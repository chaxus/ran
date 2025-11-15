# transformText

将 ArrayBuffer 转换为文本，自动检测编码并解码。

## API

### transformText

#### Return

| 参数                         | 说明                     | 类型                         |
| ---------------------------- | ------------------------ | ---------------------------- |
| `TransformText \| undefined` | 转换结果对象或 undefined | `TransformText \| undefined` |

#### TransformText

| 属性       | 说明         | 类型     |
| ---------- | ------------ | -------- |
| `encoding` | 检测到的编码 | `string` |
| `content`  | 解码后的文本 | `string` |

#### Parameters

| 参数      | 说明         | 类型                    | 默认值 |
| --------- | ------------ | ----------------------- | ------ |
| `content` | 要转换的内容 | `string \| ArrayBuffer` | 无     |

## Example

### 基础用法

```js
import { transformText } from 'ranuts';

const arrayBuffer = new TextEncoder().encode('Hello World').buffer;
const result = transformText(arrayBuffer);
if (result) {
  console.log('编码:', result.encoding);
  console.log('内容:', result.content); // 'Hello World'
}
```

### 处理文件

```js
import { transformText } from 'ranuts';

async function readTextFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = transformText(arrayBuffer);
  if (result) {
    return result.content;
  }
  return null;
}
```

### 自动编码检测

```js
import { transformText } from 'ranuts';

// 自动检测编码并解码
const result = transformText(arrayBuffer);
if (result) {
  console.log(`使用 ${result.encoding} 编码解码成功`);
  console.log(result.content);
}
```

## 注意事项

1. **自动检测**：使用 `jschardet` 自动检测编码类型。
2. **仅支持 ArrayBuffer**：目前只支持 `ArrayBuffer` 类型，字符串类型会输出警告。
3. **返回条件**：只有在检测到编码且成功解码时才返回结果，否则返回 `undefined`。
4. **用途**：常用于文件读取、文本解码、编码转换等场景。
