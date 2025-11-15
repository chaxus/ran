# scriptOnLoad

动态插入 script 或 link 标签，并等待所有资源加载完成。

## API

### scriptOnLoad

#### Return

| 参数            | 说明                            | 类型      |
| --------------- | ------------------------------- | --------- |
| `Promise<void>` | Promise，所有资源加载完成后解析 | `Promise` |

#### Parameters

| 参数       | 说明                             | 类型          | 默认值 |
| ---------- | -------------------------------- | ------------- | ------ |
| `urls`     | 资源 URL 数组                    | `string[]`    | 无     |
| `append`   | 插入的父元素（可选）             | `HTMLElement` | `body` |
| `callback` | 所有资源加载完成后的回调（可选） | `Function`    | 无     |

## Example

### 基础用法

```js
import { scriptOnLoad } from 'ranuts';

// 加载单个脚本
await scriptOnLoad(['https://example.com/script.js']);
console.log('脚本加载完成');
```

### 加载多个资源

```js
import { scriptOnLoad } from 'ranuts';

// 同时加载多个脚本和样式
await scriptOnLoad([
  'https://example.com/script1.js',
  'https://example.com/script2.js',
  'https://example.com/style.css',
]);
console.log('所有资源加载完成');
```

### 使用回调

```js
import { scriptOnLoad } from 'ranuts';

scriptOnLoad(['https://example.com/library.js'], document.body, () => {
  console.log('资源加载完成，可以开始使用');
});
```

### 动态加载第三方库

```js
import { scriptOnLoad } from 'ranuts';

async function loadLibrary() {
  await scriptOnLoad(['https://cdn.example.com/library.js']);
  // 库已加载，可以使用
  window.Library.init();
}
```

## 注意事项

1. **自动识别类型**：根据 URL 后缀（`.css`）自动识别是样式文件还是脚本文件。
2. **并行加载**：所有资源会并行加载，等待所有资源加载完成后才 resolve。
3. **插入位置**：默认插入到 `body` 元素，可以指定其他父元素。
4. **Promise 和回调**：既支持 Promise，也支持回调函数，可以同时使用。
