# Color Picker 颜色选择器

一个紧凑的色块，点击后弹出面板，包含饱和度/明度调色板、色相滑块、透明度滑块，
以及 HEX/RGB 数值输入框。其 `value` 接受并输出标准的 CSS 颜色字符串。

## 代码演示

<r-colorpicker value="#006bff"></r-colorpicker>
<r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>

```xml
<r-colorpicker value="#006bff"></r-colorpicker>
<r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
```

点击色块（或聚焦后按 Enter/Space）即可打开面板。色相与透明度滑块支持键盘操作：
方向键步进 1，Shift+方向键步进 10，Home/End 跳到两端。

## 属性

### `value`

当前颜色，为 CSS 颜色字符串。输入时接受 HEX（`#1677FF`、`#fff`）、`rgb(...)` 与 `rgba(...)`。
输出时，完全不透明的颜色规范化为 6 位 HEX 字符串，透明度小于 1 时则为 `rgba(...)` 字符串。

```js
const picker = document.querySelector('r-colorpicker');
picker.value = '#00c853';
console.log(picker.value); // 读回当前颜色
```

### `sheet`

注入到组件 shadow DOM 的 CSS，与其它所有 ranui 组件的 `sheet` 约定一致。

## 事件

### `change`

颜色发生变化时触发 —— 拖动调色板、移动滑块、编辑数值输入框，或设置 `value` 特性时。
该事件会**冒泡**且是 **composed**（可跨越 shadow 边界）。`event.detail` 携带各种格式的颜色：

| 字段    | 类型     | 示例                                      |
| ------- | -------- | ----------------------------------------- |
| `value` | `string` | `"#1677ff"` / `"rgba(22, 119, 255, 0.5)"` |
| `hex`   | `string` | `"#1677ff"`                               |
| `rgb`   | `string` | `"rgb(22, 119, 255)"`                     |
| `rgba`  | `string` | `"rgba(22, 119, 255, 0.5)"`               |
| `alpha` | `number` | `0.5`                                     |

```js
picker.addEventListener('change', (e) => {
  console.log(e.detail.hex, e.detail.alpha);
});
```

## 样式定制

- **`::part(block)`** — 色块容器（带棋盘格背景的触发框）。
- **`::part(swatch)`** — 显示当前颜色的内部填充块。
- **CSS 变量** — 触发色块读取以下令牌：

| 变量                                    | 用途             |
| --------------------------------------- | ---------------- |
| `--ran-colorpicker-background`          | 色块背景         |
| `--ran-colorpicker-border`              | 色块边框         |
| `--ran-colorpicker-border-hover`        | 悬停时的边框颜色 |
| `--ran-colorpicker-border-radius`       | 色块圆角         |
| `--ran-colorpicker-block-border-radius` | 内部块圆角       |
| `--ran-colorpicker-transition`          | 悬停过渡         |

```css
r-colorpicker {
  --ran-colorpicker-border-radius: 6px;
}
r-colorpicker::part(block) {
  box-shadow: 0 0 0 1px var(--line);
}
```

弹出面板会被挂载到 `document.body`，因此其样式使用了独立命名空间（`.ran-color-picker-*`）
并随面板一起迁移，而非驻留在宿主上。

通过 `import 'ranui'`（注册全部组件）或独立子路径 `import 'ranui/colorpicker'` 引入。
