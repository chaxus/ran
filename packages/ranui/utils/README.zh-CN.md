# RanUI 工具集

该目录包含 RanUI 组件共享的工具：Shadow DOM 初始化、链式 DOM 构建器、SSR 注册与序列化、主题工具、样式注入，以及小型 DOM 辅助方法。

## 组件工具 (`component.ts`)

在每个组件构造函数和属性同步逻辑中使用这些辅助方法。

```ts
import {
  ensureShadowElement,
  ensureShadowRoot,
  getStringAttribute,
  setBooleanAttribute,
  setStringAttribute,
  syncSheetAttribute,
} from '@/utils/component';
```

| API                                                        | 说明                                                                          |
| :--------------------------------------------------------- | :---------------------------------------------------------------------------- |
| `ensureShadowRoot(host, cssText?, options?)`               | 创建或复用缓存的 Shadow Root，并应用组件 CSS；不要直接调用 `attachShadow()`。 |
| `ensureShadowElement(root, selector, factory)`             | 从 Shadow Root 查询已有元素；如果不存在，则追加 `factory` 返回的元素。        |
| `getStringAttribute(element, name, fallback?)`             | 读取属性，并在属性不存在时返回字符串兜底值。                                  |
| `setStringAttribute(element, name, value, options?)`       | 设置字符串属性；`removeEmpty: true` 会移除空值。                              |
| `setBooleanAttribute(element, name, value, options?)`      | 设置或移除布尔属性，可选同步到 `aria-*` 属性。                                |
| `syncSheetAttribute(host, root, name, oldValue, newValue)` | `sheet` 属性变化时，通过 `adoptSheetText` 应用动态样式。                      |

组件约定：

- `observedAttributes` 始终包含 `sheet`。
- 在 `connectedCallback` 和 `attributeChangedCallback` 的 `sheet` 分支中始终调用 `syncSheetAttribute`。
- `attributeChangedCallback` 始终使用 `if (old === next) return;` 作为保护。

## 元素构建器 (`builder/`)

`ElementBuilder` 提供链式 API 用于构建 DOM 元素。它支持 SSR，并能让组件构造函数保持简洁。

这种写法接近 SwiftUI “根据状态描述视图”的模型，但底层仍然是平台原生 DOM API。`Div()`、`ButtonBuilder()` 等工厂函数描述元素树，类似 modifier 的链式方法负责挂载属性、样式、文本、子节点、ref 和事件，最后由 `build()` 返回真实 `HTMLElement` 或 SSR mock。

### 基础用法

```ts
import { ButtonBuilder, Div, Slot, Span } from '@/utils/builder';

const card = Div()
  .class('card')
  .part('card')
  .children(
    Span().text('Hello World'),
    ButtonBuilder()
      .label('Click Me')
      .on('click', () => console.log('Clicked')),
    Slot().attr('name', 'extra'),
  )
  .build();
```

### 声明式 UI 结构

静态 DOM 结构优先用 builder 链式调用描述：

```ts
const toolbar = Div()
  .class('toolbar')
  .children(
    ButtonBuilder()
      .part('button')
      .text('保存')
      .on('click', handleSave),
    ButtonBuilder()
      .part('button')
      .text('取消')
      .on('click', handleCancel),
  )
  .build();
```

如果状态变化需要更新已构建的节点，用 `createEffect` 做局部 DOM 更新：

```ts
import { ButtonBuilder, createEffect, Div, signal, Span } from '@/utils/builder';

const [count, setCount] = signal(0);
const label = Span().build();

createEffect(() => {
  label.textContent = `Count: ${count()}`;
});

const view = Div()
  .children(
    label,
    ButtonBuilder()
      .text('+')
      .on('click', () => setCount((n) => n + 1)),
  )
  .build();
```

### 工厂函数

这些工厂函数都会返回 `ElementBuilder<T>`：

```ts
Div();
Span();
Slot();
ButtonBuilder();
InputBuilder();
Label();
Style();
Ul();
Li();
Section();
Article();
Nav();
Header();
Footer();
Main();
```

### API 参考

