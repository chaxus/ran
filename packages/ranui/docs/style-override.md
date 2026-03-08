# ranui 组件样式覆盖设计规范

> Last updated: 2026-03-08
> 本文档定义 ranui 组件库样式定制的最佳实践，作为后续开发的实施依据。

---

## 一、背景与问题

Web Components 的 Shadow DOM 提供了天然的样式隔离，但这也带来了外部样式定制的挑战。

**当前已实现的基础**：
- 所有组件通过 `adoptStyles(shadowRoot, css)` 显式注入样式
- 所有 CSS 值已用 `var(--ran-*, 默认值)` 形式声明
- 部分组件已通过 `part` 属性暴露内部元素

**当前存在的问题**：
1. `--ran-*` 变量命名不系统，缺乏分层约定
2. `::part()` 暴露不完整，无法精细定制
3. 嵌套组件（如 `r-player` 内的 `r-select` 内的 `r-dropdown`）的样式作用域问题未解决
4. 开发者无法通过文档快速了解哪些 token 和 parts 可供定制

---

## 二、样式覆盖的四种标准方式

### 方式 1：CSS Custom Properties（首选）

**适用**：颜色、字体、间距、圆角等主题变量调整

```css
/* 在任意外部 CSS 中设置，CSS 变量会自动穿透 Shadow DOM */
r-button {
  --ran-btn-background: #6c47ff;
  --ran-btn-color: #fff;
}

/* 配合 class 实现按语境覆盖 */
.dark-theme r-select {
  --ran-select-background: #1a1a1a;
  --ran-select-color: #fff;
}
```

**原则**：
- 每个 CSS 属性必须由 `var(--ran-[组件]-[状态]-[属性], 默认值)` 控制
- 变量命名规则见第三节

---

### 方式 2：`::part()` 伪元素（次选）

**适用**：需要覆盖组件内部特定元素的完整样式（布局、transform 等 CSS 变量难以覆盖的）

```css
/* 组件内部用 part="name" 暴露 */
/* index.ts: Div().part('selection').build() */

/* 外部用 ::part() 定制 */
r-select::part(selection) {
  border-radius: 999px;
  border-color: purple;
}

r-button::part(content) {
  display: flex;
  align-items: center;
  gap: 8px;
}
```

**规范**：
- 所有对外部定制有价值的内部节点都应标注 `part` 属性
- part 名称采用 kebab-case，不带 `ran-` 前缀
- 每个组件的 parts 必须在文档中列出

---

### 方式 3：`sheet` 属性（程序化/动态定制）

**适用**：需要在 JS 中动态注入样式，或父组件需要精确控制子组件内部 Shadow DOM 样式

```html
<!-- 直接在 HTML 中传入 CSS 字符串 -->
<r-button sheet=".ran-btn-content { border-radius: 999px; }"></r-button>
```

```ts
// 在 JS 中动态修改
const btn = document.querySelector('r-button');
btn.setAttribute('sheet', `.ran-btn-content { background: ${themeColor}; }`);
```

**组件实现要求**：
```ts
// 在 attributeChangedCallback 里响应 sheet 变化
if (name === 'sheet' && newValue) {
  try {
    const sheet = new CSSStyleSheet();
    sheet.insertRule(newValue);
    this._shadowDom.adoptedStyleSheets = [
      ...this._shadowDom.adoptedStyleSheets,
      sheet,
    ];
  } catch (e) {
    console.error(`[ranui] Failed to apply sheet: ${e}`);
  }
}
```

---

### 方式 4：Slot 内容（插槽自定义）

**适用**：自定义模板内容（内容本身在 Light DOM，可以用任何外部样式）

```html
<r-button>
  <!-- slot 内容在 Light DOM，可以用任何外部 CSS -->
  <span style="font-weight: bold; color: red;">自定义文字</span>
</r-button>
```

---

## 三、CSS Token 命名规范

### 命名格式

```
--ran-[组件]-[元素]-[状态]-[属性]
```

| 片段 | 说明 | 示例 |
|------|------|------|
| `ran` | 统一前缀 | |
| `[组件]` | 组件名（与标签名去掉 `r-` 后一致） | `btn`, `select`, `dropdown`, `player` |
| `[元素]` | 内部元素名（可选） | `selection`, `icon`, `content` |
| `[状态]` | 交互状态（可选） | `hover`, `focus`, `active`, `disabled` |
| `[属性]` | CSS 属性名（kebab-case） | `background-color`, `color`, `border-radius` |

### 示例

```css
/* Button */
--ran-btn-background-color
--ran-btn-color
--ran-btn-hover-background-color
--ran-btn-disabled-opacity

/* Select */
--ran-select-selection-background-color
--ran-select-selection-border
--ran-select-selection-hover-border

/* Dropdown（Select 的弹出层）*/
--ran-dropdown-background
--ran-dropdown-option-item-color
--ran-dropdown-option-item-hover-background-color
--ran-dropdown-option-active-background-color
```

---

## 四、嵌套组件的样式作用域问题

### 问题描述

