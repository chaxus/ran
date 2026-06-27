# Router 路由

用于单页应用的客户端路由。提供声明式 HTML 组件和 JavaScript API，支持导航守卫、View Transitions 动画过渡以及跨文档（MPA）场景。

## 快速开始

完整示例：路由配置、组件挂载、权限守卫、SPA 过渡动画。

```js
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history',
  viewTransition: 'spa',
  routes: [
    { path: '/', exact: true, meta: { title: '首页' } },
    { path: '/dashboard', meta: { requiresAuth: true, title: '仪表盘' } },
    { path: '/login', meta: { title: '登录' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
});

// 权限守卫
router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});

// 更新页面标题 + 埋点
router.afterEach((to) => {
  document.title = to.meta?.title ?? '应用';
});
router.onRouteChange((to) => {
  analytics.track(to.fullPath);
});
```

```html
<r-router>
  <nav>
    <r-link href="/">首页</r-link>
    <r-link href="/dashboard">仪表盘</r-link>
  </nav>

  <r-route path="/" exact><h2>首页</h2></r-route>
  <r-route path="/dashboard"><h2>仪表盘</h2></r-route>
  <r-route path="/login"><h2>登录</h2></r-route>
  <r-route path="/users/:id"><h2>用户详情</h2></r-route>
</r-router>
```

```css
/* SPA 淡入淡出过渡 */
@keyframes fade-in  { from { opacity: 0; } }
@keyframes fade-out { to   { opacity: 0; } }

::view-transition-old(root) { animation: 200ms ease-out fade-out; }
::view-transition-new(root) { animation: 200ms ease-in  fade-in; }
```

## 组件

### `r-router`

