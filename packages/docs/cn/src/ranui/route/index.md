# Route 路由出口

一个路由出口元素。放置在 [`r-router`](../router/) 内部时，当前路径匹配其 `path` 模式则
显示插槽内容，否则隐藏。路由器会在每次导航时同步每个 `r-route` 子元素。

## 代码演示

<r-route path="/">
  <p>当前路径匹配时显示该内容。</p>
</r-route>

```xml
<r-route path="/">
  <p>当前路径匹配时显示该内容。</p>
</r-route>
```

在路由器中使用时，多个路由充当一个 switch 开关：

```xml
<r-router>
  <r-route path="/" exact><h2>首页</h2></r-route>
  <r-route path="/about"><h2>关于</h2></r-route>
  <r-route path="/users/:id"><h2>用户资料</h2></r-route>
</r-router>
```

`r-router` 容器以及 `createRouter` / `RouterCore` 的 JavaScript API（导航、守卫、视图过渡）
在 [Router 页面](../router/) 中有详细说明。

## 属性

### `path`

该出口用于匹配当前路径的模式，默认为 `/`。以 `:` 开头的分段会捕获一个具名参数，
`*` 匹配剩余的任意分段：

```
/users            匹配 /users、/users/42、/users/42/profile
/users/:id        捕获 :id → params.id
/*                匹配一切
```

从 `params` 属性（只读的 `Record<string, string>`）读取捕获到的参数。

### `exact`

布尔属性。存在时，出口仅匹配完全一致的路径（不做前缀匹配）—— `path="/users" exact`
匹配 `/users`，但不匹配 `/users/42`。

### `sheet`

注入到组件 shadow DOM 的 CSS，与其它所有 ranui 组件的 `sheet` 约定一致。

## 事件

### `routematch`

当该出口变为激活状态（其 `path` 匹配当前路径）时触发。该事件会**冒泡**。
`event.detail` 为 `{ path, params }`：

```js
document.querySelector('r-route').addEventListener('routematch', (e) => {
  console.log(e.detail.path, e.detail.params); // '/users/42', { id: '42' }
});
```

## 插槽

### （默认）

默认的匿名插槽承载路由激活时显示的内容。当路径不匹配时，宿主会被设置为 `hidden`，
内容不再显示。

## 样式定制

`r-route` 不暴露任何 `::part()` 句柄，也没有专属的 `--ran-route-*` CSS 变量。宿主是一个
普通的 `display: block` 元素，隐藏时折叠为 `display: none`。如需定制，可使用 `sheet` 属性
或直接为宿主设置样式。

通过 `import 'ranui'`（注册全部组件）或独立子路径 `import 'ranui/route'` 引入。
