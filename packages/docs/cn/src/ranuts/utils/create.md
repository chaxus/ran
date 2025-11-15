# create

创建 DOM 元素的辅助函数，支持 HTML 和 SVG 元素。

## API

### create

#### Return

| 参数          | 说明            | 类型          |
| ------------- | --------------- | ------------- |
| `HTMLElement` | 创建的 DOM 元素 | `HTMLElement` |

#### Parameters

| 参数      | 说明             | 类型                     | 默认值 |
| --------- | ---------------- | ------------------------ | ------ |
| `tagName` | 标签名           | `string`                 | 无     |
| `options` | 创建选项（可选） | `ElementCreationOptions` | 无     |

## Example

### 基础用法

```js
import { create } from 'ranuts';

const div = create('div');
div.textContent = 'Hello World';
document.body.appendChild(div);
```

### 创建 SVG 元素

```js
import { create } from 'ranuts';

const svg = create('svg');
svg.setAttribute('width', '100');
svg.setAttribute('height', '100');

const circle = create('circle');
circle.setAttribute('cx', '50');
circle.setAttribute('cy', '50');
circle.setAttribute('r', '40');
svg.appendChild(circle);
```

### 使用创建选项

```js
import { create } from 'ranuts';

// 创建自定义元素
const customElement = create('my-custom-element', { is: 'my-element' });
```

## 注意事项

1. **自动识别**：自动识别 SVG 标签，使用正确的命名空间创建。
2. **HTML 元素**：普通 HTML 元素使用 `document.createElement` 创建。
3. **SVG 元素**：SVG 元素使用 `document.createElementNS` 创建。
4. **用途**：常用于需要创建 SVG 元素的场景，简化创建过程。
