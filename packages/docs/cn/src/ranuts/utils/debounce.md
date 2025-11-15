# debounce

防抖函数，用于限制函数的执行频率。在指定的时间间隔内，如果函数被多次调用，只有最后一次调用会在延迟时间后执行。

## API

### debounce

#### Return

| 参数       | 说明         | 类型       |
| ---------- | ------------ | ---------- |
| `Function` | 防抖后的函数 | `Function` |

#### Parameters

| 参数 | 说明             | 类型       | 默认值 |
| ---- | ---------------- | ---------- | ------ |
| `fn` | 需要防抖的函数   | `Function` | 无     |
| `ms` | 延迟时间（毫秒） | `number`   | `500`  |

## Example

### 基础用法

```js
import { debounce } from 'ranuts';

const handleSearch = debounce((keyword) => {
  console.log('搜索:', keyword);
}, 300);

// 快速连续调用，只会在最后一次调用后 300ms 执行
handleSearch('a');
handleSearch('ab');
handleSearch('abc'); // 只有这次会执行
```

### 搜索框防抖

```js
import { debounce } from 'ranuts';

const searchInput = document.getElementById('search');
const handleSearch = debounce((e) => {
  const keyword = e.target.value;
  // 执行搜索逻辑
  console.log('搜索关键词:', keyword);
}, 500);

searchInput.addEventListener('input', handleSearch);
```

### 窗口 resize 防抖

```js
import { debounce } from 'ranuts';

const handleResize = debounce(() => {
  console.log('窗口大小改变');
  // 执行布局调整逻辑
}, 200);

window.addEventListener('resize', handleResize);
```

## 注意事项

1. **this 绑定**：防抖函数会保持原函数的 `this` 上下文。
2. **参数传递**：防抖函数会传递所有参数给原函数。
3. **取消执行**：如果需要取消待执行的函数，需要保存返回的函数引用，但当前实现不支持取消。
