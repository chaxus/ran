# isBangDevice

判断当前设备是否为 iPhone 刘海屏机型。

## API

### isBangDevice

#### Return

| 参数      | 说明             | 类型      |
| --------- | ---------------- | --------- |
| `boolean` | 是否为刘海屏设备 | `boolean` |

#### Parameters

无参数

## Example

### 基础用法

```js
import { isBangDevice } from 'ranuts';

if (isBangDevice()) {
  console.log('当前是 iPhone 刘海屏设备');
  // 调整布局以适应刘海屏
  adjustLayoutForNotch();
}
```

### 适配刘海屏

```js
import { isBangDevice } from 'ranuts';

if (isBangDevice()) {
  // 添加安全区域 padding
  document.body.style.paddingTop = 'env(safe-area-inset-top)';
  document.body.style.paddingBottom = 'env(safe-area-inset-bottom)';
}
```

### 服务端安全

```js
import { isBangDevice } from 'ranuts';

// 在服务端环境中返回 false
const isBang = isBangDevice();
console.log(isBang); // false (服务端环境)
```

## 注意事项

1. **检测机型**：支持检测以下 iPhone 机型：
   - iPhone 12 mini
   - iPhone X、Xs、11 Pro
   - iPhone 12、12 Pro
   - iPhone XR、11、11 Pro Max
   - iPhone Xs Max
   - iPhone 12 Pro Max

2. **检测条件**：
   - 必须是 iPhone 设备
   - 像素比必须是 2 或 3
   - 屏幕尺寸必须匹配特定机型

3. **服务端环境**：在服务端环境（无 `window` 对象）时返回 `false`。

4. **用途**：常用于适配 iPhone 刘海屏，调整布局以避免内容被刘海遮挡。
