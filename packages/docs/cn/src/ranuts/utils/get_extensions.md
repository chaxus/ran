# getExtensions

根据 MIME 类型获取对应的文件扩展名数组。

## API

### getExtensions

#### Return

| 参数    | 说明                       | 类型       |
| ------- | -------------------------- | ---------- |
| `Array` | 文件扩展名数组（不含点号） | `string[]` |

#### Parameters

| 参数       | 说明      | 类型     | 默认值 |
| ---------- | --------- | -------- | ------ |
| `mimeType` | MIME 类型 | `string` | 无     |

## Example

### 基础用法

```js
import { getExtensions } from 'ranuts';

const exts = getExtensions('image/jpeg');
console.log(exts); // ['jpeg', 'jpg', 'jpe']
```

### 获取所有扩展名

```js
import { getExtensions } from 'ranuts';

const jsExts = getExtensions('application/javascript');
console.log(jsExts); // ['js', 'jsx', 'ts', 'tsx']
```

### 文件类型验证

```js
import { getExtensions } from 'ranuts';

function isValidImageFile(filename, mimeType) {
  const exts = getExtensions(mimeType);
  const fileExt = filename.split('.').pop();
  return exts.includes(fileExt);
}

console.log(isValidImageFile('photo.jpg', 'image/jpeg')); // true
```

## 注意事项

1. **返回格式**：返回的扩展名不包含点号（`.`），如 `'jpg'` 而不是 `'.jpg'`。
2. **多个扩展名**：一个 MIME 类型可能对应多个扩展名，返回所有匹配的扩展名。
3. **空数组**：如果 MIME 类型不存在，返回空数组。
4. **用途**：常用于文件类型验证、文件上传检查等场景。
