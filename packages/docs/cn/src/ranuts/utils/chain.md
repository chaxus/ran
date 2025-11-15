# Chain

链式调用的 DOM 操作类，支持创建元素、设置属性、添加事件监听等操作。

## API

### Chain

#### 构造函数

```typescript
new Chain(tagName: string, options?: ElementCreationOptions)
```

#### 主要方法

| 方法               | 说明                   | 返回值  |
| ------------------ | ---------------------- | ------- |
| `setAttribute`     | 设置元素属性           | `Chain` |
| `removeAttribute`  | 移除元素属性           | `Chain` |
| `append`           | 添加子元素             | `Chain` |
| `remove`           | 移除子元素             | `Chain` |
| `setTextContent`   | 设置文本内容           | `Chain` |
| `setStyle`         | 设置样式               | `Chain` |
| `addChild`         | 添加子元素（支持数组） | `Chain` |
| `listen`           | 添加事件监听           | `Chain` |
| `clearListener`    | 移除事件监听           | `Chain` |
| `clearAllListener` | 移除所有事件监听       | `Chain` |

#### 属性

| 属性      | 说明     | 类型          |
| --------- | -------- | ------------- |
| `element` | DOM 元素 | `HTMLElement` |

## Example

### 基础用法

```js
import { Chain } from 'ranuts';

const div = new Chain('div')
  .setAttribute('id', 'myDiv')
  .setAttribute('class', 'container')
  .setTextContent('Hello World')
  .setStyle('color', 'red');

document.body.appendChild(div.element);
```

### 链式操作

```js
import { Chain } from 'ranuts';

const button = new Chain('button')
  .setAttribute('type', 'button')
  .setTextContent('Click Me')
  .setStyle('padding', '10px')
  .setStyle('background', 'blue')
  .listen('click', () => {
    console.log('Button clicked');
  });

document.body.appendChild(button.element);
```

### 添加子元素

```js
import { Chain } from 'ranuts';

const container = new Chain('div')
  .addChild(new Chain('h1').setTextContent('Title'))
  .addChild(new Chain('p').setTextContent('Content'));

document.body.appendChild(container.element);
```

### 批量添加子元素

```js
import { Chain } from 'ranuts';

const list = new Chain('ul').addChild([
  new Chain('li').setTextContent('Item 1'),
  new Chain('li').setTextContent('Item 2'),
  new Chain('li').setTextContent('Item 3'),
]);

document.body.appendChild(list.element);
```

### SVG 元素

```js
import { Chain } from 'ranuts';

const svg = new Chain('svg').setAttribute('width', '100').setAttribute('height', '100');

const circle = new Chain('circle').setAttribute('cx', '50').setAttribute('cy', '50').setAttribute('r', '40');

svg.addChild(circle);
```

## 注意事项

1. **链式调用**：所有方法都返回 `Chain` 实例，支持链式调用。
2. **SVG 支持**：自动识别 SVG 标签，使用正确的命名空间创建。
3. **事件管理**：内部维护事件监听器映射，便于管理和移除。
4. **用途**：常用于动态创建 DOM 结构、构建 UI 组件等场景。
