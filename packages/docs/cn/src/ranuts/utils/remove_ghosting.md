# removeGhosting

移除拖拽事件的阴影（ghost image），创建透明的拖拽图标。

## API

### removeGhosting

#### Return

无返回值（`void`）

#### Parameters

| 参数    | 说明         | 类型        | 默认值 |
| ------- | ------------ | ----------- | ------ |
| `event` | 拖拽事件对象 | `DragEvent` | 无     |

## Example

### 基础用法

```js
import { removeGhosting } from 'ranuts';

const dragElement = document.getElementById('draggable');
dragElement.addEventListener('dragstart', removeGhosting);
```

### 多个事件监听

```js
import { removeGhosting } from 'ranuts';

const dragElement = document.getElementById('draggable');

// 可以在多个事件中使用
dragElement.addEventListener('mouseenter', removeGhosting);
dragElement.addEventListener('dragstart', removeGhosting);
dragElement.addEventListener('drag', removeGhosting);
```

### 自定义拖拽图标

```js
import { removeGhosting } from 'ranuts';

dragElement.addEventListener('dragstart', (e) => {
  // 移除默认阴影
  removeGhosting(e);

  // 可以继续设置自定义拖拽图标
  // e.dataTransfer.setDragImage(customIcon, 0, 0);
});
```

## 注意事项

1. **透明图标**：创建一个 1x1 像素的透明 GIF 图片作为拖拽图标。
2. **事件类型**：通常用于 `dragstart`、`drag`、`mouseenter` 等拖拽相关事件。
3. **浏览器兼容**：使用标准的 `dataTransfer.setDragImage()` API。
4. **用途**：常用于自定义拖拽效果，移除浏览器默认的拖拽阴影。
