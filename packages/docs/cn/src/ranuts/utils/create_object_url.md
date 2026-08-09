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

## requestUrlToBuffer

通过 `XMLHttpRequest` 把一个 URL 拉取成原始字节——通常就是上面 `createObjectURL` 要吃的那份数据，当你需要在把它变成可展示的 URL 之前先检查或处理一下（比如校验魔数、解码音频）的时候会用到。

```js
import { requestUrlToBuffer, createObjectURL } from 'ranuts/utils';

const result = await requestUrlToBuffer('/assets/clip.webm', {});
if (result.success) {
  const url = await createObjectURL(new Blob([result.data]));
  video.src = url;
}
```

#### 参数

| 参数      | 说明                                                              | 类型                                     | 默认值 |
| --------- | ----------------------------------------------------------------- | ---------------------------------------- | ------ |
| `src`     | 要请求的 URL                                                      | `string`                                 | 必填   |
| `options` | `method`（默认 `'GET'`）和 `responseType`（默认 `'arraybuffer'`） | `Partial<RequestUrlToArraybufferOption>` | 必填   |

#### 返回

`Promise`，HTTP 200 时 resolve 为 `{ success: true, data, message: '' }`；其他情况**是 reject**，携带 `{ success: false, data: status, message }`——请求失败是一次 rejection，不是 resolve 出 `success: false`，所以只写 `.then()` 不写 `.catch()` 的话，失败会变成一个未处理的 rejection。

::: tip 新代码优先用 fetch
这个函数写在 `fetch` 还没普及之前，底层用的是 `XMLHttpRequest`。如果你不是特别需要 XHR 的特性（上传进度事件、`abort()`），`fetch(url).then(r => r.arrayBuffer())` 能做同样的事，而且失败时是 Promise 原生的 rejection 形态。
:::
