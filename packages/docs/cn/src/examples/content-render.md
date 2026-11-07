---
title: 内容渲染
description: 同一列中渲染 Markdown 正文、行内/块级公式与 Mermaid 图——典型的助手或文档输出。
---

# 内容渲染

助手与文档页常在同一列混合正文、公式与图表。[`r-markdown`](../ranui/markdown/) 解析并消毒 Markdown，把 `mermaid` 代码块交给 [`r-mermaid`](../ranui/mermaid/)，把 `$…$` / `$$…$$` 交给 [`r-math`](../ranui/math/)。通常在 [`r-conversation`](../ranui/conversation/) 的每一行挂一个 markdown 元素；此示例单独展示渲染栈。

<ran-demo column align="start">
  <r-markdown highlight copy style="width: 100%; max-width: 520px" data-content="%23%20Release%20notes%0A%0AThe%20**pipeline**%20now%20folds%20SSE%20in%20%60createStreamAccumulator()%60.%0A%0AInline%20math%3A%20%24E%20%3D%20mc%5E2%24.%0A%0A%60%60%60mermaid%0Aflowchart%20LR%0A%20%20bytes--%3Eparse%0A%20%20parse--%3Efold%0A%20%20fold--%3Eview%0A%60%60%60%0A%0ABlock%20math%3A%0A%0A%24%24%0A%5Cint_0%5E1%20x%5E2%20%5C%2C%20dx%20%3D%20%5Cfrac%7B1%7D%7B3%7D%0A%24%24"></r-markdown>
</ran-demo>

流式输出请设置 `r-markdown` 的 `content` 属性（不要用 attribute），避免每个 token 重解析未变块。聊天接线见 [搭建 AI 聊天](../ranui/ai-chat/)。

## 参考

- [Markdown](../ranui/markdown/) — 流式模式、代码高亮、复制
- [Math](../ranui/math/) — Temml
- [Mermaid](../ranui/mermaid/) — 懒加载图表
