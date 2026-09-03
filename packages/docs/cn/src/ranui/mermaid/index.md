---
description: '以框架无关的 Web Component 渲染 Mermaid 图表（流程图、时序图、类图、状态图、甘特图），首次渲染时懒加载。'
---

# Mermaid 图表

以框架无关的 Web Component 渲染 [Mermaid](https://mermaid.js.org/) 图表（流程图、时序图、类图、状态图、甘特图……）。`<r-mermaid>` 只在首次渲染时才**懒加载** mermaid 库，没用到它的应用不会为此付出任何加载成本；图表最终绘制在 shadow root 内，与页面样式互不干扰。

> **何时使用**：想把一段文本图表直接放进任意页面，不必自己接入 mermaid，还可以选择搭配复制、下载、全屏工具栏和缩放查看器。

## 快速开始

<Demo>
  <r-mermaid>graph LR; A[请求] --> B[校验]; B --> C[存储]; C --> D[响应]</r-mermaid>
</Demo>

```html
<r-mermaid>graph LR; A[请求] --> B[校验]; B --> C[存储]</r-mermaid>
```

```js
import 'ranui'; // 或按需引入：
import 'ranui/mermaid';
```

图表源码从元素的**文本内容**读取，或从 URI 编码的 `code` 属性读取（当语法中含有 `<` 时改用 `code`，例如 `classDiagram` 里的 `<|--`，避免被 HTML 解析破坏）：

```js
el.code = 'classDiagram\n  Dog --|> Animal'; // 属性 setter 会自动 URI 编码
```

## 控件

所有控件都通过布尔属性**按需开启**；不加任何控件属性的 `<r-mermaid>` 就是一张干净的静态图，工具栏仅在鼠标悬停时显示（右上角）。

<Demo>
  <r-mermaid copy download fullscreen>graph TD; A[开始] --> B[处理]; B --> C[结束]</r-mermaid>
</Demo>

```html
<r-mermaid copy download fullscreen>graph TD; A --> B; B --> C</r-mermaid>
```

- **copy**：复制图表源码到剪贴板。
- **download**：下载 SVG／PNG／源码（`.mmd`）；只有一种格式时直接下载，有多种格式则弹出菜单选择，也可用 `download="svg"` 或 `download="svg png"` 限制可选格式。
- **fullscreen**：打开无标题栏的灯箱（r-modal），支持**缩放与平移**（滚轮缩放、拖拽平移、一键复位）；可通过 ✕、点击遮罩或 `Esc` 关闭。

## API 参考

### 属性

| 属性         | 类型                          | 默认值   | 说明                                                                                                                                                  |
| ------------ | ----------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code`       | `string`（URI 编码）          | —        | 图表源码。缺省时回退到元素的文本内容。                                                                                                                |
| `theme`      | `'auto' \| 'light' \| 'dark'` | `'auto'` | mermaid 主题。`auto` 跟随页面（`.dark` / `[data-ran-theme]`），切换主题时会重新渲染。                                                                 |
| `copy`       | 布尔                          | 关       | 显示复制源码按钮。                                                                                                                                    |
| `download`   | 布尔 / `"svg png source"`     | 关       | 显示下载按钮；取值可限制可选格式。                                                                                                                    |
| `fullscreen` | 布尔                          | 关       | 显示全屏按钮。                                                                                                                                        |
| `sheet`      | `string`                      | —        | 注入 shadow root 的额外 CSS。                                                                                                                         |
| `label-*`    | `string`                      | 英文     | 覆盖控件文案：`label-copy`、`label-download`、`label-fullscreen`、`label-zoom-in`、`label-zoom-out`、`label-reset`、`label-diagram`（全屏弹窗名称）。 |

## 事件

所有事件都会冒泡，并穿透 shadow 边界（`composed`）。

| 事件               | `detail`                                 | 触发时机          |
| ------------------ | ---------------------------------------- | ----------------- |
| `render`           | `{ ok: true }`                           | 一张图渲染完成    |
| `copied`           | `{ kind: 'source' }`                     | 源码被复制        |
| `download`         | `{ format: 'svg' \| 'png' \| 'source' }` | 某个文件被下载    |
| `error`            | `{ message: string }`                    | 图表解析/渲染失败 |
| `fullscreenchange` | `{ open: boolean }`                      | 全屏灯箱打开/关闭 |

## CSS Parts

| Part      | 说明                     |
| --------- | ------------------------ |
| `mermaid` | 最外层容器。             |
| `diagram` | 渲染图表的容器。         |
| `toolbar` | hover 显示的控件栏。     |
| `button`  | 每个工具栏图标按钮。     |
| `error`   | 渲染失败时的错误信息框。 |

```css
r-mermaid::part(toolbar) {
  background: var(--surface);
}
```

## CSS 变量

在元素上覆盖（每个变量都会先回退到语义 token，再回退到字面值）：
`--ran-mermaid-padding`、`--ran-mermaid-toolbar-background`、`--ran-mermaid-toolbar-gap`、
`--ran-mermaid-button-size`、`--ran-mermaid-button-color`、`--ran-mermaid-button-hover-background`、
`--ran-mermaid-error-color`。

## 说明

- **懒加载**：mermaid（以及全屏功能用到的 r-modal）都是动态 import，只有在图表渲染或打开全屏时，才会作为独立的 async chunk 加载。
- **渲染保真**：`<r-mermaid>` 直接使用 mermaid 自身的渲染逻辑，支持全部图表类型与主题。
- **PNG 导出**：使用 HTML label（mermaid 的 `htmlLabels`）的图表会通过 `<foreignObject>` 渲染，可能污染 canvas，导致 PNG 导出失败，此时会派发 `error` 事件。SVG 与源码导出不受影响，始终可用。
