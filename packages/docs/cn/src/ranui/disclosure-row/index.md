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

<Demo column>
  <r-disclosure-row heading="Read file" summary="packages/ranui/index.ts" expandable>
    <div style="padding:8px 0">展开后显示的正文。</div>
  </r-disclosure-row>
</Demo>

```html
<r-disclosure-row heading="Read file" summary="packages/ranui/index.ts" expandable>
  <div>展开后显示的正文。</div>
</r-disclosure-row>
```

**heading 是定宽的左半边**，**summary 是会截断的右半边**，因此不管每行摘要多长，一列行都对齐在同一
条竖线上。摘要为空时，分隔符也会一并消失。

### 工作进行中

`busy` 会让一道微光扫过该行。转圈只说明「某处有事在发生」，扫过这一行则说明**正是这一行**还在跑。

<Demo column>
  <r-disclosure-row heading="Run tests" summary="2351 passed" busy expandable></r-disclosure-row>
  <r-disclosure-row heading="Run tests" summary="2351 passed" expandable></r-disclosure-row>
</Demo>

### 带前缀指示

`leading` 插槽与悬停时的折叠箭头共用同一个网格单元，因此悬停切换不产生布局开销。

<Demo column>
  <r-disclosure-row heading="Build" summary="failed in 4.2s" tone="error" expandable>
    <r-state-dot slot="leading" state="error"></r-state-dot>
    <div style="padding:8px 0">产物超过体积上限。</div>
  </r-disclosure-row>
</Demo>

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
| `sheet`      | `sheet`      | `string`  | `''`    | 注入 shadow root 的 CSS。                                |

::: warning 属性名是 `heading`，不是 `title`
`title` 是 `HTMLElement` 的原生属性，浏览器会把它渲染成 tooltip。组件若拿它当标题，每个实例都会冒出
一个重复屏幕上已有文字的 tooltip，而且一旦设置就关不掉。`<r-card>` 和 `<r-modal>` 出于同样的原因做了
同样的改名。
:::

### 事件

| 事件               | detail | 派发选项          | 说明               |
| ------------------ | ------ | ----------------- | ------------------ |
| `disclosuretoggle` | —      | bubbles, composed | 该行被展开或收起。 |

::: warning 事件名是 `disclosuretoggle`，不是 `toggle`
`toggle` 是 `<details>` 派发的原生事件，它的 `ToggleEvent` 带的是 `oldState` / `newState`，而不是
`detail`：按原生事件名去监听是接不到这份数据的。状态请直接从元素上读：`row.open`。
:::

```js
row.addEventListener('disclosuretoggle', () => {
  console.log(row.open ? '已展开' : '已收起');
});
```

### 插槽

| 插槽      | 内容                                     |
| --------- | ---------------------------------------- |
| `default` | 正文，在 `open` 时显示。                 |
| `leading` | 标题前的指示物，通常是 `<r-state-dot>`。 |

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

- **要么给行配正文，要么别让它可展开。** 展开后是空的箭头是条死路；不加 `expandable`，它就老老实实
  是一行。
- **heading 用固定词表**（`Read file`、`Run tests`、`Search`），把变化的部分放进 summary。这正是一列
  行能被快速扫读的原因。
- **`tone="error"` 必须配文字，不能只靠颜色**：摘要要说清失败的是什么。
