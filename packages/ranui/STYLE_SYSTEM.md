# ranui 现代化组件库整体优化方案

> Last updated: 2026-03-07  
> 本文档是 ranui 迈向现代标准 Web Components 组件库的完整路线图。

---

## 总览

```
ranui 现代化目标
├── 1. 样式系统   → 移除黑盒插件，显式 adoptStyles()
├── 2. 组件架构   → 统一 Builder 模式，取代 document.createElement 散装写法
├── 3. SSR & DSD  → Declarative Shadow DOM，服务端渲染开箱即用
├── 4. 无障碍     → WAI-ARIA 规范对齐，键盘导航完整
├── 5. 类型系统   → 完整 TypeScript 类型，提升 IDE 体验
├── 6. 工程化     → 统一目录规范、测试基础设施
└── 7. 开发者体验 → 文档、示例、变更日志自动化
```

---

## 一、样式系统重构

### 现状问题
`plugins/load-style.ts` 通过正则匹配 `attachShadow` 语句来自动注入样式 `<style>` 标签。  
任何代码风格变化（如 DSD 安全写法）都会导致样式静默丢失，且行为对开发者完全不透明。

### 改造目标
- 移除 `plugins/load-style.ts`
- 新增 `utils/style.ts`，提供 `adoptStyles()` 工具函数
- 每个组件**显式**导入和注入自己的样式

### 核心实现

**`utils/style.ts`**
```ts
const sheetCache = new Map<string, CSSStyleSheet>();

export const adoptStyles = (shadowRoot: ShadowRoot, cssText: string): void => {
  if (typeof document === 'undefined') return; // SSR 守卫

  // 优先 Constructable Stylesheets：百实例共享一份解析结果，性能最佳
  if (typeof CSSStyleSheet !== 'undefined') {
    try {
      if (!sheetCache.has(cssText)) {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(cssText);
        sheetCache.set(cssText, sheet);
      }
      const sheet = sheetCache.get(cssText)!;
      if (!shadowRoot.adoptedStyleSheets.includes(sheet)) {
        shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
      }
      return;
    } catch {}
  }

  // 降级：<style> 标签，幂等注入
  if (!shadowRoot.querySelector('style[data-ranui]')) {
    const style = document.createElement('style');
    style.setAttribute('data-ranui', '');
    style.textContent = cssText;
    shadowRoot.appendChild(style);
  }
};
```

**组件使用**
```ts
// components/button/index.ts
import buttonCss from './index.less?inline';
import { adoptStyles } from '@/utils/style';

constructor() {
  super();
  this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
  adoptStyles(this._shadowDom, buttonCss);
}
```

### 使用方定制样式 — 四种标准方式

| 方式 | 场景 | 示例 |
|------|------|------|
| **CSS 变量** `--ran-*` | 全局主题、批量覆盖 | `r-button { --ran-btn-content-background-color: #6c47ff; }` |
| **`::part()`** | 精细结构样式覆盖 | `r-button::part(ran-btn-content) { border-radius: 999px; }` |
| **`sheet` 属性** | 程序化/动态注入 | `<r-button sheet=".ran-btn-content { ... }">` |
| **Slot 内容** | 自定义插槽内容样式 | `<r-button><strong style="color:red">文字</strong></r-button>` |

> **原则**：组件内部所有 CSS 值均使用 `var(--token, 默认值)` 写法，使用方只需覆盖变量即可定制任意样式。
> 
> **权重建议**：组件内部默认样式优先使用 `:host` 或 `:host(selector)` 声明。这样外部通过标签名设置的样式具有更高权重，方便用户覆盖，避免强制使用 `!important`。

---

## 二、组件架构：Builder 模式统一

### 现状问题
组件构造函数大量使用原始 `document.createElement` + `setAttribute` 的散装写法，代码冗长、结构不直观、难以维护，且每次修改 DOM 结构需要同步修改多处代码。