容器组件。监听 `popstate` 事件，并在每次导航时同步所有子 `r-route` 元素的显隐状态。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'history' \| 'hash'` | `'history'` | History API 模式 |
| `base` | `string` | `''` | 基础路径前缀，会从所有路径中去除 |
| `sheet` | `string` | `''` | 注入到 Shadow DOM 的 CSS |

#### 事件

| 事件 | Detail | 说明 |
| --- | --- | --- |
| `routechange` | `{ path: string }` | 每次路由更新后触发 |

### `r-route`

当前路径匹配 `path` 时显示其插槽内容，否则隐藏。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `path` | `string` | `'/'` | 匹配模式，支持 `:param` 参数段和 `*` 通配符 |
| `exact` | `boolean` | `false` | 是否要求精确匹配（不允许前缀匹配） |
| `sheet` | `string` | `''` | 注入到 Shadow DOM 的 CSS |

#### 事件

| 事件 | Detail | 说明 |
| --- | --- | --- |
| `routematch` | `{ path, params }` | 当此路由被激活时触发 |

#### 路径模式示例

```
/users              匹配 /users、/users/42、/users/42/profile
/users (exact)      只匹配 /users
/users/:id          捕获 :id，可通过 params.id 读取
/*                  匹配一切路径
```

### `r-link`

导航链接。对同源路径阻止默认跳转，优先调用 `RouterCore.push/replace`（如果 router 已初始化），否则向上冒泡派发 `ran-navigate` 事件。

外部链接（`http://`、`//`、`mailto:`、`tel:`）保持普通 `<a>` 行为。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `href` | `string` | `''` | 目标路径 |
| `replace` | `boolean` | `false` | 替换当前历史记录而非新增 |
| `sheet` | `string` | `''` | 注入到 Shadow DOM 的 CSS |

```html
<r-link href="/about">关于</r-link>
<r-link href="/settings" replace>设置</r-link>
<r-link href="https://github.com">GitHub ↗</r-link>
```

## JavaScript API

### `createRouter(config?)`

创建并注册全局 `RouterCore` 实例。在应用启动时调用一次，应早于任何 `r-router` 元素挂载。

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `'history' \| 'hash'` | `'history'` | History API 模式 |
| `base` | `string` | `''` | 基础路径前缀，会从所有内部路径中去除 |
| `routes` | `RouteConfig[]` | `[]` | 路由配置列表 |
| `viewTransition` | `boolean \| ViewTransitionMode` | `false` | 启用 View Transitions；`true` 等同于 `'spa'` |

```js
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history',       // 'history'（默认）| 'hash'
  base: '/app',          // 从所有内部路径中去除 '/app' 前缀
  routes: [
    { path: '/', exact: true, meta: { title: '首页' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both' | false
});
```

### `RouterCore`

`createRouter` 返回的实例，包含所有导航方法、钩子和属性。

| 名称 | 签名 / 类型 | 说明 |
| --- | --- | --- |
| `push(path)` | `(path: string) => Promise<void>` | 导航并新增历史记录 |
| `replace(path)` | `(path: string) => Promise<void>` | 导航并替换当前历史记录 |
| `back()` | `() => void` | `history.back()` |
| `forward()` | `() => void` | `history.forward()` |
| `go(delta)` | `(delta: number) => void` | `history.go(delta)` |
| `beforeEach(guard)` | `(guard: NavigationGuard) => () => void` | 注册导航守卫，返回取消订阅函数 |
| `afterEach(handler)` | `(handler: RouteChangeHandler) => () => void` | 导航后钩子，DOM 更新后执行，返回取消订阅函数 |
| `onRouteChange(handler)` | `(handler: RouteChangeHandler) => () => void` | 订阅每次路由变化，返回取消订阅函数 |
| `onPageSwap(handler)` | `(handler: Function) => () => void` | 跨文档 `pageswap` 事件，仅 MPA 模式有效 |
| `onPageReveal(handler)` | `(handler: Function) => () => void` | 跨文档 `pagereveal` 事件，仅 MPA 模式有效 |
| `destroy()` | `() => void` | 移除所有监听器和注入的 CSS |
| `currentRoute` | `RouteLocation \| null` | 当前路由位置对象 |
| `mode` | `'history' \| 'hash'` | History 模式 |
| `base` | `string` | 基础路径前缀 |
| `routes` | `RouteConfig[]` | 已注册的路由配置 |

```js
router.push('/users/42');
router.replace('/login');
router.back();
router.go(-2);
```

### `useRouter()`

返回当前激活的 `RouterCore` 实例，如果未调用 `createRouter` 则返回 `null`。

```js
import { useRouter } from 'ranui';

const router = useRouter();
router?.push('/about');
```

## 导航守卫

守卫按注册顺序依次执行，在导航提交前运行。调用 `next()` 放行，`next(false)` 取消，`next('/path')` 重定向。

```js
const unsubscribe = router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});

// 不再需要时移除守卫
unsubscribe();
```

`afterEach` 和 `onRouteChange` 在导航完成后执行，适合更新页面标题和上报埋点：

```js
router.afterEach((to, from) => {
  document.title = to.meta?.title ?? '应用';
});

router.onRouteChange((to, from) => {
  analytics.track(to.fullPath);
});
```

## View Transitions 过渡动画

利用浏览器原生的 [View Transitions API](https://developer.mozilla.org/zh-CN/docs/Web/API/View_Transition_API) 实现路由切换动画。

### 三种模式对比

| 模式 | Chrome | 触发时机 | 是否需要 JS |
| --- | --- | --- | --- |
| `'spa'` | 111+ | `router.push()` / `r-link` 点击 | 是 |
| `'mpa'` | 126+ | 任意 `<a>` 跳转、表单提交、`location.href` | 否 |
| `'both'` | 111+ / 126+ | 以上全部 | 可选 |

### SPA 模式

```js
const router = createRouter({ viewTransition: 'spa' }); // 或 true
```

每次调用 `router.push()` / `router.replace()` 时，DOM 更新会被包裹在 `document.startViewTransition()` 中执行。不支持时自动降级为同步更新（Chrome 111+）。

配合 CSS 定义动画效果：

```css
@keyframes fade-in  { from { opacity: 0; } }
@keyframes fade-out { to   { opacity: 0; } }

/* 默认交叉淡入淡出 */
::view-transition-old(root) { animation: 200ms ease-out fade-out; }
::view-transition-new(root) { animation: 200ms ease-in  fade-in; }
```

### MPA 模式

```js
const router = createRouter({ viewTransition: 'mpa' });
```

向 `<head>` 注入 `@view-transition { navigation: auto }`，令所有同源全页面跳转自动产生过渡效果（Chrome 126+）。每个页面无需额外 JS。

不使用 router 的纯 MPA 站点：

```js
import { enableMpaViewTransitions } from 'ranui';

const cleanup = enableMpaViewTransitions();
// cleanup() 可在需要时移除注入的 <style>
```

**MPA 生命周期事件：**

```js
// pageswap 在旧页面卸载前触发
router.onPageSwap((e) => {
  const type = e.activation?.navigationType; // 'push' | 'replace' | 'traverse'
  if (type === 'traverse') e.viewTransition?.skipTransition();
});

