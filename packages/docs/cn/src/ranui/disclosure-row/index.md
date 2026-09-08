---
description: 'ranui DisclosureRow（<r-disclosure-row>）是一行「标题 · 摘要」的可展开行，展开后显示正文，工作进行中时行上有微光扫过。'
---

# DisclosureRow 折叠行

一行 `[前缀] 标题 · 摘要` 的骨架，展开后显示正文。`<r-reasoning>` 与 `<r-tool-card>` 用的是同一个
它，因此同时含有两者的会话只有一套折叠语言，而不是两套。

> **适用场景**：一行紧凑的文字代表着更大的一团内容（一次工具调用、一段思维链、一组日志），而细节
> 值得先藏起来、需要时再看。

## 快速开始

### 基础用法

<ran-demo column>
  <r-disclosure-row heading="Read file" summary="packages/ranui/index.ts" expandable>
    <div style="padding:8px 0">展开后显示的正文。</div>
  </r-disclosure-row>
</ran-demo>

```html
<r-disclosure-row heading="Read file" summary="packages/ranui/index.ts" expandable>
  <div>展开后显示的正文。</div>
</r-disclosure-row>
```

**heading 是定宽的左半边**，**summary 是会截断的右半边**，因此不管每行摘要多长，一列行都对齐在同一
条竖线上。摘要为空时，分隔符也会一并消失。

### 工作进行中

`busy` 会让一道微光扫过该行。转圈只说明「某处有事在发生」，扫过这一行则说明**正是这一行**还在跑。

<ran-demo column>
  <r-disclosure-row heading="Run tests" summary="2351 passed" busy expandable></r-disclosure-row>
  <r-disclosure-row heading="Run tests" summary="2351 passed" expandable></r-disclosure-row>
</ran-demo>

### 带前缀指示

`leading` 插槽与折叠箭头共用同一个网格单元，因此两者互换不产生布局开销，标题不会在指针下方移动。

没有 `leading` 内容时，箭头一直显示，它是这一行唯一能表明可展开的标记；有 `leading` 内容时，箭头改为在悬停、聚焦或展开时出现，其余时候显示的是状态点。

<ran-demo column>
  <r-disclosure-row heading="Build" summary="failed in 4.2s" tone="error" expandable>
    <r-state-dot slot="leading" state="error"></r-state-dot>
    <div style="padding:8px 0">产物超过体积上限。</div>
  </r-disclosure-row>
</ran-demo>

```html
<r-disclosure-row heading="Build" summary="failed in 4.2s" tone="error" expandable>
  <r-state-dot slot="leading" state="error"></r-state-dot>
  <div>产物超过体积上限。</div>
</r-disclosure-row>
```

## API 参考

### 属性

| 属性值       | 属性         | 类型      | 默认值  | 说明                                                     |
| ------------ | ------------ | --------- | ------- | -------------------------------------------------------- |
| `heading`    | `heading`    | `string`  | `''`    | 定宽的左半边。                                           |
| `summary`    | `summary`    | `string`  | `''`    | 会截断的右半边；为空时分隔符一并消失。                   |
| `open`       | `open`       | `boolean` | `false` | 是否展开正文。会反射到属性上，因此 `:has([open])` 可用。 |
| `expandable` | `expandable` | `boolean` | `false` | 这一行是否有值得展开的正文。                             |
| `busy`       | `busy`       | `boolean` | `false` | 这一行代表的工作是否仍在进行。                           |
| `tone`       | `tone`       | `string`  | `''`    | `error` 会把摘要染成错误色，其余为普通色调。             |
| `name`       | `name`       | `string`  | `''`    | 把若干行归为一组，展开一行时收起同组其余行。             |
| `sheet`      | `sheet`      | `string`  | `''`    | 注入 shadow root 的 CSS。                                |

::: warning 属性名是 `heading`，不是 `title`
`title` 是 `HTMLElement` 的原生属性，浏览器会把它渲染成 tooltip。组件若拿它当标题，每个实例都会冒出
一个重复屏幕上已有文字的 tooltip，而且一旦设置就关不掉。`<r-card>` 和 `<r-modal>` 出于同样的原因做了
同样的改名。
:::

### 事件

| 事件                     | detail              | 派发选项                      | 说明                   |
| ------------------------ | ------------------- | ----------------------------- | ---------------------- |
| `disclosurebeforetoggle` | `{ open: boolean }` | bubbles, composed, cancelable | 该行即将被展开或收起。 |
| `disclosuretoggle`       | `{ open: boolean }` | bubbles, composed             | 该行已被展开或收起。   |

