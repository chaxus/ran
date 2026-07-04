# Link 链接

一个感知路由的锚点。它会用 `<a>` 包裹插槽内容并拦截应用内导航：内部 `href` 会交给当前激活的 ranui 路由处理（`push`，当设置了 `replace` 时则为 `replace`）；外部链接（`https://`、`//`、`mailto:`、`tel:`）以及带修饰键的点击（中键 / ctrl / cmd / shift / alt）则照常交给浏览器。当没有注册路由时，它会派发一个可冒泡、可穿透 Shadow DOM 的 `ran-navigate` `CustomEvent`，其 `detail` 为 `{ path, replace }`。

## 代码演示

<r-link href="/getting-started">开始使用</r-link>

```xml
<r-link href="/getting-started">开始使用</r-link>
```

## 属性

### `href`

导航目标。内部路径会在应用内路由；绝对 URL 以及 `mailto:` / `tel:` 链接则正常导航。

<r-link href="https://example.com">外部链接</r-link>

```xml
<r-link href="/docs">内部链接</r-link>
<r-link href="https://example.com">外部链接</r-link>
```

### `replace`

布尔属性。存在时，应用内导航会替换当前历史记录（`router.replace`），而非新增一条。

<r-link href="/settings" replace>替换记录</r-link>

```xml
<r-link href="/settings" replace>替换记录</r-link>
```

### `sheet`

注入到链接 Shadow DOM 中的 CSS —— 与其他所有 ranui 组件一致的 `sheet` 约定。由于可点击的 `<a>` 位于（封闭的）Shadow Root 内，当你希望把宿主样式设置成按钮或卡片时，请通过 `sheet` 为其赋予盒模型（`display`、`padding`、`width`）。

```xml
<r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; }">带内边距的链接</r-link>
```

## 事件

| 事件           | detail                      | 触发时机                                                           |
| -------------- | --------------------------- | ------------------------------------------------------------------ |
| `ran-navigate` | `{ path: string, replace }` | 点击内部链接且没有激活的 ranui 路由时。可冒泡、可穿透 Shadow DOM。 |

## 样式

可点击的 `<a>` 位于封闭的 Shadow Root 中，不暴露任何 `::part()`。它读取全局的 `--ran-color-link`、`--ran-color-primary`（聚焦环）与 `--ran-radius-sm` 令牌 —— 不存在组件级的 `--ran-link-*` 变量。请直接为宿主设置样式、覆盖这些令牌，或通过 `sheet` 注入锚点样式。宿主还通过 `:host([active]) a` 定义了激活态样式（加粗 + 下划线），因此你可以设置 `active` 属性来标记当前链接。

```css
r-link {
  --ran-color-link: var(--brand);
}
```
