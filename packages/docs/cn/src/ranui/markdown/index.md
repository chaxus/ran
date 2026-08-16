---
description: '面向流式输出的 Markdown 渲染 Web Component：自动补全未闭合的 Markdown、只重渲染变化的块，并内嵌代码高亮（shiki）、Mermaid 图表与数学公式。'
---

<script setup>
const quick = `# 你好

一些 **粗体**、*斜体*、[链接](https://github.com/chaxus/ran) 和 \`行内代码\`。

\`\`\`ts
const greet = (name: string): string => \`Hi \${name}\`;
\`\`\`

| 特性 | 状态 |
| --- | --- |
| 流式渲染 | ✅ |
| Mermaid / Math | ✅ |`;
const partial = '半截的 *斜体*、`行内代码`，以及**还在到达中的粗体';
const code = `\`\`\`python
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(10))
\`\`\``;
const rich = `\`\`\`mermaid
graph LR; A[提示词] --> B[模型]; B --> C[Token 流]; C --> D[r-markdown]
\`\`\`

$$
E = mc^2
$$

Inline \\(e^{i\\pi} + 1 = 0\\) 与文字同行。`;
</script>

# Markdown

以框架无关的 Web Component 渲染 Markdown——包括 **逐 token 到达的 AI 输出**。`<r-markdown>` 参考 Vercel 的 [Streamdown](https://streamdown.ai) 设计：文本流式到达时会即时闭合半截的 `**粗体`、`` `代码 ``、链接和 `$$` 公式，把文档切成块并 **只重渲染发生变化的那一块**，长回复不会因为每个 token 都从头重新解析。

围栏 ` ```mermaid ` 代码块会变成 [`<r-mermaid>`](/cn/src/ranui/mermaid/)，公式变成 [`<r-math>`](/cn/src/ranui/math/)，代码可用 shiki 高亮——这三者都在内容首次需要时才懒加载。输出经 DOMPurify 净化。

> **何时使用**：需要展示不完全可控的 Markdown——聊天回复、LLM 流式输出、用户评论、文档——并希望开箱即得流式、代码/图表/公式支持与安全 HTML，而不必自己拼装解析器、净化器和高亮器。

## 快速开始

<Demo>
  <r-markdown copy highlight :content.prop="quick"></r-markdown>
</Demo>

```html
<r-markdown copy highlight content="# 你好 ..."></r-markdown>
```

```js
import 'ranui'; // 或独立入口：
import 'ranui/markdown';
```

内容来源依次为：**`content` 属性（property，推荐）**——不会反射到 attribute，流式写入长文本不会抖动 DOM；`content` attribute；元素的文本内容：

```js
const el = document.querySelector('r-markdown');
el.setAttribute('caret', ''); // 流式期间显示闪烁光标
for await (const chunk of stream) {
  el.content += chunk; // 只有最后一块会重渲染
}
el.removeAttribute('caret');
```

## 流式渲染

`mode="streaming"`（默认）会先用 [remend](https://www.npmjs.com/package/remend)（从 Streamdown 抽出的"未完成 Markdown 补全器"）处理文本：半截的 `**粗体` 渲染成粗体而不是裸星号，`[文字](https://exa` 在 URL 闭合前显示为纯文本，`- ` 不会把上一段变成标题……。已完成的文档可设 `mode="static"` 跳过这一步、整体一次渲染。

<Demo>
  <r-markdown caret :content.prop="partial"></r-markdown>
</Demo>

```html
<r-markdown caret content="半截的 *斜体*、`行内代码`，以及**还在到达中的粗体"></r-markdown>
```

- **光标**：`caret` 在最后一块后显示闪烁的 `▋`，`caret="circle"` 显示 `●`。当代码围栏尚未闭合或最后一块是表格时自动隐藏。
- **未闭合的代码围栏** 在闭合前保持纯文本（不会高亮闪烁、不会渲染半个图表），期间容器带 `data-incomplete`。

## 代码块

每个代码块都有语言标签头部，可选加复制 / 下载按钮。加 `highlight` 用 [shiki](https://shiki.style) 高亮（懒加载，语言按需加载；默认 `github-light` / `github-dark`，跟随页面主题）。

<Demo>
  <r-markdown copy download line-numbers highlight :content.prop="code"></r-markdown>
</Demo>

```html
<r-markdown copy download line-numbers highlight></r-markdown>
<!-- 指定主题：亮色 暗色 -->
<r-markdown highlight="vitesse-light vitesse-dark"></r-markdown>
```

## Mermaid 与公式

<Demo>
  <r-markdown :content.prop="rich"></r-markdown>
</Demo>

- ` ```mermaid ` → `<r-mermaid>`（带全屏；`copy` / `download` 会透传）。
- `$$…$$`、`\[…\]` 与 ` ```math ` → 块级 `<r-math>`；`\(…\)` → 行内。单美元 `$…$` 需 **显式开启** `inline-math`，因为它与货币符号歧义。

## API 参考

### 属性

| 属性           | 类型                           | 默认值        | 说明                                                                                                 |
| -------------- | ------------------------------ | ------------- | ---------------------------------------------------------------------------------------------------- |
| `content`      | `string`                       | —             | Markdown 源。`content` **property** 优先且不反射；否则回退到元素文本内容。                           |
| `mode`         | `'streaming' \| 'static'`      | `'streaming'` | `streaming` 补全未闭合 Markdown 并按块 diff；`static` 原样整体渲染一次。                             |
| `caret`        | boolean / `'circle'`           | 关            | 最后一块后的闪烁光标（`▋`，`circle` 时为 `●`）。                                                     |
| `copy`         | boolean                        | 关            | 代码块复制按钮（也透传给内嵌的 `<r-mermaid>`）。                                                     |
| `download`     | boolean                        | 关            | 代码块下载按钮（按语言生成 `code.<ext>`）。                                                          |
| `line-numbers` | boolean                        | 关            | 代码块行号。                                                                                         |
| `highlight`    | boolean / `"亮色 暗色"` 主题名 | 关            | shiki 语法高亮。空值 → `github-light github-dark`；一个名字 → 两者相同；两个名字 → 亮色 / 暗色。     |
| `inline-math`  | boolean                        | 关            | 把 `$…$` 当作行内公式（`\(…\)` 始终是）。                                                            |
| `link-target`  | `string`                       | `'_blank'`    | 外部链接的 `target`（附带 `rel="noopener noreferrer"`）。`_self` 不处理链接。页内 `#锚点` 永远不加。 |
| `theme`        | `'auto' \| 'light' \| 'dark'`  | `'auto'`      | 高亮 / 图表主题。`auto` 跟随页面（`.dark`、`[data-ran-theme]`，否则 `prefers-color-scheme`）。       |
| `sheet`        | `string`                       | —             | 注入 shadow root 的额外 CSS。                                                                        |
| `label-*`      | `string`                       | 英文          | 覆盖控件文案：`label-copy`、`label-download`。                                                       |

对应的 property：`content`、`mode`、`caret`、`copyable`、`downloadable`、`lineNumbers`、`highlight`、`inlineMath`、`linkTarget`、`theme`、`sheet`。

## 事件

所有事件均冒泡并穿透 shadow 边界（`composed`）。

| 事件       | `detail`                               | 触发时机                        |
| ---------- | -------------------------------------- | ------------------------------- |
| `render`   | `{ blocks: number, changed: number }`  | 一次渲染至少改变了一个块        |
| `copied`   | `{ kind: 'code', language, code }`     | 复制了某个代码块                |
| `download` | `{ kind: 'code', language, filename }` | 下载了某个代码块                |
| `error`    | `{ message: string }`                  | 解析 / 渲染失败（同时就地显示） |

## CSS Parts

| Part           | 说明                    |
| -------------- | ----------------------- |
| `markdown`     | 最外层容器。            |
| `body`         | 块容器。                |
| `block`        | 每个渲染出的块。        |
| `code`         | 代码块容器。            |
| `code-header`  | 代码块的语言 / 操作栏。 |
| `code-lang`    | 语言标签。              |
| `code-actions` | 操作按钮组。            |
| `button`       | 每个复制 / 下载按钮。   |
| `table`        | 可横向滚动的表格外层。  |
| `error`        | 渲染失败时的错误框。    |

```css
r-markdown::part(code) {
  border-radius: 8px;
}
```

## CSS 变量

在元素上覆盖（每个都先回退到语义 token，再回退到字面量）：
`--ran-markdown-color`、`--ran-markdown-font-size`、`--ran-markdown-line-height`、
`--ran-markdown-gap`、`--ran-markdown-heading-color`、`--ran-markdown-link-color`、
`--ran-markdown-inline-code-bg`、`--ran-markdown-code-bg`、`--ran-markdown-code-border`、
`--ran-markdown-code-radius`、`--ran-markdown-code-font-size`、`--ran-markdown-mono-font`、
`--ran-markdown-blockquote-border`、`--ran-markdown-table-border`、
`--ran-markdown-table-header-bg`、`--ran-markdown-caret`、`--ran-markdown-caret-color`、
`--ran-markdown-button-color`、`--ran-markdown-error-color`。

## 说明

- **懒加载**：解析器 chunk（marked + DOMPurify + remend）在首次渲染时加载；shiki、mermaid、Temml 各自只在内容用到时才加载。不渲染 Markdown 的应用零成本。
- **净化**：Markdown 里的原始 HTML 会经过 DOMPurify——脚本、事件属性、`javascript:` URL、`<style>`、表单与 iframe 都会被移除。任务列表的复选框会保留。
- **按块 diff** 以位置为 key，因此未变化块内的 DOM 状态（打开的全屏图表、滚动过的表格）在流式更新中得以保留。文档只 lex 一次、每块用自己的 token 渲染，因此链接引用定义可以跨块解析（`[文字][id]` 在一块、`[id]: url` 在另一块）。
- **GFM 脚注**（`[^1]`）**不支持**——marked 没有脚注 tokenizer，标记会原样渲染成文本。
- **shiki 由你自己的安装解析**：ES 构建保留裸的 `import('shiki')`，由你的打包器分包，只下载代码围栏实际用到的语法。shiki 是 ranui 的普通依赖，`npm i ranui` 就已带上，无需额外安装。
- **独立 IIFE**：`dist/iife/markdown.iife.js` 没有模块解析器，因此改为内联 mermaid、Temml 以及 shiki 的 _web_ 语言包（约 50 种常见语言）。想要完整语言覆盖且体积更小，请用 ES 入口（`ranui/markdown`）。
