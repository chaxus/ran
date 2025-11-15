# addClassToElement

给指定的 DOM 元素添加 CSS 类名。

## API

### addClassToElement

#### Return

无返回值（`void`）

#### Parameters

| 参数       | 说明         | 类型      | 默认值 |
| ---------- | ------------ | --------- | ------ |
| `element`  | DOM 元素     | `Element` | 无     |
| `addClass` | 要添加的类名 | `string`  | 无     |

## Example

### 基础用法

```js
import { addClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
addClassToElement(element, 'active');
// element 现在有 'active' 类
```

### 避免重复添加

```js
import { addClassToElement } from 'ranuts';

const element = document.querySelector('.button');
addClassToElement(element, 'highlighted');
addClassToElement(element, 'highlighted'); // 不会重复添加
```

### 服务端安全

```js
import { addClassToElement } from 'ranuts';

// 在服务端环境中不会报错，会静默失败
addClassToElement(element, 'class-name'); // 服务端：无操作
```

## 注意事项

1. **重复检查**：如果元素已经有该类名，不会重复添加。
2. **服务端安全**：在服务端环境（无 `document` 对象）时会静默处理，不会抛出错误。
3. **使用 classList**：使用现代的 `classList.add()` API，比直接操作 `className` 更安全。
