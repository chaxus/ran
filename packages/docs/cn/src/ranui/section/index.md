# Section 区块

带有可选标题与副标题的页面区块容器，标题下方为插槽主体。标题区域以 ARIA 标题形式暴露（`role="heading"`、`aria-level="2"`），当标题与副标题均为空时整个标题区域会被隐藏。

## 代码演示

<r-section heading="区块标题" subtitle="用于描述该区块的一行简短文字。">
  <p style="margin: 0;">主体内容放在默认插槽里。</p>
</r-section>

```xml
<r-section heading="区块标题" subtitle="用于描述该区块的一行简短文字。">
  <p>主体内容放在默认插槽里。</p>
</r-section>
```

## 属性

### `heading`

区块标题，以 ARIA 二级标题形式渲染。为空时隐藏。

<r-section heading="仅有标题">
  <p style="margin: 0;">主体内容。</p>
</r-section>

```xml
<r-section heading="仅有标题">
  <p>主体内容。</p>
</r-section>
```

### `subtitle`

标题下方的辅助文字。为空时隐藏。当 `heading` 与 `subtitle` 都为空时，标题行会被隐藏。

<r-section heading="标题" subtitle="辅助副标题文字。">
  <p style="margin: 0;">主体内容。</p>
</r-section>

```xml
<r-section heading="标题" subtitle="辅助副标题文字。">
  <p>主体内容。</p>
</r-section>
```

### `sheet`

注入到区块 Shadow DOM 中的 CSS —— 与其他所有 ranui 组件一致的 `sheet` 约定。

```xml
<r-section heading="自定义主题区块" sheet=".ran-section-heading { color: #006bff; }">
  <p>主体内容。</p>
</r-section>
```

## 插槽

| 插槽        | 说明                                 |
| ----------- | ------------------------------------ |
| _(默认)_    | 主体内容，渲染在标题行下方。         |

## 样式

- **`::part()` 导出** —— `header`、`heading`、`subtitle`、`body`。
- **CSS 变量** —— `--ran-section-border-color`、`--ran-section-radius`、`--ran-section-background`、`--ran-section-shadow`、`--ran-section-padding`、`--ran-section-heading-color`、`--ran-section-heading-font-size`、`--ran-section-heading-font-weight`、`--ran-section-subtitle-color`。

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
