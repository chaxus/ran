# createObjectURL

从 Blob、ArrayBuffer 或 Response 创建对象 URL。

## API

### createObjectURL

#### Return

| 参数              | 说明                        | 类型      |
| ----------------- | --------------------------- | --------- |
| `Promise<string>` | Promise，解析后返回对象 URL | `Promise` |

#### Parameters

| 参数  | 说明   | 类型                                        | 默认值 |
| ----- | ------ | ------------------------------------------- | ------ |
| `src` | 数据源 | `Blob \| ArrayBuffer \| Response \| string` | 无     |

## Example

### 基础用法（Blob）

```js
import { createObjectURL } from 'ranuts';

const blob = new Blob(['Hello World'], { type: 'text/plain' });
const url = await createObjectURL(blob);
console.log(url); // 'blob:http://example.com/...'
```

### 从 ArrayBuffer 创建

```js
import { createObjectURL } from 'ranuts';

const buffer = new ArrayBuffer(8);
const url = await createObjectURL(buffer);
console.log(url); // 'blob:http://example.com/...'
```

### 从 Response 创建

```js
import { createObjectURL } from 'ranuts';

const response = await fetch('https://example.com/image.jpg');
const url = await createObjectURL(response);
console.log(url); // 'blob:http://example.com/...'
```

### 处理字符串

```js
import { createObjectURL } from 'ranuts';

// 如果传入字符串，直接返回
const url = await createObjectURL('https://example.com/image.jpg');
console.log(url); // 'https://example.com/image.jpg'
```

### 图片预览

```js
import { createObjectURL } from 'ranuts';

async function previewImage(file) {
  const url = await createObjectURL(file);
  document.getElementById('preview').src = url;
}
```

## 注意事项

1. **异步操作**：返回 Promise，需要使用 `await` 或 `.then()` 处理。
2. **类型支持**：支持 Blob、ArrayBuffer、Response 和字符串类型。
3. **内存管理**：创建的 URL 需要手动调用 `URL.revokeObjectURL()` 释放内存。
4. **用途**：常用于文件预览、临时 URL 生成、图片处理等场景。
