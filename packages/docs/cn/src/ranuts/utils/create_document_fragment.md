# createDocumentFragment

创建一个 DocumentFragment 并添加多个子元素。

## API

### createDocumentFragment

#### Return

| 参数                            | 说明                  | 类型                            |
| ------------------------------- | --------------------- | ------------------------------- |
| `DocumentFragment \| undefined` | DocumentFragment 对象 | `DocumentFragment \| undefined` |

#### Parameters

| 参数   | 说明             | 类型        | 默认值 |
| ------ | ---------------- | ----------- | ------ |
| `list` | 要添加的元素数组 | `Element[]` | 无     |

## Example

### 基础用法

```js
import { createDocumentFragment } from 'ranuts';

const div1 = document.createElement('div');
const div2 = document.createElement('div');
const fragment = createDocumentFragment([div1, div2]);

// 一次性添加到 DOM
document.body.appendChild(fragment);
```

### 批量添加元素

```js
import { createDocumentFragment } from 'ranuts';

const elements = Array.from({ length: 100 }, () => {
  const div = document.createElement('div');
  div.textContent = 'Item';
  return div;
});

const fragment = createDocumentFragment(elements);
document.getElementById('container').appendChild(fragment);
```

### 服务端安全

```js
import { createDocumentFragment } from 'ranuts';

// 在服务端环境中返回 undefined
const fragment = createDocumentFragment([element]);
console.log(fragment); // undefined (服务端环境)
```

## 注意事项

1. **性能优化**：使用 DocumentFragment 可以避免多次 DOM 操作，提高性能。
2. **服务端安全**：在服务端环境（无 `document` 对象）时返回 `undefined`，不会抛出错误。
3. **一次性添加**：Fragment 添加到 DOM 后，其子元素会移动到目标元素中，Fragment 本身不会保留。
4. **用途**：常用于批量添加元素、减少重排重绘、提高性能等场景。