::: warning 事件名是 `disclosuretoggle`，不是 `toggle`
`toggle` 是 `<details>` 派发的原生事件，它的 `ToggleEvent` 带的是 `oldState` / `newState`，而不是
`detail`：按原生事件名去监听是接不到这份数据的。状态请直接从元素上读：`row.open`。
:::

```js
row.addEventListener('disclosuretoggle', () => {
  console.log(row.open ? '已展开' : '已收起');
});
```

`disclosurebeforetoggle` 先触发，并且可以被拒绝。「第一次展开时才去拉取正文」「有未保存的修改时不许
收起」这两件事都要靠它。平台本身没有对应能力：`<details>` 只有事后的 `toggle`，给它加可取消的
`beforetoggle` 的提案至今还没落地。

```js
row.addEventListener('disclosurebeforetoggle', async (event) => {
  if (!event.detail.open || row.dataset.loaded) return;
  event.preventDefault(); // 正文到位之前先按住不展开
  row.append(await fetchBody());
  row.dataset.loaded = 'true';
  row.open = true;
});
```

只有点击或按键才会触发它。`row.open = true` 这种程序化修改是应用自己改主意，没有谁需要被征求意见。

### 同时只展开一行

`name` 的分组方式和 `<details>` 的 `name` 一致：展开一行会收起同组其余行。分组范围是整个文档，同组的
行不必相邻。

```html
<r-disclosure-row name="run" heading="Install" expandable>…</r-disclosure-row>
<r-disclosure-row name="run" heading="Build" expandable>…</r-disclosure-row>
<r-disclosure-row name="run" heading="Test" expandable>…</r-disclosure-row>
```

### 无障碍

只有确实能展开的行才是控件。带 `expandable` 时，该行会有 `role="button"`、一个 Tab 停靠点、
`aria-expanded`，以及指向正文的 `aria-controls`；不带时这些一个都没有，因为把一行纯文本报成按钮，
只会引来一次什么都不会发生的点击。`busy` 会写上 `aria-busy`，这样那道扫光就不是唯一的进行中信号。

收起时正文是被裁切而不是被移除，这样才能做动画。同时它会被标记为 `inert`，内容用
`content-visibility: hidden` 跳过渲染，因此收起期间既不在 Tab 顺序里，也不占渲染开销。

行高 24px，正好卡在 WCAG 2.5.8 的最小值上，而且行与行之间没有间隔。在粗指针（触摸）设备上默认行高会
变成 32px：命中区无法在不与上一行重叠的前提下继续扩大，而重叠只会把「目标偏小」换成「点错行」。设置
`--ran-disclosure-row-height` 可以在任何输入方式下固定行高。

### 插槽

| 插槽      | 内容                                            |
| --------- | ----------------------------------------------- |
| `default` | 正文，在 `open` 时显示。                        |
| `leading` | 标题前的指示物，通常是 `<r-state-dot>`。        |
| `heading` | 左半边的标记内容，替代 `heading` 属性的纯文本。 |
| `summary` | 右半边的标记内容，替代 `summary` 属性的纯文本。 |

`heading` 和 `summary` 作为属性只能传纯文本，对工具调用行来说通常够用。如果这一半需要带标记
（代码、链接、缩写），改用插槽。属性文本正是插槽的后备内容，所以插入内容会直接把它顶掉：

```html
<r-disclosure-row expandable>
  <code slot="heading">fetch()</code>
  <a slot="summary" href="https://example.com">https://example.com</a>
  <pre>…</pre>
</r-disclosure-row>
```

插槽内容同样算作这一行的一半，因此分隔符的出现和消失规则与用属性时完全一致。

### Part

`row` · `leading` · `title` · `separator` · `summary` · `disclosure` · `body`

## 自定义样式

`<r-disclosure-row>` 自身暴露了 **15 个 CSS 自定义属性**，另外还会读取主题里的语义令牌。令牌设在任何能继承到的
地方都有效，比如 `:root`、外层容器，或元素本身：

```css
r-disclosure-row {
  --ran-disclosure-hover-background: var(--ran-color-bg-subtle);
}
```

Part：`body` · `disclosure` · `leading` · `row` · `separator` · `summary` · `title`

完整清单见[样式令牌](/cn/src/ranui/style-tokens#disclosure-row)；该选哪个令牌见[设计系统](/cn/src/ranui/design-system/)。

## 最佳实践

- **要么给行配正文，要么别让它可展开。** 展开后却是空的，箭头就没有意义；不加 `expandable`，
  这一行就保持单行。
- **heading 用固定词表**（`Read file`、`Run tests`、`Search`），把变化的部分放进 summary。这正是一列
  行能被快速扫读的原因。
- **`tone="error"` 必须配文字，不能只靠颜色**：摘要要说清失败的是什么。