| 方法                                                  | 说明                                                                                                                      |
| :---------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| `id(value)`                                           | 设置元素 ID。                                                                                                             |
| `class(value)`                                        | 设置完整 class 字符串。                                                                                                   |
| `addClass(...names)` / `removeClass(...names)`        | 增量添加或移除 class。                                                                                                    |
| `attr(name, value)` / `attrs(record)`                 | 设置属性。`attrs` 会跳过 `null` 和 `undefined` 值。                                                                       |
| `boolAttr(name, value, enabledValue?)`                | 切换布尔属性。                                                                                                            |
| `part(value)`                                         | 设置 `part` 属性，用于 `::part()` 样式覆盖。                                                                              |
| `data(key, value)`                                    | 设置 `data-*` 属性。                                                                                                      |
| `style(key, value)` / `style(map)`                    | 设置内联样式。                                                                                                            |
| `cssVar(name, value)`                                 | 设置 CSS 自定义属性；省略 `--` 时会自动补齐。                                                                             |
| `aria(key, value)` / `role(value)`                    | 设置可访问性属性。                                                                                                        |
| `tabIndex(value)`                                     | 设置 `tabindex`。                                                                                                         |
| `label(value)` / `labelledBy(id)` / `describedBy(id)` | 设置常用 ARIA 命名属性。                                                                                                  |
| `ariaHidden(hidden?)`                                 | 设置 `aria-hidden`。                                                                                                      |
| `on(type, listener, options?)`                        | 绑定永久构建时监听器 — 生命周期等同于元素本身。适用于构造函数中的 shadow DOM 内部元素。                                   |
| `listen(manager, type, handler, options?)`            | 将监听器注册到 `EventManager`，由 manager 统一管理生命周期。适用于 `connectedCallback` 中需要随 disconnect 清理的监听器。 |
| `delegate(manager, selector, type, handler, options?)` | 在当前元素上注册生命周期受控的事件委托监听器；handler 会收到原事件和匹配到的后代元素。                                    |
| `children(...items)` / `replaceChildren(...items)`    | 追加或替换子节点，支持 builder、元素、字符串、数组和空值。                                                                |
| `text(value)`                                         | 设置文本内容。                                                                                                            |
| `ref(holder)`                                         | 将构建出的元素保存到 `createRef()` 的 holder 中。                                                                         |
| `shadow(options?)`                                    | 挂载 Shadow Root，并返回 `ShadowBuilder`。                                                                                |
| `build()`                                             | 返回 `HTMLElement` 或 SSR mock。                                                                                          |
| `serialize()`                                         | 为 SSR 或浏览器诊断序列化元素。                                                                                           |

## 事件管理 (`builder/events.ts`)

`EventManager` 基于 `AbortController` 集中管理生命周期绑定的事件监听器。在 `disconnectedCallback` 中只需调用一次 `abort()`，而不需要逐个跟踪和删除监听器。

```ts
import { EventManager } from '@/utils/builder';
```

### Web Component 中的用法

```ts
class MyComponent extends RanElement {
  private _events = new EventManager();

  connectedCallback(): void {
    this._events
      .on(this._input, 'input', this.handleInput)
      .on(this._slot, 'slotchange', this.handleSlotChange)
      .on(this, 'click', this.handleClick, { capture: true });
  }

  disconnectedCallback(): void {
    this._events.abort(); // 一次性移除所有已注册的监听器
  }
}
```

也可以在 builder 链式调用中直接绑定到 `EventManager`（适合在 `connectedCallback` 里构建元素时使用）：

```ts
connectedCallback(): void {
  this._events = new EventManager();
  this._icon = View('r-icon')
    .class('ran-icon')
    .listen(this._events, 'click', this.handleIconClick)
    .build();
}
```

对于动态列表或操作菜单，用 `delegate()` 让一个监听器处理匹配的后代元素：

```ts
const actions = Div()
  .class('actions')
  .children(
    ButtonBuilder().attr('data-action', 'edit').text('编辑'),
    ButtonBuilder().attr('data-action', 'delete').text('删除'),
  )
  .delegate(this._events, '[data-action]', 'click', (_event, target) => {
    const action = target.getAttribute('data-action');
    this.handleAction(action);
  })
  .build();
```

### API 参考

| API                                           | 说明                                                                                          |
| :-------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| `new EventManager()`                          | 创建一个由内部 `AbortController` 驱动的事件管理器。                                           |
| `manager.on(target, type, handler, options?)` | 将监听器注册到 `target`，自动绑定到 manager 的 signal。链式调用，返回 `this`。                |
| `manager.delegate(parent, selector, type, handler, options?)` | 在 `parent` 上注册一个监听器，当事件目标或其祖先匹配 `selector` 时调用 `handler`。 |
| `manager.abort()`                             | 移除所有已注册的监听器，并重置内部 `AbortController`，支持在下次 `connectedCallback` 中复用。 |
| `manager.signal`                              | 底层 `AbortSignal` — 需要绕过链式 API 时，可直接传给 `addEventListener` 的 options。          |

