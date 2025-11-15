# hexToRgb

将十六进制颜色值转换为 RGB 数组。

## API

### hexToRgb

#### Return

| 参数                    | 说明                       | 类型                    |
| ----------------------- | -------------------------- | ----------------------- |
| `Array<number> \| null` | RGB 数组 [r, g, b] 或 null | `Array<number> \| null` |

#### Parameters

| 参数  | 说明           | 类型     | 默认值 |
| ----- | -------------- | -------- | ------ |
| `hex` | 十六进制颜色值 | `string` | 无     |

## Example

### 基础用法

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#ff0000');
console.log(rgb); // [255, 0, 0]

const rgb2 = hexToRgb('#00ff00');
console.log(rgb2); // [0, 255, 0]
```

### 处理无效值

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#invalid');
console.log(rgb); // null
```

### 支持带或不带 # 号

```js
import { hexToRgb } from 'ranuts';

const rgb1 = hexToRgb('#ff0000');
const rgb2 = hexToRgb('ff0000');
console.log(rgb1); // [255, 0, 0]
console.log(rgb2); // [255, 0, 0]
```

### 颜色转换

```js
import { hexToRgb, rgbToHex } from 'ranuts';

const hex = '#ff5733';
const rgb = hexToRgb(hex);
console.log(rgb); // [255, 87, 51]

// 转换回 hex
const hex2 = rgbToHex(rgb[0], rgb[1], rgb[2]);
console.log(hex2); // '#ff5733'
```

## 注意事项

1. **格式要求**：支持 6 位十六进制颜色值（如 `#ff0000` 或 `ff0000`）。
2. **返回值**：成功返回 `[r, g, b]` 数组，失败返回 `null`。
3. **大小写**：不区分大小写，`#FF0000` 和 `#ff0000` 都可以。
4. **用途**：常用于颜色转换、颜色处理、CSS 颜色处理等场景。
