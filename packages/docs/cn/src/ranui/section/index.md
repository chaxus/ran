---
description: '带有可选无障碍标题与副标题的页面区块容器，标题下方承载插槽主体。'
---

# Section 区块

带有可选标题与副标题的页面区块容器，标题位于插槽主体上方。

> **适用场景**：需要用一个具备无障碍二级标题和可选副标题的区块，来标记页面中的主要区域时——`<r-section>` 提供了标题行与主体容器。

## 快速开始

### 基础用法

<r-section heading="区块标题" subtitle="用于描述该区块的一行简短文字。">
  <p style="margin: 0;">主体内容放在默认插槽里。</p>
</r-section>

```xml
<r-section heading="区块标题" subtitle="用于描述该区块的一行简短文字。">
  <p>主体内容放在默认插槽里。</p>
</r-section>
```

## API 参考

### 属性

| 属性       | 类型     | 默认值 | 说明                               |
| ---------- | -------- | ------ | ---------------------------------- |
| `heading`  | `string` | `''`   | 区块标题，以 ARIA 二级标题形式渲染 |
| `subtitle` | `string` | `''`   | 标题下方的辅助文字                 |
| `sheet`    | `string` | `''`   | 注入区块 Shadow DOM 的 CSS         |

当 `heading` 与 `subtitle` 都为空时，标题行会被整体隐藏。

### 标题 `heading`

区块标题，以 ARIA 二级标题形式渲染（`role="heading"`、`aria-level="2"`）。为空时隐藏。

<r-section heading="仅有标题">
  <p style="margin: 0;">主体内容。</p>
</r-section>

```xml
<r-section heading="仅有标题">
  <p>主体内容。</p>
</r-section>
```

### 副标题 `subtitle`

标题下方的辅助文字。为空时隐藏。

<r-section heading="标题" subtitle="辅助副标题文字。">
  <p style="margin: 0;">主体内容。</p>
</r-section>

```xml
<r-section heading="标题" subtitle="辅助副标题文字。">
  <p>主体内容。</p>
</r-section>
```

### Shadow CSS `sheet`

注入到区块 Shadow DOM 中的 CSS —— 与其他所有 ranui 组件一致的 `sheet` 约定。

<r-section heading="自定义主题区块" subtitle="标题颜色通过 sheet 重新着色。" sheet=".ran-section-heading { color: #006bff; }">
  <p style="margin: 0;">主体内容。</p>
</r-section>

```xml
<r-section heading="自定义主题区块" sheet=".ran-section-heading { color: #006bff; }">
  <p>主体内容。</p>
</r-section>
```

## 插槽

| 插槽     | 说明                         |
| -------- | ---------------------------- |
| _(默认)_ | 主体内容，渲染在标题行下方。 |

## CSS Parts

| Part       | 说明                     |
| ---------- | ------------------------ |
| `header`   | 包裹标题与副标题的头部行 |
| `heading`  | ARIA 二级标题元素        |
| `subtitle` | 辅助副标题文字           |
| `body`     | 包裹默认插槽的主体容器   |

可覆盖的 CSS 变量：`--ran-section-border-color`、`--ran-section-radius`、`--ran-section-background`、`--ran-section-shadow`、`--ran-section-padding`、`--ran-section-heading-color`、`--ran-section-heading-font-size`、`--ran-section-heading-font-weight`、`--ran-section-subtitle-color`。

```css
r-section {
  --ran-section-background: var(--surface-1);
  --ran-section-padding: 32px;
  --ran-section-heading-color: var(--text-strong);
}
r-section::part(subtitle) {
  max-width: 48ch;
}
```

## 最佳实践

- **区块标题**：设置 `heading` 来标记页面中每个主要区域。
- **上下文说明**：用 `subtitle` 提供简短的辅助说明；两者都省略时会渲染成没有标题行的纯净容器。
- **无障碍**：标题会以 ARIA 二级标题的形式暴露，因此会参与文档大纲——请保持标题内容有意义。
- **主题定制**：可复用样式优先使用 `--ran-section-*` CSS 变量或 `::part()` 选择器，而不是 `sheet` 属性。
