---
description: '在真实界面上用好 ranui：选定用途，让令牌给出取值；设计每个可达状态；检查实际渲染出来的效果。'
---

# Design guidelines 设计规范

在真实界面上使用 ranui：先确定元素的用途和状态，再让设计令牌（token）给出具体取值。

规则本身放在两个地方，本页只给链接，不再复述：[设计指南](/cn/src/design/guide)讲适用于任何产品的方法，
[ranui 实现适配](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/adapters/DESIGN.md)
讲 ranui 的令牌、层级和组件规则。两者都随包发布在 `node_modules/ranui/docs/DESIGN.md`。
[设计系统](/cn/src/ranui/design-system/)列出每个令牌及其取值，
[主题系统](/cn/src/ranui/theme/)说明运行时覆盖，
[信息架构](/cn/src/ranui/information-architecture/)负责页面结构。

> **适用场景**：为 `<r-*>` 元素搭建的界面选择颜色、间距、排版、纵深或动效。

## 原则

1. **清晰优先于个性。** 先让主要任务和主操作一目了然。
2. **复用已有控件。** `r-button`、`r-input`、`r-select` 和 `r-modal` 已经具备表单、键盘和无障碍行为，
   改样式即可，不要重新实现。
3. **按用途和状态决定。** “这段文字是什么？”有明确答案，“多大看起来合适？”没有。用途对应的令牌给出取值，
   并且会跟着主题变化。
4. **设计每个可达状态，并亲眼看结果。** 默认态只是八种状态之一，而一层谁都看不见的投影，只有在浏览器里才会暴露。

这些只是起点。偏离某一条能让界面更好时可以偏离，但要说明理由。

## 选颜色

