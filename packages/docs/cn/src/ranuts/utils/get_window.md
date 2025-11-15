# getWindow

跨浏览器获取可视窗口大小。

## API

### getWindow

#### Return

| 参数          | 说明         | 类型          |
| ------------- | ------------ | ------------- |
| `ClientRatio` | 窗口尺寸对象 | `ClientRatio` |

#### ClientRatio

| 属性     | 说明             | 类型     |
| -------- | ---------------- | -------- |
| `width`  | 窗口宽度（像素） | `number` |
| `height` | 窗口高度（像素） | `number` |

#### Parameters

无参数

## Example

### 基础用法

```js
import { getWindow } from 'ranuts';

const windowSize = getWindow();
console.log('窗口宽度:', windowSize.width);
console.log('窗口高度:', windowSize.height);
```

### 响应式布局

```js
import { getWindow } from 'ranuts';

function handleResize() {
  const { width, height } = getWindow();
  if (width < 768) {
    // 移动端布局
  } else {
    // 桌面端布局
  }
}

window.addEventListener('resize', handleResize);
```

### 服务端安全

```js
import { getWindow } from 'ranuts';

// 在服务端环境中不会报错，返回 { width: 0, height: 0 }
const size = getWindow();
console.log(size); // { width: 0, height: 0 }
```

### 计算宽高比

```js
import { getWindow } from 'ranuts';

const { width, height } = getWindow();
const aspectRatio = width / height;
console.log('宽高比:', aspectRatio);
```

## 注意事项

1. **跨浏览器兼容**：使用 `window.innerWidth` 和 `window.innerHeight`，兼容所有现代浏览器。

2. **服务端安全**：在服务端环境（无 `window` 对象）时返回 `{ width: 0, height: 0 }`，不会抛出错误。

3. **实时性**：返回的是调用时的窗口大小，窗口大小改变后需要重新调用。

4. **用途**：常用于响应式布局、媒体查询、窗口大小监听等场景。