```ts
// ❌ 旧写法 —— 命令式，冗长，难以看出 DOM 结构
this._progress = document.createElement('div');
this._progress.setAttribute('class', 'ran-progress');
this._progressWrap = document.createElement('div');
this._progressWrap.setAttribute('class', 'ran-progress-wrap');
this._progress.appendChild(this._progressWrap);
// ... 重复 N 遍
```

### 改造目标
统一使用 `utils/builder.ts` 提供的 **ElementBuilder** 声明式 API：

```ts
// ✅ 新写法 —— 声明式，结构即代码，一目了然
const container = Div().class('ran-progress').role('progressbar')
  .children(
    Div().class('ran-progress-wrap')
      .children(Div().class('ran-progress-wrap-value')),
    Div().class('ran-progress-dot'),
  ).build();

this._shadowDom.appendChild(container);
this._progressWrap = container.querySelector('.ran-progress-wrap')!;
```

### 全组件 Builder 化策略（新增）

结论：**默认推荐全组件采用 Builder**，但不是机械性“一刀切”。

统一规则：
1. 组件静态结构（容器、header、content、slot、按钮等）必须使用 Builder 构建。
2. 运行时业务节点（如 canvas/video、第三方库挂载点）允许直接原生 API 操作。
3. SSR/DSD 场景统一遵循“查找 -> 复用 -> 创建”流程，避免覆盖服务端 DOM。

边界组件（允许部分原生写法）：
- `player`（video/hls 事件驱动，动态节点多）
- `radar`（canvas 绘制型组件）
- `scratch`（手势+canvas）

这些组件仍需满足：
- 外层结构使用 Builder
- 生命周期清理完整（`disconnectedCallback`）
- 样式注入统一走 `adoptStyles`

### 是否“全量 Builder 化”更好？（评估）

是，但前提是按边界执行。

收益：
1. 组件结构可读性明显提升，DOM 层级更直观。
2. SSR/DSD 注水路径更统一，减少重复逻辑和回归风险。
3. 便于统一无障碍属性（`role`/`aria-*`/`tabIndex`）下沉到 Builder 链式 API。
4. 组件重构和审查成本更低，变更更可控。

风险：
1. 对 canvas/video 等强动态组件，强行全 Builder 反而会增加抽象噪音。
2. 一次性全量迁移成本高，容易引入行为回归。

建议执行方式：
1. 先迁移静态结构组件（Button/Input/Select/Modal/Tab）。
2. 再迁移复杂组件的“外层结构”，保留核心绘制逻辑原生实现。
3. **性能建议**：对于高性能列表（如 `Select` 选项、`Tab` 头部），优先在父级容器上使用**事件代理 (Event Delegation)**，避免在 Builder 链式调用中为每个子节点绑定 `on('click')`。
4. 每次迁移后补最小回归用例（属性、事件、键盘行为、SSR 复用）。

### 现有 Builder API 速查

```ts
import { Div, Span, Slot, View, ButtonBuilder, InputBuilder, Label } from '@/utils/builder';

// 工厂函数（任意标签）
View('section').class('wrapper').attr('role', 'main')

// 常用快捷方式
Div()          // <div>
Span()         // <span>
Slot()         // <slot>
ButtonBuilder() // <button>
InputBuilder()  // <input>

// 链式 API
Div()
  .class('container')          // className
  .id('my-id')                 // id
  .attr('data-x', 'value')     // 任意属性
  .role('button')              // role
  .tabIndex(0)                 // tabindex
  .aria('label', 'Close')      // aria-*
  .style('color', 'red')       // 内联样式
  .on('click', handler)        // 事件绑定
  .children(Div(), Span())     // 子节点
  .text('内容')                 // 文本内容
  .ref(myRef)                  // ref 引用
  .build()                     // 生成 HTMLElement
```

### 手术级注水（Surgical Rehydration）与 `querySelector`

