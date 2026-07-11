# Card 卡片

带有页眉、主体和页脚区域的结构化内容容器。页眉展示可选的标题与描述；主体承载默认插槽内容；只有当你向页脚插槽放入内容时，页脚才会显示。卡片是 Geist 风格的描边表面——页面背景 + 1px 边框，而非灰色填充；默认不响应悬停，可点击的卡片通过 `hoverable` 显式开启悬停反馈。

## 代码演示

<r-card title="卡片标题" description="可选的副标题" style="max-width: 360px;">
  <span slot="extra" style="font-size: 12px;">标签</span>
  <p style="margin: 0;">主体内容放在默认插槽里。</p>
  <a slot="footer" href="#">查看说明</a>
</r-card>

```xml
<r-card title="卡片标题" description="可选的副标题">
  <span slot="extra">标签</span>
  <p>主体内容放在默认插槽里。</p>
  <a slot="footer" href="#">查看说明</a>
</r-card>
```

## 属性

### `title`

卡片标题，显示在页眉顶部。为空时隐藏。

<r-card title="仅有标题" style="max-width: 360px;">
  <p style="margin: 0;">主体内容。</p>
</r-card>

```xml
<r-card title="仅有标题">
  <p>主体内容。</p>
</r-card>
```

### `description`

渲染在标题下方的副标题。为空时隐藏。当 `title` 和 `description` 都未设置时，整个页眉都会隐藏。

<r-card title="标题" description="一段简短的辅助副标题" style="max-width: 360px;">
  <p style="margin: 0;">主体内容。</p>
</r-card>

```xml
<r-card title="标题" description="一段简短的辅助副标题">
  <p>主体内容。</p>
</r-card>
```

### `hoverable`

卡片默认不响应悬停。为真正可点击的卡片添加 `hoverable` 属性：悬停时边框在灰阶上加深一档（`--ran-color-border` → `--ran-color-border-hover`），同时表面获得轻量的抬升阴影（`--ran-shadow-elevated`）。

<r-card hoverable title="可悬停卡片" description="把鼠标移上来" style="max-width: 360px; cursor: pointer;">
  <p style="margin: 0;">边框加深，卡片轻微抬升。</p>
</r-card>

```xml
<r-card hoverable title="可悬停卡片" description="把鼠标移上来">
  <p>边框加深，卡片轻微抬升。</p>
</r-card>
```

`hoverable` 只是视觉表现——请仅在响应点击的卡片上使用，非交互卡片必须保持静止。

### `sheet`

注入到卡片 Shadow DOM 中的 CSS —— 与其他所有 ranui 组件一致的 `sheet` 约定。

```xml
<r-card title="自定义主题卡片" sheet=".ran-card { background: #f6ffed; }">
  <p>主体内容。</p>
</r-card>
```

## 插槽

| 插槽     | 说明                                                   |
| -------- | ------------------------------------------------------ |
| _(默认)_ | 主体内容，渲染在卡片主体区域。                         |
| `extra`  | 页眉右侧 —— 徽标、链接或操作按钮。                     |
| `footer` | 页脚内容。只有当该插槽存在被分配的节点时页脚才会显示。 |

## 样式

- **`::part()` 导出** —— `card`、`header`、`title`、`description`、`extra`、`body`、`footer`。
- **CSS 变量** —— `--ran-card-display`、`--ran-card-min-height`、`--ran-card-gap`、`--ran-card-padding`、`--ran-card-radius`、`--ran-card-background`、`--ran-card-border-color`、`--ran-card-shadow`、`--ran-card-hover-border-color`、`--ran-card-hover-shadow`（后两个配合 `hoverable` 生效）、`--ran-card-title-color`、`--ran-card-title-font-size`、`--ran-card-title-font-weight`、`--ran-card-description-color`、`--ran-card-description-font-size`。

```css
r-card {
  --ran-card-background: var(--surface-2);
  --ran-card-radius: 12px;
  --ran-card-min-height: 148px;
}
r-card::part(header) {
  border-bottom: 1px solid var(--line);
}
```