// pagereveal 在新页面首次渲染前触发
router.onPageReveal((e) => {
  console.log('新页面已就绪');
});
```

### 同时启用

```js
const router = createRouter({ viewTransition: 'both' });
```

SPA 导航使用 `startViewTransition()`，全页面跳转使用 `@view-transition` CSS 规则。这是 Astro 的思路——有 JS 时做 SPA 过渡，没有 JS 时靠 CSS 兜底。

## `view-transition-name` — 共享元素过渡

`view-transition-name` 是让**特定元素**（而非整个视口）在两个页面间产生位移动画的关键属性。浏览器会捕获元素在两侧的位置和尺寸，并自动生成补间动画——这就是 [Chrome Profiles 演示](https://view-transitions.chrome.dev/profiles/mpa/) 中卡片飞入效果的实现原理。

### 基础用法

在起点和终点页面给"同一个元素"设置相同的名称：

```html
<!-- 列表页 -->
<div class="card" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <span>张三</span>
</div>
```

```html
<!-- 详情页 -->
<div class="profile-header" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <h1>张三</h1>
</div>
```

浏览器会自动将卡片从列表位置动画到详情位置，产生形变过渡效果。

### 列表中的动态命名

同一页面内 `view-transition-name` 必须唯一。使用元素 ID 作为名称的一部分：

```css
/* CSS 方案 */
.card[data-id="1"]  { view-transition-name: card-1; }
.card[data-id="42"] { view-transition-name: card-42; }
```

```js
// JS 方案 — 导航前动态设置
function navigateToProfile(id) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  card.style.viewTransitionName = `profile-${id}`;
  router.push(`/profiles/${id}`);
}
```

在目标页面，需要在首次渲染前（同步）设置匹配名称：

```js
const id = router.currentRoute?.params.id;
document.querySelector('.profile-header').style.viewTransitionName = `profile-${id}`;
```

### 方向性滑动过渡

通过 `beforeEach` 守卫给 `<html>` 加 `data-*` 属性，再配合 CSS 实现前进/后退不同方向的动画：

```js
const pages = ['/', '/step-1', '/step-2', '/step-3'];

router.beforeEach((to, from, next) => {
  const toIdx   = pages.indexOf(to.path);
  const fromIdx = pages.indexOf(from?.path ?? '');
  document.documentElement.dataset.navDir =
    toIdx >= fromIdx ? 'forward' : 'back';
  next();
});
```

```css
@keyframes slide-from-right { from { translate: 100% 0; } }
@keyframes slide-from-left  { from { translate: -100% 0; } }
@keyframes slide-to-right   { to   { translate: 100% 0; } }
@keyframes slide-to-left    { to   { translate: -100% 0; } }

[data-nav-dir='forward']::view-transition-old(root) {
  animation: 300ms ease slide-to-left;
}
[data-nav-dir='forward']::view-transition-new(root) {
  animation: 300ms ease slide-from-right;
}
[data-nav-dir='back']::view-transition-old(root) {
  animation: 300ms ease slide-to-right;
}
[data-nav-dir='back']::view-transition-new(root) {
  animation: 300ms ease slide-from-left;
}
```

多元素独立动画和退出过渡：给多个元素分别设置不同的 `view-transition-name` 即可让它们独立过渡；设为 `none` 则可排除某个元素不参与过渡（如 `.sidebar { view-transition-name: none; }`）。

## SSR / SSG

所有 browser API（`window`、`history`、`location`）均有调用守卫，在非浏览器环境下不会执行。SSR 中调用 `router.push()` / `router.replace()` 会跳过 `history` 操作，但导航守卫和钩子仍会正常执行，可用于服务端的路由逻辑和数据预取。

## 类型参考

```ts
type ViewTransitionMode = 'spa' | 'mpa' | 'both';

interface RouterConfig {
  mode?: 'history' | 'hash';
  base?: string;
  routes?: RouteConfig[];
  viewTransition?: boolean | ViewTransitionMode;
}

interface RouteConfig {
  path: string;
  exact?: boolean;
  meta?: Record<string, unknown>;
  children?: RouteConfig[];
}

interface RouteLocation {
  path: string;                    // 例如 '/users/42'
  params: Record<string, string>;  // 例如 { id: '42' }
  query: Record<string, string>;   // 例如 { tab: 'profile' }
  fullPath: string;                // 例如 '/users/42?tab=profile'
}

type NavigationGuard = (
  to: RouteLocation,
  from: RouteLocation | null,
  next: (redirect?: string | false) => void,
) => void;

type RouteChangeHandler = (to: RouteLocation, from: RouteLocation | null) => void;
```
