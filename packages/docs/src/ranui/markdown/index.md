---
description: 'Streaming-friendly Markdown renderer web component: closes half-streamed markdown, re-renders only the changed block, and embeds code (shiki), Mermaid diagrams and math.'
---

<script setup>
const quick = `# Hello

Some **bold**, some *italic*, a [link](https://github.com/chaxus/ran) and \`inline code\`.

\`\`\`ts
const greet = (name: string): string => \`Hi \${name}\`;
\`\`\`

| Feature | Status |
| --- | --- |
| Streaming | ✅ |
| Mermaid / Math | ✅ |`;
const partial = 'Half-typed *emphasis*, `inline code`, and **bold that is still arriving';
const code = `\`\`\`python
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(10))
\`\`\``;
const rich = `\`\`\`mermaid
graph LR; A[Prompt] --> B[Model]; B --> C[Tokens]; C --> D[r-markdown]
\`\`\`

$$
E = mc^2
$$

Inline \\(e^{i\\pi} + 1 = 0\\) flows with text.`;
</script>

# Markdown

Render Markdown — including **token-by-token AI output** — as a framework-agnostic web
component. `<r-markdown>` is modelled after Vercel's [Streamdown](https://streamdown.ai):
while text streams in it closes half-typed `**bold`, `` `code ``, links and `$$` math on the
fly, splits the document into blocks and re-renders **only the block that changed**, so a
long answer never re-parses from the top on every token.

Fenced ` ```mermaid ` blocks become [`<r-mermaid>`](/src/ranui/mermaid/), math becomes
[`<r-math>`](/src/ranui/math/), and code can be highlighted with shiki — every one of these is
lazy-loaded the first time the content needs it. Output is sanitized with DOMPurify.

> **Use when** you display Markdown you don't fully control — chat replies, LLM streams,
> user comments, docs — and want streaming, code/diagram/math support and safe HTML without
> wiring a parser, sanitizer and highlighter yourself.

## Quick Start

<Demo>
  <r-markdown copy highlight :content.prop="quick"></r-markdown>
</Demo>

```html
<r-markdown copy highlight content="# Hello ..."></r-markdown>
```

```js
import 'ranui'; // or the standalone entry:
import 'ranui/markdown';
```