在审查组件（如 `Button`）源码时，常会看到大量的 `this._shadowDom.querySelector('...')`。这并非多此一举，而是**为了无缝支持 SSR 和 DSD 注水**的核心机制。

**为什么必须这样写？**
当使用 SSR + Declarative Shadow DOM 时，服务端返回的 HTML 中已经包含了完整的 Shadow DOM 结构和预先计算好的类名：
```html
<r-button>
  <template shadowrootmode="closed">
    <!-- 下列内容在 JS 执行前已经在浏览器中渲染就绪 -->
    <style>...</style>
    <div class="ran-btn" role="button" tabindex="0">
      <div class="ran-btn-content"><slot class="slot"></slot></div>
    </div>
  </template>
</r-button>
```
如果直接 `this._shadowDom.appendChild(创建新DOM)`，会把服务端渲染好的内容全部冲刷掉，导致页面白屏闪烁（FOUC），破坏了 SSR 的首屏优势。

**正确的实现规范（查找 -> 复用 -> 绑定）：**
```ts
constructor() {
  super();
  // 1. 获取（或创建）Shadow DOM
  this._shadowDom = this.shadowRoot || this.attachShadow({ mode: 'closed' });
  adoptStyles(this._shadowDom, buttonCss);

  // 2. 尝试寻找是否已经有服务端渲染好的外层容器
  let btn = this._shadowDom.querySelector('.ran-btn') as HTMLDivElement;
  
  // 3. 如果没找到（纯 CSR 渲染场景），才走 Builder 创建 DOM
  if (!btn) {
    btn = Div().class('ran-btn').role('button').tabIndex(0)
      .children(
        Div().class('ran-btn-content')
          .children(Slot().class('slot'))
      ).build();
    this._shadowDom.appendChild(btn);
  }
  
  // 4. 将引用赋给实例属性，后续事件绑定统一使用引用
  this._btn = btn;
  // 以下统一基于找到了（或新创建）的外层容器进行内部查询
  this._btnContent = btn.querySelector('.ran-btn-content') as HTMLDivElement;
  this._slot = btn.querySelector('.slot') as HTMLSlotElement;
}
```
这种混合模式保证了组件在纯客户端（例如 SPA 管理后台）和同构应用（例如 Next.js 博客官网）中都能有最佳的性能表现。

### 浏览器兼容性基准

| 特性 | 最低版本支持 | Polyfill / 降级策略 |
|------|------------|-------------------|
| Constructable Stylesheets | Chrome 73, Safari 14.1, Firefox 101 | 降级为 `<style>` 标签注入 |
| Declarative Shadow DOM | Chrome 90, Safari 16.4, Firefox 123 | 手动执行 `hydrateShadowRoots` 脚本 |
| `::part()` / `::slotted()` | Chrome 73, Safari 13.1, Firefox 72 | 无（核心 Web 标准） |


---

## 三、SSR & Declarative Shadow DOM (DSD)

### 现状
组件在 Node.js 环境会因 `HTMLElement` 不存在而报错，无法在 SSR 框架（Next.js、Nuxt 等）中使用。

### 方案

#### 3.1 `RanElement` 统一基类（已完成）
```ts
// utils/index.ts
export const HTMLElementSSR = () =>
  typeof document !== 'undefined' ? HTMLElement : HTMLElementMock;

export const RanElement = HTMLElementSSR()!;

// 组件
export class Button extends RanElement { ... }
```

#### 3.2 Declarative Shadow DOM 支持
```html
<!-- SSR 输出的 HTML（浏览器无需 JS 即可看到样式）-->
<r-button type="primary">
  Submit
  <template shadowrootmode="closed">
    <style>/* 内联样式 */</style>
    <div class="ran-btn" role="button" tabindex="0">
      <div class="ran-btn-content">
        <slot></slot>
      </div>
    </div>
  </template>
</r-button>
```

