# isSafari

判断当前浏览器是否为 Safari。

## API

### isSafari

#### Return

| 参数                             | 说明                 | 类型                             |
| -------------------------------- | -------------------- | -------------------------------- |
| `boolean \| undefined \| string` | 是否为 Safari 浏览器 | `boolean \| undefined \| string` |

#### Parameters

无参数

## Example

### 基础用法

```js
import { isSafari } from 'ranuts';

const isSafariBrowser = isSafari();
if (isSafariBrowser) {
  console.log('当前是 Safari 浏览器');
} else {
  console.log('不是 Safari 浏览器');
}
```

### Safari 特定功能

```js
import { isSafari } from 'ranuts';

if (isSafari()) {
  // Safari 特定的处理
  // 例如：处理 Safari 的某些兼容性问题
  applySafariFix();
}
```

### 服务端环境

```js
import { isSafari } from 'ranuts';

// 在服务端环境中返回 undefined
const result = isSafari();
console.log(result); // undefined (服务端环境)
```

## 注意事项

1. **检测方式**：通过检测 `navigator.vendor` 是否包含 'Apple' 来判断。
2. **排除其他浏览器**：排除 Chrome iOS（CriOS）和 Firefox iOS（FxiOS）。
3. **服务端环境**：在服务端环境（无 `navigator` 对象）时返回 `undefined`。
4. **返回值**：在浏览器环境中返回 `boolean`，在服务端返回 `undefined`，某些情况下可能返回字符串。
