# 监控注入钩子

拦截 `console`、`fetch`、`XMLHttpRequest`、点击与未捕获错误 —— 用于监控后端、调试浮层或测试。

**每一个都会返回卸载函数，请保留并调用它。** 注入全局却没有回退路径是一扇单向门：测试无法自我清理，
热更新会在已注入的全局上再注入一层，直到每次调用要穿过十几层包装、每个事件被上报 N 次。

## API

| 函数                         | 注入对象                             | 返回          |
| ---------------------------- | ------------------------------------ | ------------- |
| `handleConsole(hook)`        | `console.log/info/warn/error/assert` | `restore`     |
| `handleFetchHook(options)`   | `window.fetch`                       | `restore`     |
| `handleXhrHook(options)`     | `XMLHttpRequest#open` / `#send`      | `restore`     |
| `handleError(hook)`          | `error` + `unhandledrejection`       | `unsubscribe` |
| `handleClick(hook)`          | document 点击（捕获阶段）            | `unsubscribe` |
| `replaceOld(obj, key, wrap)` | 任意对象上的任意属性                 | `restore`     |

`handleFetchHook` / `handleXhrHook` 接收 `{ requestHook, responseHook, errorHook }`。

## 示例

```js
import { handleConsole, handleError, handleFetchHook } from 'ranuts';

const teardown = [
  handleConsole((type, ...args) => send({ type, args })),
  handleError((error) => send({ type: 'error', error: String(error) })),
  handleFetchHook({ errorHook: (url, error) => send({ type: 'fetchError', url }) }),
];

// 销毁时（热更新、路由切换、测试清理）
teardown.forEach((off) => off());
```

## 注意

1. **原有行为完全保留**。响应照常透传，错误照常重新抛出，console 照常打印。
2. **`replaceOld` 的 restore 只撤销自己那一层**。如果之后有别的层叠加在上面，
   盲目写回原值会把那一层静默卸载，所以它选择放弃。
3. **`handleXhrHook` 注入的是原型**，对所有实例生效；其监听用 `{ once: true }` 注册，
   复用同一个 XHR 对象也不会越积越多。
4. **不要把 console 上报到一个会打日志的后端** —— 钩子会被它自己产生的那次调用触发。
   （这也是 `Monitor` 的 `console` 通道默认关闭的原因。）

::: warning 0.3 变更
这些函数此前都返回 `void`，没有卸载途径。现在统一返回卸载函数；老调用点照常工作，直接开始使用即可。
:::
