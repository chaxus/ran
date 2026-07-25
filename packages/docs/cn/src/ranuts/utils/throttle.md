# throttle

节流：函数被高频触发时，按固定间隔最多执行一次。首次立即执行（leading），窗口内的最后一次
在窗口结束时补上（trailing），保证最终状态不会丢。

适用于滚动、鼠标移动、拖拽这类需要**持续反馈**的场景。若只关心最终值（搜索联想、自动保存），
请用 [debounce](./debounce)。

## API

### throttle(fn, delay?)

#### 参数

| 参数    | 说明             | 类型       | 默认值   |
| ------- | ---------------- | ---------- | -------- |
| `fn`    | 要节流的函数     | `Function` | 必填     |
| `delay` | 最小间隔（毫秒） | `number`   | `300`    |

#### 返回

节流后的函数，保留调用处的 `this` 与参数，并附带：

| 成员        | 说明                   | 类型            |
| ----------- | ---------------------- | --------------- |
| `cancel()`  | 取消尾部挂起的那次调用 | `() => void`    |
| `pending()` | 是否有尾部调用在等待   | `() => boolean` |

## 示例

```js
import { throttle } from 'ranuts';

const onScroll = throttle(() => update(window.scrollY), 100);
window.addEventListener('scroll', onScroll);

// 销毁时：移除监听 + 取消尾部挂起的调用
window.removeEventListener('scroll', onScroll);
onScroll.cancel();
```

## 注意

1. **首尾都执行**：立即跑一次，窗口结束时再用最新参数补一次。
2. **`this` 与参数**均从调用处透传。
3. **哪都能跑**：用裸 `setTimeout`，Node / Web Worker / SSR 均可。
4. **每次调用 `throttle()` 拥有独立窗口**，两个节流函数不会互相干扰。
5. **销毁时务必 `cancel()`**，否则尾部调用会在已销毁的上下文里执行。

::: warning 0.3 已移除
`generateThrottle()` 已删除。它返回的工厂所产出的全部函数**共用同一个定时器与时间戳**，
导致两个互不相干的节流函数互相压制。请把
`const g = generateThrottle(); const f = g(fn, delay)` 换成 `throttle(fn, delay)`。
:::
