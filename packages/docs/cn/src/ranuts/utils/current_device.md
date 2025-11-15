# currentDevice

获取当前设备类型。

## API

### currentDevice

#### Return

| 参数            | 说明           | 类型                                      |
| --------------- | -------------- | ----------------------------------------- |
| `CurrentDevice` | 设备类型字符串 | `'ipad' \| 'android' \| 'iphone' \| 'pc'` |

#### Parameters

无参数

## Example

### 基础用法

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
console.log(`当前设备: ${device}`);
// 可能输出: 'ipad', 'android', 'iphone', 或 'pc'
```

### 根据设备类型执行不同逻辑

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
switch (device) {
  case 'iphone':
    // iPhone 特定逻辑
    break;
  case 'android':
    // Android 特定逻辑
    break;
  case 'ipad':
    // iPad 特定逻辑
    break;
  case 'pc':
    // PC 特定逻辑
    break;
}
```

### 设备特定样式

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
document.body.classList.add(`device-${device}`);
```

## 注意事项

1. **检测顺序**：按以下顺序检测：
   - iPad/iPod
   - Android
   - iPhone
   - 其他（默认返回 'pc'）

2. **服务端渲染**：在服务端环境（无 `window` 对象）时返回 `'pc'`。

3. **检测方式**：通过 User Agent 字符串进行检测。

4. **返回值**：返回值为枚举类型，只能是 `'ipad'`、`'android'`、`'iphone'` 或 `'pc'` 之一。
