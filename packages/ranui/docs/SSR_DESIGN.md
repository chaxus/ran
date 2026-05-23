# SSR 技术设计文档

## 现有基础

`utils/builder/` 已提供完整的 SSR 基础设施：

| 模块 | 作用 |
|---|---|
| `env.ts` — `isSSR` | `typeof document === 'undefined'` 环境检测 |
| `mocks.ts` — `HTMLElementMock` / `ShadowRootMock` | 完整 mock DOM，含 `serialize()` 输出 DSD HTML |
| `core.ts` — `ElementBuilder` | fluent builder，构造时按 `isSSR` 分支，SSR 下用 mock |
| `factory.ts` — `DeclarativeShadow` | 直接生成 DSD template 元素 |

现有组件（`r-button`、`r-progress` 等）已通过 `Div()`、`View()` 等 factory 在 constructor 里建立 shadow DOM，**结构层面的 SSR 能力已就绪**。

---

## 已知 Bug（阶段三前修复）

### `ShadowRootMock.querySelector` 查询范围错误

**位置**：[utils/builder/mocks.ts:227](../utils/builder/mocks.ts#L227)

```typescript
// 当前实现：查询宿主的 childrenList，而不是 shadow root 自身的 childrenList
querySelector(selector: string): HTMLElementMock | null {
  return this.host.querySelector(selector);   // ← bug
}
```

shadow root 的子节点存在 `ShadowRootMock.childrenList`，宿主的 `childrenList` 里没有它们。目前不崩溃是因为 `Progress` 构造里走了 `if (!container)` 分支，但任何组件若在构造后对 shadow root 调用 `querySelector` 取引用，会静默返回 `null`。

**修复方向**：`ShadowRootMock` 自身实现 `collectMatches`，搜索 `this.childrenList`，不委托给 host。

---

## 实施阶段

> **顺序约束**：阶段五（registry）是阶段四（renderToStream）的前置依赖，必须先完成。

### 阶段一：CSS-first 重构（消除 JS 布局依赖）

目标：让 `r-progress` 和 `r-tabs` 变成真正 SSR 友好，初始渲染不依赖 `offsetWidth` / `getBoundingClientRect`。

#### `r-progress`

```typescript
// 当前：读取 offsetWidth 计算 dot 位置
const width = this._progress.offsetWidth;
this._progressDot.style.setProperty('transform', `translateX(${percentage * width}px)`);

// 目标：CSS 变量驱动，宽度交给 CSS 引擎
this.style.setProperty('--progress-percent', String(percent));
// CSS:
// .ran-progress-wrap-value { width: calc(var(--progress-percent) * 1%); }
// .ran-progress-dot { left: calc(var(--progress-percent) * 1%); transform: translateX(-50%); }
```

#### `r-tabs`

```typescript
// 当前：getBoundingClientRect 计算指示线偏移
// 目标：CSS 变量 --tab-active-index + CSS calc 驱动 translateX
this.style.setProperty('--tab-active-index', String(index));
```

#### 关键问题：`attributeChangedCallback` 在 SSR 下不触发

Node.js 里没有 custom elements registry，`setAttribute` 只会把值存进 `attributes` Map，`attributeChangedCallback` 不会被调用，CSS 变量不会被设置。

**解决方案**：组件重写 `serialize()` 方法，在序列化时从 `attributes` 读取属性并推导出应有的内联样式：

```typescript
// r-progress 示例
serialize(tagName?: string): string {
  const percent = this.getAttribute('percent') || '0';
  this.style.setProperty('--progress-percent', percent);  // 序列化前补齐 CSS 变量
  return super.serialize(tagName);
}
```

或者提供一个统一的 SSR 钩子：

```typescript
// utils/ssr-hooks.ts
export function applySSRAttributes(el: HTMLElement): void {
  // 触发 observedAttributes 对应的处理逻辑，但不依赖 attributeChangedCallback
  const ctor = el.constructor as typeof HTMLElement & { observedAttributes?: string[] };
  for (const attr of ctor.observedAttributes ?? []) {
    const value = el.getAttribute(attr);
    if (value !== null) (el as any)._applyAttr?.(attr, value);
  }
}
```

两种方案二选一，在阶段一开始前确定。

---

### 阶段三：按组件类型分层 SSR 策略

| 组件 | 策略 | 备注 |
|---|---|---|
| `r-button` / `r-input` / `r-checkbox` | 完全 SSR | 纯结构，CSS 驱动 |
| `r-progress` / `r-tabs` | 完全 SSR | 阶段一重构后支持 |
| `r-select` / `r-modal` / `r-popover` | SSR shell | 输出关闭状态结构 |
| `r-colorpicker` / `r-radar` / `r-scratch` | Placeholder SSR | 输出占位元素，canvas 客户端渲染 |
| `r-player` | Poster SSR | 输出 poster + 静态控制栏 HTML |

**注意**：`r-button` 表中标注"完全 SSR"，但其 ripple 效果使用了 `getBoundingClientRect`（[components/button/index.ts:135](../components/button/index.ts#L135)）。这段代码在事件处理器里，不影响 SSR 序列化输出，但需要在组件注释里说明，避免后续贡献者误判。

---

### 阶段五：`customElements` 注册机制（先于阶段四实施）

替代 `utils/ssr.ts` 里的硬编码 `tagMap`，解决新增组件需手动维护、拼写错误静默失败的问题。

```typescript
// utils/ssr-registry.ts
const registry = new Map<string, new () => HTMLElement>();

export function defineSSR(tagName: string, constructor: new () => HTMLElement): void {
  if (isSSR) {
    registry.set(tagName, constructor);
  } else {
    customElements.define(tagName, constructor);
  }
}

export function getSSRConstructor(tagName: string): (new () => HTMLElement) | undefined {
  return registry.get(tagName);
}
```

每个组件的注册语句从 `customElements.define('r-button', Button)` 改为 `defineSSR('r-button', Button)`。

---

### 阶段四：`renderToStream` API

依赖阶段五的 registry。

#### HTML 解析方案选型（需在实施前决策）

`renderToStream` 接收原始 HTML 字符串，需要在 Node.js 里解析出标签、属性、嵌套结构。这是阶段四工程量最大的部分。

| 方案 | 优点 | 缺点 |
|---|---|---|
| `node-html-parser` | 轻量（无依赖），API 接近 DOM | 不完全符合 HTML5 解析规范 |
| `htmlparser2` | 成熟，流式解析 | SAX 风格，需自行建树 |
| `parse5` | 完全符合 HTML5 规范 | 较重 |

推荐 `node-html-parser`：ranui 组件不会生成异常 HTML，规范合规性要求不高，轻量优先。

#### API 设计

```typescript
import { renderToStream } from 'ranui/ssr';

// Node.js HTTP handler
app.get('/', (req, res) => {
  const stream = renderToStream(`
    <r-button type="primary">Submit</r-button>
    <r-progress percent="65"></r-progress>
  `);
  stream.pipe(res);
});
```

内部实现为 `AsyncGenerator<string>`：解析 HTML → 通过 registry 实例化组件 → 调用 `serialize()` → yield 字符串块。静态 HTML 立即 yield，组件等实例化完成后 yield。

---

### 阶段六：父子组件关系

`r-select` + `r-option`、`r-tabs` + `r-tab` 在 SSR 下父组件拿不到子组件信息（浏览器里靠 `connectedCallback` 遍历已解析子元素，Node.js 里逐个实例化）。

解决方案：`renderToStream` 内部先建完整组件树，再自顶向下序列化：

```typescript
const tree = parseToComponentTree(html);  // 建立父子关系
const output = serializeTree(tree);       // 父组件序列化时可读取 children
```

涉及组件：`r-select`（读取 `r-option` 的 value/label）、`r-tabs`（读取 `r-tab` 的 label/key）、`r-form`（读取表单字段）。

---

### 阶段七：Next.js 集成验证

- Server Component 中使用 `renderToStream` 输出 DSD HTML
- Client Component 正常导入组件，DSD rehydration 在浏览器自动激活
- 验证 `'use client'` 边界对 Web Components 注册的影响
- 提供 `ranui/next` 适配入口（`transpilePackages`、`serverExternalPackages`）

浏览器兼容性：仅针对 Chrome、Firefox、Safari 最新版（均原生支持 DSD），不考虑 polyfill。

---

## 测试策略

### 核心问题

现有单元测试运行在 `vitest + jsdom` 里，`isSSR` 始终为 `false`，SSR 代码路径从未被执行。即使 SSR 功能完全损坏，现有测试也不会发现。

### 测试分层

```
test/
  unit/        ← 现有，jsdom 环境，测试浏览器行为
  ssr/         ← 新增，纯 Node.js 环境（无 DOM），测试序列化输出
  e2e/         ← 现有，Playwright，测试真实浏览器渲染
  fixtures/
    nextjs-app/ ← 阶段七新增，最小 Next.js 应用
```

### SSR 测试配置

新增 `vitest.config.ssr.ts`，`environment: 'node'` 彻底去除 DOM：

```typescript
// vitest.config.ssr.ts
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/ssr/**/*.test.ts'],
    globals: true,
  },
  resolve: { alias: { '@': path.resolve(__dirname) } },
});
```

### 各阶段对应测试

**阶段一** — `test/ssr/css-vars.test.ts`
```typescript
it('r-progress SSR output uses CSS variable', () => {
  const el = new Progress();
  el.setAttribute('percent', '65');
  const html = el.serialize();
  expect(html).toContain('--progress-percent:65');
  expect(html).not.toContain('translateX(');
});
```

**阶段三** — `test/ssr/components/`
```typescript
it('r-button serializes to valid DSD', () => {
  const el = new Button();
  const html = el.serialize();
  expect(html).toContain('<template shadowrootmode="closed">');
  expect(html).toContain('ran-btn');
});
```

**阶段四** — `test/ssr/stream.test.ts`
```typescript
it('renderToStream yields complete DSD HTML', async () => {
  const chunks: string[] = [];
  for await (const chunk of renderToStream('<r-button>Submit</r-button>')) {
    chunks.push(chunk);
  }
  const html = chunks.join('');
  expect(html).toContain('<template shadowrootmode="closed">');
});
```

**阶段五** — `test/ssr/registry.test.ts`
```typescript
it('defineSSR registers and retrieves constructor', () => {
  defineSSR('r-test', TestComponent);
  expect(getSSRConstructor('r-test')).toBe(TestComponent);
});
```

**阶段六** — `test/ssr/parent-child.test.ts`
```typescript
it('r-select SSR includes option labels from children', async () => {
  const html = await collect(renderToStream(`
    <r-select>
      <r-option value="a">Apple</r-option>
    </r-select>
  `));
  expect(html).toContain('Apple');
});
```

### DSD 快照测试

```typescript
// test/ssr/snapshots/button.test.ts
it('r-button DSD snapshot', () => {
  expect(new Button().serialize()).toMatchSnapshot();
});
```

快照提交到 git，`serialize()` 输出变化时 CI 失败，要求显式更新（`vitest --update-snapshots`）。

### `package.json` 脚本

```json
{
  "test:ssr": "vitest run --config vitest.config.ssr.ts",
  "test:ssr:watch": "vitest --config vitest.config.ssr.ts",
  "test:all": "npm run test:unit && npm run test:ssr && npm run test:e2e"
}
```

### 覆盖率目标

| 套件 | 环境 | 目标 |
|---|---|---|
| `test:unit` | jsdom | 现有阈值（80/70/85/80） |
| `test:ssr` | node | `utils/builder/`、`utils/ssr.ts` 行覆盖 ≥ 90% |
| `test:e2e` | Chromium | 视觉回归，Argos CI 对比 |
| Next.js E2E | Chromium | FOUC 验证，hydration 正确性 |

---

## 实施顺序总结

```
修复 ShadowRootMock.querySelector bug
  → 阶段一（CSS-first，同时确定 attributeChangedCallback 方案）
  → 阶段三（分层策略 + test/ssr/ 目录建立）
  → 阶段五（registry，先于 renderToStream）
  → 阶段四（renderToStream，先做 HTML 解析库选型）
  → 阶段六（父子组件）
  → 阶段七（Next.js 验证）
```

Canvas 组件（`r-colorpicker`、`r-radar`、`r-scratch`）的构建时静态生成（原阶段八）代价高于收益，默认跳过，有明确需求时再评估。