### `.on()` 与 `.listen()` 的选择

|              | `ElementBuilder.on()`     | `EventManager.on()` / `.listen()`  |
| ------------ | ------------------------- | ---------------------------------- |
| **注册时机** | 构建时（constructor）     | 连接时（connectedCallback）        |
| **移除时机** | 元素被 GC 时自动释放      | 调用 `manager.abort()` 时          |
| **适用场景** | shadow DOM 内部静态监听器 | 需要随 disconnect 清理的任何监听器 |

## 响应式原语 (`builder/signal.ts`)

细粒度响应式，设计参考 SwiftUI `@Observable` 和 Solid.js signals。在 `createEffect` 或 `computed` 中读取 signal 会自动建立依赖关系，无需手动订阅。

```ts
import { signal, createEffect, computed, batch } from '@/utils/builder';
```

**核心模型 — 与 SwiftUI 的 `View = f(State)` 同一思路，并借鉴 Solid.js 补充两个正确性改进：**

```
signal()       ≈  @State / @Observable 属性
createEffect() ≈  SwiftUI body（自动追踪；重新执行前清理过期订阅）
computed()     ≈  Swift computed property（派生值，自动缓存）
batch()        ≈  SwiftUI 的自动合并变更（同一事件处理器内只 flush 一次）
```

### 用法

```ts
const [count, setCount] = signal(0);
const doubled = computed(() => count() * 2);

// DOM 结构只构建一次
const countEl = Span().build();
const doubleEl = Span().build();

// Effect 驱动 DOM 更新 — signal 变化时自动重新执行
const disposeA = createEffect(() => {
  countEl.textContent = `${count()}`;
});
const disposeB = createEffect(() => {
  doubleEl.textContent = `${doubled()}`;
});

// 区块销毁时清理
return () => {
  disposeA();
  disposeB();
};
```

### API 参考

| API                         | 说明                                                                                                                                                                                                                                                       |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `signal(initial, options?)` | 创建响应式值，返回 `[getter, setter]`。在 effect 内读取 getter 会自动追踪依赖。                                                                                                                                                                            |
| `getter()`                  | 读取当前值，自动订阅当前 effect。                                                                                                                                                                                                                          |
| `setter(value)`             | 写入新值，通知所有依赖 effect。值未变时跳过（`Object.is`）。                                                                                                                                                                                               |
| `setter(fn)`                | 更新函数形式：接收上一个值，返回新值。                                                                                                                                                                                                                     |
| `createEffect(fn)`          | 立即执行 `fn`，其依赖的 signal 变化时自动重新执行。每次重新执行前会将自身从不再读取的 signal 中移除（过期订阅清理）。返回 `dispose` 函数，调用后停止追踪并从所有 signal 移除引用（GC 友好）。`fn` 可返回 cleanup 函数，在每次重新执行前和 dispose 时调用。 |
| `computed(fn)`              | 派生只读 signal，依赖变化时惰性重新计算。返回 getter。                                                                                                                                                                                                     |
| `batch(fn)`                 | 将多次 signal 写入合并为一次原子更新。所有依赖 effect 在 `fn` 返回后统一 flush（去重）。嵌套 `batch()` 调用会被最外层吸收。                                                                                                                                |

### `signal` 选项

| 选项     | 类型                            | 说明                                                           |
| :------- | :------------------------------ | :------------------------------------------------------------- |
| `equals` | `(prev: T, next: T) => boolean` | 自定义相等判断，返回 `true` 时跳过更新。默认使用 `Object.is`。 |

### 页面开发模式

```ts
import { signal, createEffect, computed, batch, EventManager, Div, ButtonBuilder } from '@/utils/builder';

function initCounter(container: HTMLElement) {
  const [count, setCount] = signal(0);
  const [step, setStep] = signal(1);
  const doubled = computed(() => count() * 2);
  const scope = new EventManager();

  const label = Div().class('label').build();
  const view = Div()
    .class('counter')
    .children(
      label,
      ButtonBuilder()
        .text('+')
        .listen(scope, 'click', () => setCount((n) => n + step())),
      ButtonBuilder()
        .text('重置')
        .listen(scope, 'click', () =>
          // 两次写入 → 一次 effect flush
          batch(() => {
            setCount(0);
            setStep(1);
          }),
        ),
    )
    .build();

  const dispose = createEffect(() => {
    label.textContent = `${count()} (×2 = ${doubled()})`;
  });

  container.appendChild(view);
  return () => {
    dispose();
    scope.abort();
  };
}
```

