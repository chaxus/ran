# rgbToHex

将 RGB 值转换为十六进制颜色值。

## API

### rgbToHex

#### Return

| 参数     | 说明           | 类型     |
| -------- | -------------- | -------- |
| `string` | 十六进制颜色值 | `string` |

#### Parameters

| 参数 | 说明              | 类型                        | 默认值 |
| ---- | ----------------- | --------------------------- | ------ |
| `r`  | 红色值或 RGB 数组 | `string \| number \| Array` | 无     |
| `g`  | 绿色值（可选）    | `string \| number`          | `0`    |
| `b`  | 蓝色值（可选）    | `string \| number`          | `0`    |

## Example

### 基础用法

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex(255, 0, 0);
console.log(hex); // '#ff0000'

const hex2 = rgbToHex(0, 255, 0);
console.log(hex2); // '#00ff00'
```

### 使用数组

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex([255, 87, 51]);
console.log(hex); // '#ff5733'
```

### 颜色转换

```js
import { rgbToHex, hexToRgb } from 'ranuts';

const rgb = [255, 87, 51];
const hex = rgbToHex(rgb);
console.log(hex); // '#ff5733'

// 转换回 RGB
const rgb2 = hexToRgb(hex);
console.log(rgb2); // [255, 87, 51]
```

### 动态生成颜色

```js
import { rgbToHex } from 'ranuts';

function generateColor(r, g, b) {
  return rgbToHex(r, g, b);
}

const color = generateColor(100, 150, 200);
console.log(color); // '#6496c8'
```

## 注意事项

1. **参数格式**：支持三种格式：
   - 三个独立参数：`rgbToHex(r, g, b)`
   - 数组参数：`rgbToHex([r, g, b])`
   - 字符串或数字：会自动转换

2. **返回值**：始终返回带 `#` 号的十六进制颜色值。

3. **值范围**：RGB 值通常在 0-255 范围内，超出范围的值会被转换为十六进制。

4. **用途**：常用于颜色转换、CSS 颜色生成、颜色处理等场景。
