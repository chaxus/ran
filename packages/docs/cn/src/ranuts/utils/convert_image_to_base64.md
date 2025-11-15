# convertImageToBase64

将图片文件转换为 Base64 编码字符串。

## API

### convertImageToBase64

#### Return

| 参数                                  | 说明                        | 类型      |
| ------------------------------------- | --------------------------- | --------- |
| `Promise<convertImageToBase64Return>` | Promise，解析后返回结果对象 | `Promise` |

#### convertImageToBase64Return

| 属性      | 说明        | 类型                            |
| --------- | ----------- | ------------------------------- |
| `success` | 是否成功    | `boolean`                       |
| `data`    | Base64 数据 | `string \| ArrayBuffer \| null` |
| `message` | 错误信息    | `string`                        |

#### Parameters

| 参数   | 说明         | 类型   | 默认值 |
| ------ | ------------ | ------ | ------ |
| `file` | 图片文件对象 | `File` | 无     |

## Example

### 基础用法

```js
import { convertImageToBase64 } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await convertImageToBase64(file);
      if (result.success) {
        console.log('Base64:', result.data);
        // 可以直接用于 img src
        document.getElementById('preview').src = result.data;
      }
    } catch (error) {
      console.error('转换失败:', error);
    }
  }
});
```

### 上传前预览

```js
import { convertImageToBase64 } from 'ranuts';

async function previewImage(file) {
  const result = await convertImageToBase64(file);
  if (result.success) {
    return result.data; // data:image/jpeg;base64,...
  }
  throw new Error('图片转换失败');
}
```

### 错误处理

```js
import { convertImageToBase64 } from 'ranuts';

try {
  const result = await convertImageToBase64(file);
  if (!result.success) {
    console.error('错误:', result.message);
  }
} catch (error) {
  console.error('异常:', error);
}
```

## 注意事项

1. **异步操作**：返回 Promise，需要使用 `await` 或 `.then()` 处理。

2. **文件类型**：支持所有浏览器支持的图片格式（JPEG、PNG、GIF、WebP 等）。

3. **数据格式**：返回的 `data` 是完整的 Data URL 格式（如 `data:image/jpeg;base64,...`），可以直接用于 `img` 标签的 `src` 属性。

4. **错误处理**：转换失败时会在 Promise 中 reject，需要捕获错误。

5. **用途**：常用于图片预览、上传前处理、本地存储等场景。
