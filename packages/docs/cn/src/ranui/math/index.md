# Math 数学公式

现代化的数学公式组件，使用 KaTeX 在 HTML 页面中高质量渲染 LaTeX 数学表达式，支持异步加载、错误处理和事件通知。

## 代码演示

### 基础用法

通过 `latex` 属性设置 LaTeX 数学表达式。

<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>

```html
<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
```

### 行内公式

默认情况下，数学公式以行内模式显示。

<p>
  一元二次方程的求根公式为
  <r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
</p>

```html
<p>
  一元二次方程的求根公式为
  <r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
</p>
```

### 块级公式

添加 `display` 属性将公式以块级模式居中显示。

<r-math display latex="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}"></r-math>

```html
<r-math display latex="\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}"></r-math>
```

### 复杂公式

支持渲染复杂的数学公式。

<r-math display latex="\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}"></r-math>

<r-math display latex="\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}"></r-math>

```html
<r-math display latex="\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}"></r-math>

<r-math display latex="\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}"></r-math>
```

### 事件处理

监听渲染成功和错误事件。

```html
<r-math id="mathFormula" latex="E = mc^2"></r-math>

<script>
  const math = document.getElementById('mathFormula');

  // 监听渲染成功事件
  math.addEventListener('render', (e) => {
    console.log('渲染成功:', e.detail);
    // { latex: "E = mc^2", success: true }
  });

  // 监听渲染错误事件
  math.addEventListener('error', (e) => {
    console.error('渲染失败:', e.detail);
    // { latex: "...", error: Error }
  });
</script>
```

### 动态更新

动态修改 `latex` 属性，公式会自动重新渲染。

```html
<r-math id="dynamicMath" latex="x^2"></r-math>
<button onclick="updateFormula()">更新公式</button>

<script>
  function updateFormula() {
    const math = document.getElementById('dynamicMath');
    math.latex = 'x^3 + y^3 = z^3';
  }
</script>
```

## API

### Math 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| latex | LaTeX 数学表达式 | `string` | - |
| display | 是否为块级显示模式 | `boolean` | `false` |
| loading | 加载状态（只读） | `boolean` | `false` |
| error | 错误状态（只读） | `boolean` | `false` |

### Math 方法

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| refresh | 强制重新渲染公式 | - | `Promise<void>` |
| clear | 清除渲染的公式 | - | `void` |

### Math 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| render | 公式渲染成功时触发 | `CustomEvent<MathRenderEventDetail>` |
| error | 公式渲染失败时触发 | `CustomEvent<MathErrorEventDetail>` |

### MathRenderEventDetail 接口

```typescript
interface MathRenderEventDetail {
  latex: string;    // LaTeX 表达式
  success: true;    // 是否成功
}
```

### MathErrorEventDetail 接口

```typescript
interface MathErrorEventDetail {
  latex: string;  // LaTeX 表达式
  error: Error;   // 错误对象
}
```

### CSS 自定义属性

| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| --math-display | 显示模式 | `inline-block` |
| --math-justify-content | 水平对齐 | `flex-start` |
| --math-align-items | 垂直对齐 | `center` |

### CSS 部件

| 部件 | 说明 |
| --- | --- |
| container | 公式容器 |

## 使用方法

### 常用 LaTeX 语法

#### 分数

```latex
\frac{a}{b}
```
<r-math latex="\frac{a}{b}"></r-math>

#### 根号

```latex
\sqrt{x} \quad \sqrt[n]{x}
```
<r-math latex="\sqrt{x} \quad \sqrt[n]{x}"></r-math>

#### 上下标

```latex
x^2 \quad x_i \quad x^{2y} \quad x_{i+1}
```
<r-math latex="x^2 \quad x_i \quad x^{2y} \quad x_{i+1}"></r-math>

#### 求和与积分

```latex
\sum_{i=1}^{n} \quad \int_{a}^{b} \quad \prod_{i=1}^{n}
```
<r-math latex="\sum_{i=1}^{n} \quad \int_{a}^{b} \quad \prod_{i=1}^{n}"></r-math>

#### 矩阵

```latex
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
```
<r-math display latex="\begin{pmatrix} a & b \\ c & d \end{pmatrix}"></r-math>

#### 希腊字母

```latex
\alpha \beta \gamma \delta \theta \pi \sigma
```
<r-math latex="\alpha \beta \gamma \delta \theta \pi \sigma"></r-math>

## 完整示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>Math 示例</title>
</head>
<body>
  <h2>欧拉公式</h2>
  <r-math id="euler" display latex="e^{i\pi} + 1 = 0"></r-math>

  <h2>麦克斯韦方程组</h2>
  <r-math display latex="\nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_0}"></r-math>
  <r-math display latex="\nabla \cdot \mathbf{B} = 0"></r-math>
  <r-math display latex="\nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t}"></r-math>
  <r-math display latex="\nabla \times \mathbf{B} = \mu_0 \mathbf{J} + \mu_0 \epsilon_0 \frac{\partial \mathbf{E}}{\partial t}"></r-math>

  <script>
    const euler = document.getElementById('euler');

    // 监听渲染事件
    euler.addEventListener('render', (e) => {
      console.log('欧拉公式渲染成功！');
    });

    euler.addEventListener('error', (e) => {
      console.error('渲染失败:', e.detail.error.message);
    });
  </script>
</body>
</html>
```

## 无障碍

- 数学公式容器具有 `role="math"` 属性
- 加载状态会通过 `aria-busy` 属性告知屏幕阅读器
- 渲染错误时会显示清晰的错误消息

## 注意事项

- **LaTeX 语法**：确保使用正确的 LaTeX 语法
- **转义字符**：在 HTML 属性中使用反斜杠时，可能需要进行 URL 编码
- **性能**：首次加载会异步加载 KaTeX 库，后续渲染会更快
- **错误处理**：监听 `error` 事件以处理渲染失败的情况
- **动态更新**：修改 `latex` 属性会自动触发重新渲染

## 最佳实践

- **块级公式**：复杂公式使用 `display` 属性以块级模式显示
- **错误监听**：生产环境中监听 `error` 事件，提供友好的错误提示
- **懒加载**：KaTeX 库采用异步加载，首次渲染会有短暂延迟
- **公式缓存**：相同的公式会被缓存，重复使用不会影响性能
