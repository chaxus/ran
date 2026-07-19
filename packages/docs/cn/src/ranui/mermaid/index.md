# Mermaid 图表

以框架无关的 Web Component 渲染 [Mermaid](https://mermaid.js.org/) 图表(流程图、时序图、类图、状态图、甘特图……)。`<r-mermaid>` 在首次渲染时**懒加载** mermaid 库——不用它的应用零成本——并把图绘制到 shadow root 里,与页面样式隔离。

> **何时使用**:想把一段文本图表直接放进任意页面,而不必自己接入 mermaid;可选带 复制 / 下载 / 全屏 工具栏与缩放查看器。

## 快速开始

<Demo>
  <r-mermaid>graph LR; A[请求] --> B[校验]; B --> C[存储]; C --> D[响应]</r-mermaid>
</Demo>

```html
<r-mermaid>graph LR; A[请求] --> B[校验]; B --> C[存储]</r-mermaid>
```

```js
import 'ranui'; // 或按需引入:
import 'ranui/mermaid';
```

图表源码从元素的**文本内容**读取,或从 URI 编码的 `code` 属性读取(当语法含 `<` 时用 `code`——例如 `classDiagram` 的 `<|--`,以避免被 HTML 解析破坏):

```js
el.code = 'classDiagram\n  Dog --|> Animal'; // 属性 setter 会自动 URI 编码
```

## 控件

所有控件均**按需开启**(布尔属性);裸 `<r-mermaid>` 就是一张干净的静态图。工具栏在 hover 时显示(右上角)。

<Demo>
  <r-mermaid copy download fullscreen>graph TD; A[开始] --> B[处理]; B --> C[结束]</r-mermaid>
</Demo>

```html
<r-mermaid copy download fullscreen>graph TD; A --> B; B --> C</r-mermaid>
```

- **copy** —— 复制图表源码到剪贴板。
- **download** —— SVG / PNG / 源码(`.mmd`);单一格式直接下载,多格式弹出菜单。可用 `download="svg"` 或 `download="svg png"` 限制。
- **fullscreen** —— 打开无标题栏的灯箱(r-modal),支持**缩放与平移**(滚轮缩放、拖拽平移、复位);通过 ✕、点击遮罩或 `Esc` 关闭。

## API 参考

### 属性

| 属性         | 类型                          | 默认值   | 说明                                                                                                                                             |
| ------------ | ----------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `code`       | `string`(URI 编码)            | —        | 图表源码。缺省时回退到元素的文本内容。                                                                                                           |
| `theme`      | `'auto' \| 'light' \| 'dark'` | `'auto'` | mermaid 主题。`auto` 跟随页面(`.dark` / `[data-ran-theme]`),换肤时重新渲染。                                                                     |
| `copy`       | 布尔                          | 关       | 显示复制源码按钮。                                                                                                                               |
| `download`   | 布尔 / `"svg png source"`     | 关       | 显示下载按钮;取值可限制可选格式。                                                                                                                |
| `fullscreen` | 布尔                          | 关       | 显示全屏按钮。                                                                                                                                   |
| `sheet`      | `string`                      | —        | 注入 shadow root 的额外 CSS。                                                                                                                    |
| `label-*`    | `string`                      | 英文     | 覆盖控件文案:`label-copy`、`label-download`、`label-fullscreen`、`label-zoom-in`、`label-zoom-out`、`label-reset`、`label-diagram`(全屏弹窗名)。 |

## 事件

所有事件都冒泡并穿透 shadow 边界(`composed`)。

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

在元素上覆盖(每个都回退到语义 token,再回退到字面值):
`--ran-mermaid-padding`、`--ran-mermaid-toolbar-background`、`--ran-mermaid-toolbar-gap`、
`--ran-mermaid-button-size`、`--ran-mermaid-button-color`、`--ran-mermaid-button-hover-background`、
`--ran-mermaid-error-color`。

## 说明

- **懒加载**:mermaid(以及全屏用的 r-modal)都是动态 import,仅在图表渲染 / 打开全屏时作为独立 async chunk 加载。
- **渲染保真**:`<r-mermaid>` 直接用 mermaid 自身渲染,支持全部图表类型与主题。
- **PNG 导出**:使用 HTML label(mermaid `htmlLabels`)的图会通过 `<foreignObject>` 渲染,可能污染 canvas 导致 PNG 导出失败——此时会派发 `error` 事件。SVG 与源码导出始终可用。
