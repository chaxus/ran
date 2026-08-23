---
description: '一个感知路由的锚点，拦截应用内导航，外部链接照常交给浏览器处理。'
---

# Link 链接

一个感知路由的锚点，会用 `<a>` 包裹插槽内容并拦截应用内导航。

> **何时使用**：需要一个能把内部路径交给 ranui 路由处理、外部链接照常交给浏览器的锚点时 —— `<r-link>` 会拦截应用内导航并为你调用 `push`/`replace`。

## 快速开始

### 基础用法

<r-link href="/getting-started">开始使用</r-link>

```html
<r-link href="/getting-started">开始使用</r-link>
```

内部 `href` 被点击时，链接会把路径交给当前激活的 ranui 路由（`push`，当设置了 `replace` 属性时则为 `replace`）。外部链接（`https://`、`//`、`mailto:`、`tel:`）以及带修饰键的点击（鼠标中键、Ctrl/Cmd/Shift/Alt）则照常交给浏览器处理。当没有注册路由时，它会改为派发一个可冒泡、可穿透 Shadow DOM 的 `ran-navigate` 事件。

## API 参考

### 属性

| 属性      | 类型      | 默认值  | 说明                                                      |
| --------- | --------- | ------- | --------------------------------------------------------- |
| `href`    | `string`  | `''`    | 导航目标。内部路径会在应用内路由；外部 URL 按正常方式导航 |
| `replace` | `boolean` | `false` | 存在时，应用内导航会替换当前历史记录（只读，反映该属性）  |
| `sheet`   | `string`  | `''`    | 注入到链接 Shadow DOM 中的 CSS                            |

### 导航目标 `href`

内部路径会在应用内路由；绝对 URL 以及 `mailto:` / `tel:` 链接则正常导航。

<r-link href="/docs">内部链接</r-link>
<r-link href="https://example.com">外部链接</r-link>

```html
<r-link href="/docs">内部链接</r-link> <r-link href="https://example.com">外部链接</r-link>
```

### 替换历史记录 `replace`

布尔属性。存在时，应用内导航会替换当前历史记录（`router.replace`），而非新增一条。

<r-link href="/settings" replace>替换记录</r-link>

```html
<r-link href="/settings" replace>替换记录</r-link>
```

### 外部样式 `sheet`

注入到链接 Shadow DOM 中的 CSS —— 与其他所有 ranui 组件一致的 `sheet` 约定。由于可点击的 `<a>` 位于 Shadow Root 内，当你希望宿主样式呈现为按钮或卡片时，请通过 `sheet` 为其赋予盒模型（`display`、`padding`、`width`）。

<r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; background: var(--ran-color-bg-muted); }">带内边距的链接</r-link>

```html
<r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; }">带内边距的链接</r-link>
```

## 插槽

| 插槽     | 说明                                           |
| -------- | ---------------------------------------------- |
| _(默认)_ | 链接内容，投影到 shadow `<a>` 中（文本或节点） |

## 事件

| 事件           | detail                               | 触发时机                                                           |
| -------------- | ------------------------------------ | ------------------------------------------------------------------ |
| `ran-navigate` | `{ path: string, replace: boolean }` | 点击内部链接且没有激活的 ranui 路由时。可冒泡、可穿透 Shadow DOM。 |

```html
<r-link href="/docs">Docs</r-link>

<script>
  document.querySelector('r-link').addEventListener('ran-navigate', (e) => {
    console.log(e.detail.path, e.detail.replace);
  });
</script>
```

## 最佳实践

- **内部导航**：使用根相对的 `href`（例如 `/docs`），路由会在应用内处理它。
- **外部链接**：绝对 URL 以及 `mailto:` / `tel:` 会照常交给浏览器 —— 无需额外配置。
- **替换历史记录**：为不应产生返回按钮记录的链接（例如重定向、切换标签页）添加 `replace`。
- **激活态**：宿主通过 `:host([active]) a` 定义样式（加粗 + 下划线），因此设置 `active` 属性即可标记当前链接。
- **作为按钮/卡片使用**：把表面样式（背景、边框、圆角）放在宿主上，再通过 `sheet` 为内部的 `<a>` 注入盒模型（`display`、`padding`、`width`），让整个区域可点击。
- **主题定制**：`<a>` 读取全局的 `--ran-color-link`、`--ran-color-primary`（聚焦环）与 `--ran-radius-sm` 令牌 —— 请覆盖这些全局令牌，而不要期望存在组件级的 `--ran-link-*` 变量（并不存在）。

## 样式

主题令牌用全局的，不是组件级的 —— `--ran-link-*` 并不存在。

```css
r-link {
  --ran-color-link: var(--brand);
}
```
