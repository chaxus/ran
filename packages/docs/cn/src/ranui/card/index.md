---
description: '带有页眉、主体和页脚区域的结构化内容容器——Geist 风格的描边表面，用于组织相关内容。'
---

# Card 卡片

带有页眉、主体和页脚区域的结构化内容容器。页眉展示可选的标题与描述；主体承载默认插槽内容；只有当你向页脚插槽放入内容时，页脚才会显示。卡片是 Geist 风格的描边表面——页面背景 + 1px 边框，而非灰色填充；默认不响应悬停，可点击的卡片通过 `hoverable` 显式开启悬停反馈。

> **适用场景**：当你需要把相关内容组织进一个带描边的表面，并需要标题、描述、主体、页脚这几个区域时——`<r-card>` 提供这些插槽，外加一个可选的 `hoverable` 交互态。

## 快速开始

### 基础用法

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

## API 参考

### 属性

| 属性          | 类型      | 默认值  | 说明                                           |
| ------------- | --------- | ------- | ---------------------------------------------- |
| `title`       | `string`  | `''`    | 卡片标题，显示在页眉顶部。为空时隐藏。         |
| `description` | `string`  | `''`    | 渲染在标题下方的副标题。为空时隐藏。           |
| `hoverable`   | `boolean` | `false` | 交互式卡片：悬停时边框加深，并抬升至悬浮阴影。 |
| `sheet`       | `string`  | `''`    | 注入到卡片 Shadow DOM 中的 CSS。               |

### 标题 `title`

卡片标题，显示在页眉顶部。为空时隐藏。

<r-card title="仅有标题" style="max-width: 360px;">
  <p style="margin: 0;">主体内容。</p>
</r-card>

```xml
<r-card title="仅有标题">
  <p>主体内容。</p>
</r-card>
```

### 描述 `description`

渲染在标题下方的副标题。为空时隐藏。当 `title` 和 `description` 都未设置时，整个页眉都会隐藏。

<r-card title="标题" description="一段简短的辅助副标题" style="max-width: 360px;">
  <p style="margin: 0;">主体内容。</p>
</r-card>

```xml
<r-card title="标题" description="一段简短的辅助副标题">
  <p>主体内容。</p>
</r-card>
```

### 交互式卡片 `hoverable`

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

### 外部样式 `sheet`

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

## 样式定制

卡片暴露以下 `::part()` 钩子，供外部样式使用：

| 部件          | 说明                        |
| ------------- | --------------------------- |
| `card`        | 卡片外层容器。              |
| `header`      | 页眉行。                    |
| `title`       | 标题文本。                  |
| `description` | 副标题文本。                |
| `extra`       | 页眉中的 `extra` 插槽。     |
| `body`        | 主体区域（默认插槽）。      |
| `footer`      | 页脚区域（`footer` 插槽）。 |

可覆盖的 CSS 变量：`--ran-card-display`、`--ran-card-min-height`、`--ran-card-gap`、`--ran-card-padding`、`--ran-card-radius`、`--ran-card-background`、`--ran-card-border-color`、`--ran-card-shadow`、`--ran-card-hover-border-color`、`--ran-card-hover-shadow`（后两个配合 `hoverable` 生效）、`--ran-card-title-color`、`--ran-card-title-font-size`、`--ran-card-title-font-weight`、`--ran-card-description-color`、`--ran-card-description-font-size`。

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

## 事件

卡片是被动容器，不会派发任何自定义事件。

## 最佳实践

- **标题与描述**：用 `title` 承载标题、`description` 承载简短的辅助副标题；两者都不设置时整个页眉会被隐藏。
- **主体内容**：把主要内容放在默认插槽里。
- **页眉操作**：用 `extra` 插槽放置徽标、链接或对齐到页眉右侧的操作按钮。
- **页脚**：用 `footer` 插槽放置次要操作或链接；在插入内容之前它会保持隐藏。
- **悬停反馈**：只给真正可点击的卡片加 `hoverable`——非交互卡片不应该响应悬停。
- **主题定制**：优先使用 CSS 变量和 `::part()` 而不是 `sheet` 属性，以获得可复用的样式方案。
