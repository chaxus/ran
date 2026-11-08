---
description: '使用 Temml 把 LaTeX 数学公式直接编译为原生 MathML，无需 canvas、SVG 或 KaTeX 运行时。'
---

# Math 数学公式

使用 [Temml](https://temml.org/) 将 `LaTeX` 数学公式直接编译为原生 `MathML`，在 `HTML` 页面中高质量展示。

> **适用场景**：需要在网页中渲染 LaTeX 数学公式时，`<r-math>` 会用 [Temml](https://temml.org/) 将 `latex` 属性中的表达式编译为 MathML，交由浏览器自身完成排版（无需 canvas/SVG，也不依赖 KaTeX 运行时）。

## 快速开始

### 基础用法

<ran-demo>
  <r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
</ran-demo>

```html
<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
```

## API 参考

### 属性

| 属性       | 类型      | 默认值    | 说明                                                                           |
| ---------- | --------- | --------- | ------------------------------------------------------------------------------ |
| `latex`    | `string`  | `''`      | 待渲染的 LaTeX 公式，通过该属性传入，而非 slot 文本。                          |
| `display`  | `string`  | `'block'` | `block`（行间公式）或 `inline`（行内公式）。                                   |
| `font`     | `string`  | `''`      | 设为 `system` 可跳过内置的 Latin Modern Math 字体，改用系统数学字体。          |
| `macros`   | `string`  | `''`      | 一个 Temml 宏的 JSON 对象；无效 JSON 会被静默忽略。                            |
| `wrap`     | `string`  | `''`      | Temml 的软换行方式：`none`、`tex` 或 `=`。                                     |
| `copy`     | `boolean` | `false`   | 显示复制按钮。裸 `copy` 复制 LaTeX 源码；`copy="mathml"` 复制渲染出的 MathML。 |
| `download` | `boolean` | `false`   | 显示下载按钮/菜单，用于下载源码（`.tex`）和/或 MathML（`.mml`）。              |
| `sheet`    | `string`  | `''`      | 注入组件 shadow DOM 的 CSS。                                                   |

`latex` 属性的 getter 会用 `decodeURIComponent` 解码后再渲染，因此支持传入 URI 编码后的公式。没有该属性时，会使用元素的文本内容作为公式。

### 公式 `latex`

<ran-demo>
  <r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
</ran-demo>

```html
<r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
```

### 外部样式 `sheet`

<ran-demo>
  <r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
</ran-demo>

```html
<r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
```

## 事件

| 事件       | detail                             | 触发时机                                 |
| ---------- | ---------------------------------- | ---------------------------------------- |
| `render`   | `{ ok: true }`                     | 公式渲染成功。                           |
| `error`    | `{ message: string }`              | Temml 解析公式失败（如非法的 LaTeX）。   |
| `copied`   | `{ kind: 'source' \| 'mathml' }`   | 复制按钮已将源码或 MathML 复制到剪贴板。 |
| `download` | `{ format: 'source' \| 'mathml' }` | 下载按钮已保存 `.tex` 或 `.mml` 文件。   |

## 自定义样式

`<r-math>` 自身暴露了 **16 个 CSS 自定义属性**，另外还会读取主题里的语义令牌。令牌设在任何能继承到的
地方都有效，比如 `:root`、外层容器，或元素本身：

```css
r-math {
  --ran-math-error-background: var(--ran-color-bg-subtle);
}
```

Part：`button` · `error` · `math` · `menu` · `render` · `toolbar`

完整清单见[样式令牌](/cn/ranui/style-tokens#math)；该选哪个令牌见[设计系统](/cn/design/design-system/)。
