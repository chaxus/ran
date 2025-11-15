# isClient

判断当前环境是否为客户端（浏览器）环境。

## API

### isClient

#### Return

| 参数      | 说明             | 类型      |
| --------- | ---------------- | --------- |
| `boolean` | 是否为客户端环境 | `boolean` |

#### Parameters

无参数

## Example

### 基础用法

```js
import { isClient } from 'ranuts';

if (isClient) {
  console.log('当前在浏览器环境中');
  // 可以使用 window、document 等浏览器 API
  window.localStorage.setItem('key', 'value');
} else {
  console.log('当前在服务端环境中');
}
```

### 条件执行

```js
import { isClient } from 'ranuts';

// 只在客户端执行
if (isClient) {
  document.addEventListener('click', handleClick);
}
```

### 服务端渲染安全

```js
import { isClient } from 'ranuts';

function getWindowSize() {
  if (isClient) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return { width: 0, height: 0 };
}
```

## 注意事项

1. **检测方式**：通过检查 `typeof window !== 'undefined'` 来判断。
2. **常量值**：`isClient` 是一个常量，不是函数，使用时不需要加括号。
3. **用途**：常用于区分客户端和服务端环境，避免在服务端使用浏览器 API 时报错。
