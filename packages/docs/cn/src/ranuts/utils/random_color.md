# randomColor

生成随机颜色对象。

## API

### randomColor

#### Return

| 参数    | 说明         | 类型    |
| ------- | ------------ | ------- |
| `Color` | 随机颜色对象 | `Color` |

#### Parameters

无参数

## Example

### 基础用法

```js
import { randomColor } from 'ranuts';

const color = randomColor();
console.log(color.hex); // '#a3f5c2' (随机)
console.log(color.rgb); // Rgb { r: 163, g: 245, b: 194 }
console.log(color.hsl); // Hsl { h: 150, s: 80, l: 80 }
```

### 获取随机颜色值

```js
import { randomColor } from 'ranuts';

const color = randomColor();
const hexColor = color.hex;
const rgbColor = color.rgb.toString();
const hslColor = color.hsl.toString();

console.log(hexColor); // '#a3f5c2'
console.log(rgbColor); // 'rgb(163,245,194)'
console.log(hslColor); // 'hsl(150,80%,80%)'
```

### 生成多个随机颜色

```js
import { randomColor } from 'ranuts';

const colors = Array.from({ length: 5 }, () => randomColor());
colors.forEach((color, index) => {
  console.log(`颜色 ${index + 1}:`, color.hex);
});
```

### 设置随机颜色

```js
import { randomColor } from 'ranuts';

const color = randomColor();
document.body.style.backgroundColor = color.hex;
```

## 注意事项

1. **随机生成**：每次调用都会生成一个随机的十六进制颜色值。
2. **完整对象**：返回完整的 `Color` 对象，包含 hex、rgb、hsl 等所有属性。
3. **颜色格式**：生成的颜色值包含 `#` 号，可以直接用于 CSS。
4. **用途**：常用于随机颜色生成、颜色选择器、数据可视化等场景。
