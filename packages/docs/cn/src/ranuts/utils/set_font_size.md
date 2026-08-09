# setFontSize2html

按视口比例设置根元素 `<html>` 的 `font-size`，让按固定宽度（375px，常见的移动端设计稿宽度）设计的页面能随真实屏幕缩放——这是用 `rem` 单位搭建移动端布局时经典的"flexible rem"技巧。

## 使用

```ts
import { setFontSize2html } from 'ranuts/utils';

setFontSize2html(); // 设计稿宽度默认为 375px
// 如果设计稿是按其他宽度做的：
setFontSize2html(414);
```

启动时调用一次即可。它会自己监听 resize 和屏幕方向变化并重新计算，所以整个页面生命周期内只需要调用一次。

```css
/* 设计稿（375px 宽）里画的一个 200px 的盒子 */
.box {
  width: 5.33333rem; /* 200 / 375 * 100 */
}
```

## API

### `setFontSize2html(designWidth?)`

#### 参数

| 参数          | 说明                         | 类型     | 默认值 |
| ------------- | ---------------------------- | -------- | ------ |
| `designWidth` | 设计稿制作时使用的宽度（px） | `number` | `375`  |

#### 返回

无返回值（`void`）——它作为副作用设置 `documentElement.style.fontSize`，并安装自己的 `resize` / `orientationchange` 监听。

## 注意事项

1. **iPad 会自动使用不同的基准。** 当 `currentDevice()` 判断当前是 iPad 时，设计宽度和宽高比会切换为 `768` / `1024:768`，而不是使用传入的 `designWidth`——这个函数默认假设的是手机设计稿，只对 iPad 这一种常见例外做了调整。
2. **没有销毁方法。** 和这个库里大多数会安装监听的工具函数不同，`setFontSize2html` 不返回取消订阅函数——它是为页面整个生命周期调用一次而设计的，不是给某个会挂载/卸载的组件用的。
3. 依赖 `document`/`window`，如果这段代码可能在 SSR 阶段运行，请在调用处自行判断。
4. 需要配合 CSS 构建阶段的工具（比如 postcss-pxtorem 之类）按同样的基准把设计稿的 `px` 值转换成 `rem`——`setFontSize2html` 只负责设置根字号，不会帮你转换样式表。
