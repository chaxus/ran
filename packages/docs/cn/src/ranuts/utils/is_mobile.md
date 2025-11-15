# isMobile

判断当前设备是否为移动端设备。

## API

### isMobile

#### Return

| 参数      | 说明         | 类型      |
| --------- | ------------ | --------- |
| `boolean` | 是否为移动端 | `boolean` |

#### Parameters

无参数

## Example

### 基础用法

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  console.log('当前是移动设备');
} else {
  console.log('当前是桌面设备');
}
```

### 响应式布局

```js
import { isMobile } from 'ranuts';

const layout = isMobile() ? 'mobile' : 'desktop';
console.log(`使用 ${layout} 布局`);
```

### 条件加载

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  // 加载移动端专用代码
  import('./mobile-module');
} else {
  // 加载桌面端代码
  import('./desktop-module');
}
```

## 注意事项

1. **检测规则**：通过 User Agent 检测以下设备：
   - Android
   - webOS
   - iPhone
   - iPod
   - iPad
   - BlackBerry

2. **服务端渲染**：在服务端环境（无 `window` 对象）时返回 `false`。

3. **准确性**：基于 User Agent 检测，可能被修改的 UA 欺骗。

4. **iPad 处理**：iPad 在某些情况下可能被识别为移动设备，具体取决于 User Agent。
