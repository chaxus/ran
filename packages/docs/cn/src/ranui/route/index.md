---
description: '一个路由出口元素，仅当当前路径匹配其 path 模式时显示插槽内容，配合 r-router 使用。'
---

# Route 路由出口

一个路由出口元素。放置在 [`r-router`](../router/) 内部时，当前路径匹配其 `path` 模式则
显示插槽内容，否则隐藏。

> **适用场景**：当你需要一个只在当前路径匹配某个模式（支持 `:param` 与 `*`）时才显示内容的路由出口时，把 `<r-route>` 放进 `<r-router>` 里，即可搭建一个客户端视图切换器。

## 快速开始

### 基础用法

`r-route` 的 `path` 为 `/` 时匹配默认路径，因此它的内容会独立渲染出来：

<r-route path="/">
  <p>当前路径匹配时显示该内容。</p>
</r-route>

```xml
<r-route path="/">
  <p>当前路径匹配时显示该内容。</p>
</r-route>
```

### 在路由器中使用

在 [`r-router`](../router/) 内部使用时，多个路由充当一个 switch 开关：路由器会在每次导航时同步每个 `r-route` 子元素，显示 `path` 匹配的那个，隐藏其余的：

```xml
<r-router>
  <r-route path="/" exact><h2>首页</h2></r-route>
  <r-route path="/about"><h2>关于</h2></r-route>
  <r-route path="/users/:id"><h2>用户资料</h2></r-route>
</r-router>
```

`r-router` 容器以及 `createRouter` / `RouterCore` 的 JavaScript API（导航、守卫、视图过渡）
在 [Router 页面](../router/) 中有详细说明。

## API 参考

### 属性

| 属性     | 类型                     | 默认值  | 说明                                             |
| -------- | ------------------------ | ------- | ------------------------------------------------ |
| `path`   | `string`                 | `'/'`   | 用于匹配当前路径的模式。支持 `:param` 分段和 `*` |
| `exact`  | `boolean`                | `false` | 只读。存在 `exact` 属性时，要求路径完全匹配      |
| `params` | `Record<string, string>` | `{}`    | 只读。从当前匹配中捕获到的参数                   |
| `sheet`  | `string`                 | `''`    | 注入到组件 Shadow DOM 的 CSS                     |

### 路径匹配 `path`

`path` 会按 `/` 拆分，并逐段编译成正则表达式：

- 以 `:` 开头的分段捕获一个具名参数（匹配一个路径分段）
- `*` 分段匹配剩余的任意路径
- 其它分段按字面量匹配

不加 `exact` 时，该模式会以**前缀**的方式匹配路径（允许有后续分段）。加了 `exact` 后，只接受完全匹配。

```
/users            匹配 /users、/users/42、/users/42/profile
/users (exact)    仅匹配 /users
/users/:id        捕获 :id → params.id
/*                匹配一切
```

从只读的 `params` 属性读取捕获到的参数（每个值都经过 `decodeURIComponent` 解码）：

```js
const route = document.querySelector('r-route');
route.params; // 例如 { id: '42' }
```

### 精确匹配 `exact`

布尔属性。存在时，出口仅匹配完全一致的路径（不做前缀匹配）：`path="/users" exact`
匹配 `/users`，但不匹配 `/users/42`。

```xml
<r-route path="/" exact><h2>首页</h2></r-route>
```

### 外部 CSS `sheet`

注入到组件 shadow DOM 的 CSS，与其它所有 ranui 组件的 `sheet` 约定一致。

### 插槽

默认（匿名）插槽承载路由激活时显示的内容。当路径不匹配时，宿主会加上 `hidden` 属性，
内容不再显示。

```xml
<r-route path="/about">
  <!-- 默认插槽：仅当 /about 处于激活状态时显示 -->
  <h2>关于</h2>
</r-route>
```

## 事件

### `routematch`

当该出口变为激活状态（其 `path` 匹配当前路径）时触发。该事件会**冒泡**。
`event.detail` 为 `{ path, params }`：

```xml
<r-route path="/users/:id"><h2>用户资料</h2></r-route>
```

```js
document.querySelector('r-route').addEventListener('routematch', (e) => {
  console.log(e.detail.path, e.detail.params); // '/users/42', { id: '42' }
});
```

## 样式定制

`r-route` 不暴露任何 `::part()` 句柄，也没有专属的 `--ran-route-*` CSS 变量。宿主是一个
普通的 `display: block` 元素，隐藏时折叠为 `display: none`。如需定制，可使用 `sheet` 属性
或直接为宿主设置样式。

通过 `import 'ranui'`（注册全部组件）或独立子路径 `import 'ranui/route'` 引入。

## 最佳实践

- **挂载在 `r-router` 内部**：只有当 `r-route` 拥有 [`r-router`](../router/) 祖先节点来同步它时，它才会在导航时切换。
- **给根路径加上 `exact`**：给 `path="/"` 添加 `exact` 属性，避免它前缀匹配到其它所有路由。
- **从具体到通用排序**：把兜底的 `path="/*"` 路由放在最后，因为非 `exact` 路由会匹配自己的前缀。
- **读取 `params`，不要自行解析 URL**：用 `:param` 捕获动态分段，然后从 `params` 属性读取。
- **通过 `routematch` 响应激活**：使用会冒泡的 `routematch` 事件，在路由被激活时触发数据加载。
