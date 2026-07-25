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

## 行为

1. 同时传 `width` 与 `height` 时**必须同时满足**；两者都不传则只校验文件能否解码为图片。
2. **解码失败会 reject**（损坏文件、非图片），而不是让 promise 永远挂着。
3. **无论成功失败都会 revoke object URL**，批量校验时不会泄漏 blob URL 到页面卸载。
4. **仅浏览器可用** —— SSR 下会以明确的错误 reject。

::: warning 0.3 已修复
此前后一个条件会整个覆盖前一个，同时传 `width` 和 `height` 时宽度被静默忽略；没有 `onerror`，
损坏文件会让 promise 永远挂起；SSR 分支里 `reject` 之后没有 `return`，继续访问 `window`
直接抛 `ReferenceError`。
:::

## 注意事项

1. **异步操作**：返回 Promise，需要使用 `await` 或 `.then()` 处理。

2. **参数说明**：
   - 如果只提供 `width`，只检查宽度
   - 如果只提供 `height`，只检查高度
   - 如果两者都提供，需要同时匹配

3. **服务端环境**：在服务端环境（无 `window` 对象）时会 reject。

4. **内存清理**：函数内部会自动清理创建的 Object URL，无需手动处理。

5. **用途**：常用于文件上传前的尺寸验证、头像尺寸检查等场景。
