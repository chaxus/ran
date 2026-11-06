---
title: Inhaltsdarstellung
description: Eine Fläche für Markdown, Mathe und Mermaid — typische Assistenten- oder Doku-Ausgabe.
---

# Inhaltsdarstellung

Assistenten- und Dokumentationsseiten mischen oft Prosa, Formeln und Diagramme in einer Spalte. [`r-markdown`](../ranui/markdown/) parses and sanitizes Markdown, delegates fenced `mermaid` blocks to [`r-mermaid`](../ranui/mermaid/), and `$…$` / `$$…$$` to [`r-math`](../ranui/math/). You usually mount one markdown element per message row inside [`r-conversation`](../ranui/conversation/); this example shows the render stack alone.

<ran-demo column align="start">
  <r-markdown highlight copy style="width: 100%; max-width: 520px" data-content="%23%20Release%20notes%0A%0AThe%20**pipeline**%20now%20folds%20SSE%20in%20%60createStreamAccumulator()%60.%0A%0AInline%20math%3A%20%24E%20%3D%20mc%5E2%24.%0A%0A%60%60%60mermaid%0Aflowchart%20LR%0A%20%20bytes--%3Eparse%0A%20%20parse--%3Efold%0A%20%20fold--%3Eview%0A%60%60%60%0A%0ABlock%20math%3A%0A%0A%24%24%0A%5Cint_0%5E1%20x%5E2%20%5C%2C%20dx%20%3D%20%5Cfrac%7B1%7D%7B3%7D%0A%24%24"></r-markdown>
</ran-demo>

During streaming, set the `content` property on `r-markdown` (not the attribute) so token updates do not re-parse unchanged blocks. For chat wiring, see [Build AI chat](../ranui/ai-chat/).

## References

- [Markdown](../ranui/markdown/) — streaming mode, code highlight, copy control
- [Math](../ranui/math/) — KaTeX rendering
- [Mermaid](../ranui/mermaid/) — lazy diagram load
