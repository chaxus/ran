# ranui

基于 `Web Components` 的实验性组件库。组件使用 Shadow DOM 封装、CSS Token 主题体系，并提供 SSR / Declarative Shadow DOM 支持。

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/umd/shadowless/shadowless.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

**中文** | [English](./README.md)

## ⚠️ 重要说明

这是一个**实验性 UI 库**，处于早期开发阶段。虽然功能可用，但主要用于学习和实验。

**关键要点：**

- 🚧 **早期开发**: 功能仍在开发和完善中
- 🧪 **实验性**: API 可能会频繁变化
- 📚 **学习导向**: 主要用于学习 Web Components 和 UI 开发

## 特点

1. **跨框架兼容：** 与 React, Vue, Preact, SolidJS, Svelte 等兼容。可以和遵循 W3C 标准的任何 JavaScript 项目集成。
2. **原生体验：** 易于入门，像使用原生 HTML 标签一样使用 `<r-button>`、`<r-modal>` 等自定义元素。
3. **模块化设计：** 可选导入和全量导入，以增强可维护性和可伸缩性。
4. **Shadow DOM 封装：** 组件内部样式默认隔离，并通过 CSS Token、`::part()` 和 `sheet` 属性开放可控的样式覆盖能力。
5. **支持类型校验：** 基于 TypeScript 构建，具有类型支持，确保代码的健壮性和可维护性。
6. **SSR 友好：** 通过 `defineSSR`、`renderToString` 和 Declarative Shadow DOM 支持服务端渲染场景。
7. **无障碍：** ARIA 角色/状态、完整键盘导航、表单参与控件（`<r-checkbox>`/`<r-input>`/`<r-select>` 可被原生 `FormData` 收集）、live-region 提示，并尊重 `prefers-reduced-motion`。

## 安装

使用 npm:

```console
npm install ranui --save
```

## 文档和示例

[See components and use examples](https://chaxus.github.io/ran/cn/src/ranui/)

### 样式定制文档

当前样式系统已统一为 CSS Token 与 `::part()` 规范。

- 样式覆盖规范：[docs/style-override.md](./docs/style-override.md)
- 完整 Token/Part 清单（自动生成）: [docs/style-tokens-parts.md](./docs/style-tokens-parts.md)
- 面向使用方的公开样式 API（自动生成）: [docs/style-tokens-public.md](./docs/style-tokens-public.md)
- 公开 Token 过滤配置：[docs/style-token-filter.json](./docs/style-token-filter.json)

可通过以下命令刷新样式文档：

```bash
pnpm doc:style
```

### 主题与主题包

RanUI 支持亮色、暗色与系统主题，并提供多个 CSS-only 主题包。

```ts
import { initTheme, setTheme, setThemePack, setThemeToken } from 'ranui';
import 'ranui/theme-packs/pixel-retro';

initTheme();
setTheme('system');
setThemePack('pixel-retro');
setThemeToken('--ran-color-primary', '#2563eb');
```

可用主题包包括 `windows-98`、`windows-xp`、`system-6`、`wired`、`paper`、`pixel-retro`、`neo-brutalism`。使用 `setThemePack('default')` 可恢复默认主题包。

## 引入方式

支持按需导入，以显著减少包体积大小

```js
import 'ranui/button';
```

如果遇到样式问题，可以选择手动导入样式文件

```js
import 'ranui/style';
```

如果遇到类型问题，可以选择手动导入类型文件

```ts
import 'ranui/typings';
// 或者
import 'ranui/dist/index.d.ts';
// 或者
import 'ranui/type';
// 或者
import 'ranui/dist/typings';
```

并不是都要，选一个能生效的就行

也支持全量导入

```ts
import 'ranui';
```

- ES module

```js
import 'ranui';
```

或者

```js
import 'ranui/button';
```

- UMD, IIFE, CJS

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>
```

### 无构建工具场景（静态页 / CDN）

按页面用到的组件数量选择分发方式：

| 场景                         | 推荐方式                                | 原因                                      |
| ---------------------------- | --------------------------------------- | ----------------------------------------- |
| 只用 1–2 个组件，一行 script | 按组件 IIFE：`dist/iife/<name>.iife.js` | 自包含，无需模块语法                      |
| 用多个组件                   | 按组件 ES 模块：`dist/<name>.js`        | 共享 runtime chunk 由浏览器模块图自动去重 |
| 全都要                       | 全量包：`dist/index.iife.js`            | 一个文件注册所有组件                      |
| 项目里有构建工具             | npm 引入：`import 'ranui/<name>'`       | 可摇树，共享一份 runtime                  |

按组件 IIFE——一行引入、零构建：

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/select.iife.js" defer></script>
```

每个 IIFE 内联了自己的内部依赖（如 `select` 内含 `icon`）；元素注册有守卫，多个文件共享依赖时同时加载是安全的——但每个文件都带一份共享 runtime。页面需要多个组件时，建议改用 ES 模块，浏览器会自动去重：

```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/button.js';
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/select.js';
</script>
```

## 使用方式

它是基于`Web Components`的组件，你可以不用关注框架就可以使用它。

在大多数情况下，您可以像使用本地 `div` 标签一样使用它

下面是一些例子：

- html
- js
- jsx
- vue
- tsx

### html

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>

<body>
  <r-button>Button</r-button>
</body>
```

### js

```js
import 'ranui';

const Button = document.createElement('r-button');
Button.textContent = 'this is button text';
document.body.appendChild(Button);
```

### jsx

```jsx
import 'ranui';

const App = () => {
  return (
    <>
      <r-button>Button</r-button>
    </>
  );
};
```

### vue

```vue
<template>
  <r-button></r-button>
</template>
<script>
import 'ranui';
</script>
```

### tsx

```tsx
import 'ranui/button';

const Button = () => {
  return (
    <div>
      <r-button type="primary">button</r-button>
    </div>
  );
};
```

### Message 位置与容器配置

`window.message` 现已支持自定义顶部偏移、层级和挂载容器：

```ts
import 'ranui/message';

const customRoot = document.getElementById('custom-message-root');

window.message?.success({
  content: '保存成功',
  duration: 2000,
  top: 24,
  zIndex: 3000,
  getContainer: () => customRoot,
});
```

`top` 支持 `number | string`（`24` 会转成 `24px`，`'2rem'` 会保留原单位）。

`zIndex` 支持 `number | string`。

`getContainer` 需要返回 `HTMLElement`；未传时默认挂载到 `document.body`。

### 响应式原语

`signal`、`createEffect`、`computed`、`batch` 与 DOM builder 一起提供，用于在无框架依赖的情况下构建响应式页面区块。设计参考 SwiftUI 的 `@Observable`，并借鉴 Solid.js 补充了两个正确性改进：effect 重新执行前自动清理过期订阅；`batch()` 将多次 signal 写入合并为一次 effect flush，与 SwiftUI 自动合并变更的行为对齐。

```ts
import { signal, createEffect, computed, batch, EventManager, Div, ButtonBuilder } from 'ranui/builder';

function initCounter(container: HTMLElement) {
  const [count, setCount] = signal(0);
  const [step, setStep] = signal(1);
  const doubled = computed(() => count() * 2);
  const scope = new EventManager();

  const label = Div().build();
  const view = Div()
    .children(
      label,
      ButtonBuilder()
        .text('+')
        .listen(scope, 'click', () => setCount((n) => n + step())),
      ButtonBuilder()
        .text('重置')
        .listen(
          scope,
          'click',
          () =>
            batch(() => {
              setCount(0);
              setStep(1);
            }), // 两次写入 → 一次 flush
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
  }; // 区块销毁时清理
}
```

详细 API 请参考 [工具文档](./utils/README.zh-CN.md)。

### 路由

RanUI 内置客户端路由，提供声明式组件和 JavaScript API 两种方式。

**声明式组件：**

```html
<r-router>
  <nav>
    <r-link href="/">首页</r-link>
    <r-link href="/about">关于</r-link>
  </nav>

  <r-route path="/" exact><h2>首页</h2></r-route>
  <r-route path="/about"><h2>关于</h2></r-route>
  <r-route path="/users/:id"><h2>用户详情</h2></r-route>
</r-router>
```

**JavaScript API，含导航守卫：**

```ts
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history',
  routes: [
    { path: '/', exact: true, meta: { title: '首页' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both'
});

router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) next('/login');
  else next();
});