#### 3.3 `renderToString` 工具（已有 `utils/ssr.ts`）
```ts
import { renderToString } from '@/utils/ssr';
const html = renderToString('r-button', { type: 'primary' }, 'Submit');
// → 完整的 DSD HTML 字符串
```

#### 3.4 首屏渲染优化
DSD 让浏览器在 JavaScript 加载前就能渲染组件外观，消除布局偏移（CLS），提升首屏指标。

---

## 四、无障碍（Accessibility）增强

### WAI-ARIA 规范对齐

| 组件 | 需要的 ARIA 属性 | 键盘行为 |
|------|-----------------|----------|
| `Button` | `role="button"` `aria-disabled` | `Enter`/`Space` 激活 |
| `Input` | `aria-label` `aria-invalid` `aria-describedby` | `Tab` 聚焦 |
| `Select` | `role="combobox"` `aria-expanded` `aria-controls` | `↑↓` 导航，`Enter` 选择，`Esc` 关闭 |
| `Checkbox` | `role="checkbox"` `aria-checked` | `Space` 切换 |
| `Progress` | `role="progressbar"` `aria-valuenow` `aria-valuemin` `aria-valuemax` | — |
| `Modal` | `role="dialog"` `aria-modal` `aria-labelledby` | `Esc` 关闭，焦点陷阱 |
| `Tab` | `role="tablist"` / `role="tab"` | `←→` 切换，不响应 `Tab` |

### 实施原则
1. 所有交互元素必须可通过键盘访问
2. 动态内容变化通过 `aria-live` 通知屏幕阅读器
3. 禁用状态同步 `disabled` 属性和 `aria-disabled` 属性
4. 颜色对比度 ≥ 4.5:1（WCAG AA 标准）

### Icon 组件最优设计（新增）

针对 `r-icon` 这类高频基础组件，推荐采用如下标准：

1. 极致体积策略：**不在组件内部扫描全量 icon**，改为显式注册（`registerIcon/registerIcons`）。
2. 使用时序策略：在应用入口里先执行图标注册，再启动组件渲染，避免初始化阶段出现 `icon not registered` 警告。
2. 默认视觉：图标尺寸默认 `1em`，颜色默认 `currentColor`，天然跟随文本排版和主题色。
3. 无障碍策略：
   - 装饰性图标默认 `aria-hidden="true"`。
   - 语义图标通过 `aria-label` 暴露，宿主元素设置 `role="img"`。
4. 性能策略：注册后缓存 SVG 文本，避免重复解析。
5. 组件自治策略：高频组件可在模块内部注册自身依赖图标（如 `message` 注册 `info-circle-fill/check-circle-fill/warning-circle-fill/close-circle-fill`），减少业务接入负担。
6. 诊断策略：开发环境对未注册图标输出 `console.warn`，生产环境静默降级。

实现示例（仅打包用到的图标）：

```ts
import { registerIcons } from 'ranui/components/icon';
import home from './icons/home.svg?raw';
import setting from './icons/setting.svg?raw';

registerIcons({
  home,
  setting,
});

// 之后再启动应用渲染
bootstrap();
```

说明：
`r-icon name="home"` 只有在 `home` 被显式 import + register 后才可渲染。这样业务项目只会把实际使用的 icon 打入产物。

建议保持“显式注册”作为唯一入口，不引入 preset 层。这样项目侧的 icon 依赖边界最清晰，便于做包体积审计和按页面拆分。

补充说明：
若组件内部会固定使用一组 icon（例如 message 的状态图标），可以在组件模块内部调用一次 `registerIcons` 完成自注册。这部分 icon 只会随着该组件被引入而进入产物，不会影响未使用该组件的业务包体积。

---

## 五、TypeScript 类型完善

### 目标：完整的组件属性类型声明

