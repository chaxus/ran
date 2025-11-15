# setMime

设置或更新 MIME 类型映射。

## API

### setMime

#### Return

| 参数                  | 说明              | 类型                  |
| --------------------- | ----------------- | --------------------- |
| `Map<string, string>` | MIME 类型映射 Map | `Map<string, string>` |

#### Parameters

| 参数       | 说明       | 类型     | 默认值 |
| ---------- | ---------- | -------- | ------ |
| `ext`      | 文件扩展名 | `string` | 无     |
| `mimeType` | MIME 类型  | `string` | 无     |

## Example

### 基础用法

```js
import { setMime, getMime } from 'ranuts';

// 设置自定义 MIME 类型
setMime('.myext', 'application/x-my-custom-type');

// 获取 MIME 类型
const mime = getMime('.myext');
console.log(mime); // 'application/x-my-custom-type'
```

### 更新现有类型

```js
import { setMime, getMime } from 'ranuts';

// 更新 .js 的 MIME 类型
setMime('.js', 'application/javascript-custom');

const mime = getMime('script.js');
console.log(mime); // 'application/javascript-custom'
```

### 添加新类型

```js
import { setMime } from 'ranuts';

// 添加新的文件类型映射
setMime('.xyz', 'application/x-xyz-format');
```

## 注意事项

1. **全局影响**：设置后会影响全局的 MIME 类型映射，所有使用 `getMime` 的地方都会受到影响。
2. **覆盖行为**：如果扩展名已存在，会覆盖原有的 MIME 类型。
3. **返回值**：返回整个 MIME 类型 Map，可以继续操作。
4. **用途**：常用于添加自定义文件类型的 MIME 类型映射。