当组件 A 内部使用了组件 B（B 又内部使用了 C），例如：
```
r-player (Shadow DOM A)
  └─ r-select (Shadow DOM B)
       └─ r-dropdown (Shadow DOM C)
```

此时从 A 的 Shadow DOM 样式表，如何定制 C 的内部样式？

### 解决方案：`dropdownclass` + Shadow Root 容器

**核心机制**：
1. `r-select` 提供 `getPopupContainerId` 属性，指定弹层挂载的容器 ID
2. `r-select` 的 `createOption()` 用 `getRootNode().getElementById()` 在自己的宿主 Shadow Root 内查找容器
3. `r-dropdown` 被挂载进 **A 的 Shadow DOM** 内部
4. 此时 A 的 Shadow 样式表里的类选择器（如 `.video-speed-dropdown`）对 `r-dropdown` 宿主元素可见
5. CSS 变量从 `r-dropdown` 宿主自动穿透进入其 Shadow DOM

```ts
// r-player 内正确的写法
const playerIdentifier = 'ran-player' + uniqueId;
const speedSelect = View('r-select')
  .attr('getPopupContainerId', playerIdentifier)  // ← 指向 r-player shadow 内的容器
  .attr('dropdownclass', 'video-speed-dropdown')  // ← 在 player shadow 样式里有定义
  .build();

// .ran-player div 也需要 id= playerIdentifier
const player = Div().id(playerIdentifier).build();
```

```less
// player/index.less：在 r-player 的 shadow 样式里定义 dropdown 的样式
.video-speed-dropdown {
  --ran-dropdown-background: rgba(43, 43, 43, 0.9);
  --ran-dropdown-option-item-color: #fff;
  --ran-dropdown-option-item-hover-background-color: rgba(255, 255, 255, 0.15);
}
```

**关键修复**（`r-select/index.ts`中必须正确实现）：
```ts
// createOption() 中
const root = this.getRootNode() as ShadowRoot | Document;
const container =
  (root.getElementById ? root.getElementById(this.getPopupContainerId) : null) ||
  document.getElementById(this.getPopupContainerId) ||
  document.body;

// placementPosition() 中
const rootNode = this.getRootNode() as ShadowRoot | Document;
const root =
  (rootNode.getElementById ? rootNode.getElementById(this.getPopupContainerId) : null) ||
  document.getElementById(this.getPopupContainerId);
```

### 不应该做的

```ts
// ❌ 错误：直接把样式变量硬编码进组件 TS 代码
.attr('dropdownstyle', '--ran-dropdown-background:rgba(43,43,43,0.92);...')

// ❌ 错误：用 !important 强制覆盖
// ❌ 错误：在组件内部直接引用外部 DOM
```

---

## 五、各组件 Part 暴露规范

每个组件应该暴露如下 part：

| 组件 | 应暴露的 part |
|------|--------------|
| `r-button` | `content`（内容区） |
| `r-input` | `input`（原生 input）, `content`（外层容器） |
| `r-select` | `selection`（触发区）, `icon`（箭头图标）, `selection-item`（选中文本） |
| `r-dropdown` | `dropdown`（弹层根元素） |
| `r-dropdown-item` | `item`（每个选项） |
| `r-modal` | `dialog`（弹窗容器）, `header`, `body`, `footer` |
| `r-progress` | `track`（轨道）, `fill`（填充条）, `dot`（拖拽点） |

---

## 六、实施路线图

### 🔴 P0：基础修复（当前阶段）

- [x] `r-select` createOption/removeSelectDropdown/placementPosition 支持 Shadow Root 查找
- [ ] 统一所有 CSS 变量命名为规范格式（增量，不破坏现有 API）
- [ ] 补全 `r-select` 和 `r-dropdown` 的 part 暴露

### 🟡 P1：系统化完善（下阶段）

- [ ] 为每个组件生成完整的 CSS Token 文档（可自动从 `.less` 文件提取）
- [ ] 为复杂嵌套组件（`r-player`, `r-popover`）补全 `getPopupContainerId` + `dropdownclass` 机制文档
- [ ] `sheet` 属性在所有组件中实现完整的 `attributeChangedCallback` 响应

### 🟢 P2：开发者体验（长期）

- [ ] 组件文档中自动生成 CSS Token 表格和 `::part()` 列表
- [ ] 提供官方 Dark Mode 主题包（通过 CSS 变量覆盖）
- [ ] 提供 Token 映射工具，支持从设计系统（如 Figma Token）一键生成变量文件

---

## 七、快速参考

```css
/* 全局主题覆盖 */
:root {
  --ran-btn-background-color: #6c47ff;
  --ran-btn-hover-background-color: #5535dd;
}

/* 局部组件定制 */
.my-special-select::part(selection) {
  border-radius: 999px;
}

/* 嵌套弹层样式（需在对应 Shadow Root 内定义） */
.my-dark-dropdown {
  --ran-dropdown-background: rgba(0, 0, 0, 0.8);
  --ran-dropdown-option-item-color: #fff;
}
```
