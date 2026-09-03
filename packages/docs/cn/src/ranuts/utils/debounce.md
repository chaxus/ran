# debounce

防抖：函数被高频触发时，只在**停止触发 `ms` 毫秒后**执行最后一次。适用于只关心最终状态的场景，
比如输入联想、窗口 resize、自动保存。

若中间过程值也需要，请用 [throttle](./throttle)。

## API

### debounce(fn, ms?)

#### 参数

| 参数 | 说明             | 类型       | 默认值 |
| ---- | ---------------- | ---------- | ------ |
| `fn` | 要防抖的函数     | `Function` | 必填   |
| `ms` | 静默时长（毫秒） | `number`   | `500`  |

#### 返回

防抖后的函数，保留调用处的 `this` 与**最后一次**的参数，并附带：

| 成员        | 说明                                       | 类型            |
| ----------- | ------------------------------------------ | --------------- |
| `cancel()`  | 取消挂起的调用                             | `() => void`    |
| `flush()`   | 立即执行挂起的调用（如提交表单前强制落盘） | `() => void`    |
| `pending()` | 是否有调用在等待                           | `() => boolean` |

## 示例

```js
import { debounce } from 'ranuts';

const save = debounce((draft) => api.save(draft), 800);
input.addEventListener('input', (e) => save(e.target.value));

form.addEventListener('submit', () => save.flush()); // 别丢掉最后一次输入
onUnmount(() => save.cancel());
```

## 注意

1. **只执行最后一次**，参数取最后一次调用的参数。
2. **`this` 取自调用处**：`obj.handler()` 能拿到 `obj`。
3. **销毁时务必 `cancel()`**，否则挂起的定时器会在已销毁的上下文里执行。
4. **类型完整**：参数与返回值类型从 `fn` 推导。
