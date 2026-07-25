# readFileAs*

`FileReader` 的 Promise 封装。

| 函数                              | resolve 结果  | 用途                                         |
| --------------------------------- | ------------- | -------------------------------------------- |
| `readFileAsArrayBuffer(blob)`     | `ArrayBuffer` | 二进制处理                                   |
| `readFileAsUint8Array(blob)`      | `Uint8Array`  | 喂给 `checkEncoding` / `arrayBufferToString` |
| `readFileAsText(blob, encoding?)` | `string`      | 文本文件；编码未知时应先嗅探                 |
| `readFileAsDataURL(blob)`         | `string`      | 图片预览                                     |

## 示例

```js
import { readFileAsUint8Array, arrayBufferToString } from 'ranuts';

input.addEventListener('change', async (e) => {
  const bytes = await readFileAsUint8Array(e.target.files[0]);
  const text = arrayBufferToString(bytes); // 自动嗅探编码，GBK/Big5 也能正确解
});
```

## 注意

1. **三条出口都接上了** —— `onload`、`onerror`、`onabort`。漏接 `onabort` 是让用户取消选择后
   promise 永远挂着的经典写法。
2. **`FileReader` 不存在时以明确的错误 reject**（Node、部分 worker 环境）。
3. **来源不明的文件不要直接 `new TextDecoder().decode()`** —— 那等于假定 UTF-8，会把 GBK/Big5
   解成乱码。用 `arrayBufferToString`，它会先嗅探。