## SSR 与 Declarative Shadow DOM

RanUI 通过 `HTMLElementMock`、`defineSSR` 和 Declarative Shadow DOM 序列化支持 SSR。

### `ssr-registry.ts`

```ts
import { defineSSR, getSSRConstructor, getSSRRegistry } from '@/utils/ssr-registry';

defineSSR('r-button', Button as unknown as new () => HTMLElement);
```

| API                          | 说明                                                         |
| :--------------------------- | :----------------------------------------------------------- |
| `defineSSR(tagName, ctor)`   | 浏览器环境按需定义自定义元素；SSR 环境将构造函数存入注册表。 |
| `getSSRConstructor(tagName)` | 返回已注册的 SSR 构造函数。                                  |
| `getSSRRegistry()`           | 返回 SSR 构造函数 Map。                                      |

### `ssr.ts`

将 RanUI 组件实例渲染为包含 Shadow Tree 的 HTML 字符串。

```ts
import { Button } from '@/components/button';
import { renderToString } from '@/utils/ssr';

const btn = new Button();
btn.setAttribute('effect', 'true');
const html = renderToString(btn);
// 输出：<r-button effect="true"><template shadowrootmode="closed">...</template></r-button>
```

组件构造函数应使用 `ensureShadowRoot`，这样浏览器初始化时可以复用已存在的 Declarative Shadow DOM root。

`RanElement` 从 `utils/index.ts` 导出：

```ts
export const RanElement = HTMLElementSSR()!;
```

它在浏览器环境中解析为原生 `HTMLElement`，在 SSR 环境中解析为 `HTMLElementMock`。

## 主题工具 (`theme.ts`)

```ts
import {
  clearThemeToken,
  getTheme,
  getThemePack,
  initTheme,
  setTheme,
  setThemePack,
  setThemeToken,
  setThemeTokens,
} from '@/utils/theme';
```

| API                                   | 说明                                              |
| :------------------------------------ | :------------------------------------------------ |
| `initTheme(target?)`                  | 从 localStorage 恢复主题和主题包。                |
| `setTheme(name, target?)`             | 设置 `light`、`dark` 或 `system`。                |
| `getTheme(target?)`                   | 读取当前主题；当存储值为系统主题时返回 `system`。 |
| `setThemePack(name, target?)`         | 设置主题包，或通过 `default` 清除主题包。         |
| `getThemePack(target?)`               | 读取当前启用的主题包。                            |
| `setThemeToken(name, value, target?)` | 在目标元素上设置单个 CSS Token。                  |
| `clearThemeToken(name, target?)`      | 移除单个 CSS Token。                              |
| `setThemeTokens(tokens, target?)`     | 批量设置或清除 CSS Token。                        |

主题名称：

```ts
type RanThemeName = 'light' | 'dark' | 'system';
type RanThemePackName =
  | 'default'
  | 'windows-98'
  | 'windows-xp'
  | 'system-6'
  | 'wired'
  | 'paper'
  | 'pixel-retro'
  | 'neo-brutalism';
```

localStorage key：

```ts
'ran-theme';
'ran-theme-pack';
```

## 样式工具 (`style.ts`)

| API                             | 说明                                                                    |
| :------------------------------ | :---------------------------------------------------------------------- |
| `adoptStyles(root, cssText)`    | 将组件 CSS 注入 Shadow Root，并带有 constructable stylesheet 降级方案。 |
| `adoptSheetText(root, cssText)` | 注入由 `sheet` 属性传入的原始 CSS 文本。                                |

## DOM 工具 (`dom.ts`)

```ts
import { falseList, isDisabled } from '@/utils/dom';
```

| API                   | 说明                                                                    |
| :-------------------- | :---------------------------------------------------------------------- |
| `falseList`           | RanUI 布尔型属性语义中的假值：`false`、`'false'`、`null`、`undefined`。 |
| `isDisabled(element)` | 按 RanUI 布尔型属性语义读取 `disabled`。                                |