router.push('/users/42');
```

纯 MPA 站点（无需 JS router）可使用 `enableMpaViewTransitions()` 注入 `@view-transition { navigation: auto }`。共享元素过渡动画通过标准 `view-transition-name` CSS 属性实现。

```ts
import { enableMpaViewTransitions } from 'ranui';
enableMpaViewTransitions();
```

完整 API（守卫、`onPageSwap`/`onPageReveal`、元素级动画命名）请参考 [路由文档](https://chaxus.github.io/ran/cn/src/ranui/router/)。

### SSR & Builder (推荐)

对于需要服务端渲染 (SSR) 或更声明式构建 UI 的场景，RanUI 内部使用 `builder`、SSR registry 与 Declarative Shadow DOM。组件会通过 `ensureShadowRoot` 复用已有 Shadow Root，并通过 `ensureShadowElement` 保持初始化幂等。

源码内的 SSR 渲染示例：

```ts
import { Button } from '@/components/button';
import { renderToString } from '@/utils/ssr';

const button = new Button();
button.setAttribute('effect', 'true');

// 输出包含 Declarative Shadow DOM 的 HTML 字符串
const html = renderToString(button);
```

更多细节请查看 [Utility Documentation](./utils/README.md)。

## 组件开发约定

新增或维护组件时请遵循当前包内约定：

- 组件继承 `RanElement`，不要直接继承浏览器环境下的 `HTMLElement`。
- 使用 `ensureShadowRoot` 创建或复用 Shadow Root，不要直接调用 `attachShadow`。
- 使用 `ensureShadowElement` 构建 Shadow DOM 子树，保证重复构造时幂等。
- `observedAttributes` 包含 `sheet`，并通过 `syncSheetAttribute` 同步组件级样式覆盖。
- `attributeChangedCallback` 首行使用 `if (old === next) return;` 避免重复同步。
- 使用 `defineSSR('r-name', Component)` 注册组件，而不是直接调用 `customElements.define`。
- 在 `index.ts` 中同时添加类型导出和副作用导入；在 `vite.config.ts`、`package.json` 中补齐独立入口与导出。
- 在 `connectedCallback` 中使用 `@/utils/builder` 导出的 `EventManager` 管理生命周期事件；在 `disconnectedCallback` 中调用 `manager.abort()` 一次清理所有监听器，不要逐个调用 `removeEventListener`。

## 贡献

我们欢迎学习者和开发者的贡献！这是一个实验性项目，请对开发过程保持耐心。

## 贡献者

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Meta

[LICENSE (MIT)](/LICENSE)