The source is read from the **`content` property** (preferred — not reflected, so streaming
a long answer doesn't churn the DOM), the `content` attribute, or the element's text content:

```js
const el = document.querySelector('r-markdown');
el.setAttribute('caret', ''); // show a blinking caret while streaming
for await (const chunk of stream) {
  el.content += chunk; // only the last block re-renders
}
el.removeAttribute('caret');
```

## Streaming

`mode="streaming"` (the default) runs the text through [remend](https://www.npmjs.com/package/remend)
first — the incomplete-markdown terminator extracted from Streamdown — so a half-received
`**bold` renders as bold instead of literal asterisks, `[text](https://exa` shows as plain
text until the URL closes, `- ` doesn't turn the previous paragraph into a heading, and so
on. Set `mode="static"` for finished documents to skip that pass and render in one piece.

<Demo>
  <r-markdown caret :content.prop="partial"></r-markdown>
</Demo>

```html
<r-markdown caret content="Half-typed *emphasis*, `inline code`, and **bold that is still arriving"></r-markdown>
```

- **caret** — `caret` shows a blinking `▋`, `caret="circle"` a `●`, after the last block.
  It hides automatically while a code fence is still open or the last block is a table.
- **incomplete code fences** stay plain (no highlighting flash, no half-rendered diagram)
  until the closing fence arrives; the container carries `data-incomplete` meanwhile.

## Code blocks

Every code block gets a header with the language and, opt-in, a copy / download button. Add
`highlight` to syntax-highlight with [shiki](https://shiki.style) (lazy-loaded; languages
load on demand; `github-light` / `github-dark` by default, following the page theme).

<Demo>
  <r-markdown copy download line-numbers highlight :content.prop="code"></r-markdown>
</Demo>

```html
<r-markdown copy download line-numbers highlight></r-markdown>
<!-- pick themes: light dark -->
<r-markdown highlight="vitesse-light vitesse-dark"></r-markdown>
```

## Mermaid & math

<Demo>
  <r-markdown :content.prop="rich"></r-markdown>
</Demo>

- ` ```mermaid ` → `<r-mermaid>` (with fullscreen; `copy` / `download` are forwarded).
- `$$…$$`, `\[…\]` and ` ```math ` → block `<r-math>`; `\(…\)` → inline. Single-dollar
  `$…$` is **opt-in** via `inline-math` because it is ambiguous with currency.

## API Reference

### Attributes

| Attribute      | Type                                 | Default       | Description                                                                                                                       |
| -------------- | ------------------------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `content`      | `string`                             | —             | Markdown source. The `content` **property** takes precedence and is not reflected; falls back to the element's text content.      |
| `mode`         | `'streaming' \| 'static'`            | `'streaming'` | `streaming` closes incomplete markdown and diffs by block; `static` renders the whole text as-is in one pass.                     |
| `caret`        | boolean / `'circle'`                 | off           | Blinking caret after the last block (`▋`, or `●` with `circle`).                                                                  |
| `copy`         | boolean                              | off           | Copy button on code blocks (forwarded to embedded `<r-mermaid>`).                                                                 |
| `download`     | boolean                              | off           | Download button on code blocks (`code.<ext>` by language).                                                                        |
| `line-numbers` | boolean                              | off           | Line numbers in code blocks.                                                                                                      |
| `highlight`    | boolean / `"light dark"` theme names | off           | Syntax highlighting via shiki. Bare → `github-light github-dark`; one name → both; two names → light / dark.                      |
| `inline-math`  | boolean                              | off           | Treat `$…$` as inline math (`\(…\)` always is).                                                                                   |
| `link-target`  | `string`                             | `'_blank'`    | `target` for external links (`rel="noopener noreferrer"` added). `_self` leaves links untouched. In-page `#anchors` never get it. |
| `theme`        | `'auto' \| 'light' \| 'dark'`        | `'auto'`      | Highlight / diagram theme. `auto` follows the page (`.dark`, `[data-ran-theme]`, else `prefers-color-scheme`).                    |
| `sheet`        | `string`                             | —             | Extra CSS injected into the shadow root.                                                                                          |
| `label-*`      | `string`                             | English       | Override control labels: `label-copy`, `label-download`.                                                                          |

Property aliases: `content`, `mode`, `caret`, `copyable`, `downloadable`, `lineNumbers`,
`highlight`, `inlineMath`, `linkTarget`, `theme`, `sheet`.

## Events

All events bubble and cross the shadow boundary (`composed`).

| Event      | `detail`                               | Fired when                                     |
| ---------- | -------------------------------------- | ---------------------------------------------- |
| `render`   | `{ blocks: number, changed: number }`  | a render pass changed at least one block       |
| `copied`   | `{ kind: 'code', language, code }`     | a code block was copied                        |
| `download` | `{ kind: 'code', language, filename }` | a code block was downloaded                    |
| `error`    | `{ message: string }`                  | parsing/rendering failed (also shown in-place) |

## CSS Parts

| Part           | Description                                 |
| -------------- | ------------------------------------------- |
| `markdown`     | The outer wrapper.                          |
| `body`         | The block container.                        |
| `block`        | Each rendered block.                        |
| `code`         | A code-block container.                     |
| `code-header`  | The language / actions bar of a code block. |
| `code-lang`    | The language label.                         |
| `code-actions` | The action-button group.                    |
| `button`       | Each copy / download button.                |
| `table`        | The horizontally scrolling table wrapper.   |
| `error`        | The error box (on render failure).          |

```css
r-markdown::part(code) {
  border-radius: 8px;
}
```

## CSS Variables

Override on the element (each falls back to a semantic token, then a literal):
`--ran-markdown-color`, `--ran-markdown-font-size`, `--ran-markdown-line-height`,
`--ran-markdown-gap`, `--ran-markdown-heading-color`, `--ran-markdown-link-color`,
`--ran-markdown-inline-code-bg`, `--ran-markdown-code-bg`, `--ran-markdown-code-border`,
`--ran-markdown-code-radius`, `--ran-markdown-code-font-size`, `--ran-markdown-mono-font`,
`--ran-markdown-blockquote-border`, `--ran-markdown-table-border`,
`--ran-markdown-table-header-bg`, `--ran-markdown-caret`, `--ran-markdown-caret-color`,
`--ran-markdown-button-color`, `--ran-markdown-error-color`.

## Notes

- **Lazy-loaded**: the parser chunk (marked + DOMPurify + remend) loads on first render;
  shiki, mermaid and Temml each load only when the content uses them. Apps that never render
  markdown pay nothing.
- **Sanitized**: raw HTML in the markdown goes through DOMPurify — scripts, event handlers,
  `javascript:` URLs, `<style>`, forms and iframes are removed. Task-list checkboxes survive.
- **Block diffing** keys blocks by position, so DOM state inside untouched blocks (an open
  fullscreen diagram, a scrolled table) survives streaming updates. The document is lexed
  once and each block renders from its own tokens, so a link reference definition resolves
  across blocks (`[text][id]` in one block, `[id]: url` in another).
- **GFM footnotes** (`[^1]`) are **not** supported — marked has no footnote tokenizer, so
  the markers render as literal text.
- **Standalone IIFE**: `dist/iife/markdown.iife.js` can't code-split, so it inlines mermaid,
  Temml and shiki's _web_ language bundle (~50 common languages). Prefer the ES entry
  (`ranui/markdown`) where every language is its own lazy chunk.
