# isWeiXin

判断当前环境是否为微信浏览器。

## API

### isWeiXin

#### Return

| 参数      | 说明             | 类型      |
| --------- | ---------------- | --------- |
| `boolean` | 是否为微信浏览器 | `boolean` |

#### Parameters

无参数

## Example

### 基础用法

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  console.log('当前在微信浏览器中');
} else {
  console.log('不在微信浏览器中');
}
```

### 微信特定功能

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // 使用微信 JS-SDK
  wx.config({
    // 配置信息
  });
} else {
  // 使用普通分享功能
  shareToSocial();
}
```

### 条件显示

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // 显示微信专用提示
  showWeChatTip();
}
```

## 注意事项

1. **检测方式**：通过检测 User Agent 中是否包含 `micromessenger` 字符串来判断。

2. **服务端渲染**：在服务端环境（无 `window` 对象）时返回 `false`。

3. **准确性**：基于 User Agent 检测，如果 UA 被修改可能无法准确识别。

4. **微信版本**：适用于所有版本的微信浏览器（包括微信内置浏览器和微信小程序 WebView）。
