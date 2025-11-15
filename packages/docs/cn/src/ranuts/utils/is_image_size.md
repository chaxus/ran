# isImageSize

校验图片文件的尺寸是否符合指定要求。

## API

### isImageSize

#### Return

| 参数               | 说明                                | 类型      |
| ------------------ | ----------------------------------- | --------- |
| `Promise<boolean>` | Promise，解析后返回是否符合尺寸要求 | `Promise` |

#### Parameters

| 参数     | 说明               | 类型     | 默认值 |
| -------- | ------------------ | -------- | ------ |
| `file`   | 图片文件对象       | `File`   | 无     |
| `width`  | 期望的宽度（可选） | `number` | 无     |
| `height` | 期望的高度（可选） | `number` | 无     |

## Example

### 基础用法

```js
import { isImageSize } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      // 检查宽度是否为 800
      const isValid = await isImageSize(file, 800);
      if (isValid) {
        console.log('图片宽度符合要求');
      } else {
        console.log('图片宽度不符合要求');
      }
    } catch (error) {
      console.error('检查失败:', error);
    }
  }
});
```

### 检查宽度和高度

```js
import { isImageSize } from 'ranuts';

async function validateImage(file) {
  // 检查是否为 800x600
  const isValid = await isImageSize(file, 800, 600);
  return isValid;
}
```

### 只检查高度

```js
import { isImageSize } from 'ranuts';

const isValid = await isImageSize(file, undefined, 600);
// 只检查高度是否为 600
```

### 文件上传验证

```js
import { isImageSize } from 'ranuts';

async function handleFileUpload(file) {
  const isValid = await isImageSize(file, 1920, 1080);
  if (!isValid) {
    alert('图片尺寸必须是 1920x1080');
    return;
  }
  // 继续上传
}
```

## 注意事项

1. **异步操作**：返回 Promise，需要使用 `await` 或 `.then()` 处理。

2. **参数说明**：
   - 如果只提供 `width`，只检查宽度
   - 如果只提供 `height`，只检查高度
   - 如果两者都提供，需要同时匹配

3. **服务端环境**：在服务端环境（无 `window` 对象）时会 reject。

4. **内存清理**：函数内部会自动清理创建的 Object URL，无需手动处理。

5. **用途**：常用于文件上传前的尺寸验证、头像尺寸检查等场景。
