# removeClassToElement

从指定的 DOM 元素移除 CSS 类名。

## API

### removeClassToElement

#### Return

无返回值（`void`）

#### Parameters

| 参数          | 说明         | 类型      | 默认值 |
| ------------- | ------------ | --------- | ------ |
| `element`     | DOM 元素     | `Element` | 无     |
| `removeClass` | 要移除的类名 | `string`  | 无     |

## Example

### 基础用法

```js
import { removeClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
removeClassToElement(element, 'active');
// element 的 'active' 类已被移除
```

### 条件移除

```js
import { removeClassToElement } from 'ranuts';

const element = document.querySelector('.button');
if (shouldRemove) {
  removeClassToElement(element, 'highlighted');
}
```

### 服务端安全

```js
import { removeClassToElement } from 'ranuts';

// 在服务端环境中不会报错，会静默失败
removeClassToElement(element, 'class-name'); // 服务端：无操作
```

## 注意事项

1. **存在检查**：只有当元素存在该类名时才会移除。
2. **服务端安全**：在服务端环境（无 `document` 对象）时会静默处理，不会抛出错误。
3. **使用 classList**：使用现代的 `classList.remove()` API，比直接操作 `className` 更安全。
