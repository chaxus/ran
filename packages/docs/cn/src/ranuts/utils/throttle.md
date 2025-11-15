# throttle

节流函数，用于限制函数的执行频率。在指定的时间间隔内，函数最多执行一次。

## API

### throttle

#### Return

| 参数       | 说明         | 类型       |
| ---------- | ------------ | ---------- |
| `Function` | 节流后的函数 | `Function` |

#### Parameters

| 参数    | 说明             | 类型       | 默认值 |
| ------- | ---------------- | ---------- | ------ |
| `func`  | 需要节流的函数   | `Function` | 无     |
| `delay` | 时间间隔（毫秒） | `number`   | `300`  |

### generateThrottle

生成一个节流函数生成器，可以用于创建多个节流函数。

#### Return

| 参数       | 说明           | 类型       |
| ---------- | -------------- | ---------- |
| `Function` | 节流函数生成器 | `Function` |

## Example

### 基础用法

```js
import { throttle } from 'ranuts';

const handleScroll = throttle(() => {
  console.log('滚动事件');
}, 200);

// 在 200ms 内多次调用，只会执行一次
window.addEventListener('scroll', handleScroll);
```

### 按钮点击节流

```js
import { throttle } from 'ranuts';

const handleClick = throttle(() => {
  console.log('按钮被点击');
  // 执行提交逻辑
}, 1000);

document.getElementById('submit').addEventListener('click', handleClick);
```

### 使用 generateThrottle

```js
import { generateThrottle } from 'ranuts';

const throttleGenerator = generateThrottle();

const handleScroll = throttleGenerator(() => {
  console.log('滚动');
}, 200);

const handleResize = throttleGenerator(() => {
  console.log('调整大小');
}, 300);

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleResize);
```

### 鼠标移动节流

```js
import { throttle } from 'ranuts';

const handleMouseMove = throttle((e) => {
  console.log('鼠标位置:', e.clientX, e.clientY);
}, 100);

document.addEventListener('mousemove', handleMouseMove);
```

## 注意事项

1. **执行时机**：节流函数会在时间间隔的开始或结束时执行，确保在指定时间内至少执行一次。
2. **this 绑定**：节流函数会保持原函数的 `this` 上下文。
3. **参数传递**：节流函数会传递所有参数给原函数。
4. **与防抖的区别**：节流保证在指定时间内至少执行一次，而防抖只在最后一次调用后执行。