[状态阶梯](/cn/src/ranui/design-system/#the-ladder)已经决定了悬停和按下的样子，你要做的只是确定用途。

| 这个元素是……        | 用                                                             |
| ------------------- | -------------------------------------------------------------- |
| 页面或表面的背景    | `--ran-color-bg` / `-bg-subtle` / `-bg-elevated` / `-bg-muted` |
| 指针悬停 / 正在按下 | `--ran-color-bg-hover` / `-bg-active`                          |
| 文字                | `--ran-color-text` / `-text-secondary` / `-text-disabled`      |
| 边框                | `--ran-color-border` / `-hover` / `-active`                    |
| 页面主操作          | `--ran-color-primary`（其上文字用 `--ran-color-primary-text`） |
| 状态                | `--ran-color-success` / `-warning` / `-danger`                 |
| 链接                | `--ran-color-link`                                             |

**每种强调色只表达一种含义。** 主色是单色，蓝色因此留给链接和聚焦环；绿色表示成功，琥珀色表示警告，
红色表示危险。拿红色做强调，以后就没有颜色能表达“危险”了。

裸 hex 值、不随主题切换的兜底值，或者兜底里引用了不存在的令牌，都会在暗色模式下悄悄出错，
或者让整条声明失效。适配文档的[颜色规则](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md#ranui-color)
逐条解释了原因，`verify:design` 会在 ranui 自身源码里拦下这些写法。

## 间距与节奏

间距从 [4px 尺度](/cn/src/ranui/design-system/#spacing)里取，并让距离表达含义：

- 组内元素之间用 **8px**。
- 组与组之间用 **16px**。
- 区域之间用 **24–32px**。

间距越小，关系越近，所以只要有一处间距不在尺度上，节奏就乱了。每段间距只交给一处负责：
在两个元素之间再加一段空白前，先把子元素的 margin 和父元素的 padding 算进去。

## 选排版

先问这段文字承担什么**角色**（标题、标签、正文、按钮、等宽），字体、字号、字重和行高都由
[排版尺度](/cn/src/ranui/design-system/#typography)决定。真正只出现一次的文字，比如视频上的手势提示，
单独给它一个组件令牌，比硬套最接近的角色更合适。

## 纵深：投影与层级

按元素的性质选投影层级：文档流里的表面、浮层，还是会挡住操作的对话框。浮层如果退回卡片层级的投影，
看上去就像钉在页面上。

**在自己的页面框架里嵌入 ranui 浮层。** [z-index 阶梯](/cn/src/ranui/design-system/#stacking)从 1000 起，
所以 portal 出去的浮层自己就能越过普通的页面骨架。但留在自身 shadow DOM 里的 `position: fixed` 浮层
（`r-modal` 的对话框）最多只能逃到最近的祖先**层叠上下文**。如果你用会创建层叠上下文的东西
（`isolation`、`opacity < 1`、`transform`、`filter`、`will-change`）包住嵌入内容，只在浮层真正打开时
才抬高这个包裹层：

```css
.embed {
  isolation: isolate; /* cheap: no z-index of its own, so nothing is promoted */
}
/* Escalate only while a real overlay is open — never "just in case" */
.embed:has(r-modal[open]),
.embed:has(r-modal[closing]) {
  position: relative;
  z-index: 100;
}
```

给包裹层常驻一个 `z-index`，会让里面所有内容（包括静态内容）在整个滚动过程中都压在吸顶页头上面；
本站就曾经这样上线过。除了 `open` 也要匹配 `closing`：遮罩在关闭过渡期间还在绘制。

## 动效 {#motion}

高频反馈（悬停、聚焦、按下）即时响应。用动效解释变化时，反馈控制在 0–100ms；进入用 250–400ms，
减速收尾；离开用 150–200ms，逐渐加速。动效要能被打断，并尊重 `prefers-reduced-motion`。

**绝不要让颜色属性参与过渡。** CSS 分不清颜色**为什么**变了，所以加在 `background-color`、`color`、
`border-color`、`box-shadow`、`fill` 或 `stroke` 上的 `transition`，在**主题**切换时同样会触发：
页面已经切换完毕，各个元素却还按自己的节奏慢慢淡变。改用 `transform` 和 `opacity` 做动画。
`transition: all` 和只写时长的 `transition: 0.2s` 同样包含颜色属性。

## 状态与文案

每个可达状态都是设计的一部分：悬停、激活、聚焦、禁用、加载、空、错误。悬停对应 `bg-hover` /
`border-hover`，激活对应 `bg-active`，聚焦对应聚焦环。不能点击的东西不要看起来能点：`r-card`
只有加上 `hoverable` 才响应悬停。

文案同样是系统的一部分：

- **按钮**说明操作结果，上下文没交代对象时把对象写上，比如“删除成员”。对象已经明确的对话框可以只写“删除”；
  避免含糊的“确定”。
- **错误**先说发生了什么，再说怎么解决。✅“构建失败：产物超过体积上限。请精简产物或调高上限。”
  ❌“操作失败，请重试。”
- **确认提示**说明发生了什么变化，而不是只报成功，并且要等变化确认完成后再出现。✅“项目已删除”
  ❌“操作成功”。
- 让上下文消除冗余：标题已经是“删除项目”的对话框，按钮不需要再写“永久删除该项目，无法恢复”。

## 无障碍 {#accessibility}

- 文字与背景的对比度满足 **WCAG AA**。
- **绝不只用颜色表达状态**，要配上图标、标签或文字。
- 所有可交互元素都保留**可见的聚焦环**（`--ran-focus-ring`，或
  `outline: 2px solid var(--ran-color-focus); outline-offset: 2px`）。
- **一切都能用键盘操作。**
- 尊重 `prefers-reduced-motion` 和 `prefers-color-scheme`。

## 鼠标与触摸、窄屏与宽屏

输入方式和视口都不分主次。

- 拖拽、滑块和手势使用 **Pointer Events**，并在真正的拖拽面上设置 `touch-action: none`。
  设置了 `touch-action: none` 却没有对应的指针处理，就是一个坏掉的控件。
- **只在悬停时出现的功能需要点按兜底。** `r-select` 或 `r-popover` 的 `trigger="hover"` 在触摸设备上
  会变成点击，你自己写的组件也应该这样。
- **优先使用相对视口的尺寸**（`min(560px, calc(100vw - 32px))`、`clamp()`），不要新造断点：ranui
  没有断点令牌，每个硬断点都是一个得有人维护的数字。
- **绝不在移动端藏起完成某件事的唯一入口。** 改为重排。
- **量出来的位置只在下一次重排之前有效。** 基于 `getBoundingClientRect()` 算出的结果，在窗口缩放、
  容器重排时都会失效，portal 出去的面板在滚动时也会失效。直接在窄宽度下加载页面，测不到**从宽缩到窄**的过程，
  而问题恰恰出在这里。

## 组件库机器校验了哪些

`pnpm -F ranui verify:design` 在 ranui 自身源码里检查九条规则：不随主题切换的颜色兜底、裸颜色字面量、
间距和尺寸尺度、只支持鼠标的拖拽、会让 `hidden` 失效的 `:host` 规则、引用未声明令牌的兜底、
组件在自己的 shadow 树里查找元素，以及在构造函数之外构建 shadow 树。有意违反规则的那一行要用
`design-ok: <rule> <reason>` 注明。这些检查只覆盖配置好的源码目录；使用 ranui 的应用要运行自己的检查，
并亲自查看自己的页面。

## 设计图解 {#design-examples}

<DesignIllustrations />

## 证据与验收 {#evidence-and-acceptance}

设计指南里的[验证一次改动](/cn/src/design/guide#验证一次改动)说明了在真实浏览器里检查什么、报告什么：
哪些是观察到的，哪些只是推断，哪些没能检查。agent 的审查不等于用户验收。