```ts
// types/components.d.ts（待创建）
declare global {
  interface HTMLElementTagNameMap {
    'r-button': Button;
    'r-icon': Icon;
    'r-input': Input;
    'r-select': Select;
    'r-progress': Progress;
    // ...所有组件
  }
}
```

这样使用方在 TypeScript 项目中访问 `document.querySelector('r-button')` 时会得到完整的类型提示，而不是 `HTMLElement`。

### 组件属性接口
```ts
export interface ButtonProps {
  type?: 'primary' | 'warning' | 'text' | 'default';
  disabled?: boolean;
  icon?: string;
  iconSize?: string;
  sheet?: string;
}
```

---

## 六、工程化规范

### 6.1 组件目录结构标准化

```
components/button/
├── index.ts        ← 组件逻辑（Builder + adoptStyles）
├── index.less      ← 组件样式（全部用 CSS 变量）
└── ../test/button.contract.test.ts   ← 单元测试（已接入）
```

### 6.2 测试基础设施

目前缺乏自动化测试。建议分三层：

| 层次 | 工具 | 内容 |
|------|------|------|
| 单元测试 | Vitest | 组件属性读写、方法调用、事件触发 |
| 组件/集成测试 | Playwright | 在真实浏览器中测试交互链路与布局行为 |
| 视觉回归 | Playwright screenshot / Percy (可选) | 捕捉样式改动导致的视觉变化 |

### 6.3 `disconnectedCallback` 内存泄漏规范

**已发现的问题**：多个组件将 `disconnectedCallback` 误写为 `disconnectCallback`，导致组件销毁时事件监听器没有被清理，造成内存泄漏。

**规范**：每个注册了事件监听器的组件，**必须**在 `disconnectedCallback` 中移除。

**质量工具计划**：
- 引入自定义 ESLint 插件，强制检查继承自 `RanElement` 的类名：
  - 是否包含 `disconnectedCallback` 且未拼写错误。
  - 是否正确调用了 `super.disconnectedCallback()`（如果基类有逻辑）。

---

## 七、开发者体验（DX）

### 7.1 `index.html` 开发预览（已完成）
- 所有组件分区展示，含 DSD 注水示例
- 支持 `message.info/success/warning/error` 快捷方法

### 7.2 变更日志
建议引入 [Conventional Commits](https://www.conventionalcommits.org/) 规范，配合 `changeset` 或 `release-it` 自动生成 `CHANGELOG.md`。

### 7.3 组件文档模板（待完善）

每个组件的文档应包含：
- Props 表（名称、类型、默认值、说明）
- CSS 变量表（所有 `--ran-*` token）
- `::part()` 列表
- 代码示例（基础用法 / 所有 type / 无障碍用法）

---

## 八、执行优先级路线图

### 🔴 P0 — 立即（修复现有 Bug）
- [x] 迁移 Button 和 Icon 样式系统到 `adoptStyles()`（当前不可见）
- [x] 修复 `ReferenceError: _shadowDom is not defined`（插件兼容性修复）

- [x] 新增 `utils/style.ts` + 全量迁移组件样式 (24 个组件已完成)
- [x] 删除 `plugins/load-style.ts`
- [x] 迁移 Player 和 ColorPicker 到 Shadow DOM 架构
- [x] Button / Select / Modal 无障碍硬缺陷修复（键盘导航、焦点陷阱）
- [x] Icon 最优架构升级（glob 静态映射、`currentColor`/`1em` 默认、a11y 默认策略）

### 🟡 P2 — 中期（品质提升）
- [ ] 组件默认 Builder 化完成（静态结构 100%，动态绘制组件按边界保留原生逻辑）
- [ ] `HTMLElementTagNameMap` 全量类型声明
- [ ] DSD `renderToString` 集成到 SSR 示例

### 🟢 P3 — 长期（持续完善）
- [ ] 单元测试覆盖率 ≥ 80%
- [ ] 视觉回归测试
- [ ] Conventional Commits + 自动 CHANGELOG
- [ ] 组件文档站
